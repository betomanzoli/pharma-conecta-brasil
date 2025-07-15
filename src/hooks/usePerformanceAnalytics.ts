import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: Record<string, any>;
}

interface NavigationTiming {
  dns: number;
  connect: number;
  request: number;
  response: number;
  domLoad: number;
  pageLoad: number;
}

interface PerformanceData {
  navigationTiming: NavigationTiming | null;
  resourceTiming: PerformanceResourceTiming[];
  vitals: {
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
  };
  customMetrics: PerformanceMetric[];
}

export const usePerformanceAnalytics = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    navigationTiming: null,
    resourceTiming: [],
    vitals: {},
    customMetrics: []
  });
  
  const observerRef = useRef<PerformanceObserver | null>(null);
  const metricsRef = useRef<PerformanceMetric[]>([]);

  // Capturar Navigation Timing
  const captureNavigationTiming = (): NavigationTiming | null => {
    if (!window.performance || !window.performance.timing) return null;
    
    const timing = window.performance.timing;
    return {
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      connect: timing.connectEnd - timing.connectStart,
      request: timing.responseStart - timing.requestStart,
      response: timing.responseEnd - timing.responseStart,
      domLoad: timing.domContentLoadedEventEnd - timing.navigationStart,
      pageLoad: timing.loadEventEnd - timing.navigationStart
    };
  };

  // Capturar Resource Timing
  const captureResourceTiming = (): PerformanceResourceTiming[] => {
    if (!window.performance || !window.performance.getEntriesByType) return [];
    
    return window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  };

  // Capturar Web Vitals
  const captureWebVitals = () => {
    // First Contentful Paint (FCP)
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              setPerformanceData(prev => ({
                ...prev,
                vitals: { ...prev.vitals, fcp: entry.startTime }
              }));
              recordMetric('web_vital_fcp', entry.startTime, 'ms');
            }
          }
        });
        
        fcpObserver.observe({ entryTypes: ['paint'] });
        
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          setPerformanceData(prev => ({
            ...prev,
            vitals: { ...prev.vitals, lcp: lastEntry.startTime }
          }));
          recordMetric('web_vital_lcp', lastEntry.startTime, 'ms');
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          setPerformanceData(prev => ({
            ...prev,
            vitals: { ...prev.vitals, cls: clsValue }
          }));
          recordMetric('web_vital_cls', clsValue, 'score');
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
        observerRef.current = clsObserver;
      } catch (error) {
        console.error('Performance Observer error:', error);
      }
    }
  };

  // Registrar métrica customizada
  const recordMetric = async (name: string, value: number, unit: string, tags?: Record<string, any>) => {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags
    };
    
    metricsRef.current.push(metric);
    
    setPerformanceData(prev => ({
      ...prev,
      customMetrics: [...prev.customMetrics, metric]
    }));

    // Enviar para Supabase
    try {
      await supabase.from('performance_metrics').insert({
        metric_name: name,
        metric_value: value,
        metric_unit: unit,
        tags: tags || {},
        measured_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error recording metric:', error);
    }
  };

  // Medir tempo de operação
  const measureOperation = async <T>(
    operation: () => Promise<T>,
    operationName: string,
    tags?: Record<string, any>
  ): Promise<T> => {
    const start = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - start;
      
      await recordMetric(`operation_${operationName}`, duration, 'ms', {
        status: 'success',
        ...tags
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      await recordMetric(`operation_${operationName}`, duration, 'ms', {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        ...tags
      });
      
      throw error;
    }
  };

  // Flush metrics para o servidor
  const flushMetrics = async () => {
    if (metricsRef.current.length === 0) return;
    
    try {
      const metrics = metricsRef.current.map(metric => ({
        metric_name: metric.name,
        metric_value: metric.value,
        metric_unit: metric.unit,
        tags: metric.tags || {},
        measured_at: new Date(metric.timestamp).toISOString()
      }));
      
      await supabase.from('performance_metrics').insert(metrics);
      metricsRef.current = [];
    } catch (error) {
      console.error('Error flushing metrics:', error);
    }
  };

  // Monitor memory usage
  const getMemoryUsage = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  };

  useEffect(() => {
    // Capturar métricas iniciais
    setTimeout(() => {
      const navTiming = captureNavigationTiming();
      const resourceTiming = captureResourceTiming();
      
      setPerformanceData(prev => ({
        ...prev,
        navigationTiming: navTiming,
        resourceTiming
      }));
      
      // Registrar métricas iniciais
      if (navTiming) {
        recordMetric('page_load_time', navTiming.pageLoad, 'ms');
        recordMetric('dom_content_loaded', navTiming.domLoad, 'ms');
        recordMetric('dns_lookup', navTiming.dns, 'ms');
      }
    }, 100);
    
    // Capturar Web Vitals
    captureWebVitals();
    
    // Flush métricas periodicamente
    const flushInterval = setInterval(flushMetrics, 30000); // 30 segundos
    
    // Monitor memory usage
    const memoryInterval = setInterval(() => {
      const memory = getMemoryUsage();
      if (memory) {
        recordMetric('memory_used_heap', memory.usedJSHeapSize, 'bytes');
      }
    }, 60000); // 1 minuto
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearInterval(flushInterval);
      clearInterval(memoryInterval);
      flushMetrics(); // Flush final
    };
  }, []);

  return {
    performanceData,
    recordMetric,
    measureOperation,
    flushMetrics,
    getMemoryUsage
  };
};