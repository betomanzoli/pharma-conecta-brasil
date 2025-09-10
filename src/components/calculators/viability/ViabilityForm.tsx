import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ViabilityFormData } from "./types";
import { 
  PRODUCT_TYPE_OPTIONS, 
  DEVELOPMENT_COST_OPTIONS, 
  TIME_TO_MARKET_OPTIONS,
  MARKET_SIZE_OPTIONS,
  COMPETITION_OPTIONS,
  REGULATORY_COMPLEXITY_OPTIONS
} from "./viabilityConstants";

interface ViabilityFormProps {
  formData: ViabilityFormData;
  onFieldChange: (field: keyof ViabilityFormData, value: string) => void;
}

const FormField: React.FC<{
  label: string;
  tooltip: string;
  children: React.ReactNode;
}> = ({ label, tooltip, children }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium">{label}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    {children}
  </div>
);

const ViabilityForm: React.FC<ViabilityFormProps> = ({ formData, onFieldChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField 
        label="Tipo de Produto"
        tooltip="Categoria do produto que você pretende desenvolver. Diferentes tipos têm complexidades regulatórias distintas."
      >
        <Select 
          value={formData.productType} 
          onValueChange={(value) => onFieldChange('productType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_TYPE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField 
        label="Custo de Desenvolvimento"
        tooltip="Estimativa total de investimento necessário para desenvolvimento, incluindo P&D, testes, documentação regulatória e aprovação."
      >
        <Select 
          value={formData.developmentCost} 
          onValueChange={(value) => onFieldChange('developmentCost', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a faixa" />
          </SelectTrigger>
          <SelectContent>
            {DEVELOPMENT_COST_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField 
        label="Tempo até o Mercado"
        tooltip="Período estimado desde o início do desenvolvimento até a aprovação regulatória e lançamento no mercado."
      >
        <Select 
          value={formData.timeToMarket} 
          onValueChange={(value) => onFieldChange('timeToMarket', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            {TIME_TO_MARKET_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField 
        label="Tamanho do Mercado"
        tooltip="Potencial de mercado anual no Brasil para seu produto. Baseado em dados de vendas de produtos similares."
      >
        <Select 
          value={formData.marketSize} 
          onValueChange={(value) => onFieldChange('marketSize', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tamanho" />
          </SelectTrigger>
          <SelectContent>
            {MARKET_SIZE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField 
        label="Nível de Competição"
        tooltip="Quantidade e força dos concorrentes já estabelecidos no mercado-alvo."
      >
        <Select 
          value={formData.competition} 
          onValueChange={(value) => onFieldChange('competition', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o nível" />
          </SelectTrigger>
          <SelectContent>
            {COMPETITION_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField 
        label="Complexidade Regulatória"
        tooltip="Nível de exigências regulatórias da ANVISA para aprovação do seu tipo de produto."
      >
        <Select 
          value={formData.regulatoryComplexity} 
          onValueChange={(value) => onFieldChange('regulatoryComplexity', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a complexidade" />
          </SelectTrigger>
          <SelectContent>
            {REGULATORY_COMPLEXITY_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    </div>
  );
};

export default ViabilityForm;