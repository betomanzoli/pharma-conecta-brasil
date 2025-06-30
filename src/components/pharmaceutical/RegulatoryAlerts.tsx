
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Shield, 
  RefreshCw, 
  ExternalLink,
  Bell,
  Calendar,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface RegulatoryAlert {
  id: string;
  source: string;
  title: string;
  description: string;
  alert_type: string;
  severity: string;
  published_at: string;
  url?: string;
  created_at: string;
}

const RegulatoryAlerts = () => {
  const [alerts, setAlerts] = useState<RegulatoryAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('regulatory_alerts')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar alertas regulatórios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const syncRegulatoryData = async (source: string) => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('regulatory-sync', {
        body: { source }
      });

      if (error) throw error;

      if (data.success) {
        await fetchAlerts(); // Recarregar alertas
        toast({
          title: "Sincronização Completa!",
          description: `${data.new_alerts_count} novos alertas de ${source.toUpperCase()}`,
        });
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro",
        description: "Falha na sincronização regulatória",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recall': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'safety': return <Shield className="h-4 w-4 text-orange-500" />;
      case 'approval': return <FileText className="h-4 w-4 text-green-500" />;
      case 'guideline': return <Bell className="h-4 w-4 text-blue-500" />;
      case 'inspection': return <Calendar className="h-4 w-4 text-purple-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-[#1565C0]" />
              <span>Alertas Regulatórios</span>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => syncRegulatoryData('anvisa')}
                disabled={syncing}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${syncing ? 'animate-spin' : ''}`} />
                ANVISA
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => syncRegulatoryData('fda')}
                disabled={syncing}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${syncing ? 'animate-spin' : ''}`} />
                FDA
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Acompanhe as últimas atualizações regulatórias da ANVISA, FDA e outros órgãos.
          </p>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-[#1565C0]" />
              <span className="ml-2">Carregando alertas...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-[#1565C0]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(alert.alert_type)}
                        <Badge variant="outline" className="text-xs">
                          {alert.source.toUpperCase()}
                        </Badge>
                        <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(alert.published_at)}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {alert.title}
                    </h4>
                    
                    <p className="text-gray-700 text-sm mb-3">
                      {alert.description}
                    </p>
                    
                    {alert.url && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(alert.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Ver Original
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {alerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum alerta regulatório encontrado</p>
                  <p className="text-sm">Clique em sincronizar para buscar atualizações</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegulatoryAlerts;
