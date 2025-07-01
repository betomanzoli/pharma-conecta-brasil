
import React from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import PaymentDashboard from '@/components/payments/PaymentDashboard';

const PaymentsPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PaymentDashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PaymentsPage;
