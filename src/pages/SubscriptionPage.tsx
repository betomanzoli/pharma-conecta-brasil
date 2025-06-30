
import React from 'react';
import Header from '@/components/Header';
import SubscriptionManager from '@/components/subscription/SubscriptionManager';

const SubscriptionPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SubscriptionManager />
      </div>
    </div>
  );
};

export default SubscriptionPage;
