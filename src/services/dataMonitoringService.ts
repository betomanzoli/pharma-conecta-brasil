
import { supabase } from '@/integrations/supabase/client';
import { SmartCacheService } from './smartCacheService';

export interface DataHealthMetric {
  id: string;
  source: string;
  metric_name: string;
  current_value: number;
  trend: 'up' | 'down' | 'stable';
  threshold: number;
  status: 'healthy' | 'warning' | 'critical';
  last_updated: string;
}

export interface DataQualityScore {
  id: string;
  source: string;
  overall_score: number;
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  issues: string[];
  last_calculated: string;
}

export interface DataTrend {
  id: string;
  source: string;
  metric: string;
  value: number;
  values?: number[];
  timestamp: string;
  anomalies: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    timestamp?: string;
  }>;
}

export interface MonitoringAlert {
  id: string;
  type: 'data_quality' | 'performance' | 'security' | 'system_health';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  message: string;
  details: Record<string, any>;
  triggered_at: string;
  resolved_at?: string;
  auto_resolved: boolean;
}

export class DataMonitoringService {
  private static readonly CACHE_TTL = 2 * 60 * 1000; // 2 minutes
  private static alertCallback?: (alert: MonitoringAlert) => void;
  private static monitoringInterval?: NodeJS.Timeout;

  static async getDataHealthMetrics(): Promise<DataHealthMetric[]> {
    try {
      const cached = await SmartCacheService.get<DataHealthMetric[]>('health_metrics');
      if (cached) {
        return cached;
      }

      // Simulate data health metrics
      const mockMetrics: DataHealthMetric[] = [
        {
          id: '1',
          source: 'knowledge_base',
          metric_name: 'Document Freshness',
          current_value: 85,
          trend: 'up',
          threshold: 80,
          status: 'healthy',
          last_updated: new Date().toISOString()
        },
        {
          id: '2',
          source: 'matching_system',
          metric_name: 'Match Accuracy',
          current_value: 72,
          trend: 'down',
          threshold: 75,
          status: 'warning',
          last_updated: new Date().toISOString()
        }
      ];

      await SmartCacheService.set('health_metrics', mockMetrics, this.CACHE_TTL);
      return mockMetrics;
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      return [];
    }
  }

  static async assessDataQuality(sources?: string[]): Promise<DataQualityScore[]> {
    try {
      const cached = await SmartCacheService.get<DataQualityScore[]>('quality_scores');
      if (cached) {
        return cached;
      }

      // Simulate data quality scores
      const mockScores: DataQualityScore[] = [
        {
          id: '1',
          source: 'knowledge_base',
          overall_score: 88,
          completeness: 92,
          accuracy: 85,
          consistency: 90,
          timeliness: 85,
          issues: ['Some outdated documents', 'Missing metadata in 5% of entries'],
          last_calculated: new Date().toISOString()
        }
      ];

      await SmartCacheService.set('quality_scores', mockScores, this.CACHE_TTL);
      return mockScores;
    } catch (error) {
      console.error('Error fetching quality scores:', error);
      return [];
    }
  }

  static async getActiveAlerts(): Promise<MonitoringAlert[]> {
    try {
      // Simulate alerts data since we can't access system_notifications table
      const mockAlerts: MonitoringAlert[] = [
        {
          id: '1',
          type: 'data_quality',
          severity: 'medium',
          source: 'knowledge_base',
          message: 'Data quality score below threshold',
          details: { score: 72, threshold: 75 },
          triggered_at: new Date().toISOString(),
          auto_resolved: false
        }
      ];

      return mockAlerts;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }

  static async analyzeTrends(source: string, timeframe: string): Promise<DataTrend[]> {
    try {
      // Simulate trend data
      const trendData: DataTrend[] = Array.from({ length: 24 }, (_, i) => ({
        id: `trend-${i}`,
        source,
        metric: 'performance',
        value: Math.random() * 100,
        values: [Math.random() * 100],
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
        anomalies: Math.random() > 0.8 ? [{
          type: 'spike',
          severity: 'medium' as const,
          description: 'Unusual spike detected',
          timestamp: new Date().toISOString()
        }] : []
      }));

      return trendData;
    } catch (error) {
      console.error('Error fetching trend data:', error);
      return [];
    }
  }

  static onAlert(callback: (alert: MonitoringAlert) => void): void {
    this.alertCallback = callback;
  }

  static startMonitoring(interval: number): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      // Simulate monitoring checks
      if (this.alertCallback && Math.random() > 0.9) {
        const alert: MonitoringAlert = {
          id: `alert-${Date.now()}`,
          type: 'system_health',
          severity: 'medium',
          source: 'monitoring_system',
          message: 'System performance degradation detected',
          details: { cpu: 85, memory: 78 },
          triggered_at: new Date().toISOString(),
          auto_resolved: false
        };
        this.alertCallback(alert);
      }
    }, interval);
  }

  static stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
  }
}
