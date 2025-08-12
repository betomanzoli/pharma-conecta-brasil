
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function chunkText(text: string, maxLen = 1500): string[] {
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let buffer = "";
  for (const p of paragraphs) {
    if ((buffer + "\n\n" + p).length <= maxLen) {
      buffer = buffer ? buffer + "\n\n" + p : p;
    } else {
      if (buffer) chunks.push(buffer);
      if (p.length <= maxLen) {
        buffer = p;
      } else {
        // hard split long paragraph
        for (let i = 0; i < p.length; i += maxLen) {
          chunks.push(p.slice(i, i + maxLen));
        }
        buffer = "";
      }
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks;
}

async function generateEmbedding(text: string): Promise<number[]> {
  // Simulated embedding - in production, this would call an actual embedding API
  const dimension = 384; // Common embedding dimension
  const embedding = [];
  
  // Simple hash-based deterministic "embedding" for demonstration
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  for (let i = 0; i < dimension; i++) {
    embedding.push((Math.sin(hash + i) + 1) / 2); // Normalize to 0-1
  }
  
  return embedding;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
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
      title: string;
      content: string;
      source_url?: string | null;
      source_type?: string | null;
    };

    if (!body.title || !body.content) {
      return new Response(JSON.stringify({ error: "missing_title_or_content" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create knowledge source
    const { data: source, error: srcErr } = await supabase
      .from("knowledge_sources")
      .insert({
        user_id: auth.user.id,
        source_type: body.source_type ?? "manual",
        source_url: body.source_url ?? null,
        status: "active",
        title: body.title,
        metadata: {},
      })
      .select()
      .single();

    if (srcErr) throw srcErr;

    // Chunk content and insert chunks
    const chunks = chunkText(body.content);
    const rows = chunks.map((c, idx) => ({
      user_id: auth.user.id,
      source_id: source.id,
      content: c,
      metadata: { seq: idx + 1, total: chunks.length },
    }));

    const { data: chunkData, error: chErr } = await supabase.from("knowledge_chunks").insert(rows).select();
    if (chErr) throw chErr;

    // Generate embeddings for each chunk
    let embeddingsCreated = 0;
    for (const chunk of chunkData || []) {
      try {
        const embedding = await generateEmbedding(chunk.content);
        
        await supabase.from("ai_embeddings").insert({
          user_id: auth.user.id,
          entity_type: "knowledge_chunk",
          entity_id: chunk.id,
          model: "simulated-embedding-v1",
          dimension: embedding.length,
          embedding_data: { vector: embedding }
        });
        
        embeddingsCreated++;
      } catch (embError) {
        console.error("Error creating embedding for chunk:", embError);
        // Continue processing other chunks
      }
    }

    return new Response(JSON.stringify({ 
      source_id: source.id, 
      chunks: chunks.length,
      embeddings_created: embeddingsCreated
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("kb-ingest error", error);
    return new Response(JSON.stringify({ error: error?.message || "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
