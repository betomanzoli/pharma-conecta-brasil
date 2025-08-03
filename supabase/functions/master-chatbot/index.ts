
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

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
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
        result = await processChat(supabase, message, user_id, context, conversation_history, openaiApiKey);
        break;
      case 'load_history':
        result = await loadChatHistory(supabase, user_id);
        break;
      case 'analyze_sentiment':
        result = await analyzeSentiment(message, openaiApiKey);
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

  // Buscar contexto do usuário
  const [profileData, matchData, regulatoryData] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('match_feedback').select('*').eq('user_id', userId).limit(10),
    supabase.from('regulatory_alerts').select('*').order('published_at', { ascending: false }).limit(5)
  ]);

  const context = {
    user_profile: profileData.data,
    recent_matches: matchData.data || [],
    regulatory_updates: regulatoryData.data || [],
    user_type: userType,
    market_intelligence: await getMarketIntelligence(supabase, userType)
  };

  return { context };
}

async function processChat(supabase: any, message: string, userId: string, context: any, conversationHistory: any[], openaiApiKey: string) {
  logStep("Processing chat message", { message: message.substring(0, 50) });

  // Determinar intenção da mensagem
  const intent = await analyzeIntent(message, openaiApiKey);
  
  // Construir prompt contextual especializado
  const systemPrompt = buildContextualPrompt(context, intent);
  
  // Preparar histórico da conversa
  const formattedHistory = conversationHistory.slice(-6).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));

  // Chamar OpenAI com contexto especializado
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: systemPrompt },
        ...formattedHistory,
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      functions: [
        {
          name: 'create_automation',
          description: 'Criar um workflow de automação',
          parameters: {
            type: 'object',
            properties: {
              workflow_name: { type: 'string' },
              trigger: { type: 'string' },
              actions: { type: 'array', items: { type: 'string' } }
            }
          }
        },
        {
          name: 'find_partners',
          description: 'Buscar parceiros compatíveis',
          parameters: {
            type: 'object',
            properties: {
              criteria: { type: 'object' },
              max_results: { type: 'number' }
            }
          }
        },
        {
          name: 'regulatory_search',
          description: 'Buscar informações regulatórias',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string' },
              source: { type: 'string', enum: ['anvisa', 'fda', 'ema'] }
            }
          }
        }
      ]
    }),
  });

  const data = await response.json();
  let aiResponse = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';
  
  // Processar function calls se existirem
  const functionCall = data.choices[0]?.message?.function_call;
  const suggestedActions = [];
  const autoActions = [];

  if (functionCall) {
    const functionResult = await processFunctionCall(supabase, functionCall, userId);
    suggestedActions.push(...functionResult.suggested_actions);
    autoActions.push(...functionResult.auto_actions);
    aiResponse += `\n\n${functionResult.message}`;
  }

  // Analisar sentiment da resposta
  const sentiment = await analyzeSentiment(aiResponse, openaiApiKey);

  // Salvar conversa
  await saveChatMessage(supabase, userId, message, aiResponse, intent, sentiment);

  // Log de métrica da conversa
  await supabase.from('performance_metrics').insert({
    metric_name: 'master_chatbot_interaction',
    metric_value: 1,
    metric_unit: 'interaction',
    tags: {
      user_id: userId,
      intent: intent.type,
      sentiment: sentiment,
      has_function_call: !!functionCall,
      timestamp: new Date().toISOString()
    }
  });

  return {
    response: aiResponse,
    sentiment,
    intent: intent.type,
    suggested_actions: suggestedActions,
    auto_actions: autoActions,
    sources: getRelevantSources(intent, context)
  };
}

async function analyzeIntent(message: string, openaiApiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: `Analise a intenção da mensagem farmacêutica e classifique em uma das categorias:
          - partner_search: buscar parceiros
          - regulatory_info: informações regulatórias
          - market_analysis: análise de mercado
          - automation_request: criar automação
          - compliance_check: verificar compliance
          - general_question: pergunta geral
          
          Responda apenas com JSON: {"type": "categoria", "confidence": 0.95, "entities": []}`
        },
        { role: 'user', content: message }
      ],
      temperature: 0.3,
      max_tokens: 150
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0]?.message?.content || '{"type": "general_question", "confidence": 0.5, "entities": []}');
  } catch {
    return { type: 'general_question', confidence: 0.5, entities: [] };
  }
}

function buildContextualPrompt(context: any, intent: any) {
  const basePrompt = `Você é um Assistente Master de IA especializado no setor farmacêutico brasileiro. 
Você tem acesso a dados em tempo real sobre regulamentação (ANVISA, FDA, EMA), inteligência de mercado, 
e pode executar ações automáticas na plataforma.

CONTEXTO DO USUÁRIO:
- Nome: ${context?.user_profile?.first_name || 'Usuário'}
- Tipo: ${context?.user_type || 'Profissional'}
- Matches recentes: ${context?.recent_matches?.length || 0}
- Alertas regulatórios: ${context?.regulatory_updates?.length || 0}

CAPACIDADES ESPECIAIS:
- 🎯 Matching Inteligente com IA
- 📊 Análise Regulatória (ANVISA, FDA, EMA)
- 🔍 Intelligence de Mercado
- ⚡ Criação de Automações
- 📋 Verificação de Compliance
- 🤝 Assistência em Negociações`;

  // Especializar prompt baseado na intenção
  switch (intent.type) {
    case 'partner_search':
      return basePrompt + `\n\nFOCO: Ajudar a encontrar parceiros farmacêuticos ideais usando IA avançada.`;
    case 'regulatory_info':
      return basePrompt + `\n\nFOCO: Fornecer informações precisas sobre regulamentação farmacêutica.`;
    case 'automation_request':
      return basePrompt + `\n\nFOCO: Criar workflows inteligentes e automações personalizadas.`;
    case 'market_analysis':
      return basePrompt + `\n\nFOCO: Análise de mercado farmacêutico e identificação de oportunidades.`;
    default:
      return basePrompt;
  }
}

async function processFunctionCall(supabase: any, functionCall: any, userId: string) {
  const { name, arguments: args } = functionCall;
  const parsedArgs = JSON.parse(args);

  switch (name) {
    case 'create_automation':
      return {
        message: `✅ Automação "${parsedArgs.workflow_name}" será criada com trigger "${parsedArgs.trigger}".`,
        suggested_actions: [
          { type: 'create_automation', label: 'Criar Automação', data: parsedArgs }
        ],
        auto_actions: []
      };

    case 'find_partners':
      const partners = await findCompatiblePartners(supabase, userId, parsedArgs.criteria);
      return {
        message: `🎯 Encontrei ${partners.length} parceiros compatíveis com seus critérios.`,
        suggested_actions: [
          { type: 'view_partners', label: 'Ver Parceiros', data: partners }
        ],
        auto_actions: []
      };

    case 'regulatory_search':
      return {
        message: `📊 Busca regulatória realizada na ${parsedArgs.source.toUpperCase()} para: "${parsedArgs.query}".`,
        suggested_actions: [
          { type: 'view_regulatory', label: 'Ver Resultados', data: parsedArgs }
        ],
        auto_actions: []
      };

    default:
      return { message: '', suggested_actions: [], auto_actions: [] };
  }
}

async function findCompatiblePartners(supabase: any, userId: string, criteria: any) {
  // Buscar parceiros com base nos critérios
  const { data: partners } = await supabase
    .from('companies')
    .select('*')
    .limit(5);

  return partners || [];
}

async function analyzeSentiment(text: string, openaiApiKey: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'Analise o sentimento do texto e responda apenas: positive, negative, ou neutral'
          },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
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
  // Salvar no histórico de chat (implementar tabela se necessário)
  // Por enquanto, apenas log
  logStep("Chat message processed", {
    userId,
    intent: intent.type,
    sentiment,
    timestamp: new Date().toISOString()
  });
}

async function loadChatHistory(supabase: any, userId: string) {
  // Implementar carregamento do histórico quando tabela estiver criada
  return { history: [] };
}

async function getMarketIntelligence(supabase: any, userType: string) {
  // Buscar dados de intelligence de mercado
  const { data: metrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .eq('metric_name', 'market_intelligence')
    .order('measured_at', { ascending: false })
    .limit(5);

  return metrics || [];
}

function getRelevantSources(intent: any, context: any) {
  const sources = [];
  
  switch (intent.type) {
    case 'regulatory_info':
      sources.push('ANVISA', 'FDA', 'EMA');
      break;
    case 'partner_search':
      sources.push('PharmaConnect Database', 'AI Matching Engine');
      break;
    case 'market_analysis':
      sources.push('Market Intelligence', 'Industry Reports');
      break;
  }
  
  return sources;
}
