import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Users, 
  Building, 
  FlaskConical,
  MessageCircle,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import AIMatchingEngine from '@/components/marketplace/AIMatchingEngine';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ServiceProvider {
  id: string;
  name: string;
  type: 'laboratory' | 'consultant' | 'company';
  location: string;
  rating: number;
  specialties: string[];
  description: string;
  verified: boolean;
  price_range: string;
}

const Marketplace = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [searchTerm, selectedType, providers]);

  const fetchProviders = async () => {
    try {
      // Simular dados de provedores de serviços
      const mockProviders: ServiceProvider[] = [
        {
          id: '1',
          name: 'LabAnalyse Farmacêutica',
          type: 'laboratory',
          location: 'São Paulo, SP',
          rating: 4.8,
          specialties: ['Análise Microbiológica', 'Controle de Qualidade', 'Estabilidade'],
          description: 'Laboratório especializado em análises farmacêuticas com certificação ANVISA.',
          verified: true,
          price_range: 'R$ 500 - R$ 2.000'
        },
        {
          id: '2',
          name: 'Dr. Maria Silva',
          type: 'consultant',
          location: 'Rio de Janeiro, RJ',
          rating: 4.9,
          specialties: ['Regulatório ANVISA', 'Registro de Medicamentos', 'Compliance'],
          description: 'Consultora regulatória com 15 anos de experiência em aprovações ANVISA.',
          verified: true,
          price_range: 'R$ 200 - R$ 800/hora'
        },
        {
          id: '3',
          name: 'BioTech Solutions',
          type: 'company',
          location: 'Campinas, SP',
          rating: 4.7,
          specialties: ['Desenvolvimento de Fármacos', 'Pesquisa Clínica', 'Biotecnologia'],
          description: 'Empresa de biotecnologia focada em desenvolvimento de medicamentos inovadores.',
          verified: true,
          price_range: 'Sob consulta'
        },
        {
          id: '4',
          name: 'Instituto de Pesquisas Farmacêuticas',
          type: 'laboratory',
          location: 'Belo Horizonte, MG',
          rating: 4.6,
          specialties: ['Bioequivalência', 'Farmacocinética', 'Estudos Clínicos'],
          description: 'Instituto de pesquisa com foco em estudos de bioequivalência e farmacocinética.',
          verified: true,
          price_range: 'R$ 1.000 - R$ 5.000'
        },
        {
          id: '5',
          name: 'Consultoria Regulatória Avançada',
          type: 'consultant',
          location: 'Brasília, DF',
          rating: 4.5,
          specialties: ['Assuntos Regulatórios', 'Farmacovigilância', 'Inspeções'],
          description: 'Consultoria especializada em assuntos regulatórios e farmacovigilância.',
          verified: false,
          price_range: 'R$ 150 - R$ 600/hora'
        }
      ];

      setProviders(mockProviders);
      setFilteredProviders(mockProviders);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Erro ao carregar provedores",
        description: "Não foi possível carregar a lista de provedores",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProviders = () => {
    let filtered = providers;

    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        provider.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(provider => provider.type === selectedType);
    }

    setFilteredProviders(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'laboratory': return <FlaskConical className="h-4 w-4" />;
      case 'consultant': return <Users className="h-4 w-4" />;
      case 'company': return <Building className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'laboratory': return 'Laboratório';
      case 'consultant': return 'Consultor';
      case 'company': return 'Empresa';
      default: return 'Provedor';
    }
  };

  const handleContact = (providerId: string) => {
    toast({
      title: "Contato iniciado",
      description: "Uma mensagem foi enviada para o provedor de serviços",
    });
  };

  const handleSchedule = (providerId: string) => {
    toast({
      title: "Agendamento solicitado",
      description: "Sua solicitação de agendamento foi enviada",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Marketplace de Serviços
            </h1>
            <p className="text-gray-600 mt-2">
              Encontre laboratórios, consultores e empresas especializadas no setor farmacêutico
            </p>
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse" className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Explorar Serviços</span>
              </TabsTrigger>
              <TabsTrigger value="ai-matching" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>AI Matching</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              {/* Filtros e Busca */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5" />
                    <span>Filtros de Busca</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Buscar por nome, especialidade ou localização..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="md:col-span-2"
                    />
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Todos os tipos</option>
                      <option value="laboratory">Laboratórios</option>
                      <option value="consultant">Consultores</option>
                      <option value="company">Empresas</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Provedores */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredProviders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum provedor encontrado
                    </h3>
                    <p className="text-gray-600">
                      Tente ajustar os filtros de busca ou termos de pesquisa
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProviders.map((provider) => (
                    <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(provider.type)}
                            <Badge variant="outline">
                              {getTypeLabel(provider.type)}
                            </Badge>
                            {provider.verified && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Verificado
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{provider.rating}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {provider.name}
                        </h3>

                        <div className="flex items-center space-x-1 text-gray-600 mb-3">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{provider.location}</span>
                        </div>

                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                          {provider.description}
                        </p>

                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">Especialidades:</p>
                          <div className="flex flex-wrap gap-1">
                            {provider.specialties.slice(0, 3).map((specialty, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {provider.specialties.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{provider.specialties.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-900">
                            {provider.price_range}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContact(provider.id)}
                            className="flex-1 flex items-center justify-center space-x-1"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>Contatar</span>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSchedule(provider.id)}
                            className="flex-1 flex items-center justify-center space-x-1 bg-[#1565C0] hover:bg-[#1565C0]/90"
                          >
                            <Calendar className="h-4 w-4" />
                            <span>Agendar</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="ai-matching">
              <AIMatchingEngine />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Marketplace;
