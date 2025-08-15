
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Zap,
  Database,
  Shield,
  Monitor,
  Cpu,
  HardDrive
} from 'lucide-react';

interface HealthMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  unit: string;
  threshold: {
    warning: number;
    critical: number;
  };
  trend: 'up' | 'down' | 'stable';
}

interface SystemComponent {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  responseTime: number;
  lastCheck: Date;
}

const SystemHealthMonitor: React.FC = () => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [systemComponents, setSystemComponents] = useState<SystemComponent[]>([]);
  const [overallHealth, setOverallHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  useEffect(() => {
    loadHealthMetrics();
    loadSystemComponents();
    
    const interval = setInterval(() => {
      updateHealthMetrics();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadHealthMetrics = () => {
    const metrics: HealthMetric[] = [
      {
        name: 'CPU Usage',
        value: 23,
        status: 'healthy',
        unit: '%',
        threshold: { warning: 70, critical: 90 },
        trend: 'stable'
      },
      {
        name: 'Memory Usage',
        value: 45,
        status: 'healthy',
        unit: '%',
        threshold: { warning: 80, critical: 95 },
        trend: 'stable'
      },
      {
        name: 'Disk Usage',
        value: 62,
        status: 'healthy',
        unit: '%',
        threshold: { warning: 80, critical: 95 },
        trend: 'up'
      },
      {
        name: 'API Response Time',
        value: 120,
        status: 'healthy',
        unit: 'ms',
        threshold: { warning: 500, critical: 1000 },
        trend: 'down'
      },
      {
        name: 'Database Connections',
        value: 15,
        status: 'healthy',
        unit: 'active',
        threshold: { warning: 80, critical: 100 },
        trend: 'stable'
      },
      {
        name: 'Error Rate',
        value: 0.02,
        status: 'healthy',
        unit: '%',
        threshold: { warning: 1, critical: 5 },
        trend: 'stable'
      },
      {
        name: 'Request Throughput',
        value: 245,
        status: 'healthy',
        unit: 'req/min',
        threshold: { warning: 100, critical: 50 },
        trend: 'up'
      },
      {
        name: 'SSL Certificate',
        value: 87,
        status: 'healthy',
        unit: 'days',
        threshold: { warning: 30, critical: 7 },
        trend: 'down'
      }
    ];

    setHealthMetrics(metrics.map(metric => ({
      ...metric,
      status: getMetricStatus(metric.value, metric.threshold, metric.name)
    })));
  };

  const loadSystemComponents = () => {
    const components: SystemComponent[] = [
      {
        name: 'Frontend Application',
        status: 'operational',
        uptime: 99.9,
        responseTime: 85,
        lastCheck: new Date()
      },
      {
        name: 'API Gateway',
        status: 'operational',
        uptime: 99.95,
        responseTime: 120,
        lastCheck: new Date()
      },
      {
        name: 'Database (Supabase)',
        status: 'operational',
        uptime: 99.99,
        responseTime: 45,
        lastCheck: new Date()
      },
      {
        name: 'Authentication Service',
        status: 'operational',
        uptime: 99.8,
        responseTime: 95,
        lastCheck: new Date()
      },
      {
        name: 'File Storage',
        status: 'operational',
        uptime: 99.7,
        responseTime: 180,
        lastCheck: new Date()
      },
      {
        name: 'Monitoring System',
        status: 'operational',
        uptime: 99.5,
        responseTime: 200,
        lastCheck: new Date()
      },
      {
        name: 'CDN',
        status: 'operational',
        uptime: 99.95,
        responseTime: 25,
        lastCheck: new Date()
      },
      {
        name: 'Email Service',
        status: 'degraded',
        uptime: 98.5,
        responseTime: 850,
        lastCheck: new Date()
      }
    ];

    setSystemComponents(components);
  };

  const updateHealthMetrics = () => {
    setHealthMetrics(prev => prev.map(metric => {
      // Simular variação natural dos valores
      let newValue = metric.value;
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      
      switch (metric.name) {
        case 'CPU Usage':
          newValue = Math.max(5, Math.min(95, metric.value + variation * 20));
          break;
        case 'Memory Usage':
          newValue = Math.max(20, Math.min(90, metric.value + variation * 15));
          break;
        case 'API Response Time':
          newValue = Math.max(50, Math.min(2000, metric.value + variation * 100));
          break;
        case 'Request Throughput':
          newValue = Math.max(50, Math.min(500, metric.value + variation * 50));
          break;
        default:
          newValue = Math.max(0, metric.value + variation * metric.value);
      }

      return {
        ...metric,
        value: Math.round(newValue * 100) / 100,
        status: getMetricStatus(newValue, metric.threshold, metric.name)
      };
    }));
  };

  const getMetricStatus = (value: number, threshold: { warning: number; critical: number }, metricName: string): 'healthy' | 'warning' | 'critical' => {
    // Para métricas onde menor é melhor (erro rate, response time)
    const lowerIsBetter = ['Error Rate', 'API Response Time'].includes(metricName);
    
    if (lowerIsBetter) {
      if (value >= threshold.critical) return 'critical';
      if (value >= threshold.warning) return 'warning';
      return 'healthy';
    } else {
      // Para métricas onde maior pode ser problema (CPU, Memory, Disk)
      if (['CPU Usage', 'Memory Usage', 'Disk Usage', 'Database Connections'].includes(metricName)) {
        if (value >= threshold.critical) return 'critical';
        if (value >= threshold.warning) return 'warning';
        return 'healthy';
      }
      // Para métricas onde menor pode ser problema (throughput, uptime, ssl days)
      if (value <= threshold.critical) return 'critical';
      if (value <= threshold.warning) return 'warning';
      return 'healthy';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
      case 'outage':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMetricIcon = (name: string) => {
    if (name.includes('CPU')) return <Cpu className="h-4 w-4" />;
    if (name.includes('Memory') || name.includes('Disk')) return <HardDrive className="h-4 w-4" />;
    if (name.includes('Database')) return <Database className="h-4 w-4" />;
    if (name.includes('SSL') || name.includes('Security')) return <Shield className="h-4 w-4" />;
    if (name.includes('Response') || name.includes('Throughput')) return <Zap className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return 'text-green-500 border-green-200 bg-green-50';
      case 'warning':
      case 'degraded':
        return 'text-yellow-500 border-yellow-200 bg-yellow-50';
      case 'critical':
      case 'outage':
        return 'text-red-500 border-red-200 bg-red-50';
      default:
        return 'text-gray-500 border-gray-200 bg-gray-50';
    }
  };

  const healthyMetrics = healthMetrics.filter(m => m.status === 'healthy').length;
  const warningMetrics = healthMetrics.filter(m => m.status === 'warning').length;
  const criticalMetrics = healthMetrics.filter(m => m.status === 'critical').length;

  const operationalComponents = systemComponents.filter(c => c.status === 'operational').length;
  const overallUptime = systemComponents.reduce((acc, comp) => acc + comp.uptime, 0) / systemComponents.length;

  useEffect(() => {
    if (criticalMetrics > 0 || systemComponents.some(c => c.status === 'outage')) {
      setOverallHealth('critical');
    } else if (warningMetrics > 0 || systemComponents.some(c => c.status === 'degraded')) {
      setOverallHealth('warning');
    } else {
      setOverallHealth('healthy');
    }
  }, [criticalMetrics, warningMetrics, systemComponents]);

  return (
    <div className="space-y-6">
      {/* Status Geral do Sistema */}
      <Card className={`${getStatusColor(overallHealth)} border`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(overallHealth)}
            Status Geral do Sistema - {overallHealth === 'healthy' ? 'Saudável' : overallHealth === 'warning' ? 'Atenção' : 'Crítico'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{overallUptime.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Uptime Geral</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{operationalComponents}/{systemComponents.length}</div>
              <div className="text-sm text-muted-foreground">Componentes OK</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{healthyMetrics}</div>
              <div className="text-sm text-muted-foreground">Métricas Saudáveis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{criticalMetrics}</div>
              <div className="text-sm text-muted-foreground">Alertas Críticos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Métricas de Performance em Tempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthMetrics.map((metric, index) => (
              <Card key={index} className={`${getStatusColor(metric.status)} border`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getMetricIcon(metric.name)}
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <span className="text-xs">{getTrendIcon(metric.trend)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        {metric.value}{metric.unit}
                      </span>
                      {getStatusIcon(metric.status)}
                    </div>
                    <Progress 
                      value={metric.name.includes('Error Rate') ? metric.value * 20 : 
                             metric.name.includes('SSL Certificate') ? (metric.value / 365) * 100 :
                             metric.name.includes('Response Time') ? Math.min((metric.value / 1000) * 100, 100) :
                             metric.name.includes('Throughput') ? Math.min((metric.value / 500) * 100, 100) :
                             metric.value} 
                      className="h-2" 
                    />
                    <div className="text-xs text-muted-foreground">
                      Limite: {metric.threshold.warning}{metric.unit} / {metric.threshold.critical}{metric.unit}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status dos Componentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Status dos Componentes do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemComponents.map((component, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(component.status)}`}>
                <div className="flex items-center gap-3">
                  {getStatusIcon(component.status)}
                  <div>
                    <div className="font-medium">{component.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Uptime: {component.uptime}% • Response: {component.responseTime}ms
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(component.status).includes('green') ? 'bg-green-500' : 
                                  getStatusColor(component.status).includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}>
                    {component.status.toUpperCase()}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    Verificado: {component.lastCheck.toLocaleTimeString('pt-BR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthMonitor;
