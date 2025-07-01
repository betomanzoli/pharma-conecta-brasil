
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import AIMatchingEngine from '@/components/marketplace/AIMatchingEngine';
import ServiceProviderCard from '@/components/marketplace/ServiceProviderCard';
import MarketplaceFilters from '@/components/marketplace/MarketplaceFilters';
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
      // Mock data - em produção, viria do Supabase
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
              <MarketplaceFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              />

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
                    <ServiceProviderCard
                      key={provider.id}
                      provider={provider}
                      onContact={handleContact}
                      onSchedule={handleSchedule}
                    />
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
