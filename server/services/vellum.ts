// Vellum API integration for environmental analysis
export interface VellumResponse {
  text: string;
  confidence?: number;
  metadata?: Record<string, any>;
}

export class VellumService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.VELLUM_API_KEY || process.env.VELLUM_API_KEY_ENV_VAR || "default_key";
    this.baseUrl = "https://api.vellum.ai/v1";
  }

  async analyzeEnvironmentalData(
    predictionData: {
      co2Score?: number;
      heatScore?: number;
      oceanScore?: number;
      deforestScore?: number;
      algorithm: string;
      environmentalFocus: string;
    }
  ): Promise<VellumResponse> {
    try {
      const prompt = this.createEnvironmentalPrompt(predictionData);
      
      const response = await fetch(`${this.baseUrl}/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "vellum-environmental-analysis",
          prompt: prompt,
          max_tokens: 200,
          temperature: 0.3,
          stop: ["\n\n"]
        }),
      });

      if (!response.ok) {
        throw new Error(`Vellum API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        text: data.choices?.[0]?.text?.trim() || "Analysis unavailable",
        confidence: this.calculateConfidence(predictionData),
        metadata: {
          model: "vellum-environmental-analysis",
          algorithm: predictionData.algorithm,
          focus: predictionData.environmentalFocus
        }
      };
    } catch (error) {
      console.error("Vellum API error:", error);
      return {
        text: "Environmental analysis temporarily unavailable. Please try again later.",
        confidence: 0,
        metadata: { error: true }
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
      data.co2Score ? `CO₂: ${data.co2Score}%` : null,
      data.heatScore ? `Heat: ${data.heatScore}%` : null,
      data.oceanScore ? `Ocean: ${data.oceanScore}%` : null,
      data.deforestScore ? `Deforestation: ${data.deforestScore}%` : null,
    ].filter(Boolean).join(", ");

    return `Analyze environmental prediction results using ${data.algorithm} algorithm focused on ${data.environmentalFocus}.

Prediction scores: ${scores}

Provide a concise summary of:
1. Environmental stability assessment
2. Key risk factors
3. Confidence in predictions
4. Recommended monitoring focus

Limit to 150 words, use scientific terminology appropriate for environmental researchers.`;
  }

  private calculateConfidence(data: {
    co2Score?: number;
    heatScore?: number;
    oceanScore?: number;
    deforestScore?: number;
  }): number {
    const scores = [data.co2Score, data.heatScore, data.oceanScore, data.deforestScore]
      .filter((score): score is number => score !== undefined);
    
    if (scores.length === 0) return 0;
    
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
    
    // Higher average score and lower variance = higher confidence
    return Math.min(0.95, (avgScore / 100) * (1 - Math.sqrt(variance) / 100));
  }
}

export const vellumService = new VellumService();
