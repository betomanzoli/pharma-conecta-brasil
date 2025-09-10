export interface ViabilityFormData {
  productType: string;
  developmentCost: string;
  timeToMarket: string;
  marketSize: string;
  competition: string;
  regulatoryComplexity: string;
}

export interface ViabilityResult {
  percentage: number;
  viabilityLevel: string;
  color: string;
  icon: string;
  recommendations: string[];
  scores: {
    productType: number;
    cost: number;
    time: number;
    market: number;
    competition: number;
    regulatory: number;
  };
  breakdown: {
    factor: string;
    score: number;
    weight: number;
    contribution: number;
  }[];
}