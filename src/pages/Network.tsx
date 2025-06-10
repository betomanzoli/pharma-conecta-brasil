
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Users, Network as NetworkIcon, Linkedin } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const Network = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const connections = [
    {
      id: 1,
      name: "Dr. Ana Silva",
      role: "Gerente de P&D",
      company: "FarmaLab",
      location: "São Paulo",
      expertise: "P&D (Pesquisa e Desenvolvimento)",
      experience: "8+ anos",
      isConnected: true
    },
    {
      id: 2,
      name: "Carlos Mendes",
      role: "Especialista Regulatório",
      company: "BioPharm",
      location: "Rio de Janeiro",
      expertise: "Assuntos Regulatórios",
      experience: "12+ anos",
      isConnected: true
    },
    {
      id: 3,
      name: "Marina Santos",
      role: "Analista de Qualidade",
      company: "MedTech",
      location: "Minas Gerais",
      expertise: "Controle de Qualidade",
      experience: "5+ anos",
      isConnected: false
    },
    {
      id: 4,
      name: "Roberto Lima",
      role: "Diretor Comercial",
      company: "PharmaVenda",
      location: "São Paulo",
      expertise: "Comercial",
      experience: "15+ anos",
      isConnected: false
    },
    {
      id: 5,
      name: "Dr. Fernanda Costa",
      role: "Supervisora de Produção",
      company: "IndFarm",
      location: "Paraná",
      expertise: "Produção",
      experience: "10+ anos",
      isConnected: true
    },
    {
      id: 6,
      name: "Paulo Rodrigues",
      role: "Pesquisador Senior",
      company: "LabInovação",
      location: "Santa Catarina",
      expertise: "P&D (Pesquisa e Desenvolvimento)",
      experience: "7+ anos",
      isConnected: false
    }
  ];

  const expertiseAreas = [
    "P&D (Pesquisa e Desenvolvimento)",
    "Controle de Qualidade",
    "Assuntos Regulatórios",
    "Produção",
    "Comercial"
  ];

  const locations = [
    "São Paulo", "Rio de Janeiro", "Minas Gerais", "Paraná", 
    "Santa Catarina", "Bahia", "Ceará", "Distrito Federal"
  ];

  const handleConnect = (professionalName: string) => {
    toast({
      title: "Solicitação enviada!",
      description: `Convite de conexão enviado para ${professionalName}`,
    });
  };

  const handleMessage = (professionalName: string) => {
    toast({
      title: "Mensagem",
      description: `Iniciando conversa com ${professionalName}`,
    });
  };

  const filteredConnections = connections.filter(connection => {
    const matchesSearch = connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = !filterArea || connection.expertise === filterArea;
    const matchesLocation = !filterLocation || connection.location === filterLocation;
    
    return matchesSearch && matchesArea && matchesLocation;
  });

  const myConnections = filteredConnections.filter(conn => conn.isConnected);
  const suggestedConnections = filteredConnections.filter(conn => !conn.isConnected);

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minha Rede Profissional</h1>
          <p className="text-gray-600">
            Conecte-se com profissionais da indústria farmacêutica e expanda sua rede.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Minhas Conexões</p>
                  <p className="text-2xl font-bold text-gray-900">{myConnections.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <NetworkIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rede Expandida</p>
                  <p className="text-2xl font-bold text-gray-900">2,847</p>
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
                  <p className="text-sm font-medium text-gray-600">Visualizações do Perfil</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-primary">Buscar Profissionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Buscar por nome, empresa ou cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select onValueChange={setFilterArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Área de Expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as áreas</SelectItem>
                    {expertiseAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select onValueChange={setFilterLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Localização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as localizações</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Connections */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Minhas Conexões ({myConnections.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myConnections.map((connection) => (
                    <div key={connection.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                        <p className="text-sm text-primary">{connection.role}</p>
                        <p className="text-sm text-gray-600">{connection.company}</p>
                        <p className="text-xs text-gray-500">{connection.location} • {connection.experience}</p>
                        <p className="text-xs text-gray-500">{connection.expertise}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMessage(connection.name)}
                        >
                          Mensagem
                        </Button>
                        <Button size="sm" variant="outline">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggested Connections */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <NetworkIcon className="h-5 w-5 mr-2" />
                  Sugestões de Conexão ({suggestedConnections.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestedConnections.map((connection) => (
                    <div key={connection.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                        <p className="text-sm text-primary">{connection.role}</p>
                        <p className="text-sm text-gray-600">{connection.company}</p>
                        <p className="text-xs text-gray-500">{connection.location} • {connection.experience}</p>
                        <p className="text-xs text-gray-500">{connection.expertise}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary-600"
                          onClick={() => handleConnect(connection.name)}
                        >
                          Conectar
                        </Button>
                        <Button size="sm" variant="outline">
                          Ver Perfil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;
