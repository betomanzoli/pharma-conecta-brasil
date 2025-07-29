
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MarketplaceStats from './MarketplaceStats';
import ProjectBoard from './ProjectBoard';
import SupplierDirectory from './SupplierDirectory';
import ServiceProviderCard from './ServiceProviderCard';
import AdvancedAIMatching from '../ai/AdvancedAIMatching';
import { Brain, Search, Users, TrendingUp, Target } from 'lucide-react';

const EnhancedMarketplace = () => {
  const [activeTab, setActiveTab] = useState('matching');

  const mockProviders = [
    {
      id: '1',
      name: 'Laboratório ABC',
      type: 'laboratory' as const,
      location: 'São Paulo, SP',
      rating: 4.8,
      specialties: ['Análises Microbiológicas'],
      description: 'Laboratório especializado em análises microbiológicas avançadas',
      verified: true,
      price_range: 'R$ 150/análise'
    },
    {
      id: '2',
      name: 'Consultoria XYZ',
      type: 'consultant' as const,
      location: 'Rio de Janeiro, RJ',
      rating: 4.9,
      specialties: ['Registro ANVISA'],
      description: 'Consultoria especializada em registro de produtos na ANVISA',
      verified: true,
      price_range: 'R$ 5.000/projeto'
    },
    {
      id: '3',
      name: 'TechPharma',
      type: 'company' as const,
      location: 'Belo Horizonte, MG',
      rating: 4.7,
      specialties: ['Desenvolvimento de Formulações'],
      description: 'Empresa especializada em desenvolvimento de formulações farmacêuticas',
      verified: true,
      price_range: 'R$ 8.000/projeto'
    }
  ];

  const handleContact = (providerId: string) => {
    console.log('Contacting provider:', providerId);
  };

  const handleSchedule = (providerId: string) => {
    console.log('Scheduling with provider:', providerId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marketplace Inteligente</h1>
        <p className="text-muted-foreground">Conecte-se com parceiros através de AI avançada</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="matching" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Matching</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Projetos</span>
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Fornecedores</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Busca</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Análise</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matching" className="space-y-6">
          <AdvancedAIMatching />
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <ProjectBoard />
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <SupplierDirectory />
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockProviders.map((provider) => (
              <ServiceProviderCard
                key={provider.id}
                provider={provider}
                onContact={handleContact}
                onSchedule={handleSchedule}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <MarketplaceStats />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedMarketplace;
