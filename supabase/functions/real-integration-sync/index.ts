
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SyncRequest {
  source: string;
  api_key?: string;
  base_url?: string;
  force_sync?: boolean;
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

    const { source, api_key, base_url, force_sync }: SyncRequest = await req.json();
    
    console.log(`[REAL-SYNC] Starting real sync from: ${source}`);

    // Buscar configuração da API
    const { data: config, error: configError } = await supabaseClient
      .from('api_configurations')
      .select('*')
      .eq('integration_name', source)
      .single();

    if (configError || !config) {
      throw new Error(`Configuração não encontrada para: ${source}`);
    }

    if (!config.is_active) {
      throw new Error(`Integração ${source} está inativa`);
    }

    // Usar chaves da configuração ou as fornecidas
    const apiKey = api_key || config.api_key;
    const baseUrl = base_url || config.base_url;

    if (!apiKey || !baseUrl) {
      throw new Error(`Configuração incompleta para ${source}: faltam chave API ou URL base`);
    }

    // Fazer requisição real para a API externa
    let externalData = [];
    try {
      const response = await fetch(`${baseUrl}/api/v1/data`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API retornou erro: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      externalData = Array.isArray(data) ? data : [data];
    } catch (fetchError) {
      console.error(`Erro ao buscar dados de ${source}:`, fetchError);
      throw new Error(`Falha na conexão com ${source}: ${fetchError.message}`);
    }

    // Processar e armazenar dados
    const processedData = externalData.map(item => ({
      source,
      data_type: determineDataType(item, source),
      title: item.title || item.name || `Dados de ${source}`,
      description: item.description || item.summary || '',
      content: item,
      url: item.url || item.link,
      published_at: item.published_at || item.date || new Date().toISOString(),
      expires_at: item.expires_at || null,
    }));

    // Salvar no banco
    const { data: savedData, error: saveError } = await supabaseClient
      .from('integration_data')
      .upsert(processedData, { onConflict: 'source,title' });

    if (saveError) {
      throw saveError;
    }

    // Atualizar timestamp da última sincronização
    await supabaseClient
      .from('api_configurations')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', config.id);

    console.log(`[REAL-SYNC] Sync completed for ${source}: ${processedData.length} records`);

    return new Response(
      JSON.stringify({
        success: true,
        source,
        results: {
          successful: processedData.length,
          failed: 0,
          total: processedData.length,
        },
        data: processedData.slice(0, 5), // Preview dos primeiros 5
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[REAL-SYNC] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
})

function determineDataType(item: any, source: string): string {
  // Determinar tipo de dados baseado no conteúdo e fonte
  if (item.alert_type || item.severity) return 'regulatory_alert';
  if (item.funding_amount || item.grant_value) return 'funding_opportunity';
  if (item.patent_number || item.invention_title) return 'patent';
  if (item.market_size || item.industry_analysis) return 'market_analysis';
  if (item.research_area || item.publication_type) return 'research_publication';
  if (item.program_type || item.course_duration) return 'program';
  if (item.credit_line || item.interest_rate) return 'credit_line';
  
  // Fallback baseado na fonte
  switch (source.toLowerCase()) {
    case 'anvisa':
    case 'fda':
      return 'regulatory_alert';
    case 'finep':
    case 'bndes':
      return 'funding_opportunity';
    case 'inpi':
      return 'patent';
    case 'fiocruz':
    case 'embrapii':
      return 'research_publication';
    default:
      return 'general_data';
  }
}
