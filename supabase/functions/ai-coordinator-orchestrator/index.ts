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

    const summaryPrompt = `Você é o Coordenador Central de Projetos (Agente 5).
Integre e sintetize os últimos outputs dos agentes em um plano executivo.
- Priorize ações (Alta/Média/Baixa).
- Aponte responsáveis e próximos handoffs.
- Destaque riscos e bloqueadores.
- Formato: Markdown enxuto, lista de ações, e um resumo executivo em 5 linhas.`;

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
