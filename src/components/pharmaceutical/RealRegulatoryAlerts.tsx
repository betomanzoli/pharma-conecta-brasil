
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { RealIntegrationService } from '@/services/realIntegrationService';

interface RegulatoryAlert {
  id: string;
  title: string;
  description: string;
  source: string;
  published_at: string;
  content: any;
  url?: string;
}

const RealRegulatoryAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<RegulatoryAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      const data = await RealIntegrationService.getRegulatoryAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Crítico</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">Alto</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>;
      default:
        return <Badge variant="secondary">Baixo</Badge>;
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Alertas Regulatórios</h2>
        <Button variant="outline" onClick={loadAlerts}>
          Atualizar
        </Button>
      </div>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhum alerta regulatório encontrado</p>
            <p className="text-sm text-gray-400 mt-2">
              Configure as integrações com APIs governamentais para receber alertas em tempo real
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {alert.content?.severity && getSeverityIcon(alert.content.severity)}
                    <CardTitle className="text-sm font-medium">{alert.title}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    {alert.content?.severity && getSeverityBadge(alert.content.severity)}
                    <Badge variant="outline" className="text-xs">
                      {alert.source.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Publicado em: {new Date(alert.published_at).toLocaleDateString()}</span>
                  {alert.url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={alert.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Ver original
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RealRegulatoryAlerts;
