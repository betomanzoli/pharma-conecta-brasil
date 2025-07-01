
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useSystemNotifications } from '@/hooks/useSystemNotifications';

const SystemAlerts: React.FC = () => {
  const { notifyRegulatoryAlert, notifySystemUpdate } = useSystemNotifications();

  useEffect(() => {
    // Simular verificação de alertas regulatórios
    const checkAlerts = async () => {
      try {
        await notifyRegulatoryAlert();
      } catch (error) {
        console.error('Erro ao verificar alertas regulatórios:', error);
      }
    };

    // Verificar alertas a cada 30 minutos
    const interval = setInterval(checkAlerts, 30 * 60 * 1000);
    
    // Verificar imediatamente
    checkAlerts();

    return () => clearInterval(interval);
  }, [notifyRegulatoryAlert]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <span>Alertas do Sistema</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Sistema de notificações ativo e funcionando corretamente.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Verificação automática de alertas regulatórios em andamento.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemAlerts;
