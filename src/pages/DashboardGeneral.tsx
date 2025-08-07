
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  UserCheck, 
  BarChart3,
  TrendingUp,
  Building2,
  FlaskConical,
  BookOpen,
  Bell,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DemoModeIndicator from '@/components/layout/DemoModeIndicator';

const DashboardGeneral = () => {
  const { profile } = useAuth();

  const quickActions = [
    {
      title: 'Explorar Redes',
      description: 'Encontre e conecte-se com profissionais',
      icon: Users,
      href: '/network',
      color: 'bg-blue-500'
    },
    {
      title: 'Encontrar Mentor',
      description: 'Conecte-se com mentores experientes',
      icon: UserCheck,
      href: '/mentorship',
      color: 'bg-purple-500'
    },
    {
      title: 'Participar de Fóruns',
      description: 'Discuta temas relevantes da área',
      icon: MessageSquare,
      href: '/forums',
      color: 'bg-green-500'
    },
    {
      title: 'AI Assistant',
      description: 'Assistente especializado em farmacêutica',
      icon: MessageSquare,
      href: '/chat',
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    {
      title: 'Nova conexão estabelecida',
      description: 'Conectou-se com Dr. Silva da BioFarma',
      time: '2h atrás',
      type: 'connection'
    },
    {
      title: 'Mensagem no fórum',
      description: 'Resposta em "Regulamentações ANVISA 2024"',
      time: '4h atrás',
      type: 'forum'
    },
    {
      title: 'Documento adicionado',
      description: 'Novo guia de compliance disponível',
      time: '1 dia atrás',
      type: 'knowledge'
    }
  ];

  const platformStats = [
    { label: 'Conexões', value: '24', change: '+12%', icon: Users },
    { label: 'Projetos', value: '8', change: '+3', icon: Building2 },
    { label: 'Mentores', value: '156', change: '+8%', icon: UserCheck },
    { label: 'Laboratórios', value: '89', change: '+15%', icon: FlaskConical }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header com informações do usuário */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Bem-vindo, {profile?.first_name || 'Usuário'}!
              </h1>
              <p className="text-muted-foreground">
                Acompanhe suas atividades e descubra oportunidades
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              {profile?.user_type === 'company' ? 'Empresa' :
               profile?.user_type === 'laboratory' ? 'Laboratório' :
               profile?.user_type === 'consultant' ? 'Consultor' : 'Profissional'}
            </Badge>
          </div>

          <DemoModeIndicator variant="alert" />
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {platformStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change} desde o último mês
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ações rápidas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.title} to={action.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${action.color} text-white`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{action.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {action.description}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Atividade recente */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Suas últimas interações na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  Ver Todas as Atividades
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Links úteis */}
          <Card>
            <CardHeader>
              <CardTitle>Recursos Essenciais</CardTitle>
              <CardDescription>
                Acesse ferramentas e informações importantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/knowledge" className="block">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">Biblioteca de Conhecimento</p>
                      <p className="text-xs text-muted-foreground">
                        Guias, regulamentações e recursos
                      </p>
                    </div>
                  </div>
                </Link>
                
                <Link to="/analytics" className="block">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Analytics</p>
                      <p className="text-xs text-muted-foreground">
                        Métricas e relatórios de desempenho
                      </p>
                    </div>
                  </div>
                </Link>
                
                <Link to="/automation" className="block">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-sm">Automações</p>
                      <p className="text-xs text-muted-foreground">
                        Configure fluxos automatizados
                      </p>
                    </div>
                  </div>
                </Link>
                
                <Link to="/notifications" className="block">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Bell className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-sm">Central de Notificações</p>
                      <p className="text-xs text-muted-foreground">
                        Acompanhe atualizações importantes
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Plataforma em Desenvolvimento:</strong> Muitas funcionalidades estão sendo implementadas. 
            Os dados mostrados são exemplos para demonstração da interface e experiência do usuário.
          </AlertDescription>
        </Alert>
      </div>
    </MainLayout>
  );
};

export default DashboardGeneral;
