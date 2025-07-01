
import React from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import PlatformDemo from '@/components/demo/PlatformDemo';

const PlatformDemoPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PlatformDemo />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PlatformDemoPage;
