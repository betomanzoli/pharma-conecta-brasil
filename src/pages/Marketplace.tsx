import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Calendar, FlaskConical, Building2, Users, Star, Wrench, Brain, TrendingUp, FileText, Shield, Zap } from "lucide-react";
import Header from "@/components/Header";
import AIMatchingEngine from "@/components/marketplace/AIMatchingEngine";
import AdvancedSearch from "@/components/marketplace/AdvancedSearch";
import TransactionManager from "@/components/marketplace/TransactionManager";
import MarketplaceStats from "@/components/marketplace/MarketplaceStats";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">B2B Marketplace PharmaNexus</h1>
          <p className="text-gray-600">Plataforma inteligente para conexões B2B no setor farmacêutico</p>
        </div>

        {/* AI Matching Alert */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-6 w-6 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">IA encontrou 12 oportunidades para você</h3>
                <p className="text-sm text-blue-700">3 laboratórios disponíveis, 5 projetos compatíveis, 4 fornecedores recomendados</p>
              </div>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                Ver Recomendações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Stats */}
        <MarketplaceStats />

        {/* Advanced Search */}
        <AdvancedSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />

        {/* Main Marketplace Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="services">Serviços Lab</TabsTrigger>
            <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
            <TabsTrigger value="consulting">Consultoria</TabsTrigger>
            <TabsTrigger value="challenges">Desafios</TabsTrigger>
            <TabsTrigger value="partnerships">Parcerias</TabsTrigger>
            <TabsTrigger value="ai-matches">IA Matches</TabsTrigger>
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

          {/* Equipment Marketplace */}
          <TabsContent value="equipment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-primary mb-1">HPLC Agilent 1260</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Wrench className="h-4 w-4" />
                        <span>Equipamento Analítico</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Disponível</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">Sistema HPLC completo com detector UV-Vis, ideal para análises farmacêuticas</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      São Paulo, SP
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Venda/Locação</span>
                      <span className="text-lg font-bold text-primary">R$ 180.000</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1">Ver Detalhes</Button>
                    <Button variant="outline" className="flex-1">Agendar Demo</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Consulting Hub */}
          <TabsContent value="consulting" className="space-y-6">
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

          {/* Innovation Challenges */}
          <TabsContent value="challenges" className="space-y-6">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-orange-800 mb-1">Desafio: Formulação Estável pH 7.4</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-orange-600">
                      <Zap className="h-4 w-4" />
                      <span>Desafio Técnico</span>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">R$ 75.000 Prêmio</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700 mb-4">Desenvolvimento de formulação líquida estável em pH fisiológico para princípio ativo sensível</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-orange-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Prazo: 90 dias
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Formulação</Badge>
                    <Badge variant="outline">Estabilidade</Badge>
                    <Badge variant="outline">pH Crítico</Badge>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-orange-600 hover:bg-orange-700">Aceitar Desafio</Button>
                  <Button variant="outline" className="flex-1">Ver Detalhes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partnership Finder */}
          <TabsContent value="partnerships" className="space-y-6">
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-purple-800 mb-1">Parceria Estratégica: Expansão LATAM</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-purple-600">
                      <Building2 className="h-4 w-4" />
                      <span>Joint Venture</span>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">High Value</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700 mb-4">Multinacional farmacêutica busca parceiro local para distribuição e registro na América Latina</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-600">Investimento:</span>
                    <span className="font-bold text-purple-800">USD 2-5M</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Registro</Badge>
                    <Badge variant="outline">Distribuição</Badge>
                    <Badge variant="outline">LATAM</Badge>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Manifestar Interesse</Button>
                  <Button variant="outline" className="flex-1">Confidential Briefing</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Matches */}
          <TabsContent value="ai-matches" className="space-y-6">
            <AIMatchingEngine />
          </TabsContent>
        </Tabs>

        {/* Transaction Manager */}
        <TransactionManager />
      </div>
    </div>
  );
};

export default Marketplace;
