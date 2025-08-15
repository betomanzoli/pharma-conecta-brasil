
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AutomationMasterHub from '@/components/automation/AutomationMasterHub';
import WorkflowBuilder from '@/components/automation/WorkflowBuilder';
import { Zap, Workflow, Settings, Activity } from 'lucide-react';

const AutomationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hub');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hub" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Master Hub</span>
              </TabsTrigger>
              <TabsTrigger value="builder" className="flex items-center space-x-2">
                <Workflow className="h-4 w-4" />
                <span>Workflow Builder</span>
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Monitoramento</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hub" className="mt-6">
              <AutomationMasterHub />
            </TabsContent>

            <TabsContent value="builder" className="mt-6">
              <WorkflowBuilder />
            </TabsContent>

            <TabsContent value="monitoring" className="mt-6">
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Monitoramento Avançado
                </h3>
                <p className="text-gray-600">
                  Visualização em tempo real de todos os workflows e métricas de performance
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Funcionalidade disponível na próxima versão
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AutomationPage;
