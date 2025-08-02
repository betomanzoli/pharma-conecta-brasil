
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Zap,
  TrendingUp,
  Clock,
  Download,
  Activity,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  Gauge
} from 'lucide-react';

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  score: number;
}

interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  status: 'pending' | 'applied' | 'ignored';
}

const PerformanceOptimizer = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
    ttfb: 0,
    score: 0
  });
  
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    measurePerformance();
    generateRecommendations();
  }, []);

  const measurePerformance = () => {
    // Use the Performance Observer API correctly
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('Performance entry:', entry);
      });
    });

    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    } catch (e) {
      console.log('Performance observer not supported');
    }

    // Get basic navigation timing
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigationEntry) {
      const loadTime = navigationEntry.loadEventEnd - navigationEntry.loadEventStart;
      const domContentLoaded = navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart;
      
      setMetrics({
        lcp: Math.random() * 2500 + 1000, // Simulated LCP
        fid: Math.random() * 100 + 10,     // Simulated FID
        cls: Math.random() * 0.25,         // Simulated CLS
        fcp: Math.random() * 1800 + 800,   // Simulated FCP
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
        score: 85 + Math.random() * 15     // Simulated score
      });
    }
  };

  const generateRecommendations = () => {
    const mockRecommendations: OptimizationRecommendation[] = [
      {
        id: '1',
        title: 'Otimizar Imagens',
        description: 'Comprimir e converter imagens para WebP para reduzir tempo de carregamento',
        impact: 'high',
        status: 'pending'
      },
      {
        id: '2',
        title: 'Implementar Code Splitting',
        description: 'Dividir o bundle JavaScript para carregamento sob demanda',
        impact: 'high',
        status: 'pending'
      },
      {
        id: '3',
        title: 'Configurar Cache HTTP',
        description: 'Implementar estratégias de cache para recursos estáticos',
        impact: 'medium',
        status: 'applied'
      },
      {
        id: '4',
        title: 'Prefetch de Recursos',
        description: 'Pré-carregar recursos críticos para melhor performance',
        impact: 'medium',
        status: 'pending'
      }
    ];

    setRecommendations(mockRecommendations);
  };

  const applyOptimization = async (id: string) => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, status: 'applied' } : rec
      )
    );
    
    // Re-measure performance
    measurePerformance();
    setIsOptimizing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Gauge className={`h-4 w-4 ${getScoreColor(metrics.score)}`} />
              <span className={`text-2xl font-bold ${getScoreColor(metrics.score)}`}>
                {Math.round(metrics.score)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">LCP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold">
                {(metrics.lcp / 1000).toFixed(1)}s
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">FID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span className="text-2xl font-bold">
                {Math.round(metrics.fid)}ms
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CLS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-2xl font-bold">
                {metrics.cls.toFixed(3)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
          <TabsTrigger value="metrics">Métricas Detalhadas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Otimizações Recomendadas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{rec.title}</h3>
                      <Badge variant={getImpactColor(rec.impact)}>
                        {rec.impact}
                      </Badge>
                      {rec.status === 'applied' && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                  <div className="ml-4">
                    {rec.status === 'pending' ? (
                      <Button
                        onClick={() => applyOptimization(rec.id)}
                        disabled={isOptimizing}
                        size="sm"
                      >
                        {isOptimizing ? 'Aplicando...' : 'Aplicar'}
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Aplicado
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Largest Contentful Paint (LCP)</span>
                  <span>{(metrics.lcp / 1000).toFixed(1)}s</span>
                </div>
                <Progress value={Math.max(0, 100 - (metrics.lcp / 25))} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>First Input Delay (FID)</span>
                  <span>{Math.round(metrics.fid)}ms</span>
                </div>
                <Progress value={Math.max(0, 100 - metrics.fid)} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Cumulative Layout Shift (CLS)</span>
                  <span>{metrics.cls.toFixed(3)}</span>
                </div>
                <Progress value={Math.max(0, 100 - (metrics.cls * 400))} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Histórico de métricas de performance ao longo do tempo será exibido aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center">
        <Button onClick={measurePerformance} variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          Remedir Performance
        </Button>
        
        <Button onClick={() => window.location.reload()}>
          <Settings className="h-4 w-4 mr-2" />
          Aplicar Todas as Otimizações
        </Button>
      </div>
    </div>
  );
};

export default PerformanceOptimizer;
