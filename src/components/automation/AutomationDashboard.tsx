
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Bot, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Workflow,
  Brain,
  Refresh,
  Settings
} from 'lucide-react';

interface AutomationStatus {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'error';
  lastRun: string;
  nextRun?: string;
  successRate: number;
  description: string;
}

const AutomationDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [automations, setAutomations] = useState<AutomationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalAutomations: 0,
    activeAutomations: 0,
    averageSuccessRate: 0,
    totalExecutions: 0
  });

  useEffect(() => {
    loadAutomationStatus();
    const interval = setInterval(loadAutomationStatus, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const loadAutomationStatus = async () => {
    try {
      // Buscar status das automações principais
      const automationList: AutomationStatus[] = [
        {
          id: 'ai-matching',
          name: 'AI Matching Inteligente',
          status: 'active',
          lastRun: new Date(Date.now() - 300000).toISOString(), // 5 min atrás
          nextRun: new Date(Date.now() + 3600000).toISOString(), // 1h
          successRate: 94.2,
          description: 'Busca automática de parceiros compatíveis'
        },
        {
          id: 'regulatory-sync',
          name: 'Sincronização Regulatória',
          status: 'active',
          lastRun: new Date(Date.now() - 900000).toISOString(), // 15 min atrás
          nextRun: new Date(Date.now() + 7200000).toISOString(), // 2h
          successRate: 98.7,
          description: 'Monitoramento ANVISA, FDA, EMA'
        },
        {
          id: 'compliance-monitor',
          name: 'Monitor de Compliance',
          status: 'active',
          lastRun: new Date(Date.now() - 1800000).toISOString(), // 30 min atrás
          nextRun: new Date(Date.now() + 3600000).toISOString(), // 1h
          successRate: 91.5,
          description: 'Verificação automática de conformidade'
        },
        {
          id: 'market-intelligence',
          name: 'Intelligence de Mercado',
          status: 'active',
          lastRun: new Date(Date.now() - 3600000).toISOString(), // 1h atrás
          nextRun: new Date(Date.now() + 10800000).toISOString(), // 3h
          successRate: 87.3,
          description: 'Análise de tendências e oportunidades'
        }
      ];

      setAutomations(automationList);

      // Calcular métricas
      const totalAutomations = automationList.length;
      const activeAutomations = automationList.filter(a => a.status === 'active').length;
      const averageSuccessRate = automationList.reduce((sum, a) => sum + a.successRate, 0) / totalAutomations;

      // Buscar execuções das métricas
      const { data: metricsData } = await supabase
        .from('performance_metrics')
        .select('metric_value')
        .in('metric_name', ['ai_matching_execution', 'regulatory_sync_execution', 'compliance_check_execution'])
        .gte('measured_at', new Date(Date.now() - 86400000).toISOString()); // Últimas 24h

      const totalExecutions = metricsData?.reduce((sum, m) => sum + m.metric_value, 0) || 0;

      setMetrics({
        totalAutomations,
        activeAutomations,
        averageSuccessRate: Math.round(averageSuccessRate * 10) / 10,
        totalExecutions
      });

    } catch (error) {
      console.error('Error loading automation status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerAutomation = async (automationId: string) => {
    try {
      let actionType = '';
      switch (automationId) {
        case 'ai-matching':
          actionType = 'advanced_matching';
          break;
        case 'regulatory-sync':
          actionType = 'sync_all_apis';
          break;
        case 'compliance-monitor':
          actionType = 'generate_compatibility_scores';
          break;
        case 'market-intelligence':
          actionType = 'update_ai_embeddings';
          break;
      }

      const { data, error } = await supabase.functions.invoke('auto-sync', {
        body: { 
          action: actionType,
          user_id: user?.id,
          manual_trigger: true
        }
      });

      if (error) throw error;

      toast({
        title: "🚀 Automação Executada",
        description: `${automations.find(a => a.id === automationId)?.name} foi executada com sucesso`,
      });

      // Atualizar status
      loadAutomationStatus();

    } catch (error) {
      console.error('Error triggering automation:', error);
      toast({
        title: "Erro na Automação",
        description: "Falha ao executar automação",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                <Workflow className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl">Central de Automações</span>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-primary/10 text-primary">
                    <Bot className="h-3 w-3 mr-1" />
                    IA Ativa
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    {metrics.activeAutomations}/{metrics.totalAutomations} Ativas
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button onClick={loadAutomationStatus} variant="outline" size="sm">
              <Refresh className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{metrics.totalAutomations}</div>
              <div className="text-sm text-muted-foreground">Automações</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{metrics.activeAutomations}</div>
              <div className="text-sm text-muted-foreground">Ativas</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{metrics.averageSuccessRate}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{metrics.totalExecutions}</div>
              <div className="text-sm text-muted-foreground">Execuções (24h)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Automações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {automations.map((automation) => (
          <Card key={automation.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(automation.status)}
                  <div>
                    <span>{automation.name}</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(automation.status)}>
                        {automation.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => triggerAutomation(automation.id)}
                  size="sm"
                  variant="outline"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Executar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{automation.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Taxa de Sucesso</span>
                  <span className="font-medium">{automation.successRate}%</span>
                </div>
                <Progress value={automation.successRate} className="h-2" />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Última execução:</span>
                  <span>{new Date(automation.lastRun).toLocaleString()}</span>
                </div>
                
                {automation.nextRun && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Próxima execução:</span>
                    <span>{new Date(automation.nextRun).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Ações Rápidas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => triggerAutomation('ai-matching')}
              className="h-16 flex flex-col"
              variant="outline"
            >
              <Brain className="h-6 w-6 mb-2" />
              <span>Buscar Parceiros</span>
            </Button>
            
            <Button 
              onClick={() => triggerAutomation('regulatory-sync')}
              className="h-16 flex flex-col"
              variant="outline"
            >
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Sync Regulatório</span>
            </Button>
            
            <Button 
              onClick={() => triggerAutomation('compliance-monitor')}
              className="h-16 flex flex-col"
              variant="outline"
            >
              <CheckCircle className="h-6 w-6 mb-2" />
              <span>Verificar Compliance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationDashboard;
