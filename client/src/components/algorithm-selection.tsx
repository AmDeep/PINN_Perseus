import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Thermometer, Flame, Waves, Trees, Brain, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";
import type { Algorithm } from "@shared/schema";

interface AlgorithmSelectionProps {
  selectedAlgorithm?: string;
  onAlgorithmSelect?: (algorithm: Algorithm) => void;
}

const algorithmIcons = {
  climate: Thermometer,
  thermal: Flame,
  oceanographic: Waves,
  ecological: Trees,
} as const;

export function AlgorithmSelection({ selectedAlgorithm, onAlgorithmSelect }: AlgorithmSelectionProps) {
  const [selected, setSelected] = useState<Algorithm | null>(null);

  const { data: algorithms, isLoading } = useQuery({
    queryKey: ["/api/algorithms"],
  });

  const handleSelect = (algorithm: Algorithm) => {
    setSelected(algorithm);
    onAlgorithmSelect?.(algorithm);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <Skeleton className="w-6 h-6 mr-2" />
            <Skeleton className="w-48 h-6" />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-full h-24" />
              ))}
            </div>
            <Skeleton className="w-full h-80" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentAlgorithm = selected || algorithms?.find((algo: Algorithm) => 
    algo.name === selectedAlgorithm
  ) || algorithms?.[0];

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <Brain className="text-primary mr-2" size={20} />
          <h3 className="text-xl font-semibold">PINN Algorithm Selection</h3>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Algorithm Cards */}
          <div className="space-y-4">
            {algorithms?.map((algorithm: Algorithm) => {
              const IconComponent = algorithmIcons[algorithm.category as keyof typeof algorithmIcons] || Brain;
              const isSelected = currentAlgorithm?.id === algorithm.id;
              
              return (
                <div
                  key={algorithm.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    isSelected 
                      ? "border-primary bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleSelect(algorithm)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <IconComponent 
                          className={isSelected ? "text-primary" : "text-gray-600"} 
                          size={18} 
                        />
                        <h4 className="font-semibold ml-2">{algorithm.displayName}</h4>
                        {algorithm.name === "climode" && (
                          <Badge variant="default" className="ml-2">Recommended</Badge>
                        )}
                        {isSelected && (
                          <CheckCircle className="text-primary ml-2" size={16} />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{algorithm.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>• {algorithm.category}</span>
                        <span>• {algorithm.speed}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">{algorithm.accuracy}%</div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Algorithm Details */}
          {currentAlgorithm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold mb-4">{currentAlgorithm.displayName} - Selected Algorithm</h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Physical Constraints</h5>
                  <div className="space-y-1 font-mono text-xs">
                    {Array.isArray(currentAlgorithm.physicsConstraints?.equations) &&
                      currentAlgorithm.physicsConstraints.equations.map((eq: string, idx: number) => (
                        <div key={idx} className="bg-white p-2 rounded border text-gray-800">
                          {eq}
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Model Parameters</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {currentAlgorithm.parameters && typeof currentAlgorithm.parameters === 'object' &&
                      Object.entries(currentAlgorithm.parameters).map(([key, value]) => (
                        <div key={key} className="bg-white p-2 rounded border">
                          <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                          <div className="text-gray-600">{String(value)}</div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Key Advantages</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {currentAlgorithm.physicsConstraints?.conservation && (
                      <li className="flex items-center">
                        <CheckCircle className="text-green-600 mr-1" size={12} />
                        Conservation laws: {Array.isArray(currentAlgorithm.physicsConstraints.conservation) 
                          ? currentAlgorithm.physicsConstraints.conservation.join(', ')
                          : currentAlgorithm.physicsConstraints.conservation}
                      </li>
                    )}
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-1" size={12} />
                      Physics-informed constraints
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-1" size={12} />
                      Mesh-free computation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-1" size={12} />
                      {currentAlgorithm.speed} than traditional methods
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h6 className="font-medium text-sm text-blue-800 mb-1">Performance Metrics</h6>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div>• Accuracy: {currentAlgorithm.accuracy}% on validation datasets</div>
                    <div>• Speed: {currentAlgorithm.speed}</div>
                    <div>• Category: {currentAlgorithm.category} modeling</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
