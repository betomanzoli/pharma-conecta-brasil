import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
      throw new Error("PERPLEXITY_API_KEY não está configurada. Defina o secret nas Edge Function Secrets do Supabase.");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!; // service role para gravar mensagens
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { action, message, user_id, thread_id, title, context } = body || {};
    logStep("Request data", { action, hasMessage: !!message, user_id, thread_id });

    let result: any = {};

    switch (action) {
      case 'init_thread': {
        if (!user_id) throw new Error('user_id é obrigatório para iniciar thread');
        const initialTitle = (title || (message ? String(message).slice(0, 60) : 'Novo chat')).trim();
        const { data, error } = await supabase
          .from('ai_chat_threads')
          .insert({ user_id, title: initialTitle })
          .select('id, title, created_at')
          .single();
        if (error) throw error;
        result = { thread_id: data.id, title: data.title, created_at: data.created_at };
        break;
      }
      case 'list_threads': {
        if (!user_id) throw new Error('user_id é obrigatório');
        const { data, error } = await supabase
          .from('ai_chat_threads')
          .select('id, title, updated_at, messages_count, last_message_preview')
          .eq('user_id', user_id)
          .order('updated_at', { ascending: false })
          .limit(50);
        if (error) throw error;
        result = { threads: data };
        break;
      }
      case 'list_messages': {
        if (!user_id || !thread_id) throw new Error('user_id e thread_id são obrigatórios');
        const { data, error } = await supabase
          .from('ai_chat_messages')
          .select('id, role, content, created_at')
          .eq('thread_id', thread_id)
          .order('created_at', { ascending: true })
          .limit(200);
        if (error) throw error;
        result = { messages: data };
        break;
      }
      case 'chat': {
        if (!user_id) throw new Error('user_id é obrigatório');
        const usedThreadId = await ensureThread(supabase, user_id, thread_id, message, title);

        // 1) persist user message
        if (message && String(message).trim().length > 0) {
          const { error: insErr } = await supabase
            .from('ai_chat_messages')
            .insert({ thread_id: usedThreadId, user_id, role: 'user', content: message });
          if (insErr) throw insErr;
        }

        // 2) load recent context (up to 14 messages)
        const { data: history, error: histErr } = await supabase
          .from('ai_chat_messages')
          .select('role, content, created_at')
          .eq('thread_id', usedThreadId)
          .order('created_at', { ascending: true })
          .limit(24);
        if (histErr) throw histErr;

        const systemPrompt = buildSystemPrompt();
        const perpMessages = [
          { role: 'system', content: systemPrompt },
          ...history.map((m) => ({ role: m.role, content: m.content })),
        ];

        logStep('Making Perplexity API call');
        const ai = await callPerplexity(perplexityApiKey, perpMessages);

        // 3) persist assistant message
        const aiContent: string = ai.content || 'Desculpe, não consegui processar sua mensagem.';
        const { error: insAiErr } = await supabase
          .from('ai_chat_messages')
          .insert({ thread_id: usedThreadId, user_id: null, role: 'assistant', content: aiContent, metadata: { citations: ai.citations || [], related_questions: ai.related_questions || [] } });
        if (insAiErr) throw insAiErr;

        // 4) determine if we should suggest a new thread
        const { data: threadData } = await supabase
          .from('ai_chat_threads')
          .select('id, messages_count')
          .eq('id', usedThreadId)
          .maybeSingle();

        const totalChars = [...(history || []), { role: 'assistant', content: aiContent }]
          .reduce((acc, m) => acc + (m.content?.length || 0), 0);
        const suggestNew = (threadData?.messages_count || 0) >= 40 || totalChars > 12000;

        result = {
          response: aiContent,
          related_questions: ai.related_questions || [],
          sources: ai.citations || [],
          timestamp: new Date().toISOString(),
          thread_id: usedThreadId,
          suggest_new_thread: suggestNew,
          suggested_prompt: suggestNew ? buildContinuationPrompt(history || []) : null,
        };
        break;
      }
      case 'initialize': {
        result = await initializeMasterChat(supabase, user_id);
        break;
      }
      case 'find_partners': {
        result = await findPartners(supabase, user_id, message);
        break;
      }
      case 'regulatory_updates': {
        result = await getRegulatoryUpdates(supabase);
        break;
      }
      case 'market_analysis': {
        result = await getMarketAnalysis(supabase, user_id);
        break;
      }
      default:
        throw new Error('Ação inválida especificada');
    }

    return new Response(JSON.stringify({ success: true, action, ...result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    logStep('ERROR in master chatbot', { message: error?.message });
    return new Response(JSON.stringify({ success: false, error: error?.message || 'Erro desconhecido' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

function buildSystemPrompt() {
  return `Você é o Master AI Assistant da PharmaConnect Brasil, especializado no setor farmacêutico brasileiro.

SUAS ESPECIALIDADES:
- Regulamentação ANVISA atualizada
- Networking e parcerias farmacêuticas
- Análise de mercado farmacêutico brasileiro
- Compliance regulatório
- Oportunidades de negócio no setor farmacêutico
- Pesquisas científicas e técnicas

INSTRUÇÕES:
- Responda de forma contextual, mantendo o diálogo contínuo com base no histórico
- Se o usuário mudar de assunto claramente, confirme com ele ou sugira abrir um novo chat
- Use fontes confiáveis (.gov.br, anvisa.gov.br, ema.europa.eu, fda.gov, pubmed)
- Seja claro, preciso e cite referências quando possível`; }

async function ensureThread(supabase: any, userId: string, maybeThreadId?: string, message?: string, title?: string): Promise<string> {
  if (maybeThreadId) return maybeThreadId;
  const initialTitle = (title || (message ? String(message).slice(0, 60) : 'Novo chat')).trim();
  const { data, error } = await supabase
    .from('ai_chat_threads')
    .insert({ user_id: userId, title: initialTitle })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

async function callPerplexity(apiKey: string, messages: Array<{ role: string; content: string }>) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages,
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: 1200,
      return_images: false,
      return_related_questions: true,
      search_recency_filter: 'month',
      frequency_penalty: 1,
      presence_penalty: 0,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro da API Perplexity (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || '';
  const related_questions = data?.related_questions || [];
  const citations = data?.citations || [];
  return { content, related_questions, citations };
}

async function initializeMasterChat(supabase: any, userId: string) {
  try {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    return {
      context: {
        user_profile: profile,
        capabilities: [
          'Informações Regulatórias ANVISA atualizadas',
          'Networking Farmacêutico inteligente',
          'Análise de Mercado em tempo real',
          'Compliance e Boas Práticas',
          'Oportunidades de Negócio',
          'Suporte Técnico Especializado',
        ],
      },
    };
  } catch {
    return { context: {} };
  }
}

async function findPartners(supabase: any, userId: string, query: string) {
  const { data: companies } = await supabase.from('companies').select('*').limit(5);
  const { data: laboratories } = await supabase.from('laboratories').select('*').limit(5);
  return {
    partners: { companies: companies || [], laboratories: laboratories || [] },
    message: `Encontrei parceiros potenciais baseados em "${query}". Use o Marketplace para detalhes completos e contato.`,
  };
}

async function getRegulatoryUpdates(supabase: any) {
  const { data: alerts } = await supabase
    .from('regulatory_alerts')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(5);
  return { updates: alerts || [], message: 'Últimas atualizações regulatórias da ANVISA.' };
}

async function getMarketAnalysis(supabase: any, userId: string) {
  const { data: metrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .eq('metric_name', 'market_intelligence')
    .limit(10);
  return { analysis: metrics || [], message: 'Análise de mercado baseada em métricas recentes.' };
}

function buildContinuationPrompt(history: Array<{ role: string; content: string }>) {
  const lastUserMsg = [...history].reverse().find((m) => m.role === 'user')?.content || '';
  const trimmed = lastUserMsg.slice(0, 120);
  return `Novo chat: continue a partir de: \n\n"${trimmed}"\n\nInclua contexto essencial do chat anterior.`;
}
