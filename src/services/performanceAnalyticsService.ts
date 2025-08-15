
import { supabase } from '@/integrations/supabase/client';
import { SmartCacheService } from './smartCacheService';

export interface PerformanceMetric {
  id: string;
  metric_name: string;
  value: number;
  unit: string;
  timestamp: string;
  category: 'system' | 'user' | 'business';
  trend: 'up' | 'down' | 'stable';
}

export interface SystemHealth {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_latency: number;
  active_users: number;
  error_rate: number;
  uptime: number;
}

export class PerformanceAnalyticsService {
  private static readonly CACHE_TTL = 2 * 60 * 1000; // 2 minutes

  static async getSystemHealth(): Promise<SystemHealth> {
    try {
      const cached = await SmartCacheService.get('system_health');
      if (cached) {
        return cached as SystemHealth;
      }

      // Simulate system health data
      const health: SystemHealth = {
        cpu_usage: Math.random() * 100,
        memory_usage: Math.random() * 100,
        disk_usage: Math.random() * 100,
        network_latency: Math.random() * 100 + 10,
        active_users: Math.floor(Math.random() * 1000) + 100,
        error_rate: Math.random() * 5,
        uptime: 99.9
      };

      await SmartCacheService.set('system_health', health, this.CACHE_TTL);
      return health;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }

  static async getPerformanceMetrics(category?: string): Promise<PerformanceMetric[]> {
    try {
      const cacheKey = `performance_metrics_${category || 'all'}`;
      const cached = await SmartCacheService.get(cacheKey);
      if (cached) {
        return cached as PerformanceMetric[];
      }

      // Simulate performance metrics
      const metrics: PerformanceMetric[] = [
        {
          id: '1',
          metric_name: 'Response Time',
          value: Math.random() * 200 + 50,
          unit: 'ms',
          timestamp: new Date().toISOString(),
          category: 'system',
          trend: 'stable'
        },
        {
          id: '2',
          metric_name: 'Throughput',
          value: Math.random() * 1000 + 500,
          unit: 'req/min',
          timestamp: new Date().toISOString(),
          category: 'system',
          trend: 'up'
        }
      ];

      await SmartCacheService.set(cacheKey, metrics, this.CACHE_TTL);
      return metrics;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return [];
    }
  }

  static async getHistoricalData(metricName: string, hours: number = 24): Promise<PerformanceMetric[]> {
    try {
      const cacheKey = `historical_${metricName}_${hours}h`;
      const cached = await SmartCacheService.get(cacheKey);
      if (cached) {
        return cached as PerformanceMetric[];
      }

      // Simulate historical data
      const data: PerformanceMetric[] = Array.from({ length: hours }, (_, i) => ({
        id: `hist-${i}`,
        metric_name: metricName,
        value: Math.random() * 100,
        unit: 'units',
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        category: 'system',
        trend: 'stable'
      }));

      await SmartCacheService.set(cacheKey, data, this.CACHE_TTL);
      return data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return [];
    }
  }
}

export const performanceAnalyticsService = PerformanceAnalyticsService;
