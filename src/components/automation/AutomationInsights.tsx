
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Zap, CheckCircle2 } from 'lucide-react';

const AutomationInsights = () => {
  const insights = [
    {
      id: 'efficiency-boost',
      title: 'Aumento de Eficiência',
      description: 'Automação de processos resulta em 40% menos tempo de execução',
      impact: 'Alto',
      progress: 85,
      category: 'Produtividade',
      icon: TrendingUp
    },
    {
      id: 'cost-reduction',
      title: 'Redução de Custos',
      description: 'Economia de R$ 2.3M anuais em processos automatizados',
      impact: 'Alto',
      progress: 92,
      category: 'Financeiro',
      icon: CheckCircle2
    },
    {
      id: 'time-savings',
      title: 'Economia de Tempo',
      description: '480 horas/mês economizadas com automação de relatórios',
      impact: 'Médio',
      progress: 67,
      category: 'Operacional',
      icon: Clock
    },
    {
      id: 'quality-improvement',
      title: 'Melhoria de Qualidade',
      description: '98% de precisão em processos automatizados vs 85% manual',
      impact: 'Alto',
      progress: 98,
      category: 'Qualidade',
      icon: Zap
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Alto': return 'bg-green-100 text-green-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Baixo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Insights de Automação</h3>
        <p className="text-gray-600 text-sm">
          Análise do impacto das automações implementadas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <Card key={insight.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                      <CardDescription className="text-xs">{insight.category}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getImpactColor(insight.impact)} variant="secondary">
                    {insight.impact}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{insight.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progresso</span>
                    <span>{insight.progress}%</span>
                  </div>
                  <Progress value={insight.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Próximas Oportunidades</CardTitle>
          <CardDescription className="text-blue-700">
            Áreas identificadas para futuras automações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <h4 className="font-medium text-sm">Automação de Compliance</h4>
                <p className="text-xs text-gray-600">Monitoramento regulatório automático</p>
              </div>
              <Badge variant="outline">Em Análise</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <h4 className="font-medium text-sm">IA para Análise de Dados</h4>
                <p className="text-xs text-gray-600">Insights automáticos de performance</p>
              </div>
              <Badge variant="outline">Planejado</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationInsights;
