-- 1) Handoffs entre Agentes: tabela + RLS + RPC de enfileiramento

-- Tabela de jobs de handoff
CREATE TABLE IF NOT EXISTS public.ai_handoff_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID NULL,
  source_agent TEXT NOT NULL,
  target_agent TEXT NOT NULL,
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  agent_output_id UUID NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | running | done | failed
  tries INTEGER NOT NULL DEFAULT 0,
  error TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_handoff_jobs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_handoff_jobs' AND policyname = 'Users can insert own handoff jobs'
  ) THEN
    CREATE POLICY "Users can insert own handoff jobs"
      ON public.ai_handoff_jobs
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_handoff_jobs' AND policyname = 'Users can update own handoff jobs'
  ) THEN
    CREATE POLICY "Users can update own handoff jobs"
      ON public.ai_handoff_jobs
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_handoff_jobs' AND policyname = 'Users can view own handoff jobs'
  ) THEN
    CREATE POLICY "Users can view own handoff jobs"
      ON public.ai_handoff_jobs
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_handoff_jobs' AND policyname = 'Admins can view all handoff jobs'
  ) THEN
    CREATE POLICY "Admins can view all handoff jobs"
      ON public.ai_handoff_jobs
      FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_ai_handoff_jobs_user_status ON public.ai_handoff_jobs (user_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_handoff_jobs_created_at ON public.ai_handoff_jobs (created_at DESC);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_ai_handoff_jobs_updated_at ON public.ai_handoff_jobs;
CREATE TRIGGER update_ai_handoff_jobs_updated_at
BEFORE UPDATE ON public.ai_handoff_jobs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RPC para enfileirar handoffs (sem depender da existência de ai_agent_outputs)
CREATE OR REPLACE FUNCTION public.enqueue_ai_handoffs(
  p_source_agent TEXT,
  p_target_agents TEXT[],
  p_input JSONB DEFAULT '{}'::jsonb,
  p_project_id UUID DEFAULT NULL,
  p_agent_output_id UUID DEFAULT NULL
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_count INTEGER := 0;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.ai_handoff_jobs (user_id, project_id, source_agent, target_agent, input, agent_output_id)
  SELECT v_user, p_project_id, p_source_agent, t.agent, p_input, p_agent_output_id
  FROM unnest(p_target_agents) AS t(agent);

  v_count := COALESCE(array_length(p_target_agents, 1), 0);
  RETURN v_count;
END;
$$;


-- 2) Base de Conhecimento Curada (RAG v1): sources + chunks + RLS + busca básica

-- Tabela de fontes
CREATE TABLE IF NOT EXISTS public.knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL, -- document | url | manual
  source_url TEXT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'knowledge_sources' AND policyname = 'Users can manage own knowledge sources (insert)'
  ) THEN
    CREATE POLICY "Users can manage own knowledge sources (insert)"
      ON public.knowledge_sources
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'knowledge_sources' AND policyname = 'Users can manage own knowledge sources (update)'
  ) THEN
    CREATE POLICY "Users can manage own knowledge sources (update)"
      ON public.knowledge_sources
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'knowledge_sources' AND policyname = 'Users can view own knowledge sources'
  ) THEN
    CREATE POLICY "Users can view own knowledge sources"
      ON public.knowledge_sources
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_knowledge_sources_updated_at ON public.knowledge_sources;
CREATE TRIGGER update_knowledge_sources_updated_at
BEFORE UPDATE ON public.knowledge_sources
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela de chunks
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  source_id UUID NOT NULL REFERENCES public.knowledge_sources(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  content TEXT NOT NULL,
  embedding JSONB NULL,       -- opcional: vetor em JSON
  dimension INTEGER NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'knowledge_chunks' AND policyname = 'Users can insert own knowledge chunks'
  ) THEN
    CREATE POLICY "Users can insert own knowledge chunks"
      ON public.knowledge_chunks
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'knowledge_chunks' AND policyname = 'Users can update own knowledge chunks'
  ) THEN
    CREATE POLICY "Users can update own knowledge chunks"
      ON public.knowledge_chunks
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'knowledge_chunks' AND policyname = 'Users can view own knowledge chunks'
  ) THEN
    CREATE POLICY "Users can view own knowledge chunks"
      ON public.knowledge_chunks
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Índice de busca textual como fallback (antes de embeddings)
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_fts ON public.knowledge_chunks USING GIN (to_tsvector('simple', content));

-- Função de busca RAG textual básica
CREATE OR REPLACE FUNCTION public.rag_search(
  p_query TEXT,
  p_top_k INT DEFAULT 5
) RETURNS TABLE(
  chunk_id UUID,
  source_id UUID,
  title TEXT,
  source_url TEXT,
  content TEXT,
  rank REAL
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id AS chunk_id,
    ks.id AS source_id,
    ks.title,
    ks.source_url,
    kc.content,
    ts_rank(to_tsvector('simple', kc.content), plainto_tsquery('simple', p_query)) AS rank
  FROM public.knowledge_chunks kc
  JOIN public.knowledge_sources ks ON ks.id = kc.source_id
  WHERE ks.user_id = auth.uid()
    AND kc.user_id = auth.uid()
    AND plainto_tsquery('simple', p_query) @@ to_tsvector('simple', kc.content)
  ORDER BY rank DESC
  LIMIT COALESCE(p_top_k, 5);
END;
$$;