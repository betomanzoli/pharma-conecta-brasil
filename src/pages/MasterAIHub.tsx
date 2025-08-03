
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FederalLearningSystem from '@/components/ai/FederalLearningSystem';
import MasterChatbot from '@/components/ai/MasterChatbot';
import MasterAutomationOrchestrator from '@/components/ai/MasterAutomationOrchestrator';
import { 
  Brain, 
  Bot, 
  Zap, 
  Network, 
  Eye, 
  TrendingUp,
  Shield,
  Cpu,
  Globe,
  Star
} from 'lucide-react';

const MasterAIHub = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <span>Master AI Hub</span>
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Central de Inteligência Artificial Avançada - Federal Learning, Automação Master & IA Contextual
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="h-4 w-4 mr-1" />
                  Sistema Ativo
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  <Star className="h-4 w-4 mr-1" />
                  IA Master
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  <Globe className="h-4 w-4 mr-1" />
                  Federal Learning
                </Badge>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Visão Geral</span>
              </TabsTrigger>
              <TabsTrigger value="federal" className="flex items-center space-x-2">
                <Network className="h-4 w-4" />
                <span>Federal Learning</span>
              </TabsTrigger>
              <TabsTrigger value="chatbot" className="flex items-center space-x-2">
                <Bot className="h-4 w-4" />
                <span>Master Chatbot</span>
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Automação</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Analytics IA</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Overview Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Federal Learning</h3>
                        <p className="text-blue-100 text-sm">Modelos Distribuídos</p>
                      </div>
                      <Network className="h-8 w-8 text-blue-100" />
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold">847</div>
                      <div className="text-blue-100 text-sm">Participantes Ativos</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Master Chatbot</h3>
                        <p className="text-green-100 text-sm">IA Conversacional</p>
                      </div>
                      <Bot className="h-8 w-8 text-green-100" />
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold">98.7%</div>
                      <div className="text-green-100 text-sm">Precisão Contextual</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Automação</h3>
                        <p className="text-purple-100 text-sm">Workflows Inteligentes</p>
                      </div>
                      <Zap className="h-8 w-8 text-purple-100" />
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold">2.4k</div>
                      <div className="text-purple-100 text-sm">Execuções/Dia</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Analytics IA</h3>
                        <p className="text-orange-100 text-sm">Insights Preditivos</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-100" />
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold">127</div>
                      <div className="text-orange-100 text-sm">Oportunidades Detectadas</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cpu className="h-5 w-5" />
                    <span>Status do Sistema Master AI</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-green-800 mb-2">Sistema Seguro</h3>
                      <p className="text-sm text-green-600">
                        Federal Learning com preservação total de privacidade
                      </p>
                      <Badge className="bg-green-100 text-green-800 mt-2">
                        100% Privado
                      </Badge>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-blue-800 mb-2">IA Inteligente</h3>
                      <p className="text-sm text-blue-600">
                        Chatbot contextual com conhecimento especializado
                      </p>
                      <Badge className="bg-blue-100 text-blue-800 mt-2">
                        Multi-Modal
                      </Badge>
                    </div>
                    
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-purple-800 mb-2">Auto-Otimização</h3>
                      <p className="text-sm text-purple-600">
                        Automação que aprende e evolui continuamente
                      </p>
                      <Badge className="bg-purple-100 text-purple-800 mt-2">
                        Auto-Healing
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas Master AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div 
                      onClick={() => setActiveTab('federal')}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer text-center"
                    >
                      <Network className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <h4 className="font-medium">Treinar Modelo Federal</h4>
                    </div>
                    
                    <div 
                      onClick={() => setActiveTab('chatbot')}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer text-center"
                    >
                      <Bot className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-medium">Usar Chatbot Master</h4>
                    </div>
                    
                    <div 
                      onClick={() => setActiveTab('automation')}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer text-center"
                    >
                      <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <h4 className="font-medium">Criar Automação</h4>
                    </div>
                    
                    <div 
                      onClick={() => setActiveTab('analytics')}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer text-center"
                    >
                      <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <h4 className="font-medium">Ver Analytics</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="federal" className="mt-6">
              <FederalLearningSystem />
            </TabsContent>

            <TabsContent value="chatbot" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <MasterChatbot />
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Capacidades do Master Chatbot</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            <Brain className="h-3 w-3 mr-1" />
                            IA Contextual
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800">
                            <Globe className="h-3 w-3 mr-1" />
                            Multi-Fontes
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-purple-100 text-purple-800">
                            <Zap className="h-3 w-3 mr-1" />
                            Ações Automáticas
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="automation" className="mt-6">
              <MasterAutomationOrchestrator />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Avançado de IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Analytics IA em Desenvolvimento
                    </h3>
                    <p className="text-gray-500">
                      Sistema de análise preditiva avançada será implementado em breve
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MasterAIHub;
