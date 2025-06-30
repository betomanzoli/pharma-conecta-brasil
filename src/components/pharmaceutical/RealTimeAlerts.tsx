
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, Zap, RefreshCw, ExternalLink } from 'lucide-react';
import { RegulatoryApiService } from '@/services/regulatoryApiService';
import { useToast } from '@/hooks/use-toast';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface RegulatoryAlert {
  id: string;
  title: string;
  description: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  published_at: string;
  url?: string;
}

const RealTimeAlerts = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<RegulatoryAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // Helper function to validate and convert severity
  const validateSeverity = (severity: string): 'low' | 'medium' | 'high' | 'critical' => {
    const validSeverities = ['low', 'medium', 'high', 'critical'];
    return validSeverities.includes(severity) ? severity as 'low' | 'medium' | 'high' | 'critical' : 'medium';
  };

  // Helper function to convert database alert to RegulatoryAlert
  const convertToRegulatoryAlert = (dbAlert: any): RegulatoryAlert => {
    return {
      id: dbAlert.id,
      title: dbAlert.title,
      description: dbAlert.description,
      alert_type: dbAlert.alert_type,
      severity: validateSeverity(dbAlert.severity),
      source: dbAlert.source,
      published_at: dbAlert.published_at,
      url: dbAlert.url
    };
  };

  const syncAlerts = async (source: string = 'anvisa') => {
    setLoading(true);
    try {
      const response = await RegulatoryApiService.syncRegulatoryAlerts(source);
      const latestAlerts = await RegulatoryApiService.getLatestAlerts(5);
      
      // Convert alerts to match our interface
      const convertedAlerts = latestAlerts.map(convertToRegulatoryAlert);
      setAlerts(convertedAlerts);
      
      toast({
        title: "Alertas sincronizados",
        description: `${response.alerts?.length || 0} novos alertas encontrados`,
      });
    } catch (error) {
      console.error('Erro ao sincronizar alertas:', error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar os alertas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <Zap className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  useEffect(() => {
    // Carregar alertas iniciais
    syncAlerts();

    // Configurar subscription para alertas em tempo real
    let channel: RealtimeChannel;
    
    const setupSubscription = async () => {
      channel = await RegulatoryApiService.subscribeToAlerts((payload) => {
        console.log('Novo alerta recebido:', payload);
        const newAlert = convertToRegulatoryAlert(payload.new);
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
        
        toast({
          title: "Novo alerta regulatório",
          description: newAlert.title,
          variant: newAlert.severity === 'critical' ? 'destructive' : 'default'
        });
      });
      
      setConnected(true);
    };

    setupSubscription();

    return () => {
      if (channel) {
        channel.unsubscribe();
        setConnected(false);
      }
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-6 w-6 text-orange-600" />
            <span>Alertas em Tempo Real</span>
            <Badge variant={connected ? 'default' : 'secondary'} className="text-xs">
              {connected ? 'Conectado' : 'Desconectado'}
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => syncAlerts()}
              disabled={loading}
              className="flex items-center space-x-1"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Sincronizar</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && alerts.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Sincronizando alertas...</span>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum alerta recente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Alert key={alert.id} className="border-l-4 border-l-orange-500">
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <AlertTitle className="text-sm font-semibold">
                        {alert.title}
                      </AlertTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {alert.source.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <AlertDescription className="text-sm text-gray-700 mb-3">
                      {alert.description}
                    </AlertDescription>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {new Date(alert.published_at).toLocaleString('pt-BR')}
                      </span>
                      
                      {alert.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(alert.url, '_blank')}
                          className="text-xs h-6 px-2"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Ver mais
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeAlerts;
