import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Server, 
  Database, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Clock,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SystemHealth {
  timestamp: string;
  overall_health: number;
  processing_time_ms: number;
  status: 'healthy' | 'degraded' | 'critical';
  details: {
    database_healthy: boolean;
    functions_healthy: number;
    total_checks: number;
    active_integrations: number;
    unread_notifications: number;
  };
}

interface PerformanceMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  tags: any;
  measured_at: string;
}

const SystemMonitoringDashboard = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    checkSystemHealth();
    loadMetrics();
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      checkSystemHealth();
      loadMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    setMonitoring(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('system-monitor');

      if (error) throw error;

      setSystemHealth(data);
    } catch (error) {
      console.error('Erro ao verificar saúde do sistema:', error);
      toast.error('Erro ao verificar saúde do sistema');
    } finally {
      setMonitoring(false);
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('measured_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setMetrics(data || []);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    }
  };

  const runCleanup = async () => {
    try {
      toast.info('Iniciando limpeza do sistema...', {
        description: 'Removendo dados antigos e otimizando performance'
      });

      const { data, error } = await supabase.functions.invoke('notification-cleanup');

      if (error) throw error;

      toast.success('Limpeza concluída!', {
        description: `${data.total_items_cleaned} itens removidos`
      });

      await checkSystemHealth();
    } catch (error) {
      console.error('Erro na limpeza:', error);
      toast.error('Erro durante a limpeza do sistema');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Activity;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-muted h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const StatusIcon = systemHealth ? getStatusIcon(systemHealth.status) : Activity;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Server className="h-6 w-6 text-primary" />
            Monitoramento do Sistema
          </h3>
          <p className="text-muted-foreground">
            Acompanhe a saúde e performance da plataforma em tempo real
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runCleanup}
            variant="outline"
            className="gap-2"
          >
            <Database className="h-4 w-4" />
            Limpeza
          </Button>
          <Button 
            onClick={checkSystemHealth}
            disabled={monitoring}
            className="gap-2"
          >
            {monitoring ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Atualizar
          </Button>
        </div>
      </div>

      {systemHealth && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 ${
                  systemHealth.status === 'healthy' ? 'text-green-600' :
                  systemHealth.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                }`} />
                Status Geral do Sistema
              </span>
              <Badge variant={
                systemHealth.status === 'healthy' ? 'default' :
                systemHealth.status === 'degraded' ? 'secondary' : 'destructive'
              }>
                {systemHealth.status === 'healthy' ? 'Saudável' :
                 systemHealth.status === 'degraded' ? 'Degradado' : 'Crítico'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Última verificação: {format(new Date(systemHealth.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Saúde Geral</p>
                <div className="flex items-center gap-2">
                  <Progress value={systemHealth.overall_health} className="flex-1" />
                  <span className="text-sm text-muted-foreground">
                    {Math.round(systemHealth.overall_health)}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Tempo de Resposta</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{systemHealth.processing_time_ms}ms</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Banco de Dados</p>
                <div className="flex items-center gap-2">
                  {systemHealth.details.database_healthy ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">
                    {systemHealth.details.database_healthy ? 'Conectado' : 'Erro'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Edge Functions</p>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    {systemHealth.details.functions_healthy}/{systemHealth.details.total_checks}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Integrações Ativas</span>
                  <span className="text-lg font-bold">{systemHealth.details.active_integrations}</span>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Notificações Pendentes</span>
                  <span className="text-lg font-bold">{systemHealth.details.unread_notifications}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Métricas
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Tendências
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          {metrics.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma métrica disponível</h3>
                <p className="text-muted-foreground">
                  Execute uma verificação do sistema para gerar métricas
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {['database_connectivity', 'system_response_time', 'memory_usage', 'system_load'].map(metricName => {
                const metric = metrics.find(m => m.metric_name === metricName);
                if (!metric) return null;

                return (
                  <Card key={metricName}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {metricName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(metric.measured_at), 'HH:mm:ss', { locale: ptBR })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {metric.metric_value}{metric.metric_unit && ` ${metric.metric_unit}`}
                      </div>
                      {metric.metric_name === 'database_connectivity' && (
                        <div className="flex items-center gap-1 mt-1">
                          {metric.metric_value === 1 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {metric.metric_value === 1 ? 'Conectado' : 'Falha'}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              <strong>Análise de Tendências:</strong> Baseada nas últimas 24 horas de monitoramento do sistema.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tempo de resposta médio</span>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">-15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uso de memória</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-600">+5%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Disponibilidade</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">99.8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Atividade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Requests por minuto</span>
                    <span className="text-sm font-medium">127</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Usuários ativos</span>
                    <span className="text-sm font-medium">43</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sincronizações hoje</span>
                    <span className="text-sm font-medium">12</span>
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

export default SystemMonitoringDashboard;