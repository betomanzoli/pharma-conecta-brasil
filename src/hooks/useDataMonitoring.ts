
import { useState, useEffect, useCallback } from 'react';
import { 
  DataMonitoringService, 
  DataHealthMetric, 
  DataQualityScore, 
  DataTrend, 
  MonitoringAlert 
} from '../services/dataMonitoringService';

interface UseDataMonitoringReturn {
  healthMetrics: DataHealthMetric[];
  qualityScores: DataQualityScore[];
  trends: DataTrend[];
  activeAlerts: MonitoringAlert[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  analyzeTrends: (source: string, timeframe?: '1h' | '24h' | '7d' | '30d') => Promise<void>;
  assessQuality: (sources?: string[]) => Promise<void>;
  startMonitoring: (interval?: number) => void;
  stopMonitoring: () => void;
}

export const useDataMonitoring = (): UseDataMonitoringReturn => {
  const [healthMetrics, setHealthMetrics] = useState<DataHealthMetric[]>([]);
  const [qualityScores, setQualityScores] = useState<DataQualityScore[]>([]);
  const [trends, setTrends] = useState<DataTrend[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<MonitoringAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [health, quality, alerts] = await Promise.all([
        DataMonitoringService.getDataHealthMetrics(),
        DataMonitoringService.assessDataQuality(),
        DataMonitoringService.getActiveAlerts()
      ]);
      
      setHealthMetrics(health);
      setQualityScores(quality);
      setActiveAlerts(alerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch monitoring data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeTrends = useCallback(async (
    source: string, 
    timeframe: '1h' | '24h' | '7d' | '30d' = '24h'
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const trendData = await DataMonitoringService.analyzeTrends(source, timeframe);
      setTrends(trendData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze trends');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const assessQuality = useCallback(async (sources?: string[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const quality = await DataMonitoringService.assessDataQuality(sources);
      setQualityScores(quality);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assess data quality');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startMonitoring = useCallback((interval: number = 60000) => {
    DataMonitoringService.startMonitoring(interval);
    
    // Subscribe to alerts
    DataMonitoringService.onAlert((alert: MonitoringAlert) => {
      setActiveAlerts(prev => [alert, ...prev.slice(0, 49)]); // Keep last 50 alerts
    });
  }, []);

  const stopMonitoring = useCallback(() => {
    DataMonitoringService.stopMonitoring();
  }, []);

  useEffect(() => {
    refreshData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(refreshData, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
      stopMonitoring();
    };
  }, [refreshData, stopMonitoring]);

  return {
    healthMetrics,
    qualityScores,
    trends,
    activeAlerts,
    isLoading,
    error,
    refreshData,
    analyzeTrends,
    assessQuality,
    startMonitoring,
    stopMonitoring
  };
};
