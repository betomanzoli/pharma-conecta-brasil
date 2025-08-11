import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Users,
  Building2,
  Calendar,
  Clock,
  Star,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { useReportSystem } from '@/hooks/useReportSystem';

interface Insight {
  id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'prediction' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  data?: any;
  actionable: boolean;
  timestamp: string;
}

interface PredictiveMetric {
  name: string;
  current: number;
  predicted: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  timeframe: string;
}

const AIReportInsights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [predictiveMetrics, setPredictiveMetrics] = useState<PredictiveMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadInsights();
    loadPredictiveMetrics();
  }, [selectedTimeframe, selectedCategory]);

  const { getInsights } = useReportSystem();

  const loadInsights = async () => {
    setLoading(true);
    try {
      const res = await getInsights({
        reportType: 'comprehensive',
        timeRange: selectedTimeframe as any,
        filters: selectedCategory === 'all' ? {} : { category: selectedCategory },
      });
      const ai = res?.insights || res; // edge returns {analysis, recommendations, risks, opportunities}
      const transformed: Insight[] = [];
      if (ai?.recommendations) {
        ai.recommendations.forEach((r: string, idx: number) => transformed.push({
          id: `rec-${idx}`,
          type: 'recommendation',
          title: 'Recomendação',
          description: r,
          confidence: 85,
          impact: 'medium',
          category: selectedCategory,
          actionable: true,
          timestamp: new Date().toISOString(),
        }));
      }
      if (ai?.risks) {
        ai.risks.forEach((r: string, idx: number) => transformed.push({
          id: `risk-${idx}`,
          type: 'anomaly',
          title: 'Risco identificado',
          description: r,
          confidence: 80,
          impact: 'high',
          category: selectedCategory,
          actionable: true,
          timestamp: new Date().toISOString(),
        }));
      }
      if (ai?.opportunities) {
        ai.opportunities.forEach((o: string, idx: number) => transformed.push({
          id: `opp-${idx}`,
          type: 'trend',
          title: 'Oportunidade',
          description: o,
          confidence: 78,
          impact: 'medium',
          category: selectedCategory,
          actionable: true,
          timestamp: new Date().toISOString(),
        }));
      }
      if (ai?.analysis) {
        transformed.unshift({
          id: 'analysis',
          type: 'prediction',
          title: 'Análise Executiva (IA)',
          description: typeof ai.analysis === 'string' ? ai.analysis : JSON.stringify(ai.analysis),
          confidence: 90,
          impact: 'high',
          category: selectedCategory,
          actionable: false,
          timestamp: new Date().toISOString(),
        });
      }
      setInsights(transformed);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadPredictiveMetrics = async () => {
    const mockMetrics: PredictiveMetric[] = [
      {
        name: 'Usuários Ativos',
        current: 1247,
        predicted: 1580,
        trend: 'up',
        confidence: 87,
        timeframe: '30 dias'
      },
      {
        name: 'Custos de API',
        current: 8500,
        predicted: 9200,
        trend: 'up',
        confidence: 82,
        timeframe: '30 dias'
      },
      {
        name: 'Taxa de Erro',
        current: 2.3,
        predicted: 1.8,
        trend: 'down',
        confidence: 79,
        timeframe: '30 dias'
      },
      {
        name: 'Velocidade Média',
        current: 1250,
        predicted: 1180,
        trend: 'down',
        confidence: 91,
        timeframe: '30 dias'
      }
    ];

    setPredictiveMetrics(mockMetrics);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'anomaly': return AlertTriangle;
      case 'recommendation': return Target;
      case 'prediction': return Brain;
      case 'achievement': return Award;
      default: return Activity;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `${Math.floor(diffHours)}h atrás`;
    return `${Math.floor(diffHours / 24)}d atrás`;
  };

  // Sample data for trend visualization
  const trendData = [
    { name: 'Sem 1', value: 100 },
    { name: 'Sem 2', value: 120 },
    { name: 'Sem 3', value: 110 },
    { name: 'Sem 4', value: 145 },
    { name: 'Sem 5', value: 134 },
    { name: 'Sem 6', value: 180 }
  ];

  const categoryData = [
    { name: 'Integrações', value: 35, color: '#3B82F6' },
    { name: 'Performance', value: 25, color: '#10B981' },
    { name: 'Custos', value: 20, color: '#F59E0B' },
    { name: 'Pagamentos', value: 12, color: '#EF4444' },
    { name: 'Outros', value: 8, color: '#8B5CF6' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Insights Inteligentes</h2>
          <p className="text-muted-foreground">
            Análises automatizadas com IA e previsões baseadas em dados
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              <SelectItem value="integrations">Integrações</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="costs">Custos</SelectItem>
              <SelectItem value="payments">Pagamentos</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadInsights} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
          <TabsTrigger value="predictions">Previsões</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <Brain className="h-12 w-12 mx-auto text-primary animate-pulse" />
                <div>
                  <h3 className="font-medium">Analisando dados com IA...</h3>
                  <p className="text-sm text-muted-foreground">Processando padrões e anomalias</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {insights.map((insight) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <Card key={insight.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{insight.title}</h3>
                              <p className="text-muted-foreground">{insight.description}</p>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <Badge className={getImpactColor(insight.impact)}>
                                {insight.impact}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(insight.timestamp)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">Confiança:</span>
                                <div className="flex items-center space-x-2">
                                  <Progress value={insight.confidence} className="w-16 h-2" />
                                  <span className="text-sm font-medium">{insight.confidence}%</span>
                                </div>
                              </div>
                              
                              {insight.data && (
                                <div className="text-sm text-muted-foreground">
                                  Dados: {Object.keys(insight.data).length} métricas
                                </div>
                              )}
                            </div>
                            
                            {insight.actionable && (
                              <Button size="sm" variant="outline">
                                <Zap className="h-4 w-4 mr-2" />
                                Tomar Ação
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="predictions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictiveMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                    {getTrendIcon(metric.trend)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Atual</div>
                      <div className="text-2xl font-bold">
                        {metric.name.includes('Taxa') ? `${metric.current}%` : metric.current.toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Previsão ({metric.timeframe})</div>
                      <div className="text-2xl font-bold text-primary">
                        {metric.name.includes('Taxa') ? `${metric.predicted}%` : metric.predicted.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Confiança da Previsão</span>
                      <span className="font-medium">{metric.confidence}%</span>
                    </div>
                    <Progress value={metric.confidence} />
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {metric.trend === 'up' && metric.predicted > metric.current && (
                      <span className="text-green-600">↗ Crescimento previsto de {((metric.predicted - metric.current) / metric.current * 100).toFixed(1)}%</span>
                    )}
                    {metric.trend === 'down' && metric.predicted < metric.current && (
                      <span className="text-red-600">↘ Redução prevista de {((metric.current - metric.predicted) / metric.current * 100).toFixed(1)}%</span>
                    )}
                    {metric.trend === 'stable' && (
                      <span className="text-gray-600">→ Estabilidade prevista</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Crescimento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-4">
            {insights.filter(i => i.type === 'recommendation').map((insight) => (
              <Card key={insight.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Target className="h-6 w-6 text-orange-500 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{insight.title}</h3>
                      <p className="text-muted-foreground mb-4">{insight.description}</p>
                      
                      {insight.data && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {Object.entries(insight.data).map(([key, value]) => (
                            <div key={key} className="text-center p-3 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-primary">{String(value)}</div>
                              <div className="text-sm text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4">
                        <Button>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Implementar
                        </Button>
                        <Button variant="outline">
                          Ver Detalhes
                        </Button>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>Impacto:</span>
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact}
                          </Badge>
                        </div>
                      </div>
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

export default AIReportInsights;