import { supabase } from '@/integrations/supabase/client';

interface CacheEntry<T = any> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number; // Time to live em milissegundos
  source: string;
}

interface CacheConfig {
  ttl: number;
  maxSize: number;
  persistToSupabase: boolean;
}

export class SmartCacheService {
  private static cache = new Map<string, CacheEntry>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
  private static readonly MAX_CACHE_SIZE = 100;

  // Configurações específicas por tipo de dados
  private static readonly CACHE_CONFIGS: Record<string, CacheConfig> = {
    'anvisa:conjuntos': { ttl: 30 * 60 * 1000, maxSize: 50, persistToSupabase: true }, // 30 min
    'fda:drugs': { ttl: 60 * 60 * 1000, maxSize: 100, persistToSupabase: true }, // 1 hora
    'regulatory:alerts': { ttl: 10 * 60 * 1000, maxSize: 20, persistToSupabase: false }, // 10 min
    'user:profile': { ttl: 15 * 60 * 1000, maxSize: 10, persistToSupabase: false }, // 15 min
    'analytics:data': { ttl: 5 * 60 * 1000, maxSize: 30, persistToSupabase: false }, // 5 min
  };

  static async get<T>(
    key: string, 
    source: string,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    const cacheKey = `${source}:${key}`;
    const cached = this.cache.get(cacheKey);
    const config = this.CACHE_CONFIGS[source] || { 
      ttl: this.DEFAULT_TTL, 
      maxSize: this.MAX_CACHE_SIZE,
      persistToSupabase: false 
    };

    // Verificar se existe no cache e ainda é válido
    if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
      console.log(`Cache hit: ${cacheKey}`);
      return cached.data;
    }

    // Tentar buscar no Supabase se configurado
    if (config.persistToSupabase && !cached) {
      const persistedData = await this.getFromPersistentCache(cacheKey);
      if (persistedData) {
        console.log(`Persistent cache hit: ${cacheKey}`);
        this.cache.set(cacheKey, persistedData);
        return persistedData.data;
      }
    }

    console.log(`Cache miss: ${cacheKey} - fetching fresh data`);
    
    try {
      // Buscar dados frescos
      const data = await fetchFn();
      
      // Adicionar ao cache
      const entry: CacheEntry<T> = {
        key: cacheKey,
        data,
        timestamp: Date.now(),
        ttl: config.ttl,
        source
      };

      this.set(cacheKey, entry, config);
      
      // Persistir se configurado
      if (config.persistToSupabase) {
        await this.setPersistentCache(entry);
      }

      return data;
    } catch (error) {
      // Se falhar, tentar retornar dados do cache mesmo se expirado
      if (cached) {
        console.warn(`Returning stale cache for ${cacheKey} due to fetch error:`, error);
        return cached.data;
      }
      throw error;
    }
  }

  private static set<T>(key: string, entry: CacheEntry<T>, config: CacheConfig) {
    // Limpar cache se estiver muito grande
    if (this.cache.size >= config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, entry);
  }

  private static evictOldest() {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      console.log(`Evicted cache entry: ${oldestKey}`);
    }
  }

  private static async getFromPersistentCache(key: string): Promise<CacheEntry | null> {
    try {
      const { data, error } = await supabase
        .from('cache_entries')
        .select('*')
        .eq('cache_key', key)
        .maybeSingle();

      if (error || !data) return null;

      // Verificar se ainda é válido
      const entry: CacheEntry = {
        key: data.cache_key,
        data: data.cache_data,
        timestamp: new Date(data.created_at).getTime(),
        ttl: data.ttl,
        source: data.source
      };

      if ((Date.now() - entry.timestamp) < entry.ttl) {
        return entry;
      }

      // Limpar entrada expirada
      await this.deletePersistentCache(key);
      return null;
    } catch (error) {
      console.error('Erro ao buscar cache persistente:', error);
      return null;
    }
  }

  private static async setPersistentCache<T>(entry: CacheEntry<T>): Promise<void> {
    try {
      await supabase
        .from('cache_entries')
        .upsert({
          cache_key: entry.key,
          cache_data: entry.data,
          ttl: entry.ttl,
          source: entry.source,
          created_at: new Date(entry.timestamp).toISOString()
        });
    } catch (error) {
      console.error('Erro ao persistir cache:', error);
    }
  }

  private static async deletePersistentCache(key: string): Promise<void> {
    try {
      await supabase
        .from('cache_entries')
        .delete()
        .eq('cache_key', key);
    } catch (error) {
      console.error('Erro ao deletar cache persistente:', error);
    }
  }

  static invalidate(pattern: string | RegExp): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (typeof pattern === 'string') {
        if (key.includes(pattern)) {
          keysToDelete.push(key);
        }
      } else {
        if (pattern.test(key)) {
          keysToDelete.push(key);
        }
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      console.log(`Invalidated cache: ${key}`);
    });
  }

  static clear(): void {
    this.cache.clear();
    console.log('Cache completamente limpo');
  }

  static getStats() {
    const entries = Array.from(this.cache.values());
    const now = Date.now();
    
    const validEntries = entries.filter(entry => (now - entry.timestamp) < entry.ttl);
    const expiredEntries = entries.filter(entry => (now - entry.timestamp) >= entry.ttl);
    
    const sourceStats = entries.reduce((acc, entry) => {
      acc[entry.source] = (acc[entry.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.cache.size,
      valid: validEntries.length,
      expired: expiredEntries.length,
      bySource: sourceStats,
      oldestEntry: entries.reduce((oldest, entry) => 
        entry.timestamp < oldest ? entry.timestamp : oldest, now
      ),
      memoryUsage: JSON.stringify(Array.from(this.cache.values())).length
    };
  }

  // Métodos de conveniência para tipos específicos
  static async getAnvisaData<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    return this.get(key, 'anvisa:conjuntos', fetchFn);
  }

  static async getFdaData<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    return this.get(key, 'fda:drugs', fetchFn);
  }

  static async getRegulatoryAlerts<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    return this.get(key, 'regulatory:alerts', fetchFn);
  }

  static async getUserData<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    return this.get(key, 'user:profile', fetchFn);
  }

  static async getAnalyticsData<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    return this.get(key, 'analytics:data', fetchFn);
  }
}