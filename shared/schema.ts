import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  status: text("status").notNull().default("uploaded"), // uploaded, processing, completed, failed
  environmentalFocus: text("environmental_focus").notNull(),
  analysisPriority: text("analysis_priority").notNull().default("balanced"),
  predictionHorizon: integer("prediction_horizon").notNull().default(7),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id).notNull(),
  algorithm: text("algorithm").notNull(),
  co2Score: real("co2_score"),
  co2Confidence: real("co2_confidence"),
  heatScore: real("heat_score"),
  heatConfidence: real("heat_confidence"),
  oceanScore: real("ocean_score"),
  oceanConfidence: real("ocean_confidence"),
  deforestScore: real("deforest_score"),
  deforestConfidence: real("deforest_confidence"),
  overallScore: real("overall_score").notNull(),
  physicsConstraints: jsonb("physics_constraints"),
  temporalData: jsonb("temporal_data"),
  spatialData: jsonb("spatial_data"),
  uncertaintyBounds: jsonb("uncertainty_bounds"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiAnalyses = pgTable("ai_analyses", {
  id: serial("id").primaryKey(),
  predictionId: integer("prediction_id").references(() => predictions.id).notNull(),
  provider: text("provider").notNull(), // openai, gemini, vellum
  analysis: text("analysis").notNull(),
  confidence: real("confidence"),
  processingTime: integer("processing_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const algorithms = pgTable("algorithms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  accuracy: real("accuracy").notNull(),
  speed: text("speed").notNull(),
  physicsConstraints: jsonb("physics_constraints").notNull(),
  parameters: jsonb("parameters").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Insert schemas
export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  uploadedAt: true,
  processedAt: true,
  status: true,
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
});

export const insertAiAnalysisSchema = createInsertSchema(aiAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertAlgorithmSchema = createInsertSchema(algorithms).omit({
  id: true,
});

// Types
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type AiAnalysis = typeof aiAnalyses.$inferSelect;
export type InsertAiAnalysis = z.infer<typeof insertAiAnalysisSchema>;
export type Algorithm = typeof algorithms.$inferSelect;
export type InsertAlgorithm = z.infer<typeof insertAlgorithmSchema>;

// Request/Response schemas
export const uploadVideoRequestSchema = z.object({
  environmentalFocus: z.enum(["carbon-dioxide", "heat-flux", "ocean-currents", "deforestation", "multi-parameter"]),
  analysisPriority: z.enum(["accuracy", "speed", "balanced"]),
  predictionHorizon: z.number().min(1).max(30),
});

export const predictionResponseSchema = z.object({
  id: z.number(),
  videoId: z.number(),
  algorithm: z.string(),
  scores: z.object({
    co2: z.object({ score: z.number(), confidence: z.number() }).optional(),
    heat: z.object({ score: z.number(), confidence: z.number() }).optional(),
    ocean: z.object({ score: z.number(), confidence: z.number() }).optional(),
    deforest: z.object({ score: z.number(), confidence: z.number() }).optional(),
    overall: z.number(),
  }),
  temporalData: z.array(z.object({
    day: z.number(),
    co2: z.number().optional(),
    heat: z.number().optional(),
    ocean: z.number().optional(),
    deforest: z.number().optional(),
  })),
  aiAnalyses: z.array(z.object({
    provider: z.string(),
    analysis: z.string(),
    confidence: z.number().optional(),
  })),
  createdAt: z.string(),
});

export type UploadVideoRequest = z.infer<typeof uploadVideoRequestSchema>;
export type PredictionResponse = z.infer<typeof predictionResponseSchema>;
