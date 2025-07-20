export const sampleVideoMetadata = {
  filename: "amazon_deforestation_2024.mp4",
  duration: 45,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  location: "Amazon Basin, Brazil",
  captureDate: "2024-01-15",
  environmentalFocus: "deforestation",
  description: "Aerial footage showing deforestation patterns in the Amazon rainforest with visible clearing boundaries and vegetation loss indicators",
  
  frameAnalysis: {
    totalFrames: 1350,
    keyFrames: [
      {
        frameNumber: 150,
        timestamp: 5.0,
        description: "Initial forest canopy showing dense vegetation",
        vegetationDensity: 0.92,
        clearingArea: 0.02
      },
      {
        frameNumber: 450,
        timestamp: 15.0,
        description: "First clearing boundary visible with logging roads",
        vegetationDensity: 0.74,
        clearingArea: 0.18
      },
      {
        frameNumber: 900,
        timestamp: 30.0,
        description: "Significant deforestation with soil exposure",
        vegetationDensity: 0.45,
        clearingArea: 0.47
      },
      {
        frameNumber: 1200,
        timestamp: 40.0,
        description: "Agricultural conversion and infrastructure development",
        vegetationDensity: 0.28,
        clearingArea: 0.68
      }
    ]
  },
  
  environmentalIndicators: {
    co2Release: {
      estimatedTonsPerHectare: 180,
      totalAreaAffected: 2.3,
      totalCo2Release: 414
    },
    biodiversityLoss: {
      speciesImpacted: 340,
      habitatFragmentation: 0.73,
      connectivityLoss: 0.56
    },
    soilErosion: {
      exposedSoilArea: 1.6,
      erosionRisk: "high",
      sedimentationRisk: 0.82
    },
    microclimateLoss: {
      temperatureIncrease: 2.4,
      humidityDecrease: 15,
      precipitationChange: -8
    }
  }
};