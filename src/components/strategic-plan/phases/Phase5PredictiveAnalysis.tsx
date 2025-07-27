
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  Brain,
  Zap,
  Users,
  Shield,
  Eye
} from 'lucide-react';
import { StrategicProject, PredictiveInsights, RiskFactor, MarketTrend } from '@/types/strategic-plan';

interface Phase5PredictiveAnalysisProps {
  projects: StrategicProject[];
  onProjectUpdate: (projects: StrategicProject[]) => void;
}

const Phase5PredictiveAnalysis: React.FC<Phase5PredictiveAnalysisProps> = ({ projects, onProjectUpdate }) => {
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsights[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<any>({});
  const [riskAssessment, setRiskAssessment] = useState<any>({});
  const [strategicRecommendations, setStrategicRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simular análise preditiva
    const mockPredictiveInsights: PredictiveInsights[] = [
      {
        successProbability: 0.87,
        riskFactors: [
          {
            id: 'r1',
            name: 'Mudança Regulatória',
            description: 'Possível alteração na regulamentação ANVISA',
            probability: 0.35,
            impact: 0.8,
            category: 'regulatory',
            mitigationStrategy: 'Monitoramento regulatório contínuo e lobby estratégico',
            status: 'active'
          },
          {
            id: 'r2',
            name: 'Competição Tecnológica',
            description: 'Entrada de novos players com tecnologia disruptiva',
            probability: 0.45,
            impact: 0.65,
            category: 'market',
            mitigationStrategy: 'Aceleração de P&D e parcerias estratégicas',
            status: 'active'
          },
          {
            id: 'r3',
            name: 'Volatilidade Cambial',
            description: 'Impacto de flutuações no dólar para insumos importados',
            probability: 0.6,
            impact: 0.4,
            category: 'financial',
            mitigationStrategy: 'Hedge cambial e diversificação de fornecedores',
            status: 'mitigated'
          }
        ],
        marketTrends: [
          {
            id: 'm1',
            name: 'Telemedicina em Crescimento',
            description: 'Adoção acelerada de soluções de telemedicina pós-pandemia',
            impact: 0.85,
            timeline: '12-24 meses',
            confidence: 0.92,
            source: 'Market Research + AI Analysis'
          },
          {
            id: 'm2',
            name: 'Regulamentação Digital Health',
            description: 'Novas diretrizes para aprovação de dispositivos digitais',
            impact: 0.75,
            timeline: '6-12 meses',
            confidence: 0.78,
            source: 'Regulatory Intelligence'
          },
          {
            id: 'm3',
            name: 'Consolidação do Mercado',
            description: 'Tendência de M&A no setor farmacêutico brasileiro',
            impact: 0.65,
            timeline: '18-36 meses',
            confidence: 0.85,
            source: 'Industry Analysis'
          }
        ],
        competitiveAnalysis: [
          {
            competitor: 'BioTech Leader',
            strengths: ['Forte P&D', 'Parcerias Globais', 'Pipeline Robusto'],
            weaknesses: ['Alto Custo', 'Burocracia', 'Slow to Market'],
            marketShare: 0.25,
            strategicMoves: ['Expansão para Genéricos', 'Aquisições Estratégicas'],
            threatLevel: 0.75
          },
          {
            competitor: 'PharmaCorp',
            strengths: ['Rede Distribuição', 'Marca Forte', 'Eficiência Operacional'],
            weaknesses: ['Pouca Inovação', 'Dependência Mercado Local'],
            marketShare: 0.18,
            strategicMoves: ['Investimento em Digital', 'Parcerias Internacionais'],
            threatLevel: 0.6
          }
        ],
        recommendations: [
          {
            id: 'rec1',
            title: 'Acelerar Parcerias Digitais',
            description: 'Formar alianças estratégicas com startups de health tech',
            priority: 'high',
            expectedImpact: 0.8,
            implementationTime: 6,
            resources: ['Equipe Tech', 'Budget R$ 2M', 'Legal Support'],
            dependencies: ['Aprovação Board', 'Due Diligence'],
            category: 'expansion'
          },
          {
            id: 'rec2',
            title: 'Diversificar Portfolio',
            description: 'Expandir para segmentos de medicina preventiva',
            priority: 'medium',
            expectedImpact: 0.65,
            implementationTime: 12,
            resources: ['P&D Team', 'Clinical Partners', 'Budget R$ 5M'],
            dependencies: ['Market Research', 'Regulatory Approval'],
            category: 'innovation'
          }
        ]
      }
    ];

    const mockMarketAnalysis = {
      overallGrowth: 0.125,
      marketSize: 12.5,
      growthForecast: [
        { period: '2024 Q1', growth: 0.08 },
        { period: '2024 Q2', growth: 0.12 },
        { period: '2024 Q3', growth: 0.15 },
        { period: '2024 Q4', growth: 0.18 }
      ],
      keyDrivers: [
        'Envelhecimento populacional',
        'Digitalização da saúde',
        'Políticas públicas favoráveis',
        'Investimento em P&D'
      ]
    };

    const mockRiskAssessment = {
      overallRiskLevel: 0.42,
      riskCategories: [
        { category: 'Regulatory', level: 0.35, trend: 'stable' },
        { category: 'Market', level: 0.45, trend: 'increasing' },
        { category: 'Financial', level: 0.38, trend: 'decreasing' },
        { category: 'Technical', level: 0.25, trend: 'stable' },
        { category: 'Operational', level: 0.30, trend: 'decreasing' }
      ]
    };

    const mockRecommendations = [
      {
        id: '1',
        title: 'Implementar AI-Driven Decision Making',
        description: 'Utilizar IA para otimizar tomada de decisões estratégicas',
        priority: 'critical',
        expectedImpact: 0.85,
        timeframe: '3-6 meses',
        investmentRequired: 1.2,
        roi: 3.4,
        category: 'optimization'
      },
      {
        id: '2',
        title: 'Expandir Parcerias Internacionais',
        description: 'Formar alianças com players globais para acelerar crescimento',
        priority: 'high',
        expectedImpact: 0.75,
        timeframe: '6-12 meses',
        investmentRequired: 2.8,
        roi: 2.9,
        category: 'expansion'
      }
    ];

    setPredictiveInsights(mockPredictiveInsights);
    setMarketAnalysis(mockMarketAnalysis);
    setRiskAssessment(mockRiskAssessment);
    setStrategicRecommendations(mockRecommendations);
  }, []);

  const runPredictiveAnalysis = async () => {
    setLoading(true);
    // Simular processamento de análise preditiva
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Atualizar insights com novos dados
    const updatedInsights = predictiveInsights.map(insight => ({
      ...insight,
      successProbability: Math.min(0.95, insight.successProbability + 0.03),
      lastUpdated: new Date()
    }));
    
    setPredictiveInsights(updatedInsights);
    setLoading(false);
  };

  const getRiskColor = (level: number) => {
    if (level >= 0.7) return 'text-red-600 bg-red-100';
    if (level >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      case 'stable': return '➡️';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-red-500" />
            <span>Fase 5: Análise Preditiva e Inteligência Estratégica</span>
          </h2>
          <p className="text-gray-600 mt-2">
            Sistema de inteligência estratégica com análise preditiva avançada
          </p>
        </div>
        <Button 
          onClick={runPredictiveAnalysis}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700"
        >
          <Brain className="h-4 w-4 mr-2" />
          {loading ? 'Analisando...' : 'Executar Análise Preditiva'}
        </Button>
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Prob. Sucesso</p>
                <p className="text-2xl font-bold">
                  {predictiveInsights[0] ? Math.round(predictiveInsights[0].successProbability * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Nível de Risco</p>
                <p className="text-2xl font-bold">
                  {Math.round(riskAssessment.overallRiskLevel * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Crescimento Mercado</p>
                <p className="text-2xl font-bold">
                  {Math.round(marketAnalysis.overallGrowth * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Recomendações</p>
                <p className="text-2xl font-bold">{strategicRecommendations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Insights Preditivos</TabsTrigger>
          <TabsTrigger value="risks">Análise de Riscos</TabsTrigger>
          <TabsTrigger value="market">Inteligência de Mercado</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="mt-6">
          <div className="space-y-6">
            {predictiveInsights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-blue-500" />
                      <span>Análise Preditiva</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {Math.round(insight.successProbability * 100)}% Sucesso
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Tendências de Mercado</h4>
                    <div className="space-y-3">
                      {insight.marketTrends.map((trend) => (
                        <div key={trend.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{trend.name}</h5>
                            <Badge variant="outline">
                              Confiança: {Math.round(trend.confidence * 100)}%
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{trend.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span>Impacto: {Math.round(trend.impact * 100)}%</span>
                            <span>Timeline: {trend.timeline}</span>
                            <span>Fonte: {trend.source}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Análise Competitiva</h4>
                    <div className="space-y-3">
                      {insight.competitiveAnalysis.map((comp, compIndex) => (
                        <div key={compIndex} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{comp.competitor}</h5>
                            <Badge className={getRiskColor(comp.threatLevel)}>
                              Ameaça: {Math.round(comp.threatLevel * 100)}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-green-600">Forças:</p>
                              <ul className="list-disc list-inside">
                                {comp.strengths.map((strength, idx) => (
                                  <li key={idx}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-red-600">Fraquezas:</p>
                              <ul className="list-disc list-inside">
                                {comp.weaknesses.map((weakness, idx) => (
                                  <li key={idx}>{weakness}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-blue-600">Movimentos:</p>
                              <ul className="list-disc list-inside">
                                {comp.strategicMoves.map((move, idx) => (
                                  <li key={idx}>{move}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <span>Avaliação de Riscos por Categoria</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAssessment.riskCategories?.map((category: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="font-medium">{category.category}</div>
                        <div className="text-sm">{getTrendIcon(category.trend)} {category.trend}</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32">
                          <Progress value={category.level * 100} className="h-2" />
                        </div>
                        <Badge className={getRiskColor(category.level)}>
                          {Math.round(category.level * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fatores de Risco Específicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveInsights[0]?.riskFactors.map((risk) => (
                    <div key={risk.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{risk.name}</h4>
                        <Badge className={getRiskColor(risk.probability * risk.impact)}>
                          {risk.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Probabilidade</p>
                          <Progress value={risk.probability * 100} className="h-2" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Impacto</p>
                          <Progress value={risk.impact * 100} className="h-2" />
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm"><strong>Estratégia de Mitigação:</strong> {risk.mitigationStrategy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Análise de Mercado</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Crescimento Projetado</h4>
                    <div className="space-y-2">
                      {marketAnalysis.growthForecast?.map((forecast: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{forecast.period}</span>
                          <Badge variant="outline">{Math.round(forecast.growth * 100)}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Principais Drivers</h4>
                    <div className="space-y-2">
                      {marketAnalysis.keyDrivers?.map((driver: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{driver}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <div className="space-y-6">
            {strategicRecommendations.map((rec) => (
              <Card key={rec.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5 text-purple-500" />
                      <span>{rec.title}</span>
                    </CardTitle>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{rec.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(rec.expectedImpact * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Impacto Esperado</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {rec.timeframe}
                      </div>
                      <div className="text-sm text-gray-600">Timeframe</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        R$ {rec.investmentRequired}M
                      </div>
                      <div className="text-sm text-gray-600">Investimento</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {rec.roi}x
                      </div>
                      <div className="text-sm text-gray-600">ROI Esperado</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Phase5PredictiveAnalysis;
