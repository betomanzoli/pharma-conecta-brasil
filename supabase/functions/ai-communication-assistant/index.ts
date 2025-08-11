import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function callPerplexity(apiKey: string, messages: Array<{ role: string; content: string }>) {
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "sonar",
      messages,
      temperature: 0.2,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Perplexity error ${res.status}: ${text}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  return content as string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");

  try {
    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader ?? "" } },
    });

    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const action = body?.action as string;

    if (!PERPLEXITY_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing PERPLEXITY_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate_suggestions") {
      const text = (body?.text as string) ?? "";
      const system = "You are a senior communication assistant for pharma. Suggest concise, actionable improvements, subject lines, CTA variants, and tone tweaks. Always respond in pt-BR.";
      const prompt = `Texto do usuário (pt-BR):\n\n${text}\n\nGere 5 sugestões: diferentes enfoques, CTA e pequenas melhorias. Responda como JSON com a forma { suggestions: [{ type, priority, text }] }.`;
      const content = await callPerplexity(PERPLEXITY_API_KEY, [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ]);

      // Best-effort parsing
      let suggestions: Array<{ type: string; priority?: string; text: string }> = [];
      try {
        const parsed = JSON.parse(content);
        suggestions = parsed?.suggestions ?? [];
      } catch (_) {
        // Fallback: split lines
        suggestions = content
          .split(/\n+/)
          .filter((l) => l.trim())
          .slice(0, 5)
          .map((l) => ({ type: "general", text: l.trim() }));
      }

      return new Response(JSON.stringify({ suggestions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "adapt_tone") {
      const text = (body?.text as string) ?? "";
      const tone = (body?.tone as string) ?? "formal";
      const system = "You adapt messages to the requested tone for pharma communications. Always respond in pt-BR and preserve meaning with better clarity.";
      const prompt = `Adapte o texto abaixo para o tom: ${tone}. Mantenha fiel ao conteúdo, melhore clareza, objetividade e profissionalismo quando aplicável.\n\n${text}`;
      const adapted_text = await callPerplexity(PERPLEXITY_API_KEY, [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ]);

      return new Response(JSON.stringify({ adapted_text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate_summary") {
      const threadId = body?.chat_id as string | undefined;
      let conversation = "";
      if (threadId) {
        const { data: msgs } = await supabase
          .from("ai_chat_messages")
          .select("role, content, created_at")
          .eq("thread_id", threadId)
          .order("created_at", { ascending: true })
          .limit(50);
        conversation = (msgs ?? [])
          .map((m) => `${m.role}: ${m.content}`)
          .join("\n");
      }
      const system = "You are an expert meeting and chat summarizer for pharma projects. Summaries in pt-BR with bullet points, next-steps, and risks.";
      const prompt = conversation
        ? `Resuma a conversa abaixo em pt-BR com bullets, próximos passos e riscos.\n\n${conversation}`
        : "Sem conversa fornecida. Gere um template curto de resumo de comunicação (bullets e próximos passos).";

      const summary = await callPerplexity(PERPLEXITY_API_KEY, [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ]);

      return new Response(JSON.stringify({ summary }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-communication-assistant error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
