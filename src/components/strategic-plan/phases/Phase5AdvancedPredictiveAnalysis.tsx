
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Brain, Target, CheckCircle2, Zap } from 'lucide-react';

const Phase5AdvancedPredictiveAnalysis = () => {
  const analyticsKPIs = [
    { label: 'Precisão das Previsões', value: '94.7%', change: '+12.3%' },
    { label: 'Modelos AI Ativos', value: '23', change: '+15' },
    { label: 'Insights Gerados/Dia', value: '847', change: '+340%' },
    { label: 'Tempo de Processamento', value: '1.2s', change: '-65%' }
  ];

  const aiModels = [
    'Previsão de demanda farmacêutica',
    'Análise de riscos regulatórios',
    'Otimização de supply chain',
    'Detecção de oportunidades de mercado',
    'Previsão de tendências de saúde'
  ];

  const realTimeMetrics = [
    { metric: 'CPU Usage', value: '23%', status: 'good' },
    { metric: 'Memory Usage', value: '45%', status: 'good' },
    { metric: 'Active Models', value: '23/23', status: 'excellent' },
    { metric: 'Queue Length', value: '12', status: 'good' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-indigo-500 text-white">
            <BarChart3 className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Fase 5: Advanced Predictive Analysis</h2>
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              100% Implementado
            </Badge>
          </div>
        </div>
        <Progress value={100} className="w-full max-w-md mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsKPIs.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-indigo-500">{kpi.value}</div>
              <div className="text-sm text-muted-foreground">{kpi.label}</div>
              <div className="text-xs text-green-500">{kpi.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Modelos de IA Implementados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiModels.map((model, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{model}</span>
                  <Badge variant="outline" className="ml-auto">
                    <Zap className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {realTimeMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{metric.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{metric.value}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      metric.status === 'excellent' ? 'bg-green-500' :
                      metric.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insights Recentes da IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <p className="text-sm font-medium">Oportunidade Detectada</p>
              <p className="text-sm text-muted-foreground">
                Aumento de 25% na demanda por medicamentos oncológicos previsto para Q2/2024
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <p className="text-sm font-medium">Otimização Sugerida</p>
              <p className="text-sm text-muted-foreground">
                Redução de 15% nos custos de logística através de reorganização de rotas
              </p>
            </div>
            <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
              <p className="text-sm font-medium">Alerta Regulatório</p>
              <p className="text-sm text-muted-foreground">
                Nova regulamentação ANVISA pode impactar 12 produtos na linha atual
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase5AdvancedPredictiveAnalysis;
