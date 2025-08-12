import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Workflow, 
  Bot, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Network,
  Activity
} from 'lucide-react';
import { useAIHandoffs } from '@/hooks/useAIHandoffs';

const SynergyDashboard = () => {
  const [handoffStats, setHandoffStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0
  });
  const [agentPerformance, setAgentPerformance] = useState([
    { agent: 'Estrategista de Negócios', tasks: 45, success_rate: 92, avg_time: '2.3min' },
    { agent: 'Técnico-Regulatório', tasks: 38, success_rate: 96, avg_time: '3.1min' },
    { agent: 'Analista de Projetos', tasks: 52, success_rate: 89, avg_time: '1.8min' },
    { agent: 'Assistente de Documentação', tasks: 67, success_rate: 94, avg_time: '4.2min' },
    { agent: 'Coordenador Central', tasks: 23, success_rate: 98, avg_time: '1.1min' }
  ]);

  const { runNext, runAll } = useAIHandoffs();

  useEffect(() => {
    // Simulate loading stats
    setHandoffStats({
      total: 225,
      pending: 12,
      completed: 198,
      failed: 15
    });
  }, []);

  const handleRunNext = async () => {
    await runNext();
    // Refresh stats after execution
  };

  const handleRunAll = async () => {
    await runAll(10);
    // Refresh stats after execution
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Workflow className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Dashboard de Sinergia</h1>
                <p className="text-muted-foreground">
                  Orquestração e monitoramento dos agentes de IA
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Controle de Handoffs</span>
              </CardTitle>
              <CardDescription>
                Execute tarefas pendentes entre agentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button onClick={handleRunNext} variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Executar Próximo
                </Button>
                <Button onClick={handleRunAll}>
                  <Workflow className="h-4 w-4 mr-2" />
                  Executar Todos (máx. 10)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="agents">Performance dos Agentes</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Handoffs</CardTitle>
                    <Network className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{handoffStats.total}</div>
                    <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{handoffStats.pending}</div>
                    <p className="text-xs text-muted-foreground">Aguardando execução</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completados</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{handoffStats.completed}</div>
                    <p className="text-xs text-muted-foreground">Taxa de sucesso 88%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Falhas</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{handoffStats.failed}</div>
                    <p className="text-xs text-muted-foreground">Requer atenção</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Fluxo de Trabalho em Tempo Real</CardTitle>
                  <CardDescription>
                    Acompanhamento dos handoffs ativos entre agentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bot className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Estrategista → Técnico-Regulatório</span>
                      </div>
                      <Badge variant="outline">Em processamento</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bot className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Documentação → Coordenador</span>
                      </div>
                      <Badge variant="default">Completo</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agents">
              <div className="space-y-6">
                {agentPerformance.map((agent, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{agent.agent}</CardTitle>
                        <Badge variant="secondary">{agent.tasks} tarefas</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Taxa de Sucesso</Label>
                          <div className="mt-2">
                            <Progress value={agent.success_rate} className="h-2" />
                            <span className="text-sm text-muted-foreground">{agent.success_rate}%</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Tempo Médio</Label>
                          <div className="text-2xl font-bold">{agent.avg_time}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Status</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Ativo</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="workflows">
              <Card>
                <CardHeader>
                  <CardTitle>Workflows Configurados</CardTitle>
                  <CardDescription>
                    Fluxos automáticos entre agentes para diferentes cenários
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Business Case Completo</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Estrategista → Técnico-Regulatório → Analista de Projetos → Documentação
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">4 etapas</Badge>
                        <Badge variant="secondary">Automático</Badge>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Análise Regulatória</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Técnico-Regulatório → Documentação → Coordenador
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">3 etapas</Badge>
                        <Badge variant="secondary">Manual</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SynergyDashboard;
