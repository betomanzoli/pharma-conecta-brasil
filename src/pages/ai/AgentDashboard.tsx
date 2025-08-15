
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Settings, 
  Users, 
  FileText,
  Workflow,
  Activity
} from 'lucide-react';
import AgentOrchestrator from '@/components/ai/AgentOrchestrator';
import BusinessStrategistAgent from '@/components/ai/agents/BusinessStrategistAgent';
import TechnicalRegulatoryAgent from '@/components/ai/agents/TechnicalRegulatoryAgent';
import ProjectAnalystAgent from '@/components/ai/agents/ProjectAnalystAgent';
import DocumentAssistantAgent from '@/components/ai/agents/DocumentAssistantAgent';
import CoordinatorAgent from '@/components/ai/agents/CoordinatorAgent';

const AgentDashboard = () => {
  const agents = [
    {
      id: 'orchestrator',
      name: 'Orquestrador',
      description: 'Workflows integrados e coordenação de agentes',
      icon: Workflow,
      status: 'active',
      component: AgentOrchestrator
    },
    {
      id: 'business_strategist',
      name: 'Estrategista de Negócios',
      description: 'Business cases e análise de oportunidades',
      icon: TrendingUp,
      status: 'active',
      component: BusinessStrategistAgent
    },
    {
      id: 'technical_regulatory',
      name: 'Técnico-Regulatório',
      description: 'Compliance ANVISA e análise técnica',
      icon: Settings,
      status: 'active',
      component: TechnicalRegulatoryAgent
    },
    {
      id: 'project_analyst',
      name: 'Analista de Projetos',
      description: 'Project Charter e gestão de stakeholders',
      icon: Users,
      status: 'active',
      component: ProjectAnalystAgent
    },
    {
      id: 'document_assistant',
      name: 'Assistente de Documentação',
      description: 'Templates e documentos regulatórios',
      icon: FileText,
      status: 'active',
      component: DocumentAssistantAgent
    },
    {
      id: 'coordinator',
      name: 'Coordenador Central',
      description: 'Síntese e orquestração de resultados',
      icon: Brain,
      status: 'active',
      component: CoordinatorAgent
    }
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Activity className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Dashboard de Agentes IA</h1>
                <p className="text-muted-foreground">
                  Sistema integrado de agentes especializados para projetos farmacêuticos
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="orchestrator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              {agents.map((agent) => {
                const Icon = agent.icon;
                return (
                  <TabsTrigger 
                    key={agent.id} 
                    value={agent.id}
                    className="flex flex-col items-center space-y-1 h-16"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs hidden sm:inline">{agent.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {agents.map((agent) => {
              const Component = agent.component;
              return (
                <TabsContent key={agent.id} value={agent.id} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <agent.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{agent.name}</CardTitle>
                            <CardDescription className="text-base">
                              {agent.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {agent.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                  
                  <Component />
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AgentDashboard;
