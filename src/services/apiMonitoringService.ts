import { supabase } from '@/integrations/supabase/client';
import { SmartCacheService } from './smartCacheService';

interface ApiHealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastCheck: string;
  errorCount: number;
  successRate: number;
  endpoint?: string;
}

interface SyncStatus {
  service: string;
  lastSync: string | null;
  nextSync: string | null;
  status: 'idle' | 'syncing' | 'error' | 'completed';
  recordsProcessed: number;
  errorMessage?: string;
}

export class ApiMonitoringService {
  private static readonly API_ENDPOINTS = {
    anvisa: 'https://dados.gov.br/api/publico/conjuntos-dados',
    fda: 'https://api.fda.gov/drug/label.json?limit=1',
    receita_federal: 'https://receitaws.com.br/v1/cnpj/11222333000181'
  };

  static async monitorAllApis(): Promise<ApiHealthCheck[]> {
    const results = await Promise.allSettled([
      this.checkApiHealth('anvisa', this.API_ENDPOINTS.anvisa),
      this.checkApiHealth('fda', this.API_ENDPOINTS.fda),
      this.checkApiHealth('receita_federal', this.API_ENDPOINTS.receita_federal)
    ]);

    return results.map((result, index) => {
      const service = Object.keys(this.API_ENDPOINTS)[index];
      
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          service,
          status: 'down' as const,
          responseTime: 0,
          lastCheck: new Date().toISOString(),
          errorCount: 1,
          successRate: 0,
          endpoint: Object.values(this.API_ENDPOINTS)[index]
        };
      }
    });
  }

  private static async checkApiHealth(service: string, endpoint: string): Promise<ApiHealthCheck> {
    const startTime = Date.now();
    
    try {
      // Cache da verificação de saúde por 2 minutos
      const healthData = await SmartCacheService.get(
        `health-${service}`,
        'api:health',
        async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          try {
            const response = await fetch(endpoint, {
              method: 'GET',
              signal: controller.signal,
              headers: {
                'User-Agent': 'PharmaConecta-Monitor/1.0'
              }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return {
              status: response.status,
              ok: response.ok,
              responseTime: Date.now() - startTime
            };
          } catch (error) {
            clearTimeout(timeoutId);
            throw error;
          }
        }
      );

      // Buscar estatísticas históricas
      const stats = await this.getApiStats(service);

      return {
        service,
        status: healthData.responseTime < 5000 ? 'healthy' : 'degraded',
        responseTime: healthData.responseTime,
        lastCheck: new Date().toISOString(),
        errorCount: stats.errorCount,
        successRate: stats.successRate,
        endpoint
      };

    } catch (error) {
      console.error(`Erro na verificação de saúde da API ${service}:`, error);
      
      // Registrar falha
      await this.recordApiEvent(service, 'error', Date.now() - startTime, error);

      const stats = await this.getApiStats(service);

      return {
        service,
        status: 'down',
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString(),
        errorCount: stats.errorCount + 1,
        successRate: stats.successRate,
        endpoint
      };
    }
  }

  private static async getApiStats(service: string): Promise<{ errorCount: number; successRate: number }> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      // Usar performance_metrics como fallback já que temos acesso a ela
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('tags')
        .eq('metric_name', 'api_health_check')
        .gte('measured_at', oneHourAgo);

      if (error) throw error;

      const events = data || [];
      const serviceEvents = events.filter(e => 
        e.tags && typeof e.tags === 'object' && 
        'service' in e.tags && e.tags.service === service
      );

      const totalEvents = serviceEvents.length;
      const errorEvents = serviceEvents.filter(e => 
        e.tags && typeof e.tags === 'object' && 
        'status' in e.tags && e.tags.status === 'error'
      ).length;
      
      const successRate = totalEvents > 0 ? ((totalEvents - errorEvents) / totalEvents) * 100 : 100;

      return {
        errorCount: errorEvents,
        successRate: Math.round(successRate)
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas da API:', error);
      return { errorCount: 0, successRate: 100 };
    }
  }

  private static async recordApiEvent(
    service: string, 
    eventType: 'success' | 'error', 
    responseTime: number, 
    error?: any
  ): Promise<void> {
    try {
      // Usar performance_metrics para registrar eventos
      await supabase
        .from('performance_metrics')
        .insert({
          metric_name: 'api_health_check',
          metric_value: eventType === 'success' ? 1 : 0,
          metric_unit: 'status',
          tags: {
            service,
            status: eventType,
            response_time: responseTime,
            error_message: error ? String(error) : null
          }
        });
    } catch (insertError) {
      console.error('Erro ao registrar evento da API:', insertError);
    }
  }

  static async getSyncStatuses(): Promise<SyncStatus[]> {
    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(config => ({
        service: config.integration_name,
        lastSync: config.last_sync,
        nextSync: this.calculateNextSync(config.last_sync, config.sync_frequency_hours),
        status: this.determineSyncStatus(config),
        recordsProcessed: 0,
        errorMessage: undefined
      }));
    } catch (error) {
      console.error('Erro ao buscar status de sincronização:', error);
      return [];
    }
  }

  private static calculateNextSync(lastSync: string | null, frequencyHours: number): string | null {
    if (!lastSync) return null;
    
    const lastSyncTime = new Date(lastSync);
    const nextSync = new Date(lastSyncTime.getTime() + (frequencyHours * 60 * 60 * 1000));
    
    return nextSync.toISOString();
  }

  private static determineSyncStatus(config: any): SyncStatus['status'] {
    if (!config.is_active) return 'idle';
    
    const now = new Date();
    const lastSync = config.last_sync ? new Date(config.last_sync) : null;
    
    if (!lastSync) return 'idle';
    
    const timeSinceLastSync = now.getTime() - lastSync.getTime();
    const expectedInterval = config.sync_frequency_hours * 60 * 60 * 1000;
    
    if (timeSinceLastSync > expectedInterval * 1.5) {
      return 'error';
    }
    
    return 'completed';
  }

  static async triggerSync(service: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke(this.getSyncFunctionName(service), {
        body: { action: 'sync_all', manual: true }
      });

      if (error) {
        console.error(`Erro ao disparar sincronização para ${service}:`, error);
        return false;
      }

      // Invalidar cache relacionado
      SmartCacheService.invalidate(service);
      
      console.log(`Sincronização iniciada para ${service}:`, data);
      return true;
    } catch (error) {
      console.error(`Erro ao disparar sincronização para ${service}:`, error);
      return false;
    }
  }

  private static getSyncFunctionName(service: string): string {
    const functionMap: Record<string, string> = {
      'anvisa_dados_gov_br': 'anvisa-real-api',
      'fda_api': 'fda-api',
      'regulatory_sync': 'regulatory-sync',
      'brazilian_regulatory': 'brazilian-regulatory-api'
    };

    return functionMap[service] || service;
  }

  static async getPerformanceMetrics(service: string, hours: number = 24): Promise<any> {
    try {
      const startTime = new Date(Date.now() - (hours * 60 * 60 * 1000)).toISOString();
      
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('metric_name', 'api_health_check')
        .gte('measured_at', startTime)
        .order('measured_at', { ascending: true });

      if (error) throw error;

      const events = (data || []).filter(e => 
        e.tags && typeof e.tags === 'object' && 
        'service' in e.tags && e.tags.service === service
      );
      
      // Calcular métricas
      const totalRequests = events.length;
      const errorCount = events.filter(e => 
        e.tags && typeof e.tags === 'object' && 
        'status' in e.tags && e.tags.status === 'error'
      ).length;
      
      const successCount = totalRequests - errorCount;
      const successRate = totalRequests > 0 ? (successCount / totalRequests) * 100 : 100;
      
      const responseTimes = events
        .filter(e => e.tags && typeof e.tags === 'object' && 'response_time' in e.tags)
        .map(e => {
          const tags = e.tags as any;
          return Number(tags?.response_time || 0);
        })
        .filter(time => time > 0);
      
      const avgResponseTime = responseTimes.length > 0 
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
        : 0;

      // Agrupar por hora para gráfico
      const hourlyData = this.groupEventsByHour(events, hours);

      return {
        totalRequests,
        successCount,
        errorCount,
        successRate: Math.round(successRate),
        avgResponseTime: Math.round(avgResponseTime),
        hourlyData,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao buscar métricas de performance:', error);
      return null;
    }
  }

  private static groupEventsByHour(events: any[], hours: number): any[] {
    const hourlyBuckets: Record<string, { success: number; error: number; totalTime: number; count: number }> = {};
    
    // Inicializar buckets
    for (let i = 0; i < hours; i++) {
      const hourTime = new Date(Date.now() - (i * 60 * 60 * 1000));
      const hourKey = hourTime.toISOString().substring(0, 13) + ':00:00.000Z';
      hourlyBuckets[hourKey] = { success: 0, error: 0, totalTime: 0, count: 0 };
    }

    // Preencher com dados reais
    events.forEach(event => {
      const eventHour = new Date(event.measured_at).toISOString().substring(0, 13) + ':00:00.000Z';
      
      if (hourlyBuckets[eventHour]) {
        const isError = event.tags && typeof event.tags === 'object' && 
                       'status' in event.tags && event.tags.status === 'error';
        
        if (isError) {
          hourlyBuckets[eventHour].error++;
        } else {
          hourlyBuckets[eventHour].success++;
        }
        
        const responseTime = event.tags && typeof event.tags === 'object' && 
                           'response_time' in event.tags ? Number((event.tags as any).response_time) : 0;
        
        if (responseTime > 0) {
          hourlyBuckets[eventHour].totalTime += responseTime;
          hourlyBuckets[eventHour].count++;
        }
      }
    });

    return Object.entries(hourlyBuckets).map(([time, data]) => ({
      time,
      success: data.success,
      error: data.error,
      avgResponseTime: data.count > 0 ? Math.round(data.totalTime / data.count) : 0
    })).sort((a, b) => a.time.localeCompare(b.time));
  }

  // Método para limpeza automática de eventos antigos
  static async cleanupOldEvents(daysToKeep: number = 7): Promise<void> {
    try {
      const cutoffDate = new Date(Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)).toISOString();
      
      const { error } = await supabase
        .from('performance_metrics')
        .delete()
        .eq('metric_name', 'api_health_check')
        .lt('measured_at', cutoffDate);

      if (error) throw error;
      
      console.log(`Métricas de API anteriores a ${cutoffDate} foram removidas`);
    } catch (error) {
      console.error('Erro ao limpar métricas antigas:', error);
    }
  }
}