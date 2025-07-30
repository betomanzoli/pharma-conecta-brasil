
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecuritySettings from './SecuritySettings';
import SecurityMonitor from './SecurityMonitor';
import SecurityValidation from './SecurityValidation';
import TwoFactorAuth from './TwoFactorAuth';
import { Shield, Settings, Eye, CheckSquare, Lock } from 'lucide-react';

const SecurityDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Central de Segurança
        </h1>
        <p className="text-lg text-muted-foreground">
          Monitore e configure a segurança da sua conta
        </p>
      </div>

      <Tabs defaultValue="monitor" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitor" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Monitor</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </TabsTrigger>
          <TabsTrigger value="twofactor" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>2FA</span>
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center space-x-2">
            <CheckSquare className="h-4 w-4" />
            <span>Validação</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="mt-6">
          <SecurityMonitor />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="twofactor" className="mt-6">
          <TwoFactorAuth />
        </TabsContent>

        <TabsContent value="validation" className="mt-6">
          <SecurityValidation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
