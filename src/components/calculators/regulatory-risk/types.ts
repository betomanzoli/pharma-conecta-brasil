export interface RegulatoryFormData {
  productCategory: string;
  novelty: string;
  targetMarkets: string;
  clinicalEvidence: string;
  manufacturingComplexity: string;
  priorApprovals: string;
}

export interface RegulatoryResults {
  riskScore: number; // 0-100%
  riskLevel: string;
  approvalProbability: number; // 0-100%
  timelineEstimate: number; // months
  criticalFactors: string[];
  mitigationStrategies: string[];
  regulatoryPath: string;
  anvisaRequirements: string[];
}

export interface RiskLevel {
  level: string;
  range: string;
  description: string;
  color: string;
}