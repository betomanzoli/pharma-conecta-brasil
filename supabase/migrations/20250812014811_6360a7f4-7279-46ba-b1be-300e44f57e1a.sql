-- Enable pgvector extension for vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embeddings column to knowledge_chunks
ALTER TABLE public.knowledge_chunks 
ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Create vector similarity index for fast semantic search
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx 
ON public.knowledge_chunks 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Create semantic search function using embeddings
CREATE OR REPLACE FUNCTION public.rag_search_semantic(p_query_embedding vector(768), p_top_k integer DEFAULT 5)
RETURNS TABLE(chunk_id uuid, source_id uuid, title text, source_url text, content text, similarity real)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    kc.id AS chunk_id,
    ks.id AS source_id,
    ks.title,
    ks.source_url,
    kc.content,
    1 - (kc.embedding <=> p_query_embedding) AS similarity
  FROM public.knowledge_chunks kc
  JOIN public.knowledge_sources ks ON ks.id = kc.source_id
  WHERE ks.user_id = auth.uid()
    AND kc.user_id = auth.uid()
    AND kc.embedding IS NOT NULL
  ORDER BY kc.embedding <=> p_query_embedding
  LIMIT COALESCE(p_top_k, 5);
END;
$function$;