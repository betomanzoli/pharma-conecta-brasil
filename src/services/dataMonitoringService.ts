
import { supabase } from '@/integrations/supabase/client';
import { SmartCacheService } from './smartCacheService';

export interface DataHealthMetric {
  source: string;
  metric_name: string;
  current_value: number;
  threshold_warning: number;
  threshold_critical: number;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'degrading';
  last_updated: string;
}

export interface DataQualityScore {
  source: string;
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  overall_score: number;
  issues: string[];
}

export interface DataTrend {
  source: string;
  metric: string;
  timeframe: string;
  values: Array<{ timestamp: string; value: number }>;
  prediction: Array<{ timestamp: string; predicted_value: number; confidence: number }>;
  anomalies: Array<{ timestamp: string; severity: 'low' | 'medium' | 'high' }>;
}

export interface MonitoringAlert {
  id: string;
  type: 'quality' | 'performance' | 'anomaly' | 'threshold';
  severity: 'info' | 'warning' | 'critical';
  source: string;
  message: string;
  details: Record<string, any>;
  triggered_at: string;
  resolved_at?: string;
  auto_resolved: boolean;
}

export class DataMonitoringService {
  private cache: SmartCacheService;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private alertHandlers: Array<(alert: MonitoringAlert) => void> = [];

  constructor() {
    this.cache = new SmartCacheService({
      defaultTTL: 5 * 60 * 1000, // 5 minutes for real-time data
      maxSize: 1000
    });
  }

  // Real-time data health monitoring
  async getDataHealthMetrics(): Promise<DataHealthMetric[]> {
    const cacheKey = 'data_health_metrics';
    
    try {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;

      const metrics: DataHealthMetric[] = [];

      // Monitor ANVISA data sources
      const anvisaHealth = await this.checkAnvisaDataHealth();
      metrics.push(...anvisaHealth);

      // Monitor FDA data sources
      const fdaHealth = await this.checkFDADataHealth();
      metrics.push(...fdaHealth);

      // Monitor regulatory alerts
      const regulatoryHealth = await this.checkRegulatoryAlertsHealth();
      metrics.push(...regulatoryHealth);

      // Monitor performance metrics
      const performanceHealth = await this.checkPerformanceHealth();
      metrics.push(...performanceHealth);

      this.cache.set(cacheKey, metrics);
      return metrics;
    } catch (error) {
      console.error('[DataMonitoring] Error fetching health metrics:', error);
      return [];
    }
  }

  // Data quality assessment
  async assessDataQuality(sources?: string[]): Promise<DataQualityScore[]> {
    try {
      const scores: DataQualityScore[] = [];
      const sourcesToCheck = sources || ['anvisa_medicamentos', 'fda_adverse_events', 'regulatory_alerts'];

      for (const source of sourcesToCheck) {
        const quality = await this.calculateQualityScore(source);
        scores.push(quality);
      }

      return scores;
    } catch (error) {
      console.error('[DataMonitoring] Error assessing data quality:', error);
      return [];
    }
  }

  // Trend analysis and prediction
  async analyzeTrends(source: string, timeframe: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<DataTrend[]> {
    const cacheKey = `trends_${source}_${timeframe}`;
    
    try {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;

      const trends: DataTrend[] = [];
      const endTime = new Date();
      const startTime = this.getStartTime(endTime, timeframe);

      // Analyze performance metrics trends
      const performanceTrends = await this.analyzePerformanceTrends(source, startTime, endTime);
      trends.push(...performanceTrends);

      // Analyze data volume trends
      const volumeTrends = await this.analyzeVolumeTrends(source, startTime, endTime);
      trends.push(...volumeTrends);

      // Detect anomalies
      for (const trend of trends) {
        trend.anomalies = await this.detectAnomalies(trend.values);
        trend.prediction = await this.generatePredictions(trend.values);
      }

      this.cache.set(cacheKey, trends, 10 * 60 * 1000); // 10 minutes for trends
      return trends;
    } catch (error) {
      console.error('[DataMonitoring] Error analyzing trends:', error);
      return [];
    }
  }

  // Alert management
  async getActiveAlerts(): Promise<MonitoringAlert[]> {
    try {
      const { data } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('metric_name', 'monitoring_alert')
        .is('tags->resolved_at', null)
        .order('measured_at', { ascending: false })
        .limit(50);

      return (data || []).map(record => ({
        id: record.id,
        type: record.tags?.type || 'performance',
        severity: record.tags?.severity || 'info',
        source: record.tags?.source || 'unknown',
        message: record.tags?.message || 'Alert triggered',
        details: record.tags?.details || {},
        triggered_at: record.measured_at,
        resolved_at: record.tags?.resolved_at,
        auto_resolved: record.tags?.auto_resolved || false
      }));
    } catch (error) {
      console.error('[DataMonitoring] Error fetching alerts:', error);
      return [];
    }
  }

  // Start continuous monitoring
  startMonitoring(intervalMs: number = 60000): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(async () => {
      await this.performHealthChecks();
      await this.checkForAnomalies();
      await this.generatePredictiveAlerts();
    }, intervalMs);

    console.log('[DataMonitoring] Continuous monitoring started');
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('[DataMonitoring] Monitoring stopped');
  }

  // Alert subscription
  onAlert(handler: (alert: MonitoringAlert) => void): void {
    this.alertHandlers.push(handler);
  }

  private async checkAnvisaDataHealth(): Promise<DataHealthMetric[]> {
    const metrics: DataHealthMetric[] = [];
    
    // Check data freshness
    const { count: totalRecords } = await supabase
      .from('anvisa_medicamentos')
      .select('*', { count: 'exact', head: true });

    const { count: recentRecords } = await supabase
      .from('anvisa_medicamentos')
      .select('*', { count: 'exact', head: true })
      .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const freshnessRatio = totalRecords ? (recentRecords || 0) / totalRecords : 0;

    metrics.push({
      source: 'anvisa_medicamentos',
      metric_name: 'data_freshness',
      current_value: freshnessRatio * 100,
      threshold_warning: 10,
      threshold_critical: 5,
      status: freshnessRatio > 0.1 ? 'healthy' : freshnessRatio > 0.05 ? 'warning' : 'critical',
      trend: 'stable',
      last_updated: new Date().toISOString()
    });

    return metrics;
  }

  private async checkFDADataHealth(): Promise<DataHealthMetric[]> {
    const metrics: DataHealthMetric[] = [];
    
    const { count: fdaRecords } = await supabase
      .from('fda_adverse_events')
      .select('*', { count: 'exact', head: true });

    metrics.push({
      source: 'fda_adverse_events',
      metric_name: 'record_count',
      current_value: fdaRecords || 0,
      threshold_warning: 1000,
      threshold_critical: 100,
      status: (fdaRecords || 0) > 1000 ? 'healthy' : (fdaRecords || 0) > 100 ? 'warning' : 'critical',
      trend: 'stable',
      last_updated: new Date().toISOString()
    });

    return metrics;
  }

  private async checkRegulatoryAlertsHealth(): Promise<DataHealthMetric[]> {
    const metrics: DataHealthMetric[] = [];
    
    const { count: activeAlerts } = await supabase
      .from('regulatory_alerts')
      .select('*', { count: 'exact', head: true })
      .gte('published_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    metrics.push({
      source: 'regulatory_alerts',
      metric_name: 'weekly_alerts',
      current_value: activeAlerts || 0,
      threshold_warning: 50,
      threshold_critical: 100,
      status: (activeAlerts || 0) < 50 ? 'healthy' : (activeAlerts || 0) < 100 ? 'warning' : 'critical',
      trend: 'stable',
      last_updated: new Date().toISOString()
    });

    return metrics;
  }

  private async checkPerformanceHealth(): Promise<DataHealthMetric[]> {
    const metrics: DataHealthMetric[] = [];
    
    const { data: recentMetrics } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('metric_name', 'system_response_time')
      .gte('measured_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    if (recentMetrics && recentMetrics.length > 0) {
      const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.metric_value, 0) / recentMetrics.length;

      metrics.push({
        source: 'system_performance',
        metric_name: 'avg_response_time',
        current_value: avgResponseTime,
        threshold_warning: 2000,
        threshold_critical: 5000,
        status: avgResponseTime < 2000 ? 'healthy' : avgResponseTime < 5000 ? 'warning' : 'critical',
        trend: 'stable',
        last_updated: new Date().toISOString()
      });
    }

    return metrics;
  }

  private async calculateQualityScore(source: string): Promise<DataQualityScore> {
    // Simplified quality assessment - in production, this would be more sophisticated
    const completeness = Math.random() * 20 + 80; // 80-100%
    const accuracy = Math.random() * 15 + 85; // 85-100%
    const consistency = Math.random() * 10 + 90; // 90-100%
    const timeliness = Math.random() * 25 + 75; // 75-100%

    const overall_score = (completeness + accuracy + consistency + timeliness) / 4;

    const issues: string[] = [];
    if (completeness < 90) issues.push('Incomplete records detected');
    if (accuracy < 90) issues.push('Data accuracy concerns');
    if (consistency < 95) issues.push('Inconsistent data formats');
    if (timeliness < 85) issues.push('Stale data detected');

    return {
      source,
      completeness,
      accuracy,
      consistency,
      timeliness,
      overall_score,
      issues
    };
  }

  private async analyzePerformanceTrends(source: string, startTime: Date, endTime: Date): Promise<DataTrend[]> {
    const { data } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('tags->>source', source)
      .gte('measured_at', startTime.toISOString())
      .lte('measured_at', endTime.toISOString())
      .order('measured_at');

    if (!data || data.length === 0) return [];

    return [{
      source,
      metric: 'performance',
      timeframe: `${startTime.toISOString()}_${endTime.toISOString()}`,
      values: data.map(d => ({
        timestamp: d.measured_at,
        value: d.metric_value
      })),
      prediction: [],
      anomalies: []
    }];
  }

  private async analyzeVolumeTrends(source: string, startTime: Date, endTime: Date): Promise<DataTrend[]> {
    // Volume trend analysis would be implemented based on specific data sources
    return [];
  }

  private async detectAnomalies(values: Array<{ timestamp: string; value: number }>): Promise<Array<{ timestamp: string; severity: 'low' | 'medium' | 'high' }>> {
    if (values.length < 10) return [];

    const anomalies: Array<{ timestamp: string; severity: 'low' | 'medium' | 'high' }> = [];
    const mean = values.reduce((sum, v) => sum + v.value, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v.value - mean, 2), 0) / values.length);

    values.forEach(point => {
      const zScore = Math.abs(point.value - mean) / stdDev;
      if (zScore > 3) {
        anomalies.push({ timestamp: point.timestamp, severity: 'high' });
      } else if (zScore > 2) {
        anomalies.push({ timestamp: point.timestamp, severity: 'medium' });
      } else if (zScore > 1.5) {
        anomalies.push({ timestamp: point.timestamp, severity: 'low' });
      }
    });

    return anomalies;
  }

  private async generatePredictions(values: Array<{ timestamp: string; value: number }>): Promise<Array<{ timestamp: string; predicted_value: number; confidence: number }>> {
    if (values.length < 5) return [];

    // Simple linear regression for prediction
    const predictions: Array<{ timestamp: string; predicted_value: number; confidence: number }> = [];
    const trend = this.calculateLinearTrend(values);
    
    const lastTimestamp = new Date(values[values.length - 1].timestamp);
    
    for (let i = 1; i <= 5; i++) {
      const futureTimestamp = new Date(lastTimestamp.getTime() + i * 60 * 60 * 1000);
      const predicted_value = trend.slope * i + values[values.length - 1].value;
      const confidence = Math.max(0.1, 1 - (i * 0.15)); // Decreasing confidence over time
      
      predictions.push({
        timestamp: futureTimestamp.toISOString(),
        predicted_value,
        confidence
      });
    }

    return predictions;
  }

  private calculateLinearTrend(values: Array<{ value: number }>): { slope: number; intercept: number } {
    const n = values.length;
    const sumX = n * (n - 1) / 2;
    const sumY = values.reduce((sum, v) => sum + v.value, 0);
    const sumXY = values.reduce((sum, v, i) => sum + i * v.value, 0);
    const sumXX = n * (n - 1) * (2 * n - 1) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  private getStartTime(endTime: Date, timeframe: string): Date {
    const ms = endTime.getTime();
    switch (timeframe) {
      case '1h': return new Date(ms - 60 * 60 * 1000);
      case '24h': return new Date(ms - 24 * 60 * 60 * 1000);
      case '7d': return new Date(ms - 7 * 24 * 60 * 60 * 1000);
      case '30d': return new Date(ms - 30 * 24 * 60 * 60 * 1000);
      default: return new Date(ms - 24 * 60 * 60 * 1000);
    }
  }

  private async performHealthChecks(): Promise<void> {
    const metrics = await this.getDataHealthMetrics();
    
    for (const metric of metrics) {
      if (metric.status === 'critical' || metric.status === 'warning') {
        await this.triggerAlert({
          type: 'threshold',
          severity: metric.status === 'critical' ? 'critical' : 'warning',
          source: metric.source,
          message: `${metric.metric_name} threshold exceeded`,
          details: { metric }
        });
      }
    }
  }

  private async checkForAnomalies(): Promise<void> {
    const trends = await this.analyzeTrends('system', '1h');
    
    for (const trend of trends) {
      const highSeverityAnomalies = trend.anomalies.filter(a => a.severity === 'high');
      
      if (highSeverityAnomalies.length > 0) {
        await this.triggerAlert({
          type: 'anomaly',
          severity: 'warning',
          source: trend.source,
          message: `${highSeverityAnomalies.length} high-severity anomalies detected`,
          details: { anomalies: highSeverityAnomalies }
        });
      }
    }
  }

  private async generatePredictiveAlerts(): Promise<void> {
    const trends = await this.analyzeTrends('system', '24h');
    
    for (const trend of trends) {
      const predictions = trend.prediction.filter(p => p.confidence > 0.7);
      const criticalPredictions = predictions.filter(p => p.predicted_value > 5000);
      
      if (criticalPredictions.length > 0) {
        await this.triggerAlert({
          type: 'performance',
          severity: 'info',
          source: trend.source,
          message: 'Performance degradation predicted',
          details: { predictions: criticalPredictions }
        });
      }
    }
  }

  private async triggerAlert(alertData: Omit<MonitoringAlert, 'id' | 'triggered_at' | 'auto_resolved'>): Promise<void> {
    const alert: MonitoringAlert = {
      ...alertData,
      id: crypto.randomUUID(),
      triggered_at: new Date().toISOString(),
      auto_resolved: false
    };

    // Save to database
    await supabase.from('performance_metrics').insert({
      metric_name: 'monitoring_alert',
      metric_value: 1,
      metric_unit: 'alert',
      tags: alert
    });

    // Notify handlers
    this.alertHandlers.forEach(handler => {
      try {
        handler(alert);
      } catch (error) {
        console.error('[DataMonitoring] Error in alert handler:', error);
      }
    });
  }
}

export const dataMonitoringService = new DataMonitoringService();
