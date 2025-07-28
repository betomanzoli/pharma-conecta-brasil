
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecuritySettings from './SecuritySettings';
import SecurityEvents from './SecurityEvents';
import SecurityMetrics from './SecurityMetrics';
import DataClassificationSystem from './DataClassificationSystem';
import LGPDComplianceCenter from './LGPDComplianceCenter';
import DigitalVaultSystem from './DigitalVaultSystem';
import TransparencyDashboard from './TransparencyDashboard';
import AutomatedCompliance from '../compliance/AutomatedCompliance';
import { Shield, Lock, Eye, FileText, CheckCircle, Settings } from 'lucide-react';

const SecurityDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Central de Segurança</h1>
        <p className="text-muted-foreground">Gerencie todas as configurações de segurança e compliance</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="classification" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>Classificação</span>
          </TabsTrigger>
          <TabsTrigger value="lgpd" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>LGPD</span>
          </TabsTrigger>
          <TabsTrigger value="vault" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Cofre Digital</span>
          </TabsTrigger>
          <TabsTrigger value="transparency" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Transparência</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SecurityMetrics />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SecuritySettings />
            <SecurityEvents />
          </div>
        </TabsContent>

        <TabsContent value="classification" className="space-y-6">
          <DataClassificationSystem />
        </TabsContent>

        <TabsContent value="lgpd" className="space-y-6">
          <LGPDComplianceCenter />
        </TabsContent>

        <TabsContent value="vault" className="space-y-6">
          <DigitalVaultSystem />
        </TabsContent>

        <TabsContent value="transparency" className="space-y-6">
          <TransparencyDashboard />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <AutomatedCompliance />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SecuritySettings />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SecurityEvents />
            <SecurityMetrics />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
