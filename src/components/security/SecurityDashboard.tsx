
import React from 'react';
import SecuritySettings from './SecuritySettings';
import SecurityEvents from './SecurityEvents';
import SecurityMetrics from './SecurityMetrics';

const SecurityDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Segurança</h1>
        <p className="text-muted-foreground">Gerencie suas configurações de segurança</p>
      </div>

      <SecurityMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecuritySettings />
        <SecurityEvents />
      </div>
    </div>
  );
};

export default SecurityDashboard;
