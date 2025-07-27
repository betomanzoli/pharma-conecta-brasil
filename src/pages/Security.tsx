
import React from 'react';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

const Security = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <SecurityDashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Security;
