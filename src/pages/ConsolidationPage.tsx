
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import PhaseConsolidationDashboard from '@/components/strategic-plan/consolidation/PhaseConsolidationDashboard';

const ConsolidationPage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <PhaseConsolidationDashboard />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ConsolidationPage;
