import { supabase } from "@/integrations/supabase/client";

export interface ANVISAAlert {
  id: string;
  title: string;
  description: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high';
  published_at: string;
  source: string;
  url?: string;
}

export interface ComplianceStatus {
  id: string;
  company_id?: string;
  compliance_type: string;
  status: 'compliant' | 'pending' | 'non_compliant';
  score: number;
  last_check: string;
  expires_at: string;
  details: {
    cnpj: string;
    analysis: string;
    checked_via: string;
    regulatory_items: string[];
  };
}

export interface ProductRegistration {
  registration_number: string;
  status: 'active' | 'inactive' | 'unknown';
  product_name: string;
  holder: string;
  analysis: string;
  checked_at: string;
}

class BrazilianRegulatoryService {
  async getANVISAAlerts(query?: string): Promise<ANVISAAlert[]> {
    try {
      const { data, error } = await supabase.functions.invoke('brazilian-regulatory-api', {
        body: {
          action: 'anvisa_alerts',
          query: query || 'medicamentos farmacêuticos'
        }
      });

      if (error) throw error;
      return data.alerts || [];
    } catch (error) {
      console.error('Error fetching ANVISA alerts:', error);
      throw new Error('Erro ao buscar alertas da ANVISA');
    }
  }

  async checkCompanyCompliance(cnpj: string): Promise<ComplianceStatus> {
    try {
      // Validar formato do CNPJ
      const cleanCNPJ = cnpj.replace(/\D/g, '');
      if (cleanCNPJ.length !== 14) {
        throw new Error('CNPJ deve ter 14 dígitos');
      }

      const { data, error } = await supabase.functions.invoke('brazilian-regulatory-api', {
        body: {
          action: 'company_compliance',
          cnpj: cleanCNPJ
        }
      });

      if (error) throw error;
      return data.compliance;
    } catch (error) {
      console.error('Error checking company compliance:', error);
      throw new Error('Erro ao verificar compliance da empresa');
    }
  }

  async checkProductRegistration(registrationNumber: string): Promise<ProductRegistration> {
    try {
      const { data, error } = await supabase.functions.invoke('brazilian-regulatory-api', {
        body: {
          action: 'product_registration',
          registrationNumber
        }
      });

      if (error) throw error;
      return data.product;
    } catch (error) {
      console.error('Error checking product registration:', error);
      throw new Error('Erro ao verificar registro do produto');
    }
  }

  async getCachedAlerts(): Promise<ANVISAAlert[]> {
    try {
      const { data, error } = await supabase
        .from('regulatory_alerts')
        .select('*')
        .eq('source', 'ANVISA')
        .order('published_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []).map(alert => ({
        ...alert,
        severity: alert.severity as 'low' | 'medium' | 'high'
      }));
    } catch (error) {
      console.error('Error fetching cached alerts:', error);
      return [];
    }
  }

  async getComplianceHistory(companyId: string): Promise<ComplianceStatus[]> {
    try {
      const { data, error } = await supabase
        .from('compliance_tracking')
        .select('*')
        .eq('company_id', companyId)
        .order('last_check', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'compliant' | 'pending' | 'non_compliant',
        details: item.details as any
      }));
    } catch (error) {
      console.error('Error fetching compliance history:', error);
      return [];
    }
  }

  formatCNPJ(cnpj: string): string {
    const clean = cnpj.replace(/\D/g, '');
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  validateCNPJ(cnpj: string): boolean {
    const clean = cnpj.replace(/\D/g, '');
    
    if (clean.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(clean)) return false; // Todos os dígitos iguais
    
    // Algoritmo de validação do CNPJ
    let sum = 0;
    let pos = 5;
    
    for (let i = 0; i < 12; i++) {
      sum += parseInt(clean.charAt(i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(clean.charAt(12))) return false;
    
    sum = 0;
    pos = 6;
    
    for (let i = 0; i < 13; i++) {
      sum += parseInt(clean.charAt(i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    return result === parseInt(clean.charAt(13));
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  }

  getSeverityLabel(severity: string): string {
    switch (severity) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Não definida';
    }
  }

  getComplianceStatusColor(status: string): string {
    switch (status) {
      case 'compliant': return 'default';
      case 'pending': return 'secondary';
      case 'non_compliant': return 'destructive';
      default: return 'outline';
    }
  }

  getComplianceStatusLabel(status: string): string {
    switch (status) {
      case 'compliant': return 'Conforme';
      case 'pending': return 'Pendente';
      case 'non_compliant': return 'Não conforme';
      default: return 'Desconhecido';
    }
  }
}

export const brazilianRegulatoryService = new BrazilianRegulatoryService();