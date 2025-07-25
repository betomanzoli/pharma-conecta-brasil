
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAsyncError } from './useAsyncError';

interface UseSupabaseQueryOptions {
  queryKey: readonly unknown[];
  table: string;
  select?: string;
  filters?: Record<string, any>;
  single?: boolean;
  throwError?: boolean;
  enabled?: boolean;
}

export const useSupabaseQuery = <T = any>({
  queryKey,
  table,
  select = '*',
  filters = {},
  single = false,
  throwError = false,
  enabled = true
}: UseSupabaseQueryOptions) => {
  const { handleError } = useAsyncError();

  return useQuery<T>({
    queryKey,
    enabled,
    queryFn: async () => {
      try {
        let query = supabase.from(table as any).select(select);
        
        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });

        // Execute query
        const result = single ? 
          await query.maybeSingle() : 
          await query;

        if (result.error) {
          if (throwError) {
            throw new Error(result.error.message);
          } else {
            handleError(result.error, `Erro ao buscar dados da tabela ${table}`);
            return null;
          }
        }

        return result.data as T;
      } catch (error) {
        if (throwError) {
          throw error;
        } else {
          handleError(error, `Erro ao buscar dados da tabela ${table}`);
          return null;
        }
      }
    },
  });
};
