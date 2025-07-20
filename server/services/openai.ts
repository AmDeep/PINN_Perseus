import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface OpenAIResponse {
  text: string;
  confidence?: number;
  processingTime?: number;
  metadata?: Record<string, any>;
}

export class OpenAIService {
  async analyzeEnvironmentalPrediction(
    predictionData: {
      co2Score?: number;
      heatScore?: number;
      oceanScore?: number;
      deforestScore?: number;
      algorithm: string;
      environmentalFocus: string;
    }
  ): Promise<OpenAIResponse> {
    const startTime = Date.now();
    
    try {
      const prompt = this.createEnvironmentalPrompt(predictionData);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert environmental scientist specializing in physics-informed neural networks and climate modeling. 
            Analyze prediction results with scientific rigor, focusing on physical consistency and environmental implications.
            Provide insights that would be valuable for environmental researchers and policy makers.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3,
      });

      const analysisText = response.choices[0]?.message?.content || "Analysis unavailable";
      const processingTime = Date.now() - startTime;
      
      return {
        text: analysisText,
        confidence: this.calculateConfidence(predictionData),
        processingTime,
        metadata: {
          model: "gpt-4o",
          algorithm: predictionData.algorithm,
          focus: predictionData.environmentalFocus,
          tokensUsed: response.usage?.total_tokens
        }
      };
      
    } catch (error) {
      console.error("OpenAI API error:", error);
      return {
        text: "OpenAI analysis temporarily unavailable. The physics-informed predictions remain valid based on embedded conservation laws and boundary conditions.",
        confidence: 0,
        processingTime: Date.now() - startTime,
        metadata: { error: true, message: error instanceof Error ? error.message : "Unknown error" }
      };
    }
  }

  async analyzeVideoFeatures(
    videoMetadata: {
      duration: number;
      fps: number;
      resolution: { width: number; height: number };
      environmentalFocus: string;
    },
    base64Frames?: string[]
  ): Promise<OpenAIResponse> {
    const startTime = Date.now();
    
    try {
      let messages: any[] = [
        {
          role: "system",
          content: "You are an expert in environmental video analysis and computer vision. Analyze video content for environmental indicators relevant to climate science and physics-informed modeling."
        }
      ];

      if (base64Frames && base64Frames.length > 0) {
        // Analyze key frames using vision capabilities
        messages.push({
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this environmental video focused on ${videoMetadata.environmentalFocus}. 
              Video specs: ${videoMetadata.duration}s, ${videoMetadata.fps}fps, ${videoMetadata.resolution.width}x${videoMetadata.resolution.height}.
              Identify key environmental features, patterns, and indicators relevant for physics-informed neural network analysis.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Frames[0]}`
              }
            }
          ]
        });
      } else {
        messages.push({
          role: "user",
          content: `Provide guidance for analyzing environmental video data focused on ${videoMetadata.environmentalFocus}. 
          Video specifications: Duration ${videoMetadata.duration}s, ${videoMetadata.fps}fps, Resolution ${videoMetadata.resolution.width}x${videoMetadata.resolution.height}.
          What environmental indicators should be extracted for physics-informed neural network analysis?`
        });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        max_tokens: 300,
        temperature: 0.2,
      });

      const analysisText = response.choices[0]?.message?.content || "Video analysis unavailable";
      const processingTime = Date.now() - startTime;

      return {
        text: analysisText,
        confidence: base64Frames ? 0.85 : 0.65, // Higher confidence with actual frames
        processingTime,
        metadata: {
          model: "gpt-4o",
          hasFrames: !!base64Frames,
          frameCount: base64Frames?.length || 0,
          tokensUsed: response.usage?.total_tokens
        }
      };

    } catch (error) {
      console.error("OpenAI video analysis error:", error);
      return {
        text: "Video analysis temporarily unavailable. Proceeding with physics-informed feature extraction based on environmental focus parameters.",
        confidence: 0,
        processingTime: Date.now() - startTime,
        metadata: { error: true, message: error instanceof Error ? error.message : "Unknown error" }
      };
    }
  }

  private createEnvironmentalPrompt(data: {
    co2Score?: number;
    heatScore?: number;
    oceanScore?: number;
    deforestScore?: number;
    algorithm: string;
    environmentalFocus: string;
  }): string {
    const scores = [
      data.co2Score ? `CO₂ flow: ${data.co2Score}%` : null,
      data.heatScore ? `Heat flux: ${data.heatScore}%` : null,
      data.oceanScore ? `Ocean currents: ${data.oceanScore}%` : null,
      data.deforestScore ? `Deforestation risk: ${data.deforestScore}%` : null,
    ].filter(Boolean).join(", ");

    return `Analyze environmental prediction results from ${data.algorithm} algorithm:

Prediction scores: ${scores}
Environmental focus: ${data.environmentalFocus}

Provide scientific analysis covering:
1. Physical interpretation of prediction scores
2. Environmental stability assessment based on physics-informed constraints
3. Key risk factors and early warning indicators
4. Confidence in predictions based on conservation law adherence
5. Recommended monitoring priorities

Focus on scientific accuracy and physics-based reasoning. Limit to 150 words.`;
  }

  private calculateConfidence(data: {
    co2Score?: number;
    heatScore?: number;
    oceanScore?: number;
    deforestScore?: number;
  }): number {
    const scores = [data.co2Score, data.heatScore, data.oceanScore, data.deforestScore]
      .filter((score): score is number => score !== undefined);
    
    if (scores.length === 0) return 0.5;
    
    // Higher average score and lower variance = higher confidence
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
    
    // Normalize confidence between 0.3 and 0.95
    const baseConfidence = Math.min(0.95, Math.max(0.3, avgScore / 100));
    const variancePenalty = Math.min(0.3, Math.sqrt(variance) / 100);
    
    return Math.round((baseConfidence - variancePenalty) * 100) / 100;
  }
}

export const openaiService = new OpenAIService();
