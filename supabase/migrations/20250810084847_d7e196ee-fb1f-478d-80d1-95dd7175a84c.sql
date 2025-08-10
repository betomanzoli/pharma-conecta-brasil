-- Create table to store outputs from AI agents
CREATE TABLE IF NOT EXISTS public.ai_agent_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID NULL,
  agent_type TEXT NOT NULL,
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_md TEXT NOT NULL,
  kpis JSONB NULL,
  handoff_to TEXT[] NOT NULL DEFAULT '{}'::text[],
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_agent_outputs ENABLE ROW LEVEL SECURITY;

-- Policies for user access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_agent_outputs' AND policyname = 'Users can view own agent outputs'
  ) THEN
    CREATE POLICY "Users can view own agent outputs"
    ON public.ai_agent_outputs
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_agent_outputs' AND policyname = 'Users can insert own agent outputs'
  ) THEN
    CREATE POLICY "Users can insert own agent outputs"
    ON public.ai_agent_outputs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_agent_outputs' AND policyname = 'Users can update own agent outputs'
  ) THEN
    CREATE POLICY "Users can update own agent outputs"
    ON public.ai_agent_outputs
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_agent_outputs' AND policyname = 'Users can delete own agent outputs'
  ) THEN
    CREATE POLICY "Users can delete own agent outputs"
    ON public.ai_agent_outputs
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Trigger to update updated_at on changes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_ai_agent_outputs_updated_at'
  ) THEN
    CREATE TRIGGER update_ai_agent_outputs_updated_at
    BEFORE UPDATE ON public.ai_agent_outputs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_ai_agent_outputs_user ON public.ai_agent_outputs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_outputs_created ON public.ai_agent_outputs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_agent_outputs_agent_type ON public.ai_agent_outputs(agent_type);