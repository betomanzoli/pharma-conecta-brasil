
import React from 'react';
import AdminRoute from '@/components/AdminRoute';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import SystemMonitoringDashboard from '@/components/admin/SystemMonitoringDashboard';
import UserManagement from '@/components/admin/UserManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Activity, Settings } from 'lucide-react';

const AdminPage = () => {
  return (
    <AdminRoute>
      <MobileOptimizedLayout 
        title="Administração"
        showHeader={true}
        showNavigation={true}
        enablePullToRefresh={true}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Painel de Administração</h1>
              <p className="text-muted-foreground">
                Gerencie usuários e monitore o sistema
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="monitoring" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="monitoring" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Monitoramento</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Usuários</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monitoring" className="space-y-6">
              <SystemMonitoringDashboard />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <UserManagement />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="text-center p-8">
                <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Configurações do Sistema</h3>
                <p className="text-muted-foreground">Em desenvolvimento</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </MobileOptimizedLayout>
    </AdminRoute>
  );
};

export default AdminPage;
