import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Settings,
  Database,
  Webhook,
  Link
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Integration {
  id: string;
  integration_name: string;
  is_active: boolean;
  last_sync: string | null;
  sync_frequency_hours: number;
  base_url: string | null;
  created_at: string;
}

interface SyncResult {
  integration: string;
  status: 'success' | 'error' | 'skipped';
  records_processed?: number;
  error?: string;
}

const ExternalIntegrationsPanel = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);

  // Carregar integrações
  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .order('integration_name');

      if (error) throw error;

      setIntegrations(data || []);
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
      toast.error('Erro ao carregar integrações');
    } finally {
      setLoading(false);
    }
  };

  const toggleIntegration = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('api_configurations')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === id 
            ? { ...integration, is_active: isActive }
            : integration
        )
      );

      toast.success(`Integração ${isActive ? 'ativada' : 'desativada'}`);
    } catch (error) {
      console.error('Erro ao atualizar integração:', error);
      toast.error('Erro ao atualizar integração');
    }
  };

  const syncIntegration = async (integrationName: string) => {
    setSyncing(integrationName);
    
    try {
      let endpoint = '';
      
      switch (integrationName.toLowerCase()) {
        case 'anvisa':
          endpoint = 'anvisa-sync';
          break;
        default:
          endpoint = 'comprehensive-integration-sync';
      }

      const { data, error } = await supabase.functions.invoke(endpoint);

      if (error) throw error;

      toast.success(`Sincronização de ${integrationName} concluída!`);
      setSyncResults(data.results || []);
      await fetchIntegrations();
      
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast.error(`Erro na sincronização de ${integrationName}`);
    } finally {
      setSyncing(null);
    }
  };

  const syncAllIntegrations = async () => {
    setSyncing('all');
    
    try {
      const { data, error } = await supabase.functions.invoke('comprehensive-integration-sync');

      if (error) throw error;

      toast.success('Sincronização geral concluída!');
      setSyncResults(data.results || []);
      await fetchIntegrations();
      
    } catch (error) {
      console.error('Erro na sincronização geral:', error);
      toast.error('Erro na sincronização geral');
    } finally {
      setSyncing(null);
    }
  };

  const getIntegrationIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'anvisa': return '🏥';
      case 'finep': return '💰';
      case 'datasus': return '📊';
      case 'receita_federal': return '🏛️';
      default: return '🔗';
    }
  };

  const getStatusColor = (isActive: boolean, lastSync: string | null) => {
    if (!isActive) return 'secondary';
    if (!lastSync) return 'destructive';
    
    const hoursSinceSync = (Date.now() - new Date(lastSync).getTime()) / (1000 * 60 * 60);
    return hoursSinceSync < 25 ? 'default' : 'destructive';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-muted h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Integrações Externas</h3>
          <p className="text-muted-foreground">
            Gerencie conexões com APIs e serviços externos
          </p>
        </div>
        <Button 
          onClick={syncAllIntegrations}
          disabled={syncing !== null}
          className="gap-2"
        >
          {syncing === 'all' ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          Sincronizar Tudo
        </Button>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations" className="gap-2">
            <Database className="h-4 w-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2">
            <Activity className="h-4 w-4" />
            Resultados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          {integrations.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma integração configurada</h3>
                <p className="text-muted-foreground">
                  Configure suas primeiras integrações para começar a sincronizar dados
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {integrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getIntegrationIcon(integration.integration_name)}
                        </span>
                        <div>
                          <CardTitle className="text-lg">
                            {integration.integration_name.toUpperCase()}
                          </CardTitle>
                          <CardDescription>
                            {integration.base_url || 'API Externa'}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(integration.is_active, integration.last_sync)}>
                        {integration.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        <Switch
                          checked={integration.is_active}
                          onCheckedChange={(checked) => 
                            toggleIntegration(integration.id, checked)
                          }
                        />
                      </div>

                      {integration.last_sync && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Última sincronização</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(integration.last_sync), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Frequência</span>
                        <span>{integration.sync_frequency_hours}h</span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => syncIntegration(integration.integration_name)}
                        disabled={syncing !== null || !integration.is_active}
                        className="w-full gap-2"
                      >
                        {syncing === integration.integration_name ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Sincronizar Agora
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Configuração de Webhooks
              </CardTitle>
              <CardDescription>
                URLs para receber notificações automáticas de sistemas externos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Link className="h-4 w-4" />
                <AlertDescription>
                  <strong>URL do Webhook:</strong> https://irjjksfhyiwsbsipeyrj.supabase.co/functions/v1/webhook-handler
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-medium">Formatos Suportados:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span>ANVISA</span>
                    <code>{"{ source: 'ANVISA', type: 'alert', data: {...} }"}</code>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span>FINEP</span>
                    <code>{"{ source: 'FINEP', type: 'opportunity', data: {...} }"}</code>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span>CRM</span>
                    <code>{"{ source: 'CRM', type: 'lead', data: {...} }"}</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {syncResults.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum resultado ainda</h3>
                <p className="text-muted-foreground">
                  Execute uma sincronização para ver os resultados aqui
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {syncResults.map((result, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {getIntegrationIcon(result.integration)}
                        </span>
                        <div>
                          <h4 className="font-medium">{result.integration}</h4>
                          {result.records_processed && (
                            <p className="text-sm text-muted-foreground">
                              {result.records_processed} registros processados
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : result.status === 'error' ? (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                        <Badge variant={
                          result.status === 'success' ? 'default' :
                          result.status === 'error' ? 'destructive' : 'secondary'
                        }>
                          {result.status === 'success' ? 'Sucesso' :
                           result.status === 'error' ? 'Erro' : 'Ignorado'}
                        </Badge>
                      </div>
                    </div>
                    {result.error && (
                      <Alert variant="destructive" className="mt-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{result.error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExternalIntegrationsPanel;