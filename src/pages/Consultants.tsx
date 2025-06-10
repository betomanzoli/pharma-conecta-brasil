
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, MapPin, Star, Briefcase, Award } from "lucide-react";
import Header from "@/components/Header";
import ComplianceFooter from "@/components/ComplianceFooter";
import ComplianceDisclaimer from "@/components/ComplianceDisclaimer";

const Consultants = () => {
  const consultants = [
    {
      id: 1,
      name: "Dra. Ana Rodrigues",
      title: "Consultora Regulatória Sênior",
      location: "São Paulo, SP",
      rating: 4.9,
      experience: "15+ anos",
      expertise: ["Registro ANVISA", "Farmacovigilância", "Compliance"],
      projects: 45,
      rate: "R$ 200/hora",
      description: "Especialista em assuntos regulatórios com vasta experiência em registros ANVISA e compliance farmacêutico."
    },
    {
      id: 2,
      name: "Dr. Carlos Ferreira",
      title: "Consultor em P&D Farmacêutico",
      location: "Rio de Janeiro, RJ",
      rating: 4.8,
      experience: "12+ anos",
      expertise: ["Desenvolvimento Farmacêutico", "Formulação", "Scale-up"],
      projects: 38,
      rate: "R$ 180/hora",
      description: "Consultor especializado em desenvolvimento farmacêutico e processos de scale-up industrial."
    },
    {
      id: 3,
      name: "Dra. Maria Santos",
      title: "Consultora em Controle de Qualidade",
      location: "Campinas, SP",
      rating: 4.7,
      experience: "10+ anos",
      expertise: ["Métodos Analíticos", "Validação", "Transferência Tecnológica"],
      projects: 32,
      rate: "R$ 160/hora",
      description: "Especialista em desenvolvimento e validação de métodos analíticos para a indústria farmacêutica."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ComplianceDisclaimer />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Consultores Farmacêuticos
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Conecte-se com especialistas e consultores qualificados para seus projetos
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button className="bg-primary">
              <GraduationCap className="h-4 w-4 mr-2" />
              Buscar por Expertise
            </Button>
            <Button variant="outline">Por Experiência</Button>
            <Button variant="outline">Por Localização</Button>
            <Button variant="outline">Por Avaliação</Button>
          </div>
        </div>

        {/* Consultants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultants.map((consultant) => (
            <Card key={consultant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{consultant.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{consultant.title}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{consultant.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{consultant.rating}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{consultant.description}</p>
                
                {/* Experience and Projects */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{consultant.experience}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">{consultant.projects} projetos</span>
                  </div>
                </div>

                {/* Expertise */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Expertise:</h4>
                  <div className="flex flex-wrap gap-1">
                    {consultant.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Rate */}
                <div className="mb-4">
                  <span className="text-lg font-bold text-primary">{consultant.rate}</span>
                  <span className="text-sm text-gray-600 ml-1">valor indicativo</span>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    Ver Perfil
                  </Button>
                  <Button variant="outline" size="sm">
                    Contatar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Carregar Mais Consultores
          </Button>
        </div>
      </div>

      <ComplianceFooter />
    </div>
  );
};

export default Consultants;
