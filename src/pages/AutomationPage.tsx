
import React from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import AutomationDashboard from '@/components/automation/AutomationDashboard';
import MasterAutomationOrchestrator from '@/components/ai/MasterAutomationOrchestrator';

const AutomationPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Central de Automações</h1>
            <p className="text-muted-foreground">
              Gerencie e monitore todas as automações inteligentes da plataforma
            </p>
          </div>
          
          <div className="space-y-8">
            <AutomationDashboard />
            <MasterAutomationOrchestrator />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AutomationPage;
