import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  FlaskConical,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  Network,
  Target,
  Award,
  Briefcase,
  BookOpen,
  Shield,
  User,
  Wrench
} from "lucide-react";
import Header from "@/components/Header";

type UserType = "professional" | "company" | "laboratory" | "consultant" | "supplier" | "university" | "regulatory";

const Dashboard = () => {
  // Simulando tipo de usuário - em produção viria do contexto/auth
  const [userType] = useState<UserType>("professional");

  const getKPIsByUserType = () => {
    switch (userType) {
      case "company":
        return [
          { title: "Projetos Ativos", value: "12", change: "+4%", trend: "up", icon: FileText, color: "bg-blue-50 text-blue-500" },
          { title: "Fornecedores", value: "45", change: "+10%", trend: "up", icon: Building2, color: "bg-green-50 text-green-500" },
          { title: "Leads", value: "23", change: "-2%", trend: "down", icon: Users, color: "bg-orange-50 text-orange-500" },
          { title: "Budget", value: "R$ 150.000", change: "+15%", trend: "up", icon: DollarSign, color: "bg-purple-50 text-purple-500" },
        ];
      case "laboratory":
        return [
          { title: "Capacidade Ocupada", value: "85%", change: "+5%", trend: "up", icon: Calendar, color: "bg-blue-50 text-blue-500" },
          { title: "Equipamentos", value: "60", change: "+3%", trend: "up", icon: Building2, color: "bg-green-50 text-green-500" },
          { title: "Clientes", value: "120", change: "+8%", trend: "up", icon: Users, color: "bg-orange-50 text-orange-500" },
          { title: "Receita", value: "R$ 220.000", change: "+12%", trend: "up", icon: DollarSign, color: "bg-purple-50 text-purple-500" },
        ];
      case "consultant":
        return [
          { title: "Projetos", value: "8", change: "+6%", trend: "up", icon: FileText, color: "bg-blue-50 text-blue-500" },
          { title: "Clientes", value: "15", change: "+4%", trend: "up", icon: Users, color: "bg-green-50 text-green-500" },
          { title: "Disponibilidade", value: "70%", change: "-10%", trend: "down", icon: Calendar, color: "bg-orange-50 text-orange-500" },
          { title: "Receita", value: "R$ 80.000", change: "+9%", trend: "up", icon: DollarSign, color: "bg-purple-50 text-purple-500" },
        ];
      case "regulatory":
        return [
          { title: "Regulamentações", value: "25", change: "+2%", trend: "up", icon: Shield, color: "bg-blue-50 text-blue-500" },
          { title: "Conformidade", value: "95%", change: "+1%", trend: "up", icon: CheckCircle, color: "bg-green-50 text-green-500" },
          { title: "Alertas", value: "3", change: "-1%", trend: "down", icon: AlertCircle, color: "bg-orange-50 text-orange-500" },
          { title: "Auditoria", value: "100%", change: "+0%", trend: "up", icon: Briefcase, color: "bg-purple-50 text-purple-500" },
        ];
      default:
        return [
          { title: "Conexões", value: "350", change: "+5%", trend: "up", icon: Network, color: "bg-blue-50 text-blue-500" },
          { title: "Projetos", value: "15", change: "+3%", trend: "up", icon: FileText, color: "bg-green-50 text-green-500" },
          { title: "Marketplace", value: "8", change: "+2%", trend: "up", icon: Building2, color: "bg-orange-50 text-orange-500" },
          { title: "Cursos", value: "5", change: "+1%", trend: "up", icon: BookOpen, color: "bg-purple-50 text-purple-500" },
        ];
    }
  };

  const getQuickActions = () => {
    switch (userType) {
      case "company":
        return [
          { title: "Novo Projeto", icon: FileText },
          { title: "Buscar Fornecedor", icon: Building2 },
          { title: "Analisar Dados", icon: BarChart3 },
          { title: "Verificar Conformidade", icon: CheckCircle },
          { title: "Criar Alerta", icon: AlertCircle },
          { title: "Agendar Auditoria", icon: Calendar },
        ];
      case "laboratory":
        return [
          { title: "Agendar Teste", icon: FlaskConical },
          { title: "Verificar Equipamento", icon: Building2 },
          { title: "Analisar Resultados", icon: BarChart3 },
          { title: "Gerenciar Clientes", icon: Users },
          { title: "Calibrar Equipamento", icon: Wrench },
          { title: "Emitir Laudo", icon: FileText },
        ];
      case "consultant":
        return [
          { title: "Novo Projeto", icon: FileText },
          { title: "Agendar Reunião", icon: Calendar },
          { title: "Analisar Dados", icon: BarChart3 },
          { title: "Gerenciar Clientes", icon: Users },
          { title: "Criar Proposta", icon: FileText },
          { title: "Atualizar Portfólio", icon: Briefcase },
        ];
      case "regulatory":
        return [
          { title: "Nova Regra", icon: Shield },
          { title: "Verificar Conformidade", icon: CheckCircle },
          { title: "Criar Alerta", icon: AlertCircle },
          { title: "Agendar Auditoria", icon: Calendar },
          { title: "Analisar Impacto", icon: BarChart3 },
          { title: "Emitir Certificado", icon: Award },
        ];
      default:
        return [
          { title: "Ver Perfil", icon: User },
          { title: "Minha Rede", icon: Network },
          { title: "Marketplace", icon: Building2 },
          { title: "Meus Projetos", icon: FileText },
          { title: "Buscar Cursos", icon: BookOpen },
          { title: "Definir Metas", icon: Target },
        ];
    }
  };

  const getRecentActivity = () => {
    return [
      { title: "Nova Conexão", description: "Maria Silva aceitou seu convite", time: "5 min atrás", icon: Network, color: "bg-blue-50 text-blue-500" },
      { title: "Projeto Atualizado", description: "Validação de método concluída", time: "15 min atrás", icon: FileText, color: "bg-green-50 text-green-500" },
      { title: "Alerta Regulatório", description: "Nova RDC sobre Boas Práticas", time: "30 min atrás", icon: AlertCircle, color: "bg-orange-50 text-orange-500" },
      { title: "Novo Curso", description: "Inscrição no curso de BPF", time: "1 hora atrás", icon: BookOpen, color: "bg-purple-50 text-purple-500" },
    ];
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard PharmaNexus</h1>
          <p className="text-gray-600">Visão geral do seu ecossistema farmacêutico</p>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getKPIsByUserType().map((kpi, index) => {
            const Icon = kpi.icon;
            const isPositive = kpi.trend === "up";
            
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                      <div className="flex items-center mt-2">
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {kpi.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${kpi.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {getQuickActions().map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button key={index} variant="outline" className="h-20 flex flex-col space-y-2">
                        <Icon className="h-6 w-6" />
                        <span className="text-sm">{action.title}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecentActivity().map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${activity.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Opportunities & Alerts */}
          <div className="space-y-6">
            {/* Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Oportunidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Novo Laboratório</p>
                    <p className="text-xs text-blue-600">LabAnalítica SP disponível</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Projeto Colaborativo</p>
                    <p className="text-xs text-green-600">Estudo de estabilidade conjunto</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">Capacitação</p>
                    <p className="text-xs text-purple-600">Workshop ANVISA gratuito</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Progresso do Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completude do Perfil</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Conexões da Rede</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Atividade do Mês</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
