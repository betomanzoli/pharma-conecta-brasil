
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Star, 
  Clock, 
  Users, 
  Calendar, 
  MessageCircle, 
  Search,
  Filter,
  GraduationCap,
  BookOpen,
  Target,
  TrendingUp
} from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const MentorshipHub = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("");

  const mentors = [
    {
      id: 1,
      name: "Dr. Ana Silva",
      title: "Diretora de P&D",
      company: "Farmacêutica Brasil",
      expertise: ["P&D", "Gestão", "Inovação"],
      experience: "15+ anos",
      rating: 4.9,
      sessions: 127,
      hourlyRate: "R$ 300",
      availability: "Disponível",
      style: "Prático e orientado a resultados",
      bio: "Especialista em desenvolvimento de novos produtos farmacêuticos com foco em inovação."
    },
    {
      id: 2,
      name: "Carlos Mendes",
      title: "Gerente Regulatório",
      company: "RegPharma Ltda",
      expertise: ["Regulatório", "ANVISA", "FDA"],
      experience: "12+ anos",
      rating: 4.8,
      sessions: 89,
      hourlyRate: "R$ 250",
      availability: "Limitada",
      style: "Detalhista e metódico",
      bio: "Expert em submissões regulatórias para ANVISA, FDA e EMA."
    },
    {
      id: 3,
      name: "Marina Santos",
      title: "Especialista em Qualidade",
      company: "QualityPharma",
      expertise: ["Qualidade", "Validação", "GMP"],
      experience: "10+ anos",
      rating: 4.7,
      sessions: 156,
      hourlyRate: "R$ 200",
      availability: "Disponível",
      style: "Colaborativo e didático",
      bio: "Especialista em sistemas de qualidade e validação de processos."
    }
  ];

  const mentees = [
    {
      id: 1,
      name: "Julia Costa",
      title: "Analista Junior P&D",
      company: "StartPharma",
      goals: ["Desenvolvimento de carreira", "Liderança técnica"],
      challenges: ["Gestão de projetos", "Tomada de decisão"],
      experience: "2 anos",
      topics: ["P&D", "Gestão", "Carreira"]
    },
    {
      id: 2,
      name: "Roberto Lima",
      title: "Trainee Regulatório",
      company: "MedRegulatory",
      goals: ["Expertise regulatória", "Certificações"],
      challenges: ["Complexidade regulatória", "Networking"],
      experience: "6 meses",
      topics: ["Regulatório", "Carreira", "Certificações"]
    }
  ];

  const handleRequestMentor = (mentorName: string) => {
    toast({
      title: "Solicitação enviada!",
      description: `Sua solicitação de mentoria com ${mentorName} foi enviada.`,
    });
  };

  const handleBookSession = (mentorName: string) => {
    toast({
      title: "Agendamento",
      description: `Redirecionando para agendar sessão com ${mentorName}`,
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
            Conecte-se com mentores experientes ou ofereça sua expertise como mentor
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
                  <p className="text-2xl font-bold text-gray-900">127</p>
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
                  <p className="text-sm font-medium text-gray-600">Sessões este Mês</p>
                  <p className="text-2xl font-bold text-gray-900">856</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
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

        {/* Main Content */}
        <Tabs defaultValue="find-mentor" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="find-mentor">Encontrar Mentor</TabsTrigger>
            <TabsTrigger value="be-mentor">Ser Mentor</TabsTrigger>
            <TabsTrigger value="my-sessions">Minhas Sessões</TabsTrigger>
            <TabsTrigger value="mentees">Mentorados</TabsTrigger>
          </TabsList>

          {/* Find Mentor Tab */}
          <TabsContent value="find-mentor" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Buscar Mentores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por nome, expertise ou empresa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
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

            {/* Mentor Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg font-semibold">
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">{mentor.name}</h3>
                        <p className="text-primary font-medium">{mentor.title}</p>
                        <p className="text-sm text-gray-600">{mentor.company}</p>
                        <div className="flex items-center mt-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">{mentor.rating}</span>
                          <span className="ml-2 text-sm text-gray-600">({mentor.sessions} sessões)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{mentor.hourlyRate}/h</p>
                        <Badge variant={mentor.availability === "Disponível" ? "default" : "secondary"}>
                          {mentor.availability}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{mentor.bio}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Expertise:</p>
                        <div className="flex flex-wrap gap-2">
                          {mentor.expertise.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Experiência: {mentor.experience}</span>
                        <span>Estilo: {mentor.style}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-6">
                      <Button 
                        className="flex-1"
                        onClick={() => handleRequestMentor(mentor.name)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Solicitar Mentoria
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleBookSession(mentor.name)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Sessão
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Be Mentor Tab */}
          <TabsContent value="be-mentor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Torne-se um Mentor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <GraduationCap className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">Compartilhe sua Experiência</h3>
                    <p className="text-gray-600 mb-6">
                      Ajude profissionais junior a crescer em suas carreiras enquanto gera receita adicional
                    </p>
                    <Button size="lg" className="px-8">
                      Candidatar-se como Mentor
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold">Flexibilidade</h4>
                      <p className="text-sm text-gray-600">Defina seus próprios horários</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold">Receita Extra</h4>
                      <p className="text-sm text-gray-600">R$ 200-500 por hora</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-semibold">Impacto</h4>
                      <p className="text-sm text-gray-600">Molde a próxima geração</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Sessions Tab */}
          <TabsContent value="my-sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Sessões de Mentoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma sessão agendada no momento</p>
                    <Button variant="outline" className="mt-4">
                      Encontrar Mentor
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mentees Tab */}
          <TabsContent value="mentees" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mentees.map((mentee) => (
                <Card key={mentee.id}>
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {mentee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{mentee.name}</h3>
                        <p className="text-primary text-sm">{mentee.title}</p>
                        <p className="text-xs text-gray-600">{mentee.company}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Objetivos:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mentee.goals.map((goal, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600">Desafios:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mentee.challenges.map((challenge, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {challenge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Experiência: {mentee.experience}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Conectar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Ver Perfil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MentorshipHub;
