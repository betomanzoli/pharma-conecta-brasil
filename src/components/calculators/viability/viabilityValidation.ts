import { z } from "zod";

export const viabilityFormSchema = z.object({
  productType: z.string().min(1, "Selecione o tipo de produto"),
  developmentCost: z.string().min(1, "Informe o custo de desenvolvimento"),
  timeToMarket: z.string().min(1, "Informe o tempo até o mercado"),
  marketSize: z.string().min(1, "Selecione o tamanho do mercado"),
  competition: z.string().min(1, "Selecione o nível de competição"),
  regulatoryComplexity: z.string().min(1, "Selecione a complexidade regulatória")
});

export type ValidatedViabilityFormData = z.infer<typeof viabilityFormSchema>;