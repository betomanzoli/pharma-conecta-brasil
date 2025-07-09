import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANVISA-REAL-API] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("ANVISA Real API request received");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { endpoint, action = 'sync_all' } = await req.json();

    // Buscar configurações da API
    const { data: apiConfig } = await supabase
      .from('api_configurations')
      .select('*')
      .eq('integration_name', 'anvisa_dados_gov_br')
      .eq('is_active', true)
      .single();

    if (!apiConfig) {
      throw new Error('Configuração da API ANVISA não encontrada ou inativa');
    }

    const baseUrl = apiConfig.base_url;
    logStep("Using API configuration", { baseUrl });

    // Implementar cada endpoint da ANVISA
    switch (action) {
      case 'sync_conjuntos_dados':
        return await syncConjuntosDados(supabase, baseUrl);
      
      case 'sync_conjunto_detalhe':
        return await syncConjuntoDetalhe(supabase, baseUrl, endpoint);
      
      case 'sync_observancia_legal':
        return await syncObservanciaLegal(supabase, baseUrl);
      
      case 'sync_ods':
        return await syncODS(supabase, baseUrl);
      
      case 'sync_formatos':
        return await syncFormatos(supabase, baseUrl);
      
      case 'sync_solicitacoes':
        return await syncSolicitacoes(supabase, baseUrl);
      
      case 'sync_organizacoes':
        return await syncOrganizacoes(supabase, baseUrl);
      
      case 'sync_organizacao_detalhe':
        return await syncOrganizacaoDetalhe(supabase, baseUrl, endpoint);
      
      case 'sync_temas':
        return await syncTemas(supabase, baseUrl);
      
      case 'sync_reusos':
        return await syncReusos(supabase, baseUrl);
      
      case 'sync_reuso_detalhe':
        return await syncReusoDetalhe(supabase, baseUrl, endpoint);
      
      case 'sync_reusos_pendentes':
        return await syncReusosPendentes(supabase, baseUrl, endpoint);
      
      case 'sync_all':
        return await syncAllEndpoints(supabase, baseUrl);
      
      default:
        throw new Error(`Ação não reconhecida: ${action}`);
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in ANVISA Real API", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Função para sincronizar conjuntos de dados
async function syncConjuntosDados(supabase: any, baseUrl: string) {
  logStep("Sincronizando conjuntos de dados");
  
  const url = `${baseUrl}/publico/conjuntos-dados`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar conjuntos de dados: ${response.statusText}`);
  }
  
  const data = await response.json();
  const results = [];
  
  for (const item of data.result || []) {
    const conjuntoData = {
      external_id: item.id,
      titulo: item.title || item.name,
      descricao: item.notes || item.description,
      organizacao: item.organization?.title || item.organization?.name,
      categoria: item.groups?.[0]?.name,
      tags: item.tags?.map((tag: any) => tag.name) || [],
      data_criacao: item.created ? new Date(item.created) : null,
      data_atualizacao: item.last_modified ? new Date(item.last_modified) : null,
      recursos_count: item.num_resources || 0,
      status: item.state === 'active' ? 'ativo' : 'inativo',
      metadados: {
        author: item.author,
        author_email: item.author_email,
        license_id: item.license_id,
        license_title: item.license_title,
        private: item.private,
        version: item.version,
        url: item.url
      }
    };
    
    const { data: inserted, error } = await supabase
      .from('anvisa_conjuntos_dados')
      .upsert(conjuntoData, { onConflict: 'external_id' })
      .select()
      .single();
    
    if (error) {
      logStep("Erro ao inserir conjunto de dados", { error: error.message });
    } else {
      results.push(inserted);
      
      // Sincronizar recursos do conjunto
      if (item.resources && item.resources.length > 0) {
        for (const resource of item.resources) {
          await syncRecurso(supabase, inserted.id, resource);
        }
      }
    }
  }
  
  logStep("Conjuntos de dados sincronizados", { count: results.length });
  
  return new Response(JSON.stringify({
    success: true,
    synced_count: results.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar detalhes de um conjunto específico
async function syncConjuntoDetalhe(supabase: any, baseUrl: string, conjuntoId: string) {
  logStep("Sincronizando detalhe do conjunto", { conjuntoId });
  
  const url = `${baseUrl}/publico/conjuntos-dados/${conjuntoId}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar detalhe do conjunto: ${response.statusText}`);
  }
  
  const data = await response.json();
  const item = data.result;
  
  if (!item) {
    throw new Error('Conjunto de dados não encontrado');
  }
  
  // Buscar o conjunto na nossa base
  const { data: conjunto } = await supabase
    .from('anvisa_conjuntos_dados')
    .select('id')
    .eq('external_id', conjuntoId)
    .single();
  
  if (!conjunto) {
    throw new Error('Conjunto não encontrado na base local');
  }
  
  const results = [];
  
  // Sincronizar recursos detalhados
  if (item.resources) {
    for (const resource of item.resources) {
      const recursoData = {
        conjunto_id: conjunto.id,
        external_id: resource.id,
        nome: resource.name,
        descricao: resource.description,
        formato: resource.format,
        url: resource.url,
        tamanho_bytes: resource.size ? parseInt(resource.size) : null,
        hash_arquivo: resource.hash,
        ultima_modificacao: resource.last_modified ? new Date(resource.last_modified) : null,
        status: 'ativo',
        metadados: {
          mimetype: resource.mimetype,
          cache_url: resource.cache_url,
          datastore_active: resource.datastore_active,
          position: resource.position
        }
      };
      
      const { data: inserted, error } = await supabase
        .from('anvisa_recurso')
        .upsert(recursoData, { onConflict: 'external_id' })
        .select()
        .single();
      
      if (!error) {
        results.push(inserted);
      }
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    synced_resources: results.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar observância legal
async function syncObservanciaLegal(supabase: any, baseUrl: string) {
  logStep("Sincronizando observância legal");
  
  const url = `${baseUrl}/publico/conjuntos-dados/observancia-legal`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar observância legal: ${response.statusText}`);
  }
  
  const data = await response.json();
  const results = [];
  
  for (const item of data.result || []) {
    const observanciaData = {
      external_id: item.id,
      titulo: item.titulo || item.title,
      descricao: item.descricao || item.description,
      tipo_observancia: item.tipo,
      norma_legal: item.norma,
      url_norma: item.url_norma,
      data_vigencia: item.data_vigencia ? new Date(item.data_vigencia) : null,
      status: item.status || 'ativo',
      metadados: item
    };
    
    const { data: inserted, error } = await supabase
      .from('anvisa_observancia_legal')
      .upsert(observanciaData, { onConflict: 'external_id' })
      .select()
      .single();
    
    if (!error) {
      results.push(inserted);
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    synced_count: results.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar ODS
async function syncODS(supabase: any, baseUrl: string) {
  logStep("Sincronizando ODS");
  
  const url = `${baseUrl}/publico/conjuntos-dados/objetivos-desenvolvimento-sustentavel`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar ODS: ${response.statusText}`);
  }
  
  const data = await response.json();
  const results = [];
  
  for (const item of data.result || []) {
    const odsData = {
      external_id: item.id,
      nome: item.nome || item.title,
      descricao: item.descricao || item.description,
      numero_ods: item.numero || item.ods_number,
      metas: item.metas || [],
      indicadores: item.indicadores || [],
      metadados: item
    };
    
    const { data: inserted, error } = await supabase
      .from('anvisa_ods')
      .upsert(odsData, { onConflict: 'external_id' })
      .select()
      .single();
    
    if (!error) {
      results.push(inserted);
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    synced_count: results.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar formatos
async function syncFormatos(supabase: any, baseUrl: string) {
  logStep("Sincronizando formatos");
  
  const url = `${baseUrl}/publico/conjuntos-dados/formatos`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar formatos: ${response.statusText}`);
  }
  
  const data = await response.json();
  const results = [];
  
  for (const item of data.result || []) {
    const formatoData = {
      external_id: item.id || item.format,
      nome: item.nome || item.format,
      extensao: item.extensao || item.format?.toLowerCase(),
      mime_type: item.mime_type || item.mimetype,
      descricao: item.descricao || item.description,
      metadados: item
    };
    
    const { data: inserted, error } = await supabase
      .from('anvisa_formatos')
      .upsert(formatoData, { onConflict: 'external_id' })
      .select()
      .single();
    
    if (!error) {
      results.push(inserted);
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    synced_count: results.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar solicitações
async function syncSolicitacoes(supabase: any, baseUrl: string) {
  logStep("Sincronizando solicitações");
  
  const url = `${baseUrl.replace('/publico', '')}/solicitacoes`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar solicitações: ${response.statusText}`);
  }
  
  const data = await response.json();
  const results = [];
  
  for (const item of data.result || []) {
    const solicitacaoData = {
      external_id: item.id,
      protocolo: item.protocolo,
      titulo: item.titulo || item.title,
      descricao: item.descricao || item.description,
      solicitante: item.solicitante,
      data_solicitacao: item.data_solicitacao ? new Date(item.data_solicitacao) : null,
      status: item.status || 'pendente',
      prazo_resposta: item.prazo_resposta ? new Date(item.prazo_resposta) : null,
      categoria: item.categoria,
      metadados: item
    };
    
    const { data: inserted, error } = await supabase
      .from('anvisa_solicitacoes')
      .upsert(solicitacaoData, { onConflict: 'external_id' })
      .select()
      .single();
    
    if (!error) {
      results.push(inserted);
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    synced_count: results.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar organizações
async function syncOrganizacoes(supabase: any, baseUrl: string) {
  logStep("Sincronizando organizações");
  
  const url = `${baseUrl}/publico/organizacao`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar organizações: ${response.statusText}`);
  }
  
  const data = await response.json();
  const results = [];
  
  for (const item of data.result || []) {
    const organizacaoData = {
      external_id: item.id,
      nome: item.name || item.title,
      sigla: item.acronym,
      descricao: item.description,
      tipo_organizacao: item.type,
      esfera: item.sphere,
      endereco: item.address,
      telefone: item.phone,
      email: item.email,
      site: item.website,
      status: item.state === 'active' ? 'ativo' : 'inativo',
      metadados: item
    };
    
    const { data: inserted, error } = await supabase
      .from('anvisa_organizacoes')
      .upsert(organizacaoData, { onConflict: 'external_id' })
      .select()
      .single();
    
    if (!error) {
      results.push(inserted);
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    synced_count: results.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar detalhe de organização
async function syncOrganizacaoDetalhe(supabase: any, baseUrl: string, organizacaoId: string) {
  logStep("Sincronizando detalhe da organização", { organizacaoId });
  
  const url = `${baseUrl}/publico/organizacao/${organizacaoId}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar detalhe da organização: ${response.statusText}`);
  }
  
  const data = await response.json();
  const item = data.result;
  
  // Buscar a organização na nossa base
  const { data: organizacao } = await supabase
    .from('anvisa_organizacoes')
    .select('id')
    .eq('external_id', organizacaoId)
    .single();
  
  if (!organizacao) {
    throw new Error('Organização não encontrada na base local');
  }
  
  const detalheData = {
    organizacao_id: organizacao.id,
    external_id: `${organizacaoId}_detalhe`,
    area_atuacao: item.area_atuacao,
    responsavel: item.responsavel,
    cargo_responsavel: item.cargo_responsavel,
    conjuntos_dados_count: item.package_count || 0,
    dados_adicionais: item
  };
  
  const { data: inserted, error } = await supabase
    .from('anvisa_organizacao_detalhe')
    .upsert(detalheData, { onConflict: 'external_id' })
    .select()
    .single();
  
  return new Response(JSON.stringify({
    success: true,
    synced_detail: inserted ? 1 : 0,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar temas
async function syncTemas(supabase: any, baseUrl: string) {
  logStep("Sincronizando temas");
  
  const url = `${baseUrl.replace('/publico', '')}/temas`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar temas: ${response.statusText}`);
  }
  
  const data = await response.json();
  const results = [];
  
  for (const item of data.result || []) {
    const temaData = {
      external_id: item.id,
      nome: item.name || item.title,
      descricao: item.description,
      categoria_pai: item.parent,
      nivel: item.level || 1,
      cor_hexadecimal: item.color,
      icone: item.icon,
      conjuntos_count: item.package_count || 0,
      metadados: item
    };
    
    const { data: inserted, error } = await supabase
      .from('anvisa_temas')
      .upsert(temaData, { onConflict: 'external_id' })
      .select()
      .single();
    
    if (!error) {
      results.push(inserted);
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    synced_count: results.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar reusos
async function syncReusos(supabase: any, baseUrl: string) {
  logStep("Sincronizando reusos");
  
  const url = `${baseUrl}/publico/reusos`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar reusos: ${response.statusText}`);
  }
  
  const data = await response.json();
  const results = [];
  
  for (const item of data.result || []) {
    const reusoData = {
      external_id: item.id,
      titulo: item.titulo || item.title,
      descricao: item.descricao || item.description,
      autor: item.autor || item.author,
      organizacao_autor: item.organizacao_autor,
      url_reuso: item.url,
      tipo_reuso: item.tipo,
      categoria: item.categoria,
      conjuntos_utilizados: item.conjuntos_utilizados || [],
      data_criacao: item.data_criacao ? new Date(item.data_criacao) : null,
      status: item.status || 'ativo',
      metadados: item
    };
    
    const { data: inserted, error } = await supabase
      .from('anvisa_reusos')
      .upsert(reusoData, { onConflict: 'external_id' })
      .select()
      .single();
    
    if (!error) {
      results.push(inserted);
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    synced_count: results.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar detalhe de reuso
async function syncReusoDetalhe(supabase: any, baseUrl: string, reusoId: string) {
  logStep("Sincronizando detalhe do reuso", { reusoId });
  
  const url = `${baseUrl}/publico/reuso/${reusoId}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar detalhe do reuso: ${response.statusText}`);
  }
  
  const data = await response.json();
  const item = data.result;
  
  // Buscar o reuso na nossa base
  const { data: reuso } = await supabase
    .from('anvisa_reusos')
    .select('id')
    .eq('external_id', reusoId)
    .single();
  
  if (!reuso) {
    throw new Error('Reuso não encontrado na base local');
  }
  
  const detalheData = {
    reuso_id: reuso.id,
    external_id: `${reusoId}_detalhe`,
    tecnologias_utilizadas: item.tecnologias_utilizadas || [],
    publico_alvo: item.publico_alvo,
    impacto_estimado: item.impacto_estimado,
    metricas: item.metricas || {},
    feedback_usuarios: item.feedback_usuarios || {}
  };
  
  const { data: inserted, error } = await supabase
    .from('anvisa_reuso_detalhe')
    .upsert(detalheData, { onConflict: 'external_id' })
    .select()
    .single();
  
  return new Response(JSON.stringify({
    success: true,
    synced_detail: inserted ? 1 : 0,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar reusos pendentes
async function syncReusosPendentes(supabase: any, baseUrl: string, reusoId: string) {
  logStep("Sincronizando reusos pendentes", { reusoId });
  
  const url = `${baseUrl}/publico/reusos/homologacao/pendente/${reusoId}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar reuso pendente: ${response.statusText}`);
  }
  
  const data = await response.json();
  const item = data.result;
  
  const pendenteData = {
    external_id: item.id,
    titulo: item.titulo || item.title,
    descricao: item.descricao || item.description,
    autor: item.autor || item.author,
    data_submissao: item.data_submissao ? new Date(item.data_submissao) : null,
    status_homologacao: item.status_homologacao || 'pendente',
    observacoes_avaliacao: item.observacoes_avaliacao,
    avaliador: item.avaliador,
    data_avaliacao: item.data_avaliacao ? new Date(item.data_avaliacao) : null,
    metadados: item
  };
  
  const { data: inserted, error } = await supabase
    .from('anvisa_reusos_pendentes')
    .upsert(pendenteData, { onConflict: 'external_id' })
    .select()
    .single();
  
  return new Response(JSON.stringify({
    success: true,
    synced_pending: inserted ? 1 : 0,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função auxiliar para sincronizar recursos
async function syncRecurso(supabase: any, conjuntoId: string, resource: any) {
  const recursoData = {
    conjunto_id: conjuntoId,
    external_id: resource.id,
    nome: resource.name,
    descricao: resource.description,
    formato: resource.format,
    url: resource.url,
    tamanho_bytes: resource.size ? parseInt(resource.size) : null,
    hash_arquivo: resource.hash,
    ultima_modificacao: resource.last_modified ? new Date(resource.last_modified) : null,
    status: 'ativo',
    metadados: {
      mimetype: resource.mimetype,
      cache_url: resource.cache_url,
      datastore_active: resource.datastore_active,
      position: resource.position
    }
  };
  
  const { error } = await supabase
    .from('anvisa_recurso')
    .upsert(recursoData, { onConflict: 'external_id' });
  
  if (error) {
    logStep("Erro ao inserir recurso", { error: error.message });
  }
}

// Função para sincronizar todos os endpoints
async function syncAllEndpoints(supabase: any, baseUrl: string) {
  logStep("Iniciando sincronização completa");
  
  const results = {
    conjuntos_dados: 0,
    observancia_legal: 0,
    ods: 0,
    formatos: 0,
    solicitacoes: 0,
    organizacoes: 0,
    temas: 0,
    reusos: 0
  };
  
  try {
    // Sincronizar dados básicos
    const conjuntosResult = await syncConjuntosDados(supabase, baseUrl);
    const conjuntosData = await conjuntosResult.json();
    results.conjuntos_dados = conjuntosData.synced_count || 0;
    
    const observanciaResult = await syncObservanciaLegal(supabase, baseUrl);
    const observanciaData = await observanciaResult.json();
    results.observancia_legal = observanciaData.synced_count || 0;
    
    const odsResult = await syncODS(supabase, baseUrl);
    const odsData = await odsResult.json();
    results.ods = odsData.synced_count || 0;
    
    const formatosResult = await syncFormatos(supabase, baseUrl);
    const formatosData = await formatosResult.json();
    results.formatos = formatosData.synced_count || 0;
    
    const solicitacoesResult = await syncSolicitacoes(supabase, baseUrl);
    const solicitacoesData = await solicitacoesResult.json();
    results.solicitacoes = solicitacoesData.synced_count || 0;
    
    const organizacoesResult = await syncOrganizacoes(supabase, baseUrl);
    const organizacoesData = await organizacoesResult.json();
    results.organizacoes = organizacoesData.synced_count || 0;
    
    const temasResult = await syncTemas(supabase, baseUrl);
    const temasData = await temasResult.json();
    results.temas = temasData.synced_count || 0;
    
    const reusosResult = await syncReusos(supabase, baseUrl);
    const reusosData = await reusosResult.json();
    results.reusos = reusosData.synced_count || 0;
    
    // Atualizar timestamp da última sincronização
    await supabase
      .from('api_configurations')
      .update({ last_sync: new Date().toISOString() })
      .eq('integration_name', 'anvisa_dados_gov_br');
    
    logStep("Sincronização completa finalizada", results);
    
    return new Response(JSON.stringify({
      success: true,
      results,
      total_synced: Object.values(results).reduce((sum, count) => sum + count, 0),
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    logStep("Erro na sincronização completa", { error: error.message });
    throw error;
  }
}