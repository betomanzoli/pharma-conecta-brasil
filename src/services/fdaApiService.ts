import { supabase } from '@/integrations/supabase/client';

export class FdaApiService {
  
  // Sincronizar todos os dados da FDA
  static async syncAllData(): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('fda-api', {
        body: { action: 'sync_all' }
      });

      if (error) {
        console.error('Erro ao sincronizar dados da FDA:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro na sincronização completa FDA:', error);
      throw error;
    }
  }

  // Sincronizar medicamentos específicos
  static async syncDrugs(search?: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('fda-api', {
        body: { 
          action: 'sync_drugs',
          search,
          limit: 100
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao sincronizar medicamentos FDA:', error);
      throw error;
    }
  }

  // Buscar medicamentos na base local
  static async getDrugs(filters?: {
    brand_name?: string;
    generic_name?: string;
    marketing_status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    try {
      let query = supabase.from('fda_drugs').select('*');

      if (filters?.brand_name) {
        query = query.ilike('brand_name', `%${filters.brand_name}%`);
      }

      if (filters?.generic_name) {
        query = query.ilike('generic_name', `%${filters.generic_name}%`);
      }

      if (filters?.marketing_status) {
        query = query.eq('marketing_status', filters.marketing_status);
      }

      if (filters?.search) {
        query = query.or(`brand_name.ilike.%${filters.search}%,generic_name.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar medicamentos FDA:', error);
      return [];
    }
  }

  // Buscar eventos adversos
  static async getAdverseEvents(filters?: {
    medicinalproduct?: string;
    serious?: string;
    search?: string;
    limit?: number;
  }): Promise<any[]> {
    try {
      let query = supabase.from('fda_adverse_events').select('*');

      if (filters?.medicinalproduct) {
        query = query.ilike('medicinalproduct', `%${filters.medicinalproduct}%`);
      }

      if (filters?.serious) {
        query = query.eq('serious', filters.serious);
      }

      if (filters?.search) {
        query = query.or(`medicinalproduct.ilike.%${filters.search}%,reaction_text.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar eventos adversos FDA:', error);
      return [];
    }
  }

  // Buscar recalls de alimentos
  static async getFoodEnforcement(filters?: {
    classification?: string;
    status?: string;
    search?: string;
    limit?: number;
  }): Promise<any[]> {
    try {
      let query = supabase.from('fda_food_enforcement').select('*');

      if (filters?.classification) {
        query = query.eq('classification', filters.classification);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.or(`product_description.ilike.%${filters.search}%,reason_for_recall.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      query = query.order('report_date', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar recalls de alimentos FDA:', error);
      return [];
    }
  }

  // Buscar eventos adversos de dispositivos
  static async getDeviceAdverseEvents(filters?: {
    device_class?: string;
    event_type?: string;
    search?: string;
    limit?: number;
  }): Promise<any[]> {
    try {
      let query = supabase.from('fda_device_adverse_events').select('*');

      if (filters?.device_class) {
        query = query.eq('device_class', filters.device_class);
      }

      if (filters?.event_type) {
        query = query.eq('event_type', filters.event_type);
      }

      if (filters?.search) {
        query = query.or(`device_name.ilike.%${filters.search}%,manufacturer_name.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar eventos adversos de dispositivos FDA:', error);
      return [];
    }
  }

  // Buscar estatísticas gerais da FDA
  static async getEstatisticas(): Promise<any> {
    try {
      const [
        drugsData,
        adverseEventsData,
        foodEnforcementData,
        deviceEventsData
      ] = await Promise.all([
        supabase.from('fda_drugs').select('id', { count: 'exact' }),
        supabase.from('fda_adverse_events').select('id', { count: 'exact' }),
        supabase.from('fda_food_enforcement').select('id', { count: 'exact' }),
        supabase.from('fda_device_adverse_events').select('id', { count: 'exact' })
      ]);

      return {
        total_drugs: drugsData.count || 0,
        total_adverse_events: adverseEventsData.count || 0,
        total_food_enforcement: foodEnforcementData.count || 0,
        total_device_events: deviceEventsData.count || 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas FDA:', error);
      return {
        total_drugs: 0,
        total_adverse_events: 0,
        total_food_enforcement: 0,
        total_device_events: 0
      };
    }
  }

  // Buscar configuração da API FDA
  static async getApiStatus(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('integration_name', 'fda_api')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar status da API FDA:', error);
      return null;
    }
  }
}