
import { useState, useCallback } from 'react';
import { EnhancedRAGService, EnhancedSearchResult, SearchContext } from '@/services/enhancedRagService';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedRAG = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<EnhancedSearchResult[]>([]);
  const { toast } = useToast();

  const search = useCallback(async (
    query: string, 
    context?: SearchContext, 
    topK?: number
  ) => {
    if (!query.trim()) {
      toast({
        title: 'Query vazia',
        description: 'Digite uma consulta para buscar',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      console.log(`[RAG Hook] Searching for: "${query}"`);
      const searchResults = await EnhancedRAGService.semanticSearch(query, context, topK);
      
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        toast({
          title: 'Nenhum resultado',
          description: 'Tente termos diferentes ou mais específicos',
        });
      } else {
        toast({
          title: 'Busca concluída',
          description: `${searchResults.length} resultado(s) encontrado(s)`,
        });
      }
      
      return searchResults;
    } catch (error) {
      console.error('[RAG Hook] Search error:', error);
      toast({
        title: 'Erro na busca',
        description: 'Não foi possível realizar a pesquisa',
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const searchForAgent = useCallback(async (
    query: string, 
    agentType: string, 
    topK?: number
  ) => {
    setLoading(true);
    try {
      const searchResults = await EnhancedRAGService.searchForAgent(query, agentType, topK);
      setResults(searchResults);
      return searchResults;
    } catch (error) {
      console.error('[RAG Hook] Agent search error:', error);
      toast({
        title: 'Erro na busca especializada',
        description: 'Falha na busca contextual do agente',
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const searchByDomain = useCallback(async (
    query: string, 
    domain: SearchContext['domain'], 
    topK?: number
  ) => {
    setLoading(true);
    try {
      const searchResults = await EnhancedRAGService.searchByDomain(query, domain, topK);
      setResults(searchResults);
      return searchResults;
    } catch (error) {
      console.error('[RAG Hook] Domain search error:', error);
      toast({
        title: 'Erro na busca por domínio',
        description: 'Falha na busca especializada',
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  const refreshKnowledgeBase = useCallback(async () => {
    try {
      await EnhancedRAGService.refreshKnowledgeBase();
      toast({
        title: 'Base atualizada',
        description: 'Cache do conhecimento foi renovado',
      });
    } catch (error) {
      toast({
        title: 'Erro na atualização',
        description: 'Não foi possível atualizar a base',
        variant: 'destructive'
      });
    }
  }, [toast]);

  return {
    search,
    searchForAgent,
    searchByDomain,
    clearResults,
    refreshKnowledgeBase,
    loading,
    results,
    hasResults: results.length > 0
  };
};
