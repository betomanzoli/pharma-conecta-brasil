import { z } from 'zod';

export const costFormSchema = z.object({
  productType: z.string().min(1, 'Tipo de produto é obrigatório'),
  developmentPhase: z.string().min(1, 'Fase de desenvolvimento é obrigatória'),
  teamSize: z.string().min(1, 'Tamanho da equipe é obrigatório'),
  duration: z.string().min(1, 'Duração estimada é obrigatória'),
  complexity: z.string().min(1, 'Complexidade é obrigatória'),
  regulatoryPath: z.string().min(1, 'Caminho regulatório é obrigatório'),
});

export type CostFormData = z.infer<typeof costFormSchema>;