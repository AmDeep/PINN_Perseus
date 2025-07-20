import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { uploadVideoRequestSchema, predictionResponseSchema } from "@shared/schema";
import { videoProcessor } from "./services/video-processor";
import { pinnAlgorithms } from "./services/pinn-algorithms";
import { openaiService } from "./services/openai";
import { geminiService } from "./services/gemini";
import { vellumService } from "./services/vellum";
import { processSampleVideo } from "./services/sample-data";

// Configure multer for video uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedMimes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, AVI, and MOV files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all available algorithms
  app.get("/api/algorithms", async (req, res) => {
    try {
      const algorithms = await storage.getAlgorithms();
      res.json(algorithms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch algorithms" });
    }
  });

  // Upload video for analysis
  app.post("/api/upload", upload.single("video"), async (req: Request & { file?: Express.Multer.File }, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
      }

      const requestData = uploadVideoRequestSchema.parse(req.body);
      
      // Create video record
      const video = await storage.createVideo({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        environmentalFocus: requestData.environmentalFocus,
        analysisPriority: requestData.analysisPriority,
        predictionHorizon: requestData.predictionHorizon,
      });

      res.json({ 
        videoId: video.id,
        message: "Video uploaded successfully. Processing will begin shortly.",
        status: "uploaded"
      });

      // Start async processing
      processVideoAsync(video.id);
      
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Upload failed" 
      });
    }
  });

  // Get video processing status
  app.get("/api/video/:id/status", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      res.json({
        id: video.id,
        status: video.status,
        processedAt: video.processedAt,
        environmentalFocus: video.environmentalFocus
      });
      
    } catch (error) {
      res.status(500).json({ message: "Failed to get video status" });
    }
  });

  // Get prediction results
  app.get("/api/prediction/:id", async (req, res) => {
    try {
      const predictionId = parseInt(req.params.id);
      const prediction = await storage.getPrediction(predictionId);
      
      if (!prediction) {
        return res.status(404).json({ message: "Prediction not found" });
      }

      const aiAnalyses = await storage.getAiAnalysesByPredictionId(predictionId);
      
      const response = {
        id: prediction.id,
        videoId: prediction.videoId,
        algorithm: prediction.algorithm,
        scores: {
          co2: prediction.co2Score ? {
            score: prediction.co2Score,
            confidence: prediction.co2Confidence || 0
          } : undefined,
          heat: prediction.heatScore ? {
            score: prediction.heatScore,
            confidence: prediction.heatConfidence || 0
          } : undefined,
          ocean: prediction.oceanScore ? {
            score: prediction.oceanScore,
            confidence: prediction.oceanConfidence || 0
          } : undefined,
          deforest: prediction.deforestScore ? {
            score: prediction.deforestScore,
            confidence: prediction.deforestConfidence || 0
          } : undefined,
          overall: prediction.overallScore,
        },
        temporalData: prediction.temporalData as any[] || [],
        aiAnalyses: aiAnalyses.map(analysis => ({
          provider: analysis.provider,
          analysis: analysis.analysis,
          confidence: analysis.confidence
        })),
        createdAt: prediction.createdAt.toISOString()
      };

      res.json(response);
      
    } catch (error) {
      res.status(500).json({ message: "Failed to get prediction" });
    }
  });

  // Get predictions by video ID
  app.get("/api/video/:id/predictions", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const predictions = await storage.getPredictionsByVideoId(videoId);
      
      const results = await Promise.all(
        predictions.map(async (prediction) => {
          const aiAnalyses = await storage.getAiAnalysesByPredictionId(prediction.id);
          
          return {
            id: prediction.id,
            videoId: prediction.videoId,
            algorithm: prediction.algorithm,
            scores: {
              co2: prediction.co2Score ? {
                score: prediction.co2Score,
                confidence: prediction.co2Confidence || 0
              } : undefined,
              heat: prediction.heatScore ? {
                score: prediction.heatScore,
                confidence: prediction.heatConfidence || 0
              } : undefined,
              ocean: prediction.oceanScore ? {
                score: prediction.oceanScore,
                confidence: prediction.oceanConfidence || 0
              } : undefined,
              deforest: prediction.deforestScore ? {
                score: prediction.deforestScore,
                confidence: prediction.deforestConfidence || 0
              } : undefined,
              overall: prediction.overallScore,
            },
            temporalData: prediction.temporalData as any[] || [],
            aiAnalyses: aiAnalyses.map(analysis => ({
              provider: analysis.provider,
              analysis: analysis.analysis,
              confidence: analysis.confidence
            })),
            createdAt: prediction.createdAt.toISOString()
          };
        })
      );

      res.json(results);
      
    } catch (error) {
      res.status(500).json({ message: "Failed to get predictions" });
    }
  });

  // Process sample video for demo
  app.post("/api/demo/sample-video", async (req, res) => {
    try {
      const result = await processSampleVideo();
      res.json({
        message: "Sample video processed successfully",
        videoId: result.videoId,
        predictionId: result.predictionId
      });
    } catch (error) {
      console.error("Sample video processing failed:", error);
      res.status(500).json({ message: "Failed to process sample video" });
    }
  });

  // Async video processing function
  async function processVideoAsync(videoId: number) {
    try {
      // Update status to processing
      await storage.updateVideoStatus(videoId, "processing");
      
      const video = await storage.getVideo(videoId);
      if (!video) return;

      // Process video with OpenCV
      const videoFeatures = await videoProcessor.processVideo(
        video.filename,
        video.environmentalFocus
      );

      // Select and run appropriate PINN algorithm
      let pinnResult;
      switch (video.environmentalFocus) {
        case "carbon-dioxide":
          pinnResult = await pinnAlgorithms.runClimODE(videoFeatures);
          break;
        case "heat-flux":
          pinnResult = await pinnAlgorithms.runPINNFFHT(videoFeatures);
          break;
        case "ocean-currents":
          pinnResult = await pinnAlgorithms.runPCNNTSA(videoFeatures);
          break;
        case "deforestation":
          pinnResult = await pinnAlgorithms.runLandAtmospherePINN(videoFeatures);
          break;
        case "multi-parameter":
          // Run all algorithms and combine results
          const [climode, ffht, pcnn, land] = await Promise.all([
            pinnAlgorithms.runClimODE(videoFeatures),
            pinnAlgorithms.runPINNFFHT(videoFeatures),
            pinnAlgorithms.runPCNNTSA(videoFeatures),
            pinnAlgorithms.runLandAtmospherePINN(videoFeatures)
          ]);
          
          pinnResult = {
            algorithm: "Multi-Algorithm Ensemble",
            scores: {
              co2: climode.scores.co2,
              heat: ffht.scores.heat,
              ocean: pcnn.scores.ocean,
              deforest: land.scores.deforest,
              overall: (
                (climode.scores.overall + ffht.scores.overall + 
                 pcnn.scores.overall + land.scores.overall) / 4
              )
            },
            temporalData: climode.temporalData.map((entry, index) => ({
              day: entry.day,
              co2: climode.temporalData[index]?.co2,
              heat: ffht.temporalData[index]?.heat,
              ocean: pcnn.temporalData[index]?.ocean,
              deforest: land.temporalData[index]?.deforest,
            })),
            physicsConstraints: {
              climode: climode.physicsConstraints,
              ffht: ffht.physicsConstraints,
              pcnn: pcnn.physicsConstraints,
              land: land.physicsConstraints
            },
            uncertaintyBounds: {
              ...climode.uncertaintyBounds,
              ...ffht.uncertaintyBounds,
              ...pcnn.uncertaintyBounds,
              ...land.uncertaintyBounds
            }
          };
          break;
        default:
          pinnResult = await pinnAlgorithms.runClimODE(videoFeatures);
      }

      // Save prediction results
      const prediction = await storage.createPrediction({
        videoId: video.id,
        algorithm: pinnResult.algorithm,
        co2Score: pinnResult.scores.co2?.score || null,
        co2Confidence: pinnResult.scores.co2?.confidence || null,
        heatScore: pinnResult.scores.heat?.score || null,
        heatConfidence: pinnResult.scores.heat?.confidence || null,
        oceanScore: pinnResult.scores.ocean?.score || null,
        oceanConfidence: pinnResult.scores.ocean?.confidence || null,
        deforestScore: pinnResult.scores.deforest?.score || null,
        deforestConfidence: pinnResult.scores.deforest?.confidence || null,
        overallScore: pinnResult.scores.overall,
        physicsConstraints: pinnResult.physicsConstraints,
        temporalData: pinnResult.temporalData,
        spatialData: null,
        uncertaintyBounds: pinnResult.uncertaintyBounds,
      });

      // Generate AI analyses in parallel
      const [openaiAnalysis, geminiAnalysis, vellumAnalysis] = await Promise.all([
        openaiService.analyzeEnvironmentalPrediction({
          co2Score: pinnResult.scores.co2?.score,
          heatScore: pinnResult.scores.heat?.score,
          oceanScore: pinnResult.scores.ocean?.score,
          deforestScore: pinnResult.scores.deforest?.score,
          algorithm: pinnResult.algorithm,
          environmentalFocus: video.environmentalFocus
        }),
        geminiService.analyzeEnvironmentalData({
          co2Score: pinnResult.scores.co2?.score,
          heatScore: pinnResult.scores.heat?.score,
          oceanScore: pinnResult.scores.ocean?.score,
          deforestScore: pinnResult.scores.deforest?.score,
          algorithm: pinnResult.algorithm,
          environmentalFocus: video.environmentalFocus
        }),
        vellumService.analyzeEnvironmentalData({
          co2Score: pinnResult.scores.co2?.score,
          heatScore: pinnResult.scores.heat?.score,
          oceanScore: pinnResult.scores.ocean?.score,
          deforestScore: pinnResult.scores.deforest?.score,
          algorithm: pinnResult.algorithm,
          environmentalFocus: video.environmentalFocus
        })
      ]);

      // Save AI analyses
      await Promise.all([
        storage.createAiAnalysis({
          predictionId: prediction.id,
          provider: "openai",
          analysis: openaiAnalysis.text,
          confidence: openaiAnalysis.confidence,
          processingTime: openaiAnalysis.processingTime
        }),
        storage.createAiAnalysis({
          predictionId: prediction.id,
          provider: "gemini",
          analysis: geminiAnalysis.text,
          confidence: geminiAnalysis.confidence,
          processingTime: geminiAnalysis.processingTime
        }),
        storage.createAiAnalysis({
          predictionId: prediction.id,
          provider: "vellum",
          analysis: vellumAnalysis.text,
          confidence: vellumAnalysis.confidence,
          processingTime: null
        })
      ]);

      // Update video status to completed
      await storage.updateVideoStatus(videoId, "completed", new Date());
      
    } catch (error) {
      console.error("Video processing error:", error);
      await storage.updateVideoStatus(videoId, "failed");
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
