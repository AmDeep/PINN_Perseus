import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, FileVideo, BarChart3, Presentation } from "lucide-react";
import DemoShowcase from "@/components/demo-showcase";
import RiskVisualization from "@/components/risk-visualization";
import PresentationMaterials from "@/components/presentation-materials";
import WebsiteFlowRecorder from "@/components/website-flow-recorder";

export default function DemoPage() {
  const [, setLocation] = useLocation();
  const [activeDemo, setActiveDemo] = useState<string>("showcase");

  const handleStartDemo = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setLocation("/")}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to EcoPredict
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                EcoPredict Demo Center
              </h1>
              <p className="text-gray-600">
                Interactive demonstrations, sample analyses, and presentation materials
              </p>
            </div>
          </div>
        </div>

        {/* Demo Navigation */}
        <Card className="border-2 border-blue-200 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Demonstration Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="showcase" className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Interactive Demo</span>
                </TabsTrigger>
                <TabsTrigger value="visualization" className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Risk Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="presentation" className="flex items-center space-x-2">
                  <Presentation className="w-4 h-4" />
                  <span>Presentation Kit</span>
                </TabsTrigger>
                <TabsTrigger value="recording" className="flex items-center space-x-2">
                  <FileVideo className="w-4 h-4" />
                  <span>Video Recording</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="showcase" className="mt-6">
                <DemoShowcase onStartDemo={handleStartDemo} />
              </TabsContent>

              <TabsContent value="visualization" className="mt-6">
                <RiskVisualization />
              </TabsContent>

              <TabsContent value="presentation" className="mt-6">
                <PresentationMaterials />
              </TabsContent>

              <TabsContent value="recording" className="mt-6">
                <WebsiteFlowRecorder />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Interactive Demo</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Experience real-time environmental analysis with Amazon deforestation case study
              </p>
              <ul className="text-xs space-y-1 text-left">
                <li>• 45-second aerial footage analysis</li>
                <li>• 4 PINN algorithms working simultaneously</li>
                <li>• Multi-AI insights generation</li>
                <li>• Real-time progress visualization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-amber-500 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Risk Visualization</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Interactive mapping of environmental risks and impact predictions
              </p>
              <ul className="text-xs space-y-1 text-left">
                <li>• Satellite overlay risk mapping</li>
                <li>• 5 critical risk areas identified</li>
                <li>• Species and ecosystem impact assessment</li>
                <li>• Animated risk progression visualization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                <Presentation className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Presentation Kit</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Complete presentation package for stakeholders and technical audiences
              </p>
              <ul className="text-xs space-y-1 text-left">
                <li>• Interactive 7-slide PowerPoint</li>
                <li>• Professional presentation script</li>
                <li>• Technical documentation package</li>
                <li>• Downloadable assets and resources</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
                <FileVideo className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Video Recording</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Professional video recording guide and script for website demonstration
              </p>
              <ul className="text-xs space-y-1 text-left">
                <li>• 7-step website flow guide</li>
                <li>• Professional recording setup</li>
                <li>• Narration scripts and timing</li>
                <li>• Technical recording specifications</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Analyze Your Environmental Data?
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Upload your own environmental videos and experience the power of Physics-Informed Neural Networks 
              for real-time environmental disaster prediction and analysis.
            </p>
            <Button 
              onClick={handleStartDemo}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Your Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}