
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import SmartSearchEngine from '@/components/search/SmartSearchEngine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Brain, Filter } from 'lucide-react';

const SearchPage = () => {
  return (
    <ProtectedRoute>
      <MobileOptimizedLayout 
        title="Busca Avançada"
        showHeader={true}
        showNavigation={true}
        enablePullToRefresh={true}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Sistema de Busca</h1>
              <p className="text-muted-foreground">
                Encontre exatamente o que você precisa com nossa busca inteligente
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="smart" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto">
              <TabsTrigger value="smart" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Busca Inteligente</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Busca Avançada</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="smart" className="space-y-6">
              <SmartSearchEngine />
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <AdvancedSearch />
            </TabsContent>
          </Tabs>
        </div>
      </MobileOptimizedLayout>
    </ProtectedRoute>
  );
};

export default SearchPage;
