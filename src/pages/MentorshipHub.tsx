
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  GraduationCap, 
  Star, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Target,
  TrendingUp,
  Award,
  MessageCircle,
  Video,
  Search,
  Filter
} from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const MentorshipHub = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const mentors = [
    {
      id: 1,
      name: "Dr. Ana Paula Santos",
      title: "Diretora de P&D",
      company: "BioPharma Brasil",
      expertise: ["P&D", "Inovação", "Liderança"],
      experience: "20+ anos",
      location: "São Paulo, SP",
      rating: 4.9,
      sessions: 156,
      price: "R$ 250/hora",
      availability: "Disponível",
      image: "APS"
    },
    {
      id: 2,
      name: "Carlos Eduardo Lima",
      title: "Especialista Regulatório Sênior",
      company: "Regulatory Consulting",
      expertise: ["ANVISA", "FDA", "Registro"],
      experience: "15+ anos",
      location: "Brasília, DF",
      rating: 4.8,
      sessions: 89,
      price: "R$ 200/hora",
      availability: "Limitada",
      image: "CEL"
    },
    {
      id: 3,
      name: "Dra. Marina Costa",
      title: "Gerente de Qualidade",
      company: "QualityPharma",
      expertise: ["Qualidade", "Validação", "BPF"],
      experience: "12+ anos",
      location: "Rio de Janeiro, RJ",
      rating: 4.9,
      sessions: 134,
      price: "R$ 180/hora",
      availability: "Disponível",
      image: "MC"
    }
  ];

  const programs = [
    {
      id: 1,
      title: "Carreira em P&D Farmacêutico",
      mentor: "Dr. Ana Paula Santos",
      duration: "8 semanas",
      sessions: 8,
      price: "R$ 1.600",
      participants: 24,
      rating: 4.9,
      description: "Programa completo para acelerar sua carreira em P&D farmacêutico"
    },
    {
      id: 2,
      title: "Transição para Assuntos Regulatórios",
      mentor: "Carlos Eduardo Lima",
      duration: "6 semanas",
      sessions: 6,
      price: "R$ 1.200",
      participants: 18,
      rating: 4.8,
      description: "Guia prático para migrar para a área regulatória"
    }
  ];

  const handleBookSession = (mentorName: string) => {
    toast({
      title: "Sessão agendada",
      description: `Solicitação de mentoria com ${mentorName} enviada com sucesso.`,
    });
  };

  const handleJoinProgram = (programTitle: string) => {
    toast({
      title: "Inscrição realizada",
      description: `Você se inscreveu no programa: ${programTitle}`,
    });
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hub de Mentoria PharmaNexus</h1>
          <p className="text-gray-600">
            Conecte-se com líderes da indústria e acelere seu crescimento profissional
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mentores Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">247</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mentorados</p>
                  <p className="text-2xl font-bold text-gray-900">2.845</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sessões Concluídas</p>
                  <p className="text-2xl font-bold text-gray-900">8.934</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold text-gray-900">94%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar mentores por especialidade, empresa ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="mentors" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="mentors">Mentores</TabsTrigger>
            <TabsTrigger value="programs">Programas</TabsTrigger>
            <TabsTrigger value="my-sessions">Minhas Sessões</TabsTrigger>
          </TabsList>

          {/* Mentors Tab */}
          <TabsContent value="mentors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">{mentor.image}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{mentor.name}</CardTitle>
                        <p className="text-gray-600">{mentor.title}</p>
                        <p className="text-sm text-gray-500">{mentor.company}</p>
                        <div className="flex items-center mt-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium">{mentor.rating}</span>
                          <span className="text-xs text-gray-500 ml-2">({mentor.sessions} sessões)</span>
                        </div>
                      </div>
                      <Badge variant={mentor.availability === "Disponível" ? "default" : "secondary"}>
                        {mentor.availability}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {mentor.location}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {mentor.experience} de experiência
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center pt-3">
                        <span className="text-lg font-bold text-primary">{mentor.price}</span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleBookSession(mentor.name)}
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Agendar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {programs.map((program) => (
                <Card key={program.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
                        <p className="text-gray-600">Mentor: {program.mentor}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium">{program.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{program.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Duração</p>
                        <p className="font-medium">{program.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Sessões</p>
                        <p className="font-medium">{program.sessions} sessões</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Participantes</p>
                        <p className="font-medium">{program.participants} alunos</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Investimento</p>
                        <p className="font-bold text-primary">{program.price}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1"
                        onClick={() => handleJoinProgram(program.title)}
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Inscrever-se
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Sessions Tab */}
          <TabsContent value="my-sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Próximas Sessões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>APS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Mentoria com Dr. Ana Paula Santos</p>
                        <p className="text-sm text-gray-600">Estratégias de P&D</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Amanhã, 14:00
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Reagendar</Button>
                      <Button size="sm">Entrar na Sessão</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MentorshipHub;
