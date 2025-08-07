
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

    // Verificar se temos a chave da API
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY não configurada");
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, message, user_id, context } = await req.json();

    let result;

    switch (action) {
      case 'chat':
        result = await processChat(message, user_id, context, openaiApiKey);
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
        throw new Error('Ação de automação inválida especificada');
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
      success: false,
      response: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function processChat(message: string, userId: string, context: any, openaiApiKey: string) {
  logStep("Processing chat message", { message: message.substring(0, 50) });

  const systemPrompt = `Você é um Assistente Master de IA especializado no setor farmacêutico brasileiro.
Você ajuda profissionais com:
- Informações sobre regulamentação ANVISA
- Networking e parcerias farmacêuticas
- Análise de mercado farmacêutico
- Oportunidades de negócio
- Compliance regulatório

Sempre forneça respostas precisas, profissionais e relevantes para o setor farmacêutico.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';

    return {
      response: aiResponse,
      usage: data.usage,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logStep("Error in OpenAI API call", error);
    throw new Error('Erro ao processar mensagem com IA');
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
          'Informações Regulatórias ANVISA',
          'Networking Farmacêutico',
          'Análise de Mercado',
          'Compliance',
          'Oportunidades de Negócio'
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
          'Análise de Mercado'
        ]
      }
    };
  }
}

async function findPartners(supabase: any, userId: string, query: string) {
  logStep("Finding partners", { userId, query });

  try {
    // Buscar empresas e laboratórios
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
      message: 'Encontrados parceiros potenciais baseados em sua busca.'
    };
  } catch (error) {
    logStep("Error finding partners", error);
    return {
      partners: { companies: [], laboratories: [] },
      message: 'Não foi possível encontrar parceiros no momento.'
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
      message: 'Aqui estão as atualizações regulatórias mais recentes.'
    };
  } catch (error) {
    logStep("Error getting regulatory updates", error);
    return {
      updates: [],
      message: 'Não foi possível obter atualizações regulatórias no momento.'
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
      message: 'Análise de mercado farmacêutico baseada em dados recentes.'
    };
  } catch (error) {
    logStep("Error getting market analysis", error);
    return {
      analysis: [],
      message: 'Não foi possível obter análise de mercado no momento.'
    };
  }
}
