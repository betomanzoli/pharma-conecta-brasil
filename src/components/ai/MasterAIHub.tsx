
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, FileText, TrendingUp, Settings, BarChart, Database, Bot, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MasterAIHub = () => {
  const navigate = useNavigate();

  const aiModules = [
    {
      title: 'Analista de Projetos',
      description: 'Project Charter, análise de viabilidade e gestão de stakeholders',
      icon: FileText,
      route: '/ai/analista-projetos',
      color: 'bg-blue-500',
      status: 'active'
    },
    {
      title: 'Estrategista de Negócios',
      description: 'Business cases, análise SWOT e oportunidades de mercado',
      icon: TrendingUp,
      route: '/ai/estrategista',
      color: 'bg-green-500',
      status: 'active'
    },
    {
      title: 'Técnico Regulatório',
      description: 'Compliance ANVISA, análise técnica e pathway regulatório',
      icon: Settings,
      route: '/ai/tecnico-regulatorio',
      color: 'bg-purple-500',
      status: 'active'
    },
    {
      title: 'Assistente de Documentação',
      description: 'Templates inteligentes, SOPs e documentos regulatórios',
      icon: FileText,
      route: '/ai/documentacao',
      color: 'bg-orange-500',
      status: 'active'
    },
    {
      title: 'Coordenador Central',
      description: 'Orquestração de agentes e priorização de demandas',
      icon: Brain,
      route: '/ai/coordenacao',
      color: 'bg-red-500',
      status: 'active'
    },
    {
      title: 'AI Matching Dashboard',
      description: 'Métricas avançadas de matching e performance de IA',
      icon: BarChart,
      route: '/ai/matching-dashboard',
      color: 'bg-indigo-500',
      status: 'active'
    },
    {
      title: 'Business Metrics',
      description: 'KPIs de negócio e análise de performance comercial',
      icon: TrendingUp,
      route: '/ai/business-metrics',
      color: 'bg-teal-500',
      status: 'active'
    },
    {
      title: 'Federal Learning',
      description: 'Aprendizado federado e sincronização de modelos',
      icon: Database,
      route: '/ai/federal',
      color: 'bg-cyan-500',
      status: 'active'
    },
    {
      title: 'Automação Master',
      description: 'Orquestração de workflows e automações inteligentes',
      icon: Zap,
      route: '/automation',
      color: 'bg-yellow-500',
      status: 'active'
    }
  ];

  const knowledgeModules = [
    {
      title: 'Biblioteca de Conhecimento',
      description: 'Base curada com RAG para busca inteligente',
      icon: Database,
      route: '/knowledge',
      color: 'bg-emerald-500'
    },
    {
      title: 'Alertas Regulatórios',
      description: 'Monitoramento ANVISA e alertas em tempo real',
      icon: Bot,
      route: '/regulatory/alerts',
      color: 'bg-rose-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Brain className="h-6 w-6" />
          Master AI Hub
        </h2>
        <p className="text-muted-foreground">
          Central de comando para todos os agentes de IA especializados do PharmaConnect Brasil
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Agentes de IA Especializados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiModules.map((module, index) => {
            const IconComponent = module.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${module.color} text-white`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{module.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Online</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(module.route)}
                    variant="outline"
                  >
                    Acessar Agente
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Base de Conhecimento & Integração</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {knowledgeModules.map((module, index) => {
            const IconComponent = module.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${module.color} text-white`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{module.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(module.route)}
                    variant="outline"
                  >
                    Acessar Módulo
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">9</div>
              <div className="text-sm text-muted-foreground">Agentes Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">2.4k</div>
              <div className="text-sm text-muted-foreground">Consultas Hoje</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">98.5%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">1.2s</div>
              <div className="text-sm text-muted-foreground">Resposta Média</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterAIHub;
