
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Database,
  Globe,
  Server,
  Wifi
} from 'lucide-react';

const SystemHealthMonitor = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const systemComponents = [
    {
      name: 'Frontend Application',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '1.2s',
      lastCheck: '30s ago',
      icon: Globe,
      details: {
        cpu: 23,
        memory: 45,
        requests: '12.5k/h'
      }
    },
    {
      name: 'Backend Services',
      status: 'healthy',
      uptime: '99.8%',
      responseTime: '0.8s',
      lastCheck: '15s ago',
      icon: Server,
      details: {
        cpu: 34,
        memory: 67,
        requests: '8.7k/h'
      }
    },
    {
      name: 'Database Cluster',
      status: 'healthy',
      uptime: '100%',
      responseTime: '0.3s',
      lastCheck: '10s ago',
      icon: Database,
      details: {
        cpu: 18,
        memory: 52,
        requests: '15.2k/h'
      }
    },
    {
      name: 'AI Processing Engine',
      status: 'healthy',
      uptime: '99.7%',
      responseTime: '2.1s',
      lastCheck: '45s ago',
      icon: Cpu,
      details: {
        cpu: 78,
        memory: 84,
        requests: '3.4k/h'
      }
    },
    {
      name: 'Network Infrastructure',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '0.1s',
      lastCheck: '5s ago',
      icon: Wifi,
      details: {
        cpu: 12,
        memory: 28,
        requests: '45.8k/h'
      }
    }
  ];

  const healthAlerts = [
    {
      level: 'info',
      message: 'Sistema operando normalmente',
      time: '2min ago',
      component: 'Sistema Geral'
    },
    {
      level: 'success',
      message: 'Otimização de performance aplicada com sucesso',
      time: '15min ago',
      component: 'AI Processing Engine'
    },
    {
      level: 'info',
      message: 'Backup automático concluído',
      time: '1h ago',
      component: 'Database Cluster'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': 
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Saudável</Badge>;
      case 'warning': 
        return <Badge className="bg-yellow-500"><AlertTriangle className="h-3 w-3 mr-1" />Atenção</Badge>;
      case 'critical': 
        return <Badge className="bg-red-500"><AlertTriangle className="h-3 w-3 mr-1" />Crítico</Badge>;
      default: 
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getCpuColor = (cpu: number) => {
    if (cpu < 50) return 'text-green-500';
    if (cpu < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Status Geral do Sistema
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {currentTime.toLocaleTimeString('pt-BR')}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-500">ONLINE</div>
              <div className="text-sm text-muted-foreground">Status Sistema</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">99.8%</div>
              <div className="text-sm text-muted-foreground">Uptime Médio</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-500">1.1s</div>
              <div className="text-sm text-muted-foreground">Resposta Média</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-500">5/5</div>
              <div className="text-sm text-muted-foreground">Componentes OK</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Componentes do Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {systemComponents.map((component) => {
          const IconComponent = component.icon;
          return (
            <Card key={component.name}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">{component.name}</CardTitle>
                  </div>
                  {getStatusBadge(component.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Uptime</div>
                      <div className="font-semibold text-green-500">{component.uptime}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Resposta</div>
                      <div className="font-semibold">{component.responseTime}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Última Checagem</div>
                      <div className="font-semibold">{component.lastCheck}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>CPU</span>
                      <span className={`font-semibold ${getCpuColor(component.details.cpu)}`}>
                        {component.details.cpu}%
                      </span>
                    </div>
                    <Progress value={component.details.cpu} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Memória</span>
                      <span className={`font-semibold ${getCpuColor(component.details.memory)}`}>
                        {component.details.memory}%
                      </span>
                    </div>
                    <Progress value={component.details.memory} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Requisições/hora</span>
                      <span className="font-semibold">{component.details.requests}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertas e Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthAlerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                {getAlertIcon(alert.level)}
                <div className="flex-1">
                  <div className="font-medium">{alert.message}</div>
                  <div className="text-sm text-muted-foreground">
                    {alert.component} • {alert.time}
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
