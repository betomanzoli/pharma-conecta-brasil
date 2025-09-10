export const PRODUCT_CATEGORIES = [
  { value: 'generic', label: 'Medicamento Genérico', risk: 10 },
  { value: 'similar', label: 'Medicamento Similar', risk: 20 },
  { value: 'reference', label: 'Medicamento de Referência', risk: 40 },
  { value: 'new', label: 'Medicamento Novo', risk: 60 },
  { value: 'biologic', label: 'Medicamento Biológico', risk: 70 },
  { value: 'cell_gene', label: 'Terapia Celular/Gênica', risk: 85 },
];

export const NOVELTY_LEVELS = [
  { value: 'known', label: 'Molécula conhecida - formulação padrão', risk: 5 },
  { value: 'new_formulation', label: 'Molécula conhecida - nova formulação', risk: 25 },
  { value: 'new_indication', label: 'Molécula conhecida - nova indicação', risk: 40 },
  { value: 'new_molecule', label: 'Nova entidade molecular', risk: 70 },
  { value: 'first_in_class', label: 'Primeira da classe terapêutica', risk: 90 },
];

export const TARGET_MARKETS = [
  { value: 'brazil_only', label: 'Apenas Brasil', risk: 0 },
  { value: 'latam', label: 'América Latina', risk: 15 },
  { value: 'emerging', label: 'Mercados emergentes', risk: 25 },
  { value: 'us_eu', label: 'EUA/Europa', risk: 40 },
  { value: 'global', label: 'Mercado global', risk: 50 },
];

export const CLINICAL_EVIDENCE = [
  { value: 'extensive', label: 'Evidência robusta - múltiplos estudos', risk: 5 },
  { value: 'adequate', label: 'Evidência adequada - estudos pivotais', risk: 20 },
  { value: 'limited', label: 'Evidência limitada - estudos iniciais', risk: 50 },
  { value: 'preclinical', label: 'Apenas dados pré-clínicos', risk: 80 },
  { value: 'none', label: 'Dados insuficientes', risk: 95 },
];

export const MANUFACTURING_COMPLEXITY = [
  { value: 'simple', label: 'Processo simples - sólidos orais', risk: 5 },
  { value: 'moderate', label: 'Processo moderado - líquidos/semi-sólidos', risk: 20 },
  { value: 'complex', label: 'Processo complexo - injetáveis', risk: 40 },
  { value: 'advanced', label: 'Processo avançado - biológicos', risk: 60 },
  { value: 'cutting_edge', label: 'Processo inovador - terapias avançadas', risk: 85 },
];

export const PRIOR_APPROVALS = [
  { value: 'multiple_fda_ema', label: 'Múltiplas aprovações (FDA/EMA)', risk: -20 },
  { value: 'fda_or_ema', label: 'Aprovação FDA ou EMA', risk: -10 },
  { value: 'other_stringent', label: 'Outras agências rigorosas', risk: 0 },
  { value: 'emerging_only', label: 'Apenas mercados emergentes', risk: 10 },
  { value: 'none', label: 'Nenhuma aprovação prévia', risk: 30 },
];

export const RISK_LEVELS = [
  {
    level: 'Baixo',
    range: '0-30%',
    description: 'Risco regulatório baixo - alta probabilidade aprovação',
    color: 'text-green-600',
  },
  {
    level: 'Moderado',
    range: '30-50%',
    description: 'Risco moderado - preparação adequada necessária',
    color: 'text-yellow-600',
  },
  {
    level: 'Alto',
    range: '50-70%',
    description: 'Alto risco - estratégia robusta obrigatória',
    color: 'text-orange-600',
  },
  {
    level: 'Crítico',
    range: '70-100%',
    description: 'Risco crítico - assessoria especializada essencial',
    color: 'text-red-600',
  },
];

export const REGULATORY_PATHS = {
  generic: 'Via Genérico - Bioequivalência',
  similar: 'Via Similar - Comparabilidade',
  reference: 'Via Referência - Dados completos',
  new: 'Via Individual - Dossiê completo',
  biologic: 'Via Biológico - Comparabilidade ou Individual',
  cell_gene: 'Via Produto Inovador - Fast Track possível',
};