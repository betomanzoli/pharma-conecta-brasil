
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OnboardingWizard from './OnboardingWizard';
import PersonalizedOnboarding from './PersonalizedOnboarding';
import { Users, Sparkles, Target } from 'lucide-react';

const OnboardingDashboard = () => {
  const [activeTab, setActiveTab] = useState('wizard');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Centro de Onboarding</h1>
        <p className="text-muted-foreground">Configure sua experiência personalizada</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wizard" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Wizard Padrão</span>
          </TabsTrigger>
          <TabsTrigger value="personalized" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Personalizado</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Progresso</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wizard" className="space-y-6">
          <OnboardingWizard />
        </TabsContent>

        <TabsContent value="personalized" className="space-y-6">
          <PersonalizedOnboarding />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progresso do Onboarding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Configuração Inicial</span>
                  <span className="text-sm font-medium text-green-600">Completo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Perfil Personalizado</span>
                  <span className="text-sm font-medium text-blue-600">80%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Integração com Parceiros</span>
                  <span className="text-sm font-medium text-yellow-600">Em andamento</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OnboardingDashboard;
