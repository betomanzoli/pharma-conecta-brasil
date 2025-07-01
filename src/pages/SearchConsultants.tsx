
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, MapPin, Star, DollarSign, Briefcase, Search, Filter } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Consultant {
  id: string;
  expertise: string[];
  location: string;
  description?: string;
  availability: string;
  certifications: string[];
  projects_completed: number;
  hourly_rate: number;
  profiles?: {
    first_name?: string;
    last_name?: string;
  };
}

const SearchConsultants = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [priceRangeFilter, setPriceRangeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConsultants();
  }, []);

  useEffect(() => {
    filterConsultants();
  }, [searchTerm, expertiseFilter, availabilityFilter, priceRangeFilter, consultants]);

  const fetchConsultants = async () => {
    try {
      const { data, error } = await supabase
        .from('consultants')
        .select(`
          *,
          profiles (
            first_name,
            last_name
          )
        `)
        .order('projects_completed', { ascending: false });

      if (error) throw error;
      
      setConsultants(data || []);
      setFilteredConsultants(data || []);
    } catch (error) {
      console.error('Erro ao carregar consultores:', error);
      toast({
        title: "Erro ao carregar consultores",
        description: "Não foi possível carregar os dados dos consultores",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterConsultants = () => {
    let filtered = consultants;

    if (searchTerm) {
      filtered = filtered.filter(consultant =>
        consultant.expertise?.some(exp => 
          exp.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        consultant.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${consultant.profiles?.first_name} ${consultant.profiles?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (expertiseFilter !== 'all') {
      filtered = filtered.filter(consultant => 
        consultant.expertise?.includes(expertiseFilter)
      );
    }

    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(consultant => consultant.availability === availabilityFilter);
    }

    if (priceRangeFilter !== 'all') {
      const [min, max] = priceRangeFilter.split('-').map(Number);
      filtered = filtered.filter(consultant => {
        const rate = consultant.hourly_rate || 0;
        if (max) {
          return rate >= min && rate <= max;
        }
        return rate >= min;
      });
    }

    setFilteredConsultants(filtered);
  };

  const handleContact = (consultant: Consultant) => {
    toast({
      title: "Entrando em contato",
      description: `Iniciando contato com ${consultant.profiles?.first_name} ${consultant.profiles?.last_name}`,
    });
  };

  const getUniqueExpertise = () => {
    const expertise = consultants.flatMap(consultant => consultant.expertise || []);
    return [...new Set(expertise)];
  };

  const getConsultantName = (consultant: Consultant) => {
    return `${consultant.profiles?.first_name || ''} ${consultant.profiles?.last_name || ''}`.trim() || 'Consultor';
  };

  const getRatingStars = (projects: number) => {
    // Simular rating baseado no número de projetos
    const rating = Math.min(5, Math.max(3, Math.floor(projects / 10) + 3));
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Buscar Consultores
            </h1>
            <p className="text-gray-600 mt-2">
              Encontre especialistas em regulamentação farmacêutica
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
                      placeholder="Buscar por nome, especialidade ou localização..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Especialidades</SelectItem>
                    {getUniqueExpertise().map(expertise => (
                      <SelectItem key={expertise} value={expertise}>{expertise}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Disponibilidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer Disponibilidade</SelectItem>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="busy">Ocupado</SelectItem>
                    <SelectItem value="partial">Parcialmente Disponível</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priceRangeFilter} onValueChange={setPriceRangeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Faixa de Preço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer Preço</SelectItem>
                    <SelectItem value="0-200">R$ 0 - 200/h</SelectItem>
                    <SelectItem value="200-400">R$ 200 - 400/h</SelectItem>
                    <SelectItem value="400-600">R$ 400 - 600/h</SelectItem>
                    <SelectItem value="600">R$ 600+/h</SelectItem>
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
          ) : filteredConsultants.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum consultor encontrado
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
                  {filteredConsultants.length} consultor{filteredConsultants.length !== 1 ? 'es' : ''} encontrado{filteredConsultants.length !== 1 ? 's' : ''}
                </p>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros Avançados
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredConsultants.map((consultant) => (
                  <Card key={consultant.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-primary flex items-center">
                            <GraduationCap className="h-5 w-5 mr-2" />
                            {getConsultantName(consultant)}
                          </CardTitle>
                          <div className="flex items-center text-gray-600 mt-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{consultant.location}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            {getRatingStars(consultant.projects_completed)}
                            <span className="ml-2 text-sm text-gray-600">
                              ({consultant.projects_completed} projetos)
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-lg font-bold text-primary">
                            <DollarSign className="h-5 w-5" />
                            R$ {consultant.hourly_rate || 0}/h
                          </div>
                          <Badge 
                            variant={consultant.availability === 'available' ? 'default' : 'secondary'}
                          >
                            {consultant.availability === 'available' ? 'Disponível' : 
                             consultant.availability === 'busy' ? 'Ocupado' : 'Parcial'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {consultant.description && (
                        <p className="text-gray-600 mb-4">{consultant.description}</p>
                      )}
                      
                      {consultant.expertise && consultant.expertise.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Especialidades:</h4>
                          <div className="flex flex-wrap gap-2">
                            {consultant.expertise.map((expertise, index) => (
                              <Badge key={index} variant="secondary">{expertise}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {consultant.certifications && consultant.certifications.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Certificações:</h4>
                          <div className="flex flex-wrap gap-2">
                            {consultant.certifications.slice(0, 3).map((cert, index) => (
                              <Badge key={index} variant="outline">{cert}</Badge>
                            ))}
                            {consultant.certifications.length > 3 && (
                              <Badge variant="outline">+{consultant.certifications.length - 3} mais</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            <span>{consultant.projects_completed} projetos concluídos</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Ver Perfil
                          </Button>
                          <Button size="sm" onClick={() => handleContact(consultant)}>
                            Contratar
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

export default SearchConsultants;
