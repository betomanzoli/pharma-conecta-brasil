import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, Target, Zap, Users, TrendingUp, Settings, TestTube, Lightbulb, Rocket } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OptimizationConfig {
  ab_testing_enabled: boolean;
  personalized_recommendations: boolean;
  auto_learning: boolean;
  predictive_analytics: boolean;
  real_time_adjustments: boolean;
  advanced_filtering: boolean;
}

interface ABTestResult {
  test_id: string;
  test_name: string;
  variant_a: { name: string; conversion: number; sample_size: number };
  variant_b: { name: string; conversion: number; sample_size: number };
  confidence: number;
  status: 'running' | 'completed' | 'paused';
  winner?: 'A' | 'B' | 'inconclusive';
}

export default function FinalOptimizations() {
  const [config, setConfig] = useState<OptimizationConfig>({
    ab_testing_enabled: true,
    personalized_recommendations: true,
    auto_learning: false,
    predictive_analytics: true,
    real_time_adjustments: false,
    advanced_filtering: true
  });

  const [abTests, setAbTests] = useState<ABTestResult[]>([]);
  const [optimizationMetrics, setOptimizationMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [personalizedEnabled, setPersonalizedEnabled] = useState(false);

  useEffect(() => {
    loadOptimizationData();
  }, []);

  const loadOptimizationData = async () => {
    try {
      setLoading(true);

      // Load A/B test results
      const mockABTests: ABTestResult[] = [
        {
          test_id: 'test_001',
          test_name: 'Match Algorithm v2.1 vs v2.0',
          variant_a: { name: 'Current Algorithm', conversion: 67.3, sample_size: 1234 },
          variant_b: { name: 'Enhanced Algorithm', conversion: 72.8, sample_size: 1198 },
          confidence: 95.2,
          status: 'completed',
          winner: 'B'
        },
        {
          test_id: 'test_002',
          test_name: 'Personalized vs Standard Recommendations',
          variant_a: { name: 'Standard', conversion: 58.1, sample_size: 892 },
          variant_b: { name: 'Personalized', conversion: 64.7, sample_size: 876 },
          confidence: 87.3,
          status: 'running'
        },
        {
          test_id: 'test_003',
          test_name: 'Real-time vs Batch Processing',
          variant_a: { name: 'Batch', conversion: 61.2, sample_size: 756 },
          variant_b: { name: 'Real-time', conversion: 59.8, sample_size: 743 },
          confidence: 45.1,
          status: 'running'
        }
      ];

      // Load optimization metrics
      const mockMetrics = [
        { date: '2024-01-01', accuracy: 68.2, engagement: 45.3, satisfaction: 72.1 },
        { date: '2024-01-15', accuracy: 71.5, engagement: 49.7, satisfaction: 75.8 },
        { date: '2024-02-01', accuracy: 74.1, engagement: 52.4, satisfaction: 78.2 },
        { date: '2024-02-15', accuracy: 76.8, engagement: 55.1, satisfaction: 80.7 },
        { date: '2024-03-01', accuracy: 78.9, engagement: 57.3, satisfaction: 82.4 },
        { date: '2024-03-15', accuracy: 81.2, engagement: 59.8, satisfaction: 84.1 }
      ];

      setAbTests(mockABTests);
      setOptimizationMetrics(mockMetrics);

    } catch (error) {
      console.error('Error loading optimization data:', error);
      toast.error('Failed to load optimization data');
    } finally {
      setLoading(false);
    }
  };

  const toggleOptimization = async (key: keyof OptimizationConfig) => {
    const newConfig = { ...config, [key]: !config[key] };
    setConfig(newConfig);

    try {
      // In production, this would save to backend
      await supabase.functions.invoke('save-optimization-config', {
        body: { config: newConfig }
      });

      toast.success(`${key.replace('_', ' ')} ${newConfig[key] ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating optimization config:', error);
      toast.error('Failed to update configuration');
    }
  };

  const startABTest = async (testName: string, variantA: string, variantB: string) => {
    try {
      const response = await supabase.functions.invoke('start-ab-test', {
        body: { testName, variantA, variantB }
      });

      if (response.error) throw response.error;

      toast.success('A/B test started successfully');
      loadOptimizationData();
    } catch (error) {
      console.error('Error starting A/B test:', error);
      toast.error('Failed to start A/B test');
    }
  };

  const enablePersonalizedRecommendations = async () => {
    try {
      setPersonalizedEnabled(true);
      
      const response = await supabase.functions.invoke('enable-personalized-recommendations', {
        body: { enabled: true }
      });

      if (response.error) throw response.error;

      toast.success('Personalized recommendations enabled');
    } catch (error) {
      console.error('Error enabling personalized recommendations:', error);
      toast.error('Failed to enable personalized recommendations');
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWinnerBadge = (test: ABTestResult) => {
    if (test.status !== 'completed' || !test.winner) return null;
    
    const winnerVariant = test.winner === 'A' ? test.variant_a : test.variant_b;
    return (
      <Badge variant="outline" className="text-green-600">
        Winner: {winnerVariant.name}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Otimizações Finais do AI Matching</h2>
          <p className="text-muted-foreground">
            Testes A/B, recomendações personalizadas e otimizações avançadas
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <Rocket className="h-4 w-4 mr-2" />
          Sistema Totalmente Otimizado
        </Badge>
      </div>

      {/* Optimization Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Otimização
          </CardTitle>
          <CardDescription>
            Configure as funcionalidades avançadas do sistema de matching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(config).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium capitalize">
                    {key.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {getOptimizationDescription(key)}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={() => toggleOptimization(key as keyof OptimizationConfig)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ab-testing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
          <TabsTrigger value="personalized">Personalizações</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Avançado</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="ab-testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Testes A/B Ativos
              </CardTitle>
              <CardDescription>
                Experimentos em andamento para otimizar o algoritmo de matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {abTests.map((test) => (
                  <div key={test.test_id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium">{test.test_name}</h4>
                        <p className="text-sm text-muted-foreground">Test ID: {test.test_id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getTestStatusColor(test.status)}>
                          {test.status}
                        </Badge>
                        {getWinnerBadge(test)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Variant A: {test.variant_a.name}</h5>
                        <div className="flex justify-between">
                          <span className="text-sm">Conversion:</span>
                          <span className="font-medium">{test.variant_a.conversion}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Sample Size:</span>
                          <span className="font-medium">{test.variant_a.sample_size.toLocaleString()}</span>
                        </div>
                        <Progress value={test.variant_a.conversion} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Variant B: {test.variant_b.name}</h5>
                        <div className="flex justify-between">
                          <span className="text-sm">Conversion:</span>
                          <span className="font-medium">{test.variant_b.conversion}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Sample Size:</span>
                          <span className="font-medium">{test.variant_b.sample_size.toLocaleString()}</span>
                        </div>
                        <Progress value={test.variant_b.conversion} className="h-2" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        Statistical Confidence: <span className="font-medium">{test.confidence}%</span>
                      </span>
                      {test.status === 'running' && (
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button onClick={() => startABTest('New Algorithm Test', 'Current', 'Enhanced')}>
                  <TestTube className="h-4 w-4 mr-2" />
                  Start New A/B Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalized" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Recomendações Personalizadas
              </CardTitle>
              <CardDescription>
                Sistema de recomendações adaptado para cada usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Machine Learning Personalizado</h4>
                    <p className="text-sm text-muted-foreground">
                      Algoritmo que aprende com as preferências individuais de cada usuário
                    </p>
                  </div>
                  <Button 
                    onClick={enablePersonalizedRecommendations}
                    disabled={personalizedEnabled}
                  >
                    {personalizedEnabled ? 'Enabled' : 'Enable'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Fatores de Personalização</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Histórico de Matches:</span>
                        <Badge variant="secondary">85%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Preferências Explícitas:</span>
                        <Badge variant="secondary">92%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Comportamento de Navegação:</span>
                        <Badge variant="secondary">78%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Feedback Implícito:</span>
                        <Badge variant="secondary">71%</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Métricas de Personalização</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={optimizationMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="engagement" stroke="#3B82F6" name="Engagement" />
                        <Line type="monotone" dataKey="satisfaction" stroke="#10B981" name="Satisfaction" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analytics Avançado e Previsões
              </CardTitle>
              <CardDescription>
                Análise preditiva e insights de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Brain className="h-12 w-12 mx-auto text-blue-600 mb-2" />
                    <h4 className="font-medium">Precisão do Algoritmo</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {optimizationMetrics[optimizationMetrics.length - 1]?.accuracy.toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">+12.8% este mês</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto text-green-600 mb-2" />
                    <h4 className="font-medium">Engajamento do Usuário</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {optimizationMetrics[optimizationMetrics.length - 1]?.engagement.toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">+8.3% este mês</p>
                  </div>
                  <div className="text-center">
                    <Target className="h-12 w-12 mx-auto text-purple-600 mb-2" />
                    <h4 className="font-medium">Satisfação dos Usuários</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {optimizationMetrics[optimizationMetrics.length - 1]?.satisfaction.toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">+6.7% este mês</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Evolução das Métricas</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={optimizationMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="accuracy" stroke="#3B82F6" name="Accuracy" strokeWidth={2} />
                      <Line type="monotone" dataKey="engagement" stroke="#10B981" name="Engagement" strokeWidth={2} />
                      <Line type="monotone" dataKey="satisfaction" stroke="#8B5CF6" name="Satisfaction" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Integrações Regulatórias Completas
              </CardTitle>
              <CardDescription>
                Status das integrações com órgãos regulatórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">APIs Integradas</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'ANVISA API', status: 'active', accuracy: 98.5 },
                      { name: 'FDA API', status: 'active', accuracy: 96.2 },
                      { name: 'EMA Guidelines', status: 'active', accuracy: 94.8 },
                      { name: 'WHO Guidelines', status: 'active', accuracy: 92.1 },
                      { name: 'PIC/S Standards', status: 'active', accuracy: 89.7 }
                    ].map((api) => (
                      <div key={api.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{api.name}</span>
                          <p className="text-sm text-muted-foreground">Accuracy: {api.accuracy}%</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {api.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Real-time Monitoring</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Regulatory Updates:</span>
                      <Badge variant="secondary">24h monitoring</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Compliance Checks:</span>
                      <Badge variant="secondary">Real-time</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Alert System:</span>
                      <Badge variant="secondary">Proactive</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Synchronization:</span>
                      <Badge variant="secondary">Every 15min</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getOptimizationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    ab_testing_enabled: 'Testes A/B para otimização contínua',
    personalized_recommendations: 'Recomendações adaptadas por usuário',
    auto_learning: 'Aprendizado automático com feedback',
    predictive_analytics: 'Análise preditiva de comportamento',
    real_time_adjustments: 'Ajustes em tempo real do algoritmo',
    advanced_filtering: 'Filtros avançados por compliance'
  };
  return descriptions[key] || 'Feature description';
}