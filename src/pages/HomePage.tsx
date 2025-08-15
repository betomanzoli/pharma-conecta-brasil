
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isDemoMode, demoData } from '@/utils/demoMode';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Bell,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Bot,
  Sparkles,
  Activity
} from 'lucide-react';

const HomePage = () => {
  const { user, profile } = useAuth();
  const isDemo = isDemoMode();
  const userData = isDemo ? demoData.user : profile;
  const analytics = isDemo ? demoData.analytics : null;
  const projects = isDemo ? demoData.projects : [];
  const notifications = isDemo ? demoData.notifications.slice(0, 3) : [];

  // Get the first name from either profile or demo data
  const getFirstName = () => {
    if (isDemo && userData) {
      return userData.first_name;
    }
    if (profile) {
      return profile.first_name;
    }
    return null;
  };

  const firstName = getFirstName();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo{firstName ? `, ${firstName}` : ''}!
          </h1>
          <p className="text-gray-600">
            {isDemo 
              ? 'Explore todas as funcionalidades da plataforma em modo demonstração'
              : 'Acompanhe seus projetos e conecte-se com especialistas farmacêuticos'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/ai-assistant">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IA Especializada</CardTitle>
                <Bot className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Agentes especializados em análise regulatória e estratégica
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/chat">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Master AI</CardTitle>
                <Sparkles className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Assistente avançado com contexto especializado
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/ai/dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agentes IA</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Dashboard completo de agentes integrados
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeProjects}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.monthlyGrowth}% este mês
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.completedProjects} concluídos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.complianceScore}%</div>
                <Progress value={analytics.complianceScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aprovações Pendentes</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground">
                  Requer atenção
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Projetos Recentes</CardTitle>
                  <Link to="/projects">
                    <Button variant="outline" size="sm">Ver todos</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{project.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                              {project.status === 'active' ? 'Ativo' : 'Em Revisão'}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              Prazo: {new Date(project.deadline).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <Progress value={project.progress} className="mt-2" />
                        </div>
                        <div className="ml-4 text-right">
                          <span className="text-lg font-semibold">{project.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto</h3>
                    <p className="text-gray-500 mb-4">
                      {isDemo 
                        ? 'Em modo real, seus projetos apareceriam aqui'
                        : 'Comece criando seu primeiro projeto'}
                    </p>
                    <Link to="/projects">
                      <Button>Criar Projeto</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notificações</span>
                  </CardTitle>
                  <Link to="/notifications">
                    <Button variant="outline" size="sm">Ver todas</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant={notification.type === 'warning' ? 'destructive' : 'default'} className="text-xs">
                            {notification.type === 'warning' ? 'Atenção' : 'Info'}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(notification.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Nenhuma notificação</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Links Rápidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link to="/consultants" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Encontrar Consultores</span>
                  </Link>
                  <Link to="/analytics" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Analytics</span>
                  </Link>
                  <Link to="/ai-assistant" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                    <Bot className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Assistente IA</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Getting Started Guide */}
        {!user && !isDemo && (
          <Card className="mt-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Primeiros Passos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    1
                  </div>
                  <h4 className="font-medium mb-1">Crie sua conta</h4>
                  <p className="text-sm text-blue-700">Registre-se gratuitamente</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    2
                  </div>
                  <h4 className="font-medium mb-1">Configure seu perfil</h4>
                  <p className="text-sm text-blue-700">Adicione suas especialidades</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    3
                  </div>
                  <h4 className="font-medium mb-1">Comece a usar</h4>
                  <p className="text-sm text-blue-700">Acesse IA e consultores</p>
                </div>
              </div>
              <div className="text-center mt-6">
                <Link to="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Começar Agora
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
