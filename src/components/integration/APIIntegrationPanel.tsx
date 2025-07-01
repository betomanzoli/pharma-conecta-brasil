
import React, { useState } from 'react';
import { Plug, Settings, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  icon: React.ReactNode;
  config?: Record<string, any>;
}

const APIIntegrationPanel: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'anvisa',
      name: 'ANVISA API',
      description: 'Integração com dados regulatórios da ANVISA',
      status: 'connected',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    },
    {
      id: 'finep',
      name: 'FINEP',
      description: 'Dados de financiamento e fomento à inovação',
      status: 'disconnected',
      icon: <AlertCircle className="h-5 w-5 text-orange-500" />
    },
    {
      id: 'cnpj',
      name: 'Receita Federal',
      description: 'Consulta de dados empresariais (CNPJ)',
      status: 'connected',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      description: 'Processamento de pagamentos',
      status: 'error',
      icon: <AlertCircle className="h-5 w-5 text-red-500" />
    }
  ]);

  const [loading, setLoading] = useState<string | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const testConnection = async (integrationId: string) => {
    setLoading(integrationId);
    
    try {
      const { data, error } = await supabase.functions.invoke('test-integration', {
        body: { integration: integrationId }
      });

      if (error) throw error;

      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: data.success ? 'connected' : 'error' }
          : integration
      ));
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'error' }
          : integration
      ));
    } finally {
      setLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return <Badge variant="secondary">Desconectado</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Integrações de API</h2>
        <p className="text-gray-600">Gerencie conexões com APIs externas e serviços</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="configure">Configurar</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3">
                      <Plug className="h-5 w-5" />
                      <span>{integration.name}</span>
                    </CardTitle>
                    {getStatusBadge(integration.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{integration.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {integration.icon}
                      <span className="text-sm">
                        {integration.status === 'connected' ? 'Funcionando' : 'Não conectado'}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(integration.id)}
                      disabled={loading === integration.id}
                    >
                      {loading === integration.id ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        'Testar'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="configure">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Integrações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="anvisa-key">ANVISA API Key</Label>
                  <Input id="anvisa-key" type="password" placeholder="Digite sua chave da API" />
                </div>
                <div>
                  <Label htmlFor="finep-token">FINEP Access Token</Label>
                  <Input id="finep-token" type="password" placeholder="Digite seu token de acesso" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-sync" />
                  <Label htmlFor="auto-sync">Sincronização automática</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">Notificações de status</Label>
                </div>
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Integração</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">ANVISA API - Consulta Regulatória</p>
                    <p className="text-sm text-gray-500">Hoje, 14:30 - Sucesso</p>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">200</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">FINEP - Busca de Editais</p>
                    <p className="text-sm text-gray-500">Hoje, 13:45 - Erro de Conexão</p>
                  </div>
                  <Badge variant="destructive">500</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Receita Federal - Consulta CNPJ</p>
                    <p className="text-sm text-gray-500">Hoje, 12:15 - Sucesso</p>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">200</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIIntegrationPanel;
