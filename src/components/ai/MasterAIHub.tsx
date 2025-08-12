
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  FileText, 
  BarChart3, 
  Users, 
  Shield,
  TrendingUp,
  Activity,
  MessageSquare,
  Bot,
  Network,
  AlertTriangle,
  Settings,
  Zap,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MasterAIHub = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const aiModules = [
    {
      id: 'project-analyst',
      title: 'Analista de Projetos IA',
      description: 'Gere Project Charters completos com análise de riscos e cronogramas',
      icon: FileText,
      category: 'analysis',
      status: 'active',
      path: '/ai/analista-projetos',
      color: 'bg-blue-500'
    },
    {
      id: 'business-strategist',
      title: 'Estrategista de Negócios IA',
      description: 'Análise SWOT, business cases e estudos de viabilidade comercial',
      icon: TrendingUp,
      category: 'strategy',
      status: 'active',
      path: '/ai/estrategista',
      color: 'bg-green-500'
    },
    {
      id: 'technical-regulatory',
      title: 'Técnico-Regulatório IA',
      description: 'Avaliação de complexidade técnica e pathways regulatórios',
      icon: Shield,
      category: 'regulatory',
      status: 'active',
      path: '/ai/tecnico-regulatorio',
      color: 'bg-purple-500'
    },
    {
      id: 'documentation',
      title: 'Assistente de Documentação',
      description: 'Elaboração de CAPAs, SOPs e documentos técnicos padronizados',
      icon: FileText,
      category: 'documentation',
      status: 'active',
      path: '/ai/documentacao',
      color: 'bg-orange-500'
    },
    {
      id: 'coordinator',
      title: 'Coordenador Central IA',
      description: 'Orquestração de projetos e priorização inteligente de demandas',
      icon: Brain,
      category: 'coordination',
      status: 'active',
      path: '/ai/coordenacao',
      color: 'bg-indigo-500'
    },
    {
      id: 'federal-learning',
      title: 'Federal Learning System',
      description: 'Aprendizado distribuído com preservação de privacidade',
      icon: Network,
      category: 'ml',
      status: 'active',
      path: '/ai/federal',
      color: 'bg-cyan-500'
    },
    {
      id: 'matching-dashboard',
      title: 'AI Matching Dashboard',
      description: 'Monitoramento em tempo real do sistema de matching',
      icon: Activity,
      category: 'monitoring',
      status: 'active',
      path: '/ai/matching-dashboard',
      color: 'bg-pink-500'
    },
    {
      id: 'business-metrics',
      title: 'Business Metrics',
      description: 'Métricas de negócio e performance da plataforma',
      icon: BarChart3,
      category: 'analytics',
      status: 'active',
      path: '/ai/business-metrics',
      color: 'bg-yellow-500'
    },
    {
      id: 'automation',
      title: 'Central de Automações',
      description: 'Gestão e monitoramento de automações inteligentes',
      icon: Settings,
      category: 'automation',
      status: 'active',
      path: '/automation',
      color: 'bg-red-500'
    },
    {
      id: 'regulatory-alerts',
      title: 'Alertas Regulatórios',
      description: 'Monitoramento de atualizações da ANVISA e FDA',
      icon: AlertTriangle,
      category: 'regulatory',
      status: 'active',
      path: '/regulatory/alerts',
      color: 'bg-amber-500'
    }
  ];

  const categories = [
    { id: 'all', label: 'Todos', icon: Brain },
    { id: 'analysis', label: 'Análise', icon: FileText },
    { id: 'strategy', label: 'Estratégia', icon: TrendingUp },
    { id: 'regulatory', label: 'Regulatório', icon: Shield },
    { id: 'documentation', label: 'Documentação', icon: FileText },
    { id: 'coordination', label: 'Coordenação', icon: Target },
    { id: 'ml', label: 'Machine Learning', icon: Network },
    { id: 'monitoring', label: 'Monitoramento', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'automation', label: 'Automação', icon: Zap }
  ];

  const filteredModules = activeCategory === 'all' 
    ? aiModules 
    : aiModules.filter(module => module.category === activeCategory);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'beta':
        return <Badge className="bg-blue-100 text-blue-800">Beta</Badge>;
      case 'coming-soon':
        return <Badge className="bg-gray-100 text-gray-800">Em Breve</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Master AI Hub</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Central de controle dos agentes de IA especializados para o setor farmacêutico. 
          Cada módulo oferece expertise dedicada para otimizar seus projetos e processos.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{category.label}</span>
            </Button>
          );
        })}
      </div>

      {/* AI Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {module.title}
                      </CardTitle>
                      {getStatusBadge(module.status)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  {module.description}
                </p>
                <Link to={module.path}>
                  <Button className="w-full group-hover:scale-105 transition-transform">
                    <Bot className="h-4 w-4 mr-2" />
                    Acessar Módulo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{aiModules.length}</p>
                <p className="text-xs text-muted-foreground">Módulos Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">95%</p>
                <p className="text-xs text-muted-foreground">Disponibilidade</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">1.2k</p>
                <p className="text-xs text-muted-foreground">Consultas Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-xs text-muted-foreground">Satisfação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MasterAIHub;
