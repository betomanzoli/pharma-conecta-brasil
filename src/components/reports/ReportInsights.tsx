import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  DollarSign,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Zap
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'achievement' | 'trend';
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  metric?: {
    value: string;
    change: number;
    changeType: 'increase' | 'decrease';
  };
  actionable: boolean;
  dateGenerated: string;
}

interface KPICard {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ElementType;
  description: string;
}

const ReportInsights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [kpis, setKPIs] = useState<KPICard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de insights
    const loadInsights = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setInsights([
        {
          id: '1',
          type: 'opportunity',
          category: 'IA Matching',
          title: 'Oportunidade de Melhoria no Algoritmo',
          description: 'O algoritmo de matching está performando 15% abaixo do esperado para empresas do setor farmacêutico.',
          impact: 'high',
          confidence: 87,
          metric: {
            value: '73%',
            change: -15,
            changeType: 'decrease'
          },
          actionable: true,
          dateGenerated: '2024-01-15'
        },
        {
          id: '2',
          type: 'achievement',
          category: 'Compliance',
          title: 'Meta de Compliance Alcançada',
          description: 'Sua empresa atingiu 98% de conformidade regulatória, superando a meta de 95%.',
          impact: 'high',
          confidence: 95,
          metric: {
            value: '98%',
            change: 12,
            changeType: 'increase'
          },
          actionable: false,
          dateGenerated: '2024-01-14'
        },
        {
          id: '3',
          type: 'trend',
          category: 'Rede',
          title: 'Crescimento Acelerado de Conexões',
          description: 'Observamos um crescimento de 34% nas conexões de qualidade nas últimas 4 semanas.',
          impact: 'medium',
          confidence: 82,
          metric: {
            value: '234',
            change: 34,
            changeType: 'increase'
          },
          actionable: true,
          dateGenerated: '2024-01-13'
        },
        {
          id: '4',
          type: 'warning',
          category: 'Financeiro',
          title: 'Redução na Margem de Lucro',
          description: 'A margem de lucro das parcerias recentes diminuiu 8% comparado ao trimestre anterior.',
          impact: 'medium',
          confidence: 79,
          metric: {
            value: '23%',
            change: -8,
            changeType: 'decrease'
          },
          actionable: true,
          dateGenerated: '2024-01-12'
        },
        {
          id: '5',
          type: 'opportunity',
          category: 'Mercado',
          title: 'Nicho Emergente Identificado',
          description: 'Detectamos uma demanda crescente por soluções de bioequivalência na região Nordeste.',
          impact: 'high',
          confidence: 91,
          actionable: true,
          dateGenerated: '2024-01-11'
        }
      ]);

      setKPIs([
        {
          title: 'Score de IA Matching',
          value: '87.3%',
          change: 5.2,
          changeType: 'increase',
          icon: Target,
          description: 'Precisão do algoritmo de matching'
        },
        {
          title: 'ROI de Parcerias',
          value: 'R$ 2.4M',
          change: -2.1,
          changeType: 'decrease',
          icon: DollarSign,
          description: 'Retorno sobre investimento'
        },
        {
          title: 'Engajamento da Rede',
          value: '92.8%',
          change: 8.7,
          changeType: 'increase',
          icon: Users,
          description: 'Taxa de engajamento dos usuários'
        },
        {
          title: 'Compliance Score',
          value: '98.1%',
          change: 3.4,
          changeType: 'increase',
          icon: CheckCircle,
          description: 'Conformidade regulatória'
        }
      ]);

      setLoading(false);
    };

    loadInsights();
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return Lightbulb;
      case 'warning': return AlertTriangle;
      case 'achievement': return CheckCircle;
      case 'trend': return TrendingUp;
      default: return BarChart3;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-red-100 text-red-800 border-red-200';
      case 'achievement': return 'bg-green-100 text-green-800 border-green-200';
      case 'trend': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Insights e Análises</h2>
        <p className="text-muted-foreground">
          Análises inteligentes baseadas nos seus dados e tendências do mercado
        </p>
      </div>

      {/* KPIs Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {kpi.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">{kpi.value}</p>
                      <div className={`flex items-center text-sm ${
                        kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {kpi.changeType === 'increase' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(kpi.change)}%
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {kpi.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Insights */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos os Insights</TabsTrigger>
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
          <TabsTrigger value="warnings">Alertas</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {insights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{insight.category}</Badge>
                          <div className="flex items-center space-x-1">
                            <div className={`h-2 w-2 rounded-full ${getImpactColor(insight.impact)}`}></div>
                            <span className="text-xs text-muted-foreground capitalize">
                              {insight.impact} impact
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Confiança</div>
                      <div className="flex items-center space-x-2">
                        <Progress value={insight.confidence} className="w-16" />
                        <span className="text-sm font-medium">{insight.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {insight.description}
                  </p>
                  
                  {insight.metric && (
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Valor Atual</div>
                        <div className="text-xl font-bold">{insight.metric.value}</div>
                      </div>
                      <div className={`flex items-center space-x-1 ${
                        insight.metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {insight.metric.changeType === 'increase' ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                        <span className="font-medium">{Math.abs(insight.metric.change)}%</span>
                        <span className="text-sm">vs. período anterior</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        Gerado em {new Date(insight.dateGenerated).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    {insight.actionable && (
                      <Button variant="outline" size="sm">
                        <Zap className="h-4 w-4 mr-2" />
                        Tomar Ação
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="opportunities">
          {insights
            .filter(insight => insight.type === 'opportunity')
            .map((insight) => {
              const Icon = getInsightIcon(insight.type);
              return (
                <Card key={insight.id} className="hover:shadow-md transition-shadow">
                  {/* Same card structure as above */}
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <Badge variant="outline">{insight.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{insight.description}</p>
                  </CardContent>
                </Card>
              );
            })}
        </TabsContent>

        <TabsContent value="warnings">
          {insights
            .filter(insight => insight.type === 'warning')
            .map((insight) => {
              const Icon = getInsightIcon(insight.type);
              return (
                <Card key={insight.id} className="hover:shadow-md transition-shadow border-red-200">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <Badge variant="outline">{insight.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{insight.description}</p>
                  </CardContent>
                </Card>
              );
            })}
        </TabsContent>

        <TabsContent value="achievements">
          {insights
            .filter(insight => insight.type === 'achievement')
            .map((insight) => {
              const Icon = getInsightIcon(insight.type);
              return (
                <Card key={insight.id} className="hover:shadow-md transition-shadow border-green-200">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <Badge variant="outline">{insight.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{insight.description}</p>
                  </CardContent>
                </Card>
              );
            })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportInsights;