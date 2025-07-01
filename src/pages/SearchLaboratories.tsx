
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlaskConical, MapPin, Phone, Globe, Clock, Star, Filter, Search } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Laboratory {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  certifications: string[];
  equipment_list: string[];
  phone?: string;
  website?: string;
  description?: string;
  operating_hours?: string;
  available_capacity: number;
}

const SearchLaboratories = () => {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<Laboratory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [certificationFilter, setCertificationFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLaboratories();
  }, []);

  useEffect(() => {
    filterLaboratories();
  }, [searchTerm, locationFilter, certificationFilter, laboratories]);

  const fetchLaboratories = async () => {
    try {
      const { data, error } = await supabase
        .from('laboratories')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setLaboratories(data || []);
      setFilteredLabs(data || []);
    } catch (error) {
      console.error('Erro ao carregar laboratórios:', error);
      toast({
        title: "Erro ao carregar laboratórios",
        description: "Não foi possível carregar os dados dos laboratórios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterLaboratories = () => {
    let filtered = laboratories;

    if (searchTerm) {
      filtered = filtered.filter(lab =>
        lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(lab => lab.state === locationFilter);
    }

    if (certificationFilter !== 'all') {
      filtered = filtered.filter(lab => 
        lab.certifications?.includes(certificationFilter)
      );
    }

    setFilteredLabs(filtered);
  };

  const handleContact = (lab: Laboratory) => {
    toast({
      title: "Entrando em contato",
      description: `Iniciando contato com ${lab.name}`,
    });
  };

  const getUniqueStates = () => {
    const states = laboratories.map(lab => lab.state).filter(Boolean);
    return [...new Set(states)];
  };

  const getUniqueCertifications = () => {
    const certs = laboratories.flatMap(lab => lab.certifications || []);
    return [...new Set(certs)];
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Buscar Laboratórios
            </h1>
            <p className="text-gray-600 mt-2">
              Encontre laboratórios certificados e especializados
            </p>
          </div>

          {/* Filtros */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nome, localização ou especialidade..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
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
                <Select value={certificationFilter} onValueChange={setCertificationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Certificação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Certificações</SelectItem>
                    {getUniqueCertifications().map(cert => (
                      <SelectItem key={cert} value={cert}>{cert}</SelectItem>
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
          ) : filteredLabs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum laboratório encontrado
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
                  {filteredLabs.length} laboratório{filteredLabs.length !== 1 ? 's' : ''} encontrado{filteredLabs.length !== 1 ? 's' : ''}
                </p>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros Avançados
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredLabs.map((lab) => (
                  <Card key={lab.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-primary flex items-center">
                            <FlaskConical className="h-5 w-5 mr-2" />
                            {lab.name}
                          </CardTitle>
                          <div className="flex items-center text-gray-600 mt-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{lab.city}, {lab.state}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Capacidade: {lab.available_capacity || 0}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {lab.description && (
                        <p className="text-gray-600 mb-4">{lab.description}</p>
                      )}
                      
                      {lab.certifications && lab.certifications.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Certificações:</h4>
                          <div className="flex flex-wrap gap-2">
                            {lab.certifications.map((cert, index) => (
                              <Badge key={index} variant="secondary">{cert}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {lab.equipment_list && lab.equipment_list.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Equipamentos:</h4>
                          <div className="flex flex-wrap gap-2">
                            {lab.equipment_list.slice(0, 3).map((equipment, index) => (
                              <Badge key={index} variant="outline">{equipment}</Badge>
                            ))}
                            {lab.equipment_list.length > 3 && (
                              <Badge variant="outline">+{lab.equipment_list.length - 3} mais</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {lab.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              <span>{lab.phone}</span>
                            </div>
                          )}
                          {lab.operating_hours && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{lab.operating_hours}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {lab.website && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={lab.website} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4 mr-1" />
                                Site
                              </a>
                            </Button>
                          )}
                          <Button size="sm" onClick={() => handleContact(lab)}>
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
    </ProtectedRoute>
  );
};

export default SearchLaboratories;
