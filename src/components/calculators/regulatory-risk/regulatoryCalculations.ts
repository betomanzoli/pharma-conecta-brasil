import { RegulatoryFormData, RegulatoryResults, RiskLevel } from './types';
import {
  PRODUCT_CATEGORIES,
  NOVELTY_LEVELS,
  TARGET_MARKETS,
  CLINICAL_EVIDENCE,
  MANUFACTURING_COMPLEXITY,
  PRIOR_APPROVALS,
  RISK_LEVELS,
  REGULATORY_PATHS,
} from './regulatoryConstants';

export function calculateRegulatoryRisk(formData: RegulatoryFormData): RegulatoryResults {
  // Calculate individual risk scores
  const categoryRisk = PRODUCT_CATEGORIES.find(p => p.value === formData.productCategory)?.risk || 0;
  const noveltyRisk = NOVELTY_LEVELS.find(n => n.value === formData.novelty)?.risk || 0;
  const marketRisk = TARGET_MARKETS.find(m => m.value === formData.targetMarkets)?.risk || 0;
  const evidenceRisk = CLINICAL_EVIDENCE.find(e => e.value === formData.clinicalEvidence)?.risk || 0;
  const manufacturingRisk = MANUFACTURING_COMPLEXITY.find(m => m.value === formData.manufacturingComplexity)?.risk || 0;
  const approvalRisk = PRIOR_APPROVALS.find(a => a.value === formData.priorApprovals)?.risk || 0;

  // Calculate weighted risk score (0-100%)
  const weights = {
    category: 0.20,
    novelty: 0.25,
    market: 0.10,
    evidence: 0.25,
    manufacturing: 0.15,
    approval: 0.05,
  };

  const weightedRisk = 
    (categoryRisk * weights.category) +
    (noveltyRisk * weights.novelty) +
    (marketRisk * weights.market) +
    (evidenceRisk * weights.evidence) +
    (manufacturingRisk * weights.manufacturing) +
    (approvalRisk * weights.approval);

  const riskScore = Math.max(0, Math.min(100, Math.round(weightedRisk)));
  const approvalProbability = Math.max(0, Math.min(100, 100 - riskScore));

  // Determine risk level
  const riskLevel = getRiskLevel(riskScore);

  // Calculate timeline estimate
  const timelineEstimate = calculateTimeline(formData, riskScore);

  // Generate regulatory path
  const regulatoryPath = REGULATORY_PATHS[formData.productCategory as keyof typeof REGULATORY_PATHS] || 'Via a determinar';

  return {
    riskScore,
    riskLevel: riskLevel.level,
    approvalProbability,
    timelineEstimate,
    criticalFactors: generateCriticalFactors(formData, riskScore),
    mitigationStrategies: generateMitigationStrategies(formData, riskScore),
    regulatoryPath,
    anvisaRequirements: generateAnvisaRequirements(formData),
  };
}

function calculateTimeline(formData: RegulatoryFormData, riskScore: number): number {
  const baseTimelines: Record<string, number> = {
    generic: 12,
    similar: 18,
    reference: 24,
    new: 36,
    biologic: 42,
    cell_gene: 48,
  };

  const baseTimeline = baseTimelines[formData.productCategory] || 24;
  
  // Adjust based on risk factors
  let timelineMultiplier = 1;
  
  if (riskScore > 70) timelineMultiplier = 1.5;
  else if (riskScore > 50) timelineMultiplier = 1.3;
  else if (riskScore > 30) timelineMultiplier = 1.1;

  // Adjust for evidence quality
  if (formData.clinicalEvidence === 'none' || formData.clinicalEvidence === 'preclinical') {
    timelineMultiplier *= 1.4;
  }

  return Math.round(baseTimeline * timelineMultiplier);
}

function generateCriticalFactors(formData: RegulatoryFormData, riskScore: number): string[] {
  const factors: string[] = [];

  if (riskScore > 70) {
    factors.push('Produto altamente inovador - incertezas regulatórias significativas');
  }

  if (formData.novelty === 'first_in_class') {
    factors.push('Primeira da classe - ausência de precedentes regulatórios');
  }

  if (formData.clinicalEvidence === 'limited' || formData.clinicalEvidence === 'preclinical') {
    factors.push('Evidência clínica insuficiente - dados adicionais necessários');
  }

  if (formData.manufacturingComplexity === 'cutting_edge' || formData.manufacturingComplexity === 'advanced') {
    factors.push('Processo de manufatura complexo - validação extensiva requerida');
  }

  if (formData.priorApprovals === 'none') {
    factors.push('Ausência de aprovações prévias - falta de referências regulatórias');
  }

  if (formData.targetMarkets === 'global' || formData.targetMarkets === 'us_eu') {
    factors.push('Mercados regulados rigorosos - harmonização necessária');
  }

  return factors;
}

function generateMitigationStrategies(formData: RegulatoryFormData, riskScore: number): string[] {
  const strategies: string[] = [];

  if (riskScore > 50) {
    strategies.push('Engage com ANVISA através de reunião de aconselhamento pré-submissão');
    strategies.push('Desenvolva estratégia regulatória robusta com consultoria especializada');
  }

  if (formData.novelty === 'new_molecule' || formData.novelty === 'first_in_class') {
    strategies.push('Implemente programa de desenvolvimento científico escalonado');
    strategies.push('Considere designações especiais (órfão, pediatria, etc.)');
  }

  if (formData.clinicalEvidence === 'limited') {
    strategies.push('Desenvolva plano de estudos clínicos complementares');
    strategies.push('Explore uso de evidência do mundo real (RWE)');
  }

  if (formData.manufacturingComplexity === 'advanced' || formData.manufacturingComplexity === 'cutting_edge') {
    strategies.push('Implemente Quality by Design (QbD) desde o desenvolvimento');
    strategies.push('Estabeleça parcerias com CDMOs especializadas');
  }

  if (formData.priorApprovals === 'none') {
    strategies.push('Busque aprovação em mercados menos rigorosos primeiro');
    strategies.push('Desenvolva dossier robusto baseado em guidelines internacionais');
  }

  strategies.push('Monitore mudanças regulatórias e guidelines atualizados');
  strategies.push('Mantenha comunicação contínua com agências regulatórias');

  return strategies;
}

function generateAnvisaRequirements(formData: RegulatoryFormData): string[] {
  const requirements: string[] = [
    'Dossiê técnico completo conforme RDC relevante',
    'Certificado de Boas Práticas de Fabricação (CBPF)',
    'Relatório de Segurança e Eficácia',
  ];

  if (formData.productCategory === 'generic') {
    requirements.push('Estudo de bioequivalência/biodisponibilidade');
    requirements.push('Perfil de dissolução comparativo');
  }

  if (formData.productCategory === 'similar') {
    requirements.push('Estudos de comparabilidade farmacocinética');
    requirements.push('Estudos de comparabilidade farmacodinâmica (se aplicável)');
  }

  if (formData.productCategory === 'new' || formData.productCategory === 'biologic') {
    requirements.push('Estudos pré-clínicos completos');
    requirements.push('Estudos clínicos de segurança e eficácia');
    requirements.push('Plano de Gerenciamento de Risco (PGR)');
  }

  if (formData.productCategory === 'biologic' || formData.productCategory === 'cell_gene') {
    requirements.push('Caracterização molecular detalhada');
    requirements.push('Validação de bioensaios e métodos analíticos');
    requirements.push('Plano de Farmacovigilância específico');
  }

  return requirements;
}

function getRiskLevel(riskScore: number): RiskLevel {
  if (riskScore < 30) return RISK_LEVELS[0];
  if (riskScore < 50) return RISK_LEVELS[1];
  if (riskScore < 70) return RISK_LEVELS[2];
  return RISK_LEVELS[3];
}