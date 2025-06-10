
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, Star, Package, Truck, Calendar, CreditCard, Video, FileText } from "lucide-react";

const SupplierDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const suppliers = [
    {
      id: 1,
      name: "PharmaEquip Brasil",
      category: "Equipamentos Analíticos",
      location: "São Paulo, SP",
      rating: 4.9,
      products: [
        {
          name: "HPLC Agilent 1260",
          specs: "UV-Vis Detector, 1mL/min flow rate",
          price: "R$ 180.000 - R$ 220.000",
          availability: "2-4 semanas"
        },
        {
          name: "Espectrômetro FTIR",
          specs: "4000-400 cm⁻¹, Resolução 0.5 cm⁻¹",
          price: "R$ 85.000 - R$ 120.000",
          availability: "1-2 semanas"
        }
      ],
      services: {
        installation: true,
        training: true,
        support: "24/7",
        warranty: "2 anos"
      },
      financing: {
        available: true,
        options: ["Leasing", "Financiamento", "Aluguel"]
      },
      certifications: ["ISO 9001", "ANVISA", "FDA"]
    },
    {
      id: 2,
      name: "LabSupply International",
      category: "Consumíveis Laboratoriais",
      location: "Rio de Janeiro, RJ",
      rating: 4.7,
      products: [
        {
          name: "Vials Cromatografia",
          specs: "2mL, vidro borosilicato",
          price: "R$ 2,50 - R$ 4,00/unidade",
          availability: "Estoque"
        },
        {
          name: "Pipetas Automáticas",
          specs: "10-1000μL, certificadas",
          price: "R$ 850 - R$ 1.200/unidade",
          availability: "1 semana"
        }
      ],
      services: {
        installation: false,
        training: true,
        support: "Horário comercial",
        warranty: "1 ano"
      },
      financing: {
        available: false,
        options: []
      },
      certifications: ["ISO 9001", "CE"]
    }
  ];

  const categories = [
    { id: "all", name: "Todas as Categorias" },
    { id: "analytical", name: "Equipamentos Analíticos" },
    { id: "consumables", name: "Consumíveis" },
    { id: "software", name: "Software" },
    { id: "maintenance", name: "Manutenção" }
  ];

  const filteredSuppliers = suppliers.filter(supplier => 
    (selectedCategory === "all" || supplier.category.toLowerCase().includes(selectedCategory)) &&
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Diretório de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Input
              placeholder="Buscar fornecedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers List */}
      <div className="space-y-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>{supplier.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{supplier.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{supplier.rating}</span>
                    </div>
                    <Badge variant="secondary">{supplier.category}</Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Video className="h-4 w-4 mr-2" />
                    Tour Virtual
                  </Button>
                  <Button size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Demo
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="products" className="space-y-4">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="products">Produtos</TabsTrigger>
                  <TabsTrigger value="services">Serviços</TabsTrigger>
                  <TabsTrigger value="financing">Financiamento</TabsTrigger>
                  <TabsTrigger value="certifications">Certificações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="products" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {supplier.products.map((product, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.specs}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-green-600">{product.price}</span>
                            <Badge variant="outline" className="text-xs">
                              <Truck className="h-3 w-3 mr-1" />
                              {product.availability}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <FileText className="h-3 w-3 mr-1" />
                              Especificações
                            </Button>
                            <Button size="sm" className="flex-1">
                              Solicitar Cotação
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="services" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <Package className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-medium text-sm">Instalação</h4>
                      <p className="text-xs text-gray-600">
                        {supplier.services.installation ? "Disponível" : "Não disponível"}
                      </p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <h4 className="font-medium text-sm">Treinamento</h4>
                      <p className="text-xs text-gray-600">
                        {supplier.services.training ? "Disponível" : "Não disponível"}
                      </p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <MessageSquare className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <h4 className="font-medium text-sm">Suporte</h4>
                      <p className="text-xs text-gray-600">{supplier.services.support}</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Shield className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                      <h4 className="font-medium text-sm">Garantia</h4>
                      <p className="text-xs text-gray-600">{supplier.services.warranty}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="financing" className="space-y-4">
                  {supplier.financing.available ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-green-600">
                        <CreditCard className="h-5 w-5" />
                        <span className="font-medium">Opções de Financiamento Disponíveis</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {supplier.financing.options.map((option, index) => (
                          <Card key={index} className="p-4 text-center">
                            <h4 className="font-medium mb-2">{option}</h4>
                            <Button size="sm" variant="outline" className="w-full">
                              Simular
                            </Button>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Financiamento não disponível para este fornecedor</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="certifications" className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {supplier.certifications.map((cert, index) => (
                      <Badge key={index} className="px-3 py-2">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SupplierDirectory;
