
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const log = (msg: string, data?: any) => console.log(`[ai-business-strategist] ${msg}`, data ?? '');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY')!;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      global: { headers: { Authorization: authHeader || '' } },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const userId = userData.user.id;

    // Rate limiting and audit
    const FUNCTION_NAME = 'ai-business-strategist';
    const WINDOW_MINUTES = 5;
    const MAX_CALLS = 10;
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count, error: countErr } = await supabase
      .from('function_invocations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('function_name', FUNCTION_NAME)
      .gte('invoked_at', since);
    if (countErr) console.error('rate-limit count error', countErr);
    if ((count ?? 0) >= MAX_CALLS) {
      return new Response(
        JSON.stringify({ error: 'rate_limited', detail: `Limite de ${MAX_CALLS} chamadas a cada ${WINDOW_MINUTES} minutos.` }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    await supabase.from('function_invocations').insert({
      user_id: userId,
      function_name: FUNCTION_NAME,
      metadata: { ip: req.headers.get('x-forwarded-for') || '', ua: req.headers.get('user-agent') || '' }
    });
    await supabase.rpc('audit_log', { action_type: 'invoke', table_name: 'edge_function', record_id: null, details: { function_name: FUNCTION_NAME } });

    // Expected input
    const body = await req.json();
    const {
      opportunity = '',
      product_type = '',
      target_market = '',
      competitors = '',
      differentiation = '',
      investment_range = '',
      timeframe = '',
      risks = '',
      project_id = null,
    } = body || {};

    const prompt = `Atue como um Estrategista Farmacêutico no Brasil. Gere um business case objetivo em Markdown contendo:
- Sumário executivo (contexto e proposta de valor)
- Análise de mercado (tamanho, crescimento, segmentação) com foco no Brasil
- SWOT (forças, fraquezas, oportunidades, ameaças)
- Avaliação de concorrentes e diferenciais
- Estimativas (ordem de grandeza) de investimento, prazo e ROI (com hipóteses)
- Riscos e mitigação
- Próximos passos recomendados (3-5)
Contexto fornecido:
Oportunidade: ${opportunity}
Tipo de produto/serviço: ${product_type}
Mercado-alvo: ${target_market}
Concorrentes: ${competitors}
Diferenciais: ${differentiation}
Faixa de investimento: ${investment_range}
Prazo estimado: ${timeframe}
Riscos: ${risks}
Responda somente em pt-BR e em Markdown.`;

    log('Calling Perplexity API');
    const resp = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          { role: 'system', content: 'Seja preciso, objetivo e prático para executivos da indústria farmacêutica brasileira.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1800,
        return_images: false,
        return_related_questions: false,
        search_domain_filter: ['anvisa.gov.br', 'fda.gov', 'ema.europa.eu'],
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      log('Perplexity error', { status: resp.status, text });
      return new Response(JSON.stringify({ error: 'Perplexity API error', detail: text }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const data = await resp.json();
    const output_md: string = data?.choices?.[0]?.message?.content ?? 'Sem conteúdo gerado.';

    const defaultKpis = [
      { name: 'ROI estimado (12-24m)', unit: '%', target: 25 },
      { name: 'Time-to-market', unit: 'meses', target: 12 },
      { name: 'Probabilidade de sucesso', unit: '%', target: 60 },
    ];

    const insertPayload = {
      user_id: userId,
      project_id,
      agent_type: 'business-strategist',
      input: { opportunity, product_type, target_market, competitors, differentiation, investment_range, timeframe, risks },
      output_md,
      kpis: defaultKpis,
      handoff_to: ['technical-regulatory', 'project-analyst'],
      status: 'completed',
    };

    const { data: inserted, error: insertError } = await supabase
      .from('ai_agent_outputs')
      .insert(insertPayload)
      .select()
      .maybeSingle();

    if (insertError) {
      log('Insert error', insertError);
      return new Response(JSON.stringify({ error: 'DB insert failed', detail: insertError.message, output_md }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ output: inserted ?? insertPayload }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    log('Unhandled error', e?.message || e);
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
