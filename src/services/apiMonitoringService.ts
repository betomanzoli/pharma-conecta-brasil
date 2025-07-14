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
  private static readonly HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos
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
          const response = await fetch(endpoint, {
            method: 'GET',
            timeout: 10000, // 10 segundos timeout
            headers: {
              'User-Agent': 'PharmaConecta-Monitor/1.0'
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return {
            status: response.status,
            ok: response.ok,
            responseTime: Date.now() - startTime
          };
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
      
      const { data, error } = await supabase
        .from('api_monitoring_events')
        .select('event_type')
        .eq('service', service)
        .gte('created_at', oneHourAgo);

      if (error) throw error;

      const events = data || [];
      const totalEvents = events.length;
      const errorEvents = events.filter(e => e.event_type === 'error').length;
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
      await supabase
        .from('api_monitoring_events')
        .insert({
          service,
          event_type: eventType,
          response_time: responseTime,
          error_message: error ? String(error) : null,
          created_at: new Date().toISOString()
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
        recordsProcessed: 0, // Poderia vir de uma tabela de logs de sync
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
        .from('api_monitoring_events')
        .select('*')
        .eq('service', service)
        .gte('created_at', startTime)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const events = data || [];
      
      // Calcular métricas
      const totalRequests = events.length;
      const errorCount = events.filter(e => e.event_type === 'error').length;
      const successCount = totalRequests - errorCount;
      const successRate = totalRequests > 0 ? (successCount / totalRequests) * 100 : 100;
      
      const responseTimes = events
        .filter(e => e.response_time > 0)
        .map(e => e.response_time);
      
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
      const eventHour = new Date(event.created_at).toISOString().substring(0, 13) + ':00:00.000Z';
      
      if (hourlyBuckets[eventHour]) {
        if (event.event_type === 'error') {
          hourlyBuckets[eventHour].error++;
        } else {
          hourlyBuckets[eventHour].success++;
        }
        
        if (event.response_time > 0) {
          hourlyBuckets[eventHour].totalTime += event.response_time;
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
        .from('api_monitoring_events')
        .delete()
        .lt('created_at', cutoffDate);

      if (error) throw error;
      
      console.log(`Eventos de monitoramento anteriores a ${cutoffDate} foram removidos`);
    } catch (error) {
      console.error('Erro ao limpar eventos antigos:', error);
    }
  }
}