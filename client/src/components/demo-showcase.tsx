import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Leaf, Thermometer, Waves, TreePine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DemoShowcaseProps {
  onStartDemo: () => void;
}

interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  insights: string[];
  riskAreas: string[];
}

const analysisSteps: AnalysisStep[] = [
  {
    id: "co2",
    title: "CO₂ Emission Analysis",
    description: "Physics-informed modeling of carbon release from deforestation",
    icon: <Leaf className="w-6 h-6" />,
    color: "text-green-600",
    insights: [
      "Estimated 414 tons CO₂ released from 2.3 hectares",
      "180 tons per hectare emission rate detected",
      "Biomass decomposition accelerating in cleared areas"
    ],
    riskAreas: [
      "Primary forest clearings (highest emission zones)",
      "Soil carbon exposure areas",
      "Recently burned vegetation zones"
    ]
  },
  {
    id: "heat",
    title: "Heat Transfer Dynamics",
    description: "Thermal analysis of microclimate disruption",
    icon: <Thermometer className="w-6 h-6" />,
    color: "text-red-600",
    insights: [
      "2.4°C temperature increase in cleared areas",
      "15% humidity reduction observed",
      "Heat island formation in deforested zones"
    ],
    riskAreas: [
      "Open soil exposure areas",
      "Infrastructure development zones",
      "Edge effects along forest boundaries"
    ]
  },
  {
    id: "ocean",
    title: "Hydrological Impact",
    description: "Water cycle and erosion pattern analysis",
    icon: <Waves className="w-6 h-6" />,
    color: "text-blue-600",
    insights: [
      "82% increased sedimentation risk to waterways",
      "8% precipitation pattern disruption",
      "Soil erosion affecting 1.6 hectares"
    ],
    riskAreas: [
      "Steep slope clearing areas",
      "Riverside deforestation zones",
      "Drainage pathway disruptions"
    ]
  },
  {
    id: "biodiversity",
    title: "Ecosystem Fragmentation",
    description: "Biodiversity corridor and habitat connectivity analysis",
    icon: <TreePine className="w-6 h-6" />,
    color: "text-emerald-600",
    insights: [
      "340 species potentially impacted",
      "73% habitat fragmentation detected",
      "56% connectivity loss between forest patches"
    ],
    riskAreas: [
      "Wildlife corridor disruptions",
      "Isolated forest fragments",
      "Breeding habitat separations"
    ]
  }
];

export default function DemoShowcase({ onStartDemo }: DemoShowcaseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isAnimating) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setShowInsights(true);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isAnimating]);

  const startAnalysisAnimation = () => {
    setIsAnimating(true);
    setProgress(0);
    setShowInsights(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < analysisSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
      setShowInsights(false);
    }
  };

  const currentAnalysis = analysisSteps[currentStep];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-800">
            EcoPredict Demo: Amazon Deforestation Analysis
          </CardTitle>
          <p className="text-gray-600">
            Watch how our Physics-Informed Neural Networks analyze environmental video data
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Sample Video Analysis</h3>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-700 to-green-500 opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: isAnimating ? [1, 1.1, 1] : 1,
                      opacity: isAnimating ? [0.7, 1, 0.7] : 1
                    }}
                    transition={{
                      duration: 2,
                      repeat: isAnimating ? Infinity : 0
                    }}
                    className="text-white text-center"
                  >
                    <TreePine className="w-16 h-16 mx-auto mb-2" />
                    <p className="text-sm">Amazon Basin Aerial Footage</p>
                    <Badge variant="secondary" className="mt-2">
                      45 seconds • 1920x1080 • 30fps
                    </Badge>
                  </motion.div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={startAnalysisAnimation}
                  disabled={isAnimating}
                  className="flex-1"
                >
                  {isAnimating ? "Analyzing..." : "Start Analysis"}
                </Button>
                <Button 
                  onClick={onStartDemo}
                  variant="outline"
                  className="flex-1"
                >
                  Try Your Video
                </Button>
              </div>
            </div>

            {/* Analysis Progress */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Real-time Analysis</h3>
              
              {/* Algorithm Selection */}
              <div className="grid grid-cols-2 gap-2">
                {analysisSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      index === currentStep 
                        ? 'border-blue-500 bg-blue-50' 
                        : index < currentStep 
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                    }`}
                    animate={{
                      scale: index === currentStep && isAnimating ? [1, 1.05, 1] : 1
                    }}
                    transition={{ duration: 1, repeat: index === currentStep && isAnimating ? Infinity : 0 }}
                  >
                    <div className={`flex items-center space-x-2 ${step.color}`}>
                      {step.icon}
                      <span className="text-xs font-medium">{step.title}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Progress Bar */}
              {isAnimating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing: {currentAnalysis.title}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Analysis Results */}
              <AnimatePresence>
                {showInsights && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-2">
                        <div className="flex items-center space-x-2">
                          <div className={currentAnalysis.color}>
                            {currentAnalysis.icon}
                          </div>
                          <CardTitle className="text-lg">{currentAnalysis.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Key Insights:</h4>
                          <ul className="space-y-1">
                            {currentAnalysis.insights.map((insight, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.2 }}
                                className="text-sm text-gray-700 flex items-start space-x-2"
                              >
                                <span className="text-green-500 mt-1">•</span>
                                <span>{insight}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2 flex items-center space-x-1">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span>Risk Areas:</span>
                          </h4>
                          <ul className="space-y-1">
                            {currentAnalysis.riskAreas.map((area, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.2 + 0.6 }}
                                className="text-sm text-gray-700 flex items-start space-x-2"
                              >
                                <span className="text-amber-500 mt-1">⚠</span>
                                <span>{area}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        {currentStep < analysisSteps.length - 1 && (
                          <Button 
                            onClick={nextStep}
                            size="sm" 
                            className="w-full mt-4"
                          >
                            Next Analysis: {analysisSteps[currentStep + 1].title}
                          </Button>
                        )}

                        {currentStep === analysisSteps.length - 1 && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-800 font-medium">
                              ✅ Analysis Complete! All environmental factors assessed.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}