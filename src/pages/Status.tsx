
import React from 'react';
import PlatformStatusDashboard from '@/components/status/PlatformStatusDashboard';
import TransparencyBanner from '@/components/transparency/TransparencyBanner';

const StatusPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <TransparencyBanner variant="full" className="mb-6" />
        <PlatformStatusDashboard />
      </div>
    </div>
  );
};

export default StatusPage;
