
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import PerformanceOptimizer from '@/components/optimization/PerformanceOptimizer';
import SmartCacheManager from '@/components/optimization/SmartCacheManager';
import { Settings, Zap, Database, TrendingUp } from 'lucide-react';

const OptimizationPage = () => {
  const [activeTab, setActiveTab] = useState('performance');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Centro de Otimização
                </h1>
                <p className="text-gray-600">
                  Performance, cache e otimizações inteligentes da plataforma
                </p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Performance</span>
              </TabsTrigger>
              <TabsTrigger value="cache" className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Cache Manager</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Métricas</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="mt-6">
              <PerformanceOptimizer />
            </TabsContent>

            <TabsContent value="cache" className="mt-6">
              <SmartCacheManager />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Otimizações Ativas</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Cache Inteligente</span>
                      <span className="text-green-600">✓ Ativo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lazy Loading</span>
                      <span className="text-green-600">✓ Ativo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Code Splitting</span>
                      <span className="text-green-600">✓ Ativo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Worker</span>
                      <span className="text-green-600">✓ Ativo</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Performance Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>First Paint</span>
                      <span className="text-blue-600">1.2s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time to Interactive</span>
                      <span className="text-blue-600">2.1s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bundle Size</span>
                      <span className="text-purple-600">247KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache Hit Rate</span>
                      <span className="text-green-600">94%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Próximas Otimizações</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>HTTP/3 Support</span>
                      <span className="text-orange-600">Planejado</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Edge Caching</span>
                      <span className="text-orange-600">Em Desenvolvimento</span>
                    </div>
                    <div className="flex justify-between">
                      <span>WebP Images</span>
                      <span className="text-green-600">✓ Implementado</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pre-loading</span>
                      <span className="text-green-600">✓ Ativo</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OptimizationPage;
