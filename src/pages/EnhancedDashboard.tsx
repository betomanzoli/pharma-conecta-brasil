
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import EnhancedPlatformDemo from '@/components/demo/EnhancedPlatformDemo';
import EnhancedAnalytics from '@/components/enhanced/EnhancedAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Star,
  Bell,
  Calendar,
  MessageSquare,
  Settings
} from 'lucide-react';

const EnhancedDashboard = () => {
  const { profile } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Verificar se é primeira vez do usuário
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(`onboarding_${profile?.id}`);
    if (!hasCompletedOnboarding && profile) {
      setShowOnboarding(true);
    }
  }, [profile]);

  const handleOnboardingComplete = () => {
    localStorage.setItem(`onboarding_${profile?.id}`, 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <OnboardingWizard onComplete={handleOnboardingComplete} />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const quickActions = [
    {
      title: 'Encontrar Parceiros',
      description: 'Use nossa IA para encontrar parceiros compatíveis',
      icon: Users,
      color: 'bg-blue-500',
      action: () => setActiveTab('demo')
    },
    {
      title: 'Criar Projeto',
      description: 'Publique um novo projeto na plataforma',
      icon: TrendingUp,
      color: 'bg-green-500',
      action: () => console.log('Criar projeto')
    },
    {
      title: 'Ver Analytics',
      description: 'Analise métricas e performance',
      icon: BarChart3,
      color: 'bg-purple-500',
      action: () => setActiveTab('analytics')
    },
    {
      title: 'Configurações',
      description: 'Gerencie sua conta e preferências',
      icon: Settings,
      color: 'bg-gray-500',
      action: () => console.log('Configurações')
    }
  ];

  const recentActivity = [
    {
      type: 'connection',
      title: 'Nova conexão com BioTech Labs',
      time: '2 horas atrás',
      icon: Users
    },
    {
      type: 'project',
      title: 'Projeto de análise aprovado',
      time: '5 horas atrás',
      icon: TrendingUp
    },
    {
      type: 'message',
      title: 'Nova mensagem de Dr. Silva',
      time: '1 dia atrás',
      icon: MessageSquare
    },
    {
      type: 'alert',
      title: 'Alerta regulatório ANVISA',
      time: '2 dias atrás',
      icon: Bell
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta, {profile?.first_name}!
            </h1>
            <p className="text-gray-600">
              Aqui está um resumo da sua atividade na PharmaConnect Brasil
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="demo">Demo Interativo</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${action.color}`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                        </div>
                        <Button 
                          onClick={action.action}
                          className="w-full mt-4" 
                          variant="outline"
                        >
                          Acessar
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
                    <div className="text-sm text-gray-600">Conexões Ativas</div>
                    <Badge variant="secondary" className="mt-2">+3 esta semana</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                    <div className="text-sm text-gray-600">Projetos em Andamento</div>
                    <Badge variant="secondary" className="mt-2">2 finalizando</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
                    <div className="text-sm text-gray-600">Avaliação Média</div>
                    <div className="flex justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
                    <div className="text-sm text-gray-600">Novas Oportunidades</div>
                    <Badge variant="secondary" className="mt-2">Ver todas</Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => {
                      const IconComponent = activity.icon;
                      return (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <IconComponent className="h-5 w-5 text-gray-600" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demo" className="mt-6">
              <EnhancedPlatformDemo />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <EnhancedAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EnhancedDashboard;
