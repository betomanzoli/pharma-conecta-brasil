
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MASTER-CHATBOT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Master Chatbot request received");

    const perplexityApiKey = Deno.env.get("PERPLEXITY_API_KEY");
    if (!perplexityApiKey) {
      throw new Error("PERPLEXITY_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, message, user_id, user_type, context, conversation_history } = await req.json();

    let result;

    switch (action) {
      case 'initialize':
        result = await initializeMasterChat(supabase, user_id, user_type);
        break;
      case 'chat':
        result = await processChat(supabase, message, user_id, context, conversation_history, perplexityApiKey);
        break;
      case 'load_history':
        result = await loadChatHistory(supabase, user_id);
        break;
      case 'analyze_sentiment':
        result = await analyzeSentiment(message, perplexityApiKey);
        break;
      case 'trigger_automation':
        result = await triggerAutomation(supabase, message, user_id);
        break;
      default:
        throw new Error('Invalid action specified');
    }

    return new Response(JSON.stringify({
      success: true,
      action,
      ...result
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in master chatbot", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function initializeMasterChat(supabase: any, userId: string, userType: string) {
  logStep("Initializing master chat", { userId, userType });

  // Buscar contexto do usuário baseado no tipo
  let profileData, entityData;
  
  try {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    profileData = profile;

    // Buscar dados específicos baseados no user_type
    switch (userType) {
      case 'pharmaceutical_company':
      case 'company':
        const { data: company } = await supabase.from('companies').select('*').eq('profile_id', userId).single();
        entityData = company;
        break;
      case 'laboratory':
        const { data: lab } = await supabase.from('laboratories').select('*').eq('profile_id', userId).single();
        entityData = lab;
        break;
    }
  } catch (error) {
    logStep("Error fetching profile data", error);
  }

  // Buscar dados de contexto
  const [matchData, regulatoryData, marketData] = await Promise.all([
    supabase.from('match_feedback').select('*').eq('user_id', userId).limit(10),
    supabase.from('regulatory_alerts').select('*').order('published_at', { ascending: false }).limit(5),
    supabase.from('performance_metrics').select('*').eq('metric_name', 'market_intelligence').limit(5)
  ]);

  const context = {
    user_profile: profileData,
    entity_data: entityData,
    recent_matches: matchData.data || [],
    regulatory_updates: regulatoryData.data || [],
    market_intelligence: marketData.data || [],
    user_type: userType,
    platform_capabilities: await getPlatformCapabilities(supabase, userType)
  };

  return { context };
}

async function processChat(supabase: any, message: string, userId: string, context: any, conversationHistory: any[], perplexityApiKey: string) {
  logStep("Processing chat message", { message: message.substring(0, 50) });

  // Determinar intenção da mensagem
  const intent = await analyzeIntent(message, perplexityApiKey);
  
  // Construir prompt contextual especializado para setor farmacêutico
  const systemPrompt = buildPharmaceuticalPrompt(context, intent);
  
  // Preparar histórico da conversa
  const formattedHistory = conversationHistory.slice(-6).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));

  // Chamar Perplexity com contexto especializado
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${perplexityApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        { role: 'system', content: systemPrompt },
        ...formattedHistory,
        { role: 'user', content: message }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      search_domain_filter: ['anvisa.gov.br', 'fda.gov', 'ema.europa.eu', 'who.int'],
      search_recency_filter: 'month',
      return_related_questions: true,
      return_images: false
    }),
  });

  const data = await response.json();
  let aiResponse = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';
  
  // Processar ações automáticas baseadas na intenção
  const suggestedActions = [];
  const autoActions = [];

  if (intent.type === 'partner_search') {
    const matches = await findCompatiblePartners(supabase, userId, intent.entities);
    suggestedActions.push({
      type: 'view_matches',
      label: `🎯 Ver ${matches.length} Parceiros Encontrados`,
      data: matches
    });
  }

  if (intent.type === 'regulatory_info') {
    autoActions.push({
      type: 'sync_regulatory',
      description: 'Sincronizando dados regulatórios mais recentes...'
    });
  }

  if (intent.type === 'automation_request') {
    suggestedActions.push({
      type: 'create_automation',
      label: '⚡ Criar Automação',
      data: { workflow_name: intent.entities.join(' '), trigger: 'smart' }
    });
  }

  // Analisar sentiment da resposta
  const sentiment = await analyzeSentiment(aiResponse, perplexityApiKey);

  // Salvar conversa
  await saveChatMessage(supabase, userId, message, aiResponse, intent, sentiment);

  // Executar automações se necessário
  if (autoActions.length > 0) {
    await executeAutoActions(supabase, autoActions, userId);
  }

  return {
    response: aiResponse,
    sentiment,
    intent: intent.type,
    suggested_actions: suggestedActions,
    auto_actions: autoActions,
    related_questions: data.related_questions || [],
    sources: extractSources(data)
  };
}

async function analyzeIntent(message: string, perplexityApiKey: string) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${perplexityApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'system',
          content: `Analise a intenção da mensagem farmacêutica e classifique em uma das categorias:
          - partner_search: buscar parceiros (laboratórios, consultores, fornecedores)
          - regulatory_info: informações regulatórias (ANVISA, FDA, EMA)
          - market_analysis: análise de mercado farmacêutico
          - automation_request: criar automação ou workflow
          - compliance_check: verificar compliance regulatório
          - product_research: pesquisa sobre medicamentos/produtos
          - general_question: pergunta geral
          
          Extraia também entidades importantes (nomes de medicamentos, áreas terapêuticas, regiões, etc.)
          
          Responda apenas com JSON: {"type": "categoria", "confidence": 0.95, "entities": ["entidade1", "entidade2"]}`
        },
        { role: 'user', content: message }
      ],
      temperature: 0.2,
      max_tokens: 200
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0]?.message?.content || '{"type": "general_question", "confidence": 0.5, "entities": []}');
  } catch {
    return { type: 'general_question', confidence: 0.5, entities: [] };
  }
}

function buildPharmaceuticalPrompt(context: any, intent: any) {
  const basePrompt = `Você é um Assistente Master de IA especializado no setor farmacêutico brasileiro e internacional. 
Você tem acesso a dados em tempo real sobre regulamentação (ANVISA, FDA, EMA), inteligência de mercado, 
e pode executar ações automáticas na plataforma PharmaConnect.

CONTEXTO DO USUÁRIO:
- Nome: ${context?.user_profile?.first_name || 'Usuário'}
- Tipo: ${context?.user_type || 'Profissional'}
- Entidade: ${context?.entity_data?.name || 'N/A'}
- Matches recentes: ${context?.recent_matches?.length || 0}
- Alertas regulatórios: ${context?.regulatory_updates?.length || 0}

CAPACIDADES ESPECIAIS:
- 🎯 Matching Inteligente com IA para parceiros farmacêuticos
- 📊 Análise Regulatória em tempo real (ANVISA, FDA, EMA, WHO)
- 🔍 Intelligence de Mercado Farmacêutico
- ⚡ Criação de Automações e Workflows
- 📋 Verificação de Compliance Regulatório
- 🤝 Assistência em Negociações e Partnerships
- 💊 Base de conhecimento sobre medicamentos e terapias
- 🏭 Informações sobre laboratórios e indústria farmacêutica

FOCO ATUAL: ${getIntentFocus(intent.type)}

Sempre forneça informações precisas, atualizadas e relevantes para profissionais do setor farmacêutico.
Use dados regulatórios oficiais e cite fontes quando apropriado.`;

  return basePrompt;
}

function getIntentFocus(intentType: string): string {
  switch (intentType) {
    case 'partner_search':
      return 'Ajudar a encontrar parceiros farmacêuticos ideais (laboratórios, consultores, fornecedores) usando IA avançada e critérios específicos do setor.';
    case 'regulatory_info':
      return 'Fornecer informações precisas e atualizadas sobre regulamentação farmacêutica (ANVISA, FDA, EMA) e compliance.';
    case 'automation_request':
      return 'Criar workflows inteligentes e automações personalizadas para processos farmacêuticos.';
    case 'market_analysis':
      return 'Análise de mercado farmacêutico, tendências terapêuticas e identificação de oportunidades de negócio.';
    case 'compliance_check':
      return 'Verificação de conformidade regulatória e assessoria em processos de aprovação.';
    case 'product_research':
      return 'Pesquisa sobre medicamentos, princípios ativos, indicações terapêuticas e dados de mercado.';
    default:
      return 'Assistência geral especializada no setor farmacêutico brasileiro e internacional.';
  }
}

async function findCompatiblePartners(supabase: any, userId: string, entities: string[]) {
  try {
    // Chamar o sistema de AI matching avançado
    const { data, error } = await supabase.functions.invoke('ai-matching-enhanced', {
      body: { 
        action: 'advanced_matching',
        parameters: {
          user_id: userId,
          requirements: { entities },
          preferences: { max_results: 10 }
        }
      }
    });

    if (error) throw error;
    return data?.result?.matches || [];
  } catch (error) {
    logStep("Error finding partners", error);
    return [];
  }
}

async function triggerAutomation(supabase: any, message: string, userId: string) {
  logStep("Triggering automation", { message: message.substring(0, 50) });

  try {
    // Chamar o sistema de auto-sync para executar automações
    const { data, error } = await supabase.functions.invoke('auto-sync', {
      body: { 
        action: 'sync_all_apis',
        user_id: userId,
        trigger_reason: 'chatbot_request'
      }
    });

    if (error) throw error;

    return {
      automation_triggered: true,
      results: data?.results || {},
      message: 'Automação executada com sucesso!'
    };
  } catch (error) {
    logStep("Error triggering automation", error);
    return {
      automation_triggered: false,
      error: error.message
    };
  }
}

async function executeAutoActions(supabase: any, autoActions: any[], userId: string) {
  for (const action of autoActions) {
    try {
      switch (action.type) {
        case 'sync_regulatory':
          await supabase.functions.invoke('auto-sync', {
            body: { 
              action: 'sync_anvisa_data',
              user_id: userId 
            }
          });
          break;
        case 'find_matches':
          await supabase.functions.invoke('ai-matching-enhanced', {
            body: { 
              action: 'advanced_matching',
              parameters: { user_id: userId }
            }
          });
          break;
      }
    } catch (error) {
      logStep("Error executing auto action", { action: action.type, error });
    }
  }
}

async function analyzeSentiment(text: string, perplexityApiKey: string) {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Analise o sentimento do texto farmacêutico e responda apenas: positive, negative, ou neutral'
          },
          { role: 'user', content: text }
        ],
        temperature: 0.1,
        max_tokens: 10
      }),
    });

    const data = await response.json();
    const sentiment = data.choices[0]?.message?.content?.trim().toLowerCase();
    return ['positive', 'negative', 'neutral'].includes(sentiment) ? sentiment : 'neutral';
  } catch {
    return 'neutral';
  }
}

async function saveChatMessage(supabase: any, userId: string, userMessage: string, aiResponse: string, intent: any, sentiment: string) {
  try {
    // Salvar no log de performance para tracking
    await supabase.from('performance_metrics').insert({
      metric_name: 'master_chatbot_interaction',
      metric_value: 1,
      metric_unit: 'interaction',
      tags: {
        user_id: userId,
        intent: intent.type,
        sentiment: sentiment,
        message_length: userMessage.length,
        response_length: aiResponse.length,
        timestamp: new Date().toISOString()
      }
    });

    logStep("Chat message processed and logged", {
      userId,
      intent: intent.type,
      sentiment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logStep("Error saving chat message", error);
  }
}

async function loadChatHistory(supabase: any, userId: string) {
  try {
    // Buscar histórico das métricas de interação
    const { data } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('metric_name', 'master_chatbot_interaction')
      .contains('tags', { user_id: userId })
      .order('measured_at', { ascending: false })
      .limit(20);

    const history = (data || []).map(metric => ({
      id: metric.id,
      timestamp: metric.measured_at,
      intent: metric.tags?.intent || 'general',
      sentiment: metric.tags?.sentiment || 'neutral'
    }));

    return { history };
  } catch (error) {
    logStep("Error loading chat history", error);
    return { history: [] };
  }
}

async function getPlatformCapabilities(supabase: any, userType: string) {
  const capabilities = [
    'AI Matching Avançado',
    'Análise Regulatória Tempo Real',
    'Intelligence de Mercado',
    'Automações Inteligentes',
    'Verificação de Compliance',
    'Monitoramento ANVISA/FDA/EMA'
  ];

  // Capabilities específicas por tipo de usuário
  switch (userType) {
    case 'pharmaceutical_company':
    case 'company':
      capabilities.push('Gestão de Produtos Farmacêuticos', 'Parcerias Estratégicas');
      break;
    case 'laboratory':
      capabilities.push('Gestão de Capacidade', 'Certificações e Acreditações');
      break;
  }

  return capabilities;
}

function extractSources(data: any) {
  // Extrair fontes das citações do Perplexity
  const sources = [];
  if (data.citations) {
    data.citations.forEach(citation => {
      if (citation.url) {
        sources.push(citation.url);
      }
    });
  }
  return sources;
}
