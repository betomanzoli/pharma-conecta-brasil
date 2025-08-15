
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  FileText, 
  Users, 
  Settings, 
  TrendingUp,
  ArrowRight,
  Play,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AgentHandoffButton from './AgentHandoffButton';

interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  agents: string[];
  status: 'idle' | 'running' | 'completed';
  progress: number;
  results?: Record<string, any>;
}

const AgentOrchestrator = () => {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<AgentWorkflow[]>([
    {
      id: 'business-case-workflow',
      name: 'Desenvolvimento de Business Case',
      description: 'Análise completa de oportunidade de negócio farmacêutico',
      agents: ['business_strategist', 'technical_regulatory', 'project_analyst', 'coordinator'],
      status: 'idle',
      progress: 0
    },
    {
      id: 'regulatory-analysis-workflow',
      name: 'Análise Técnico-Regulatória',
      description: 'Avaliação de viabilidade regulatória e compliance',
      agents: ['technical_regulatory', 'document_assistant', 'coordinator'],
      status: 'idle',
      progress: 0
    },
    {
      id: 'project-planning-workflow',
      name: 'Planejamento de Projeto',
      description: 'Criação de Project Charter e cronograma detalhado',
      agents: ['project_analyst', 'business_strategist', 'document_assistant', 'coordinator'],
      status: 'idle',
      progress: 0
    }
  ]);

  const agentIcons = {
    business_strategist: TrendingUp,
    technical_regulatory: Settings,
    project_analyst: Users,
    document_assistant: FileText,
    coordinator: Brain
  };

  const agentNames = {
    business_strategist: 'Estrategista de Negócios',
    technical_regulatory: 'Técnico-Regulatório',
    project_analyst: 'Analista de Projetos',
    document_assistant: 'Assistente de Documentação',
    coordinator: 'Coordenador Central'
  };

  const startWorkflow = async (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: 'running', progress: 0 }
        : w
    ));

    toast({
      title: "Workflow Iniciado",
      description: `${workflow.name} está sendo executado pelos agentes de IA`,
    });

    // Simular progresso do workflow
    const totalSteps = workflow.agents.length;
    for (let i = 0; i < totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const progress = ((i + 1) / totalSteps) * 100;
      
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId 
          ? { ...w, progress }
          : w
      ));
    }

    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { 
            ...w, 
            status: 'completed', 
            progress: 100,
            results: {
              executionTime: '2.3s',
              agentsUsed: workflow.agents.length,
              confidence: 94
            }
          }
        : w
    ));

    toast({
      title: "Workflow Concluído",
      description: `${workflow.name} foi executado com sucesso`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Clock className="h-4 w-4 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Brain className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Orquestrador de Agentes IA</h2>
            <p className="text-muted-foreground">
              Workflows integrados para projetos farmacêuticos
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{workflow.name}</CardTitle>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)}`} />
              </div>
              <p className="text-sm text-muted-foreground">{workflow.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {workflow.agents.map((agentType) => {
                    const Icon = agentIcons[agentType as keyof typeof agentIcons];
                    return (
                      <Badge key={agentType} variant="outline" className="flex items-center space-x-1">
                        <Icon className="h-3 w-3" />
                        <span className="text-xs">{agentNames[agentType as keyof typeof agentNames]}</span>
                      </Badge>
                    );
                  })}
                </div>

                {workflow.status === 'running' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{Math.round(workflow.progress)}%</span>
                    </div>
                    <Progress value={workflow.progress} className="h-2" />
                  </div>
                )}

                {workflow.status === 'completed' && workflow.results && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-green-700">Tempo de Execução:</span>
                        <span className="font-medium">{workflow.results.executionTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Agentes Utilizados:</span>
                        <span className="font-medium">{workflow.results.agentsUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Confiança:</span>
                        <span className="font-medium">{workflow.results.confidence}%</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    onClick={() => startWorkflow(workflow.id)}
                    disabled={workflow.status === 'running'}
                    className="flex-1"
                  >
                    {getStatusIcon(workflow.status)}
                    <span className="ml-2">
                      {workflow.status === 'running' ? 'Executando...' : 
                       workflow.status === 'completed' ? 'Executar Novamente' : 'Iniciar Workflow'}
                    </span>
                  </Button>

                  {workflow.status === 'completed' && (
                    <AgentHandoffButton
                      sourceAgent="orchestrator"
                      targetAgents={workflow.agents}
                      outputData={workflow.results}
                      onHandoffComplete={() => {
                        toast({
                          title: "Handoff Criado",
                          description: "Tarefas criadas para os agentes especializados"
                        });
                      }}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowRight className="h-5 w-5" />
            <span>Fluxo de Integração Entre Agentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-4">
            {['business_strategist', 'technical_regulatory', 'project_analyst', 'document_assistant', 'coordinator'].map((agent, index, array) => {
              const Icon = agentIcons[agent as keyof typeof agentIcons];
              return (
                <React.Fragment key={agent}>
                  <div className="flex flex-col items-center space-y-2 min-w-0">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs text-center font-medium">
                      {agentNames[agent as keyof typeof agentNames]}
                    </span>
                  </div>
                  {index < array.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Os agentes trabalham em sequência, passando informações e refinando análises
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentOrchestrator;
