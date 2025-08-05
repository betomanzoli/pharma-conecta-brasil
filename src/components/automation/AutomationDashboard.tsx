
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings,
  RefreshCw,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Zap,
  TrendingUp
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'paused' | 'error';
  lastRun?: Date;
  nextRun?: Date;
  successRate: number;
  totalRuns: number;
}

const AutomationDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [metrics, setMetrics] = useState({
    totalAutomations: 0,
    activeAutomations: 0,
    totalRuns: 0,
    successRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAutomations();
    loadMetrics();
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAutomations = async () => {
    try {
      // Simular dados de automações por enquanto
      const mockAutomations: AutomationRule[] = [
        {
          id: '1',
          name: 'AI Partner Matching',
          description: 'Busca automática de parceiros compatíveis diariamente',
          type: 'matching',
          status: 'active',
          lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
          nextRun: new Date(Date.now() + 22 * 60 * 60 * 1000),
          successRate: 95,
          totalRuns: 47
        },
        {
          id: '2',
          name: 'Regulatory Alerts',
          description: 'Monitoramento automático de atualizações ANVISA/FDA/EMA',
          type: 'regulatory',
          status: 'active',
          lastRun: new Date(Date.now() - 15 * 60 * 1000),
          nextRun: new Date(Date.now() + 45 * 60 * 1000),
          successRate: 98,
          totalRuns: 156
        },
        {
          id: '3',
          name: 'Market Intelligence',
          description: 'Coleta e análise automática de dados de mercado',
          type: 'intelligence',
          status: 'active',
          lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000),
          nextRun: new Date(Date.now() + 8 * 60 * 60 * 1000),
          successRate: 89,
          totalRuns: 23
        },
        {
          id: '4',
          name: 'Compliance Monitoring',
          description: 'Verificação automática de status de compliance',
          type: 'compliance',
          status: 'paused',
          lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
          successRate: 92,
          totalRuns: 12
        }
      ];

      setAutomations(mockAutomations);
    } catch (error) {
      console.error('Erro ao carregar automações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const totalAutomations = automations.length;
      const activeAutomations = automations.filter(a => a.status === 'active').length;
      const totalRuns = automations.reduce((sum, a) => sum + a.totalRuns, 0);
      const successRate = automations.length > 0 
        ? automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length 
        : 0;

      setMetrics({
        totalAutomations,
        activeAutomations,
        totalRuns,
        successRate: Math.round(successRate)
      });
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    }
  };

  const toggleAutomation = async (automationId: string) => {
    try {
      setAutomations(prev => 
        prev.map(automation => 
          automation.id === automationId 
            ? { 
                ...automation, 
                status: automation.status === 'active' ? 'paused' : 'active' 
              }
            : automation
        )
      );

      toast({
        title: "Status atualizado",
        description: "Automação foi atualizada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar automação",
        variant: "destructive"
      });
    }
  };

  const runAutomation = async (automationId: string) => {
    try {
      const automation = automations.find(a => a.id === automationId);
      
      // Simular execução da automação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAutomations(prev => 
        prev.map(a => 
          a.id === automationId 
            ? { 
                ...a, 
                lastRun: new Date(),
                totalRuns: a.totalRuns + 1 
              }
            : a
        )
      );

      toast({
        title: "Automação executada",
        description: `${automation?.name} foi executada com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha na execução da automação",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'matching':
        return <Users className="h-4 w-4" />;
      case 'regulatory':
        return <FileText className="h-4 w-4" />;
      case 'intelligence':
        return <TrendingUp className="h-4 w-4" />;
      case 'compliance':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Automações
                </p>
                <p className="text-2xl font-bold">{metrics.totalAutomations}</p>
              </div>
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Automações Ativas
                </p>
                <p className="text-2xl font-bold text-green-600">{metrics.activeAutomations}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Execuções Totais
                </p>
                <p className="text-2xl font-bold">{metrics.totalRuns}</p>
              </div>
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa de Sucesso
                </p>
                <p className="text-2xl font-bold text-blue-600">{metrics.successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Automações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Automações Ativas</span>
            <Button
              onClick={loadAutomations}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {getTypeIcon(automation.type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{automation.name}</h3>
                      {getStatusIcon(automation.status)}
                      <Badge
                        variant={
                          automation.status === 'active' 
                            ? 'default' 
                            : automation.status === 'paused'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {automation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {automation.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                      <span>Execuções: {automation.totalRuns}</span>
                      <span>Sucesso: {automation.successRate}%</span>
                      {automation.lastRun && (
                        <span>Última: {automation.lastRun.toLocaleString()}</span>
                      )}
                      {automation.nextRun && (
                        <span>Próxima: {automation.nextRun.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => runAutomation(automation.id)}
                    variant="outline"
                    size="sm"
                    disabled={automation.status === 'error'}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Executar
                  </Button>
                  <Button
                    onClick={() => toggleAutomation(automation.id)}
                    variant={automation.status === 'active' ? 'destructive' : 'default'}
                    size="sm"
                  >
                    {automation.status === 'active' ? (
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
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationDashboard;
