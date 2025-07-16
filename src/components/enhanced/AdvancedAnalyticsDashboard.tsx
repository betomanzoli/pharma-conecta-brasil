import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateRangePicker from '@/components/analytics/DateRangePicker';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  Activity,
  Users,
  Eye,
  MessageCircle,
  Calendar,
  Target,
  Brain,
  Zap,
  Download,
  Filter,
  RefreshCw,
  Share2
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalConnections: number;
    totalMessages: number;
    conversionRate: number;
    growth: {
      views: number;
      connections: number;
      messages: number;
      conversion: number;
    };
  };
  timeSeriesData: Array<{
    date: string;
    views: number;
    connections: number;
    messages: number;
    engagement: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  performanceData: Array<{
    metric: string;
    current: number;
    previous: number;
    target: number;
  }>;
  heatmapData: Array<{
    day: string;
    hour: number;
    activity: number;
  }>;
}

const AdvancedAnalyticsDashboard = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date()
  ]);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [viewType, setViewType] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange, selectedMetric]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    try {
      // Simular carregamento de dados de analytics
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        overview: {
          totalViews: 12547,
          totalConnections: 234,
          totalMessages: 89,
          conversionRate: 12.5,
          growth: {
            views: 23.5,
            connections: 18.2,
            messages: -5.1,
            conversion: 8.7
          }
        },
        timeSeriesData: generateTimeSeriesData(),
        categoryData: [
          { name: 'Laboratórios', value: 35, color: '#8884d8' },
          { name: 'Consultores', value: 28, color: '#82ca9d' },
          { name: 'Empresas', value: 22, color: '#ffc658' },
          { name: 'Conhecimento', value: 15, color: '#ff7300' }
        ],
        performanceData: [
          { metric: 'Engajamento', current: 85, previous: 78, target: 90 },
          { metric: 'Conversão', current: 12.5, previous: 10.2, target: 15 },
          { metric: 'Retenção', current: 68, previous: 65, target: 75 },
          { metric: 'Satisfação', current: 4.2, previous: 4.0, target: 4.5 }
        ],
        heatmapData: generateHeatmapData()
      };
      
      setData(mockData);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSeriesData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 500) + 200,
        connections: Math.floor(Math.random() * 20) + 5,
        messages: Math.floor(Math.random() * 10) + 2,
        engagement: Math.floor(Math.random() * 100) + 50
      });
    }
    
    return data;
  };

  const generateHeatmapData = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const data = [];
    
    days.forEach(day => {
      for (let hour = 0; hour < 24; hour++) {
        data.push({
          day,
          hour,
          activity: Math.floor(Math.random() * 100)
        });
      }
    });
    
    return data;
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    growth: number;
    icon: React.ComponentType<any>;
    color: string;
  }> = ({ title, value, growth, icon: Icon, color }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          {growth >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
          </span>
          <span className="text-sm text-muted-foreground ml-1">vs período anterior</span>
        </div>
      </CardContent>
    </Card>
  );

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Avançado</h1>
          <p className="text-muted-foreground">
            Insights detalhados sobre performance e engajamento
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Últimos 30 dias
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline" size="sm" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Visualizações"
          value={data.overview.totalViews.toLocaleString()}
          growth={data.overview.growth.views}
          icon={Eye}
          color="bg-blue-500"
        />
        <MetricCard
          title="Conexões"
          value={data.overview.totalConnections}
          growth={data.overview.growth.connections}
          icon={Users}
          color="bg-green-500"
        />
        <MetricCard
          title="Mensagens"
          value={data.overview.totalMessages}
          growth={data.overview.growth.messages}
          icon={MessageCircle}
          color="bg-purple-500"
        />
        <MetricCard
          title="Taxa de Conversão"
          value={`${data.overview.conversionRate}%`}
          growth={data.overview.growth.conversion}
          icon={Target}
          color="bg-orange-500"
        />
      </div>

      {/* Gráficos principais */}
      <Tabs value={viewType} onValueChange={setViewType}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="engagement">Engajamento</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">Insights IA</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar métrica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as métricas</SelectItem>
                <SelectItem value="views">Visualizações</SelectItem>
                <SelectItem value="connections">Conexões</SelectItem>
                <SelectItem value="messages">Mensagens</SelectItem>
                <SelectItem value="engagement">Engajamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de linha temporal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Atividade ao Longo do Tempo</span>
                </CardTitle>
                <CardDescription>
                  Visualizações, conexões e mensagens nos últimos 30 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="connections" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="messages" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de pizza por categoria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>Distribuição por Categoria</span>
                </CardTitle>
                <CardDescription>
                  Engajamento por tipo de conteúdo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de área para engajamento */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Engajamento</CardTitle>
              <CardDescription>
                Nível de engajamento geral da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#8884d8" 
                    fill="url(#colorEngagement)" 
                  />
                  <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          {/* Métricas de performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.performanceData.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{metric.metric}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{metric.current}</span>
                      <Badge variant={metric.current >= metric.target ? "secondary" : "outline"}>
                        Meta: {metric.target}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(metric.current / metric.target) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Anterior: {metric.previous} ({metric.current > metric.previous ? '+' : ''}{((metric.current - metric.previous) / metric.previous * 100).toFixed(1)}%)
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico de barras comparativo */}
          <Card>
            <CardHeader>
              <CardTitle>Performance vs Meta</CardTitle>
              <CardDescription>
                Comparação entre performance atual, anterior e meta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="previous" fill="#e5e7eb" name="Período Anterior" />
                  <Bar dataKey="current" fill="#3b82f6" name="Período Atual" />
                  <Bar dataKey="target" fill="#10b981" name="Meta" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Calor de Atividade</CardTitle>
              <CardDescription>
                Horários de maior atividade na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground text-center">
                  Heatmap de atividade por dia da semana e hora do dia
                </div>
                {/* Implementação simplificada do heatmap */}
                <div className="grid grid-cols-8 gap-1 text-xs">
                  <div></div>
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="text-center p-1">{i}h</div>
                  ))}
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <React.Fragment key={day}>
                      <div className="p-1 font-medium">{day}</div>
                      {Array.from({ length: 24 }, (_, hour) => {
                        const activity = data.heatmapData.find(d => d.day === day && d.hour === hour)?.activity || 0;
                        const intensity = activity / 100;
                        return (
                          <div 
                            key={hour}
                            className="w-4 h-4 rounded-sm"
                            style={{ 
                              backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                              border: '1px solid #e5e7eb'
                            }}
                            title={`${day} ${hour}:00 - ${activity}% atividade`}
                          />
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <span>Menos ativo</span>
                  <div className="flex space-x-1">
                    {[0, 0.2, 0.4, 0.6, 0.8, 1].map(intensity => (
                      <div 
                        key={intensity}
                        className="w-3 h-3 rounded-sm border"
                        style={{ backgroundColor: `rgba(59, 130, 246, ${intensity})` }}
                      />
                    ))}
                  </div>
                  <span>Mais ativo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>Insights de IA</span>
                </CardTitle>
                <CardDescription>
                  Descobertas automáticas baseadas em seus dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-sm">Pico de Engajamento</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Terças-feiras às 14h apresentam 35% mais atividade. 
                    Considere agendar conteúdos importantes neste horário.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-sm">Crescimento Detectado</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Conexões com consultores cresceram 45% nas últimas duas semanas.
                    Trend de procura por expertise especializada.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">Oportunidade</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Laboratórios de biotecnologia têm 68% mais chance de resposta.
                    Foque sua estratégia neste segmento.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendações</CardTitle>
                <CardDescription>
                  Ações sugeridas para melhorar performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar conteúdo para terças às 14h
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Focar em conexões com biotecnologia
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Melhorar tempo de resposta a mensagens
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Otimizar perfil para consultoria
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;