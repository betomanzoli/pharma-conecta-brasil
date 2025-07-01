
import React from 'react';
import Navigation from '@/components/Navigation';
import CompletePlatformDemo from '@/components/demo/CompletePlatformDemo';

const PlatformDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <CompletePlatformDemo />
    </div>
  );
};

export default PlatformDemo;
