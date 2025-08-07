
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

    // Verificar se a chave da Perplexity existe
    const perplexityApiKey = Deno.env.get("PERPLEXITY_API_KEY");
    logStep("Checking Perplexity API Key", { 
      hasKey: !!perplexityApiKey, 
      keyLength: perplexityApiKey?.length || 0 
    });

    if (!perplexityApiKey) {
      logStep("ERROR: PERPLEXITY_API_KEY not found in environment");
      throw new Error("PERPLEXITY_API_KEY não está configurada. Verifique as configurações de secrets no Supabase.");
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, message, user_id, context } = await req.json();
    logStep("Request data", { action, messageLength: message?.length || 0, user_id });

    let result;

    switch (action) {
      case 'chat':
        result = await processChat(message, user_id, context, perplexityApiKey);
        break;
      case 'initialize':
        result = await initializeMasterChat(supabase, user_id);
        break;
      case 'find_partners':
        result = await findPartners(supabase, user_id, message);
        break;
      case 'regulatory_updates':
        result = await getRegulatoryUpdates(supabase);
        break;
      case 'market_analysis':
        result = await getMarketAnalysis(supabase, user_id);
        break;
      default:
        throw new Error('Ação inválida especificada');
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
    logStep("ERROR in master chatbot", { message: errorMessage, stack: error.stack });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false,
      response: `Erro no Master Chatbot: ${errorMessage}`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function processChat(message: string, userId: string, context: any, perplexityApiKey: string) {
  logStep("Processing chat message", { messageLength: message.length });

  const systemPrompt = `Você é o Master AI Assistant da PharmaConnect Brasil, especializado no setor farmacêutico brasileiro.

SUAS ESPECIALIDADES:
- Regulamentação ANVISA atualizada
- Networking e parcerias farmacêuticas
- Análise de mercado farmacêutico brasileiro
- Compliance regulatório
- Oportunidades de negócio no setor farmacêutico
- Pesquisas científicas e técnicas

INSTRUÇÕES:
- Sempre forneça respostas precisas e profissionais
- Use fontes confiáveis (.gov.br, anvisa.gov.br, pubmed)
- Mantenha o foco no contexto farmacêutico brasileiro
- Se não souber algo, seja honesto e sugira onde encontrar a informação
- Use linguagem clara e técnica quando apropriado

CONTEXTO DO USUÁRIO:
- Plataforma: PharmaConnect Brasil
- Setor: Farmacêutico
- País: Brasil`;

  try {
    logStep("Making Perplexity API call");

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
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 0.9,
        search_domain_filter: ['anvisa.gov.br', 'gov.br', 'pubmed.ncbi.nlm.nih.gov', 'portal.cfm.org.br'],
        search_recency_filter: 'month',
        return_images: false,
        return_related_questions: true,
      }),
    });

    logStep("Perplexity API response status", { status: response.status, ok: response.ok });

    if (!response.ok) {
      const errorText = await response.text();
      logStep("Perplexity API error", { status: response.status, error: errorText });
      throw new Error(`Erro da API Perplexity (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    logStep("Perplexity API success", { hasChoices: !!data.choices, choicesLength: data.choices?.length });

    const aiResponse = data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';
    const relatedQuestions = data.related_questions || [];
    const citations = data.citations || [];

    logStep("Response prepared", { 
      responseLength: aiResponse.length, 
      relatedQuestionsCount: relatedQuestions.length,
      citationsCount: citations.length 
    });

    return {
      response: aiResponse,
      related_questions: relatedQuestions,
      sources: citations,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    logStep("Error in Perplexity API call", { 
      error: error.message, 
      name: error.name,
      cause: error.cause 
    });
    
    // Resposta de fallback mais útil
    const fallbackResponse = `Desculpe, houve um problema ao conectar com o serviço de IA avançada. 

Como seu assistente da PharmaConnect Brasil, posso ajudá-lo com:

• **Regulamentação ANVISA**: Informações sobre registros, licenças e compliance
• **Networking Farmacêutico**: Conexões com laboratórios, consultores e fornecedores  
• **Análise de Mercado**: Tendências e oportunidades do setor farmacêutico brasileiro
• **Suporte Técnico**: Orientações sobre desenvolvimento e produção farmacêutica

**Erro técnico:** ${error.message}

Por favor, tente novamente ou reformule sua pergunta. Se o problema persistir, entre em contato com o suporte técnico.`;

    return {
      response: fallbackResponse,
      related_questions: [
        "Quais são as principais regulamentações ANVISA para medicamentos?",
        "Como encontrar laboratórios certificados no Brasil?",
        "Quais são as tendências do mercado farmacêutico brasileiro?"
      ],
      sources: [],
      timestamp: new Date().toISOString(),
      error_occurred: true
    };
  }
}

async function initializeMasterChat(supabase: any, userId: string) {
  logStep("Initializing master chat", { userId });

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return {
      context: {
        user_profile: profile,
        capabilities: [
          'Informações Regulatórias ANVISA atualizadas',
          'Networking Farmacêutico inteligente',
          'Análise de Mercado em tempo real',
          'Compliance e Boas Práticas',
          'Oportunidades de Negócio',
          'Suporte Técnico Especializado'
        ],
        features: [
          'IA Perplexity com fontes verificadas',
          'Acesso a dados regulatórios atualizados',
          'Conexão com APIs governamentais',
          'Análise preditiva de mercado'
        ]
      }
    };
  } catch (error) {
    logStep("Error initializing chat", error);
    return {
      context: {
        capabilities: [
          'Informações Regulatórias ANVISA',
          'Networking Farmacêutico',
          'Análise de Mercado',
          'Suporte Especializado'
        ]
      }
    };
  }
}

async function findPartners(supabase: any, userId: string, query: string) {
  logStep("Finding partners", { userId, query });

  try {
    const { data: companies } = await supabase
      .from('companies')
      .select('*')
      .limit(5);

    const { data: laboratories } = await supabase
      .from('laboratories')
      .select('*')
      .limit(5);

    return {
      partners: {
        companies: companies || [],
        laboratories: laboratories || [],
      },
      message: `Encontrei parceiros potenciais baseados em "${query}". Use o Marketplace para visualizar detalhes completos e iniciar contato.`
    };
  } catch (error) {
    logStep("Error finding partners", error);
    return {
      partners: { companies: [], laboratories: [] },
      message: 'Sistema de busca de parceiros temporariamente indisponível. Tente usar o Marketplace diretamente.'
    };
  }
}

async function getRegulatoryUpdates(supabase: any) {
  logStep("Getting regulatory updates");

  try {
    const { data: alerts } = await supabase
      .from('regulatory_alerts')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(5);

    return {
      updates: alerts || [],
      message: 'Consulte as últimas atualizações regulatórias. Para informações mais detalhadas, acesse o portal oficial da ANVISA.'
    };
  } catch (error) {
    logStep("Error getting regulatory updates", error);
    return {
      updates: [],
      message: 'Sistema de alertas regulatórios em manutenção. Consulte diretamente: portal.anvisa.gov.br'
    };
  }
}

async function getMarketAnalysis(supabase: any, userId: string) {
  logStep("Getting market analysis", { userId });

  try {
    const { data: metrics } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('metric_name', 'market_intelligence')
      .limit(10);

    return {
      analysis: metrics || [],
      message: 'Análise de mercado farmacêutico baseada em dados de inteligência de negócios e tendências setoriais.'
    };
  } catch (error) {
    logStep("Error getting market analysis", error);
    return {
      analysis: [],
      message: 'Módulo de análise de mercado em desenvolvimento. Em breve com insights avançados sobre o setor farmacêutico brasileiro.'
    };
  }
}
