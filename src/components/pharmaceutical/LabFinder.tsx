
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, FlaskConical } from "lucide-react";

const LabFinder = () => {
  const [selectedService, setSelectedService] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const services = [
    "Análises Microbiológicas",
    "Validação de Métodos HPLC",
    "Testes de Estabilidade",
    "Desenvolvimento Analítico",
    "Controle de Qualidade",
    "Bioequivalência",
    "Toxicologia",
    "Formulação"
  ];

  const mockResults = [
    {
      name: "AnalyticLab São Paulo",
      location: "São Paulo, SP",
      specialties: ["HPLC", "Microbiologia", "Estabilidade"],
      capacity: "Disponível",
      rating: 4.8,
      price: "R$ 150-300/análise"
    },
    {
      name: "BioTest Laboratórios",
      location: "Rio de Janeiro, RJ",
      specialties: ["Bioequivalência", "Toxicologia"],
      capacity: "70% ocupado",
      rating: 4.6,
      price: "R$ 200-450/análise"
    }
  ];

  const handleSearch = () => {
    if (selectedService) {
      setResults(mockResults);
      setShowResults(true);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="h-5 w-5 mr-2" />
          Encontrar Laboratório
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Preciso de um laboratório para...</label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o serviço" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleSearch} className="w-full" disabled={!selectedService}>
          <Search className="h-4 w-4 mr-2" />
          Buscar Laboratórios
        </Button>
        
        {showResults && (
          <div className="space-y-3 mt-4">
            <h4 className="font-medium text-gray-900">Laboratórios Encontrados:</h4>
            {results.map((lab, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-medium">{lab.name}</h5>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      {lab.location}
                    </div>
                  </div>
                  <Badge variant={lab.capacity === "Disponível" ? "default" : "secondary"}>
                    {lab.capacity}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {lab.specialties.map((spec: string) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-primary font-medium">{lab.price}</span>
                  <Button size="sm" variant="outline">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LabFinder;
