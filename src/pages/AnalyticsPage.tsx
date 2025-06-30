
import React from 'react';
import Navigation from '@/components/Navigation';
import MetricsDashboard from '@/components/dashboard/MetricsDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

const AnalyticsPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Avançados</h1>
            <p className="text-gray-600">Métricas em tempo real da plataforma PharmaConnect</p>
          </div>
          <MetricsDashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AnalyticsPage;
