
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Network, 
  TrendingUp, 
  Calendar, 
  Bell, 
  Target,
  Users,
  Building2,
  FlaskConical,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  BarChart3
} from "lucide-react";
import Header from "@/components/Header";

const Dashboard = () => {
  // Simulando tipo de usuário - em produção viria do contexto/auth
  const userType = "professional"; // professional, company, laboratory, consultant, etc.

  const getKPIsByUserType = () => {
    switch (userType) {
      case "company":
        return [
          { title: "Projetos Ativos", value: "8", icon: Target, change: "+2", trend: "up" },
          { title: "Fornecedores Conectados", value: "24", icon: Building2, change: "+5", trend: "up" },
          { title: "Orçamentos Pendentes", value: "12", icon: Clock, change: "-3", trend: "down" },
          { title: "ROI Médio", value: "127%", icon: TrendingUp, change: "+15%", trend: "up" }
        ];
      case "laboratory":
        return [
          { title: "Capacidade Utilizada", value: "78%", icon: BarChart3, change: "+8%", trend: "up" },
          { title: "Clientes Ativos", value: "15", icon: Users, change: "+3", trend: "up" },
          { title: "Análises Concluídas", value: "145", icon: CheckCircle, change: "+22", trend: "up" },
          { title: "Tempo Médio", value: "4.2d", icon: Clock, change: "-0.5d", trend: "down" }
        ];
      case "consultant":
        return [
          { title: "Projetos Ativos", value: "6", icon: Target, change: "+1", trend: "up" },
          { title: "Taxa de Ocupação", value: "85%", icon: Calendar, change: "+10%", trend: "up" },
          { title: "Avaliação Média", value: "4.8", icon: Star, change: "+0.2", trend: "up" },
          { title: "Receita Mensal", value: "R$ 28k", icon: TrendingUp, change: "+15%", trend: "up" }
        ];
      default: // professional
        return [
          { title: "Conexões", value: "124", icon: Network, change: "+8", trend: "up" },
          { title: "Visualizações do Perfil", value: "89", icon: User, change: "+15", trend: "up" },
          { title: "Oportunidades", value: "7", icon: Target, change: "+2", trend: "up" },
          { title: "Engajamento", value: "92%", icon: TrendingUp, change: "+5%", trend: "up" }
        ];
    }
  };

  const kpis = getKPIsByUserType();

  const recentActivities = [
    {
      type: "connection",
      message: "Dr. Ana Silva aceitou sua conexão",
      time: "2 horas atrás",
      icon: Network
    },
    {
      type: "opportunity",
      message: "Nova oportunidade: Validação de Método Analítico",
      time: "5 horas atrás",
      icon: Target
    },
    {
      type: "project",
      message: "Projeto 'Estudo de Estabilidade' foi atualizado",
      time: "1 dia atrás",
      icon: FlaskConical
    },
    {
      type: "event",
      message: "Lembrete: Webinar sobre Regulamentação às 14h",
      time: "1 dia atrás",
      icon: Calendar
    }
  ];

  const matchingSuggestions = [
    {
      type: "laboratory",
      name: "LabAnalítica SP",
      match: 95,
      reason: "Especialização em análises farmacêuticas",
      location: "São Paulo, SP"
    },
    {
      type: "consultant",
      name: "Dr. Carlos Mendes",
      match: 88,
      reason: "Expertise em Assuntos Regulatórios",
      location: "São Paulo, SP"
    },
    {
      type: "company",
      name: "FarmaTech Ltda",
      match: 82,
      reason: "Área de P&D compatível",
      location: "Rio de Janeiro, RJ"
    }
  ];

  const marketplaceHighlights = [
    {
      title: "Demanda: Validação de Método",
      company: "BioNova S.A.",
      budget: "R$ 25.000 - R$ 50.000",
      urgency: "Alta",
      match: 92
    },
    {
      title: "Projeto: Desenvolvimento Biossimilar",
      company: "BioPharma Internacional",
      budget: "R$ 500.000+",
      urgency: "Média",
      match: 85
    }
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta, Dr. João!
          </h1>
          <p className="text-gray-600">
            Aqui está um resumo das suas atividades no PharmaNexus
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            const isPositive = kpi.trend === "up";
            
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                      <div className="flex items-center mt-1">
                        {isPositive ? (
                          <ArrowUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}>
                          {kpi.change}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-primary-50 rounded-full">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Network className="h-6 w-6 mb-2" />
                    <span className="text-sm">Buscar Conexões</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Target className="h-6 w-6 mb-2" />
                    <span className="text-sm">Ver Oportunidades</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <FlaskConical className="h-6 w-6 mb-2" />
                    <span className="text-sm">Marketplace</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Calendar className="h-6 w-6 mb-2" />
                    <span className="text-sm">Eventos</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Marketplace Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Oportunidades Relevantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketplaceHighlights.map((highlight, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{highlight.title}</h4>
                        <Badge className="bg-green-100 text-green-800">
                          {highlight.match}% match
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{highlight.company}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-primary">{highlight.budget}</span>
                        <Badge variant={highlight.urgency === "Alta" ? "destructive" : "secondary"}>
                          {highlight.urgency}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Ver Todas as Oportunidades
                </Button>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Completude do Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Progresso geral</span>
                    <span className="text-sm text-gray-600">85%</span>
                  </div>
                  <Progress value={85} className="h-3" />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Informações básicas preenchidas
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Experiência profissional adicionada
                    </div>
                    <div className="flex items-center text-yellow-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Adicione certificações profissionais
                    </div>
                    <div className="flex items-center text-yellow-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Complete seu portfólio de projetos
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Completar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Matching Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Sugestões de Conexão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matchingSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{suggestion.name}</h4>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          {suggestion.match}%
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{suggestion.reason}</p>
                      <p className="text-xs text-gray-500 mb-2">{suggestion.location}</p>
                      <Button size="sm" variant="outline" className="w-full text-xs">
                        Conectar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Ver Todas
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Webinar: Regulamentação ANVISA</h4>
                    <p className="text-xs text-gray-600">Hoje, 14:00</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Congresso PharmaBrasil 2024</h4>
                    <p className="text-xs text-gray-600">15-17 Dez, São Paulo</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Ver Agenda
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
