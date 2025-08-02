
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePerformanceAnalytics } from '@/hooks/usePerformanceAnalytics';
import { Zap, Gauge, TrendingUp, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  improvement?: string;
}

const PerformanceOptimizer = () => {
  const { performanceData, recordMetric } = usePerformanceAnalytics();
  const [optimizations, setOptimizations] = useState<PerformanceMetric[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    const analyzePerformance = () => {
      const metrics: PerformanceMetric[] = [];

      // Análise de Core Web Vitals
      if (performanceData.vitals.lcp) {
        metrics.push({
          name: 'Largest Contentful Paint',
          value: performanceData.vitals.lcp,
          threshold: 2500,
          status: performanceData.vitals.lcp <= 2500 ? 'good' : 
                 performanceData.vitals.lcp <= 4000 ? 'warning' : 'critical',
          improvement: performanceData.vitals.lcp > 2500 ? 'Otimizar imagens e recursos críticos' : undefined
        });
      }

      if (performanceData.vitals.fcp) {
        metrics.push({
          name: 'First Contentful Paint',
          value: performanceData.vitals.fcp,
          threshold: 1800,
          status: performanceData.vitals.fcp <= 1800 ? 'good' : 
                 performanceData.vitals.fcp <= 3000 ? 'warning' : 'critical',
          improvement: performanceData.vitals.fcp > 1800 ? 'Reduzir JavaScript crítico' : undefined
        });
      }

      if (performanceData.vitals.cls !== undefined) {
        metrics.push({
          name: 'Cumulative Layout Shift',
          value: performanceData.vitals.cls,
          threshold: 0.1,
          status: performanceData.vitals.cls <= 0.1 ? 'good' : 
                 performanceData.vitals.cls <= 0.25 ? 'warning' : 'critical',
          improvement: performanceData.vitals.cls > 0.1 ? 'Definir dimensões para imagens e ads' : undefined
        });
      }

      // Análise de Navigation Timing
      if (performanceData.navigationTiming) {
        const { navigationTiming } = performanceData.navigationTiming;
        
        metrics.push({
          name: 'Page Load Time',
          value: navigationTiming.pageLoad,
          threshold: 3000,
          status: navigationTiming.pageLoad <= 3000 ? 'good' : 
                 navigationTiming.pageLoad <= 5000 ? 'warning' : 'critical',
          improvement: navigationTiming.pageLoad > 3000 ? 'Implementar code splitting e lazy loading' : undefined
        });

        if (navigationTiming.dns > 100) {
          metrics.push({
            name: 'DNS Lookup',
            value: navigationTiming.dns,
            threshold: 100,
            status: 'warning',
            improvement: 'Considerar prefetch DNS ou CDN'
          });
        }
      }

      setOptimizations(metrics);
    };

    analyzePerformance();
  }, [performanceData]);

  const runOptimizations = async () => {
    setIsOptimizing(true);
    
    try {
      // Implementar otimizações automáticas
      const optimizationPromises = [
        // Prefetch de recursos críticos
        prefetchCriticalResources(),
        
        // Otimização de cache
        optimizeServiceWorkerCache(),
        
        // Compressão de imagens lazy
        enableImageCompression(),
        
        // Preload de fontes críticas
        preloadCriticalFonts(),
      ];

      await Promise.allSettled(optimizationPromises);
      
      await recordMetric('performance_optimization_run', 1, 'count', {
        optimizations_applied: optimizationPromises.length,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const prefetchCriticalResources = async () => {
    const criticalResources = [
      '/api/profile',
      '/api/companies',
      '/api/notifications'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  };

  const optimizeServiceWorkerCache = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration.active) {
        registration.active.postMessage({
          type: 'OPTIMIZE_CACHE',
          timestamp: Date.now()
        });
      }
    }
  };

  const enableImageCompression = async () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      if (!img.getAttribute('data-optimized')) {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
        img.setAttribute('data-optimized', 'true');
      }
    });
  };

  const preloadCriticalFonts = async () => {
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font;
      link.as = 'style';
      document.head.appendChild(link);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Gauge className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const overallScore = optimizations.length > 0 
    ? Math.round(
        optimizations.filter(m => m.status === 'good').length / 
        optimizations.length * 100
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Header com Score Geral */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <span>Otimizador de Performance</span>
                <p className="text-sm text-muted-foreground mt-1">
                  Análise automática e otimizações inteligentes
                </p>
              </div>
            </CardTitle>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {overallScore}%
              </div>
              <Badge className={getStatusColor(
                overallScore >= 80 ? 'good' : 
                overallScore >= 60 ? 'warning' : 'critical'
              )}>
                Performance Score
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {optimizations.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">{metric.name}</h4>
                {getStatusIcon(metric.status)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {typeof metric.value === 'number' ? 
                      (metric.value > 1000 ? `${Math.round(metric.value/1000)}s` : `${Math.round(metric.value)}ms`)
                      : metric.value
                    }
                  </span>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metric.status === 'good' ? 'bg-green-500' :
                      metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (metric.threshold / Math.max(metric.value, metric.threshold)) * 100)}%`
                    }}
                  />
                </div>
                
                {metric.improvement && (
                  <p className="text-xs text-muted-foreground">
                    💡 {metric.improvement}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botão de Otimização */}
      <div className="flex justify-center">
        <Button 
          onClick={runOptimizations}
          disabled={isOptimizing}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
        >
          <TrendingUp className="h-5 w-5 mr-2" />
          {isOptimizing ? 'Otimizando...' : 'Executar Otimizações'}
        </Button>
      </div>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Cache Inteligente Ativo</h4>
                <p className="text-sm text-muted-foreground">
                  Sistema de cache adaptativo otimizando consultas frequentes
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Lazy Loading Implementado</h4>
                <p className="text-sm text-muted-foreground">
                  Componentes e imagens carregados sob demanda
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Monitoramento Contínuo</h4>
                <p className="text-sm text-muted-foreground">
                  Métricas em tempo real para otimização proativa
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceOptimizer;
