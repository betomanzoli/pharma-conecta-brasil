
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Star, Package, Truck } from "lucide-react";
import Header from "@/components/Header";
import ComplianceFooter from "@/components/ComplianceFooter";
import ComplianceDisclaimer from "@/components/ComplianceDisclaimer";

const Suppliers = () => {
  const suppliers = [
    {
      id: 1,
      name: "PharmaEquip Brasil",
      category: "Equipamentos Analíticos",
      location: "São Paulo, SP",
      rating: 4.9,
      products: ["HPLC", "Espectrômetros", "Balanças Analíticas"],
      delivery: "3-5 dias úteis",
      certifications: ["ISO 9001", "ANVISA"],
      description: "Fornecedor líder em equipamentos analíticos para laboratórios farmacêuticos."
    },
    {
      id: 2,
      name: "MatPrima Farmacêutica",
      category: "Matérias-Primas",
      location: "Rio de Janeiro, RJ",
      rating: 4.8,
      products: ["APIs", "Excipientes", "Solventes"],
      delivery: "7-10 dias úteis",
      certifications: ["GMP", "FDA", "ANVISA"],
      description: "Distribuidor especializado em matérias-primas farmacêuticas de alta qualidade."
    },
    {
      id: 3,
      name: "CleanRoom Solutions",
      category: "Sistemas de Controle Ambiental",
      location: "Campinas, SP",
      rating: 4.7,
      products: ["Salas Limpas", "HVAC", "Sistemas de Purificação"],
      delivery: "15-30 dias úteis",
      certifications: ["ISO 14644", "GMP"],
      description: "Especialistas em projetos e instalação de salas limpas para a indústria farmacêutica."
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
            Fornecedores Farmacêuticos
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Encontre fornecedores qualificados para equipamentos, matérias-primas e serviços
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button className="bg-primary">
              <Package className="h-4 w-4 mr-2" />
              Buscar por Categoria
            </Button>
            <Button variant="outline">Por Certificação</Button>
            <Button variant="outline">Por Localização</Button>
            <Button variant="outline">Tempo de Entrega</Button>
          </div>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <p className="text-sm text-primary font-medium mt-1">{supplier.category}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{supplier.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{supplier.rating}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{supplier.description}</p>
                
                {/* Products */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Produtos:</h4>
                  <div className="flex flex-wrap gap-1">
                    {supplier.products.map((product) => (
                      <Badge key={product} variant="secondary" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="flex items-center space-x-2 mb-4">
                  <Truck className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">{supplier.delivery}</span>
                </div>

                {/* Certifications */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Certificações:</h4>
                  <div className="flex flex-wrap gap-1">
                    {supplier.certifications.map((cert) => (
                      <Badge key={cert} className="text-xs bg-primary-100 text-primary-800">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    Ver Catálogo
                  </Button>
                  <Button variant="outline" size="sm">
                    Solicitar Cotação
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Carregar Mais Fornecedores
          </Button>
        </div>
      </div>

      <ComplianceFooter />
    </div>
  );
};

export default Suppliers;
