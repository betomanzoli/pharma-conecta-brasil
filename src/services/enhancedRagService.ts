
import { supabase } from '@/integrations/supabase/client';
import { SmartCacheService } from './smartCacheService';

export interface EnhancedSearchResult {
  chunk_id: string;
  source_id: string;
  title: string;
  content: string;
  similarity_score: number;
  source_type: string;
  source_url?: string;
  metadata?: Record<string, any>;
}

export interface SearchContext {
  domain?: 'pharmaceutical' | 'regulatory' | 'business' | 'technical';
  agent_type?: string;
  user_context?: Record<string, any>;
  search_depth?: 'shallow' | 'medium' | 'deep';
}

export class EnhancedRAGService {
  private static readonly DEFAULT_TOP_K = 8;
  private static readonly SIMILARITY_THRESHOLD = 0.3;

  static async semanticSearch(
    query: string, 
    context: SearchContext = {},
    topK: number = this.DEFAULT_TOP_K
  ): Promise<EnhancedSearchResult[]> {
    const cacheKey = `semantic_search_${this.generateCacheKey(query, context, topK)}`;
    
    return SmartCacheService.get(
      cacheKey,
      'knowledge:semantic',
      async () => {
        console.log(`[RAG] Performing semantic search for: "${query}"`);
        
        // Expandir query baseado no contexto
        const expandedQuery = this.expandQuery(query, context);
        
        try {
          // Tentar busca semântica com embeddings primeiro
          const semanticResults = await this.performSemanticSearch(expandedQuery, context, topK);
          
          if (semanticResults.length > 0) {
            console.log(`[RAG] Found ${semanticResults.length} semantic results`);
            return semanticResults;
          }
          
          // Fallback para busca textual tradicional
          console.log('[RAG] Falling back to traditional text search');
          return await this.performTextSearch(expandedQuery, context, topK);
          
        } catch (error) {
          console.error('[RAG] Semantic search error:', error);
          // Fallback garantido
          return await this.performTextSearch(query, context, topK);
        }
      }
    );
  }

  private static expandQuery(query: string, context: SearchContext): string {
    let expandedQuery = query;
    
    // Adicionar termos baseados no domínio
    if (context.domain === 'pharmaceutical') {
      expandedQuery += ' pharmaceutical drug medicamento farmacêutico';
    } else if (context.domain === 'regulatory') {
      expandedQuery += ' regulatory compliance ANVISA FDA regulatório';
    } else if (context.domain === 'business') {
      expandedQuery += ' business strategy negócio estratégia';
    }
    
    // Adicionar contexto do agente
    if (context.agent_type) {
      expandedQuery += ` ${context.agent_type}`;
    }
    
    return expandedQuery;
  }

  private static async performSemanticSearch(
    query: string, 
    context: SearchContext, 
    topK: number
  ): Promise<EnhancedSearchResult[]> {
    // Gerar embedding para a query
    const queryEmbedding = await this.generateQueryEmbedding(query);
    
    // Buscar chunks com similaridade semântica
    const { data: chunks, error } = await supabase
      .from('knowledge_chunks')
      .select(`
        id,
        content,
        source_id,
        metadata,
        knowledge_sources!inner(
          title,
          source_type,
          source_url,
          metadata
        ),
        ai_embeddings!inner(
          embedding_data
        )
      `)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .limit(50); // Buscar mais para calcular similaridade

    if (error) throw error;

    if (!chunks || chunks.length === 0) {
      return [];
    }

    // Calcular similaridade semântica
    const resultsWithSimilarity = chunks.map(chunk => {
      const embeddingData = chunk.ai_embeddings?.[0]?.embedding_data as any;
      const chunkVector = embeddingData?.vector || [];
      
      const similarity = this.calculateCosineSimilarity(queryEmbedding, chunkVector);
      
      return {
        chunk_id: chunk.id,
        source_id: chunk.source_id,
        title: chunk.knowledge_sources?.title || 'Untitled',
        content: chunk.content,
        similarity_score: similarity,
        source_type: chunk.knowledge_sources?.source_type || 'unknown',
        source_url: chunk.knowledge_sources?.source_url,
        metadata: {
          ...chunk.metadata,
          source_metadata: chunk.knowledge_sources?.metadata
        }
      };
    });

    // Filtrar por threshold e ordenar por similaridade
    return resultsWithSimilarity
      .filter(result => result.similarity_score >= this.SIMILARITY_THRESHOLD)
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, topK);
  }

  private static async performTextSearch(
    query: string, 
    context: SearchContext, 
    topK: number
  ): Promise<EnhancedSearchResult[]> {
    const { data, error } = await supabase.rpc('rag_search', {
      p_query: query,
      p_top_k: topK
    });

    if (error) throw error;

    return (data || []).map((result: any) => ({
      chunk_id: result.chunk_id,
      source_id: result.source_id,
      title: result.title,
      content: result.content,
      similarity_score: result.rank || 0,
      source_type: 'manual',
      source_url: result.source_url,
      metadata: {}
    }));
  }

  private static async generateQueryEmbedding(query: string): Promise<number[]> {
    // Implementação simplificada - em produção usar API de embeddings real
    const dimension = 384;
    const embedding = [];
    
    let hash = 0;
    for (let i = 0; i < query.length; i++) {
      const char = query.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    for (let i = 0; i < dimension; i++) {
      embedding.push((Math.sin(hash + i) + 1) / 2);
    }
    
    return embedding;
  }

  private static calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (!vectorA.length || !vectorB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    const minLength = Math.min(vectorA.length, vectorB.length);
    
    for (let i = 0; i < minLength; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)) || 0;
  }

  private static generateCacheKey(query: string, context: SearchContext, topK: number): string {
    return `${query}_${context.domain || 'general'}_${context.agent_type || 'default'}_${topK}`;
  }

  // Métodos para diferentes tipos de busca especializada
  static async searchForAgent(
    query: string, 
    agentType: string, 
    topK: number = 5
  ): Promise<EnhancedSearchResult[]> {
    const context: SearchContext = {
      agent_type: agentType,
      domain: this.getDomainForAgent(agentType),
      search_depth: 'medium'
    };
    
    return this.semanticSearch(query, context, topK);
  }

  static async searchByDomain(
    query: string, 
    domain: SearchContext['domain'], 
    topK: number = 8
  ): Promise<EnhancedSearchResult[]> {
    const context: SearchContext = {
      domain,
      search_depth: 'deep'
    };
    
    return this.semanticSearch(query, context, topK);
  }

  private static getDomainForAgent(agentType: string): SearchContext['domain'] {
    const agentDomainMap: Record<string, SearchContext['domain']> = {
      'project_analyst': 'business',
      'business_strategist': 'business',
      'technical_regulatory': 'regulatory',
      'document_assistant': 'pharmaceutical',
      'coordinator': 'business'
    };
    
    return agentDomainMap[agentType] || 'pharmaceutical';
  }

  // Métodos de análise e otimização
  static async analyzeSearchPerformance(): Promise<{
    total_searches: number;
    avg_results: number;
    cache_hit_rate: number;
    top_queries: string[];
  }> {
    const stats = SmartCacheService.getStats();
    
    return {
      total_searches: stats.total,
      avg_results: 5.2, // Mock - em produção calcular
      cache_hit_rate: (stats.valid / stats.total) * 100,
      top_queries: ['business case', 'regulatory compliance', 'SWOT analysis'] // Mock
    };
  }

  static async refreshKnowledgeBase(): Promise<void> {
    console.log('[RAG] Refreshing knowledge base cache...');
    SmartCacheService.invalidate('knowledge:');
    SmartCacheService.invalidate('semantic_search_');
  }
}
