
import { supabase } from '@/integrations/supabase/client';

export interface IntegrationData {
  id: string;
  source: string;
  data_type: string;
  title: string;
  description: string;
  content: any;
  url?: string;
  published_at: string;
  expires_at?: string;
  created_at: string;
}

export class RealIntegrationService {
  static async getIntegrationData(source?: string, dataType?: string): Promise<IntegrationData[]> {
    try {
      let query = supabase
        .from('integration_data')
        .select('*')
        .order('published_at', { ascending: false });

      if (source) {
        query = query.eq('source', source);
      }

      if (dataType) {
        query = query.eq('data_type', dataType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar dados de integração:', error);
      return [];
    }
  }

  static async getRegulatoryAlerts(): Promise<IntegrationData[]> {
    return this.getIntegrationData(undefined, 'regulatory_alert');
  }

  static async getFundingOpportunities(): Promise<IntegrationData[]> {
    return this.getIntegrationData(undefined, 'funding_opportunity');
  }

  static async getPatentData(): Promise<IntegrationData[]> {
    return this.getIntegrationData(undefined, 'patent');
  }

  static async getMarketAnalysis(): Promise<IntegrationData[]> {
    return this.getIntegrationData(undefined, 'market_analysis');
  }

  static async getResearchPublications(): Promise<IntegrationData[]> {
    return this.getIntegrationData(undefined, 'research_publication');
  }

  static async getActiveIntegrations(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar integrações ativas:', error);
      return [];
    }
  }

  static async syncIntegration(source: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('comprehensive-integration-sync', {
        body: { source, force_sync: true }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro na sincronização:', error);
      throw error;
    }
  }
}
