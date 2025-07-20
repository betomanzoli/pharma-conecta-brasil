import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Zap,
  Brain,
  Target,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RealTimeMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  unit: string;
  icon: React.ComponentType<any>;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
}

const RealTimeBusinessMonitor = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    initializeMonitoring();
    startRealTimeConnection();
    
    return () => {
      // Cleanup real-time subscriptions
    };
  }, []);

  const initializeMonitoring = async () => {
    try {
      await loadInitialMetrics();
      await loadSystemAlerts();
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Failed to initialize monitoring:', error);
      setConnectionStatus('disconnected');
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao monitoramento em tempo real",
        variant: "destructive"
      });
    }
  };

  const loadInitialMetrics = async () => {
    // Buscar métricas dos últimos 15 minutos
    const { data: recentMetrics } = await supabase
      .from('performance_metrics')
      .select('*')
      .gte('measured_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
      .order('measured_at', { ascending: false });

    const { data: matchFeedback } = await supabase
      .from('match_feedback')
      .select('*')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    const processedMetrics = processRealTimeMetrics(recentMetrics || [], matchFeedback || []);
    setMetrics(processedMetrics);
    
    // Gerar dados de performance para gráfico
    const chartData = generatePerformanceChartData(recentMetrics || []);
    setPerformanceData(chartData);
  };

  const processRealTimeMetrics = (metricsData: any[], feedbackData: any[]): RealTimeMetric[] => {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    
    // Métricas de AI Matching
    const aiRequests = metricsData.filter(m => 
      m.metric_name === 'ai_matching_request' && 
      new Date(m.measured_at) > lastHour
    ).length;

    const avgScore = metricsData
      .filter(m => m.metric_name === 'ai_matching_compatibility_score')
      .reduce((sum, m) => sum + m.metric_value, 0) / 
      Math.max(metricsData.filter(m => m.metric_name === 'ai_matching_compatibility_score').length, 1);

    const acceptedMatches = feedbackData.filter(f => f.feedback_type === 'accepted').length;
    const conversionRate = feedbackData.length > 0 ? (acceptedMatches / feedbackData.length) * 100 : 0;

    // Calcular tendências (simulado)
    return [
      {
        name: 'AI Matching Requests',
        value: aiRequests,
        change: Math.random() * 20 - 10,
        trend: aiRequests > 10 ? 'up' : 'stable',
        status: aiRequests > 20 ? 'good' : aiRequests > 10 ? 'warning' : 'critical',
        unit: '/hora',
        icon: Brain
      },
      {
        name: 'Taxa de Conversão',
        value: conversionRate,
        change: Math.random() * 15 - 5,
        trend: conversionRate > 70 ? 'up' : conversionRate > 50 ? 'stable' : 'down',
        status: conversionRate > 70 ? 'good' : conversionRate > 50 ? 'warning' : 'critical',
        unit: '%',
        icon: Target
      },
      {
        name: 'Qualidade Média',
        value: avgScore * 100,
        change: Math.random() * 10 - 3,
        trend: avgScore > 0.8 ? 'up' : avgScore > 0.6 ? 'stable' : 'down',
        status: avgScore > 0.8 ? 'good' : avgScore > 0.6 ? 'warning' : 'critical',
        unit: '%',
        icon: CheckCircle
      },
      {
        name: 'Usuários Ativos',
        value: new Set(feedbackData.map(f => f.user_id)).size,
        change: Math.random() * 25 + 5,
        trend: 'up',
        status: 'good',
        unit: '',
        icon: Users
      },
      {
        name: 'Tempo de Resposta',
        value: Math.random() * 500 + 200,
        change: Math.random() * 20 - 10,
        trend: 'stable',
        status: 'good',
        unit: 'ms',
        icon: Clock
      },
      {
        name: 'ROI Horário',
        value: acceptedMatches * 100,
        change: Math.random() * 30 + 10,
        trend: 'up',
        status: 'good',
        unit: 'R$',
        icon: DollarSign
      }
    ];
  };

  const generatePerformanceChartData = (data: any[]) => {
    const last15Minutes = Array.from({length: 15}, (_, i) => {
      const time = new Date(Date.now() - (14 - i) * 60 * 1000);
      const timeKey = time.toISOString().slice(11, 16); // HH:MM
      
      // Encontrar métricas para este minuto
      const minuteMetrics = data.filter(m => {
        const metricTime = new Date(m.measured_at);
        return Math.abs(metricTime.getTime() - time.getTime()) < 60000; // 1 minuto
      });

      return {
        time: timeKey,
        requests: minuteMetrics.filter(m => m.metric_name === 'ai_matching_request').length,
        avgScore: minuteMetrics
          .filter(m => m.metric_name === 'ai_matching_compatibility_score')
          .reduce((sum, m) => sum + m.metric_value, 0) / 
          Math.max(minuteMetrics.filter(m => m.metric_name === 'ai_matching_compatibility_score').length, 1),
        responseTime: Math.random() * 200 + 300
      };
    });

    return last15Minutes;
  };

  const loadSystemAlerts = async () => {
    // Simular alertas do sistema
    const simulatedAlerts: SystemAlert[] = [
      {
        id: '1',
        type: 'info',
        title: 'Sentiment Analysis Integrado',
        description: 'Sistema de análise de sentimento foi integrado com sucesso ao AI Matching',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        resolved: true
      },
      {
        id: '2',
        type: 'warning',
        title: 'Cache Hit Rate Baixo',
        description: 'Taxa de cache hit está abaixo de 70%. Considere otimizar estratégia de cache',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        resolved: false
      },
      {
        id: '3',
        type: 'info',
        title: 'Pico de Usuários',
        description: 'Detectado aumento de 45% no número de usuários ativos',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        resolved: true
      }
    ];

    setAlerts(simulatedAlerts);
  };

  const startRealTimeConnection = () => {
    // Simular atualizações em tempo real
    const interval = setInterval(async () => {
      await loadInitialMetrics();
      setLastUpdate(new Date());
      
      // Ocasionalmente adicionar novos alertas
      if (Math.random() > 0.9) {
        const newAlert: SystemAlert = {
          id: Date.now().toString(),
          type: Math.random() > 0.7 ? 'warning' : 'info',
          title: 'Nova Métrica Detectada',
          description: 'Sistema detectou mudança significativa nas métricas',
          timestamp: new Date(),
          resolved: false
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 10000); // Atualizar a cada 10 segundos

    return () => clearInterval(interval);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return AlertTriangle;
      case 'warning': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'R$') {
      return `R$ ${Math.round(value)}`;
    }
    if (unit === '%' || unit === 'ms') {
      return `${Math.round(value)}${unit}`;
    }
    if (unit === '/hora') {
      return `${Math.round(value)}${unit}`;
    }
    return Math.round(value).toString();
  };

  return (
    <div className="space-y-6">
      {/* Header with connection status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Monitor de Negócios em Tempo Real</h2>
          <p className="text-muted-foreground">
            Acompanhe o desempenho do AI Matching e métricas de negócio ao vivo
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-muted-foreground">
              {connectionStatus === 'connected' ? 'Conectado' : 
               connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            Última atualização: {lastUpdate.toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Real-time metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const statusClass = getStatusColor(metric.status);
          
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${statusClass}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{metric.name}</p>
                      <p className="text-lg font-bold">{formatValue(metric.value, metric.unit)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(metric.trend)}
                    <span className="text-xs font-medium">
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                {/* Mini sparkline */}
                <div className="h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData.slice(-8)}>
                      <Line 
                        type="monotone" 
                        dataKey="requests" 
                        stroke="#3B82F6" 
                        strokeWidth={1}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              
              {/* Status indicator */}
              <div className={`absolute top-0 right-0 w-3 h-3 rounded-bl-lg ${
                metric.status === 'good' ? 'bg-green-500' :
                metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
            </Card>
          );
        })}
      </div>

      {/* Performance chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Performance em Tempo Real</span>
          </CardTitle>
          <CardDescription>Últimos 15 minutos de atividade do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Requests/min"
              />
              <Line 
                type="monotone" 
                dataKey="responseTime" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Tempo Resposta (ms)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* System alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Alertas do Sistema</span>
          </CardTitle>
          <CardDescription>Eventos e notificações recentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.slice(0, 5).map(alert => {
              const IconComponent = getAlertIcon(alert.type);
              
              return (
                <div 
                  key={alert.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${
                    alert.resolved ? 'bg-gray-50 opacity-75' : 'bg-white'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{alert.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                  </div>
                  {alert.resolved && (
                    <Badge variant="outline" className="text-xs">Resolvido</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeBusinessMonitor;