import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
  });

  try {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return new Response(JSON.stringify({ error: "not_authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limiting and audit
    const FUNCTION_NAME = 'ai-project-manager';
    const WINDOW_MINUTES = 5;
    const MAX_CALLS = 10;
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count, error: countErr } = await supabase
      .from('function_invocations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', auth.user.id)
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
      user_id: auth.user.id,
      function_name: FUNCTION_NAME,
      metadata: { ip: req.headers.get('x-forwarded-for') || '', ua: req.headers.get('user-agent') || '' }
    });
    await supabase.rpc('audit_log', { action_type: 'invoke', table_name: 'edge_function', record_id: null, details: { function_name: FUNCTION_NAME } });

    const body = await req.json();
    const { 
      project_title,
      scope,
      objectives,
      stakeholders,
      timeline_months,
      budget_range,
      regulatory_outputs,
      business_outputs,
      project_id 
    } = body;

    const projectManagerPrompt = `AGENTE GERENTE DE PROJETOS REGULATÓRIOS RESPONSÁVEL v1.0

═══════════════════════════════════════════════════
SEÇÃO 1: IDENTIDADE E ESPECIALIZAÇÃO
═══════════════════════════════════════════════════

ROLE: Gerente de Projetos (PMP) Sênior com especialização em projetos de P&D e registro no setor farmacêutico brasileiro.
ESPECIALIZAÇÃO: Project Charter, cronogramas com marcos regulatórios, análise de riscos e gestão de stakeholders.
NÍVEL DE EXPERTISE: Especialista

PRINCÍPIOS ORIENTADORES:
- Transparência: Status, riscos e desvios comunicados claramente.
- Accountability: Responsabilidades definidas na matriz RACI.
- Fairness: Planejamento equilibrado das cargas de trabalho.
- Segurança: Prioridade em atividades de segurança e qualidade.
- Supervisão Humana: Cronograma e orçamento aprovados pelo steering committee.

PROTOCOLO DE ANÁLISE:
1. CONTEXTUALIZAÇÃO: Absorver outputs regulatórios e de negócios
2. COLETA ESTRUTURADA: Benchmarks, estimativas técnicas (score 8.5/10)
3. PROCESSAMENTO MULTI-DIMENSIONAL: Escopo, tempo, risco, stakeholders
4. VALIDAÇÃO CRUZADA: Cronograma vs prazos regulatórios, riscos cobertos

CHECKPOINTS OBRIGATÓRIOS:
✓ TÉCNICO: Caminho crítico, dependências, recursos estimados
✓ ÉTICO: Buffers adequados, comunicação transparente
✓ GOVERNANÇA: Estrutura clara, KPIs definidos, planos de resposta
✓ COMPLETUDE: Charter completo, plano acionável

FORMATO DE SAÍDA:

[PROJECT CHARTER]
- Título do Projeto: ${project_title}
- Justificativa e Objetivos (SMART): ${objectives}
- Escopo (In/Out): ${scope}
- Stakeholders: ${stakeholders}
- Orçamento Preliminar: ${budget_range}
- Timeline: ${timeline_months} meses

[PLANO DE PROJETO DETALHADO]
- Cronograma Macro: [5-7 fases principais com marcos]
- Estrutura de Governança: [Comitê, Equipe]
- KPIs: [Prazo, Custo, Qualidade, Escopo]

[GESTÃO DE RISCOS E STAKEHOLDERS]
- Matriz de Riscos: [Risco, Prob(1-5), Impacto(1-5), Score, Mitigação]
- Matriz RACI: [Atividades vs Responsáveis]
- Plano de Comunicação: [O quê, Quem, Quando, Como]

[METADADOS DE VALIDAÇÃO]
- Timestamp: [Data/Hora]
- Versão: v1.0
- Base Cronograma: [Estimativas + prazos ANVISA]
- Status Checkpoints: [TODOS ✓]

INPUTS DOS OUTROS AGENTES:
Regulatório: ${JSON.stringify(regulatory_outputs?.slice(0, 500) || 'N/A')}
Negócios: ${JSON.stringify(business_outputs?.slice(0, 500) || 'N/A')}`;

    let generated = "";
    if (PERPLEXITY_API_KEY) {
      const resp = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            { role: "system", content: "Seja estruturado, realista e focado em execução prática." },
            { role: "user", content: projectManagerPrompt },
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 2000,
          search_recency_filter: "month",
          frequency_penalty: 1,
          presence_penalty: 0,
        }),
      });
      const data = await resp.json();
      generated = data?.choices?.[0]?.message?.content || "";
    } else {
      generated = `# Project Charter - ${project_title}

## Objetivos SMART
${objectives}

## Escopo
${scope}

## Cronograma Preliminar
- Duração estimada: ${timeline_months} meses
- Fases principais a serem detalhadas com marcos regulatórios

## Stakeholders
${stakeholders}

## Orçamento Preliminar
${budget_range}

**AVISO**: Configure PERPLEXITY_API_KEY para plano de projeto completo com matriz de riscos e cronograma detalhado.`;
    }

    const kpis = {
      project_complexity_score: timeline_months > 12 ? 0.8 : 0.6,
      stakeholder_count: (stakeholders?.split(',').length || 1),
      estimated_duration_months: timeline_months
    };

    const { data: inserted, error: insertError } = await supabase
      .from("ai_agent_outputs")
      .insert({
        user_id: auth.user.id,
        project_id: project_id || null,
        agent_type: "project_manager",
        input: { project_title, scope, objectives, stakeholders, timeline_months, budget_range },
        output_md: generated,
        kpis,
        handoff_to: ["coordinator"],
        status: "completed",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ output: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("ai-project-manager error", error);
    return new Response(JSON.stringify({ error: error?.message || "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});