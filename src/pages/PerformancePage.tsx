import React from 'react';
import UnifiedHeader from '@/components/UnifiedHeader';
import PerformanceDashboard from '@/components/analytics/PerformanceDashboard';

const PerformancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />
      <div className="container mx-auto px-4 py-8">
        <PerformanceDashboard />
      </div>
    </div>
  );
};

export default PerformancePage;