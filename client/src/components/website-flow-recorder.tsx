import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Download, Video, Mic, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RecordingStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  action: string;
}

const demoSteps: RecordingStep[] = [
  {
    id: "intro",
    title: "Welcome to EcoPredict",
    description: "Introduction to the environmental prediction platform",
    duration: 15,
    action: "Navigate to homepage and overview features"
  },
  {
    id: "upload",
    title: "Video Upload Process",
    description: "Demonstrate video upload with environmental focus selection",
    duration: 20,
    action: "Upload sample environmental video file"
  },
  {
    id: "algorithms",
    title: "Algorithm Selection",
    description: "Show PINN algorithm options and their specializations",
    duration: 15,
    action: "Select and configure algorithms for analysis"
  },
  {
    id: "processing",
    title: "Real-time Analysis",
    description: "Watch PINN algorithms process environmental data",
    duration: 30,
    action: "Monitor processing progress and algorithm execution"
  },
  {
    id: "results",
    title: "AI-Powered Insights",
    description: "Review multi-AI analysis from OpenAI, Gemini, and Vellum",
    duration: 25,
    action: "Explore prediction results and confidence scores"
  },
  {
    id: "visualization",
    title: "Risk Assessment",
    description: "Interactive environmental risk mapping and impact zones",
    duration: 20,
    action: "Navigate risk visualization and impact metrics"
  },
  {
    id: "documentation",
    title: "Technical Resources",
    description: "Access API documentation and research references",
    duration: 15,
    action: "Browse documentation and implementation guides"
  }
];

export default function WebsiteFlowRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedSteps, setRecordedSteps] = useState<RecordingStep[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setCurrentStep(0);
    setRecordingTime(0);
    setRecordedSteps([]);
    
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setRecordedSteps(prev => [...prev, demoSteps[currentStep]]);
      setCurrentStep(currentStep + 1);
    } else {
      // Recording complete
      setRecordedSteps(prev => [...prev, demoSteps[currentStep]]);
      stopRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const downloadScript = () => {
    const script = `
# EcoPredict Website Flow Demo Script

## Total Duration: ${formatTime(recordingTime)}
## Steps Recorded: ${recordedSteps.length}

${recordedSteps.map((step, index) => `
### Step ${index + 1}: ${step.title}
**Duration:** ${step.duration} seconds
**Description:** ${step.description}
**Action:** ${step.action}

**Narration Script:**
"${step.description}. ${step.action}. This demonstrates ${step.title.toLowerCase()} functionality."

---
`).join('')}

## Technical Setup:
- Resolution: 1920x1080 (Full HD)
- Frame Rate: 30fps
- Audio: Clear narration with ambient background
- Browser: Chrome/Firefox with responsive design
- Screen Recording: OBS Studio or similar professional tool

## Post-Production Notes:
- Add smooth transitions between steps
- Include zoom effects for important UI elements
- Highlight click actions with visual indicators
- Add professional intro/outro sequences
- Include background music at 20% volume
`;

    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EcoPredict_Demo_Script.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-6 h-6 text-purple-600" />
            <span>Website Flow Recorder</span>
          </CardTitle>
          <p className="text-gray-600">
            Professional demo recording guide for EcoPredict website functionality
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Controls */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
                <span className="font-medium">
                  {isRecording ? 'Recording' : 'Ready to Record'}
                </span>
              </div>
              {isRecording && (
                <div className="text-lg font-mono">
                  {formatTime(recordingTime)}
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              {!isRecording ? (
                <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <Button onClick={nextStep} variant="outline">
                    Next Step ({currentStep + 1}/{demoSteps.length})
                  </Button>
                  <Button onClick={stopRecording} variant="secondary">
                    <Square className="w-4 h-4 mr-2" />
                    Stop Recording
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Current Step Display */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">
                    Step {currentStep + 1}: {demoSteps[currentStep]?.title}
                  </h3>
                  <Badge variant="secondary" className="bg-white text-purple-600">
                    {demoSteps[currentStep]?.duration}s
                  </Badge>
                </div>
                <p className="mb-3 text-lg">{demoSteps[currentStep]?.description}</p>
                <div className="flex items-center space-x-2 text-yellow-200">
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">Action: {demoSteps[currentStep]?.action}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Demo Steps Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-4">Demo Flow Steps</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {demoSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      index === currentStep && isRecording
                        ? 'border-purple-500 bg-purple-50'
                        : recordedSteps.some(rs => rs.id === step.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {step.duration}s
                        </Badge>
                        {recordedSteps.some(rs => rs.id === step.id) && (
                          <span className="text-green-600 text-xs">✓</span>
                        )}
                        {index === currentStep && isRecording && (
                          <span className="text-purple-600 text-xs">📹</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Recording Guidelines</h3>
              <div className="space-y-3">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Mic className="w-4 h-4 mr-2 text-blue-600" />
                      Narration Tips
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Speak clearly and at moderate pace</li>
                      <li>• Explain each action before performing it</li>
                      <li>• Highlight key features and benefits</li>
                      <li>• Use professional, accessible language</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Video className="w-4 h-4 mr-2 text-green-600" />
                      Video Quality
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Record at 1920x1080 resolution</li>
                      <li>• Maintain 30fps for smooth playback</li>
                      <li>• Use cursor highlighting for clicks</li>
                      <li>• Add zoom effects for important details</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Settings className="w-4 h-4 mr-2 text-purple-600" />
                      Technical Setup
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Clear browser cache before recording</li>
                      <li>• Close unnecessary browser tabs</li>
                      <li>• Ensure stable internet connection</li>
                      <li>• Test audio levels before starting</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {recordedSteps.length > 0 && (
              <Button onClick={downloadScript} className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download Recording Script ({recordedSteps.length} steps)
              </Button>
            )}
            <Button 
              onClick={() => window.open('/assets/Video_Recording_Setup_Guide.md', '_blank')}
              variant="outline"
              className="border-purple-500 text-purple-600 hover:bg-purple-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Setup Guide
            </Button>
            <Button 
              onClick={() => window.open('/assets/EcoPredict_Presentation.html', '_blank')}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <Play className="w-4 h-4 mr-2" />
              View Interactive PPT
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}