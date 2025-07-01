
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, MapPin, Phone, Globe, Star, Search, Filter, Package } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Supplier {
  id: string;
  name: string;
  cnpj?: string;
  expertise_area: string[];
  compliance_status: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [complianceFilter, setComplianceFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [searchTerm, areaFilter, complianceFilter, locationFilter, suppliers]);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setSuppliers(data || []);
      setFilteredSuppliers(data || []);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      toast({
        title: "Erro ao carregar fornecedores",
        description: "Não foi possível carregar os dados dos fornecedores",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSuppliers = () => {
    let filtered = suppliers;

    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (areaFilter !== 'all') {
      filtered = filtered.filter(supplier => 
        supplier.expertise_area?.includes(areaFilter)
      );
    }

    if (complianceFilter !== 'all') {
      filtered = filtered.filter(supplier => supplier.compliance_status === complianceFilter);
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(supplier => supplier.state === locationFilter);
    }

    setFilteredSuppliers(filtered);
  };

  const getComplianceColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'compliant':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'non_compliant':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getComplianceText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'compliant':
        return 'Aprovado';
      case 'pending':
        return 'Pendente';
      case 'non_compliant':
        return 'Não Conforme';
      default:
        return 'Não Informado';
    }
  };

  const handleContact = (supplier: Supplier) => {
    toast({
      title: "Entrando em contato",
      description: `Iniciando contato com ${supplier.name}`,
    });
  };

  const getUniqueAreas = () => {
    const areas = suppliers.flatMap(supplier => supplier.expertise_area || []);
    return [...new Set(areas)];
  };

  const getUniqueStates = () => {
    const states = suppliers.map(supplier => supplier.state).filter(Boolean);
    return [...new Set(states)];
  };

  // Simular rating baseado no status de compliance
  const getSupplierRating = (supplier: Supplier) => {
    let rating = 3;
    if (supplier.compliance_status === 'approved' || supplier.compliance_status === 'compliant') {
      rating = 5;
    } else if (supplier.compliance_status === 'pending') {
      rating = 4;
    }
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Fornecedores Farmacêuticos
          </h1>
          <p className="text-gray-600 mt-2">
            Encontre fornecedores certificados e verificados
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar fornecedores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Área de Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Áreas</SelectItem>
                  {getUniqueAreas().map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={complianceFilter} onValueChange={setComplianceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status de Compliance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="non_compliant">Não Conforme</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Estados</SelectItem>
                  {getUniqueStates().map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum fornecedor encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros de busca
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                {filteredSuppliers.length} fornecedor{filteredSuppliers.length !== 1 ? 'es' : ''} encontrado{filteredSuppliers.length !== 1 ? 's' : ''}
              </p>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros Avançados
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-primary flex items-center">
                          <Building2 className="h-5 w-5 mr-2" />
                          {supplier.name}
                        </CardTitle>
                        {supplier.city && supplier.state && (
                          <div className="flex items-center text-gray-600 mt-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{supplier.city}, {supplier.state}</span>
                          </div>
                        )}
                        <div className="flex items-center mt-1">
                          {getSupplierRating(supplier)}
                          <span className="ml-2 text-sm text-gray-600">
                            Fornecedor Verificado
                          </span>
                        </div>
                      </div>
                      <Badge variant={getComplianceColor(supplier.compliance_status)}>
                        {getComplianceText(supplier.compliance_status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {supplier.description && (
                      <p className="text-gray-600 mb-4">{supplier.description}</p>
                    )}
                    
                    {supplier.expertise_area && supplier.expertise_area.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Áreas de Expertise:</h4>
                        <div className="flex flex-wrap gap-2">
                          {supplier.expertise_area.map((area, index) => (
                            <Badge key={index} variant="secondary">{area}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {supplier.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            <span>{supplier.phone}</span>
                          </div>
                        )}
                        {supplier.cnpj && (
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-1" />
                            <span>CNPJ: {supplier.cnpj}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {supplier.website && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-4 w-4 mr-1" />
                              Site
                            </a>
                          </Button>
                        )}
                        <Button size="sm" onClick={() => handleContact(supplier)}>
                          Entrar em Contato
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Suppliers;
