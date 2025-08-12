
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import AIMatchingDashboard from '@/components/ai/AIMatchingDashboard';
import UniversalDemoBanner from '@/components/layout/UniversalDemoBanner';

const AIMatchingDashboardPage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <UniversalDemoBanner variant="minimal" className="mb-6" />
          <AIMatchingDashboard />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AIMatchingDashboardPage;
