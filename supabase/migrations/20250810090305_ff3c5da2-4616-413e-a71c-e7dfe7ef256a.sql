-- Fix: create policies conditionally using pg_policies.policyname
-- Ensure table exists
CREATE TABLE IF NOT EXISTS public.ai_agent_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID NULL,
  agent_type TEXT NOT NULL,
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_md TEXT NOT NULL,
  kpis JSONB NOT NULL DEFAULT '{}'::jsonb,
  handoff_to TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_agent_outputs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can insert own agent outputs'
      AND schemaname = 'public' AND tablename = 'ai_agent_outputs'
  ) THEN
    CREATE POLICY "Users can insert own agent outputs"
    ON public.ai_agent_outputs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can view own agent outputs'
      AND schemaname = 'public' AND tablename = 'ai_agent_outputs'
  ) THEN
    CREATE POLICY "Users can view own agent outputs"
    ON public.ai_agent_outputs
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Admins can view all agent outputs'
      AND schemaname = 'public' AND tablename = 'ai_agent_outputs'
  ) THEN
    CREATE POLICY "Admins can view all agent outputs"
    ON public.ai_agent_outputs
    FOR SELECT
    USING (public.is_admin());
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_ai_agent_outputs_updated_at ON public.ai_agent_outputs;
CREATE TRIGGER update_ai_agent_outputs_updated_at
BEFORE UPDATE ON public.ai_agent_outputs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_ai_agent_outputs_user_created
  ON public.ai_agent_outputs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_agent_outputs_project
  ON public.ai_agent_outputs (project_id);
