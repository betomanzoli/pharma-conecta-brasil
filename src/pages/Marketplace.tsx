
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import EnhancedMarketplace from '@/components/marketplace/EnhancedMarketplace';
import { useAuth } from '@/contexts/AuthContext';

const Marketplace = () => {
  const { profile } = useAuth();
  
  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <ProtectedRoute>
      <MobileOptimizedLayout
        title="Marketplace"
        showHeader={true}
        showNavigation={true}
        enablePullToRefresh={true}
        enableGestures={true}
        onRefresh={handleRefresh}
        headerProps={{
          showBack: false,
          showMenu: true
        }}
      >
        <EnhancedMarketplace />
      </MobileOptimizedLayout>
    </ProtectedRoute>
  );
};

export default Marketplace;
