
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IntegrationRequest {
  source: string;
  force_sync?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Set search path for security
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const { source, force_sync = false }: IntegrationRequest = await req.json();
    
    console.log(`Iniciando sincronização para fonte: ${source}`);

    // Verificar se a sincronização é necessária
    if (!force_sync) {
      const { data: lastSync } = await supabase
        .from('api_configurations')
        .select('last_sync, sync_frequency_hours')
        .eq('integration_name', source)
        .eq('is_active', true)
        .single();

      if (lastSync?.last_sync) {
        const lastSyncTime = new Date(lastSync.last_sync).getTime();
        const now = Date.now();
        const hoursSinceSync = (now - lastSyncTime) / (1000 * 60 * 60);
        
        if (hoursSinceSync < (lastSync.sync_frequency_hours || 24)) {
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Sincronização não necessária ainda',
              last_sync: lastSync.last_sync
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    let syncResult;
    
    switch (source) {
      case 'anvisa':
        syncResult = await syncAnvisa(supabase);
        break;
      case 'fda':
        syncResult = await syncFDA(supabase);
        break;
      case 'regulatory_alerts':
        syncResult = await syncRegulatoryAlerts(supabase);
        break;
      default:
        throw new Error(`Fonte não suportada: ${source}`);
    }

    // Atualizar timestamp de última sincronização
    await supabase
      .from('api_configurations')
      .update({ 
        last_sync: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('integration_name', source);

    // Log da sincronização
    await supabase
      .from('performance_metrics')
      .insert({
        metric_name: 'integration_sync',
        metric_value: 1,
        metric_unit: 'sync',
        tags: {
          source,
          records_synced: syncResult.records_synced,
          duration_ms: syncResult.duration_ms,
          status: 'success'
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        source,
        ...syncResult
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro na sincronização:', error);
    
    // Log do erro
    await supabase
      .from('performance_metrics')
      .insert({
        metric_name: 'integration_sync_error',
        metric_value: 1,
        metric_unit: 'error',
        tags: {
          error_message: error.message,
          source: source || 'unknown'
        }
      });

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})

async function syncAnvisa(supabase: any) {
  const startTime = Date.now();
  console.log('Iniciando sincronização ANVISA...');
  
  try {
    // Simular busca de dados da ANVISA (em produção, usar API real)
    const mockAnvisaData = [
      {
        source: 'anvisa',
        data_type: 'regulatory_alert',
        title: 'Nova Resolução RDC 485/2025',
        description: 'Estabelece critérios para registro de medicamentos biológicos',
        content: {
          regulation_number: 'RDC 485/2025',
          category: 'medicamentos_biologicos',
          effective_date: '2025-03-01'
        },
        published_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() // 180 dias
      },
      {
        source: 'anvisa',
        data_type: 'regulatory_alert',
        title: 'Alteração nos Prazos de Análise',
        description: 'Novos prazos para análise de pedidos de registro sanitário',
        content: {
          new_timeframes: {
            medicamentos_novos: '365 dias',
            medicamentos_genericos: '180 dias',
            medicamentos_similares: '240 dias'
          },
          effective_date: '2025-02-15'
        },
        published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 dias
      }
    ];

    // Inserir dados na tabela integration_data
    const { data, error } = await supabase
      .from('integration_data')
      .upsert(mockAnvisaData, { 
        onConflict: 'source,data_type,title' 
      });

    if (error) throw error;

    const duration = Date.now() - startTime;
    console.log(`Sincronização ANVISA concluída: ${mockAnvisaData.length} registros em ${duration}ms`);

    return {
      records_synced: mockAnvisaData.length,
      duration_ms: duration,
      data_types: ['regulatory_alert']
    };

  } catch (error) {
    console.error('Erro na sincronização ANVISA:', error);
    throw error;
  }
}

async function syncFDA(supabase: any) {
  const startTime = Date.now();
  console.log('Iniciando sincronização FDA...');
  
  try {
    // Simular busca de dados do FDA
    const mockFdaData = [
      {
        source: 'fda',
        data_type: 'drug_approval',
        title: 'New Drug Application Approved: EXAMPLE-001',
        description: 'FDA approves new treatment for rare genetic disorder',
        content: {
          application_number: 'NDA 999999',
          drug_name: 'ExampleDrug',
          indication: 'Rare genetic metabolic disorder',
          approval_date: new Date().toISOString(),
          manufacturer: 'Example Pharmaceuticals Inc.'
        },
        published_at: new Date().toISOString(),
        url: 'https://www.fda.gov/drugs/news-events-human-drugs/example-approval'
      },
      {
        source: 'fda',
        data_type: 'safety_alert',
        title: 'Safety Communication: Risk of Serious Side Effects',
        description: 'FDA warns of potential cardiovascular risks with certain medications',
        content: {
          affected_drugs: ['Drug A', 'Drug B'],
          risk_level: 'moderate',
          recommended_actions: [
            'Monitor patients closely',
            'Consider alternative treatments',
            'Report adverse events'
          ]
        },
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
        url: 'https://www.fda.gov/safety/medical-product-safety-information/example-safety-alert'
      }
    ];

    const { data, error } = await supabase
      .from('integration_data')
      .upsert(mockFdaData, { 
        onConflict: 'source,data_type,title' 
      });

    if (error) throw error;

    const duration = Date.now() - startTime;
    console.log(`Sincronização FDA concluída: ${mockFdaData.length} registros em ${duration}ms`);

    return {
      records_synced: mockFdaData.length,
      duration_ms: duration,
      data_types: ['drug_approval', 'safety_alert']
    };

  } catch (error) {
    console.error('Erro na sincronização FDA:', error);
    throw error;
  }
}

async function syncRegulatoryAlerts(supabase: any) {
  const startTime = Date.now();
  console.log('Sincronizando alertas regulatórios consolidados...');
  
  try {
    // Buscar dados recentes de todas as fontes
    const { data: recentData, error } = await supabase
      .from('integration_data')
      .select('*')
      .in('data_type', ['regulatory_alert', 'safety_alert', 'drug_approval'])
      .gte('published_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // últimos 7 dias
      .order('published_at', { ascending: false });

    if (error) throw error;

    // Processar e consolidar alertas
    const consolidatedAlerts = recentData?.map(item => ({
      source: item.source,
      title: item.title,
      description: item.description,
      alert_type: item.data_type,
      severity: determineSeverity(item),
      published_at: item.published_at,
      expires_at: item.expires_at,
      url: item.url
    })) || [];

    // Inserir na tabela de alertas regulatórios
    if (consolidatedAlerts.length > 0) {
      const { error: insertError } = await supabase
        .from('regulatory_alerts')
        .upsert(consolidatedAlerts, { 
          onConflict: 'source,title,published_at' 
        });

      if (insertError) throw insertError;
    }

    const duration = Date.now() - startTime;
    console.log(`Consolidação de alertas concluída: ${consolidatedAlerts.length} alertas em ${duration}ms`);

    return {
      records_synced: consolidatedAlerts.length,
      duration_ms: duration,
      data_types: ['consolidated_alerts']
    };

  } catch (error) {
    console.error('Erro na consolidação de alertas:', error);
    throw error;
  }
}

function determineSeverity(item: any): 'low' | 'medium' | 'high' | 'critical' {
  // Lógica simples para determinar severidade baseada no conteúdo
  const content = JSON.stringify(item.content).toLowerCase();
  const title = item.title.toLowerCase();
  const description = item.description.toLowerCase();
  
  const criticalKeywords = ['recall', 'death', 'fatal', 'critical', 'emergency'];
  const highKeywords = ['warning', 'serious', 'adverse', 'safety'];
  const mediumKeywords = ['caution', 'monitor', 'risk'];
  
  const text = `${title} ${description} ${content}`;
  
  if (criticalKeywords.some(keyword => text.includes(keyword))) {
    return 'critical';
  } else if (highKeywords.some(keyword => text.includes(keyword))) {
    return 'high';
  } else if (mediumKeywords.some(keyword => text.includes(keyword))) {
    return 'medium';
  } else {
    return 'low';
  }
}
