-- Create ai_agent_outputs table for storing AI results
CREATE TABLE IF NOT EXISTS public.ai_agent_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID NULL,
  agent_type TEXT NOT NULL,
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_md TEXT NOT NULL,
  kpis JSONB NULL,
  handoff_to TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_agent_outputs ENABLE ROW LEVEL SECURITY;

-- Policies for ai_agent_outputs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'ai_agent_outputs' AND policyname = 'Users can view own ai outputs or admin'
  ) THEN
    CREATE POLICY "Users can view own ai outputs or admin"
    ON public.ai_agent_outputs
    FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'ai_agent_outputs' AND policyname = 'Users can insert own ai outputs'
  ) THEN
    CREATE POLICY "Users can insert own ai outputs"
    ON public.ai_agent_outputs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'ai_agent_outputs' AND policyname = 'Users can update own ai outputs'
  ) THEN
    CREATE POLICY "Users can update own ai outputs"
    ON public.ai_agent_outputs
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Trigger to maintain updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_ai_agent_outputs_updated_at'
  ) THEN
    CREATE TRIGGER update_ai_agent_outputs_updated_at
    BEFORE UPDATE ON public.ai_agent_outputs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_ai_agent_outputs_user_created ON public.ai_agent_outputs (user_id, created_at DESC);


-- Create function_invocations table to support rate limiting & auditing
CREATE TABLE IF NOT EXISTS public.function_invocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  function_name TEXT NOT NULL,
  invoked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.function_invocations ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own invocations (in case we expose it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'function_invocations' AND policyname = 'Users can view own function invocations'
  ) THEN
    CREATE POLICY "Users can view own function invocations"
    ON public.function_invocations
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Index for fast windowed counts
CREATE INDEX IF NOT EXISTS idx_function_invocations_user_fn_time 
  ON public.function_invocations (user_id, function_name, invoked_at DESC);
