
interface PerformanceConfig {
  enableCodeSplitting: boolean;
  enableServiceWorker: boolean;
  enableBundleOptimization: boolean;
  cacheStrategy: 'aggressive' | 'conservative' | 'hybrid';
}

class PerformanceOptimizer {
  private config: PerformanceConfig;
  private metrics: Map<string, number> = new Map();

  constructor(config: PerformanceConfig) {
    this.config = config;
    this.initializeOptimizations();
  }

  private initializeOptimizations() {
    if (this.config.enableServiceWorker) {
      this.registerServiceWorker();
    }
    
    if (this.config.enableBundleOptimization) {
      this.optimizeBundles();
    }
    
    this.setupResourceHints();
    this.optimizeMemoryUsage();
  }

  private registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
          this.recordMetric('sw_registration', 1);
        })
        .catch(error => {
          console.error('SW registration failed:', error);
          this.recordMetric('sw_registration_failed', 1);
        });
    }
  }

  private optimizeBundles() {
    // Implementar tree shaking e code splitting
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          this.recordMetric(`bundle_${resourceEntry.name}`, resourceEntry.transferSize);
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }

  private setupResourceHints() {
    // Preload critical resources
    const criticalResources = [
      '/api/user/profile',
      '/api/dashboard/summary'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  private optimizeMemoryUsage() {
    // Monitor memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.recordMetric('memory_used', memory.usedJSHeapSize);
      this.recordMetric('memory_total', memory.totalJSHeapSize);
      
      // Cleanup when memory usage is high
      if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
        this.performMemoryCleanup();
      }
    }
  }

  private performMemoryCleanup() {
    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
    
    // Clear caches if memory is critical
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('old-') || name.includes('temp-')) {
            caches.delete(name);
          }
        });
      });
    }
  }

  recordMetric(name: string, value: number) {
    this.metrics.set(name, value);
    
    // Send to monitoring system
    if (typeof window !== 'undefined' && 'fetch' in window) {
      fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: name,
          value,
          timestamp: Date.now()
        })
      }).catch(() => {}); // Silent fail for metrics
    }
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  async measurePageLoad(): Promise<{
    fcp: number;
    lcp: number;
    cls: number;
    fid: number;
    ttfb: number;
  }> {
    return new Promise((resolve) => {
      const metrics = {
        fcp: 0,
        lcp: 0,
        cls: 0,
        fid: 0,
        ttfb: 0
      };

      // First Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime;
          }
        }
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        metrics.lcp = entries[entries.length - 1].startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metrics.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });

      // Time to First Byte
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      }

      setTimeout(() => resolve(metrics), 3000);
    });
  }
}

export const performanceOptimizer = new PerformanceOptimizer({
  enableCodeSplitting: true,
  enableServiceWorker: true,
  enableBundleOptimization: true,
  cacheStrategy: 'hybrid'
});
