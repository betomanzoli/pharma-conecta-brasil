
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePerformanceAnalytics } from './usePerformanceAnalytics';

interface OptimizedQueryOptions {
  queryKey: readonly unknown[];
  queryFn: () => Promise<any>;
  staleTime?: number;
  cacheTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  backgroundRefetch?: boolean;
  optimistic?: boolean;
  preload?: boolean;
}

export const useOptimizedQuery = <T = any>(options: OptimizedQueryOptions) => {
  const queryClient = useQueryClient();
  const { measureOperation } = usePerformanceAnalytics();
  const abortControllerRef = useRef<AbortController>();

  // Cancelar queries anteriores
  const cancelPreviousQuery = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Query otimizada com métricas
  const result = useQuery<T>({
    queryKey: options.queryKey,
    queryFn: async () => {
      cancelPreviousQuery();
      abortControllerRef.current = new AbortController();
      
      return measureOperation(
        async () => {
          const data = await options.queryFn();
          
          // Cache inteligente baseado no tipo de dados
          if (options.optimistic && data) {
            queryClient.setQueryData(options.queryKey, data);
          }
          
          return data;
        },
        `query_${options.queryKey.join('_')}`,
        {
          query_key: options.queryKey.join('_'),
          cache_enabled: !!options.optimistic,
          background_refetch: !!options.backgroundRefetch
        }
      );
    },
    staleTime: options.staleTime || 5 * 60 * 1000, // 5 minutos
    gcTime: options.cacheTime || 10 * 60 * 1000, // 10 minutos
    enabled: options.enabled !== false,
    refetchOnWindowFocus: options.refetchOnWindowFocus || false,
    refetchInterval: options.backgroundRefetch ? 30000 : false,
    retry: (failureCount, error) => {
      // Retry inteligente baseado no tipo de erro
      if (error instanceof Error && error.message.includes('network')) {
        return failureCount < 3;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Preload de dados relacionados
  useEffect(() => {
    if (options.preload && result.data) {
      // Implementar preload inteligente baseado nos dados atuais
      const preloadRelatedData = async () => {
        try {
          // Preload baseado no contexto dos dados
          if (Array.isArray(result.data) && result.data.length > 0) {
            const relatedKeys = result.data
              .map(item => item.id || item.user_id)
              .filter(Boolean)
              .slice(0, 5); // Limitar preload
            
            relatedKeys.forEach(key => {
              queryClient.prefetchQuery({
                queryKey: ['related', key],
                queryFn: () => Promise.resolve(null),
                staleTime: 10 * 60 * 1000
              });
            });
          }
        } catch (error) {
          console.warn('Preload error:', error);
        }
      };

      preloadRelatedData();
    }
  }, [result.data, options.preload, queryClient]);

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      cancelPreviousQuery();
    };
  }, [cancelPreviousQuery]);

  return {
    ...result,
    cancelQuery: cancelPreviousQuery,
    invalidateRelated: useCallback(() => {
      queryClient.invalidateQueries({
        queryKey: options.queryKey.slice(0, -1)
      });
    }, [queryClient, options.queryKey])
  };
};
