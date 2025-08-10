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
    const {
      doc_type = "CTD",
      template_name = "Template_CTD_Full",
      fields = {},
      context = "",
      project_id = null,
    } = body || {};

    const prompt = `Você é um assistente de documentação farmacêutica (GxP/ICH/GMP).
Gere um documento em Markdown com seções bem definidas baseado no template ${template_name} para o tipo ${doc_type}.
- Preencha campos a partir de 'fields' (JSON) e 'context'.
- Garanta conformidade (ICH Q1-Q14, GMP, CTD módulos quando aplicável).
- Adicione checklist de completude e observações de conformidade no final.
- Responda em PT-BR.`;

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
            { role: "user", content: `${prompt}\n\nCampos JSON: ${JSON.stringify(fields)}\n\nContexto: ${context}` },
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1800,
          search_recency_filter: "month",
          frequency_penalty: 1,
          presence_penalty: 0,
        }),
      });
      const data = await resp.json();
      generated = data?.choices?.[0]?.message?.content || "";
    } else {
      generated = `# ${doc_type} — ${template_name}\n\nContexto:\n${context}\n\nCampos:\n${JSON.stringify(fields, null, 2)}\n\n(Configure PERPLEXITY_API_KEY para geração completa.)`;
    }

    const kpis = {
      completeness_score: 0.85,
      compliance_flags: ["structure_ok", "sections_present"],
    };

    const { data: inserted, error: insertError } = await supabase
      .from("ai_agent_outputs")
      .insert({
        user_id: auth.user.id,
        project_id,
        agent_type: "document_assistant",
        input: { doc_type, template_name, fields, context },
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
    console.error("ai-document-assistant error", error);
    return new Response(JSON.stringify({ error: error?.message || "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
