
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import AutomationDashboard from '@/components/automation/AutomationDashboard';
import MasterAutomationOrchestrator from '@/components/ai/MasterAutomationOrchestrator';
import UniversalDemoBanner from '@/components/layout/UniversalDemoBanner';
import { isDemoMode } from '@/utils/demoMode';

const AutomationPage = () => {
  const isDemo = isDemoMode();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <UniversalDemoBanner variant="minimal" className="mb-6" />
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Central de Automações
            </h1>
            <p className="text-muted-foreground">
              {isDemo 
                ? 'Gerencie automações inteligentes da plataforma (dados demonstrativos)'
                : 'Gerencie e monitore todas as automações inteligentes da plataforma'
              }
            </p>
          </div>
          
          <div className="space-y-8">
            <AutomationDashboard />
            <MasterAutomationOrchestrator />
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AutomationPage;
