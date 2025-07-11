import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AIMatchingDashboard from '@/components/ai/AIMatchingDashboard';
import Navigation from '@/components/Navigation';

const AIDashboardPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AIMatchingDashboard />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AIDashboardPage;