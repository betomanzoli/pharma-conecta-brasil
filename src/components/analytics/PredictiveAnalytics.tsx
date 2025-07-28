
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Brain,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface PredictiveModel {
  id: string;
  name: string;
  type: 'success_prediction' | 'risk_analysis' | 'market_forecast' | 'partnership_optimization';
  accuracy: number;
  predictions: Prediction[];
  lastUpdated: Date;
  status: 'active' | 'training' | 'inactive';
}

interface Prediction {
  id: string;
  projectId: string;
  projectName: string;
  successProbability: number;
  riskFactors: RiskFactor[];
  marketOpportunity: number;
  recommendedActions: string[];
  confidenceLevel: number;
  timeline: string;
}

interface RiskFactor {
  id: string;
  name: string;
  impact: number;
  probability: number;
  category: 'technical' | 'market' | 'regulatory' | 'financial';
  mitigation: string;
}

interface MarketForecast {
  id: string;
  segment: string;
  currentSize: number;
  projectedSize: number;
  growthRate: number;
  opportunities: string[];
  threats: string[];
  timeframe: string;
}

const PredictiveAnalytics = () => {
  const [selectedModel, setSelectedModel] = useState<string>('success_prediction');
  const [models, setModels] = useState<PredictiveModel[]>([
    {
      id: '1',
      name: 'Predição de Sucesso de Projetos',
      type: 'success_prediction',
      accuracy: 89.5,
      predictions: [
        {
          id: '1',
          projectId: 'proj-001',
          projectName: 'Desenvolvimento Biofármaco Alpha',
          successProbability: 0.87,
          riskFactors: [
            {
              id: '1',
              name: 'Atraso Regulatório',
              impact: 0.8,
              probability: 0.3,
              category: 'regulatory',
              mitigation: 'Preparar documentação com 3 meses de antecedência'
            },
            {
              id: '2',
              name: 'Volatilidade do Mercado',
              impact: 0.6,
              probability: 0.5,
              category: 'market',
              mitigation: 'Diversificar portfolio de produtos'
            }
          ],
          marketOpportunity: 0.92,
          recommendedActions: [
            'Acelerar fase de testes clínicos',
            'Fortalecer parcerias regulatórias',
            'Implementar monitoramento contínuo de riscos'
          ],
          confidenceLevel: 0.94,
          timeline: '18 meses'
        }
      ],
      lastUpdated: new Date('2024-01-15'),
      status: 'active'
    },
    {
      id: '2',
      name: 'Análise de Riscos Avançada',
      type: 'risk_analysis',
      accuracy: 92.3,
      predictions: [],
      lastUpdated: new Date('2024-01-14'),
      status: 'active'
    },
    {
      id: '3',
      name: 'Previsão de Mercado',
      type: 'market_forecast',
      accuracy: 85.7,
      predictions: [],
      lastUpdated: new Date('2024-01-13'),
      status: 'training'
    }
  ]);

  const [marketForecasts, setMarketForecasts] = useState<MarketForecast[]>([
    {
      id: '1',
      segment: 'Oncologia',
      currentSize: 2.5,
      projectedSize: 4.2,
      growthRate: 12.8,
      opportunities: ['Imunoterapia', 'Medicina Personalizada', 'Biossimilares'],
      threats: ['Regulamentação rigorosa', 'Competição internacional', 'Pressão de preços'],
      timeframe: '2024-2027'
    },
    {
      id: '2',
      segment: 'Neurologia',
      currentSize: 1.8,
      projectedSize: 2.9,
      growthRate: 15.2,
      opportunities: ['Alzheimer', 'Doenças Raras', 'Neuroimunologia'],
      threats: ['Complexidade regulatória', 'Alto custo P&D', 'Falhas em ensaios clínicos'],
      timeframe: '2024-2027'
    }
  ]);

  const currentModel = models.find(m => m.id === selectedModel);

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return 'text-green-600';
    if (probability >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProbabilityBgColor = (probability: number) => {
    if (probability >= 0.8) return 'bg-green-100';
    if (probability >= 0.6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getRiskCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'market': return 'bg-purple-100 text-purple-800';
      case 'regulatory': return 'bg-red-100 text-red-800';
      case 'financial': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const runPredictiveAnalysis = async () => {
    console.log('Executando análise preditiva...');
    // Aqui seria implementada a lógica real de análise preditiva
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Análise Preditiva Avançada</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {models.filter(m => m.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Modelos Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">89.5%</div>
              <div className="text-sm text-gray-600">Precisão Média</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">24</div>
              <div className="text-sm text-gray-600">Predições Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">12</div>
              <div className="text-sm text-gray-600">Alertas Gerados</div>
            </div>
          </div>

          <Tabs defaultValue="predictions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="predictions">Predições</TabsTrigger>
              <TabsTrigger value="risks">Análise de Riscos</TabsTrigger>
              <TabsTrigger value="market">Previsão de Mercado</TabsTrigger>
              <TabsTrigger value="models">Modelos</TabsTrigger>
            </TabsList>

            <TabsContent value="predictions" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Predições de Sucesso</h3>
                <Button onClick={runPredictiveAnalysis} className="bg-purple-600 hover:bg-purple-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Executar Análise
                </Button>
              </div>

              <div className="space-y-4">
                {currentModel?.predictions.map((prediction) => (
                  <Card key={prediction.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg">{prediction.projectName}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getProbabilityBgColor(prediction.successProbability)}>
                            {Math.round(prediction.successProbability * 100)}% sucesso
                          </Badge>
                          <Badge variant="outline">
                            {Math.round(prediction.confidenceLevel * 100)}% confiança
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">Probabilidade de Sucesso</span>
                          </div>
                          <Progress value={prediction.successProbability * 100} className="h-3" />
                          <span className={`text-sm font-medium ${getProbabilityColor(prediction.successProbability)}`}>
                            {Math.round(prediction.successProbability * 100)}%
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Oportunidade de Mercado</span>
                          </div>
                          <Progress value={prediction.marketOpportunity * 100} className="h-3" />
                          <span className="text-sm font-medium text-green-600">
                            {Math.round(prediction.marketOpportunity * 100)}%
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Timeline Estimado</span>
                          </div>
                          <span className="text-sm font-medium">{prediction.timeline}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Principais Fatores de Risco:</h5>
                        <div className="space-y-2">
                          {prediction.riskFactors.map((risk) => (
                            <div key={risk.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm">{risk.name}</span>
                                <Badge className={getRiskCategoryColor(risk.category)}>
                                  {risk.category}
                                </Badge>
                              </div>
                              <span className="text-sm text-gray-600">
                                Impact: {Math.round(risk.impact * 100)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Ações Recomendadas:</h5>
                        <div className="space-y-1">
                          {prediction.recommendedActions.map((action, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="risks" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Análise de Riscos por Categoria</h3>
                <p className="text-sm text-gray-600">
                  Avaliação preditiva dos principais riscos identificados nos projetos
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Riscos Técnicos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Falha em testes clínicos</span>
                        <Badge className="bg-red-100 text-red-800">Alto</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Problemas de escalabilidade</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Questões de estabilidade</span>
                        <Badge className="bg-green-100 text-green-800">Baixo</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Riscos Regulatórios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Atraso na aprovação ANVISA</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Mudanças regulatórias</span>
                        <Badge className="bg-red-100 text-red-800">Alto</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Conformidade internacional</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Riscos de Mercado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Entrada de competidores</span>
                        <Badge className="bg-red-100 text-red-800">Alto</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Mudança de demanda</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Volatilidade de preços</span>
                        <Badge className="bg-green-100 text-green-800">Baixo</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Riscos Financeiros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Estouro de orçamento</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dificuldade de financiamento</span>
                        <Badge className="bg-red-100 text-red-800">Alto</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Câmbio desfavorável</span>
                        <Badge className="bg-green-100 text-green-800">Baixo</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="market" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Previsões de Mercado</h3>
                <p className="text-sm text-gray-600">
                  Análise preditiva de tendências e oportunidades de mercado
                </p>
              </div>

              <div className="space-y-4">
                {marketForecasts.map((forecast) => (
                  <Card key={forecast.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg">{forecast.segment}</h4>
                        <Badge className="bg-blue-100 text-blue-800">
                          {forecast.timeframe}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            R$ {forecast.currentSize}B
                          </div>
                          <div className="text-sm text-gray-600">Tamanho Atual</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            R$ {forecast.projectedSize}B
                          </div>
                          <div className="text-sm text-gray-600">Projeção</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {forecast.growthRate}%
                          </div>
                          <div className="text-sm text-gray-600">Crescimento</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2 text-green-700">Oportunidades:</h5>
                          <div className="space-y-1">
                            {forecast.opportunities.map((opportunity, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{opportunity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2 text-red-700">Ameaças:</h5>
                          <div className="space-y-1">
                            {forecast.threats.map((threat, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm">{threat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="models" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Modelos Preditivos</h3>
                <p className="text-sm text-gray-600">
                  Gerenciamento e monitoramento dos modelos de IA
                </p>
              </div>

              <div className="space-y-4">
                {models.map((model) => (
                  <Card key={model.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{model.name}</h4>
                          <p className="text-sm text-gray-600">
                            Última atualização: {model.lastUpdated.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(model.status)}>
                            {model.status}
                          </Badge>
                          <Badge variant="outline">
                            {model.accuracy}% precisão
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Tipo</span>
                          <p className="font-medium">{model.type}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Predições</span>
                          <p className="font-medium">{model.predictions.length}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Precisão</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={model.accuracy} className="flex-1" />
                            <span className="text-sm font-medium">{model.accuracy}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Alert className="mt-6">
            <Brain className="h-4 w-4" />
            <AlertDescription>
              <strong>Análise Preditiva Avançada:</strong> Nossos modelos utilizam machine learning 
              e dados históricos para fornecer previsões precisas sobre sucesso de projetos, 
              riscos potenciais e oportunidades de mercado.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
