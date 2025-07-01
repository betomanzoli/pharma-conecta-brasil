
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IntegrationRequest {
  source: string;
  category?: string;
  force_sync?: boolean;
}

interface IntegrationData {
  source: string;
  category: string;
  data_type: string;
  title: string;
  description: string;
  url?: string;
  published_at: string;
  metadata: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { source, category, force_sync }: IntegrationRequest = await req.json();
    
    console.log(`[INTEGRATION-SYNC] Starting sync from source: ${source}`);

    let syncResults: IntegrationData[] = [];

    // Simulação de coleta de dados para cada fonte
    switch (source) {
      case 'anvisa':
        syncResults = await syncAnvisaData();
        break;
      case 'fda':
        syncResults = await syncFDAData();
        break;
      case 'inpi':
        syncResults = await syncINPIData();
        break;
      case 'finep':
        syncResults = await syncFINEPData();
        break;
      case 'bndes':
        syncResults = await syncBNDESData();
        break;
      case 'sebrae':
        syncResults = await syncSEBRAEData();
        break;
      case 'sindusfarma':
        syncResults = await syncSINDUSFARMAData();
        break;
      case 'abifina':
        syncResults = await syncABIFINAData();
        break;
      case 'fiocruz':
        syncResults = await syncFIOCRUZData();
        break;
      case 'embrapii':
        syncResults = await syncEMBRAPIIData();
        break;
      case 'butantan':
        syncResults = await syncBUTANTANData();
        break;
      case 'cni':
        syncResults = await syncCNIData();
        break;
      case 'fiesp':
        syncResults = await syncFIESPData();
        break;
      case 'all':
        // Sincronizar todas as fontes principais
        const allSources = ['anvisa', 'fda', 'inpi', 'finep', 'bndes', 'sindusfarma', 'fiocruz', 'embrapii'];
        for (const src of allSources) {
          const data = await syncBySource(src);
          syncResults.push(...data);
        }
        break;
      default:
        syncResults = await syncBySource(source);
    }

    console.log(`[INTEGRATION-SYNC] Collected ${syncResults.length} records from ${source}`);

    // Armazenar os dados coletados
    const successful = [];
    const failed = [];

    for (const item of syncResults) {
      try {
        // Aqui você salvaria em uma tabela específica para dados das integrações
        // Por enquanto, vamos usar a tabela regulatory_alerts como exemplo
        if (item.data_type === 'regulatory_alert') {
          const { data, error } = await supabaseClient
            .from('regulatory_alerts')
            .upsert({
              title: item.title,
              description: item.description,
              source: item.source,
              alert_type: item.metadata.alert_type || 'general',
              severity: item.metadata.severity || 'medium',
              url: item.url,
              published_at: item.published_at,
            });

          if (error) throw error;
        }
        
        successful.push(item);
      } catch (error) {
        console.error(`Error saving item from ${item.source}:`, error);
        failed.push({ item, error: error.message });
      }
    }

    console.log(`[INTEGRATION-SYNC] Sync completed - Success: ${successful.length}, Failed: ${failed.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        source,
        results: {
          successful: successful.length,
          failed: failed.length,
          total: syncResults.length,
          data: successful.slice(0, 10) // Retorna apenas os primeiros 10 para preview
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('[INTEGRATION-SYNC] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

// Funções específicas para cada fonte de dados
async function syncAnvisaData(): Promise<IntegrationData[]> {
  return [
    {
      source: 'anvisa',
      category: 'Reguladores Nacionais',
      data_type: 'regulatory_alert',
      title: 'Nova RDC sobre Medicamentos Genéricos',
      description: 'Resolução que estabelece novos critérios para registro de medicamentos genéricos',
      published_at: new Date().toISOString(),
      metadata: { alert_type: 'regulation', severity: 'high' }
    },
    {
      source: 'anvisa',
      category: 'Reguladores Nacionais',
      data_type: 'regulatory_alert',
      title: 'Alerta sobre Lote de Medicamento Contaminado',
      description: 'Recall de lote específico devido a contaminação detectada',
      published_at: new Date().toISOString(),
      metadata: { alert_type: 'recall', severity: 'critical' }
    }
  ];
}

async function syncFDAData(): Promise<IntegrationData[]> {
  return [
    {
      source: 'fda',
      category: 'Reguladores Internacionais',
      data_type: 'regulatory_alert',
      title: 'FDA Approves New Drug for Rare Disease',
      description: 'FDA has approved a breakthrough therapy for treating rare genetic disorders',
      published_at: new Date().toISOString(),
      metadata: { alert_type: 'approval', severity: 'medium' }
    }
  ];
}

async function syncINPIData(): Promise<IntegrationData[]> {
  return [
    {
      source: 'inpi',
      category: 'Reguladores Nacionais',
      data_type: 'patent',
      title: 'Patente de Novo Composto Farmacêutico',
      description: 'Registro de patente para composto inovador no tratamento de diabetes',
      published_at: new Date().toISOString(),
      metadata: { patent_type: 'pharmaceutical', status: 'granted' }
    }
  ];
}

async function syncFINEPData(): Promise<IntegrationData[]> {
  return [
    {
      source: 'finep',
      category: 'Financiamento e Fomento',
      data_type: 'funding_opportunity',
      title: 'Edital de Inovação em Biotecnologia',
      description: 'Chamada pública para projetos de pesquisa em biotecnologia farmacêutica',
      published_at: new Date().toISOString(),
      metadata: { funding_amount: '5000000', deadline: '2024-12-31' }
    }
  ];
}

async function syncBNDESData(): Promise<IntegrationData[]> {
  return [
    {
      source: 'bndes',
      category: 'Financiamento e Fomento',
      data_type: 'credit_line',
      title: 'Linha de Crédito para Indústria Farmacêutica',
      description: 'Nova linha de financiamento com juros subsidiados para expansão industrial',
      published_at: new Date().toISOString(),
      metadata: { interest_rate: '3.5', max_amount: '50000000' }
    }
  ];
}

async function syncSEBRAEData(): Promise<IntegrationData[]> {
  return [
    {
      source: 'sebrae',
      category: 'Financiamento e Fomento',
      data_type: 'program',
      title: 'Programa de Capacitação para Farmácias',
      description: 'Curso de gestão e inovação para pequenas farmácias',
      published_at: new Date().toISOString(),
      metadata: { program_type: 'training', duration: '40 horas' }
    }
  ];
}

async function syncSINDUSFARMAData(): Promise<IntegrationData[]> {
  return [
    {
      source: 'sindusfarma',
      category: 'Associações Setoriais',
      data_type: 'industry_report',
      title: 'Relatório Setorial do 3º Trimestre',
      description: 'Análise do desempenho da indústria farmacêutica brasileira',
      published_at: new Date().toISOString(),
      metadata: { report_type: 'quarterly', growth_rate: '8.5%' }
    }
  ];
}

async function syncABIFINAData(): Promise<IntegrationData[]> {
  return [
    {
      source: 'abifina',
      category: 'Associações Setoriais',
      data_type: 'market_analysis',
      title: 'Análise do Mercado de Química Fina',
      description: 'Perspectivas e tendências do setor de química fina farmacêutica',
      published_at: new Date().toISOString(),
      metadata: { market_size: '2.3 bilhões', growth_projection: '12%' }
    }
  ];
}

async function syncFIOCRUZData(): Promise<IntegrationData[]> {
  return [
    {
      source: 'fiocruz',
      category: 'Pesquisa e Inovação',
      data_type: 'research_publication',
      title: 'Pesquisa sobre Novos Antivirais',
      description: 'Estudo sobre eficácia de compostos antivirais em desenvolvimento',
      published_at: new Date().toISOString(),
      metadata: { research_area: 'antivirals', publication_type: 'journal' }
    }
  ];
}

async function syncEMBRAPIIData(): Promise<IntegrationData[]> {
  return [
    {
      source: 'embrapii',
      category: 'Pesquisa e Inovação',
      data_type: 'innovation_project',
      title: 'Projeto de Desenvolvimento de Biofármacos',
      description: 'Parceria para desenvolvimento de medicamentos biológicos',
      published_at: new Date().toISOString(),
      metadata: { project_value: '2500000', duration: '24 meses' }
    }
  ];
}

async function syncBUTANTANData(): Promise<IntegrationData[]> {
  return [
    {
      source: 'butantan',
      category: 'Pesquisa e Inovação',
      data_type: 'vaccine_research',
      title: 'Desenvolvimento de Nova Vacina',
      description: 'Pesquisa em estágio avançado para vacina contra dengue',
      published_at: new Date().toISOString(),
      metadata: { vaccine_type: 'dengue', phase: 'III' }
    }
  ];
}

async function syncCNIData(): Promise<IntegrationData[]> {
  return [
    {
      source: 'cni',
      category: 'Entidades Industriais',
      data_type: 'industrial_indicator',
      title: 'Indicadores da Indústria Farmacêutica',
      description: 'Dados de produção e emprego no setor farmacêutico',
      published_at: new Date().toISOString(),
      metadata: { production_growth: '6.2%', employment_growth: '3.1%' }
    }
  ];
}

async function syncFIESPData(): Promise<IntegrationData[]> {
  return [
    {
      source: 'fiesp',
      category: 'Entidades Industriais',
      data_type: 'regional_report',
      title: 'Relatório da Indústria Paulista',
      description: 'Desempenho da indústria farmacêutica no estado de São Paulo',
      published_at: new Date().toISOString(),
      metadata: { state: 'SP', sector_share: '35%' }
    }
  ];
}

async function syncBySource(source: string): Promise<IntegrationData[]> {
  // Função genérica para fontes não implementadas especificamente
  return [
    {
      source,
      category: 'Outros',
      data_type: 'general_data',
      title: `Dados de ${source.toUpperCase()}`,
      description: `Informações coletadas da fonte ${source}`,
      published_at: new Date().toISOString(),
      metadata: { sync_type: 'automatic' }
    }
  ];
}
