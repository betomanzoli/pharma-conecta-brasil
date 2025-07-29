
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import EnhancedAnalyticsDashboard from '@/components/analytics/EnhancedAnalyticsDashboard';

const Analytics = () => {
  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <ProtectedRoute>
      <MobileOptimizedLayout
        title="Analytics"
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
        <EnhancedAnalyticsDashboard />
      </MobileOptimizedLayout>
    </ProtectedRoute>
  );
};

export default Analytics;
