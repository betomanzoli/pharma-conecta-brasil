
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
            <ServiceProviderCard 
              name="Laboratório ABC"
              specialty="Análises Microbiológicas"
              rating={4.8}
              location="São Paulo, SP"
              price="R$ 150/análise"
              verified={true}
            />
            <ServiceProviderCard 
              name="Consultoria XYZ"
              specialty="Registro ANVISA"
              rating={4.9}
              location="Rio de Janeiro, RJ"
              price="R$ 5.000/projeto"
              verified={true}
            />
            <ServiceProviderCard 
              name="TechPharma"
              specialty="Desenvolvimento de Formulações"
              rating={4.7}
              location="Belo Horizonte, MG"
              price="R$ 8.000/projeto"
              verified={true}
            />
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
