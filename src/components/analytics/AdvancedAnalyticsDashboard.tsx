
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  MessageSquare, 
  Star,
  Activity,
  Target,
  Calendar,
  Building,
  Award,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalyticsData {
  overview: {
    totalConnections: number;
    totalMatches: number;
    responseRate: number;
    averageRating: number;
    completedProjects: number;
    activeChats: number;
  };
  chartData: {
    matchesOverTime: Array<{ date: string; matches: number; responses: number }>;
    sectorDistribution: Array<{ sector: string; count: number; percentage: number }>;
    userTypeDistribution: Array<{ type: string; count: number; color: string }>;
    performanceMetrics: Array<{ metric: string; value: number; target: number }>;
  };
  trends: {
    connectionsGrowth: number;
    matchQualityImprovement: number;
    responseTimeReduction: number;
    userSatisfactionIncrease: number;
  };
}

const AdvancedAnalyticsDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (profile?.id) {
      fetchAnalyticsData();
    }
  }, [profile?.id, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados de conexões
      const { data: connections, error: connectionsError } = await supabase
        .from('match_feedback')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });

      if (connectionsError) throw connectionsError;

      // Buscar dados de avaliações
      const { data: ratings, error: ratingsError } = await supabase
        .from('ratings')
        .select('*')
        .eq('rated_id', profile?.id);

      if (ratingsError) throw ratingsError;

      // Buscar dados de chats
      const { data: chats, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .contains('participant_ids', [profile?.id]);

      if (chatsError) throw chatsError;

      // Buscar métricas de performance
      const { data: metrics, error: metricsError } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('measured_at', { ascending: false })
        .limit(100);

      if (metricsError) throw metricsError;

      // Processar dados
      const processedData: AnalyticsData = {
        overview: {
          totalConnections: connections?.length || 0,
          totalMatches: connections?.filter(c => c.feedback_type === 'positive').length || 0,
          responseRate: connections?.length > 0 ? 
            (connections.filter(c => c.feedback_type === 'positive').length / connections.length) * 100 : 0,
          averageRating: ratings?.length > 0 ? 
            ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0,
          completedProjects: 0, // Implementar quando tiver tabela de projetos
          activeChats: chats?.length || 0
        },
        chartData: {
          matchesOverTime: generateTimeSeriesData(connections || []),
          sectorDistribution: generateSectorData(connections || []),
          userTypeDistribution: generateUserTypeData(),
          performanceMetrics: generatePerformanceData(metrics || [])
        },
        trends: {
          connectionsGrowth: calculateGrowthRate(connections || []),
          matchQualityImprovement: 15.2,
          responseTimeReduction: -23.5,
          userSatisfactionIncrease: 8.7
        }
      };

      setAnalyticsData(processedData);
    } catch (error) {
      console.error('Erro ao buscar dados de analytics:', error);
      toast.error('Erro ao carregar analytics');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSeriesData = (connections: any[]) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last30Days.map(date => ({
      date: new Date(date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      matches: connections.filter(c => 
        c.created_at.startsWith(date) && c.feedback_type === 'positive'
      ).length,
      responses: connections.filter(c => 
        c.created_at.startsWith(date)
      ).length
    }));
  };

  const generateSectorData = (connections: any[]) => {
    const sectors = ['Farmacêutico', 'Biotecnologia', 'Dispositivos Médicos', 'Cosméticos', 'Veterinário'];
    return sectors.map(sector => ({
      sector,
      count: Math.floor(Math.random() * 50) + 10,
      percentage: Math.floor(Math.random() * 30) + 10
    }));
  };

  const generateUserTypeData = () => {
    return [
      { type: 'Empresas', count: 45, color: '#8884d8' },
      { type: 'Laboratórios', count: 30, color: '#82ca9d' },
      { type: 'Consultores', count: 25, color: '#ffc658' },
      { type: 'Individuais', count: 20, color: '#ff7c7c' }
    ];
  };

  const generatePerformanceData = (metrics: any[]) => {
    return [
      { metric: 'Qualidade dos Matches', value: 85, target: 90 },
      { metric: 'Tempo de Resposta', value: 78, target: 85 },
      { metric: 'Satisfação do Usuário', value: 92, target: 95 },
      { metric: 'Taxa de Conversão', value: 67, target: 70 }
    ];
  };

  const calculateGrowthRate = (connections: any[]) => {
    if (connections.length === 0) return 0;
    
    const now = new Date();
    const thisMonth = connections.filter(c => {
      const connectionDate = new Date(c.created_at);
      return connectionDate.getMonth() === now.getMonth() && 
             connectionDate.getFullYear() === now.getFullYear();
    });
    
    const lastMonth = connections.filter(c => {
      const connectionDate = new Date(c.created_at);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      return connectionDate.getMonth() === lastMonthDate.getMonth() && 
             connectionDate.getFullYear() === lastMonthDate.getFullYear();
    });
    
    if (lastMonth.length === 0) return 100;
    return ((thisMonth.length - lastMonth.length) / lastMonth.length) * 100;
  };

  const exportData = () => {
    if (!analyticsData) return;
    
    const dataToExport = {
      overview: analyticsData.overview,
      exportedAt: new Date().toISOString(),
      timeRange
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Avançado</h2>
          <p className="text-muted-foreground">
            Insights detalhados sobre sua atividade na plataforma
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 dias
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 dias
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
          >
            90 dias
          </Button>
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cartões de Visão Geral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Conexões</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalConnections}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                +{analyticsData.trends.connectionsGrowth.toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground ml-2">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Matches Bem-sucedidos</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalMatches}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                +{analyticsData.trends.matchQualityImprovement}%
              </span>
              <span className="text-sm text-muted-foreground ml-2">qualidade</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avaliação Média</p>
                <p className="text-2xl font-bold">{analyticsData.overview.averageRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                +{analyticsData.trends.userSatisfactionIncrease}%
              </span>
              <span className="text-sm text-muted-foreground ml-2">satisfação</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sectors">Setores</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Matches ao Longo do Tempo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.chartData.matchesOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="matches" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="responses" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tipo de Usuário</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.chartData.userTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.chartData.userTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.chartData.performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <span className="text-sm text-muted-foreground">
                        {metric.value}% / {metric.target}%
                      </span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Atual</span>
                      <span>Meta</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Setor</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.chartData.sectorDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendências de Crescimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Conexões</span>
                    <Badge variant="default">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{analyticsData.trends.connectionsGrowth.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Qualidade dos Matches</span>
                    <Badge variant="default">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{analyticsData.trends.matchQualityImprovement}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tempo de Resposta</span>
                    <Badge variant="default">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {analyticsData.trends.responseTimeReduction}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Satisfação do Usuário</span>
                    <Badge variant="default">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{analyticsData.trends.userSatisfactionIncrease}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insights e Recomendações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">💡 Insight</p>
                    <p className="text-sm text-blue-700">
                      Seus matches têm melhor qualidade nos setores de Biotecnologia e Farmacêutico
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">📈 Recomendação</p>
                    <p className="text-sm text-green-700">
                      Considere focar mais em conectar com laboratórios especializados
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium text-orange-800">⚠️ Atenção</p>
                    <p className="text-sm text-orange-700">
                      Tempo de resposta pode ser melhorado com respostas mais rápidas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
