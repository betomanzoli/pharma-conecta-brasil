
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsDashboard from './AnalyticsDashboard';
import RealValueMetrics from './RealValueMetrics';
import PredictiveAnalytics from './PredictiveAnalytics';
import PerformanceDashboard from './PerformanceDashboard';
import { BarChart3, TrendingUp, Target, Brain, Activity } from 'lucide-react';

const EnhancedAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Avançado</h1>
        <p className="text-muted-foreground">Análises inteligentes e métricas de valor real</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="value" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Valor Real</span>
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Preditivo</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Tendências</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="value" className="space-y-6">
          <RealValueMetrics />
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <PredictiveAnalytics />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceDashboard />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RealValueMetrics />
            <PredictiveAnalytics />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
