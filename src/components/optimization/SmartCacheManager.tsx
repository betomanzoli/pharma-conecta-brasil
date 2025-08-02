
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQueryClient } from '@tanstack/react-query';
import { Database, RefreshCw, Trash2, TrendingUp, Clock, Zap } from 'lucide-react';

interface CacheEntry {
  key: string;
  size: number;
  lastAccessed: Date;
  hitCount: number;
  missCount: number;
  data?: any;
}

interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  oldestEntry: Date;
  newestEntry: Date;
}

const SmartCacheManager = () => {
  const queryClient = useQueryClient();
  const [cacheEntries, setCacheEntries] = useState<CacheEntry[]>([]);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    analyzeCachePerformance();
    const interval = setInterval(analyzeCachePerformance, 10000);
    return () => clearInterval(interval);
  }, []);

  const analyzeCachePerformance = () => {
    try {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      
      const entries: CacheEntry[] = queries.map(query => {
        const key = JSON.stringify(query.queryKey);
        const dataSize = JSON.stringify(query.state.data || {}).length;
        
        return {
          key,
          size: dataSize,
          lastAccessed: new Date(query.state.dataUpdatedAt || Date.now()),
          hitCount: query.getObserversCount(),
          missCount: query.state.errorUpdateCount || 0,
          data: query.state.data
        };
      });

      setCacheEntries(entries);

      // Calcular estatísticas
      const stats: CacheStats = {
        totalEntries: entries.length,
        totalSize: entries.reduce((sum, entry) => sum + entry.size, 0),
        hitRate: entries.reduce((sum, entry) => sum + entry.hitCount, 0) / 
                Math.max(1, entries.reduce((sum, entry) => sum + entry.hitCount + entry.missCount, 0)),
        oldestEntry: entries.length > 0 ? 
          new Date(Math.min(...entries.map(e => e.lastAccessed.getTime()))) : 
          new Date(),
        newestEntry: entries.length > 0 ? 
          new Date(Math.max(...entries.map(e => e.lastAccessed.getTime()))) : 
          new Date()
      };

      setCacheStats(stats);
    } catch (error) {
      console.error('Cache analysis error:', error);
    }
  };

  const optimizeCache = async () => {
    setIsOptimizing(true);
    
    try {
      // Remover entradas antigas (mais de 30 minutos)
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      
      cacheEntries.forEach(entry => {
        if (entry.lastAccessed < thirtyMinutesAgo && entry.hitCount < 2) {
          try {
            const queryKey = JSON.parse(entry.key);
            queryClient.removeQueries({ queryKey });
          } catch (error) {
            console.warn('Error removing cache entry:', error);
          }
        }
      });

      // Prefetch de dados críticos
      const criticalQueries = [
        ['profile'],
        ['companies'],
        ['notifications', 'unread'],
      ];

      await Promise.all(
        criticalQueries.map(queryKey =>
          queryClient.prefetchQuery({
            queryKey,
            queryFn: () => Promise.resolve(null),
            staleTime: 5 * 60 * 1000
          })
        )
      );

      // Compactar cache
      queryClient.getQueryCache().clear();
      
      setTimeout(analyzeCachePerformance, 1000);
    } catch (error) {
      console.error('Cache optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const clearCache = () => {
    queryClient.clear();
    setCacheEntries([]);
    setCacheStats(null);
    setTimeout(analyzeCachePerformance, 500);
  };

  const refreshCache = () => {
    queryClient.invalidateQueries();
    setTimeout(analyzeCachePerformance, 1000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Entradas</p>
                <p className="text-2xl font-bold">{cacheStats?.totalEntries || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Hit Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {cacheStats ? Math.round(cacheStats.hitRate * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Tamanho Total</p>
                <p className="text-2xl font-bold">
                  {cacheStats ? formatBytes(cacheStats.totalSize) : '0 B'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Última Atualização</p>
                <p className="text-lg font-semibold">
                  {cacheStats ? formatDate(cacheStats.newestEntry) : 'Nunca'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Cache</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={optimizeCache}
              disabled={isOptimizing}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isOptimizing ? 'Otimizando...' : 'Otimizar Cache'}
            </Button>

            <Button 
              onClick={refreshCache}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Tudo
            </Button>

            <Button 
              onClick={clearCache}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cache Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Entradas do Cache</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {cacheEntries.slice(0, 20).map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {entry.key.replace(/"/g, '').slice(0, 60)}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <Badge variant="secondary">{formatBytes(entry.size)}</Badge>
                    <Badge 
                      className={entry.hitCount > 0 ? 
                        'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                      }
                    >
                      {entry.hitCount} hits
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(entry.lastAccessed)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {cacheEntries.length === 0 && (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma entrada de cache encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartCacheManager;
