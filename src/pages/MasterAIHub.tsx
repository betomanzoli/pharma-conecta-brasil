
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Workflow,
  Sparkles,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DemoModeIndicator from '@/components/layout/DemoModeIndicator';
import MasterChatbot from '@/components/ai/MasterChatbot';
import { useAIHandoffs } from '@/hooks/useAIHandoffs';

const MasterAIHub = () => {
const aiFeatures = [
  {
    title: 'Chat Inteligente',
    description: 'Converse com IA especializada em farmacêutica',
    icon: MessageSquare,
    href: '/chat',
    status: 'active'
  },
  {
    title: 'Estrategista IA',
    description: 'Gere business cases e análises SWOT guiadas',
    icon: Sparkles,
    href: '/ai/estrategista',
    status: 'beta'
  },
  {
    title: 'Técnico‑Regulatório IA',
    description: 'Parecer técnico e caminho regulatório (ANVISA/FDA/EMA)',
    icon: BarChart3,
    href: '/ai/regulatorio',
    status: 'beta'
  },
  {
    title: 'Gerente de Projetos IA',
    description: 'Charter, cronograma e stakeholders com IA',
    icon: Users,
    href: '/ai/gerente-projetos',
    status: 'development'
  },
  {
    title: 'Assistente de Documentação',
    description: 'Preencha CAPA, SOPs e CTD com validação',
    icon: Workflow,
    href: '/ai/documentacao',
    status: 'development'
  },
  {
    title: 'Dashboard de Sinergia',
    description: 'KPIs e status integrados dos módulos de IA',
    icon: Bot,
    href: '/ai/sinergia',
    status: 'beta'
  },
  {
    title: 'Biblioteca de Prompts',
    description: 'Prompts por fase do projeto para IA',
    icon: Sparkles,
    href: '/ai/prompts',
    status: 'active'
  }
];

  const { runNext, runAll } = useAIHandoffs();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Bot className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Master AI Hub
                </h1>
                <p className="text-muted-foreground">
                  Central de inteligência artificial para o setor farmacêutico
                </p>
              </div>
            </div>

            <DemoModeIndicator variant="alert" />
          </div>

          {/* Recursos AI disponíveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-blue-500" />
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        feature.status === 'active' ? 'bg-green-100 text-green-800' :
                        feature.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {feature.status === 'active' ? 'Ativo' :
                         feature.status === 'beta' ? 'Beta' : 'Em Desenvolvimento'}
                      </div>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={feature.href}>
                      <Button 
                        className="w-full" 
                        variant={feature.status === 'development' ? 'outline' : 'default'}
                        disabled={feature.status === 'development'}
                      >
                        {feature.status === 'development' ? 'Em Breve' : 'Acessar'}
                        {feature.status !== 'development' && (
                          <ArrowRight className="h-4 w-4 ml-2" />
                        )}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Chat integrado */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <CardTitle>Chat AI Integrado</CardTitle>
              </div>
              <CardDescription>
                Experimente o assistente AI diretamente aqui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MasterChatbot />
            </CardContent>
          </Card>

          {/* Orquestração de Handoffs */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Workflow className="h-5 w-5 text-blue-500" />
                <CardTitle>Orquestração de Handoffs</CardTitle>
              </div>
              <CardDescription>
                Execute jobs enfileirados entre agentes de IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                <Button variant="secondary" onClick={() => runNext()}>
                  Executar 1 handoff
                </Button>
                <Button onClick={() => runAll(10)}>
                  Executar até 10
                </Button>
              </div>
            </CardContent>
          </Card>

          <Alert className="mt-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Hub de IA em Desenvolvimento:</strong> Este é o centro de recursos 
              de inteligência artificial da plataforma. Alguns recursos estão em desenvolvimento 
              e serão disponibilizados gradualmente.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default MasterAIHub;
