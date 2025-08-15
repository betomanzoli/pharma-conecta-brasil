
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Brain, Target, BarChart3 } from 'lucide-react';
import { isDemoMode, demoData } from '@/utils/demoMode';

const PredictiveInsights = () => {
  const isDemo = isDemoMode();

  const demoInsights = [
    {
      id: 'market-trend-1',
      type: 'market',
      title: 'Crescimento em Biotecnologia',
      description: 'Setor de biotecnologia farmacêutica deve crescer 18% nos próximos 12 meses.',
      confidence: 92,
      trend: 'up',
      impact: 'high',
      timeframe: '12 meses',
      recommendation: 'Considere expandir parcerias em pesquisa biotecnológica.',
      data: {
        currentValue: 45,
        predictedValue: 65,
        variance: '+44%'
      }
    },
    {
      id: 'regulatory-risk-1',
      type: 'regulatory',
      title: 'Nova Regulamentação ANVISA',
      description: 'Possível atualização da RDC para medicamentos genéricos até março/2024.',
      confidence: 78,
      trend: 'neutral',
      impact: 'medium',
      timeframe: '3 meses',
      recommendation: 'Prepare documentação para compliance antecipada.',
      data: {
        probability: 78,
        impactScore: 65,
        readiness: 45
      }
    },
    {
      id: 'partnership-opportunity',
      type: 'partnership',
      title: 'Oportunidade de Parceria',
      description: 'Alto potencial de match com laboratórios especializados na sua área.',
      confidence: 89,
      trend: 'up',
      impact: 'high',
      timeframe: '1 mês',
      recommendation: 'Ative automação de matching para capturar oportunidades.',
      data: {
        potentialPartners: 12,
        matchScore: 89,
        successRate: 76
      }
    },
    {
      id: 'project-risk',
      type: 'project',
      title: 'Risco em Projeto Ativo',
      description: 'Projeto "Anti-hipertensivo Genérico" pode enfrentar atrasos regulatórios.',
      confidence: 71,
      trend: 'down',
      impact: 'medium',
      timeframe: '2 semanas',
      recommendation: 'Revise cronograma e considere consultor regulatório.',
      data: {
        riskLevel: 71,
        timeDelay: '3-4 semanas',
        mitigation: 65
      }
    }
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case 'market': return <TrendingUp className="h-5 w-5" />;
      case 'regulatory': return <AlertTriangle className="h-5 w-5" />;
      case 'partnership': return <Target className="h-5 w-5" />;
      case 'project': return <BarChart3 className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  if (!isDemo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Insights Preditivos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Insights Preditivos em Desenvolvimento
            </h3>
            <p className="text-muted-foreground">
              Análises preditivas serão baseadas em dados reais da plataforma.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Insights Preditivos</span>
            <Badge className="ml-auto bg-orange-100 text-orange-800">Demo</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Análises preditivas baseadas em IA para tomada de decisões estratégicas.
          </p>
          
          <div className="grid gap-6">
            {demoInsights.map((insight) => (
              <Card key={insight.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        {getIconForType(insight.type)}
                      </div>
                      <div>
                        <CardTitle className="text-base">{insight.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(insight.trend)}
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Confiança da Previsão</span>
                    <span className="text-sm text-muted-foreground">{insight.confidence}%</span>
                  </div>
                  <Progress value={insight.confidence} className="h-2" />
                  
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-medium mb-1">💡 Recomendação:</p>
                    <p className="text-sm text-muted-foreground">
                      {insight.recommendation}
                    </p>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Prazo: {insight.timeframe}
                    </span>
                    <span className="text-muted-foreground">
                      Atualizado há 2h
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveInsights;
