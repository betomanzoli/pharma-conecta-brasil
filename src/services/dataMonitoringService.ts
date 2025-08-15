
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
  timestamp: string;
  anomalies: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
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

  static async getHealthMetrics(): Promise<DataHealthMetric[]> {
    try {
      const cached = await SmartCacheService.get<DataHealthMetric[]>('health_metrics');
      if (cached) {
        return cached;
      }

      // Simulate data health metrics since we don't have the actual table
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

  static async getQualityScores(): Promise<DataQualityScore[]> {
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

  static async getAlerts(): Promise<MonitoringAlert[]> {
    try {
      const { data, error } = await supabase
        .from('system_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const alerts: MonitoringAlert[] = (data || []).map((item: any) => ({
        id: item.id,
        type: item.notification_type as MonitoringAlert['type'],
        severity: item.priority as MonitoringAlert['severity'],
        source: item.title || 'System',
        message: item.message || '',
        details: item.metadata || {},
        triggered_at: item.created_at,
        resolved_at: item.read_at,
        auto_resolved: !!item.read_at
      }));

      return alerts;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }

  static async createAlert(alert: Omit<MonitoringAlert, 'id' | 'triggered_at'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_notifications')
        .insert({
          notification_type: alert.type,
          priority: alert.severity,
          title: alert.source,
          message: alert.message,
          metadata: alert.details
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  }

  static async getTrendData(source: string, metric: string): Promise<DataTrend[]> {
    try {
      // Simulate trend data
      const trendData: DataTrend[] = Array.from({ length: 24 }, (_, i) => ({
        id: `trend-${i}`,
        source,
        metric,
        value: Math.random() * 100,
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
        anomalies: Math.random() > 0.8 ? [{
          type: 'spike',
          severity: 'medium' as const,
          description: 'Unusual spike detected'
        }] : []
      }));

      return trendData;
    } catch (error) {
      console.error('Error fetching trend data:', error);
      return [];
    }
  }
}
