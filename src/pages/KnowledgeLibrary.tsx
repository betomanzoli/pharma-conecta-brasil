
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Search,
  Upload,
  TrendingUp,
  Building2,
  MapPin,
  DollarSign,
  Star,
  BookOpen,
  Award,
  Users,
  Calendar
} from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const KnowledgeLibrary = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const templates = [
    {
      id: 1,
      title: "Protocolo de Validação de Método Analítico",
      category: "Controle de Qualidade",
      description: "Template completo para validação de métodos HPLC",
      downloads: 342,
      rating: 4.8,
      fileType: "PDF",
      size: "2.3 MB"
    },
    {
      id: 2,
      title: "Checklist de Inspeção ANVISA",
      category: "Regulatório",
      description: "Lista completa para preparação de inspeções",
      downloads: 567,
      rating: 4.9,
      fileType: "Excel",
      size: "890 KB"
    },
    {
      id: 3,
      title: "Plano de Desenvolvimento Profissional",
      category: "Carreira",
      description: "Template para planejamento de carreira farmacêutica",
      downloads: 234,
      rating: 4.6,
      fileType: "Word",
      size: "1.1 MB"
    }
  ];

  const salaryInsights = [
    {
      role: "Analista de P&D",
      experience: "1-3 anos",
      salaryRange: "R$ 4.500 - R$ 7.000",
      location: "São Paulo",
      companies: 23,
      growth: "+12%"
    },
    {
      role: "Especialista Regulatório",
      experience: "3-5 anos",
      salaryRange: "R$ 8.000 - R$ 12.000",
      location: "São Paulo",
      companies: 18,
      growth: "+15%"
    },
    {
      role: "Gerente de Qualidade",
      experience: "5-8 anos",
      salaryRange: "R$ 12.000 - R$ 18.000",
      location: "São Paulo",
      companies: 12,
      growth: "+8%"
    }
  ];

  const companyReviews = [
    {
      company: "FarmaBrasil Ltda",
      rating: 4.2,
      reviews: 45,
      culture: "Excelente",
      benefits: "Muito bom",
      growth: "Bom",
      workLife: "Bom",
      recommend: "87%"
    },
    {
      company: "BioTech Solutions",
      rating: 4.5,
      reviews: 32,
      culture: "Muito bom",
      benefits: "Excelente",
      growth: "Muito bom",
      workLife: "Excelente",
      recommend: "94%"
    },
    {
      company: "PharmaGlobal S.A.",
      rating: 3.8,
      reviews: 78,
      culture: "Bom",
      benefits: "Bom",
      growth: "Regular",
      workLife: "Bom",
      recommend: "72%"
    }
  ];

  const careerPaths = [
    {
      title: "Trilha Analista → Gerente de P&D",
      steps: ["Analista P&D", "Analista Senior", "Coordenador", "Gerente"],
      duration: "8-12 anos",
      skills: ["Liderança", "Gestão de Projetos", "Inovação"],
      difficulty: "Alta"
    },
    {
      title: "Trilha QC → Especialista Qualidade",
      steps: ["Analista QC", "QC Senior", "Supervisor", "Especialista"],
      duration: "6-10 anos",
      skills: ["Validação", "Auditoria", "Sistemas Qualidade"],
      difficulty: "Média"
    },
    {
      title: "Trilha Regulatório → Consultor",
      steps: ["Analista Reg.", "Especialista", "Senior", "Consultor"],
      duration: "7-12 anos",
      skills: ["ANVISA", "FDA", "Submissões", "Compliance"],
      difficulty: "Alta"
    }
  ];

  const handleDownload = (templateName: string) => {
    toast({
      title: "Download iniciado",
      description: `Baixando ${templateName}...`,
    });
  };

  const handleUpload = () => {
    toast({
      title: "Upload de documento",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Biblioteca de Conhecimento</h1>
          <p className="text-gray-600">
            Recursos, templates e insights para impulsionar sua carreira farmacêutica
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar templates, insights ou recursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline" onClick={handleUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Contribuir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="salary">Insights Salariais</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="careers">Trilhas de Carreira</TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <Badge variant="secondary" className="mt-2">{template.category}</Badge>
                      </div>
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{template.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Downloads:</span>
                        <span className="font-medium">{template.downloads}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Avaliação:</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{template.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Arquivo:</span>
                        <span className="font-medium">{template.fileType} • {template.size}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => handleDownload(template.title)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Gratuito
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Salary Insights Tab */}
          <TabsContent value="salary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Insights Salariais - Indústria Farmacêutica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salaryInsights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div className="md:col-span-2">
                          <h3 className="font-semibold text-gray-900">{insight.role}</h3>
                          <p className="text-sm text-gray-600">{insight.experience}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">{insight.salaryRange}</p>
                          <p className="text-xs text-gray-500">Faixa salarial</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm">{insight.location}</span>
                          </div>
                          <p className="text-xs text-gray-500">{insight.companies} empresas</p>
                        </div>
                        
                        <div className="text-center">
                          <Badge variant={insight.growth.startsWith('+') ? "default" : "secondary"}>
                            {insight.growth}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">Crescimento anual</p>
                        </div>
                        
                        <div className="text-center">
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Reviews Tab */}
          <TabsContent value="companies" className="space-y-6">
            <div className="space-y-4">
              {companyReviews.map((company, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{company.company}</h3>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{company.rating}</span>
                          <span className="text-gray-500 ml-2">({company.reviews} avaliações)</span>
                        </div>
                      </div>
                      <Badge variant="outline">{company.recommend} recomendam</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Cultura</p>
                        <p className="text-xs text-blue-600">{company.culture}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Benefícios</p>
                        <p className="text-xs text-green-600">{company.benefits}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm font-medium text-purple-800">Crescimento</p>
                        <p className="text-xs text-purple-600">{company.growth}</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm font-medium text-orange-800">Work-Life</p>
                        <p className="text-xs text-orange-600">{company.workLife}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" className="flex-1">
                        Ver Avaliações Completas
                      </Button>
                      <Button className="flex-1">
                        Avaliar Empresa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Career Paths Tab */}
          <TabsContent value="careers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {careerPaths.map((path, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      {path.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Etapas da Carreira:</p>
                        <div className="flex flex-wrap gap-2">
                          {path.steps.map((step, stepIndex) => (
                            <Badge key={stepIndex} variant="outline">
                              {stepIndex + 1}. {step}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-600">Duração:</p>
                          <p>{path.duration}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Dificuldade:</p>
                          <Badge variant={path.difficulty === "Alta" ? "destructive" : "secondary"}>
                            {path.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Skills Necessárias:</p>
                        <div className="flex flex-wrap gap-1">
                          {path.skills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Ver Guia Completo
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

export default KnowledgeLibrary;
