export interface CostFormData {
  productType: string;
  developmentPhase: string;
  teamSize: string;
  duration: string;
  complexity: string;
  regulatoryPath: string;
}

export interface CostResults {
  totalCost: number;
  developmentCost: number;
  regulatoryCost: number;
  qualityCost: number;
  productionCost: number;
  timeline: number; // months
  breakdown: {
    development: number;
    regulatory: number;
    quality: number;
    production: number;
  };
  recommendations: string[];
  riskFactors: string[];
}

export interface CostLevel {
  level: string;
  range: string;
  description: string;
  color: string;
}