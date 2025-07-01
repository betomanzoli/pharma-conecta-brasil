
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, TestTube } from 'lucide-react';

interface APIConfiguration {
  id?: string;
  integration_name: string;
  api_key: string;
  base_url: string;
  is_active: boolean;
  sync_frequency_hours: number;
}

interface APIConfigurationFormProps {
  config?: APIConfiguration;
  onSave: () => void;
}

const APIConfigurationForm: React.FC<APIConfigurationFormProps> = ({ config, onSave }) => {
  const [formData, setFormData] = useState<APIConfiguration>({
    integration_name: config?.integration_name || '',
    api_key: config?.api_key || '',
    base_url: config?.base_url || '',
    is_active: config?.is_active || false,
    sync_frequency_hours: config?.sync_frequency_hours || 24,
  });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('api_configurations')
        .upsert({
          ...formData,
          id: config?.id,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Configuração salva",
        description: "As configurações da API foram salvas com sucesso.",
      });
      onSave();
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-integration', {
        body: { integration: formData.integration_name }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Teste bem-sucedido",
          description: `Conexão estabelecida com sucesso. Latência: ${data.latency}ms`,
        });
      } else {
        throw new Error(data.message || 'Teste falhou');
      }
    } catch (error) {
      console.error('Erro no teste:', error);
      toast({
        title: "Teste falhou",
        description: error.message || "Não foi possível conectar com a API.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de API - {formData.integration_name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="integration_name">Nome da Integração</Label>
            <Input
              id="integration_name"
              value={formData.integration_name}
              onChange={(e) => setFormData(prev => ({ ...prev, integration_name: e.target.value }))}
              placeholder="ex: anvisa"
            />
          </div>
          <div>
            <Label htmlFor="base_url">URL Base</Label>
            <Input
              id="base_url"
              value={formData.base_url}
              onChange={(e) => setFormData(prev => ({ ...prev, base_url: e.target.value }))}
              placeholder="https://api.exemplo.gov.br"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="api_key">Chave da API</Label>
          <Input
            id="api_key"
            type="password"
            value={formData.api_key}
            onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
            placeholder="Sua chave de API"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Ativo</Label>
          </div>
          <div>
            <Label htmlFor="sync_frequency">Frequência de Sincronização (horas)</Label>
            <Input
              id="sync_frequency"
              type="number"
              value={formData.sync_frequency_hours}
              onChange={(e) => setFormData(prev => ({ ...prev, sync_frequency_hours: parseInt(e.target.value) }))}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Salvar
          </Button>
          <Button variant="outline" onClick={handleTest} disabled={testing}>
            {testing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TestTube className="h-4 w-4 mr-2" />}
            Testar Conexão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIConfigurationForm;
