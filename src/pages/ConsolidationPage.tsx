
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import ConsolidationControlCenter from '@/components/strategic-plan/consolidation/ConsolidationControlCenter';

const ConsolidationPage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <ConsolidationControlCenter />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ConsolidationPage;
