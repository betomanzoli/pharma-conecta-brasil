
import React from 'react';
import Navigation from '@/components/Navigation';
import AdminRoute from '@/components/AdminRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RealAPIIntegrationPanel from '@/components/integration/RealAPIIntegrationPanel';
import FINEPIntegration from '@/components/integration/FINEPIntegration';
import ExternalIntegrationsPanel from '@/components/integration/ExternalIntegrationsPanel';
import IntegrationCategories from '@/components/integration/IntegrationCategories';

const IntegrationsPage = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Central de Integrações</h1>
              <p className="text-muted-foreground">
                Gerencie todas as integrações e APIs externas do sistema
              </p>
            </div>

            <Tabs defaultValue="external" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="external">Integrações</TabsTrigger>
                <TabsTrigger value="api">APIs Reais</TabsTrigger>
                <TabsTrigger value="finep">FINEP</TabsTrigger>
                <TabsTrigger value="categories">Categorias</TabsTrigger>
              </TabsList>

              <TabsContent value="external">
                <ExternalIntegrationsPanel />
              </TabsContent>

              <TabsContent value="api">
                <RealAPIIntegrationPanel />
              </TabsContent>

              <TabsContent value="finep">
                <FINEPIntegration />
              </TabsContent>

              <TabsContent value="categories">
                <IntegrationCategories 
                  integrations={[]} 
                  onTest={() => {}} 
                  onConfigure={() => {}} 
                  loading={null} 
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default IntegrationsPage;
