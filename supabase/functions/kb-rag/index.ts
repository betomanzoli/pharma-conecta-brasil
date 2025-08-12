
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function generateQueryEmbedding(query: string): Promise<number[]> {
  // Simulated embedding for query - matches the logic in kb-ingest
  const dimension = 384;
  const embedding = [];
  
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    const char = query.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  for (let i = 0; i < dimension; i++) {
    embedding.push((Math.sin(hash + i) + 1) / 2);
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

    const body = (await req.json().catch(() => ({}))) as { query: string; top_k?: number };
    if (!body.query) {
      return new Response(JSON.stringify({ error: "missing_query" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const topK = Math.max(1, Math.min(20, body.top_k ?? 5));
    let results = [];

    try {
      // Try semantic search first
      const queryEmbedding = await generateQueryEmbedding(body.query);
      
      // Get chunks with embeddings and calculate similarity
      const { data: chunks } = await supabase
        .from('knowledge_chunks')
        .select(`
          id,
          content,
          source_id,
          knowledge_sources!inner(title, source_url),
          ai_embeddings!inner(embedding_data)
        `)
        .eq('user_id', auth.user.id)
        .limit(50); // Get more chunks to calculate similarity

      if (chunks && chunks.length > 0) {
        // Calculate cosine similarity
        const chunksWithSimilarity = chunks.map(chunk => {
          const embeddingData = chunk.ai_embeddings?.[0]?.embedding_data as any;
          const chunkVector = embeddingData?.vector || [];
          
          // Calculate cosine similarity
          let dotProduct = 0;
          let queryNorm = 0;
          let chunkNorm = 0;
          
          for (let i = 0; i < Math.min(queryEmbedding.length, chunkVector.length); i++) {
            dotProduct += queryEmbedding[i] * chunkVector[i];
            queryNorm += queryEmbedding[i] * queryEmbedding[i];
            chunkNorm += chunkVector[i] * chunkVector[i];
          }
          
          const similarity = dotProduct / (Math.sqrt(queryNorm) * Math.sqrt(chunkNorm)) || 0;
          
          return {
            chunk_id: chunk.id,
            source_id: chunk.source_id,
            title: chunk.knowledge_sources?.title || '',
            source_url: chunk.knowledge_sources?.source_url || null,
            content: chunk.content,
            rank: similarity
          };
        });
        
        // Sort by similarity and take top results
        results = chunksWithSimilarity
          .sort((a, b) => b.rank - a.rank)
          .slice(0, topK);
      }
    } catch (semanticError) {
      console.log("Semantic search failed, falling back to text search:", semanticError);
    }

    // Fallback to traditional text search if semantic search fails or returns no results
    if (results.length === 0) {
      const { data, error } = await supabase.rpc("rag_search", {
        p_query: body.query,
        p_top_k: topK,
      });
      
      if (error) throw error;
      results = data || [];
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("kb-rag error", error);
    return new Response(JSON.stringify({ error: error?.message || "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
