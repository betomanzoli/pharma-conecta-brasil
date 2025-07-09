import { supabase } from '@/integrations/supabase/client';

export class AnvisaRealApiService {
  
  // Sincronizar todos os dados da ANVISA
  static async syncAllData(): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('anvisa-real-api', {
        body: { action: 'sync_all' }
      });

      if (error) {
        console.error('Erro ao sincronizar dados da ANVISA:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro na sincronização completa:', error);
      throw error;
    }
  }

  // Sincronizar conjuntos de dados específicos
  static async syncConjuntosDados(): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('anvisa-real-api', {
        body: { action: 'sync_conjuntos_dados' }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao sincronizar conjuntos de dados:', error);
      throw error;
    }
  }

  // Sincronizar detalhe de um conjunto específico
  static async syncConjuntoDetalhe(conjuntoId: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('anvisa-real-api', {
        body: { 
          action: 'sync_conjunto_detalhe',
          endpoint: conjuntoId
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao sincronizar detalhe do conjunto:', error);
      throw error;
    }
  }

  // Buscar conjuntos de dados na base local
  static async getConjuntosDados(filters?: {
    organizacao?: string;
    categoria?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    try {
      let query = supabase
        .from('anvisa_conjuntos_dados')
        .select(`
          *,
          anvisa_recurso (
            id,
            nome,
            formato,
            url,
            tamanho_bytes,
            status
          )
        `);

      if (filters?.organizacao) {
        query = query.eq('organizacao', filters.organizacao);
      }

      if (filters?.categoria) {
        query = query.eq('categoria', filters.categoria);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.or(`titulo.ilike.%${filters.search}%,descricao.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
      }

      query = query.order('data_atualizacao', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar conjuntos de dados:', error);
      return [];
    }
  }

  // Buscar observância legal
  static async getObservanciaLegal(filters?: {
    tipo?: string;
    status?: string;
    search?: string;
  }): Promise<any[]> {
    try {
      let query = supabase.from('anvisa_observancia_legal').select('*');

      if (filters?.tipo) {
        query = query.eq('tipo_observancia', filters.tipo);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.or(`titulo.ilike.%${filters.search}%,descricao.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar observância legal:', error);
      return [];
    }
  }

  // Buscar organizações
  static async getOrganizacoes(filters?: {
    tipo?: string;
    status?: string;
    search?: string;
  }): Promise<any[]> {
    try {
      let query = supabase
        .from('anvisa_organizacoes')
        .select(`
          *,
          anvisa_organizacao_detalhe (*)
        `);

      if (filters?.tipo) {
        query = query.eq('tipo_organizacao', filters.tipo);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.or(`nome.ilike.%${filters.search}%,descricao.ilike.%${filters.search}%`);
      }

      query = query.order('nome', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar organizações:', error);
      return [];
    }
  }

  // Buscar reusos
  static async getReusos(filters?: {
    tipo?: string;
    categoria?: string;
    status?: string;
    search?: string;
  }): Promise<any[]> {
    try {
      let query = supabase
        .from('anvisa_reusos')
        .select(`
          *,
          anvisa_reuso_detalhe (*)
        `);

      if (filters?.tipo) {
        query = query.eq('tipo_reuso', filters.tipo);
      }

      if (filters?.categoria) {
        query = query.eq('categoria', filters.categoria);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.or(`titulo.ilike.%${filters.search}%,descricao.ilike.%${filters.search}%`);
      }

      query = query.order('data_criacao', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar reusos:', error);
      return [];
    }
  }

  // Buscar estatísticas gerais
  static async getEstatisticas(): Promise<any> {
    try {
      const [
        conjuntosData,
        organizacoesData,
        reusosData,
        observanciaData
      ] = await Promise.all([
        supabase.from('anvisa_conjuntos_dados').select('id', { count: 'exact' }),
        supabase.from('anvisa_organizacoes').select('id', { count: 'exact' }),
        supabase.from('anvisa_reusos').select('id', { count: 'exact' }),
        supabase.from('anvisa_observancia_legal').select('id', { count: 'exact' })
      ]);

      return {
        total_conjuntos: conjuntosData.count || 0,
        total_organizacoes: organizacoesData.count || 0,
        total_reusos: reusosData.count || 0,
        total_observancia: observanciaData.count || 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        total_conjuntos: 0,
        total_organizacoes: 0,
        total_reusos: 0,
        total_observancia: 0
      };
    }
  }

  // Buscar configuração da API
  static async getApiStatus(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('integration_name', 'anvisa_dados_gov_br')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar status da API:', error);
      return null;
    }
  }

  // Atualizar configuração da API
  static async updateApiConfig(config: {
    base_url?: string;
    is_active?: boolean;
    sync_frequency_hours?: number;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('api_configurations')
        .update({
          ...config,
          updated_at: new Date().toISOString()
        })
        .eq('integration_name', 'anvisa_dados_gov_br');

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configuração da API:', error);
      return false;
    }
  }
}