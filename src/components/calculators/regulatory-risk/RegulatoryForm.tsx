import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield } from 'lucide-react';
import { RegulatoryFormData } from './types';
import {
  PRODUCT_CATEGORIES,
  NOVELTY_LEVELS,
  TARGET_MARKETS,
  CLINICAL_EVIDENCE,
  MANUFACTURING_COMPLEXITY,
  PRIOR_APPROVALS,
} from './regulatoryConstants';

interface RegulatoryFormProps {
  formData: RegulatoryFormData;
  onChange: (field: keyof RegulatoryFormData, value: string) => void;
  onSubmit: () => void;
  isValid: boolean;
}

const RegulatoryForm: React.FC<RegulatoryFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isValid,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Avaliação de Risco Regulatório
        </CardTitle>
        <CardDescription>
          Avalie a probabilidade de aprovação ANVISA e identifique fatores críticos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="productCategory">Categoria do Produto *</Label>
            <Select value={formData.productCategory} onValueChange={(value) => onChange('productCategory', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="novelty">Grau de Novidade *</Label>
            <Select value={formData.novelty} onValueChange={(value) => onChange('novelty', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o grau" />
              </SelectTrigger>
              <SelectContent>
                {NOVELTY_LEVELS.map((novelty) => (
                  <SelectItem key={novelty.value} value={novelty.value}>
                    {novelty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetMarkets">Mercados Alvo *</Label>
            <Select value={formData.targetMarkets} onValueChange={(value) => onChange('targetMarkets', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione os mercados" />
              </SelectTrigger>
              <SelectContent>
                {TARGET_MARKETS.map((market) => (
                  <SelectItem key={market.value} value={market.value}>
                    {market.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinicalEvidence">Evidência Clínica *</Label>
            <Select value={formData.clinicalEvidence} onValueChange={(value) => onChange('clinicalEvidence', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a evidência" />
              </SelectTrigger>
              <SelectContent>
                {CLINICAL_EVIDENCE.map((evidence) => (
                  <SelectItem key={evidence.value} value={evidence.value}>
                    {evidence.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manufacturingComplexity">Complexidade de Manufatura *</Label>
            <Select value={formData.manufacturingComplexity} onValueChange={(value) => onChange('manufacturingComplexity', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a complexidade" />
              </SelectTrigger>
              <SelectContent>
                {MANUFACTURING_COMPLEXITY.map((complexity) => (
                  <SelectItem key={complexity.value} value={complexity.value}>
                    {complexity.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priorApprovals">Aprovações Prévias *</Label>
            <Select value={formData.priorApprovals} onValueChange={(value) => onChange('priorApprovals', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione as aprovações" />
              </SelectTrigger>
              <SelectContent>
                {PRIOR_APPROVALS.map((approval) => (
                  <SelectItem key={approval.value} value={approval.value}>
                    {approval.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={onSubmit}
          className="w-full"
          disabled={!isValid}
        >
          Avaliar Risco Regulatório
        </Button>
      </CardContent>
    </Card>
  );
};

export default RegulatoryForm;