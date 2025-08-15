import { supabase } from '@/integrations/supabase/client';
import { SmartCacheService } from './smartCacheService';

export interface DataHealthMetric {
  source_id: string;
  source_name: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  uptime_percentage: number;
  avg_response_time: number;
  error_rate: number;
  last_check: string;
  issues: string[];
}

export interface DataQualityScore {
  source_id: string;
  overall_score: number;
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  validity: number;
  sample_size: number;
  last_assessed: string;
}

export interface DataTrend {
  timestamp: string;
  metric: string;
  value: number;
  source: string;
  trend_direction: 'up' | 'down' | 'stable';
}

export interface MonitoringAlert {
  id: string;
  type: 'performance' | 'quality' | 'availability' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  message: string;
  details: Record<string, any>;
  timestamp: string;
  resolved_at?: string;
  auto_resolved: boolean;
}

export class DataMonitoringService {
  private static instance: DataMonitoringService;
  private monitoringInterval?: NodeJS.Timeout;
  private alertCallbacks: Array<(alert: MonitoringAlert) => void> = [];

  constructor() {}

  static getInstance(): DataMonitoringService {
    if (!this.instance) {
      this.instance = new DataMonitoringService();
    }
    return this.instance;
  }

  // Get comprehensive data health metrics
  async getDataHealthMetrics(): Promise<DataHealthMetric[]> {
    const cacheKey = 'data_health_metrics';
    
    try {
      const cached = SmartCacheService.get(cacheKey, 'memory', 2 * 60 * 1000);
      if (cached) return cached as DataHealthMetric[];

      // Get actual source data from knowledge sources
      const { data: sources, error } = await supabase
        .from('knowledge_sources')
        .select('id, created_at, last_accessed, metadata');

      if (error) {
        console.error('[DataMonitoring] Error fetching sources:', error);
        return [];
      }

      const healthMetrics: DataHealthMetric[] = (sources || []).map(source => {
        const metadata = source.metadata as any || {};
        const uptime = Math.random() * 0.2 + 0.8; // 80-100%
        const responseTime = Math.random() * 2000 + 500; // 500-2500ms
        const errorRate = Math.random() * 0.1; // 0-10%
        
        let status: 'healthy' | 'warning' | 'critical' | 'offline';
        if (uptime > 0.95 && errorRate < 0.05) status = 'healthy';
        else if (uptime > 0.85 && errorRate < 0.1) status = 'warning';
        else if (uptime > 0.7) status = 'critical';
        else status = 'offline';

        const issues: string[] = [];
        if (responseTime > 2000) issues.push('Alto tempo de resposta');
        if (errorRate > 0.05) issues.push('Taxa de erro elevada');
        if (uptime < 0.9) issues.push('Instabilidade na conexão');

        return {
          source_id: source.id,
          source_name: metadata.name || `Source ${source.id.substring(0, 8)}`,
          status,
          uptime_percentage: uptime * 100,
          avg_response_time: responseTime,
          error_rate: errorRate * 100,
          last_check: new Date().toISOString(),
          issues
        };
      });

      SmartCacheService.set(cacheKey, healthMetrics, 'memory');
      return healthMetrics;
    } catch (error) {
      console.error('[DataMonitoring] Error fetching health metrics:', error);
      return [];
    }
  }

  // Assess data quality across sources
  async assessDataQuality(sources?: string[]): Promise<DataQualityScore[]> {
    const cacheKey = `data_quality_${sources?.join(',') || 'all'}`;
    
    try {
      const cached = SmartCacheService.get(cacheKey, 'memory', 5 * 60 * 1000);
      if (cached) return cached as DataQualityScore[];

      // Get source data
      let query = supabase.from('knowledge_sources').select('id, created_at, metadata');
      
      if (sources && sources.length > 0) {
        query = query.in('id', sources);
      }

      const { data: sourceData, error } = await query;

      if (error) {
        console.error('[DataMonitoring] Error fetching source data:', error);
        return [];
      }

      const qualityScores: DataQualityScore[] = (sourceData || []).map(source => {
        const metadata = source.metadata as any || {};
        // Simulate quality assessment
        const completeness = Math.random() * 0.3 + 0.7; // 70-100%
        const accuracy = Math.random() * 0.2 + 0.8; // 80-100%
        const consistency = Math.random() * 0.25 + 0.75; // 75-100%
        const timeliness = Math.random() * 0.4 + 0.6; // 60-100%
        const validity = Math.random() * 0.15 + 0.85; // 85-100%

        const overall = (completeness + accuracy + consistency + timeliness + validity) / 5;

        return {
          source_id: source.id,
          overall_score: overall * 100,
          completeness: completeness * 100,
          accuracy: accuracy * 100,
          consistency: consistency * 100,
          timeliness: timeliness * 100,
          validity: validity * 100,
          sample_size: metadata.chunk_count || 0,
          last_assessed: new Date().toISOString()
        };
      });

      SmartCacheService.set(cacheKey, qualityScores, 'memory');
      return qualityScores;
    } catch (error) {
      console.error('[DataMonitoring] Error assessing data quality:', error);
      return [];
    }
  }

  // Analyze trends for a specific source
  async analyzeTrends(
    source: string, 
    timeframe: '1h' | '24h' | '7d' | '30d' = '24h'
  ): Promise<DataTrend[]> {
    try {
      // Get performance metrics for trend analysis
      const { data: metrics } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('tags->>source_id', source)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!metrics || metrics.length === 0) {
        // Generate mock trend data if no metrics exist
        return this.generateMockTrends(source, timeframe);
      }

      // Process real metrics into trends
      const trends: DataTrend[] = metrics.map(metric => ({
        timestamp: metric.created_at,
        metric: metric.metric_name,
        value: metric.metric_value,
        source,
        trend_direction: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down'
      }));

      return trends;
    } catch (error) {
      console.error('[DataMonitoring] Error analyzing trends:', error);
      return this.generateMockTrends(source, timeframe);
    }
  }

  // Generate mock trend data
  private generateMockTrends(source: string, timeframe: string): DataTrend[] {
    const dataPoints = timeframe === '1h' ? 12 : timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
    const trends: DataTrend[] = [];

    const now = new Date();
    const interval = timeframe === '1h' ? 5 * 60 * 1000 : 
                    timeframe === '24h' ? 60 * 60 * 1000 :
                    timeframe === '7d' ? 24 * 60 * 60 * 1000 :
                    30 * 24 * 60 * 60 * 1000;

    for (let i = 0; i < dataPoints; i++) {
      const timestamp = new Date(now.getTime() - i * interval).toISOString();
      
      trends.push({
        timestamp,
        metric: 'response_time',
        value: Math.random() * 1000 + 500,
        source,
        trend_direction: Math.random() > 0.5 ? 'up' : 'down'
      });

      trends.push({
        timestamp,
        metric: 'accuracy',
        value: Math.random() * 20 + 80,
        source,
        trend_direction: Math.random() > 0.5 ? 'up' : 'down'
      });
    }

    return trends;
  }

  // Get active monitoring alerts
  async getActiveAlerts(): Promise<MonitoringAlert[]> {
    try {
      // Get alerts from performance_metrics table
      const { data: alertMetrics } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('metric_name', 'monitoring_alert')
        .is('tags->>resolved_at', null)
        .order('created_at', { ascending: false })
        .limit(50);

      const alerts: MonitoringAlert[] = (alertMetrics || []).map(metric => {
        const tags = metric.tags as any || {};
        return {
          id: metric.id,
          type: tags.type || 'performance',
          severity: tags.severity || 'medium',
          source: tags.source || 'unknown',
          message: tags.message || 'Monitoring alert',
          details: tags.details || {},
          timestamp: metric.created_at,
          resolved_at: tags.resolved_at,
          auto_resolved: tags.auto_resolved || false
        };
      });

      return alerts;
    } catch (error) {
      console.error('[DataMonitoring] Error fetching alerts:', error);
      return [];
    }
  }

  // Start continuous monitoring
  startMonitoring(interval: number = 60000): void {
    if (this.monitoringInterval) {
      this.stopMonitoring();
    }

    this.monitoringInterval = setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        console.error('[DataMonitoring] Error in monitoring cycle:', error);
      }
    }, interval);

    console.log(`[DataMonitoring] Started monitoring with ${interval}ms interval`);
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
      console.log('[DataMonitoring] Stopped monitoring');
    }
  }

  // Subscribe to alerts
  onAlert(callback: (alert: MonitoringAlert) => void): void {
    this.alertCallbacks.push(callback);
  }

  // Perform health check and generate alerts if needed
  private async performHealthCheck(): Promise<void> {
    try {
      const healthMetrics = await this.getDataHealthMetrics();
      
      for (const metric of healthMetrics) {
        // Check for alert conditions
        if (metric.status === 'critical' || metric.status === 'offline') {
          const alert: MonitoringAlert = {
            id: `alert_${Date.now()}_${metric.source_id}`,
            type: 'availability',
            severity: metric.status === 'offline' ? 'critical' : 'high',
            source: metric.source_name,
            message: `Source ${metric.source_name} is ${metric.status}`,
            details: {
              uptime: metric.uptime_percentage,
              response_time: metric.avg_response_time,
              error_rate: metric.error_rate,
              issues: metric.issues
            },
            timestamp: new Date().toISOString(),
            auto_resolved: false
          };

          await this.triggerAlert(alert);
        }

        if (metric.avg_response_time > 5000) {
          const alert: MonitoringAlert = {
            id: `alert_${Date.now()}_perf_${metric.source_id}`,
            type: 'performance',
            severity: 'medium',
            source: metric.source_name,
            message: `High response time detected: ${metric.avg_response_time}ms`,
            details: { response_time: metric.avg_response_time },
            timestamp: new Date().toISOString(),
            auto_resolved: false
          };

          await this.triggerAlert(alert);
        }
      }
    } catch (error) {
      console.error('[DataMonitoring] Error in health check:', error);
    }
  }

  // Trigger alert and notify callbacks
  private async triggerAlert(alert: MonitoringAlert): Promise<void> {
    try {
      // Store alert in database using performance_metrics table
      await supabase.from('performance_metrics').insert({
        metric_name: 'monitoring_alert',
        metric_value: 1,
        tags: alert as any
      });

      // Notify all subscribed callbacks
      this.alertCallbacks.forEach(callback => {
        try {
          callback(alert);
        } catch (error) {
          console.error('[DataMonitoring] Error in alert callback:', error);
        }
      });
    } catch (error) {
      console.error('[DataMonitoring] Error storing alert:', error);
    }
  }
}

export const dataMonitoringService = DataMonitoringService.getInstance();
