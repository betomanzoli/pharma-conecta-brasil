
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, CheckCircle, XCircle, RefreshCw, Activity, Database, Wifi } from 'lucide-react';
import { toast } from 'sonner';

interface SystemAlert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  dismissible?: boolean;
}

const SystemAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    notifications: 'online',
    database: 'online',
    realtime: 'online',
    lastCheck: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialAlerts();
    const interval = setInterval(checkSystemStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const loadInitialAlerts = () => {
    const initialAlerts: SystemAlert[] = [
      {
        id: '1',
        type: 'success',
        title: 'Sistema Operacional',
        message: 'Todos os serviços estão funcionando normalmente',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'info',
        title: 'Monitoramento Ativo',
        message: 'Verificação automática de alertas regulatórios em andamento',
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        type: 'warning',
        title: 'Manutenção Programada',
        message: 'Manutenção de rotina programada para domingo, 03:00-05:00',
        timestamp: new Date().toISOString(),
        dismissible: true
      }
    ];
    setAlerts(initialAlerts);
  };

  const checkSystemStatus = async () => {
    setLoading(true);
    
    // Simular verificação de status
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSystemStatus(prev => ({
      ...prev,
      lastCheck: new Date().toISOString()
    }));
    
    setLoading(false);
    toast.success('Status do sistema atualizado');
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast.success('Alerta removido');
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Status do Sistema</span>
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkSystemStatus}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="relative">
                <Wifi className="h-5 w-5 text-muted-foreground" />
                <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${getStatusColor(systemStatus.notifications)}`}></div>
              </div>
              <div>
                <p className="font-medium">Notificações</p>
                <p className="text-sm text-muted-foreground capitalize">{systemStatus.notifications}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="relative">
                <Database className="h-5 w-5 text-muted-foreground" />
                <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${getStatusColor(systemStatus.database)}`}></div>
              </div>
              <div>
                <p className="font-medium">Banco de Dados</p>
                <p className="text-sm text-muted-foreground capitalize">{systemStatus.database}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="relative">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${getStatusColor(systemStatus.realtime)}`}></div>
              </div>
              <div>
                <p className="font-medium">Tempo Real</p>
                <p className="text-sm text-muted-foreground capitalize">{systemStatus.realtime}</p>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            Última verificação: {new Date(systemStatus.lastCheck).toLocaleString('pt-BR')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Alertas do Sistema</span>
            {alerts.length > 0 && (
              <Badge variant="secondary">{alerts.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum alerta ativo no momento</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <Alert key={alert.id} variant={getAlertVariant(alert.type)}>
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <AlertDescription className="font-medium">
                        {alert.title}
                      </AlertDescription>
                      {alert.dismissible && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissAlert(alert.id)}
                          className="h-6 w-6 p-0"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <AlertDescription className="mt-1">
                      {alert.message}
                    </AlertDescription>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(alert.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </Alert>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemAlerts;
