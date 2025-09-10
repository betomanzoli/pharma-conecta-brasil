export const PRODUCT_TYPE_OPTIONS = [
  { value: 'generic_drug', label: 'Medicamento Genérico' },
  { value: 'similar_drug', label: 'Medicamento Similar' },
  { value: 'new_drug', label: 'Medicamento Novo' },
  { value: 'biosimilar', label: 'Biosimilar' },
  { value: 'biological', label: 'Biológico Novo' },
  { value: 'medical_device', label: 'Dispositivo Médico' },
  { value: 'supplement', label: 'Suplemento/Nutracêutico' }
];

export const DEVELOPMENT_COST_OPTIONS = [
  { value: '50000', label: 'Até R$ 50.000' },
  { value: '150000', label: 'R$ 50.000 - R$ 150.000' },
  { value: '500000', label: 'R$ 150.000 - R$ 500.000' },
  { value: '1000000', label: 'R$ 500.000 - R$ 1.000.000' },
  { value: '5000000', label: 'R$ 1.000.000 - R$ 5.000.000' },
  { value: '10000000', label: 'Acima de R$ 5.000.000' }
];

export const TIME_TO_MARKET_OPTIONS = [
  { value: '6', label: 'Até 6 meses' },
  { value: '12', label: '6 - 12 meses' },
  { value: '24', label: '1 - 2 anos' },
  { value: '36', label: '2 - 3 anos' },
  { value: '60', label: '3 - 5 anos' },
  { value: '120', label: 'Mais de 5 anos' }
];

export const MARKET_SIZE_OPTIONS = [
  { value: 'niche', label: 'Nicho (< R$ 10M)' },
  { value: 'small', label: 'Pequeno (R$ 10M - R$ 50M)' },
  { value: 'medium', label: 'Médio (R$ 50M - R$ 200M)' },
  { value: 'large', label: 'Grande (R$ 200M - R$ 1B)' },
  { value: 'massive', label: 'Massivo (> R$ 1B)' }
];

export const COMPETITION_OPTIONS = [
  { value: 'none', label: 'Nenhuma/Mínima' },
  { value: 'low', label: 'Baixa (2-3 concorrentes)' },
  { value: 'moderate', label: 'Moderada (4-8 concorrentes)' },
  { value: 'high', label: 'Alta (8+ concorrentes)' },
  { value: 'saturated', label: 'Mercado Saturado' }
];

export const REGULATORY_COMPLEXITY_OPTIONS = [
  { value: 'minimal', label: 'Mínima (Notificação)' },
  { value: 'low', label: 'Baixa (Registro Simplificado)' },
  { value: 'moderate', label: 'Moderada (Registro Padrão)' },
  { value: 'high', label: 'Alta (Estudos Clínicos)' },
  { value: 'very_high', label: 'Muito Alta (Medicamento Novo)' }
];

export const VIABILITY_WEIGHTS = {
  productType: 0.20,  // 20%
  cost: 0.18,         // 18%
  time: 0.15,         // 15%
  market: 0.22,       // 22%
  competition: 0.15,  // 15%
  regulatory: 0.10    // 10%
};

export const VIABILITY_LEVELS = [
  { min: 85, level: 'Muito Alta', color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-200' },
  { min: 70, level: 'Alta', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' },
  { min: 55, level: 'Média-Alta', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
  { min: 40, level: 'Média', color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200' },
  { min: 0, level: 'Baixa', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' }
];