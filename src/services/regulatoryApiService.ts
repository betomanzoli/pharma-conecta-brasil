
import { supabase } from '@/integrations/supabase/client';

interface RegulatoryApiResponse {
  alerts: Array<{
    title: string;
    description: string;
    alert_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    source: string;
    url?: string;
  }>;
  compliance_status?: {
    cnpj: string;
    status: 'compliant' | 'partial' | 'non-compliant';
    score: number;
    last_updated: string;
  };
}

export class RegulatoryApiService {
  private static readonly ANVISA_BASE_URL = 'https://consultas.anvisa.gov.br/api';
  private static readonly RECEITA_BASE_URL = 'https://www.receitafederal.fazenda.gov.br/api';

  static async syncRegulatoryAlerts(source: string = 'anvisa'): Promise<RegulatoryApiResponse> {
    try {
      // Chamar a edge function para sincronizar alertas
      const { data, error } = await supabase.functions.invoke('regulatory-sync', {
        body: { source }
      });

      if (error) {
        console.error('Erro ao sincronizar alertas regulatórios:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro na sincronização:', error);
      throw error;
    }
  }

  static async checkComplianceStatus(cnpj: string): Promise<any> {
    try {
      // Simular verificação de compliance em múltiplas fontes
      const checks = await Promise.allSettled([
        this.checkAnvisaCompliance(cnpj),
        this.checkReceitaFederalCompliance(cnpj),
        this.checkEnvironmentalCompliance(cnpj)
      ]);

      const results = checks.map((check, index) => ({
        source: ['anvisa', 'receita_federal', 'ambiental'][index],
        status: check.status === 'fulfilled' ? 'success' : 'error',
        data: check.status === 'fulfilled' ? check.value : null,
        error: check.status === 'rejected' ? check.reason : null
      }));

      return {
        cnpj,
        checks: results,
        overall_score: this.calculateOverallScore(results),
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro na verificação de compliance:', error);
      throw error;
    }
  }

  private static async checkAnvisaCompliance(cnpj: string) {
    // Simulação de verificação ANVISA
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      authorization: 'valid',
      license: 'active',
      expires_at: '2025-12-31',
      status: 'compliant'
    };
  }

  private static async checkReceitaFederalCompliance(cnpj: string) {
    // Simulação de verificação Receita Federal
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      fiscal_status: 'regular',
      debts: false,
      certifications: ['CND', 'FGTS'],
      status: 'compliant'
    };
  }

  private static async checkEnvironmentalCompliance(cnpj: string) {
    // Simulação de verificação ambiental
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      environmental_license: 'expired',
      expires_at: '2024-10-01',
      status: 'non-compliant'
    };
  }

  private static calculateOverallScore(results: any[]): number {
    const compliantCount = results.filter(r => 
      r.status === 'success' && r.data?.status === 'compliant'
    ).length;
    
    return Math.round((compliantCount / results.length) * 100);
  }

  static async getLatestAlerts(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('regulatory_alerts')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      return [];
    }
  }

  static async subscribeToAlerts(callback: (alert: any) => void) {
    return supabase
      .channel('regulatory-alerts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'regulatory_alerts' },
        callback
      )
      .subscribe();
  }
}
