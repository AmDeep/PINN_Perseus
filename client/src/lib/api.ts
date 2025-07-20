import { apiRequest } from "./queryClient";
import type { UploadVideoRequest, PredictionResponse, Algorithm } from "@shared/schema";

export const api = {
  // Upload video for analysis
  uploadVideo: async (file: File, request: UploadVideoRequest) => {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("environmentalFocus", request.environmentalFocus);
    formData.append("analysisPriority", request.analysisPriority);
    formData.append("predictionHorizon", request.predictionHorizon.toString());

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Upload failed");
    }

    return response.json();
  },

  // Get video processing status
  getVideoStatus: async (videoId: number) => {
    const response = await apiRequest("GET", `/api/video/${videoId}/status`);
    return response.json();
  },

  // Get prediction results
  getPrediction: async (predictionId: number): Promise<PredictionResponse> => {
    const response = await apiRequest("GET", `/api/prediction/${predictionId}`);
    return response.json();
  },

  // Get predictions by video ID
  getVideoPredictions: async (videoId: number): Promise<PredictionResponse[]> => {
    const response = await apiRequest("GET", `/api/video/${videoId}/predictions`);
    return response.json();
  },

  // Get available algorithms
  getAlgorithms: async (): Promise<Algorithm[]> => {
    const response = await apiRequest("GET", "/api/algorithms");
    return response.json();
  },
};
