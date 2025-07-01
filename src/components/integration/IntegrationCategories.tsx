
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  category: string;
  lastSync?: string;
  dataCount?: number;
  url?: string;
}

interface IntegrationCategoriesProps {
  integrations: Integration[];
  onTest: (integrationId: string) => void;
  onConfigure: (integrationId: string) => void;
  loading: string | null;
}

const IntegrationCategories: React.FC<IntegrationCategoriesProps> = ({
  integrations,
  onTest,
  onConfigure,
  loading
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processando</Badge>;
      default:
        return <Badge variant="secondary">Desconectado</Badge>;
    }
  };

  const categories = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([category, categoryIntegrations]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      {getStatusIcon(integration.status)}
                      <span>{integration.name}</span>
                    </CardTitle>
                    {getStatusBadge(integration.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-gray-600">{integration.description}</p>
                  {integration.lastSync && (
                    <p className="text-xs text-gray-500">
                      Última sincronização: {integration.lastSync}
                    </p>
                  )}
                  {integration.dataCount !== undefined && (
                    <p className="text-xs text-blue-600">
                      {integration.dataCount} registros coletados
                    </p>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTest(integration.id)}
                      disabled={loading === integration.id}
                      className="text-xs"
                    >
                      {loading === integration.id ? (
                        <Loader className="h-3 w-3 animate-spin" />
                      ) : (
                        'Testar'
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onConfigure(integration.id)}
                      className="text-xs"
                    >
                      Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IntegrationCategories;
