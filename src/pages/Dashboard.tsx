
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, Network, User } from "lucide-react";
import Header from "@/components/Header";

const Dashboard = () => {
  // Dados simulados
  const profileCompletion = 75;
  const recentConnections = [
    { name: "Dr. Ana Silva", role: "Gerente de P&D", company: "FarmaLab" },
    { name: "Carlos Mendes", role: "Especialista Regulatório", company: "BioPharm" },
    { name: "Marina Santos", role: "Analista de Qualidade", company: "MedTech" }
  ];
  
  const upcomingEvents = [
    { title: "Webinar: Tendências em P&D", date: "15 Jun", attendees: 120 },
    { title: "Conferência Farmacêutica SP", date: "22 Jun", attendees: 300 },
    { title: "Workshop: Assuntos Regulatórios", date: "28 Jun", attendees: 85 }
  ];

  const industryNews = [
    {
      title: "Nova Regulamentação ANVISA para Medicamentos Genéricos",
      summary: "ANVISA publica nova RDC sobre requisitos para registro de medicamentos genéricos...",
      date: "Há 2 horas"
    },
    {
      title: "Investimentos em P&D Farmacêutico Crescem 15% no Brasil",
      summary: "Setor farmacêutico brasileiro registra aumento significativo em investimentos...",
      date: "Há 5 horas"
    },
    {
      title: "Tendências em Controle de Qualidade para 2024",
      summary: "Especialistas discutem as principais inovações em QC para o próximo ano...",
      date: "Há 1 dia"
    }
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, Dr. João Silva! 👋
          </h1>
          <p className="text-gray-600">
            Bem-vindo ao seu dashboard profissional. Veja suas atividades e conexões.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Conexões</p>
                  <p className="text-2xl font-bold text-gray-900">124</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Network className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Visualizações do Perfil</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Eventos Este Mês</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Perfil Completo</p>
                  <p className="text-2xl font-bold text-gray-900">{profileCompletion}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Completion */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Complete seu Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso do Perfil</span>
                      <span>{profileCompletion}%</span>
                    </div>
                    <Progress value={profileCompletion} className="h-2" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Para completar seu perfil, adicione:</p>
                    <ul className="mt-2 space-y-1">
                      <li>• Foto profissional</li>
                      <li>• Resumo profissional</li>
                      <li>• Certificações</li>
                    </ul>
                  </div>
                  <Button variant="outline" className="w-full">
                    Completar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Connections */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-primary">Conexões Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentConnections.map((connection, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{connection.name}</p>
                        <p className="text-xs text-gray-600">{connection.role}</p>
                        <p className="text-xs text-gray-500">{connection.company}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    Ver Todas as Conexões
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Industry News */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Insights da Indústria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {industryNews.map((news, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                      <h3 className="font-semibold text-gray-900 mb-2">{news.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{news.summary}</p>
                      <p className="text-xs text-gray-500">{news.date}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Ver Mais Insights
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.attendees} participantes confirmados</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">{event.date}</p>
                        <Button size="sm" variant="outline">
                          Participar
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Ver Todos os Eventos
                  </Button>
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
