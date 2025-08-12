
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
  ArrowRight,
  Network,
  FileText,
  Settings,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DemoModeIndicator from '@/components/layout/DemoModeIndicator';
import { useAIHandoffs } from '@/hooks/useAIHandoffs';

const MasterAIHub = () => {
  const aiFeatures = [
    {
      title: 'Estrategista de Negócios IA',
      description: 'Business cases, análise SWOT e oportunidades de mercado',
      icon: TrendingUp,
      href: '/ai/estrategista',
      status: 'active',
      agent: 'Agente 1'
    },
    {
      title: 'Técnico‑Regulatório IA',
      description: 'Compliance ANVISA, análise técnica e pathway regulatório',
      icon: Settings,
      href: '/ai/tecnico-regulatorio', 
      status: 'active',
      agent: 'Agente 2'
    },
    {
      title: 'Analista de Projetos IA',
      description: 'Project Charter, análise de viabilidade e gestão de stakeholders',
      icon: Users,
      href: '/ai/analista-projetos',
      status: 'active',
      agent: 'Agente 3'
    },
    {
      title: 'Assistente de Documentação',
      description: 'Templates inteligentes, SOPs e documentos regulatórios',
      icon: FileText,
      href: '/ai/documentacao',
      status: 'active',
      agent: 'Agente 4'
    },
    {
      title: 'Coordenador Central',
      description: 'Orquestração de agentes e priorização de demandas',
      icon: Bot,
      href: '/ai/coordenacao',
      status: 'active',
      agent: 'Agente 5'
    },
    {
      title: 'Dashboard de Sinergia',
      description: 'Orquestração e monitoramento dos agentes de IA',
      icon: Workflow,
      href: '/ai/sinergia',
      status: 'active'
    },
    {
      title: 'Biblioteca de Prompts',
      description: 'Prompts especializados por fase do projeto farmacêutico',
      icon: Sparkles,
      href: '/ai/prompts',
      status: 'active'
    },
    {
      title: 'AI Matching Dashboard',
      description: 'Métricas avançadas de matching e performance de IA',
      icon: BarChart3,
      href: '/ai/matching-dashboard',
      status: 'active'
    },
    {
      title: 'Business Metrics',
      description: 'KPIs de negócio e análise de performance comercial',
      icon: TrendingUp,
      href: '/ai/business-metrics',
      status: 'active'
    },
    {
      title: 'Federal Learning',
      description: 'Aprendizado federado e sincronização de modelos',
      icon: Network,
      href: '/ai/federal',
      status: 'beta'
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
                  Central de inteligência artificial para consultoria farmacêutica
                </p>
              </div>
            </div>

            <DemoModeIndicator variant="alert" />
          </div>

          {/* Agentes Especializados */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Agentes de IA Especializados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiFeatures.filter(f => f.agent).map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{feature.title}</CardTitle>
                            {feature.agent && (
                              <span className="text-xs text-muted-foreground">{feature.agent}</span>
                            )}
                          </div>
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
                      <CardDescription className="text-sm">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to={feature.href}>
                        <Button 
                          className="w-full" 
                          variant={feature.status === 'development' ? 'outline' : 'default'}
                          disabled={feature.status === 'development'}
                        >
                          {feature.status === 'development' ? 'Em Breve' : 'Acessar Agente'}
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
          </div>

          {/* Dashboards e Ferramentas */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Dashboards e Ferramentas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiFeatures.filter(f => !f.agent).map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-secondary/10">
                            <Icon className="h-5 w-5 text-secondary-foreground" />
                          </div>
                          <CardTitle className="text-base">{feature.title}</CardTitle>
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
                      <CardDescription className="text-sm">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to={feature.href}>
                        <Button 
                          className="w-full" 
                          variant="outline"
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
          </div>

          {/* Orquestração de Handoffs */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Workflow className="h-5 w-5 text-blue-500" />
                <CardTitle>Orquestração de Handoffs</CardTitle>
              </div>
              <CardDescription>
                Execute jobs enfileirados entre agentes de IA para workflows integrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                <Button variant="secondary" onClick={() => runNext()}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Executar Próximo Handoff
                </Button>
                <Button onClick={() => runAll(10)}>
                  <Workflow className="h-4 w-4 mr-2" />
                  Executar até 10 Handoffs
                </Button>
                <Link to="/ai/sinergia">
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard de Sinergia
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Hub de IA Farmacêutica:</strong> Plataforma integrada com 5 agentes especializados 
              trabalhando em sinergia para consultoria farmacêutica de classe mundial. Cada agente 
              possui expertise específica e pode colaborar através de handoffs inteligentes.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default MasterAIHub;
