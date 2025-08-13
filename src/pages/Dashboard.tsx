
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, Users, MessageSquare, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();

  const dashboardStats = [
    {
      title: "Projetos Ativos",
      value: "12",
      icon: BarChart3,
      change: "+20%"
    },
    {
      title: "Conexões",
      value: "245",
      icon: Users,
      change: "+15%"
    },
    {
      title: "Mensagens",
      value: "89",
      icon: MessageSquare,
      change: "+8%"
    },
    {
      title: "Crescimento",
      value: "32%",
      icon: TrendingUp,
      change: "+12%"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {profile?.first_name || user?.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Aqui está um resumo das suas atividades na plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600 mt-1">
                    {stat.change} em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Novo projeto criado</p>
                  <p className="text-xs text-gray-500">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Conexão aceita</p>
                  <p className="text-xs text-gray-500">Há 4 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Documento aprovado</p>
                  <p className="text-xs text-gray-500">Há 1 dia</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Reunião com reguladores</p>
                  <p className="text-xs text-gray-500">Amanhã, 14:00</p>
                </div>
                <Button size="sm" variant="outline">
                  Ver detalhes
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Prazo de submissão</p>
                  <p className="text-xs text-gray-500">Em 3 dias</p>
                </div>
                <Button size="sm" variant="outline">
                  Acessar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
