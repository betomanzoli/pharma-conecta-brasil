import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Target, 
  FileText, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Activity,
  TrendingUp,
  Zap,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AgentMetrics {
  agent_type: string;
  total_executions: number;
  success_rate: number;
  avg_confidence: number;
  last_execution: string;
  status: 'active' | 'idle' | 'error';
}

interface WorkflowStatus {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  agents_involved: string[];
  started_at: string;
}

const AIDashboard: React.FC = () => {
  const { toast } = useToast();
  const [agentMetrics, setAgentMetrics] = useState<AgentMetrics[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowStatus[]>([]);
  const [systemHealth, setSystemHealth] = useState({
    overall_health: 95,
    active_agents: 5,
    queued_tasks: 3,
    completed_today: 12
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Buscar métricas dos agentes
      const { data: outputs } = await supabase
        .from('ai_agent_outputs')
        .select('agent_type, kpis, status, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (outputs) {
        const metricsMap = new Map<string, any>();
        
        outputs.forEach(output => {
          const type = output.agent_type;
          if (!metricsMap.has(type)) {
            metricsMap.set(type, {
              agent_type: type,
              total_executions: 0,
              success_count: 0,
              confidence_sum: 0,
              last_execution: output.created_at,
              status: 'active' as const
            });
          }
          
          const metrics = metricsMap.get(type)!;
          metrics.total_executions++;
          if (output.status === 'completed') metrics.success_count++;
          if (output.kpis && typeof output.kpis === 'object' && 'confidence' in output.kpis) {
            metrics.confidence_sum += Number(output.kpis.confidence) || 0;
          }
        });

        const processedMetrics = Array.from(metricsMap.values()).map(m => ({
          ...m,
          success_rate: (m.success_count / m.total_executions) * 100,
          avg_confidence: m.confidence_sum / m.total_executions || 0
        }));

        setAgentMetrics(processedMetrics);
      }

      // Simular workflows ativos (em um sistema real, viria do banco)
      setWorkflows([
        {
          id: '1',
          name: 'Registro Produto Inovador',
          status: 'running',
          progress: 75,
          agents_involved: ['regulatory', 'business_strategist', 'project_manager'],
          started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2', 
          name: 'Análise Competitiva Mercado',
          status: 'completed',
          progress: 100,
          agents_involved: ['business_strategist', 'coordinator'],
          started_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ]);

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao carregar dados do dashboard',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case 'coordinator': return <Brain className="h-5 w-5 text-purple-500" />;
      case 'technical_regulatory': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'business_strategist': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'project_manager': return <Target className="h-5 w-5 text-orange-500" />;
      case 'document_generator': return <FileText className="h-5 w-5 text-indigo-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAgentName = (agentType: string) => {
    switch (agentType) {
      case 'coordinator': return 'Orquestrador Central';
      case 'technical_regulatory': return 'Especialista Regulatório';
      case 'business_strategist': return 'Estrategista de Mercado';
      case 'project_manager': return 'Gerente de Projetos';
      case 'document_generator': return 'Gerador de Documentação';
      case 'project-analyst': return 'Analista de Projetos';
      default: return agentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="container mx-auto px-4 py-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Central de Comando IA</h1>
            <p className="text-muted-foreground">
              Monitoramento em tempo real dos agentes de IA e workflows ativos
            </p>
          </div>

          {/* System Health Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Saúde do Sistema</p>
                  <p className="text-2xl font-bold">{systemHealth.overall_health}%</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Agentes Ativos</p>
                  <p className="text-2xl font-bold">{systemHealth.active_agents}</p>
                </div>
                <Zap className="h-8 w-8 text-blue-500" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Tarefas na Fila</p>
                  <p className="text-2xl font-bold">{systemHealth.queued_tasks}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Concluídas Hoje</p>
                  <p className="text-2xl font-bold">{systemHealth.completed_today}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Agent Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance dos Agentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agentMetrics.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getAgentIcon(agent.agent_type)}
                      <div>
                        <p className="font-medium">{getAgentName(agent.agent_type)}</p>
                        <p className="text-sm text-muted-foreground">
                          {agent.total_executions} execuções
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={agent.success_rate > 90 ? "default" : "secondary"}>
                        {agent.success_rate.toFixed(0)}% sucesso
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Confiança: {agent.avg_confidence.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Active Workflows */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Workflows Ativos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(workflow.status)}
                        <p className="font-medium">{workflow.name}</p>
                      </div>
                      <Badge variant={workflow.status === 'completed' ? 'default' : 'secondary'}>
                        {workflow.status === 'running' ? 'Em Execução' : 
                         workflow.status === 'completed' ? 'Concluído' : 'Falhou'}
                      </Badge>
                    </div>
                    
                    <Progress value={workflow.progress} className="mb-2" />
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{workflow.agents_involved.length} agentes envolvidos</span>
                      <span>{workflow.progress}% concluído</span>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <Link to="/ai-workflow">
                    <Button className="w-full">
                      Executar Novo Workflow
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/ai/coordenacao">
                  <Button variant="outline" className="w-full h-auto p-4 flex-col gap-2">
                    <Brain className="h-6 w-6" />
                    Orquestrador
                  </Button>
                </Link>
                
                <Link to="/ai/tecnico-regulatorio">
                  <Button variant="outline" className="w-full h-auto p-4 flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    Regulatório
                  </Button>
                </Link>
                
                <Link to="/ai/estrategista">
                  <Button variant="outline" className="w-full h-auto p-4 flex-col gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Estratégias
                  </Button>
                </Link>
                
                <Link to="/ai-workflow">
                  <Button variant="outline" className="w-full h-auto p-4 flex-col gap-2">
                    <Zap className="h-6 w-6" />
                    Workflow
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AIDashboard;