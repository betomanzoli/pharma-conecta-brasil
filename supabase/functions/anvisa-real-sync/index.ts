import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logStep = (step: string, details?: any) => {
  console.log(`[${new Date().toISOString()}] ${step}`, details || '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('ANVISA Real Sync - Starting');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { syncType, filters } = await req.json();
    logStep('Sync parameters', { syncType, filters });

    let results = {};

    switch (syncType) {
      case 'medicamentos':
        results = await syncMedicamentos(supabase);
        break;
      case 'alertas':
        results = await syncAlertas(supabase);
        break;
      case 'laboratorios':
        results = await syncLaboratorios(supabase);
        break;
      case 'all':
        results = await syncAll(supabase);
        break;
      default:
        throw new Error('Invalid sync type');
    }

    logStep('Sync completed', { syncType, resultsCount: Object.keys(results).length });

    return new Response(JSON.stringify({
      success: true,
      syncType,
      results,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logStep('Error in ANVISA sync', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncMedicamentos(supabase: any) {
  logStep('Syncing medicamentos from ANVISA');
  
  // Consulta real à API da ANVISA
  const response = await fetch('https://consultas.anvisa.gov.br/api/consulta/medicamentos', {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'PharmaConnect/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`ANVISA API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Processar e inserir dados
  const processedData = data.content?.map((item: any) => ({
    external_id: item.numeroRegistro,
    nome_comercial: item.nomeComercial,
    principio_ativo: item.principioAtivo,
    laboratorio: item.empresa,
    categoria: item.categoria,
    status_registro: item.situacaoRegistro,
    data_vencimento: item.dataVencimento,
    anvisa_data: item
  })) || [];

  // Inserir no banco
  const { data: insertedData, error } = await supabase
    .from('anvisa_medicamentos')
    .upsert(processedData, { onConflict: 'external_id' });

  if (error) {
    logStep('Error inserting medicamentos', error);
    throw error;
  }

  return { medicamentos: processedData.length };
}

async function syncAlertas(supabase: any) {
  logStep('Syncing alertas from ANVISA');
  
  const response = await fetch('https://consultas.anvisa.gov.br/api/consulta/alertas', {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'PharmaConnect/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`ANVISA API error: ${response.status}`);
  }

  const data = await response.json();
  
  const processedData = data.content?.map((item: any) => ({
    external_id: item.id,
    titulo: item.titulo,
    descricao: item.descricao,
    tipo_alerta: item.tipoAlerta,
    severidade: item.severidade || 'medium',
    data_publicacao: item.dataPublicacao,
    url_completa: item.url,
    anvisa_data: item
  })) || [];

  const { data: insertedData, error } = await supabase
    .from('regulatory_alerts')
    .upsert(processedData.map(item => ({
      source: 'anvisa',
      title: item.titulo,
      description: item.descricao,
      alert_type: item.tipo_alerta,
      severity: item.severidade,
      published_at: item.data_publicacao,
      url: item.url_completa
    })), { onConflict: 'source,title' });

  if (error) {
    logStep('Error inserting alertas', error);
    throw error;
  }

  return { alertas: processedData.length };
}

async function syncLaboratorios(supabase: any) {
  logStep('Syncing laboratórios from ANVISA');
  
  const response = await fetch('https://consultas.anvisa.gov.br/api/consulta/empresas', {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'PharmaConnect/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`ANVISA API error: ${response.status}`);
  }

  const data = await response.json();
  
  const processedData = data.content?.map((item: any) => ({
    external_id: item.cnpj,
    nome: item.razaoSocial,
    cnpj: item.cnpj,
    endereco: item.endereco,
    cidade: item.cidade,
    estado: item.uf,
    cep: item.cep,
    situacao: item.situacao,
    atividades: item.atividades || [],
    anvisa_data: item
  })) || [];

  const { data: insertedData, error } = await supabase
    .from('anvisa_laboratorios')
    .upsert(processedData, { onConflict: 'external_id' });

  if (error) {
    logStep('Error inserting laboratórios', error);
    throw error;
  }

  return { laboratorios: processedData.length };
}

async function syncAll(supabase: any) {
  logStep('Starting full ANVISA sync');
  
  const results = await Promise.allSettled([
    syncMedicamentos(supabase),
    syncAlertas(supabase),
    syncLaboratorios(supabase)
  ]);

  const finalResults = {
    medicamentos: results[0].status === 'fulfilled' ? results[0].value : { error: results[0].reason },
    alertas: results[1].status === 'fulfilled' ? results[1].value : { error: results[1].reason },
    laboratorios: results[2].status === 'fulfilled' ? results[2].value : { error: results[2].reason }
  };

  // Atualizar timestamp da última sincronização
  await supabase
    .from('api_configurations')
    .upsert({
      integration_name: 'anvisa_real',
      last_sync: new Date().toISOString(),
      is_active: true
    }, { onConflict: 'integration_name' });

  return finalResults;
}