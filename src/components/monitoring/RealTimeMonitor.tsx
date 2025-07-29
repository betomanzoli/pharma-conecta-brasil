
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

const RealTimeMonitor: React.FC = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'degraded' | 'down'>('healthy');
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile) return;

    // Escutar mudanças em tempo real nas métricas de performance
    const metricsChannel = supabase
      .channel('system-metrics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'performance_metrics'
        },
        (payload) => {
          console.log('Nova métrica recebida:', payload);
          handleNewMetric(payload.new);
        }
      )
      .subscribe();

    // Escutar mudanças nas notificações do sistema
    const notificationsChannel = supabase
      .channel('system-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `type=eq.system`
        },
        (payload) => {
          console.log('Nova notificação do sistema:', payload);
          handleSystemNotification(payload.new);
        }
      )
      .subscribe();

    // Monitorar APIs externas a cada 5 minutos
    const apiHealthCheck = setInterval(() => {
      checkExternalAPIs();
    }, 5 * 60 * 1000);

    return () => {
      supabase.removeChannel(metricsChannel);
      supabase.removeChannel(notificationsChannel);
      clearInterval(apiHealthCheck);
    };
  }, [profile]);

  const handleNewMetric = (metric: any) => {
    // Analisar métricas críticas
    if (metric.metric_name === 'error_rate' && metric.metric_value > 0.05) {
      const alert: SystemAlert = {
        id: Date.now().toString(),
        type: 'warning',
        message: `Taxa de erro elevada: ${(metric.metric_value * 100).toFixed(2)}%`,
        timestamp: new Date(),
        resolved: false
      };
      
      setAlerts(prev => [alert, ...prev.slice(0, 9)]);
      
      if (profile?.user_type === 'admin') {
        toast.warning('Sistema: Taxa de Erro Elevada', {
          description: alert.message
        });
      }
    }

    if (metric.metric_name === 'response_time' && metric.metric_value > 2000) {
      const alert: SystemAlert = {
        id: Date.now().toString(),
        type: 'warning',
        message: `Tempo de resposta alto: ${metric.metric_value}ms`,
        timestamp: new Date(),
        resolved: false
      };
      
      setAlerts(prev => [alert, ...prev.slice(0, 9)]);
    }
  };

  const handleSystemNotification = (notification: any) => {
    if (notification.user_id === profile?.id || notification.type === 'system') {
      const alert: SystemAlert = {
        id: notification.id,
        type: notification.priority === 'high' ? 'error' : 'info',
        message: notification.message,
        timestamp: new Date(notification.created_at),
        resolved: false
      };
      
      setAlerts(prev => [alert, ...prev.slice(0, 9)]);
    }
  };

  const checkExternalAPIs = async () => {
    const apis = [
      { name: 'ANVISA API', url: 'https://dados.anvisa.gov.br/dados' },
      { name: 'FDA API', url: 'https://api.fda.gov/drug/label.json?limit=1' }
    ];

    for (const api of apis) {
      try {
        const startTime = Date.now();
        
        // Use AbortController for timeout instead of timeout property
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(api.url, { 
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;

        // Registrar métrica de tempo de resposta
        await supabase
          .from('performance_metrics')
          .insert({
            metric_name: 'external_api_response_time',
            metric_value: responseTime,
            metric_unit: 'ms',
            tags: { api_name: api.name, status: 'success' }
          });

        if (responseTime > 5000) {
          setSystemStatus('degraded');
        }
      } catch (error) {
        console.error(`Erro ao verificar ${api.name}:`, error);
        
        // Registrar métrica de erro
        await supabase
          .from('performance_metrics')
          .insert({
            metric_name: 'external_api_error',
            metric_value: 1,
            metric_unit: 'count',
            tags: { api_name: api.name, error: 'timeout_or_failure' }
          });

        const alert: SystemAlert = {
          id: Date.now().toString() + api.name,
          type: 'error',
          message: `${api.name} indisponível`,
          timestamp: new Date(),
          resolved: false
        };
        
        setAlerts(prev => [alert, ...prev.slice(0, 9)]);
        setSystemStatus('degraded');
      }
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'down':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'healthy': return 'success';
      case 'degraded': return 'warning';
      case 'down': return 'destructive';
      default: return 'secondary';
    }
  };

  if (profile?.user_type !== 'admin') return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 max-w-sm">
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              Sistema
            </div>
            <Badge variant={getStatusColor() as any}>
              {systemStatus === 'healthy' && 'Saudável'}
              {systemStatus === 'degraded' && 'Degradado'}
              {systemStatus === 'down' && 'Indisponível'}
            </Badge>
          </CardTitle>
        </CardHeader>
        {alerts.length > 0 && (
          <CardContent className="pt-0">
            <CardDescription className="mb-2">Alertas Recentes:</CardDescription>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                    alert.type === 'error' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-foreground">{alert.message}</p>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{alert.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default RealTimeMonitor;
