
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Bell, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Search,
  Filter,
  Download,
  BookOpen,
  Users,
  Target,
  Award
} from "lucide-react";
import Header from "@/components/Header";

const Regulatory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegulator, setSelectedRegulator] = useState("all");

  const regulatoryUpdates = [
    {
      id: 1,
      title: "Nova RDC 430/2020 - Boas Práticas de Distribuição",
      regulator: "ANVISA",
      date: "2024-12-15",
      impact: "Alto",
      category: "Distribuição",
      deadline: "2025-06-15",
      description: "Novas diretrizes para distribuição de medicamentos com foco em rastreabilidade"
    },
    {
      id: 2,
      title: "FDA Guidance - Quality Considerations for Continuous Manufacturing",
      regulator: "FDA",
      date: "2024-12-10",
      impact: "Médio",
      category: "Fabricação",
      deadline: "2025-03-10",
      description: "Orientações para implementação de manufatura contínua"
    },
    {
      id: 3,
      title: "EMA - Guidelines on Real-World Evidence",
      regulator: "EMA",
      date: "2024-12-05",
      impact: "Alto",
      category: "Evidência Clínica",
      deadline: "2025-04-05",
      description: "Diretrizes para uso de evidência do mundo real em submissões regulatórias"
    }
  ];

  const complianceTemplates = [
    {
      id: 1,
      title: "Protocolo de Estudo de Estabilidade",
      category: "Estabilidade",
      downloads: 1250,
      rating: 4.8,
      lastUpdated: "2024-12-01"
    },
    {
      id: 2,
      title: "Template Dossiê ANVISA - Genérico",
      category: "Submissão",
      downloads: 890,
      rating: 4.9,
      lastUpdated: "2024-11-28"
    },
    {
      id: 3,
      title: "Checklist Auditoria de Qualidade",
      category: "Auditoria",
      downloads: 675,
      rating: 4.7,
      lastUpdated: "2024-11-25"
    }
  ];

  const expertConsultants = [
    {
      id: 1,
      name: "Dr. Ana Silva",
      expertise: "Assuntos Regulatórios ANVISA",
      experience: "20+ anos",
      successRate: 98,
      projects: 45,
      rate: "R$ 400/hora"
    },
    {
      id: 2,
      name: "Prof. Carlos Mendes",
      expertise: "Validação de Processos",
      experience: "15+ anos",
      successRate: 96,
      projects: 32,
      rate: "R$ 350/hora"
    }
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro de Inteligência Regulatória</h1>
          <p className="text-gray-600">Compliance, conhecimento e colaboração regulatória</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar regulamentações, templates, especialistas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="intelligence" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="intelligence">Inteligência</TabsTrigger>
            <TabsTrigger value="knowledge">Conhecimento</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="collaboration">Colaboração</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Regulatory Intelligence */}
          <TabsContent value="intelligence" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Updates */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Atualizações Regulatórias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {regulatoryUpdates.map((update) => (
                        <div key={update.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-primary">{update.title}</h3>
                            <Badge variant={update.impact === "Alto" ? "destructive" : "secondary"}>
                              {update.impact}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{update.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Shield className="h-4 w-4 mr-1" />
                              {update.regulator}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Prazo: {update.deadline}
                            </span>
                            <Badge variant="outline">{update.category}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Compliance Dashboard */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Score de Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-green-600">92%</div>
                      <p className="text-sm text-gray-600">Excelente</p>
                    </div>
                    <Progress value={92} className="mb-4" />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>ANVISA</span>
                        <span className="text-green-600">95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>FDA</span>
                        <span className="text-yellow-600">88%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EMA</span>
                        <span className="text-green-600">93%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prazos Próximos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">RDC 430/2020</p>
                          <p className="text-xs text-gray-500">15 dias restantes</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Relatório Anual</p>
                          <p className="text-xs text-gray-500">Concluído</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Knowledge Repository */}
          <TabsContent value="knowledge" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Biblioteca de Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {complianceTemplates.map((template) => (
                        <div key={template.id} className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-2">{template.title}</h3>
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge variant="outline">{template.category}</Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <Download className="h-3 w-3 mr-1" />
                              {template.downloads}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              Atualizado: {template.lastUpdated}
                            </span>
                            <Button size="sm">Download</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Categorias Populares</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start">
                        Submissões ANVISA
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        Validação de Métodos
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        Estudos de Estabilidade
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        Auditorias de Qualidade
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Compliance Marketplace */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {expertConsultants.map((consultant) => (
                <Card key={consultant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-primary">{consultant.name}</CardTitle>
                        <p className="text-gray-600">{consultant.expertise}</p>
                      </div>
                      <Badge variant="default">Verificado</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Experiência</span>
                        <span className="font-medium">{consultant.experience}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taxa de Sucesso</span>
                        <span className="font-medium text-green-600">{consultant.successRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Projetos</span>
                        <span className="font-medium">{consultant.projects}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Valor</span>
                        <span className="font-medium text-primary">{consultant.rate}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button className="flex-1">Ver Perfil</Button>
                      <Button variant="outline" className="flex-1">Contratar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Collaboration Tools */}
          <TabsContent value="collaboration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Projetos Colaborativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Colaboração em Desenvolvimento</h3>
                  <p className="text-gray-600">Ferramentas para consórcios de estudos e qualificação de fornecedores em breve</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics & Reporting */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Analytics e Relatórios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Dashboard de Analytics</h3>
                  <p className="text-gray-600">Relatórios de benchmark e análise de tendências em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Regulatory;
