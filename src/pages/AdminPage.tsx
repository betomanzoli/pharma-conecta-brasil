import React from 'react';
import Navigation from '@/components/Navigation';
import AdminRoute from '@/components/AdminRoute';
import SystemMonitoringDashboard from '@/components/admin/SystemMonitoringDashboard';

const AdminPage = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SystemMonitoringDashboard />
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminPage;