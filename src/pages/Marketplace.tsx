
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import EnhancedMarketplace from '@/components/marketplace/EnhancedMarketplace';
import UniversalDemoBanner from '@/components/layout/UniversalDemoBanner';
import { isDemoMode } from '@/utils/demoMode';

const Marketplace = () => {
  const isDemo = isDemoMode();
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <UniversalDemoBanner variant="minimal" className="mb-6" />
          
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Marketplace
                </h1>
                <p className="text-muted-foreground">
                  {isDemo 
                    ? 'Explore parceiros e serviços disponíveis (dados demonstrativos)'
                    : 'Conecte-se com laboratórios, consultores e fornecedores'
                  }
                </p>
              </div>
            </div>
          </div>

          <EnhancedMarketplace />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Marketplace;
