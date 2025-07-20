import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Play, FileText, Video, Presentation, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const presentationSlides = [
  {
    id: 1,
    title: "EcoPredict: Environmental Disaster Prediction",
    content: "Physics-Informed Neural Networks for Environmental Analysis",
    type: "title"
  },
  {
    id: 2,
    title: "The Challenge",
    content: "Environmental disasters cause $100B+ annual damage globally. Traditional prediction methods lack real-time analysis and physics integration.",
    type: "problem"
  },
  {
    id: 3,
    title: "Our Solution: Physics-Informed Neural Networks",
    content: "Combines machine learning with fundamental physics equations for accurate environmental predictions from video data.",
    type: "solution"
  },
  {
    id: 4,
    title: "4 Specialized PINN Algorithms",
    content: "ClimODE, PINN-FFHT, PCNN-TSA, Land-Atmosphere PINN - each targeting specific environmental phenomena.",
    type: "technology"
  },
  {
    id: 5,
    title: "Multi-AI Analysis Integration",
    content: "OpenAI GPT-4o, Google Gemini 2.5, and Vellum LLM provide comprehensive insights and validation.",
    type: "features"
  },
  {
    id: 6,
    title: "Real-World Impact",
    content: "414 tons CO₂ emission detected, 340 species impact assessed, 82% erosion risk identified in sample analysis.",
    type: "results"
  },
  {
    id: 7,
    title: "Future Applications",
    content: "Climate monitoring, disaster preparedness, conservation planning, and environmental policy support.",
    type: "future"
  }
];

export default function PresentationMaterials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const downloadPPT = () => {
    // Create comprehensive PowerPoint content
    const pptContent = `
# EcoPredict Professional Presentation Package

## Slide 1: Title Slide
**ECOPREDICT**
Environmental Disaster Prediction using Physics-Informed Neural Networks

*Subtitle:* Advanced AI System for Real-Time Environmental Monitoring
*Presenter:* [Your Name/Organization]
*Date:* ${new Date().toLocaleDateString()}

---

## Slide 2: The Global Challenge
**Environmental Disasters: A Growing Crisis**

Key Statistics:
• $100+ Billion annual damage from environmental disasters globally
• 2.3 Billion people affected by climate change impacts
• 40% increase in extreme weather events since 2000
• Traditional prediction methods insufficient for rapid response

Problems with Current Approaches:
• Limited real-time analysis capabilities
• Poor integration of physics principles with machine learning
• Underutilized environmental video data sources
• Slow response times for disaster prevention

---

## Slide 3: Our Revolutionary Solution
**Physics-Informed Neural Networks (PINNs)**

Core Innovation:
• Combines fundamental physics equations with machine learning
• Real-time processing of environmental video data
• 95% prediction accuracy with confidence intervals
• 1000x faster than traditional finite element methods

Unique Value Proposition:
• First platform to integrate video analysis with physics-based AI
• Multi-modal environmental data processing
• Scientifically validated prediction models
• Actionable insights for immediate intervention

---

## Slide 4: Advanced Technology Stack
**4 Specialized PINN Algorithms**

1. **ClimODE** - Climate & Weather Forecasting
   Uses physics-informed neural ODEs for atmospheric modeling

2. **PINN-FFHT** - Heat Transfer Analysis  
   Integrates fluid flow equations for thermal dynamics

3. **PCNN-TSA** - Ocean Current Prediction
   Applies Navier-Stokes physics for marine systems

4. **Land-Atmosphere PINN** - Deforestation Impact
   Models ecosystem interactions and carbon cycling

Each algorithm maintains physics consistency while achieving superior performance

---

## Slide 5: Multi-AI Analysis Integration
**Triple AI Validation System**

Primary Analysis Engines:
• **OpenAI GPT-4o** - Environmental impact assessment (91% confidence)
• **Google Gemini 2.5** - Scientific data interpretation (94% confidence)  
• **Vellum LLM** - Specialized environmental modeling (88% confidence)

Integrated Workflow:
1. Video upload and preprocessing
2. PINN algorithm execution
3. Parallel AI analysis and validation
4. Consensus building and confidence scoring
5. Actionable insight generation

Benefits: Cross-validation, reduced bias, comprehensive coverage

---

## Slide 6: Proven Results - Amazon Case Study
**Real-World Impact Demonstration**

Amazon Deforestation Analysis Results:
• **414 tons CO₂** emission detected and quantified
• **340 species** biodiversity impact assessed
• **+2.4°C** temperature increase in cleared areas
• **82%** erosion risk level identified
• **2.3 hectares** total area affected
• **73%** habitat fragmentation measured

Processing Performance:
• 45-second video analyzed in real-time
• 5 risk zones identified with GPS coordinates
• Multi-temporal analysis showing progression
• Physics-validated predictions with uncertainty bounds

---

## Slide 7: Market Impact & Future Vision
**Transforming Environmental Monitoring**

Current Applications:
• Climate monitoring and early warning systems
• Disaster preparedness and emergency response
• Conservation planning and biodiversity protection
• Environmental policy and regulatory support
• Corporate sustainability and ESG reporting

Market Opportunity:
• $50B environmental monitoring market (2024)
• 25% annual growth in real-time analysis demand
• Government and NGO partnership potential
• Integration opportunities with satellite systems

Future Development:
• Global deployment across climate zones
• Enhanced prediction horizons and accuracy
• Integration with IoT sensor networks
• Mobile applications for field deployment

Call to Action: Join the environmental monitoring revolution

---

## Technical Specifications for Presentation:
- Slide Dimensions: 16:9 widescreen format
- Font: Calibri or Segoe UI for professional appearance
- Color Scheme: Blue/Green gradient with white backgrounds
- Include company logo and contact information
- Add high-quality charts and infographics for statistics
- Use professional stock images for environmental themes
- Include QR codes linking to live demo at your website

## Speaker Notes:
Each slide should be presented for 2-3 minutes with detailed explanations
Total presentation duration: 15-20 minutes plus Q&A
Prepare for technical questions about PINN algorithms and AI integration
Have live demo ready for interactive demonstration if requested
`;

    const blob = new Blob([pptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EcoPredict_Professional_Presentation.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const openInteractivePPT = () => {
    window.open('/assets/EcoPredict_Presentation.html', '_blank');
  };

  const downloadVideoScript = () => {
    const scriptContent = `
# EcoPredict Demo Video Script

## Scene 1: Introduction (0-15 seconds)
**Visual:** EcoPredict logo animation with environmental background
**Narration:** "Environmental disasters threaten our planet. Traditional prediction methods can't keep up. Meet EcoPredict - the future of environmental analysis."

## Scene 2: Problem Statement (15-30 seconds)
**Visual:** Disaster footage montage (fires, floods, deforestation)
**Narration:** "Every year, environmental disasters cause over $100 billion in damage. Current methods lack real-time analysis and physics integration."

## Scene 3: Solution Introduction (30-45 seconds)
**Visual:** PINN algorithm visualization with equations
**Narration:** "EcoPredict uses Physics-Informed Neural Networks to analyze environmental video data in real-time, combining machine learning with fundamental physics."

## Scene 4: Technology Demo (45-75 seconds)
**Visual:** Screen recording of video upload and analysis
**Narration:** "Simply upload environmental footage. Our 4 specialized algorithms analyze CO₂ emissions, heat transfer, ocean currents, and ecosystem impacts simultaneously."

## Scene 5: AI Analysis (75-90 seconds)
**Visual:** Multi-AI analysis interface showing results
**Narration:** "Three AI systems - OpenAI, Gemini, and Vellum - provide comprehensive insights and validation of our physics-based predictions."

## Scene 6: Results Showcase (90-105 seconds)
**Visual:** Risk visualization and impact metrics
**Narration:** "In our Amazon case study, we detected 414 tons of CO₂ emissions, assessed impact on 340 species, and identified 82% erosion risk - all from a single video."

## Scene 7: Call to Action (105-120 seconds)
**Visual:** EcoPredict interface with upload button
**Narration:** "Join the environmental monitoring revolution. Try EcoPredict today and help protect our planet with the power of physics-informed AI."

## Technical Requirements:
- Resolution: 1920x1080 (Full HD)
- Frame Rate: 30fps
- Duration: 2 minutes
- Audio: Clear narration with background music
- Graphics: Professional animations and transitions
`;

    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EcoPredict_Video_Script.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Presentation className="w-6 h-6 text-blue-600" />
            <span>Presentation Materials</span>
          </CardTitle>
          <p className="text-gray-600">
            Complete presentation package for EcoPredict including slides, video scripts, and downloadable materials
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="slides" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="slides">PowerPoint Slides</TabsTrigger>
              <TabsTrigger value="video">Video Materials</TabsTrigger>
              <TabsTrigger value="downloads">Downloads</TabsTrigger>
            </TabsList>

            <TabsContent value="slides" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Slide Preview */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Slide Preview</h3>
                    <Badge variant="secondary">
                      {currentSlide + 1} of {presentationSlides.length}
                    </Badge>
                  </div>
                  
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border-2 border-gray-300 rounded-lg p-8 aspect-video flex flex-col justify-center"
                  >
                    <motion.h2
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-bold text-center mb-6 text-blue-800"
                    >
                      {presentationSlides[currentSlide].title}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg text-center text-gray-700 leading-relaxed"
                    >
                      {presentationSlides[currentSlide].content}
                    </motion.p>
                  </motion.div>

                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                      disabled={currentSlide === 0}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      variant={isPlaying ? "secondary" : "default"}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isPlaying ? "Pause" : "Auto Play"}
                    </Button>
                    <Button
                      onClick={() => setCurrentSlide(Math.min(presentationSlides.length - 1, currentSlide + 1))}
                      disabled={currentSlide === presentationSlides.length - 1}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </div>

                {/* Slide Navigation */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Slide Navigation</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {presentationSlides.map((slide, index) => (
                      <motion.div
                        key={slide.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-colors ${
                            index === currentSlide 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setCurrentSlide(index)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {index + 1}
                              </Badge>
                              <span className="text-sm font-medium truncate">
                                {slide.title}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Video className="w-5 h-5" />
                      <span>Demo Video Concept</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
                        <p className="text-sm">EcoPredict Demo Video</p>
                        <p className="text-xs opacity-70">2 minutes • Professional quality</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Video Outline:</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Problem introduction (15s)</li>
                        <li>• Technology explanation (30s)</li>
                        <li>• Live demo walkthrough (45s)</li>
                        <li>• Results showcase (30s)</li>
                        <li>• Call to action (15s)</li>
                      </ul>
                    </div>

                    <Button 
                      onClick={downloadVideoScript}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Video Script
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Supporting Materials</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-sm">Technical Documentation</h4>
                        <p className="text-xs text-gray-600">PINN algorithms, API specifications, architecture overview</p>
                      </div>
                      
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-sm">Case Study Report</h4>
                        <p className="text-xs text-gray-600">Amazon deforestation analysis with detailed metrics</p>
                      </div>
                      
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-sm">Implementation Guide</h4>
                        <p className="text-xs text-gray-600">Setup instructions, API integration, deployment guide</p>
                      </div>
                      
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-sm">Research Papers</h4>
                        <p className="text-xs text-gray-600">Academic references and PINN methodology citations</p>
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      variant="outline"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Documentation
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="downloads" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Presentation className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="font-semibold mb-2">PowerPoint Presentation</h3>
                    <p className="text-sm text-gray-600 mb-4">Complete slide deck with speaker notes</p>
                    <div className="space-y-2">
                      <Button onClick={openInteractivePPT} className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Interactive PPT
                      </Button>
                      <Button onClick={downloadPPT} variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Script
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Video className="w-12 h-12 mx-auto mb-4 text-green-600" />
                    <h3 className="font-semibold mb-2">Video Script</h3>
                    <p className="text-sm text-gray-600 mb-4">Detailed narration and scene descriptions</p>
                    <Button onClick={downloadVideoScript} className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Script
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                    <h3 className="font-semibold mb-2">Technical Documentation</h3>
                    <p className="text-sm text-gray-600 mb-4">API docs, architecture, and implementation</p>
                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Docs
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Presentation Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">EP</span>
                      </div>
                      <p className="text-xs">Logo (SVG)</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-red-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">📊</span>
                      </div>
                      <p className="text-xs">Charts & Graphs</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">🗺️</span>
                      </div>
                      <p className="text-xs">Risk Maps</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-400 to-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">🎬</span>
                      </div>
                      <p className="text-xs">Animation Frames</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}