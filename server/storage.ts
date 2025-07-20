import { 
  videos, 
  predictions, 
  aiAnalyses, 
  algorithms,
  type Video, 
  type InsertVideo,
  type Prediction,
  type InsertPrediction,
  type AiAnalysis,
  type InsertAiAnalysis,
  type Algorithm,
  type InsertAlgorithm
} from "@shared/schema";

export interface IStorage {
  // Videos
  createVideo(video: InsertVideo): Promise<Video>;
  getVideo(id: number): Promise<Video | undefined>;
  updateVideoStatus(id: number, status: string, processedAt?: Date): Promise<Video | undefined>;
  
  // Predictions
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getPrediction(id: number): Promise<Prediction | undefined>;
  getPredictionsByVideoId(videoId: number): Promise<Prediction[]>;
  
  // AI Analyses
  createAiAnalysis(analysis: InsertAiAnalysis): Promise<AiAnalysis>;
  getAiAnalysesByPredictionId(predictionId: number): Promise<AiAnalysis[]>;
  
  // Algorithms
  createAlgorithm(algorithm: InsertAlgorithm): Promise<Algorithm>;
  getAlgorithms(): Promise<Algorithm[]>;
  getAlgorithm(id: number): Promise<Algorithm | undefined>;
  getAlgorithmByName(name: string): Promise<Algorithm | undefined>;
}

export class MemStorage implements IStorage {
  private videos: Map<number, Video> = new Map();
  private predictions: Map<number, Prediction> = new Map();
  private aiAnalyses: Map<number, AiAnalysis> = new Map();
  private algorithms: Map<number, Algorithm> = new Map();
  private currentVideoId = 1;
  private currentPredictionId = 1;
  private currentAiAnalysisId = 1;
  private currentAlgorithmId = 1;

  constructor() {
    this.initializeAlgorithms();
  }

  private initializeAlgorithms() {
    const defaultAlgorithms: InsertAlgorithm[] = [
      {
        name: "climode",
        displayName: "ClimODE",
        description: "Physics-informed climate modeling with advection principles",
        category: "climate",
        accuracy: 92.0,
        speed: "1000x faster than FEM",
        physicsConstraints: {
          equations: ["∂u/∂t + ∇·(uv) = 0", "∇·v = ∇·F(u)"],
          conservation: ["mass", "momentum"],
          advection: true
        },
        parameters: {
          layers: "8-10 hidden",
          neurons: "200+ per layer",
          optimizer: "Adam + L-BFGS",
          collocationPoints: 20000
        },
        isActive: true
      },
      {
        name: "pinn-ffht",
        displayName: "PINN-FFHT",
        description: "Fluid flow and heat transfer without simulation data",
        category: "thermal",
        accuracy: 89.0,
        speed: "Real-time",
        physicsConstraints: {
          equations: ["∇²T + Q = 0", "∇·(ρvT) = ∇·(k∇T)"],
          conservation: ["energy", "mass"],
          heatTransfer: true
        },
        parameters: {
          boundaryConditions: ["Dirichlet", "Neumann", "mixed"],
          coordinates: ["Cartesian", "cylindrical"],
          dynamicBalancing: true
        },
        isActive: true
      },
      {
        name: "pcnn-tsa",
        displayName: "PCNN-TSA",
        description: "Ocean current prediction with Navier-Stokes constraints",
        category: "oceanographic",
        accuracy: 94.0,
        speed: "8-day forecast",
        physicsConstraints: {
          equations: ["∇·v = 0", "∂v/∂t + (v·∇)v = -∇p/ρ + ν∇²v + f"],
          conservation: ["momentum", "mass"],
          coriolisEffect: true
        },
        parameters: {
          rmse: "≤ 0.0014",
          forecastHorizon: "8 days",
          spatialAttention: true,
          temporalSequence: true
        },
        isActive: true
      },
      {
        name: "land-atmosphere-pinn",
        displayName: "Land-Atmosphere PINN",
        description: "Deforestation impact with E3SM land model integration",
        category: "ecological",
        accuracy: 87.0,
        speed: "Regional scale",
        physicsConstraints: {
          equations: ["∂ET/∂t = f(LAI, T, RH)", "∂T/∂t = f(albedo, roughness)"],
          conservation: ["energy", "water"],
          landAtmosphereCoupling: true
        },
        parameters: {
          evapotranspiration: true,
          surfaceEnergyBalance: true,
          precipitationFeedback: true,
          fluxnetCalibration: 29
        },
        isActive: true
      }
    ];

    defaultAlgorithms.forEach(algo => this.createAlgorithm(algo));
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentVideoId++;
    const video: Video = {
      ...insertVideo,
      id,
      uploadedAt: new Date(),
      processedAt: null,
      status: "uploaded",
      analysisPriority: insertVideo.analysisPriority || "balanced",
      predictionHorizon: insertVideo.predictionHorizon || 7
    };
    this.videos.set(id, video);
    return video;
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async updateVideoStatus(id: number, status: string, processedAt?: Date): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (video) {
      const updatedVideo = { ...video, status, processedAt: processedAt || null };
      this.videos.set(id, updatedVideo);
      return updatedVideo;
    }
    return undefined;
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const id = this.currentPredictionId++;
    const prediction: Prediction = {
      ...insertPrediction,
      id,
      createdAt: new Date(),
      co2Score: insertPrediction.co2Score ?? null,
      co2Confidence: insertPrediction.co2Confidence ?? null,
      heatScore: insertPrediction.heatScore ?? null,
      heatConfidence: insertPrediction.heatConfidence ?? null,
      oceanScore: insertPrediction.oceanScore ?? null,
      oceanConfidence: insertPrediction.oceanConfidence ?? null,
      deforestScore: insertPrediction.deforestScore ?? null,
      deforestConfidence: insertPrediction.deforestConfidence ?? null,
      physicsConstraints: insertPrediction.physicsConstraints ?? null,
      temporalData: insertPrediction.temporalData ?? null,
      spatialData: insertPrediction.spatialData ?? null,
      uncertaintyBounds: insertPrediction.uncertaintyBounds ?? null
    };
    this.predictions.set(id, prediction);
    return prediction;
  }

  async getPrediction(id: number): Promise<Prediction | undefined> {
    return this.predictions.get(id);
  }

  async getPredictionsByVideoId(videoId: number): Promise<Prediction[]> {
    return Array.from(this.predictions.values()).filter(p => p.videoId === videoId);
  }

  async createAiAnalysis(insertAiAnalysis: InsertAiAnalysis): Promise<AiAnalysis> {
    const id = this.currentAiAnalysisId++;
    const analysis: AiAnalysis = {
      ...insertAiAnalysis,
      id,
      createdAt: new Date(),
      confidence: insertAiAnalysis.confidence ?? null,
      processingTime: insertAiAnalysis.processingTime ?? null
    };
    this.aiAnalyses.set(id, analysis);
    return analysis;
  }

  async getAiAnalysesByPredictionId(predictionId: number): Promise<AiAnalysis[]> {
    return Array.from(this.aiAnalyses.values()).filter(a => a.predictionId === predictionId);
  }

  async createAlgorithm(insertAlgorithm: InsertAlgorithm): Promise<Algorithm> {
    const id = this.currentAlgorithmId++;
    const algorithm: Algorithm = {
      ...insertAlgorithm,
      id,
      isActive: insertAlgorithm.isActive ?? true
    };
    this.algorithms.set(id, algorithm);
    return algorithm;
  }

  async getAlgorithms(): Promise<Algorithm[]> {
    return Array.from(this.algorithms.values()).filter(a => a.isActive);
  }

  async getAlgorithm(id: number): Promise<Algorithm | undefined> {
    return this.algorithms.get(id);
  }

  async getAlgorithmByName(name: string): Promise<Algorithm | undefined> {
    return Array.from(this.algorithms.values()).find(a => a.name === name);
  }
}

export const storage = new MemStorage();
