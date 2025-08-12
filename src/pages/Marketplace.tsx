
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedAIMatchingEngine from '@/components/pharmaceutical/EnhancedAIMatchingEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Users, TrendingUp, Zap } from 'lucide-react';
import { useButtonActivation } from '@/hooks/useButtonActivation';

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState('ai-matching');
  const { activateButton } = useButtonActivation();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Marketplace Farmacêutico</h1>
            <p className="text-gray-600 mt-2">
              Conecte-se com parceiros ideais usando nossa IA avançada
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ai-matching" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>AI Matching</span>
              </TabsTrigger>
              <TabsTrigger value="partnerships" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Parcerias</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Automação</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-matching" className="space-y-6">
              <EnhancedAIMatchingEngine />
            </TabsContent>

            <TabsContent value="partnerships" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Parcerias Estratégicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => activateButton('partnerships')}
                      className="h-20 flex flex-col"
                    >
                      <Users className="h-6 w-6 mb-2" />
                      Explorar Parcerias
                    </Button>
                    <Button 
                      onClick={() => activateButton('business_strategist')}
                      variant="outline"
                      className="h-20 flex flex-col"
                    >
                      <TrendingUp className="h-6 w-6 mb-2" />
                      Análise Estratégica
                    </Button>
                    <Button 
                      onClick={() => activateButton('forum')}
                      variant="outline"
                      className="h-20 flex flex-col"
                    >
                      <Users className="h-6 w-6 mb-2" />
                      Comunidade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics e Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => activateButton('analytics')}
                      className="h-20 flex flex-col"
                    >
                      <TrendingUp className="h-6 w-6 mb-2" />
                      Dashboard Analytics
                    </Button>
                    <Button 
                      onClick={() => activateButton('reports')}
                      variant="outline"
                      className="h-20 flex flex-col"
                    >
                      <TrendingUp className="h-6 w-6 mb-2" />
                      Relatórios Automáticos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="automation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automação Inteligente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => activateButton('master_chat')}
                      className="h-20 flex flex-col"
                    >
                      <Brain className="h-6 w-6 mb-2" />
                      Master AI Chat
                    </Button>
                    <Button 
                      onClick={() => activateButton('project_analysis')}
                      variant="outline"
                      className="h-20 flex flex-col"
                    >
                      <TrendingUp className="h-6 w-6 mb-2" />
                      Análise de Projetos
                    </Button>
                    <Button 
                      onClick={() => activateButton('regulatory_assistant')}
                      variant="outline"
                      className="h-20 flex flex-col"
                    >
                      <Zap className="h-6 w-6 mb-2" />
                      Assistente Regulatório
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Marketplace;
