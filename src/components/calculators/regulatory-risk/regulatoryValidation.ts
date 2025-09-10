import { z } from 'zod';

export const regulatoryFormSchema = z.object({
  productCategory: z.string().min(1, 'Categoria do produto é obrigatória'),
  novelty: z.string().min(1, 'Grau de novidade é obrigatório'),
  targetMarkets: z.string().min(1, 'Mercados alvo são obrigatórios'),
  clinicalEvidence: z.string().min(1, 'Evidência clínica é obrigatória'),
  manufacturingComplexity: z.string().min(1, 'Complexidade de manufatura é obrigatória'),
  priorApprovals: z.string().min(1, 'Aprovações prévias são obrigatórias'),
});

export type RegulatoryFormData = z.infer<typeof regulatoryFormSchema>;