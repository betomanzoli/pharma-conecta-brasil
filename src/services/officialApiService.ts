
import { supabase } from '@/integrations/supabase/client';
import { SmartCacheService } from './smartCacheService';

export interface ApiSource {
  name: string;
  priority: number;
  available: boolean;
  lastSync?: string;
  records?: number;
}

export interface OfficialDataResult {
  id: string;
  source: 'anvisa' | 'fda' | 'pubmed' | 'ema';
  title: string;
  content: string;
  url?: string;
  publishedAt: string;
  dataType: string;
  relevanceScore: number;
  metadata: Record<string, any>;
}

export class OfficialApiService {
  private static readonly CACHE_TTL = 3600; // 1 hour
  private static readonly API_PRIORITIES = {
    anvisa: 1,
    fda: 2,
    pubmed: 3,
    ema: 4
  };

  static async searchOfficialData(
    query: string,
    sources: string[] = ['anvisa', 'fda', 'pubmed'],
    limit = 20
  ): Promise<OfficialDataResult[]> {
    const cacheKey = `official_search_${query}_${sources.join(',')}_${limit}`;
    
    return SmartCacheService.get(
      cacheKey,
      'official:search',
      async () => {
        console.log(`[Official API] Searching across sources: ${sources.join(', ')}`);
        
        const promises = sources.map(source => this.searchBySource(source, query, limit));
        const results = await Promise.allSettled(promises);
        
        const allResults: OfficialDataResult[] = [];
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            allResults.push(...result.value);
          } else {
            console.error(`[Official API] Error from ${sources[index]}:`, result.reason);
          }
        });
        
        return this.prioritizeResults(allResults, limit);
      },
      this.CACHE_TTL
    );
  }

  private static async searchBySource(
    source: string,
    query: string,
    limit: number
  ): Promise<OfficialDataResult[]> {
    switch (source.toLowerCase()) {
      case 'anvisa':
        return this.searchAnvisa(query, limit);
      case 'fda':
        return this.searchFDA(query, limit);
      case 'pubmed':
        return this.searchPubMed(query, limit);
      default:
        console.warn(`[Official API] Unknown source: ${source}`);
        return [];
    }
  }

  private static async searchAnvisa(query: string, limit: number): Promise<OfficialDataResult[]> {
    try {
      const { data, error } = await supabase.functions.invoke('comprehensive-integration-sync', {
        body: { 
          source: 'anvisa',
          query,
          limit
        }
      });

      if (error) throw error;

      return this.transformAnvisaData(data?.results || []);
    } catch (error) {
      console.error('[Official API] ANVISA search error:', error);
      return [];
    }
  }

  private static async searchFDA(query: string, limit: number): Promise<OfficialDataResult[]> {
    try {
      const { data, error } = await supabase.functions.invoke('fda-api', {
        body: { 
          action: 'search',
          query,
          limit
        }
      });

      if (error) throw error;

      return this.transformFDAData(data?.results || []);
    } catch (error) {
      console.error('[Official API] FDA search error:', error);
      return [];
    }
  }

  private static async searchPubMed(query: string, limit: number): Promise<OfficialDataResult[]> {
    try {
      const { data, error } = await supabase.functions.invoke('comprehensive-integration-sync', {
        body: { 
          source: 'pubmed',
          query,
          limit
        }
      });

      if (error) throw error;

      return this.transformPubMedData(data?.results || []);
    } catch (error) {
      console.error('[Official API] PubMed search error:', error);
      return [];
    }
  }

  private static transformAnvisaData(data: any[]): OfficialDataResult[] {
    return data.map(item => ({
      id: `anvisa_${item.id || Date.now()}`,
      source: 'anvisa' as const,
      title: item.title || item.nome || 'ANVISA Data',
      content: item.description || item.descricao || '',
      url: item.url,
      publishedAt: item.published_at || new Date().toISOString(),
      dataType: item.data_type || 'regulatory',
      relevanceScore: 0.9,
      metadata: {
        category: item.categoria,
        status: item.status,
        original: item
      }
    }));
  }

  private static transformFDAData(data: any[]): OfficialDataResult[] {
    return data.map(item => ({
      id: `fda_${item.id || Date.now()}`,
      source: 'fda' as const,
      title: item.product_description || item.brand_name || 'FDA Data',
      content: item.reason_for_recall || item.description || '',
      url: `https://www.fda.gov/search?s=${encodeURIComponent(item.product_description || '')}`,
      publishedAt: item.report_date || new Date().toISOString(),
      dataType: item.data_type || 'regulatory',
      relevanceScore: 0.85,
      metadata: {
        classification: item.classification,
        status: item.status,
        original: item
      }
    }));
  }

  private static transformPubMedData(data: any[]): OfficialDataResult[] {
    return data.map(item => ({
      id: `pubmed_${item.pubmed_id || Date.now()}`,
      source: 'pubmed' as const,
      title: item.title || `PubMed Article ${item.pubmed_id}`,
      content: item.abstract || 'Research publication from PubMed',
      url: `https://pubmed.ncbi.nlm.nih.gov/${item.pubmed_id}/`,
      publishedAt: item.published_at || new Date().toISOString(),
      dataType: 'research',
      relevanceScore: 0.8,
      metadata: {
        authors: item.authors,
        journal: item.journal,
        original: item
      }
    }));
  }

  private static prioritizeResults(results: OfficialDataResult[], limit: number): OfficialDataResult[] {
    return results
      .sort((a, b) => {
        const priorityA = this.API_PRIORITIES[a.source] || 999;
        const priorityB = this.API_PRIORITIES[b.source] || 999;
        
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        
        return b.relevanceScore - a.relevanceScore;
      })
      .slice(0, limit);
  }

  static async getAvailableSources(): Promise<ApiSource[]> {
    return SmartCacheService.get(
      'api_sources_status',
      'official:status',
      async () => {
        const sources: ApiSource[] = [
          {
            name: 'ANVISA',
            priority: 1,
            available: await this.checkSourceAvailability('anvisa'),
            lastSync: await this.getLastSync('anvisa'),
            records: await this.getRecordCount('anvisa')
          },
          {
            name: 'FDA',
            priority: 2,
            available: await this.checkSourceAvailability('fda'),
            lastSync: await this.getLastSync('fda'),
            records: await this.getRecordCount('fda')
          },
          {
            name: 'PubMed',
            priority: 3,
            available: await this.checkSourceAvailability('pubmed'),
            lastSync: await this.getLastSync('pubmed'),
            records: await this.getRecordCount('pubmed')
          }
        ];

        return sources;
      },
      300 // 5 minutes cache
    );
  }

  private static async checkSourceAvailability(source: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('api_configurations')
        .select('is_active')
        .eq('integration_name', source)
        .single();
      
      return data?.is_active || false;
    } catch {
      return false;
    }
  }

  private static async getLastSync(source: string): Promise<string | undefined> {
    try {
      const { data } = await supabase
        .from('api_configurations')
        .select('last_sync')
        .eq('integration_name', source)
        .single();
      
      return data?.last_sync;
    } catch {
      return undefined;
    }
  }

  private static async getRecordCount(source: string): Promise<number> {
    try {
      const { count } = await supabase
        .from('integration_data')
        .select('*', { count: 'exact' })
        .eq('source', source);
      
      return count || 0;
    } catch {
      return 0;
    }
  }

  static async syncAllSources(): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('comprehensive-integration-sync', {
        body: { force_sync: true }
      });

      if (error) throw error;

      return {
        success: true,
        message: `Sincronizado com sucesso: ${data?.synced_sources?.join(', ') || 'nenhuma fonte'}`
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erro na sincronização: ${error.message}`
      };
    }
  }
}
