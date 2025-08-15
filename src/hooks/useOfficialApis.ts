
import { useState, useCallback } from 'react';
import { OfficialApiService, OfficialDataResult, ApiSource } from '@/services/officialApiService';
import { useToast } from '@/hooks/use-toast';

export const useOfficialApis = () => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [results, setResults] = useState<OfficialDataResult[]>([]);
  const [sources, setSources] = useState<ApiSource[]>([]);
  const { toast } = useToast();

  const searchOfficial = useCallback(async (
    query: string,
    selectedSources: string[] = ['anvisa', 'fda', 'pubmed'],
    limit = 20
  ) => {
    if (!query.trim()) {
      toast({
        title: 'Query vazia',
        description: 'Digite uma consulta para buscar nas APIs oficiais',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      console.log(`[Official APIs Hook] Searching: "${query}"`);
      const searchResults = await OfficialApiService.searchOfficialData(query, selectedSources, limit);
      
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        toast({
          title: 'Nenhum resultado oficial',
          description: 'Tente termos diferentes ou verifique as fontes de dados',
        });
      } else {
        toast({
          title: 'Busca oficial concluída',
          description: `${searchResults.length} resultado(s) de fontes oficiais`,
        });
      }
      
      return searchResults;
    } catch (error) {
      console.error('[Official APIs Hook] Search error:', error);
      toast({
        title: 'Erro na busca oficial',
        description: 'Não foi possível acessar as APIs oficiais',
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadSources = useCallback(async () => {
    try {
      const availableSources = await OfficialApiService.getAvailableSources();
      setSources(availableSources);
      return availableSources;
    } catch (error) {
      console.error('[Official APIs Hook] Load sources error:', error);
      toast({
        title: 'Erro ao carregar fontes',
        description: 'Não foi possível verificar o status das APIs',
        variant: 'destructive'
      });
      return [];
    }
  }, [toast]);

  const syncAllSources = useCallback(async () => {
    setSyncing(true);
    try {
      const result = await OfficialApiService.syncAllSources();
      
      if (result.success) {
        toast({
          title: 'Sincronização concluída',
          description: result.message,
        });
        // Recarregar status das fontes
        await loadSources();
      } else {
        throw new Error(result.message);
      }
      
      return result;
    } catch (error: any) {
      console.error('[Official APIs Hook] Sync error:', error);
      toast({
        title: 'Erro na sincronização',
        description: error.message || 'Falha ao sincronizar com APIs oficiais',
        variant: 'destructive'
      });
      return { success: false, message: error.message };
    } finally {
      setSyncing(false);
    }
  }, [toast, loadSources]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    searchOfficial,
    loadSources,
    syncAllSources,
    clearResults,
    loading,
    syncing,
    results,
    sources,
    hasResults: results.length > 0,
    hasActiveSources: sources.some(s => s.available)
  };
};
