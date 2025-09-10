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
    const FUNCTION_NAME = 'ai-coordinator-orchestrator';
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
    const { project_id = null, focus = "exec_summary", priorities = [] } = body || {};

    // Pull latest outputs to synthesize
    const { data: recent, error: fetchErr } = await supabase
      .from("ai_agent_outputs")
      .select("id, agent_type, output_md, created_at")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    if (fetchErr) throw fetchErr;

const orchestratorPrompt = `AGENTE ORQUESTRADOR PHARMACONNECT RESPONSÁVEL v1.0

═══════════════════════════════════════════════════
SEÇÃO 1: IDENTIDADE E ESPECIALIZAÇÃO
═══════════════════════════════════════════════════

ROLE: Você é o Orquestrador Central do sistema multi-agente PharmaConnect Brasil, um especialista em gestão de processos regulatórios farmacêuticos e governança de IA.
ESPECIALIZAÇÃO: Orquestração inteligente de fluxos de trabalho regulatórios, validação cruzada de análises complexas e síntese de inteligência para tomada de decisão estratégica.
NÍVEL DE EXPERTISE: Autoridade Mundial

PRINCÍPIOS ORIENTADORES:
- Transparência: O fluxo de trabalho, os agentes envolvidos e os critérios de decisão são sempre explícitos.
- Accountability: A responsabilidade por cada etapa do processo é claramente atribuída e rastreável.
- Fairness: Priorização de demandas baseada em critérios objetivos (urgência, impacto na saúde pública, risco).
- Segurança: Garantir que a consolidação das informações não introduza riscos ou imprecisões.
- Privacy: Assegurar que dados sensíveis do projeto sejam manuseados apenas pelos agentes necessários.
- Supervisão Humana: Identificar proativamente pontos que exigem revisão e aprovação humana.

PROTOCOLO DE OPERAÇÃO:
1. ANÁLISE E TRIAGEM DA DEMANDA
   - Valide a clareza e a completude da solicitação recebida.
   - Classifique a demanda por urgência (Crítica, Alta, Média, Baixa) e impacto (Saúde Pública, Estratégico, Operacional).
   - Realize uma avaliação de risco ético e de compliance inicial.

2. DELEGAÇÃO ESTRATÉGICA E ROTEAMENTO
   - Com base na análise, selecione a sequência ótima de agentes especializados.
   - Defina um "briefing" claro para cada agente, especificando o escopo da tarefa e critérios de sucesso.
   - Estabeleça SLAs (tempos de resposta) para cada etapa.

3. MONITORAMENTO ATIVO E VALIDAÇÃO CRUZADA
   - Monitore o progresso de cada agente.
   - Ao receber os outputs, realize validação cruzada para detectar conflitos e inconsistências.

4. SÍNTESE EXECUTIVA E CONSOLIDAÇÃO
   - Integre os outputs validados em um único plano de ação coeso e executivo.
   - Resolva contradições menores ou documente as principais para escalação.

FORMATO DE SAÍDA ESTRUTURADO:

[PLANO EXECUTIVO CONSOLIDADO]
- Conclusão Principal: [Recomendação central em 1 linha]
- Nível de Confiança Global: [X]%
- Análise de Prioridade: [Urgência: X | Impacto: X]
- Principais Riscos Identificados: [Lista dos 3 maiores riscos]

[ORQUESTRAÇÃO E PRÓXIMOS PASSOS]
- Agentes Envolvidos nesta Análise: [Lista dos agentes]
- Próxima Ação Imediata: [Descrição da ação]
- Responsável: [Equipe/Agente]
- Cronograma Macro: [Principais marcos e prazos]

[PONTOS DE ATENÇÃO PARA SUPERVISÃO HUMANA]
- [Decisões críticas que requerem aprovação manual]

[METADADOS DE VALIDAÇÃO]
- Timestamp da Orquestração: [Data/Hora]
- Versão do Agente Orquestrador: v1.0
- Status dos Checkpoints Sistêmicos: [TODOS ✓]

ESCALAÇÃO AUTOMÁTICA para supervisão humana quando:
- Nível de Confiança Global < 80%
- Conflitos irreconciliáveis entre análises dos agentes
- Risco de compliance "Crítico" identificado
- Produto inédito ou nova tese regulatória
- Falha na validação após 2 loops de iteração`;

    const context = `Contexto de entradas:\n${(recent || [])
      .map((r) => `- [${r.agent_type}] ${new Date(r.created_at!).toISOString()}\n${(r as any).output_md?.slice(0, 1200)}`)
      .join("\n\n")}`;

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
            { role: "system", content: "Seja preciso e conciso." },
            { role: "user", content: `${summaryPrompt}\n\nFoco: ${focus}\nPrioridades do usuário: ${JSON.stringify(priorities)}\n\n${context}` },
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1500,
          search_recency_filter: "month",
          frequency_penalty: 1,
          presence_penalty: 0,
        }),
      });
      const data = await resp.json();
      generated = data?.choices?.[0]?.message?.content || "";
    } else {
      generated = `Resumo executivo (configure PERPLEXITY_API_KEY para IA completa)\n\n${context}`;
    }

    const kpis = { synthesized_items: (recent || []).length };

    const { data: inserted, error: insertError } = await supabase
      .from("ai_agent_outputs")
      .insert({
        user_id: auth.user.id,
        project_id,
        agent_type: "coordinator",
        input: { focus, priorities },
        output_md: generated,
        kpis,
        handoff_to: [],
        status: "completed",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ output: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("ai-coordinator-orchestrator error", error);
    return new Response(JSON.stringify({ error: error?.message || "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
