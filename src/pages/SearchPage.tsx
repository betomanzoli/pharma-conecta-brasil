import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import { Search } from 'lucide-react';

const SearchPage = () => {
  return (
    <ProtectedRoute>
      <MobileOptimizedLayout 
        title="Busca Avançada"
        enablePullToRefresh={true}
        enableGestures={true}
      >
        <div className="p-4 space-y-6">
          <div className="text-center md:text-left">
            <Search className="h-12 w-12 mx-auto md:mx-0 mb-4 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Busca Avançada</h1>
            <p className="text-muted-foreground">
              Encontre exatamente o que você precisa na plataforma
            </p>
          </div>
          
          <AdvancedSearch />
        </div>
      </MobileOptimizedLayout>
    </ProtectedRoute>
  );
};

export default SearchPage;