import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AI-CHATBOT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("AI Chatbot request received");

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const { message, config } = await req.json();

    if (!message) {
      throw new Error("Message is required");
    }

    logStep("Processing message", { 
      messageLength: message.length,
      model: config?.model || 'gpt-4.1-2025-04-14'
    });

    const systemPrompt = config?.systemPrompt || 
      'Você é um assistente especializado no setor farmacêutico brasileiro. ' +
      'Ajude com questões sobre regulamentação da ANVISA, networking profissional, ' +
      'oportunidades de negócio e conhecimentos técnicos do setor. ' +
      'Seja preciso, profissional e sempre considere o contexto regulatório brasileiro.';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config?.model || 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: config?.temperature || 0.7,
        max_tokens: config?.maxTokens || 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      logStep("OpenAI API error", { status: response.status, error });
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';

    logStep("AI response generated", { 
      responseLength: aiResponse.length,
      tokensUsed: data.usage?.total_tokens || 0
    });

    return new Response(JSON.stringify({
      response: aiResponse,
      usage: data.usage,
      model: config?.model || 'gpt-4.1-2025-04-14',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in AI chatbot", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      response: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});