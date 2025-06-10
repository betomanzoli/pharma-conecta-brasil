
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import DashboardCompany from './DashboardCompany';
import DashboardLaboratory from './DashboardLaboratory';
import DashboardConsultant from './DashboardConsultant';
import DashboardGeneral from './DashboardGeneral';
import ProtectedRoute from '@/components/ProtectedRoute';

const Dashboard = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1565C0]"></div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (profile?.user_type) {
      case 'company':
        return <DashboardCompany />;
      case 'laboratory':
        return <DashboardLaboratory />;
      case 'consultant':
        return <DashboardConsultant />;
      case 'individual':
      default:
        return <DashboardGeneral />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          {renderDashboard()}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
