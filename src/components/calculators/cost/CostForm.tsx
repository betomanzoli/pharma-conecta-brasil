import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';
import { CostFormData } from './types';
import {
  PRODUCT_TYPES,
  DEVELOPMENT_PHASES,
  TEAM_SIZES,
  DURATIONS,
  COMPLEXITIES,
  REGULATORY_PATHS,
} from './costConstants';

interface CostFormProps {
  formData: CostFormData;
  onChange: (field: keyof CostFormData, value: string) => void;
  onSubmit: () => void;
  isValid: boolean;
}

const CostForm: React.FC<CostFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isValid,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Parâmetros do Projeto
        </CardTitle>
        <CardDescription>
          Forneça informações sobre seu projeto para estimativa precisa de custos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="productType">Tipo de Produto *</Label>
            <Select value={formData.productType} onValueChange={(value) => onChange('productType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="developmentPhase">Fase de Desenvolvimento *</Label>
            <Select value={formData.developmentPhase} onValueChange={(value) => onChange('developmentPhase', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a fase" />
              </SelectTrigger>
              <SelectContent>
                {DEVELOPMENT_PHASES.map((phase) => (
                  <SelectItem key={phase.value} value={phase.value}>
                    {phase.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamSize">Tamanho da Equipe *</Label>
            <Select value={formData.teamSize} onValueChange={(value) => onChange('teamSize', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tamanho" />
              </SelectTrigger>
              <SelectContent>
                {TEAM_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duração Estimada *</Label>
            <Select value={formData.duration} onValueChange={(value) => onChange('duration', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a duração" />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((duration) => (
                  <SelectItem key={duration.value} value={duration.value}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="complexity">Complexidade *</Label>
            <Select value={formData.complexity} onValueChange={(value) => onChange('complexity', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a complexidade" />
              </SelectTrigger>
              <SelectContent>
                {COMPLEXITIES.map((complexity) => (
                  <SelectItem key={complexity.value} value={complexity.value}>
                    {complexity.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="regulatoryPath">Caminho Regulatório *</Label>
            <Select value={formData.regulatoryPath} onValueChange={(value) => onChange('regulatoryPath', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o caminho" />
              </SelectTrigger>
              <SelectContent>
                {REGULATORY_PATHS.map((path) => (
                  <SelectItem key={path.value} value={path.value}>
                    {path.label}
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
          Calcular Custos
        </Button>
      </CardContent>
    </Card>
  );
};

export default CostForm;