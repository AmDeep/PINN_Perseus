import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, Video, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { UploadVideoRequest } from "@shared/schema";

interface VideoUploadProps {
  onUploadComplete: (videoId: number) => void;
}

export function VideoUpload({ onUploadComplete }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [config, setConfig] = useState<UploadVideoRequest>({
    environmentalFocus: "carbon-dioxide",
    analysisPriority: "balanced",
    predictionHorizon: 7,
  });
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus("Preparing upload...");

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      setUploadStatus("Uploading video...");
      const result = await api.uploadVideo(file, config);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus("Upload complete");
      
      toast({
        title: "Upload Successful",
        description: "Video uploaded successfully. Processing will begin shortly.",
      });

      onUploadComplete(result.videoId);
      
    } catch (error) {
      setUploadStatus("Upload failed");
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Upload failed",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus("");
      }, 3000);
    }
  }, [config, onUploadComplete, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/avi': ['.avi'],
      'video/mov': ['.mov'],
      'video/quicktime': ['.mov']
    },
    maxSize: 500 * 1024 * 1024, // 500MB
    multiple: false,
    disabled: isUploading
  });

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <Upload className="text-primary mr-2" size={20} />
          <h3 className="text-xl font-semibold">Video Upload & Processing</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Area */}
          <div>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? "border-primary bg-primary/5" 
                  : isUploading 
                    ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                    : "border-gray-300 hover:border-primary hover:bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />
              
              {isUploading ? (
                <CheckCircle className="mx-auto text-4xl text-green-600 mb-4" size={48} />
              ) : (
                <Video className="mx-auto text-4xl text-gray-400 mb-4" size={48} />
              )}
              
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragActive 
                  ? "Drop your environmental video here"
                  : isUploading
                    ? "Processing upload..."
                    : "Drop your environmental video here"
                }
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports MP4, AVI, MOV (max 500MB)
              </p>
              
              {!isUploading && (
                <Button variant="outline">
                  Select File
                </Button>
              )}
            </div>

            {/* Upload Progress */}
            {(isUploading || uploadProgress > 0) && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{uploadStatus}</span>
                  <span className="text-sm text-gray-600">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
          
          {/* Configuration */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="environmental-focus" className="text-sm font-medium">
                Environmental Focus
              </Label>
              <Select
                value={config.environmentalFocus}
                onValueChange={(value: any) => 
                  setConfig(prev => ({ ...prev, environmentalFocus: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carbon-dioxide">Carbon Dioxide Flows</SelectItem>
                  <SelectItem value="heat-flux">Heat Flux Analysis</SelectItem>
                  <SelectItem value="ocean-currents">Ocean Current Patterns</SelectItem>
                  <SelectItem value="deforestation">Deforestation Impact</SelectItem>
                  <SelectItem value="multi-parameter">Multi-parameter Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="analysis-priority" className="text-sm font-medium">
                Analysis Priority
              </Label>
              <Select
                value={config.analysisPriority}
                onValueChange={(value: any) => 
                  setConfig(prev => ({ ...prev, analysisPriority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accuracy">Accuracy Optimized</SelectItem>
                  <SelectItem value="speed">Speed Optimized</SelectItem>
                  <SelectItem value="balanced">Balanced Approach</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="prediction-horizon" className="text-sm font-medium">
                Prediction Horizon
              </Label>
              <div className="flex space-x-2 mt-2">
                {[1, 7, 30].map((days) => (
                  <Button
                    key={days}
                    variant={config.predictionHorizon === days ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfig(prev => ({ ...prev, predictionHorizon: days }))}
                    className="flex-1"
                  >
                    {days} Day{days > 1 ? 's' : ''}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h6 className="font-medium text-xs text-gray-700 mb-1">Processing Pipeline</h6>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• OpenCV frame extraction</div>
                <div>• Environmental feature detection</div>
                <div>• PINN algorithm selection</div>
                <div>• Multi-LLM analysis integration</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
