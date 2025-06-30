
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Clock,
  Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ROIResult {
  roi_percentage: number;
  investment_amount: number;
  expected_return: number;
  profit: number;
  monthly_return: number;
  timeline_months: number;
  risk_score: number;
  risk_category: string;
  recommendations: string[];
  industry_benchmarks: any;
  calculation_details: any;
}

const ROICalculator = () => {
  const [formData, setFormData] = useState({
    project_type: '',
    investment_amount: '',
    timeline_months: '',
    market_size: '',
    competition_level: '',
    regulatory_complexity: ''
  });
  const [result, setResult] = useState<ROIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async () => {
    if (!formData.project_type || !formData.investment_amount) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('roi-calculator', {
        body: {
          project_type: formData.project_type,
          investment_amount: parseFloat(formData.investment_amount),
          timeline_months: parseInt(formData.timeline_months) || 12,
          market_size: formData.market_size || 'medium',
          competition_level: formData.competition_level || 'medium',
          regulatory_complexity: formData.regulatory_complexity || 'medium'
        }
      });

      if (error) throw error;

      if (data.success) {
        setResult(data.roi_analysis);
        toast({
          title: "Cálculo Completo!",
          description: `ROI estimado: ${data.roi_analysis.roi_percentage}%`,
        });
      }
    } catch (error) {
      console.error('Erro no cálculo de ROI:', error);
      toast({
        title: "Erro",
        description: "Falha ao calcular ROI",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = (category: string) => {
    switch (category) {
      case 'Alto': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Médio': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Baixo': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-[#1565C0]" />
            <span>Calculadora de ROI Farmacêutico</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Projeto *</label>
              <Select 
                value={formData.project_type} 
                onValueChange={(value) => setFormData({...formData, project_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="research">Pesquisa & Desenvolvimento</SelectItem>
                  <SelectItem value="manufacturing">Manufatura</SelectItem>
                  <SelectItem value="distribution">Distribuição</SelectItem>
                  <SelectItem value="regulatory">Regulatório</SelectItem>
                  <SelectItem value="clinical_trials">Ensaios Clínicos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Investimento (R$) *</label>
              <Input
                type="number"
                placeholder="Ex: 500000"
                value={formData.investment_amount}
                onChange={(e) => setFormData({...formData, investment_amount: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prazo (meses)</label>
              <Input
                type="number"
                placeholder="Ex: 24"
                value={formData.timeline_months}
                onChange={(e) => setFormData({...formData, timeline_months: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tamanho do Mercado</label>
              <Select 
                value={formData.market_size} 
                onValueChange={(value) => setFormData({...formData, market_size: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Pequeno</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                  <SelectItem value="very_large">Muito Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nível de Concorrência</label>
              <Select 
                value={formData.competition_level} 
                onValueChange={(value) => setFormData({...formData, competition_level: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="very_high">Muito Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Complexidade Regulatória</label>
              <Select 
                value={formData.regulatory_complexity} 
                onValueChange={(value) => setFormData({...formData, regulatory_complexity: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="very_high">Muito Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleCalculate}
            disabled={loading}
            className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {loading ? 'Calculando...' : 'Calcular ROI'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Análise Financeira</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-medium">ROI Estimado</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {result.roi_percentage}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Investimento</p>
                    <p className="font-semibold">{formatCurrency(result.investment_amount)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Retorno Esperado</p>
                    <p className="font-semibold">{formatCurrency(result.expected_return)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Lucro</p>
                    <p className="font-semibold text-green-600">{formatCurrency(result.profit)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Retorno Mensal</p>
                    <p className="font-semibold">{formatCurrency(result.monthly_return)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span>Análise de Risco</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {getRiskIcon(result.risk_category)}
                    <span className="font-medium">Nível de Risco</span>
                  </div>
                  <Badge variant="outline">
                    {result.risk_category} ({result.risk_score}%)
                  </Badge>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Prazo do Projeto</span>
                  <span className="font-semibold">{result.timeline_months} meses</span>
                </div>

                <div>
                  <p className="font-medium mb-2">Recomendações:</p>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                        <span className="text-[#1565C0] mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ROICalculator;
