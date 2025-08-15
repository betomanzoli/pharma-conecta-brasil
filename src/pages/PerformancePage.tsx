
import React from 'react';
import Navigation from '@/components/Navigation';

const PerformancePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Performance</h1>
          <p className="text-muted-foreground">Dashboard de performance em desenvolvimento</p>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
