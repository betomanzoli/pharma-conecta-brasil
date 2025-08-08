
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Play, Pause, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isDemoMode } from '@/utils/demoMode';
import { useUnifiedActions } from '@/hooks/useUnifiedActions';

interface AutomationControlsProps {
  automationId: string;
  name: string;
  isActive: boolean;
  onToggle: (id: string, active: boolean) => void;
  onExecute: (id: string) => void;
}

const AutomationControls: React.FC<AutomationControlsProps> = ({
  automationId,
  name,
  isActive,
  onToggle,
  onExecute
}) => {
  const [configOpen, setConfigOpen] = useState(false);
  const [frequency, setFrequency] = useState('daily');
  const [notifications, setNotifications] = useState(true);
  const [criteria, setCriteria] = useState('');
  const [threshold, setThreshold] = useState('80');
  const { toast } = useToast();
  const isDemo = isDemoMode();
  const { logMetric } = useUnifiedActions();

  const handleSaveConfig = async () => {
    await logMetric('automation_config_saved', {
      automationId,
      name,
      frequency,
      notifications,
      threshold: Number(threshold),
      criteriaLength: criteria.length,
    });
    toast({
      title: "Configuração salva",
      description: `Automação "${name}" configurada com sucesso.`,
    });
    setConfigOpen(false);
  };

  const handleExecute = async () => {
    onExecute(automationId);
    await logMetric('automation_executed', {
      automationId,
      name,
      isDemo,
    });
    toast({
      title: "Automação executada",
      description: isDemo 
        ? `Executando "${name}" com dados demonstrativos...`
        : `Automação "${name}" foi iniciada.`,
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={isActive ? "destructive" : "default"}
        size="sm"
        onClick={() => onToggle(automationId, !isActive)}
      >
        {isActive ? (
          <>
            <Pause className="h-4 w-4 mr-1" />
            Pausar
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-1" />
            Ativar
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleExecute}
        disabled={!isActive}
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        Executar
      </Button>

      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Automação</DialogTitle>
            <DialogDescription>
              Configure os parâmetros da automação "{name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequência</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">Limite de Score (%)</Label>
              <Input
                id="threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="criteria">Critérios Adicionais</Label>
              <Textarea
                id="criteria"
                placeholder="Ex: Apenas empresas com certificação ISO, localização específica..."
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notificações</Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setConfigOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveConfig}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutomationControls;
