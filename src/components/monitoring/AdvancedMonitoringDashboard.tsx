
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  Zap,
  Database,
  Globe,
  Users,
  Settings,
  Bell
} from 'lucide-react';
import { usePerformanceAnalytics } from '@/hooks/usePerformanceAnalytics';

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  condition: 'greater_than' | 'less_than' | 'equals';
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SystemAlert {
  id: string;
  rule: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  resolved: boolean;
}

const AdvancedMonitoringDashboard = () => {
  const { performanceData, recordMetric } = usePerformanceAnalytics();
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    responseTime: 0,
    errorRate: 0,
    throughput: 0,
    activeUsers: 0,
    cpuUsage: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    initializeAlertRules();
    startRealTimeMonitoring();
  }, []);

  const initializeAlertRules = () => {
    const rules: AlertRule[] = [
      {
        id: 'response-time',
        name: 'Tempo de Resposta Alto',
        metric: 'response_time',
        threshold: 3000,
        condition: 'greater_than',
        enabled: true,
        severity: 'high'
      },
      {
        id: 'error-rate',
        name: 'Taxa de Erro Elevada',
        metric: 'error_rate',
        threshold: 5,
        condition: 'greater_than',
        enabled: true,
        severity: 'critical'
      },
      {
        id: 'cpu-usage',
        name: 'Uso de CPU Alto',
        metric: 'cpu_usage',
        threshold: 80,
        condition: 'greater_than',
        enabled: true,
        severity: 'medium'
      },
      {
        id: 'memory-usage',
        name: 'Uso de Memória Alto',
        metric: 'memory_usage',
        threshold: 85,
        condition: 'greater_than',
        enabled: true,
        severity: 'high'
      },
      {
        id: 'low-throughput',
        name: 'Throughput Baixo',
        metric: 'throughput',
        threshold: 100,
        condition: 'less_than',
        enabled: true,
        severity: 'medium'
      }
    ];
    setAlertRules(rules);
  };

  const startRealTimeMonitoring = () => {
    const interval = setInterval(() => {
      // Simular métricas em tempo real
      const newMetrics = {
        responseTime: Math.random() * 5000 + 500,
        errorRate: Math.random() * 10,
        throughput: Math.random() * 1000 + 200,
        activeUsers: Math.floor(Math.random() * 500 + 100),
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100
      };
      
      setRealTimeMetrics(newMetrics);
      checkAlertRules(newMetrics);
      
      // Registrar métricas
      recordMetric('real_time_response', newMetrics.responseTime, 'ms');
      recordMetric('real_time_errors', newMetrics.errorRate, 'percentage');
      recordMetric('real_time_throughput', newMetrics.throughput, 'requests_per_minute');
    }, 5000);

    return () => clearInterval(interval);
  };

  const checkAlertRules = (metrics: typeof realTimeMetrics) => {
    alertRules.forEach(rule => {
      if (!rule.enabled) return;
      
      let value = 0;
      switch (rule.metric) {
        case 'response_time': value = metrics.responseTime; break;
        case 'error_rate': value = metrics.errorRate; break;
        case 'throughput': value = metrics.throughput; break;
        case 'cpu_usage': value = metrics.cpuUsage; break;
        case 'memory_usage': value = metrics.memoryUsage; break;
      }
      
      let shouldAlert = false;
      switch (rule.condition) {
        case 'greater_than': shouldAlert = value > rule.threshold; break;
        case 'less_than': shouldAlert = value < rule.threshold; break;
        case 'equals': shouldAlert = value === rule.threshold; break;
      }
      
      if (shouldAlert) {
        const existingAlert = alerts.find(a => a.rule === rule.id && !a.resolved);
        if (!existingAlert) {
          const newAlert: SystemAlert = {
            id: Date.now().toString(),
            rule: rule.id,
            message: `${rule.name}: ${value.toFixed(2)} (limite: ${rule.threshold})`,
            severity: rule.severity,
            timestamp: new Date(),
            resolved: false
          };
          setAlerts(prev => [newAlert, ...prev]);
        }
      }
    });
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Activity className="h-4 w-4" />;
      case 'low': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getMetricStatus = (value: number, threshold: number, condition: string) => {
    let isAlert = false;
    switch (condition) {
      case 'greater_than': isAlert = value > threshold; break;
      case 'less_than': isAlert = value < threshold; break;
      case 'equals': isAlert = value === threshold; break;
    }
    return isAlert ? 'alert' : 'normal';
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');

  return (
    <div className="space-y-6">
      {/* Header com Status Geral */}
      <Card className={`${criticalAlerts.length > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Monitoramento Avançado - Tempo Real
            </div>
            <div className="flex items-center gap-2">
              {criticalAlerts.length > 0 ? (
                <Badge className="bg-red-500 animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {criticalAlerts.length} Crítico(s)
                </Badge>
              ) : (
                <Badge className="bg-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Sistema Saudável
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className={`text-2xl font-bold ${getMetricStatus(realTimeMetrics.responseTime, 3000, 'greater_than') === 'alert' ? 'text-red-500' : 'text-green-500'}`}>
                {realTimeMetrics.responseTime.toFixed(0)}ms
              </div>
              <div className="text-sm text-muted-foreground">Resposta</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className={`text-2xl font-bold ${getMetricStatus(realTimeMetrics.errorRate, 5, 'greater_than') === 'alert' ? 'text-red-500' : 'text-green-500'}`}>
                {realTimeMetrics.errorRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Erros</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-500">
                {realTimeMetrics.throughput.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Req/min</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-500">
                {realTimeMetrics.activeUsers}
              </div>
              <div className="text-sm text-muted-foreground">Usuários</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className={`text-2xl font-bold ${getMetricStatus(realTimeMetrics.cpuUsage, 80, 'greater_than') === 'alert' ? 'text-red-500' : 'text-green-500'}`}>
                {realTimeMetrics.cpuUsage.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">CPU</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className={`text-2xl font-bold ${getMetricStatus(realTimeMetrics.memoryUsage, 85, 'greater_than') === 'alert' ? 'text-red-500' : 'text-green-500'}`}>
                {realTimeMetrics.memoryUsage.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Memória</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="rules">Regras</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <div className="space-y-4">
            {activeAlerts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum Alerta Ativo</h3>
                  <p className="text-muted-foreground">Sistema operando normalmente</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getSeverityIcon(alert.severity)}
                          <div>
                            <div className="font-medium">{alert.message}</div>
                            <div className="text-sm text-muted-foreground">
                              {alert.timestamp.toLocaleString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            Resolver
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráficos de métricas seriam implementados aqui */}
            <Card>
              <CardHeader>
                <CardTitle>Tempo de Resposta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Atual</span>
                    <span className="font-bold">{realTimeMetrics.responseTime.toFixed(0)}ms</span>
                  </div>
                  <Progress value={Math.min(realTimeMetrics.responseTime / 50, 100)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taxa de Erro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Atual</span>
                    <span className="font-bold">{realTimeMetrics.errorRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={realTimeMetrics.errorRate} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules">
          <div className="space-y-4">
            {alertRules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${getSeverityColor(rule.severity)} text-white`}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {rule.metric} {rule.condition.replace('_', ' ')} {rule.threshold}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(rule.severity)}>
                        {rule.severity.toUpperCase()}
                      </Badge>
                      <Badge variant={rule.enabled ? "default" : "secondary"}>
                        {rule.enabled ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm bg-black text-green-400 p-4 rounded-lg h-96 overflow-y-auto">
                <div>[{new Date().toISOString()}] INFO: Sistema iniciado com sucesso</div>
                <div>[{new Date().toISOString()}] INFO: Monitoramento ativo</div>
                <div>[{new Date().toISOString()}] WARN: CPU usage spike detected</div>
                <div>[{new Date().toISOString()}] INFO: Alert rule triggered: response-time</div>
                <div>[{new Date().toISOString()}] INFO: Performance metrics recorded</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedMonitoringDashboard;
