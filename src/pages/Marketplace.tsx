
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Calendar, FlaskConical, Building2, Users, Star } from "lucide-react";
import Header from "@/components/Header";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const laboratoryServices = [
    {
      id: 1,
      name: "LabAnalítica SP",
      type: "Laboratório Analítico",
      specializations: ["Microbiologia", "Físico-química", "Estabilidade"],
      location: "São Paulo, SP",
      capacity: "Disponível",
      rating: 4.8,
      price: "A partir de R$ 150/análise",
      description: "Laboratório especializado em análises farmacêuticas com certificação ISO 17025"
    },
    {
      id: 2,
      name: "BioTest Laboratórios",
      type: "Laboratório Analítico",
      specializations: ["Bioequivalência", "Biodisponibilidade", "Toxicologia"],
      location: "Rio de Janeiro, RJ",
      capacity: "Limitada",
      rating: 4.9,
      price: "Consultar",
      description: "Centro de excelência em estudos clínicos e análises especializadas"
    }
  ];

  const companyNeeds = [
    {
      id: 1,
      company: "FarmaTech Ltda",
      title: "Validação de Método Analítico",
      category: "Análises Laboratoriais",
      urgency: "Alta",
      budget: "R$ 25.000 - R$ 50.000",
      location: "São Paulo, SP",
      description: "Necessário desenvolvimento e validação de método para quantificação de princípio ativo",
      deadline: "30 dias"
    },
    {
      id: 2,
      company: "BioNova S.A.",
      title: "Consultoria Regulatória ANVISA",
      category: "Assuntos Regulatórios",
      urgency: "Média",
      budget: "R$ 15.000 - R$ 30.000",
      location: "Brasília, DF",
      description: "Suporte para submissão de dossiê de registro de medicamento genérico",
      deadline: "45 dias"
    }
  ];

  const consultants = [
    {
      id: 1,
      name: "Dr. Carlos Mendes",
      expertise: "Assuntos Regulatórios",
      experience: "15+ anos",
      certifications: ["ANVISA", "FDA", "EMA"],
      location: "São Paulo, SP",
      availability: "Disponível",
      rating: 4.9,
      hourlyRate: "R$ 300/hora"
    }
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace PharmaNexus</h1>
          <p className="text-gray-600">Conecte-se com laboratórios, consultores e fornecedores especializados</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar serviços, especialidades, localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-primary hover:bg-primary-600">
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="needs">Demandas</TabsTrigger>
            <TabsTrigger value="consultants">Consultores</TabsTrigger>
            <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
          </TabsList>

          {/* Laboratory Services */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {laboratoryServices.map((lab) => (
                <Card key={lab.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-primary mb-1">{lab.name}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FlaskConical className="h-4 w-4" />
                          <span>{lab.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{lab.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{lab.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {lab.location}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {lab.specializations.map((spec, index) => (
                          <Badge key={index} variant="secondary">{spec}</Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Badge variant={lab.capacity === "Disponível" ? "default" : "secondary"}>
                          {lab.capacity}
                        </Badge>
                        <span className="text-sm font-medium text-primary">{lab.price}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="flex-1">Ver Perfil</Button>
                      <Button variant="outline" className="flex-1">Solicitar Orçamento</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Company Needs */}
          <TabsContent value="needs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {companyNeeds.map((need) => (
                <Card key={need.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-primary mb-1">{need.title}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Building2 className="h-4 w-4" />
                          <span>{need.company}</span>
                        </div>
                      </div>
                      <Badge variant={need.urgency === "Alta" ? "destructive" : "secondary"}>
                        {need.urgency}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{need.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {need.location}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Prazo: {need.deadline}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{need.category}</Badge>
                        <span className="text-sm font-medium text-green-600">{need.budget}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="flex-1">Ver Detalhes</Button>
                      <Button variant="outline" className="flex-1">Enviar Proposta</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Consultants */}
          <TabsContent value="consultants" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {consultants.map((consultant) => (
                <Card key={consultant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-primary mb-1">{consultant.name}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{consultant.expertise}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{consultant.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {consultant.location}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {consultant.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary">{cert}</Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{consultant.experience}</span>
                        <span className="text-sm font-medium text-primary">{consultant.hourlyRate}</span>
                      </div>
                      
                      <Badge variant={consultant.availability === "Disponível" ? "default" : "secondary"}>
                        {consultant.availability}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="flex-1">Ver Perfil</Button>
                      <Button variant="outline" className="flex-1">Agendar Consulta</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Equipment placeholder */}
          <TabsContent value="equipment" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Catálogo de Equipamentos</h3>
                <p className="text-gray-600">Em breve: Navegue pelo catálogo completo de equipamentos farmacêuticos</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Marketplace;
