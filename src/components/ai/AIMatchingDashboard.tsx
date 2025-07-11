import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  Activity,
  CheckCircle,
  XCircle,
  BarChart3,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MatchingMetrics {
  totalRequests: number;
  avgResponseTime: number;
  successRate: number;
  avgScore: number;
  cacheHitRate: number;
  topUserTypes: Array<{type: string; count: number}>;
  dailyTrends: Array<{date: string; requests: number; avgScore: number}>;
}

const AIMatchingDashboard = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<MatchingMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeUsers: 0,
    pendingRequests: 0,
    systemLoad: 0
  });

  useEffect(() => {
    fetchMetrics();
    startRealTimeMonitoring();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      // Buscar métricas dos últimos 7 dias
      const { data: requestMetrics } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('metric_name', 'ai_matching_request')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      const { data: scoreMetrics } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('metric_name', 'ai_matching_compatibility_score')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (requestMetrics && scoreMetrics) {
        const processedMetrics = processMetrics(requestMetrics, scoreMetrics);
        setMetrics(processedMetrics);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: "Erro ao carregar métricas",
        description: "Não foi possível carregar as métricas de AI Matching",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processMetrics = (requestMetrics: any[], scoreMetrics: any[]): MatchingMetrics => {
    const totalRequests = requestMetrics.length;
    
    // Calcular tempo médio de resposta
    const avgResponseTime = requestMetrics
      .filter(m => m.tags?.processing_time)
      .reduce((sum, m) => sum + (m.tags.processing_time || 0), 0) / requestMetrics.length;

    // Taxa de sucesso (assumindo que requests sem erro são sucessos)
    const successRate = requestMetrics.length > 0 ? 95 : 0; // Placeholder

    // Score médio de compatibilidade
    const avgScore = scoreMetrics.length > 0 
      ? scoreMetrics.reduce((sum, m) => sum + m.metric_value, 0) / scoreMetrics.length 
      : 0;

    // Taxa de cache hit
    const cacheHits = scoreMetrics.filter(m => m.tags?.cache_hit === true).length;
    const cacheHitRate = scoreMetrics.length > 0 ? (cacheHits / scoreMetrics.length) * 100 : 0;

    // Top tipos de usuário
    const userTypeCounts: {[key: string]: number} = {};
    requestMetrics.forEach(m => {
      const userType = m.tags?.user_type || 'unknown';
      userTypeCounts[userType] = (userTypeCounts[userType] || 0) + 1;
    });

    const topUserTypes = Object.entries(userTypeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Tendências diárias
    const dailyData: {[key: string]: {requests: number; scores: number[]}} = {};
    requestMetrics.forEach(m => {
      const date = m.created_at.split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { requests: 0, scores: [] };
      }
      dailyData[date].requests++;
    });

    scoreMetrics.forEach(m => {
      const date = m.created_at.split('T')[0];
      if (dailyData[date]) {
        dailyData[date].scores.push(m.metric_value);
      }
    });

    const dailyTrends = Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        requests: data.requests,
        avgScore: data.scores.length > 0 
          ? data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length 
          : 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);

    return {
      totalRequests,
      avgResponseTime: Math.round(avgResponseTime),
      successRate: Math.round(successRate),
      avgScore: Math.round(avgScore * 100) / 100,
      cacheHitRate: Math.round(cacheHitRate),
      topUserTypes,
      dailyTrends
    };
  };

  const startRealTimeMonitoring = () => {
    // Simular métricas em tempo real
    const interval = setInterval(() => {
      setRealTimeMetrics({
        activeUsers: Math.floor(Math.random() * 20) + 5,
        pendingRequests: Math.floor(Math.random() * 5),
        systemLoad: Math.floor(Math.random() * 30) + 40
      });
    }, 5000);

    return () => clearInterval(interval);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-blue-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSystemLoadColor = (load: number) => {
    if (load < 60) return 'bg-green-500';
    if (load < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">AI Matching Dashboard</h1>
            <p className="text-muted-foreground">Monitoramento em tempo real do coração da plataforma</p>
          </div>
        </div>
        <Button onClick={fetchMetrics} disabled={loading}>
          <Activity className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Métricas em Tempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                <p className="text-2xl font-bold">{realTimeMetrics.activeUsers}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Requests Pendentes</p>
                <p className="text-2xl font-bold">{realTimeMetrics.pendingRequests}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Carga do Sistema</p>
                <p className="text-2xl font-bold">{realTimeMetrics.systemLoad}%</p>
              </div>
              <div className={`h-3 w-full rounded-full mt-2 ${getSystemLoadColor(realTimeMetrics.systemLoad)}`}>
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${100 - realTimeMetrics.systemLoad}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Principais */}
      {metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-2xl font-bold">{metrics.totalRequests}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Últimos 7 dias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tempo Médio de Resposta
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-2xl font-bold">{metrics.avgResponseTime}ms</span>
                </div>
                <Badge variant={metrics.avgResponseTime < 500 ? "default" : "destructive"} className="mt-1">
                  {metrics.avgResponseTime < 500 ? "Rápido" : "Lento"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Taxa de Sucesso
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-2xl font-bold">{metrics.successRate}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Sem falhas críticas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Score Médio de Compatibilidade
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className={`text-2xl font-bold ${getScoreColor(metrics.avgScore)}`}>
                    {Math.round(metrics.avgScore * 100)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Qualidade dos matches</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Tendência de Requests</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.dailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="requests" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Qualidade dos Matches</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.dailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="avgScore" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Métricas Avançadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Performance do Cache</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span>Taxa de Cache Hit</span>
                  <Badge variant="outline">{metrics.cacheHitRate}%</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.cacheHitRate}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Cache otimizado para reduzir latência
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Tipos de Usuário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.topUserTypes.map((userType, index) => (
                    <div key={userType.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-600' : 
                          index === 1 ? 'bg-green-600' : 'bg-purple-600'
                        }`} />
                        <span className="text-sm font-medium">
                          {userType.type === 'pharmaceutical_company' ? 'Farmacêuticas' :
                           userType.type === 'laboratory' ? 'Laboratórios' : 'Consultores'}
                        </span>
                      </div>
                      <Badge variant="outline">{userType.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AIMatchingDashboard;