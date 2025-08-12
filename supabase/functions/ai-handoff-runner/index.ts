import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type RunAction = "run_next" | "run_all" | "list";

const FUNCTION_NAME = "ai-handoff-runner";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Service role with user Authorization for auth.getUser and auditing
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

    const body = (await req.json().catch(() => ({}))) as {
      action?: RunAction;
      limit?: number;
    };
    const action: RunAction = body.action ?? "run_next";
    const limit = Math.max(1, Math.min(20, body.limit ?? 10));

    // Rate limit + audit
    const WINDOW_MINUTES = 5;
    const MAX_CALLS = 30;
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("function_invocations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", auth.user.id)
      .eq("function_name", FUNCTION_NAME)
      .gte("invoked_at", since);

    if ((count ?? 0) >= MAX_CALLS) {
      return new Response(
        JSON.stringify({ error: "rate_limited", detail: `Limite de ${MAX_CALLS} chamadas/${WINDOW_MINUTES}min.` }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await supabase.from("function_invocations").insert({
      user_id: auth.user.id,
      function_name: FUNCTION_NAME,
      metadata: { ip: req.headers.get("x-forwarded-for") || "", ua: req.headers.get("user-agent") || "" },
    });

    const mapAgentToFunction: Record<string, string> = {
      project_analyst: "ai-project-analyst",
      document_assistant: "ai-document-assistant",
      business_strategist: "ai-business-strategist",
      technical_regulatory: "ai-technical-regulatory",
      coordinator: "ai-coordinator-orchestrator",
    };

    async function processOne() {
      // Fetch one pending job
      const { data: jobs } = await supabase
        .from("ai_handoff_jobs")
        .select("id, target_agent, input, agent_output_id, project_id")
        .eq("user_id", auth.user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: true })
        .limit(1);

      const job = jobs?.[0];
      if (!job) return { processed: 0 } as const;

      // Mark processing
      const { error: upErr } = await supabase
        .from("ai_handoff_jobs")
        .update({ status: "processing" })
        .eq("id", job.id)
        .eq("user_id", auth.user.id)
        .eq("status", "pending");
      if (upErr) throw upErr;

      const fn = mapAgentToFunction[job.target_agent];
      if (!fn) {
        await supabase
          .from("ai_handoff_jobs")
          .update({ status: "failed" })
          .eq("id", job.id);
        return { processed: 0, error: `unknown_target_agent:${job.target_agent}` } as const;
      }

      // Invoke target function using the same Authorization context
      const { data: fnData, error: fnError } = await supabase.functions.invoke(fn, {
        body: { ...(job.input || {}), project_id: job.project_id ?? null },
      });

      if (fnError) {
        await supabase
          .from("ai_handoff_jobs")
          .update({ status: "failed" })
          .eq("id", job.id);
        return { processed: 0, error: fnError.message } as const;
      }

      // Try to capture output id if present
      const outputId = fnData?.output?.id ?? null;
      await supabase
        .from("ai_handoff_jobs")
        .update({ status: "completed", agent_output_id: outputId })
        .eq("id", job.id);

      return { processed: 1, output_id: outputId } as const;
    }

    if (action === "list") {
      const { data } = await supabase
        .from("ai_handoff_jobs")
        .select("id, source_agent, target_agent, status, created_at")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: true })
        .limit(50);
      return new Response(JSON.stringify({ jobs: data ?? [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "run_next") {
      const res = await processOne();
      return new Response(JSON.stringify(res), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // run_all
    let total = 0;
    for (let i = 0; i < limit; i++) {
      const res = await processOne();
      total += res.processed ?? 0;
      if (res.processed === 0) break;
    }
    return new Response(JSON.stringify({ processed: total }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("ai-handoff-runner error", error);
    return new Response(JSON.stringify({ error: error?.message || "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
