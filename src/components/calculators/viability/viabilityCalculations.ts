import { ViabilityResult } from "./types";
import { ValidatedViabilityFormData } from "./viabilityValidation";
import { VIABILITY_WEIGHTS, VIABILITY_LEVELS } from "./viabilityConstants";

// Product type scoring
const getProductTypeScore = (productType: string): number => {
  const scores: Record<string, number> = {
    'generic_drug': 85,
    'similar_drug': 80,
    'supplement': 75,
    'medical_device': 70,
    'biosimilar': 65,
    'new_drug': 45,
    'biological': 40
  };
  return scores[productType] || 50;
};

// Development cost scoring (inverse relationship - lower cost = higher score)
const getCostScore = (cost: number): number => {
  if (cost <= 50000) return 90;
  if (cost <= 150000) return 80;
  if (cost <= 500000) return 70;
  if (cost <= 1000000) return 60;
  if (cost <= 5000000) return 40;
  return 20;
};

// Time to market scoring (inverse relationship - shorter time = higher score)
const getTimeScore = (timeMonths: number): number => {
  if (timeMonths <= 6) return 95;
  if (timeMonths <= 12) return 85;
  if (timeMonths <= 24) return 75;
  if (timeMonths <= 36) return 65;
  if (timeMonths <= 60) return 45;
  return 25;
};

// Market size scoring
const getMarketScore = (marketSize: string): number => {
  const scores: Record<string, number> = {
    'massive': 95,
    'large': 85,
    'medium': 70,
    'small': 55,
    'niche': 40
  };
  return scores[marketSize] || 50;
};

// Competition scoring (inverse relationship - less competition = higher score)
const getCompetitionScore = (competition: string): number => {
  const scores: Record<string, number> = {
    'none': 95,
    'low': 80,
    'moderate': 65,
    'high': 45,
    'saturated': 25
  };
  return scores[competition] || 50;
};

// Regulatory complexity scoring (inverse relationship - less complex = higher score)
const getRegulatoryScore = (complexity: string): number => {
  const scores: Record<string, number> = {
    'minimal': 90,
    'low': 80,
    'moderate': 70,
    'high': 50,
    'very_high': 30
  };
  return scores[complexity] || 50;
};

// Get viability level based on score
const getViabilityLevel = (score: number): { level: string; color: string; bgColor: string } => {
  const level = VIABILITY_LEVELS.find(l => score >= l.min) || VIABILITY_LEVELS[VIABILITY_LEVELS.length - 1];
  return {
    level: level.level,
    color: level.color,
    bgColor: level.bgColor
  };
};

// Generate recommendations based on scores
const generateRecommendations = (scores: any, formData: ValidatedViabilityFormData): string[] => {
  const recommendations: string[] = [];
  
  // Cost-based recommendations
  if (scores.cost <= 50) {
    recommendations.push("Custos elevados identificados - considere desenvolvimento em fases para diluir investimento");
  }
  
  // Time-based recommendations
  if (scores.time <= 55) {
    recommendations.push("Timeline extenso - avalie estratégias de aceleração como parcerias ou terceirização");
  }
  
  // Market-based recommendations
  if (scores.market <= 50) {
    recommendations.push("Mercado limitado - considere expansão para outros segmentos ou regiões");
  } else if (scores.market >= 85) {
    recommendations.push("Mercado promissor - priorize velocidade de entrada para capturar market share");
  }
  
  // Competition-based recommendations
  if (scores.competition <= 50) {
    recommendations.push("Alto nível de competição - desenvolva estratégias claras de diferenciação");
  }
  
  // Regulatory-based recommendations
  if (scores.regulatory <= 50) {
    recommendations.push("Complexidade regulatória alta - invista em consultoria especializada desde o início");
  }
  
  // Product type specific recommendations
  if (formData.productType === 'new_drug' || formData.productType === 'biological') {
    recommendations.push("Produto inovador - considere proteção de propriedade intelectual e estudos clínicos robustos");
  }
  
  // Always include expert consultation
  recommendations.push("Para otimizar estratégia e reduzir riscos, consulte nossos especialistas para análise detalhada");
  
  return recommendations;
};

export const calculateViability = (formData: ValidatedViabilityFormData): ViabilityResult => {
  // Calculate individual scores
  const scores = {
    productType: getProductTypeScore(formData.productType),
    cost: getCostScore(Number(formData.developmentCost)),
    time: getTimeScore(Number(formData.timeToMarket)),
    market: getMarketScore(formData.marketSize),
    competition: getCompetitionScore(formData.competition),
    regulatory: getRegulatoryScore(formData.regulatoryComplexity)
  };

  // Calculate weighted score
  const weightedScore = Object.keys(scores).reduce((total, key) => {
    const score = scores[key as keyof typeof scores];
    const weight = VIABILITY_WEIGHTS[key as keyof typeof VIABILITY_WEIGHTS];
    return total + (score * weight);
  }, 0);

  // Get viability level and styling
  const viabilityInfo = getViabilityLevel(weightedScore);

  // Create breakdown for transparency
  const breakdown = Object.keys(scores).map(key => ({
    factor: key,
    score: scores[key as keyof typeof scores],
    weight: VIABILITY_WEIGHTS[key as keyof typeof VIABILITY_WEIGHTS] * 100,
    contribution: scores[key as keyof typeof scores] * VIABILITY_WEIGHTS[key as keyof typeof VIABILITY_WEIGHTS]
  }));

  return {
    percentage: Math.round(weightedScore),
    viabilityLevel: viabilityInfo.level,
    color: viabilityInfo.color,
    icon: weightedScore >= 70 ? 'success' : weightedScore >= 55 ? 'warning' : 'danger',
    recommendations: generateRecommendations(scores, formData),
    scores,
    breakdown
  };
};