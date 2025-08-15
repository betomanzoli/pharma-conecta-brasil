
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  source: string;
}

export class SmartCacheService {
  private static cache = new Map<string, CacheEntry<any>>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  static async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  static async set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      source: 'smart-cache'
    };
    
    this.cache.set(key, entry);
  }

  static async clear(): Promise<void> {
    this.cache.clear();
  }

  static async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  static getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}
