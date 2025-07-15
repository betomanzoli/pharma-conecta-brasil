import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/stats-card';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { usePerformanceAnalytics } from '@/hooks/usePerformanceAnalytics';
import { queryOptimizationService } from '@/services/queryOptimizationService';
import { Activity, Clock, Database, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PerformanceStats {
  avgPageLoad: number;
  avgApiResponse: number;
  cacheHitRatio: number;
  errorRate: number;
  activeUsers: number;
  memoryUsage: number;
}

const PerformanceDashboard: React.FC = () => {
  const { performanceData, recordMetric, getMemoryUsage } = usePerformanceAnalytics();
  const [stats, setStats] = useState<PerformanceStats>({
    avgPageLoad: 0,
    avgApiResponse: 0,
    cacheHitRatio: 0,
    errorRate: 0,
    activeUsers: 0,
    memoryUsage: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simular dados para o gráfico
  useEffect(() => {
    const generateChartData = () => {
      const now = Date.now();
      const data = [];
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = now - (i * 60 * 60 * 1000); // Últimas 24 horas
        data.push({
          time: new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          pageLoad: Math.random() * 2000 + 500,
          apiResponse: Math.random() * 500 + 100,
          cacheHitRatio: Math.random() * 30 + 70,
          errorRate: Math.random() * 5,
          activeUsers: Math.floor(Math.random() * 100 + 50)
        });
      }
      
      setChartData(data);
    };

    generateChartData();
    
    // Atualizar dados a cada 5 minutos
    const interval = setInterval(generateChartData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Atualizar estatísticas
  useEffect(() => {
    const updateStats = async () => {
      const memory = getMemoryUsage();
      const cacheStats = queryOptimizationService.getCacheStats();
      
      // Calcular métricas baseadas nos dados de performance
      const navTiming = performanceData.navigationTiming;
      const avgPageLoad = navTiming ? navTiming.pageLoad : 0;
      
      // Calcular tempo médio de resposta da API baseado em métricas customizadas
      const apiMetrics = performanceData.customMetrics.filter(m => 
        m.name.startsWith('operation_') && m.tags?.status === 'success'
      );
      const avgApiResponse = apiMetrics.length > 0 
        ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length 
        : 0;

      setStats({
        avgPageLoad,
        avgApiResponse,
        cacheHitRatio: cacheStats.hitRatio * 100,
        errorRate: Math.random() * 2, // Simulated
        activeUsers: Math.floor(Math.random() * 150 + 100), // Simulated
        memoryUsage: memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // 30 segundos
    
    return () => clearInterval(interval);
  }, [performanceData, getMemoryUsage]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simular refresh de dados
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Registrar métrica de refresh
    await recordMetric('dashboard_refresh', 1, 'count', {
      component: 'PerformanceDashboard'
    });
    
    setIsRefreshing(false);
  };

  const getPerformanceScore = () => {
    const pageLoadScore = Math.max(0, 100 - (stats.avgPageLoad / 30)); // 3s = 0 pontos
    const apiResponseScore = Math.max(0, 100 - (stats.avgApiResponse / 10)); // 1s = 0 pontos
    const cacheScore = stats.cacheHitRatio;
    const errorScore = Math.max(0, 100 - (stats.errorRate * 20));
    
    return Math.round((pageLoadScore + apiResponseScore + cacheScore + errorScore) / 4);
  };

  const performanceScore = getPerformanceScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-muted-foreground">
            Monitoramento em tempo real de performance e métricas
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          variant="outline"
          className="gap-2"
        >
          <Activity className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Score de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold">{performanceScore}</span>
                <Badge variant={getScoreBadgeVariant(performanceScore)}>
                  {performanceScore >= 80 ? 'Excelente' : 
                   performanceScore >= 60 ? 'Bom' : 'Precisa Melhorar'}
                </Badge>
              </div>
              <Progress value={performanceScore} className="h-2" />
            </div>
            <div className="text-sm text-muted-foreground">
              Baseado em: tempo de carregamento, resposta da API, cache e taxa de erro
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <ResponsiveGrid>
        <StatsCard
          title="Tempo de Carregamento"
          value={`${stats.avgPageLoad.toFixed(0)}ms`}
          description="Tempo médio da página"
          icon={Clock}
          trend={{ value: 0, label: 'Trend', direction: stats.avgPageLoad < 2000 ? 'up' : 'down' }}
          className={stats.avgPageLoad < 2000 ? 'border-success' : 'border-warning'}
        />
        
        <StatsCard
          title="Resposta da API"
          value={`${stats.avgApiResponse.toFixed(0)}ms`}
          description="Tempo médio de resposta"
          icon={Database}
          trend={{ value: 0, label: 'Trend', direction: stats.avgApiResponse < 500 ? 'up' : 'down' }}
          className={stats.avgApiResponse < 500 ? 'border-success' : 'border-warning'}
        />
        
        <StatsCard
          title="Cache Hit Ratio"
          value={`${stats.cacheHitRatio.toFixed(1)}%`}
          description="Taxa de acerto do cache"
          icon={Zap}
          trend={{ value: 0, label: 'Trend', direction: stats.cacheHitRatio > 80 ? 'up' : 'down' }}
          className={stats.cacheHitRatio > 80 ? 'border-success' : 'border-warning'}
        />
        
        <StatsCard
          title="Taxa de Erro"
          value={`${stats.errorRate.toFixed(2)}%`}
          description="Erros por requisição"
          icon={AlertTriangle}
          trend={{ value: 0, label: 'Trend', direction: stats.errorRate < 1 ? 'up' : 'down' }}
          className={stats.errorRate < 1 ? 'border-success' : 'border-destructive'}
        />
      </ResponsiveGrid>

      {/* Gráficos Detalhados */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="api">API Metrics</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tempo de Carregamento (Últimas 24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="pageLoad" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Tempo de Carregamento (ms)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tempo de Resposta da API</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="apiResponse" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="Tempo de Resposta (ms)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance do Cache</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="cacheHitRatio" 
                    fill="hsl(var(--primary))" 
                    name="Cache Hit Ratio (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="activeUsers" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Usuários Ativos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Web Vitals */}
      {performanceData.vitals && Object.keys(performanceData.vitals).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Core Web Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {performanceData.vitals.fcp && (
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {(performanceData.vitals.fcp / 1000).toFixed(2)}s
                  </div>
                  <div className="text-sm text-muted-foreground">
                    First Contentful Paint
                  </div>
                </div>
              )}
              
              {performanceData.vitals.lcp && (
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {(performanceData.vitals.lcp / 1000).toFixed(2)}s
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Largest Contentful Paint
                  </div>
                </div>
              )}
              
              {performanceData.vitals.cls && (
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {performanceData.vitals.cls.toFixed(3)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cumulative Layout Shift
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceDashboard;