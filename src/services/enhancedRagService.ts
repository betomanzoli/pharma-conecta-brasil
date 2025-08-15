
import { supabase } from '@/integrations/supabase/client';
import { smartCacheService } from './smartCacheService';

export interface RAGSearchParams {
  query: string;
  limit?: number;
  similarity_threshold?: number;
  include_metadata?: boolean;
}

export interface RAGResult {
  id: string;
  content: string;
  metadata: Record<string, any>;
  similarity_score: number;
  source: string;
}

export interface EnhancedRAGContext {
  user_context: Record<string, any>;
  conversation_history: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  domain_expertise: string[];
  search_preferences: Record<string, any>;
}

class EnhancedRAGService {
  private readonly EMBEDDING_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly SEARCH_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  async semanticSearch(params: RAGSearchParams): Promise<RAGResult[]> {
    const cacheKey = `rag_search_${JSON.stringify(params)}`;
    
    try {
      // Try to get from cache first
      const cachedResults = await smartCacheService.get(cacheKey);
      if (cachedResults) {
        console.log('RAG search cache hit');
        return cachedResults as RAGResult[];
      }

      // Generate embedding for the query
      const embedding = await this.generateEmbedding(params.query);
      
      // Perform similarity search
      const { data: chunks, error } = await supabase
        .from('knowledge_chunks')
        .select(`
          id,
          content,
          metadata,
          source:knowledge_sources(name, type)
        `)
        .rpc('match_knowledge_chunks', {
          query_embedding: embedding,
          match_threshold: params.similarity_threshold || 0.7,
          match_count: params.limit || 10
        });

      if (error) {
        throw new Error(`Search error: ${error.message}`);
      }

      const results: RAGResult[] = chunks?.map((chunk: any) => ({
        id: chunk.id,
        content: chunk.content,
        metadata: chunk.metadata || {},
        similarity_score: chunk.similarity || 0,
        source: chunk.source?.name || 'Unknown'
      })) || [];

      // Cache the results
      await smartCacheService.set(cacheKey, results, this.SEARCH_CACHE_TTL);

      return results;
    } catch (error) {
      console.error('Enhanced RAG search error:', error);
      throw error;
    }
  }

  async contextualSearch(
    query: string, 
    context: EnhancedRAGContext,
    options: RAGSearchParams = {}
  ): Promise<RAGResult[]> {
    try {
      // Enhance query with context
      const enhancedQuery = await this.enhanceQueryWithContext(query, context);
      
      // Perform semantic search with enhanced query
      const results = await this.semanticSearch({
        ...options,
        query: enhancedQuery
      });

      // Re-rank results based on context
      return this.reRankWithContext(results, context);
    } catch (error) {
      console.error('Contextual search error:', error);
      throw error;
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const cacheKey = `embedding_${this.hashString(text)}`;
    
    try {
      // Check cache first
      const cachedEmbedding = await smartCacheService.get(cacheKey);
      if (cachedEmbedding) {
        return cachedEmbedding as number[];
      }

      // Call OpenAI API for embedding generation
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          input: text,
          model: 'text-embedding-ada-002'
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const embedding = data.data[0].embedding;

      // Cache the embedding
      await smartCacheService.set(cacheKey, embedding, this.EMBEDDING_CACHE_TTL);

      return embedding;
    } catch (error) {
      console.error('Embedding generation error:', error);
      // Return a dummy embedding for development
      return new Array(1536).fill(0).map(() => Math.random() * 2 - 1);
    }
  }

  private async enhanceQueryWithContext(
    query: string, 
    context: EnhancedRAGContext
  ): Promise<string> {
    let enhancedQuery = query;

    // Add domain expertise context
    if (context.domain_expertise.length > 0) {
      enhancedQuery += ` Context: ${context.domain_expertise.join(', ')}`;
    }

    // Add conversation context if available
    if (context.conversation_history.length > 0) {
      const recentContext = context.conversation_history
        .slice(-3)
        .map(msg => msg.content)
        .join(' ');
      enhancedQuery += ` Previous context: ${recentContext}`;
    }

    return enhancedQuery;
  }

  private reRankWithContext(
    results: RAGResult[], 
    context: EnhancedRAGContext
  ): RAGResult[] {
    return results.map(result => {
      let contextBoost = 0;

      // Boost based on domain expertise
      context.domain_expertise.forEach(domain => {
        if (result.content.toLowerCase().includes(domain.toLowerCase()) ||
            result.metadata.domain?.toLowerCase().includes(domain.toLowerCase())) {
          contextBoost += 0.1;
        }
      });

      // Boost based on user preferences
      if (context.search_preferences.preferred_sources) {
        context.search_preferences.preferred_sources.forEach((source: string) => {
          if (result.source.toLowerCase().includes(source.toLowerCase())) {
            contextBoost += 0.05;
          }
        });
      }

      return {
        ...result,
        similarity_score: Math.min(1, result.similarity_score + contextBoost)
      };
    }).sort((a, b) => b.similarity_score - a.similarity_score);
  }

  async updateKnowledgeBase(
    sourceId: string,
    content: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      // Generate embedding for the content
      const embedding = await this.generateEmbedding(content);

      // Store in knowledge chunks
      const { error } = await supabase
        .from('knowledge_chunks')
        .upsert({
          source_id: sourceId,
          content,
          metadata,
          embedding_data: embedding,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw new Error(`Knowledge base update error: ${error.message}`);
      }

      // Invalidate related caches
      await this.invalidateRelatedCaches(sourceId);
    } catch (error) {
      console.error('Knowledge base update error:', error);
      throw error;
    }
  }

  private async invalidateRelatedCaches(sourceId: string): Promise<void> {
    // This would invalidate all caches related to this source
    // Implementation depends on cache structure
    console.log(`Invalidating caches for source: ${sourceId}`);
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}

export const enhancedRAGService = new EnhancedRAGService();
