
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Settings, Sync, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import APIConfigurationForm from './APIConfigurationForm';

interface APIConfig {
  id: string;
  integration_name: string;
  api_key: string;
  base_url: string;
  is_active: boolean;
  last_sync: string | null;
  sync_frequency_hours: number;
}

const RealAPIIntegrationPanel: React.FC = () => {
  const [configs, setConfigs] = useState<APIConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<APIConfig | undefined>();
  const { toast } = useToast();

  const loadConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .order('integration_name');

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (configId: string, integrationName: string) => {
    setSyncing(configId);
    try {
      const { data, error } = await supabase.functions.invoke('comprehensive-integration-sync', {
        body: { source: integrationName, force_sync: true }
      });

      if (error) throw error;

      // Atualizar timestamp da última sincronização
      await supabase
        .from('api_configurations')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', configId);

      toast({
        title: "Sincronização concluída",
        description: `${data.results.successful} registros sincronizados com sucesso.`,
      });

      loadConfigurations();
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na sincronização",
        description: error.message || "Não foi possível sincronizar os dados.",
        variant: "destructive",
      });
    } finally {
      setSyncing(null);
    }
  };

  const getStatusIcon = (config: APIConfig) => {
    if (!config.is_active) return <XCircle className="h-4 w-4 text-red-500" />;
    if (!config.api_key) return <AlertCircle className="h-4 w-4 text-orange-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusBadge = (config: APIConfig) => {
    if (!config.is_active) return <Badge variant="secondary">Inativo</Badge>;
    if (!config.api_key) return <Badge variant="destructive">Não Configurado</Badge>;
    return <Badge variant="default" className="bg-green-100 text-green-800">Ativo</Badge>;
  };

  useEffect(() => {
    loadConfigurations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações de API</h1>
          <p className="text-gray-600">Gerencie as integrações com APIs externas</p>
        </div>
        <Button onClick={() => { setEditingConfig(undefined); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Integração
        </Button>
      </div>

      {showForm && (
        <APIConfigurationForm
          config={editingConfig}
          onSave={() => {
            setShowForm(false);
            setEditingConfig(undefined);
            loadConfigurations();
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configs.map((config) => (
          <Card key={config.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  {getStatusIcon(config)}
                  <span className="capitalize">{config.integration_name}</span>
                </CardTitle>
                {getStatusBadge(config)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-gray-600">
                <p><strong>URL:</strong> {config.base_url || 'Não configurado'}</p>
                <p><strong>Frequência:</strong> {config.sync_frequency_hours}h</p>
                {config.last_sync && (
                  <p><strong>Última sync:</strong> {new Date(config.last_sync).toLocaleString()}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingConfig(config);
                    setShowForm(true);
                  }}
                  className="text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Config
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSync(config.id, config.integration_name)}
                  disabled={!config.is_active || !config.api_key || syncing === config.id}
                  className="text-xs"
                >
                  {syncing === config.id ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Sync className="h-3 w-3 mr-1" />
                  )}
                  Sync
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {configs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">Nenhuma integração configurada</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Integração
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealAPIIntegrationPanel;
