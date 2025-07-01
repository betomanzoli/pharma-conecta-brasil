
import React from 'react';
import Navigation from '@/components/Navigation';
import AdminRoute from '@/components/AdminRoute';
import RealAPIIntegrationPanel from '@/components/integration/RealAPIIntegrationPanel';

const IntegrationsPage = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RealAPIIntegrationPanel />
        </div>
      </div>
    </AdminRoute>
  );
};

export default IntegrationsPage;
