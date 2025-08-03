
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Bot, 
  Settings, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Workflow,
  Brain,
  Shield,
  Cpu,
  Network
} from 'lucide-react';

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error' | 'learning';
  trigger_type: 'event' | 'schedule' | 'predictive' | 'contextual';
  success_rate: number;
  executions: number;
  last_run: string;
  next_run?: string;
  auto_optimize: boolean;
  intelligence_level: 'basic' | 'advanced' | 'master';
}

interface PredictiveInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'optimization' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  suggested_action: string;
  auto_execute: boolean;
}

const MasterAutomationOrchestrator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [systemHealth, setSystemHealth] = useState(98.5);
  const [isLearning, setIsLearning] = useState(false);

  useEffect(() => {
    loadAutomationData();
    const interval = setInterval(loadAutomationData, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadAutomationData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('master-automation', {
        body: { 
          action: 'get_workflows',
          user_id: user?.id
        }
      });

      if (error) throw error;

      // Mock data para demonstração
      setWorkflows([
        {
          id: '1',
          name: 'Smart Partner Matching',
          description: 'Busca automática de parceiros baseada em IA',
          status: 'active',
          trigger_type: 'predictive',
          success_rate: 94.2,
          executions: 1247,
          last_run: new Date().toISOString(),
          auto_optimize: true,
          intelligence_level: 'master'
        },
        {
          id: '2',
          name: 'Regulatory Compliance Monitor',
          description: 'Monitoramento contínuo de mudanças regulatórias',
          status: 'active',
          trigger_type: 'event',
          success_rate: 99.1,
          executions: 3456,
          last_run: new Date(Date.now() - 300000).toISOString(),
          auto_optimize: true,
          intelligence_level: 'advanced'
        },
        {
          id: '3',
          name: 'Market Intelligence Engine',
          description: 'Análise preditiva de oportunidades de mercado',
          status: 'learning',
          trigger_type: 'contextual',
          success_rate: 87.8,
          executions: 892,
          last_run: new Date(Date.now() - 600000).toISOString(),
          auto_optimize: true,
          intelligence_level: 'master'
        }
      ]);

      setInsights([
        {
          id: '1',
          type: 'opportunity',
          title: 'Nova Oportunidade de Parceria Detectada',
          description: 'Laboratório XYZ tem 96% de compatibilidade com seus requisitos',
          confidence: 96,
          impact: 'high',
          suggested_action: 'Iniciar contato automaticamente',
          auto_execute: false
        },
        {
          id: '2',
          type: 'risk',
          title: 'Mudança Regulatória Prevista',
          description: 'ANVISA pode alterar requisitos para análises microbiológicas',
          confidence: 78,
          impact: 'medium',
          suggested_action: 'Preparar documentação de compliance',
          auto_execute: true
        },
        {
          id: '3',
          type: 'optimization',
          title: 'Workflow de Matching Pode ser Otimizado',
          description: 'Ajustes nos pesos do algoritmo aumentariam precisão em 12%',
          confidence: 92,
          impact: 'high',
          suggested_action: 'Aplicar otimizações sugeridas',
          auto_execute: false
        }
      ]);

    } catch (error) {
      console.error('Error loading automation data:', error);
    }
  };

  const toggleAutoPilot = async () => {
    setIsAutoPilot(!isAutoPilot);
    
    try {
      const { data, error } = await supabase.functions.invoke('master-automation', {
        body: { 
          action: 'toggle_autopilot',
          user_id: user?.id,
          enabled: !isAutoPilot
        }
      });

      if (error) throw error;

      toast({
        title: isAutoPilot ? "🎯 Modo Manual Ativado" : "🚀 AutoPilot Ativado",
        description: isAutoPilot 
          ? "Automações agora requerem aprovação manual"
          : "Sistema executando automações de forma autônoma",
      });

    } catch (error) {
      console.error('Error toggling autopilot:', error);
      setIsAutoPilot(!isAutoPilot); // Reverter se houver erro
    }
  };

  const executeInsight = async (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    if (!insight) return;

    try {
      const { data, error } = await supabase.functions.invoke('master-automation', {
        body: { 
          action: 'execute_insight',
          insight_id: insightId,
          user_id: user?.id
        }
      });

      if (error) throw error;

      toast({
        title: "⚡ Ação Executada",
        description: `${insight.suggested_action} foi executado com sucesso`,
      });

      // Remover insight executado
      setInsights(prev => prev.filter(i => i.id !== insightId));

    } catch (error) {
      console.error('Error executing insight:', error);
      toast({
        title: "Erro na Execução",
        description: "Falha ao executar ação automática",
        variant: "destructive"
      });
    }
  };

  const optimizeWorkflow = async (workflowId: string) => {
    setIsLearning(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('master-automation', {
        body: { 
          action: 'optimize_workflow',
          workflow_id: workflowId,
          user_id: user?.id
        }
      });

      if (error) throw error;

      toast({
        title: "🧠 Otimização Completa",
        description: "Workflow otimizado com machine learning avançado",
      });

      loadAutomationData();

    } catch (error) {
      console.error('Error optimizing workflow:', error);
    } finally {
      setIsLearning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'learning': return <Brain className="h-4 w-4 text-purple-500 animate-pulse" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Target className="h-5 w-5 text-green-500" />;
      case 'risk': return <Shield className="h-5 w-5 text-red-500" />;
      case 'optimization': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'trend': return <Activity className="h-5 w-5 text-purple-500" />;
      default: return <Bot className="h-5 w-5 text-gray-500" />;
    }
  };

  const getIntelligenceColor = (level: string) => {
    switch (level) {
      case 'master': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'advanced': return 'bg-gradient-to-r from-blue-500 to-purple-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Workflow className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl">Master Automation</span>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-purple-100 text-purple-800">
                    <Bot className="h-3 w-3 mr-1" />
                    Orquestrado por IA
                  </Badge>
                  <Badge className={isAutoPilot ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {isAutoPilot ? "AutoPilot ON" : "Manual"}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">System Health</div>
                <div className="text-2xl font-bold text-green-600">{systemHealth}%</div>
              </div>
              <Switch
                checked={isAutoPilot}
                onCheckedChange={toggleAutoPilot}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{workflows.length}</div>
              <div className="text-sm text-muted-foreground">Workflows Ativos</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {workflows.reduce((sum, w) => sum + w.executions, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Execuções Totais</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(workflows.reduce((sum, w) => sum + w.success_rate, 0) / workflows.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{insights.length}</div>
              <div className="text-sm text-muted-foreground">Insights Pendentes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Insights Preditivos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Confiança:</span>
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}%
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Impacto:</span>
                        <Badge 
                          className={`text-xs ${
                            insight.impact === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : insight.impact === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {insight.impact}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {insight.auto_execute && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Auto
                    </Badge>
                  )}
                  <Button
                    onClick={() => executeInsight(insight.id)}
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Executar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(workflow.status)}
                  <div>
                    <span>{workflow.name}</span>
                    <div className={`w-20 h-1 rounded-full mt-1 ${getIntelligenceColor(workflow.intelligence_level)}`} />
                  </div>
                </div>
                <Badge className={`${getIntelligenceColor(workflow.intelligence_level)} text-white text-xs`}>
                  {workflow.intelligence_level}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{workflow.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {workflow.success_rate}%
                  </div>
                  <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {workflow.executions}
                  </div>
                  <div className="text-sm text-muted-foreground">Execuções</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Performance</span>
                  <span>{workflow.success_rate}%</span>
                </div>
                <Progress value={workflow.success_rate} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Última execução: {new Date(workflow.last_run).toLocaleString()}</span>
                <Badge variant="outline" className="text-xs">
                  {workflow.trigger_type}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Auto-otimização: {workflow.auto_optimize ? 'ON' : 'OFF'}
                  </span>
                </div>
                <Button
                  onClick={() => optimizeWorkflow(workflow.id)}
                  disabled={isLearning}
                  size="sm"
                  variant="outline"
                >
                  {isLearning ? (
                    <>
                      <Cpu className="h-4 w-4 mr-2 animate-spin" />
                      Otimizando...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Otimizar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MasterAutomationOrchestrator;
