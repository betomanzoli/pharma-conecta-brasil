import { CostFormData, CostResults, CostLevel } from './types';
import {
  PRODUCT_TYPES,
  DEVELOPMENT_PHASES,
  TEAM_SIZES,
  DURATIONS,
  COMPLEXITIES,
  REGULATORY_PATHS,
  BASE_COSTS,
  COST_LEVELS,
} from './costConstants';

export function calculateCost(formData: CostFormData): CostResults {
  // Get multipliers
  const productMultiplier = PRODUCT_TYPES.find(p => p.value === formData.productType)?.multiplier || 1;
  const phaseMultiplier = DEVELOPMENT_PHASES.find(p => p.value === formData.developmentPhase)?.multiplier || 1;
  const teamMultiplier = TEAM_SIZES.find(t => t.value === formData.teamSize)?.multiplier || 1;
  const durationMultiplier = DURATIONS.find(d => d.value === formData.duration)?.multiplier || 1;
  const complexityMultiplier = COMPLEXITIES.find(c => c.value === formData.complexity)?.multiplier || 1;
  const regulatoryMultiplier = REGULATORY_PATHS.find(r => r.value === formData.regulatoryPath)?.multiplier || 1;

  // Calculate individual costs
  const developmentCost = Math.round(
    BASE_COSTS.development * 
    productMultiplier * 
    phaseMultiplier * 
    teamMultiplier * 
    complexityMultiplier
  );

  const regulatoryCost = Math.round(
    BASE_COSTS.regulatory * 
    productMultiplier * 
    regulatoryMultiplier * 
    complexityMultiplier
  );

  const qualityCost = Math.round(
    BASE_COSTS.quality * 
    productMultiplier * 
    complexityMultiplier * 
    phaseMultiplier
  );

  const productionCost = Math.round(
    BASE_COSTS.production * 
    productMultiplier * 
    teamMultiplier * 
    durationMultiplier
  );

  const totalCost = developmentCost + regulatoryCost + qualityCost + productionCost;

  // Calculate timeline (in months)
  const baseTimeline = 18; // 18 months base
  const timeline = Math.round(
    baseTimeline * 
    phaseMultiplier * 
    complexityMultiplier * 
    durationMultiplier * 
    (regulatoryMultiplier * 0.5 + 0.5)
  );

  // Generate recommendations
  const recommendations = generateRecommendations(formData, totalCost);
  const riskFactors = generateRiskFactors(formData);

  return {
    totalCost,
    developmentCost,
    regulatoryCost,
    qualityCost,
    productionCost,
    timeline,
    breakdown: {
      development: Math.round((developmentCost / totalCost) * 100),
      regulatory: Math.round((regulatoryCost / totalCost) * 100),
      quality: Math.round((qualityCost / totalCost) * 100),
      production: Math.round((productionCost / totalCost) * 100),
    },
    recommendations,
    riskFactors,
  };
}

function generateRecommendations(formData: CostFormData, totalCost: number): string[] {
  const recommendations: string[] = [];

  if (totalCost > 5000000) {
    recommendations.push('Considere parcerias estratégicas para reduzir investimento inicial');
    recommendations.push('Avalie financiamento através de editais de inovação');
  }

  if (formData.complexity === 'critical') {
    recommendations.push('Implemente methodology QbD desde o início para reduzir riscos');
    recommendations.push('Considere consultoria regulatória especializada');
  }

  if (formData.productType === 'biologic') {
    recommendations.push('Planeje infraestrutura específica para biológicos');
    recommendations.push('Considere parcerias com CDMOs especializadas');
  }

  if (formData.developmentPhase === 'phase3') {
    recommendations.push('Prepare estratégia de market access antecipadamente');
    recommendations.push('Implemente sistema robusto de farmacovigilância');
  }

  if (formData.teamSize === 'small') {
    recommendations.push('Considere terceirização de atividades não-core');
    recommendations.push('Invista em capacitação da equipe interna');
  }

  return recommendations;
}

function generateRiskFactors(formData: CostFormData): string[] {
  const risks: string[] = [];

  if (formData.productType === 'new' || formData.productType === 'biologic') {
    risks.push('Risco regulatório elevado - produto inovador');
  }

  if (formData.complexity === 'critical' || formData.complexity === 'high') {
    risks.push('Risco técnico de desenvolvimento complexo');
  }

  if (formData.duration === 'extended') {
    risks.push('Risco de mudanças regulatórias durante desenvolvimento');
  }

  if (formData.developmentPhase === 'phase3') {
    risks.push('Alto risco financeiro - investimento significativo');
  }

  return risks;
}

export function getCostLevel(totalCost: number): CostLevel {
  if (totalCost < 800000) return COST_LEVELS[0];
  if (totalCost < 2000000) return COST_LEVELS[1];
  if (totalCost < 5000000) return COST_LEVELS[2];
  return COST_LEVELS[3];
}