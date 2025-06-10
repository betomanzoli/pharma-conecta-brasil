
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, MapPin, Star, Clock, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import ComplianceFooter from "@/components/ComplianceFooter";
import ComplianceDisclaimer from "@/components/ComplianceDisclaimer";

const Laboratories = () => {
  const laboratories = [
    {
      id: 1,
      name: "AnalyticLab São Paulo",
      location: "São Paulo, SP",
      rating: 4.9,
      specialties: ["Análise Microbiológica", "Controle de Qualidade", "Desenvolvimento Analítico"],
      capacity: "85% Disponível",
      responseTime: "24h",
      certifications: ["ISO 17025", "ANVISA", "GMP"],
      description: "Laboratório especializado em análises farmacêuticas com mais de 15 anos de experiência."
    },
    {
      id: 2,
      name: "BioTest Laboratórios",
      location: "Rio de Janeiro, RJ",
      rating: 4.8,
      specialties: ["Bioequivalência", "Farmacocinética", "Estudos Clínicos"],
      capacity: "60% Disponível",
      responseTime: "12h",
      certifications: ["GCP", "ANVISA", "FDA"],
      description: "Centro de pesquisa clínica com foco em estudos de bioequivalência e farmacocinética."
    },
    {
      id: 3,
      name: "PharmaQuality Labs",
      location: "Campinas, SP",
      rating: 4.7,
      specialties: ["Estabilidade", "Impurezas", "Dissolução"],
      capacity: "40% Disponível",
      responseTime: "36h",
      certifications: ["ISO 17025", "ANVISA"],
      description: "Especialistas em estudos de estabilidade e análise de impurezas para produtos farmacêuticos."
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
            Laboratórios Farmacêuticos
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Encontre laboratórios especializados com capacidade disponível para seus projetos
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button className="bg-primary">
              <FlaskConical className="h-4 w-4 mr-2" />
              Buscar por Especialidade
            </Button>
            <Button variant="outline">Por Localização</Button>
            <Button variant="outline">Por Certificação</Button>
            <Button variant="outline">Capacidade Disponível</Button>
          </div>
        </div>

        {/* Laboratories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {laboratories.map((lab) => (
            <Card key={lab.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{lab.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{lab.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{lab.rating}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{lab.description}</p>
                
                {/* Specialties */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Especialidades:</h4>
                  <div className="flex flex-wrap gap-1">
                    {lab.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Capacity and Response Time */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700">{lab.capacity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">{lab.responseTime}</span>
                  </div>
                </div>

                {/* Certifications */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Certificações:</h4>
                  <div className="flex flex-wrap gap-1">
                    {lab.certifications.map((cert) => (
                      <Badge key={cert} className="text-xs bg-primary-100 text-primary-800">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    Ver Detalhes
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
            Carregar Mais Laboratórios
          </Button>
        </div>
      </div>

      <ComplianceFooter />
    </div>
  );
};

export default Laboratories;
