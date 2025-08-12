-- Create missing tables to support AI orchestration, logging, and RAG search
-- Safe to run multiple times using IF NOT EXISTS patterns where possible

-- ai_agent_outputs: stores outputs from different agents
CREATE TABLE IF NOT EXISTS public.ai_agent_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID NULL,
  agent_type TEXT NOT NULL,
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_md TEXT NOT NULL DEFAULT '',
  kpis JSONB NULL DEFAULT '{}'::jsonb,
  handoff_to TEXT[] NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_agent_outputs ENABLE ROW LEVEL SECURITY;

-- Policies: users manage their own rows
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_agent_outputs' AND policyname='select_own_ai_agent_outputs'
  ) THEN
    CREATE POLICY "select_own_ai_agent_outputs"
      ON public.ai_agent_outputs
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_agent_outputs' AND policyname='insert_own_ai_agent_outputs'
  ) THEN
    CREATE POLICY "insert_own_ai_agent_outputs"
      ON public.ai_agent_outputs
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_agent_outputs' AND policyname='update_own_ai_agent_outputs'
  ) THEN
    CREATE POLICY "update_own_ai_agent_outputs"
      ON public.ai_agent_outputs
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Index to speed up recent lookups
CREATE INDEX IF NOT EXISTS idx_ai_agent_outputs_user_created
  ON public.ai_agent_outputs (user_id, created_at DESC);

-- updated_at trigger
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_ai_agent_outputs_updated_at'
  ) THEN
    CREATE TRIGGER trg_ai_agent_outputs_updated_at
    BEFORE UPDATE ON public.ai_agent_outputs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;


-- function_invocations: basic rate-limit and audit log for edge functions
CREATE TABLE IF NOT EXISTS public.function_invocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  function_name TEXT NOT NULL,
  invoked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.function_invocations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='function_invocations' AND policyname='insert_function_invocations'
  ) THEN
    -- Allow inserts from clients and service role; RLS is bypassed for service role
    CREATE POLICY "insert_function_invocations"
      ON public.function_invocations
      FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='function_invocations' AND policyname='select_own_function_invocations'
  ) THEN
    CREATE POLICY "select_own_function_invocations"
      ON public.function_invocations
      FOR SELECT
      USING (user_id = auth.uid());
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_function_invocations_rate
  ON public.function_invocations (user_id, function_name, invoked_at DESC);


-- ai_handoff_jobs: queue of handoffs between agents
CREATE TABLE IF NOT EXISTS public.ai_handoff_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID NULL,
  source_agent TEXT NOT NULL,
  target_agent TEXT NOT NULL,
  input JSONB NULL DEFAULT '{}'::jsonb,
  agent_output_id UUID NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_handoff_jobs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_handoff_jobs' AND policyname='select_own_ai_handoff_jobs'
  ) THEN
    CREATE POLICY "select_own_ai_handoff_jobs"
      ON public.ai_handoff_jobs
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_handoff_jobs' AND policyname='insert_own_ai_handoff_jobs'
  ) THEN
    CREATE POLICY "insert_own_ai_handoff_jobs"
      ON public.ai_handoff_jobs
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_handoff_jobs' AND policyname='update_own_ai_handoff_jobs'
  ) THEN
    CREATE POLICY "update_own_ai_handoff_jobs"
      ON public.ai_handoff_jobs
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_ai_handoff_jobs_updated_at'
  ) THEN
    CREATE TRIGGER trg_ai_handoff_jobs_updated_at
    BEFORE UPDATE ON public.ai_handoff_jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;


-- ai_chat_events: telemetry for AI chat usage and intents
CREATE TABLE IF NOT EXISTS public.ai_chat_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  source TEXT NOT NULL,
  action TEXT NULL,
  message TEXT NULL,
  intents TEXT[] NULL DEFAULT '{}',
  topics TEXT[] NULL DEFAULT '{}',
  project_id UUID NULL,
  metadata JSONB NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_chat_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_chat_events' AND policyname='insert_own_ai_chat_events'
  ) THEN
    CREATE POLICY "insert_own_ai_chat_events"
      ON public.ai_chat_events
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_chat_events' AND policyname='select_own_ai_chat_events'
  ) THEN
    CREATE POLICY "select_own_ai_chat_events"
      ON public.ai_chat_events
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ai_chat_events_user_created
  ON public.ai_chat_events (user_id, created_at DESC);


-- knowledge_chunks: supports simple RAG via full text search (used by rag_search)
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  source_id UUID NOT NULL REFERENCES public.knowledge_sources(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  metadata JSONB NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='knowledge_chunks' AND policyname='select_own_knowledge_chunks'
  ) THEN
    CREATE POLICY "select_own_knowledge_chunks"
      ON public.knowledge_chunks
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='knowledge_chunks' AND policyname='insert_own_knowledge_chunks'
  ) THEN
    CREATE POLICY "insert_own_knowledge_chunks"
      ON public.knowledge_chunks
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='knowledge_chunks' AND policyname='update_own_knowledge_chunks'
  ) THEN
    CREATE POLICY "update_own_knowledge_chunks"
      ON public.knowledge_chunks
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_source
  ON public.knowledge_chunks (source_id);

-- Full text search index for content to speed up rag_search
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_fts
  ON public.knowledge_chunks USING GIN (to_tsvector('simple', content));

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_knowledge_chunks_updated_at'
  ) THEN
    CREATE TRIGGER trg_knowledge_chunks_updated_at
    BEFORE UPDATE ON public.knowledge_chunks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;
