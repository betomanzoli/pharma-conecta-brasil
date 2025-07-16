import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedCard from '@/components/ui/enhanced-card';
import { 
  Brain,
  TrendingUp,
  Clock,
  Bell,
  Target,
  Users,
  Calendar,
  BookOpen,
  Zap,
  ArrowRight,
  Settings,
  Star,
  Activity,
  PieChart,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  MessageCircle,
  Bookmark
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'list' | 'ai_insight' | 'quick_action';
  priority: number;
  data: any;
  lastUpdated: Date;
  personalized: boolean;
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  category: 'opportunity' | 'warning' | 'tip' | 'trend';
  data?: any;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  urgent: boolean;
  category: string;
  action: () => void;
}

const PersonalizedDashboard = () => {
  const { profile } = useAuth();
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadPersonalizedContent();
  }, [profile]);

  const loadPersonalizedContent = async () => {
    setLoading(true);
    
    try {
      // Simular carregamento de conteúdo personalizado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gerar insights personalizados baseados no tipo de usuário
      const insights = generatePersonalizedInsights();
      const actions = generateQuickActions();
      const dashboardWidgets = generateWidgets();
      
      setAiInsights(insights);
      setQuickActions(actions);
      setWidgets(dashboardWidgets);
      
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast.error('Erro ao carregar dados personalizados');
    } finally {
      setLoading(false);
    }
  };

  const generatePersonalizedInsights = (): AIInsight[] => {
    const baseInsights: AIInsight[] = [
      {
        id: '1',
        title: 'Oportunidade de Networking',
        description: 'Identificamos 3 profissionais na sua área que podem ser valiosos para seus projetos',
        confidence: 0.89,
        actionable: true,
        category: 'opportunity',
        data: { contacts: 3, matchScore: 0.89 }
      },
      {
        id: '2',
        title: 'Tendência Regulatória',
        description: 'Novas regulamentações ANVISA podem impactar seus produtos. Recomendamos revisar.',
        confidence: 0.76,
        actionable: true,
        category: 'warning',
        data: { regulations: 2, urgency: 'medium' }
      },
      {
        id: '3',
        title: 'Certificação Recomendada',
        description: 'Baseado no seu perfil, a certificação ISO 17025 aumentaria suas oportunidades em 40%',
        confidence: 0.92,
        actionable: true,
        category: 'tip',
        data: { certification: 'ISO 17025', impact: 0.4 }
      }
    ];

    // Personalizar baseado no tipo de usuário
    if (profile?.user_type === 'laboratory') {
      baseInsights.push({
        id: '4',
        title: 'Demanda por Análises',
        description: 'Detectamos aumento de 25% na demanda por análises microbiológicas na sua região',
        confidence: 0.85,
        actionable: true,
        category: 'trend',
        data: { demandIncrease: 0.25, area: 'microbiologia' }
      });
    }

    return baseInsights;
  };

  const generateQuickActions = (): QuickAction[] => {
    return [
      {
        id: '1',
        title: 'Completar Perfil',
        description: 'Seu perfil está 70% completo. Complete para mais visibilidade.',
        icon: Users,
        urgent: false,
        category: 'profile',
        action: () => toast.info('Redirecionando para o perfil...')
      },
      {
        id: '2',
        title: 'Agendar Mentoria',
        description: 'Você tem 2 mentores disponíveis esta semana.',
        icon: Calendar,
        urgent: false,
        category: 'mentorship',
        action: () => toast.info('Abrindo agenda de mentoria...')
      },
      {
        id: '3',
        title: 'Responder Mensagem',
        description: 'Você tem 3 mensagens não lidas importantes.',
        icon: MessageCircle,
        urgent: true,
        category: 'communication',
        action: () => toast.info('Abrindo mensagens...')
      },
      {
        id: '4',
        title: 'Revisar Proposta',
        description: 'Nova proposta de projeto aguarda sua análise.',
        icon: AlertCircle,
        urgent: true,
        category: 'business',
        action: () => toast.info('Abrindo propostas...')
      }
    ];
  };

  const generateWidgets = (): DashboardWidget[] => {
    return [
      {
        id: '1',
        title: 'Métricas de Engajamento',
        type: 'metric',
        priority: 1,
        data: {
          views: 1247,
          connections: 89,
          messages: 23,
          growth: 0.15
        },
        lastUpdated: new Date(),
        personalized: true
      },
      {
        id: '2',
        title: 'Atividade Recente',
        type: 'list',
        priority: 2,
        data: [
          { action: 'Novo contato adicionado', time: '2 horas atrás', type: 'connection' },
          { action: 'Projeto visualizado 5x', time: '1 dia atrás', type: 'view' },
          { action: 'Mensagem recebida', time: '2 dias atrás', type: 'message' }
        ],
        lastUpdated: new Date(),
        personalized: true
      }
    ];
  };

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'opportunity': return Target;
      case 'warning': return AlertCircle;
      case 'tip': return Star;
      case 'trend': return TrendingUp;
      default: return Brain;
    }
  };

  const getInsightColor = (category: string) => {
    switch (category) {
      case 'opportunity': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'tip': return 'text-blue-600 bg-blue-100';
      case 'trend': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header personalizado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Olá, {profile?.first_name || 'Usuário'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Aqui está seu resumo personalizado para hoje
          </p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Personalizar</span>
        </Button>
      </div>

      {/* Ações rápidas urgentes */}
      {quickActions.filter(action => action.urgent).length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              <span>Ações Urgentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickActions
                .filter(action => action.urgent)
                .map(action => {
                  const Icon = action.icon;
                  return (
                    <div 
                      key={action.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="font-medium text-sm">{action.title}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={action.action}>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs principais */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
          <TabsTrigger value="actions">Ações Rápidas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Widget de métricas */}
            {widgets
              .filter(w => w.type === 'metric')
              .map(widget => (
                <EnhancedCard
                  key={widget.id}
                  title={widget.title}
                  variant="featured"
                  trending={widget.personalized}
                  animated
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{widget.data.views}</p>
                      <p className="text-xs text-muted-foreground">Visualizações</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{widget.data.connections}</p>
                      <p className="text-xs text-muted-foreground">Conexões</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{widget.data.messages}</p>
                      <p className="text-xs text-muted-foreground">Mensagens</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">+{Math.round(widget.data.growth * 100)}%</p>
                      <p className="text-xs text-muted-foreground">Crescimento</p>
                    </div>
                  </div>
                </EnhancedCard>
              ))}

            {/* Atividades recentes */}
            <EnhancedCard
              title="Atividade Recente"
              variant="default"
              className="md:col-span-2"
            >
              <ScrollArea className="h-48">
                <div className="space-y-3">
                  {widgets
                    .filter(w => w.type === 'list')[0]?.data
                    .map((activity: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </EnhancedCard>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiInsights.map(insight => {
              const Icon = getInsightIcon(insight.category);
              const colorClass = getInsightColor(insight.category);
              
              return (
                <EnhancedCard
                  key={insight.id}
                  title={insight.title}
                  description={insight.description}
                  variant="premium"
                  premium
                  glow
                  animated
                  onAction={() => toast.info('Explorando insight...')}
                  actionText="Explorar"
                  actionIcon={Brain}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge variant="outline">
                      {Math.round(insight.confidence * 100)}% confiança
                    </Badge>
                  </div>
                  
                  {insight.data && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        Dados: {JSON.stringify(insight.data, null, 2).slice(0, 100)}...
                      </p>
                    </div>
                  )}
                </EnhancedCard>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    action.urgent ? 'border-orange-200 bg-orange-50' : ''
                  }`}
                  onClick={action.action}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.urgent ? 'bg-orange-100' : 'bg-gray-100'}`}>
                        <Icon className={`h-4 w-4 ${action.urgent ? 'text-orange-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{action.title}</h4>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EnhancedCard
              title="Performance Semanal"
              variant="trending"
              trending
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Engajamento</span>
                  <Badge variant="secondary">+15%</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard
              title="Metas do Mês"
              variant="featured"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">5 novos contatos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">3 projetos ativos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">2 certificações</span>
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard
              title="Próximas Ações"
              variant="default"
            >
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Plus className="h-3 w-3 mr-2" />
                  Agendar reunião
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BookOpen className="h-3 w-3 mr-2" />
                  Revisar proposta
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-3 w-3 mr-2" />
                  Conectar com especialista
                </Button>
              </div>
            </EnhancedCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalizedDashboard;