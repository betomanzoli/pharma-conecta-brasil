
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import StrategicPlanDashboard from '@/components/strategic-plan/StrategicPlanDashboard';

const StrategicPlan = () => {
  const { profile } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StrategicPlanDashboard />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default StrategicPlan;
