import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Users,
  FileText,
  Play,
  BarChart3
} from 'lucide-react';
import { useAIHandoffs } from '@/hooks/useAIHandoffs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AgentHandoffButton from '@/components/ai/AgentHandoffButton';

interface AgentOutput {
  id: string;
  agent_type: string;
  input: any;
  output_md: string;
  created_at: string;
  status: 'completed' | 'failed' | 'processing' | string;
  handoff_to: string[];
  kpis: any;
  project_id: string | null;
  user_id: string | null;
  updated_at: string | null;
  processing_time?: number;
}

const AgentsDashboardPage = () => {
  const [outputs, setOutputs] = useState<AgentOutput[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningHandoffs, setRunningHandoffs] = useState(false);
  
  const { runAll, enqueue, runNext } = useAIHandoffs();
  const { toast } = useToast();

  const agents = [
    { 
      id: 'ai-project-analyst', 
      name: 'Project Analyst',
      description: 'Análise e estruturação de projetos',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    { 
      id: 'ai-technical-regulatory', 
      name: 'Technical Regulatory',
      description: 'Análise técnica e regulatória',
      icon: FileText,
      color: 'bg-green-500'
    },
    { 
      id: 'ai-business-strategist', 
      name: 'Business Strategist',
      description: 'Estratégia de negócios',
      icon: Users,
      color: 'bg-purple-500'
    },
    { 
      id: 'ai-document-assistant', 
      name: 'Document Assistant',
      description: 'Geração de documentos',
      icon: FileText,
      color: 'bg-orange-500'
    },
    { 
      id: 'ai-coordinator-orchestrator', 
      name: 'Coordinator',
      description: 'Coordenação e síntese',
      icon: Bot,
      color: 'bg-indigo-500'
    }
  ];

  useEffect(() => {
    loadRecentOutputs();
  }, []);

  const loadRecentOutputs = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_agent_outputs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setOutputs((data || []) as unknown as AgentOutput[]);
    } catch (error) {
      console.error('Error loading outputs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAllHandoffs = async () => {
    setRunningHandoffs(true);
    try {
      const processed = await runAll();
      toast({
        title: "Handoffs executados!",
        description: `${processed} tarefas processadas`,
      });
      
      setTimeout(() => {
        loadRecentOutputs();
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro nos handoffs",
        description: "Não foi possível executar os handoffs",
        variant: "destructive"
      });
    } finally {
      setRunningHandoffs(false);
    }
  };

  const getAgentInfo = (agentName: string) => {
    return agents.find(a => a.id === agentName) || {
      id: agentName,
      name: agentName,
      description: 'Agente AI',
      icon: Bot,
      color: 'bg-gray-500'
    };
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-50';
      case 'failed': return 'text-red-500 bg-red-50';
      case 'processing': return 'text-blue-500 bg-blue-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Bot className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Agents Dashboard</h1>
            <p className="text-muted-foreground">Gerencie e monitore os agentes de IA</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="outputs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="outputs">Outputs Recentes</TabsTrigger>
          <TabsTrigger value="handoffs">Handoffs</TabsTrigger>
          <TabsTrigger value="agents">Status dos Agentes</TabsTrigger>
        </TabsList>

        <TabsContent value="outputs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Outputs dos Agentes</CardTitle>
                <Button onClick={loadRecentOutputs} variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando outputs...</div>
              ) : outputs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum output encontrado</p>
                  <p className="text-sm">Execute alguns agentes para ver os resultados aqui</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {outputs.map((output) => {
                    const agent = getAgentInfo(output.agent_type);
                    const IconComponent = agent.icon;
                    const procMs = Number(output?.kpis?.processing_time_ms ?? output.processing_time ?? 0);
                    
                    return (
                      <Card key={output.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${agent.color} text-white`}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{agent.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {formatTime(output.created_at)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(output.status)}>
                                {output.status}
                              </Badge>
                              <Badge variant="outline">
                                {procMs ? `${procMs}ms` : '-'}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {output.output_md && (
                              <div>
                                <h5 className="text-sm font-medium mb-2">Output:</h5>
                                <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                                  {output.output_md.substring(0, 200) + (output.output_md.length > 200 ? '...' : '')}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              <AgentHandoffButton
                                sourceAgent={output.agent_type}
                                targetAgents={['ai-coordinator-orchestrator']}
                                agentOutputId={output.id}
                                outputData={{ content: output.output_md, metadata: output.kpis }}
                                onHandoffComplete={loadRecentOutputs}
                              />
                              
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Ver Completo
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="handoffs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Fila de Handoffs</span>
                <Button 
                  onClick={handleRunAllHandoffs}
                  disabled={runningHandoffs}
                  variant="default"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {runningHandoffs ? 'Executando...' : 'Executar Todos'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>A fila não está disponível para visualização neste hook.</p>
                <p className="text-sm">Use "Executar Todos" para processar os handoffs pendentes.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const IconComponent = agent.icon;
              const recentOutputs = outputs.filter(o => o.agent_type === agent.id);
              const avgTime = recentOutputs.length > 0 
                ? Math.round(recentOutputs.reduce((acc, o) => acc + Number(o?.kpis?.processing_time_ms ?? o.processing_time ?? 0), 0) / recentOutputs.length)
                : 0;
              
              return (
                <Card key={agent.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${agent.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{agent.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold">{recentOutputs.length}</div>
                          <div className="text-xs text-muted-foreground">Execuções</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{avgTime}ms</div>
                          <div className="text-xs text-muted-foreground">Tempo Médio</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <Badge variant={recentOutputs.length > 0 ? "default" : "secondary"}>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {recentOutputs.length > 0 ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentsDashboardPage;
