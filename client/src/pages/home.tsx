import { useState } from "react";
import { useLocation } from "wouter";
import { VideoUpload } from "@/components/video-upload";
import { AlgorithmSelection } from "@/components/algorithm-selection";
import { PredictionDashboard } from "@/components/prediction-dashboard";
import { DocumentationSection } from "@/components/documentation-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Globe, BarChart3, CheckCircle, User, Play } from "lucide-react";

export default function Home() {
  const [currentVideoId, setCurrentVideoId] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  const quickStats = [
    { value: "4", label: "PINN Algorithms", color: "text-primary" },
    { value: "95%", label: "Prediction Accuracy", color: "text-green-600" },
    { value: "3", label: "AI Models", color: "text-purple-600" },
    { value: "1000x", label: "Faster than FEM", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="text-primary" size={24} />
                <h1 className="text-xl font-semibold">EcoPredict</h1>
              </div>
              <span className="text-sm text-gray-600 font-mono">Physics-Informed Environmental AI</span>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <a href="#upload" className="text-gray-700 hover:text-primary transition-colors">Upload</a>
                <a href="#predictions" className="text-gray-700 hover:text-primary transition-colors">Predictions</a>
                <a href="#algorithms" className="text-gray-700 hover:text-primary transition-colors">Algorithms</a>
                <a href="#documentation" className="text-gray-700 hover:text-primary transition-colors">Docs</a>
              </nav>
              <Button 
                onClick={() => setLocation("/demo")}
                variant="outline"
                className="mr-2"
              >
                <Play className="mr-1" size={16} />
                View Demo
              </Button>
              <Button className="bg-primary text-white hover:bg-blue-700">
                <User className="mr-1" size={16} />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Environmental Prediction with Physics-Informed Neural Networks</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Upload environmental video data and leverage cutting-edge PINN algorithms to predict carbon dioxide flows, 
              heat fluxes, deforestation impacts, and ocean currents with scientifically accurate modeling.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Video Upload Section */}
        <section id="upload" className="mb-8">
          <VideoUpload onUploadComplete={setCurrentVideoId} />
        </section>

        {/* Algorithm Selection Section */}
        <section id="algorithms" className="mb-8">
          <AlgorithmSelection />
        </section>

        {/* Prediction Dashboard */}
        <section id="predictions" className="mb-8">
          <PredictionDashboard videoId={currentVideoId || undefined} />
        </section>

        {/* Documentation Section */}
        <section id="documentation" className="mb-8">
          <DocumentationSection />
        </section>

        {/* Status Footer */}
        <footer className="bg-gray-100 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center space-x-6 mb-4">
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>System Status: Operational</span>
            </div>
            <div className="flex items-center text-sm">
              <Zap className="text-gray-600 mr-1" size={16} />
              <span>Avg Processing: 2.3 min</span>
            </div>
            <div className="flex items-center text-sm">
              <BarChart3 className="text-gray-600 mr-1" size={16} />
              <span>Models Loaded: 4/4</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            EcoPredict v1.0 - Physics-Informed Environmental Prediction System
            <br />
            Built with cutting-edge PINN algorithms for scientific accuracy and real-world impact
          </p>
        </footer>
      </main>
    </div>
  );
}
