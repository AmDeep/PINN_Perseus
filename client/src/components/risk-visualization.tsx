import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Zap, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RiskArea {
  id: string;
  name: string;
  severity: "low" | "medium" | "high" | "critical";
  type: "co2" | "heat" | "erosion" | "biodiversity";
  coordinates: { x: number; y: number };
  impact: string;
  prediction: string;
}

const riskAreas: RiskArea[] = [
  {
    id: "r1",
    name: "Primary Clearing Zone",
    severity: "critical",
    type: "co2",
    coordinates: { x: 25, y: 35 },
    impact: "414 tons CO₂ emission",
    prediction: "Continued expansion likely"
  },
  {
    id: "r2", 
    name: "Heat Island Formation",
    severity: "high",
    type: "heat",
    coordinates: { x: 60, y: 20 },
    impact: "+2.4°C temperature rise",
    prediction: "Microclimate disruption spreading"
  },
  {
    id: "r3",
    name: "Erosion Risk Area",
    severity: "high", 
    type: "erosion",
    coordinates: { x: 40, y: 75 },
    impact: "1.6 hectares soil exposure",
    prediction: "82% sedimentation risk"
  },
  {
    id: "r4",
    name: "Wildlife Corridor Break",
    severity: "medium",
    type: "biodiversity",
    coordinates: { x: 75, y: 45 },
    impact: "340 species affected",
    prediction: "Habitat fragmentation increasing"
  },
  {
    id: "r5",
    name: "Secondary Clearing",
    severity: "medium",
    type: "co2",
    coordinates: { x: 15, y: 60 },
    impact: "Biomass decomposition",
    prediction: "Expansion vector identified"
  }
];

const severityColors = {
  low: "bg-yellow-400",
  medium: "bg-orange-400", 
  high: "bg-red-400",
  critical: "bg-red-600"
};

const typeIcons = {
  co2: "🌱",
  heat: "🌡️", 
  erosion: "🌊",
  biodiversity: "🦋"
};

export default function RiskVisualization() {
  return (
    <div className="space-y-6">
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <span>Environmental Risk Mapping</span>
          </CardTitle>
          <p className="text-gray-600">
            Interactive visualization of identified environmental risks and their predicted impacts
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Map */}
            <div className="space-y-4">
              <h3 className="font-semibold">Satellite Risk Overlay</h3>
              <div className="relative w-full h-80 bg-gradient-to-br from-green-800 via-green-600 to-green-400 rounded-lg overflow-hidden border-2 border-gray-300">
                {/* Forest Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-4 left-4 w-8 h-8 bg-green-900 rounded-full" />
                  <div className="absolute top-12 right-8 w-6 h-6 bg-green-900 rounded-full" />
                  <div className="absolute bottom-8 left-12 w-10 h-10 bg-green-900 rounded-full" />
                  <div className="absolute bottom-4 right-4 w-7 h-7 bg-green-900 rounded-full" />
                </div>

                {/* Risk Area Markers */}
                {riskAreas.map((risk, index) => (
                  <motion.div
                    key={risk.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.3, duration: 0.5 }}
                    className="absolute"
                    style={{
                      left: `${risk.coordinates.x}%`,
                      top: `${risk.coordinates.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                      className={`w-4 h-4 rounded-full ${severityColors[risk.severity]} border-2 border-white shadow-lg`}
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.3 + 0.5 }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap"
                    >
                      {typeIcons[risk.type]} {risk.name}
                    </motion.div>
                  </motion.div>
                ))}

                {/* Deforestation Areas */}
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1 }}
                  className="absolute inset-0"
                >
                  <svg className="w-full h-full">
                    <path
                      d="M 20 30 Q 40 25 60 35 T 80 40"
                      stroke="rgba(139, 69, 19, 0.8)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M 15 55 Q 35 50 55 60 T 75 65"
                      stroke="rgba(139, 69, 19, 0.6)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="3,3"
                    />
                  </svg>
                </motion.div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Critical Risk
                </Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  High Risk
                </Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Medium Risk
                </Badge>
              </div>
            </div>

            {/* Risk Details */}
            <div className="space-y-4">
              <h3 className="font-semibold">Risk Assessment Details</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {riskAreas.map((risk, index) => (
                  <motion.div
                    key={risk.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card className="border-l-4 border-l-amber-400">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{typeIcons[risk.type]}</span>
                            <h4 className="font-medium text-sm">{risk.name}</h4>
                          </div>
                          <Badge 
                            variant="secondary"
                            className={`${
                              risk.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              risk.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}
                          >
                            {risk.severity.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-red-500" />
                            <span><strong>Impact:</strong> {risk.impact}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span><strong>Prediction:</strong> {risk.prediction}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span><strong>Location:</strong> {risk.coordinates.x}°, {risk.coordinates.y}°</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">5</div>
                <div className="text-sm text-gray-600">Risk Areas</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">2.3</div>
                <div className="text-sm text-gray-600">Hectares Affected</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-600">82%</div>
                <div className="text-sm text-gray-600">Max Risk Level</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">340</div>
                <div className="text-sm text-gray-600">Species Impact</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}