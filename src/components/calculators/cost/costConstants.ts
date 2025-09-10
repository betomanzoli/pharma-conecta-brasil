export const PRODUCT_TYPES = [
  { value: 'generic', label: 'Medicamento Genérico', multiplier: 1.0 },
  { value: 'similar', label: 'Medicamento Similar', multiplier: 1.2 },
  { value: 'new', label: 'Medicamento Novo', multiplier: 2.0 },
  { value: 'biologic', label: 'Medicamento Biológico', multiplier: 3.5 },
  { value: 'orphan', label: 'Medicamento Órfão', multiplier: 4.0 },
];

export const DEVELOPMENT_PHASES = [
  { value: 'preclinical', label: 'Pré-clínico', multiplier: 0.8 },
  { value: 'phase1', label: 'Fase I', multiplier: 1.0 },
  { value: 'phase2', label: 'Fase II', multiplier: 1.5 },
  { value: 'phase3', label: 'Fase III', multiplier: 2.5 },
  { value: 'registration', label: 'Registro', multiplier: 0.6 },
];

export const TEAM_SIZES = [
  { value: 'small', label: 'Pequena (5-10 pessoas)', multiplier: 0.8 },
  { value: 'medium', label: 'Média (11-25 pessoas)', multiplier: 1.0 },
  { value: 'large', label: 'Grande (26-50 pessoas)', multiplier: 1.4 },
  { value: 'enterprise', label: 'Corporativa (50+ pessoas)', multiplier: 2.0 },
];

export const DURATIONS = [
  { value: 'short', label: '6-12 meses', multiplier: 0.6 },
  { value: 'medium', label: '1-2 anos', multiplier: 1.0 },
  { value: 'long', label: '2-4 anos', multiplier: 1.8 },
  { value: 'extended', label: '4+ anos', multiplier: 2.5 },
];

export const COMPLEXITIES = [
  { value: 'low', label: 'Baixa - Formulação simples', multiplier: 0.7 },
  { value: 'medium', label: 'Média - Formulação moderada', multiplier: 1.0 },
  { value: 'high', label: 'Alta - Formulação complexa', multiplier: 1.6 },
  { value: 'critical', label: 'Crítica - Inovação disruptiva', multiplier: 2.5 },
];

export const REGULATORY_PATHS = [
  { value: 'generic', label: 'Via Genérico (Bioequivalência)', multiplier: 1.0 },
  { value: 'similar', label: 'Via Similar (Comparabilidade)', multiplier: 1.3 },
  { value: 'individual', label: 'Via Individual (Dados próprios)', multiplier: 2.0 },
  { value: 'orphan', label: 'Via Órfã (Fast Track)', multiplier: 1.8 },
];

export const BASE_COSTS = {
  development: 500000, // R$ 500k base
  regulatory: 200000,  // R$ 200k base
  quality: 150000,     // R$ 150k base
  production: 300000,  // R$ 300k base
};

export const COST_LEVELS = [
  {
    level: 'Baixo',
    range: 'R$ 200k - 800k',
    description: 'Projeto de baixo investimento',
    color: 'text-green-600',
  },
  {
    level: 'Moderado',
    range: 'R$ 800k - 2M',
    description: 'Investimento moderado típico',
    color: 'text-yellow-600',
  },
  {
    level: 'Alto',
    range: 'R$ 2M - 5M',
    description: 'Alto investimento necessário',
    color: 'text-orange-600',
  },
  {
    level: 'Crítico',
    range: 'R$ 5M+',
    description: 'Investimento crítico - análise detalhada',
    color: 'text-red-600',
  },
];