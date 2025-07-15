import React from 'react';
import { ApiIntegrationDashboard } from '@/components/integration/ApiIntegrationDashboard';
import UnifiedHeader from '@/components/UnifiedHeader';

const AllApisDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />
      <div className="container mx-auto px-4 py-8">
        <ApiIntegrationDashboard />
      </div>
    </div>
  );
};

export default AllApisDashboard;