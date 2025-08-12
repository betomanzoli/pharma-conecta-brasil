
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  Heart, 
  Leaf, 
  Users, 
  Lightbulb,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ValueMetrics {
  economic: number;
  social: number;
  environmental: number;
  stakeholder: number;
  innovation: number;
}

const SharedValueSystem: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [valueMetrics, setValueMetrics] = useState<ValueMetrics>({
    economic: 85,
    social: 78,
    environmental: 72,
    stakeholder: 90,
    innovation: 88
  });

  const calculateTotalValue = () => {
    const total = Object.values(valueMetrics).reduce((sum, value) => sum + value, 0);
    return Math.round(total / Object.keys(valueMetrics).length);
  };

  const handleRecalculate = async () => {
    setLoading(true);
    try {
      // Simular recálculo dos valores
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setValueMetrics({
        economic: Math.round(80 + Math.random() * 20),
        social: Math.round(75 + Math.random() * 20),
        environmental: Math.round(70 + Math.random() * 25),
        stakeholder: Math.round(85 + Math.random() * 15),
        innovation: Math.round(85 + Math.random() * 15)
      });

      toast({
        title: "Valor Compartilhado Atualizado",
        description: "Métricas recalculadas com base nos projetos atuais"
      });
    } finally {
      setLoading(false);
    }
  };

  const getValueIcon = (type: string) => {
    switch (type) {
      case 'economic': return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'social': return <Heart className="h-5 w-5 text-red-500" />;
      case 'environmental': return <Leaf className="h-5 w-5 text-green-600" />;
      case 'stakeholder': return <Users className="h-5 w-5 text-blue-500" />;
      case 'innovation': return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      default: return <Target className="h-5 w-5 text-gray-500" />;
    }
  };

  const getValueColor = (value: number) => {
    if (value >= 85) return 'text-green-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalValue = calculateTotalValue();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center space-x-2">
          <PieChart className="h-6 w-6 text-purple-500" />
          <span>Sistema de Valor Compartilhado</span>
        </h2>
        <p className="text-gray-600">
          Medindo o impacto multidimensional dos projetos colaborativos
        </p>
      </div>

      {/* Score Total */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Índice Total de Valor Compartilhado</span>
            <Badge className={`text-2xl px-4 py-2 ${
              totalValue >= 85 ? 'bg-green-100 text-green-800' :
              totalValue >= 70 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {totalValue}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={totalValue} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            {totalValue >= 85 ? 'Excelente performance' :
             totalValue >= 70 ? 'Boa performance' :
             'Necessita melhorias'}
          </p>
        </CardContent>
      </Card>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getValueIcon('economic')}
                <h3 className="font-semibold">Valor Econômico</h3>
              </div>
              <span className={`text-2xl font-bold ${getValueColor(valueMetrics.economic)}`}>
                {valueMetrics.economic}%
              </span>
            </div>
            <Progress value={valueMetrics.economic} className="mb-2" />
            <p className="text-sm text-gray-600">
              ROI, redução de custos, novos negócios
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getValueIcon('social')}
                <h3 className="font-semibold">Valor Social</h3>
              </div>
              <span className={`text-2xl font-bold ${getValueColor(valueMetrics.social)}`}>
                {valueMetrics.social}%
              </span>
            </div>
            <Progress value={valueMetrics.social} className="mb-2" />
            <p className="text-sm text-gray-600">
              Acesso à saúde, empregos gerados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getValueIcon('environmental')}
                <h3 className="font-semibold">Valor Ambiental</h3>
              </div>
              <span className={`text-2xl font-bold ${getValueColor(valueMetrics.environmental)}`}>
                {valueMetrics.environmental}%
              </span>
            </div>
            <Progress value={valueMetrics.environmental} className="mb-2" />
            <p className="text-sm text-gray-600">
              Sustentabilidade, redução de resíduos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getValueIcon('stakeholder')}
                <h3 className="font-semibold">Valor Stakeholder</h3>
              </div>
              <span className={`text-2xl font-bold ${getValueColor(valueMetrics.stakeholder)}`}>
                {valueMetrics.stakeholder}%
              </span>
            </div>
            <Progress value={valueMetrics.stakeholder} className="mb-2" />
            <p className="text-sm text-gray-600">
              Satisfação de parceiros e clientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getValueIcon('innovation')}
                <h3 className="font-semibold">Valor Inovação</h3>
              </div>
              <span className={`text-2xl font-bold ${getValueColor(valueMetrics.innovation)}`}>
                {valueMetrics.innovation}%
              </span>
            </div>
            <Progress value={valueMetrics.innovation} className="mb-2" />
            <p className="text-sm text-gray-600">
              Patentes, novos produtos, P&D
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-600 mb-2">Próxima Dimensão</h3>
            <p className="text-sm text-gray-500">
              Adicionar nova métrica de valor
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Configurar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Insights e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Insights de Valor Compartilhado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-1">Pontos Fortes</h5>
              <p className="text-sm text-green-700">
                Excelente engajamento de stakeholders (90%) e alta taxa de inovação (88%). 
                Parcerias estão gerando valor significativo para todos os envolvidos.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-1">Oportunidades</h5>
              <p className="text-sm text-yellow-700">
                Valor ambiental (72%) pode ser melhorado com iniciativas de sustentabilidade. 
                Considere projetos com foco em economia circular e redução de pegada de carbono.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-1">Próximos Passos</h5>
              <p className="text-sm text-blue-700">
                Implementar métricas de impacto social mais detalhadas e criar programa 
                de incentivos para projetos com alto valor compartilhado.
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={handleRecalculate}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Recalculando...' : 'Atualizar Métricas'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedValueSystem;
