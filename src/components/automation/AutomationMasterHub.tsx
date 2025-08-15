
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Bot, 
  Workflow, 
  Settings, 
  Activity,
  Brain,
  Shield,
  TrendingUp,
  Target,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Square,
  RotateCcw
} from 'lucide-react';

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'stopped' | 'error';
  trigger: string;
  actions: string[];
  success_rate: number;
  executions_today: number;
  avg_execution_time: number;
  next_execution?: string;
  priority: 'high' | 'medium' | 'low';
  category: 'matching' | 'governance' | 'value' | 'compliance' | 'analytics';
}

interface AutomationMetrics {
  total_workflows: number;
  active_workflows: number;
  daily_executions: number;
  success_rate: number;
  time_saved_hours: number;
  cost_reduction_percent: number;
}

const AutomationMasterHub: React.FC = () => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [metrics, setMetrics] = useState<AutomationMetrics | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    loadAutomationData();
    const interval = setInterval(loadAutomationData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAutomationData = () => {
    // Mock automation workflows
    const mockWorkflows: AutomationWorkflow[] = [
      {
        id: 'auto-1',
        name: 'AI Matching Automático',
        description: 'Executa matching inteligente a cada nova solicitação',
        status: 'active',
        trigger: 'Nova solicitação de projeto',
        actions: ['Análise de requisitos', 'Busca de parceiros', 'Score de compatibilidade', 'Notificação'],
        success_rate: 94.2,
        executions_today: 47,
        avg_execution_time: 2.3,
        next_execution: '15:30',
        priority: 'high',
        category: 'matching'
      },
      {
        id: 'auto-2',
        name: 'Governança Colaborativa',
        description: 'Monitora compliance e atualiza status automaticamente',
        status: 'active',
        trigger: 'Mudança em documentos regulatórios',
        actions: ['Verificação ANVISA', 'Atualização compliance', 'Alertas stakeholders', 'Relatório'],
        success_rate: 89.1,
        executions_today: 23,
        avg_execution_time: 5.7,
        next_execution: '16:00',
        priority: 'high',
        category: 'governance'
      },
      {
        id: 'auto-3',
        name: 'Cálculo de Valor Compartilhado',
        description: 'Atualiza métricas de ROI e impacto em tempo real',
        status: 'active',
        trigger: 'Conclusão de milestone',
        actions: ['Cálculo ROI', 'Análise impacto social', 'Atualização dashboard', 'Relatório financeiro'],
        success_rate: 91.7,
        executions_today: 18,
        avg_execution_time: 3.2,
        next_execution: '17:00',
        priority: 'medium',
        category: 'value'
      },
      {
        id: 'auto-4',
        name: 'Monitoramento Compliance',
        description: 'Verifica status regulatório e gera alertas preventivos',
        status: 'active',
        trigger: 'Agendamento diário',
        actions: ['Verificação ANVISA', 'Check documentos', 'Análise riscos', 'Alertas preventivos'],
        success_rate: 96.3,
        executions_today: 12,
        avg_execution_time: 8.1,
        next_execution: '09:00',
        priority: 'high',
        category: 'compliance'
      },
      {
        id: 'auto-5',
        name: 'Análise Preditiva Avançada',
        description: 'Executa modelos ML para predições de mercado',
        status: 'active',
        trigger: 'Novos dados de mercado',
        actions: ['Análise trends', 'Modelagem preditiva', 'Insights estratégicos', 'Dashboard atualização'],
        success_rate: 87.4,
        executions_today: 8,
        avg_execution_time: 12.5,
        next_execution: '20:00',
        priority: 'medium',
        category: 'analytics'
      },
      {
        id: 'auto-6',
        name: 'Sync Dados Regulatórios',
        description: 'Sincroniza dados da ANVISA e FDA automaticamente',
        status: 'paused',
        trigger: 'Agenda semanal',
        actions: ['Download dados ANVISA', 'Parse FDA data', 'Limpeza dados', 'Atualização base'],
        success_rate: 92.8,
        executions_today: 2,
        avg_execution_time: 45.2,
        priority: 'low',
        category: 'analytics'
      }
    ];

    setWorkflows(mockWorkflows);

    // Mock metrics
    const mockMetrics: AutomationMetrics = {
      total_workflows: mockWorkflows.length,
      active_workflows: mockWorkflows.filter(w => w.status === 'active').length,
      daily_executions: mockWorkflows.reduce((sum, w) => sum + w.executions_today, 0),
      success_rate: mockWorkflows.reduce((sum, w) => sum + w.success_rate, 0) / mockWorkflows.length,
      time_saved_hours: 847.3,
      cost_reduction_percent: 34.2
    };

    setMetrics(mockMetrics);
  };

  const handleWorkflowAction = (workflowId: string, action: 'start' | 'pause' | 'stop' | 'restart') => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === workflowId) {
        let newStatus: AutomationWorkflow['status'];
        switch (action) {
          case 'start':
            newStatus = 'active';
            break;
          case 'pause':
            newStatus = 'paused';
            break;
          case 'stop':
            newStatus = 'stopped';
            break;
          case 'restart':
            newStatus = 'active';
            break;
        }
        return { ...w, status: newStatus };
      }
      return w;
    }));

    toast({
      title: "Workflow Atualizado",
      description: `Workflow ${action === 'restart' ? 'reiniciado' : action === 'start' ? 'iniciado' : action === 'pause' ? 'pausado' : 'parado'} com sucesso`,
    });
  };

  const getStatusColor = (status: AutomationWorkflow['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'stopped': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
    }
  };

  const getPriorityColor = (priority: AutomationWorkflow['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
    }
  };

  const getCategoryIcon = (category: AutomationWorkflow['category']) => {
    switch (category) {
      case 'matching': return Brain;
      case 'governance': return Shield;
      case 'value': return TrendingUp;
      case 'compliance': return Target;
      case 'analytics': return BarChart3;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span>Automação Master</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Orquestração inteligente de todos os processos do PharmaConnect Brasil
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
            Sistema Ativo
          </Badge>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {metrics?.active_workflows}/{metrics?.total_workflows}
            </div>
            <div className="text-sm text-gray-600">Workflows Ativos</div>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Execuções Hoje</p>
                  <p className="text-2xl font-bold">{metrics.daily_executions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.success_rate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Tempo Poupado</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics.time_saved_hours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Redução Custos</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics.cost_reduction_percent}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="text-sm text-gray-600">Workflows Ativos</p>
                  <p className="text-2xl font-bold text-indigo-600">{metrics.active_workflows}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Workflow className="h-5 w-5 text-teal-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Workflows</p>
                  <p className="text-2xl font-bold text-teal-600">{metrics.total_workflows}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Workflows */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  <span>Workflows Ativos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workflows.filter(w => w.status === 'active').slice(0, 5).map((workflow) => {
                    const CategoryIcon = getCategoryIcon(workflow.category);
                    return (
                      <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CategoryIcon className="h-4 w-4 text-gray-600" />
                          <div>
                            <h4 className="font-semibold text-sm">{workflow.name}</h4>
                            <p className="text-xs text-gray-600">{workflow.executions_today} execuções hoje</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-600">
                            {workflow.success_rate}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {workflow.avg_execution_time}s
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <span>Saúde do Sistema</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Performance Geral</span>
                      <span>{metrics?.success_rate.toFixed(1)}%</span>
                    </div>
                    <Progress value={metrics?.success_rate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Workflows Ativos</span>
                      <span>{Math.round((metrics?.active_workflows || 0) / (metrics?.total_workflows || 1) * 100)}%</span>
                    </div>
                    <Progress value={Math.round((metrics?.active_workflows || 0) / (metrics?.total_workflows || 1) * 100)} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Automação Coverage</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">99.2%</div>
                      <div className="text-xs text-gray-600">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">2.1s</div>
                      <div className="text-xs text-gray-600">Resp. Média</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="space-y-4">
            {workflows.map((workflow) => {
              const CategoryIcon = getCategoryIcon(workflow.category);
              return (
                <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <CategoryIcon className="h-5 w-5 text-gray-600" />
                          <h3 className="text-lg font-semibold">{workflow.name}</h3>
                          <Badge className={getStatusColor(workflow.status)}>
                            {workflow.status}
                          </Badge>
                          <Badge className={getPriorityColor(workflow.priority)} variant="outline">
                            {workflow.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{workflow.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Trigger: </span>
                            <span className="font-medium">{workflow.trigger}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Execuções Hoje: </span>
                            <span className="font-medium text-blue-600">{workflow.executions_today}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Taxa de Sucesso: </span>
                            <span className="font-medium text-green-600">{workflow.success_rate}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Tempo Médio: </span>
                            <span className="font-medium">{workflow.avg_execution_time}s</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <span className="text-gray-500 text-sm">Ações: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {workflow.actions.map((action, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {action}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="ml-6 flex flex-col space-y-2">
                        <Button
                          size="sm"
                          variant={workflow.status === 'active' ? 'outline' : 'default'}
                          onClick={() => handleWorkflowAction(workflow.id, workflow.status === 'active' ? 'pause' : 'start')}
                        >
                          {workflow.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWorkflowAction(workflow.id, 'restart')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWorkflowAction(workflow.id, 'stop')}
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Execuções em Tempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">AI Matching em execução</span>
                    </div>
                    <span className="text-sm text-gray-600">15:28:34</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Análise Preditiva aguardando</span>
                    </div>
                    <span className="text-sm text-gray-600">Next: 16:00</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Compliance Check concluído</span>
                    </div>
                    <span className="text-sm text-gray-600">15:25:12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertas e Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="font-medium text-yellow-800">Performance degradada</p>
                      <p className="text-sm text-yellow-600">Workflow de sync ANVISA com latência alta</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium text-green-800">Otimização aplicada</p>
                      <p className="text-sm text-green-600">AI Matching 15% mais rápido após ajustes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-800">Novo workflow detectado</p>
                      <p className="text-sm text-blue-600">Padrão recorrente identificado para automação</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configurações de Automação</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Configurações Gerais</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Auto-restart em falhas</span>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Retry automático</span>
                        <Badge className="bg-green-100 text-green-800">3x tentativas</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Timeout padrão</span>
                        <Badge variant="outline">30s</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Notificações</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Alertas de falha</span>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Relatórios diários</span>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Performance warnings</span>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Horários de Execução</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium">Horário Comercial</h5>
                      <p className="text-gray-600">08:00 - 18:00</p>
                      <p className="text-xs text-gray-500">Seg-Sex</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium">Fora do Horário</h5>
                      <p className="text-gray-600">18:00 - 08:00</p>
                      <p className="text-xs text-gray-500">Apenas alta prioridade</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium">Finais de Semana</h5>
                      <p className="text-gray-600">24h</p>
                      <p className="text-xs text-gray-500">Monitoramento apenas</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationMasterHub;
