
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, ExternalLink, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RegulatoryAlert {
  id: string;
  title: string;
  description: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  published_at: string;
  expires_at?: string;
  url?: string;
}

const RegulatoryAlerts = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<RegulatoryAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('regulatory_alerts')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching regulatory alerts:', error);
        return;
      }

      setAlerts(data || []);
      setLastUpdate(new Date().toLocaleString('pt-BR'));
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Erro ao carregar alertas",
        description: "Não foi possível carregar os alertas regulatórios",
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
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  useEffect(() => {
    fetchAlerts();
    
    // Atualizar alertas a cada 5 minutos
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <span>Alertas Regulatórios</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAlerts}
              disabled={loading}
              className="flex items-center space-x-1"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </Button>
          </div>
        </div>
        {lastUpdate && (
          <p className="text-sm text-gray-600">
            Última atualização: {lastUpdate}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {loading && alerts.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Carregando alertas...</span>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum alerta regulatório no momento</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Alert 
                key={alert.id} 
                className={`${isExpired(alert.expires_at) ? 'opacity-60' : ''}`}
              >
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
                          {alert.source}
                        </Badge>
                      </div>
                    </div>
                    
                    <AlertDescription className="text-sm text-gray-700 mb-3">
                      {alert.description}
                    </AlertDescription>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Publicado: {formatDate(alert.published_at)}</span>
                        {alert.expires_at && (
                          <span className={isExpired(alert.expires_at) ? 'text-red-500' : ''}>
                            Expira: {formatDate(alert.expires_at)}
                          </span>
                        )}
                      </div>
                      
                      {alert.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(alert.url, '_blank')}
                          className="text-xs h-6 px-2"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Ver detalhes
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

export default RegulatoryAlerts;
