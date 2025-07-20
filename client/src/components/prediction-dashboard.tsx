import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart3, TrendingUp, Waves, Trees, Flame, Wind, Brain, Sparkles, Zap } from "lucide-react";
import { api } from "@/lib/api";
import type { PredictionResponse } from "@shared/schema";

interface PredictionDashboardProps {
  videoId?: number;
  predictionId?: number;
}

type TabType = "temporal" | "spatial" | "uncertainty" | "comparative";

export function PredictionDashboard({ videoId, predictionId }: PredictionDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("temporal");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Query for predictions
  const { data: predictions, isLoading } = useQuery({
    queryKey: videoId ? ["/api/video", videoId, "predictions"] : ["/api/prediction", predictionId],
    enabled: !!(videoId || predictionId),
  });

  const currentPrediction = Array.isArray(predictions) ? predictions[0] : predictions;

  useEffect(() => {
    setLastUpdated(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
  }, [currentPrediction]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-32 h-4" />
          </div>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full h-24" />
            ))}
          </div>
          <Skeleton className="w-full h-80" />
        </CardContent>
      </Card>
    );
  }

  if (!currentPrediction) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Predictions Available</h3>
            <p className="text-gray-500">Upload a video to start generating predictions.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tabs = [
    { id: "temporal", label: "Temporal Analysis" },
    { id: "spatial", label: "Spatial Distribution" },
    { id: "uncertainty", label: "Uncertainty Bounds" },
    { id: "comparative", label: "Algorithm Comparison" },
  ] as const;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BarChart3 className="text-primary mr-2" size={20} />
            <h3 className="text-xl font-semibold">Prediction Results</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Last updated:</span>
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{lastUpdated}</span>
          </div>
        </div>
        
        {/* Prediction Score Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {currentPrediction.scores.co2 && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {currentPrediction.scores.co2.score.toFixed(1)}
                  </div>
                  <div className="text-sm text-green-600">CO₂ Flow Prediction</div>
                </div>
                <Wind className="text-green-600" size={20} />
              </div>
              <div className="mt-2 text-xs text-green-600">
                <span className="font-medium">±{((1 - currentPrediction.scores.co2.confidence) * 5).toFixed(1)}%</span> confidence interval
              </div>
            </div>
          )}
          
          {currentPrediction.scores.heat && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-700">
                    {currentPrediction.scores.heat.score.toFixed(1)}
                  </div>
                  <div className="text-sm text-orange-600">Heat Flux Analysis</div>
                </div>
                <Flame className="text-orange-600" size={20} />
              </div>
              <div className="mt-2 text-xs text-orange-600">
                <span className="font-medium">±{((1 - currentPrediction.scores.heat.confidence) * 5).toFixed(1)}%</span> confidence interval
              </div>
            </div>
          )}
          
          {currentPrediction.scores.ocean && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-700">
                    {currentPrediction.scores.ocean.score.toFixed(1)}
                  </div>
                  <div className="text-sm text-blue-600">Ocean Currents</div>
                </div>
                <Waves className="text-blue-600" size={20} />
              </div>
              <div className="mt-2 text-xs text-blue-600">
                <span className="font-medium">±{((1 - currentPrediction.scores.ocean.confidence) * 5).toFixed(1)}%</span> confidence interval
              </div>
            </div>
          )}
          
          {currentPrediction.scores.deforest && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-700">
                    {currentPrediction.scores.deforest.score.toFixed(1)}
                  </div>
                  <div className="text-sm text-purple-600">Deforestation Risk</div>
                </div>
                <Trees className="text-purple-600" size={20} />
              </div>
              <div className="mt-2 text-xs text-purple-600">
                <span className="font-medium">±{((1 - currentPrediction.scores.deforest.confidence) * 5).toFixed(1)}%</span> confidence interval
              </div>
            </div>
          )}
        </div>
        
        {/* Visualization Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                className={`border-b-2 rounded-none px-1 py-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab.id as TabType)}
              >
                {tab.label}
              </Button>
            ))}
          </nav>
        </div>
        
        {/* Chart Area */}
        <div className="h-80 mb-6">
          {activeTab === "temporal" && currentPrediction.temporalData && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentPrediction.temporalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Prediction Confidence (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                
                {currentPrediction.scores.co2 && (
                  <Line 
                    type="monotone" 
                    dataKey="co2" 
                    stroke="hsl(142, 76%, 36%)" 
                    strokeWidth={2}
                    name="CO₂ Concentration"
                  />
                )}
                {currentPrediction.scores.heat && (
                  <Line 
                    type="monotone" 
                    dataKey="heat" 
                    stroke="hsl(21, 90%, 48%)" 
                    strokeWidth={2}
                    name="Heat Flux"
                  />
                )}
                {currentPrediction.scores.ocean && (
                  <Line 
                    type="monotone" 
                    dataKey="ocean" 
                    stroke="hsl(214, 100%, 59%)" 
                    strokeWidth={2}
                    name="Ocean Current Velocity"
                  />
                )}
                {currentPrediction.scores.deforest && (
                  <Line 
                    type="monotone" 
                    dataKey="deforest" 
                    stroke="hsl(271, 91%, 65%)" 
                    strokeWidth={2}
                    name="Deforestation Risk"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
          
          {activeTab !== "temporal" && (
            <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  {activeTab === "spatial" && "Spatial Distribution Analysis"}
                  {activeTab === "uncertainty" && "Uncertainty Bounds Visualization"}
                  {activeTab === "comparative" && "Algorithm Performance Comparison"}
                </h4>
                <p className="text-gray-500">Visualization coming soon</p>
              </div>
            </div>
          )}
        </div>
        
        {/* AI Analysis Integration */}
        {currentPrediction.aiAnalyses && currentPrediction.aiAnalyses.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4">
            {currentPrediction.aiAnalyses.map((analysis, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  {analysis.provider === "openai" && <Brain className="text-green-600 text-sm mr-1" size={16} />}
                  {analysis.provider === "gemini" && <Sparkles className="text-blue-600 text-sm mr-1" size={16} />}
                  {analysis.provider === "vellum" && <Zap className="text-purple-600 text-sm mr-1" size={16} />}
                  <h5 className="font-medium text-sm capitalize">
                    {analysis.provider} {analysis.provider === "openai" ? "Analysis" : analysis.provider === "gemini" ? "Insights" : "Summary"}
                  </h5>
                  {analysis.confidence && (
                    <span className="ml-auto text-xs text-gray-500">
                      {(analysis.confidence * 100).toFixed(0)}% confidence
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {analysis.analysis}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
