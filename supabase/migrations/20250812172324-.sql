-- Create support tables and RPC for AI agent outputs and function invocations

-- 1) function_invocations table
CREATE TABLE IF NOT EXISTS public.function_invocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  function_name text NOT NULL,
  invoked_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.function_invocations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'function_invocations' AND policyname = 'Users can insert own function invocations'
  ) THEN
    CREATE POLICY "Users can insert own function invocations"
    ON public.function_invocations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'function_invocations' AND policyname = 'Users can view own function invocations'
  ) THEN
    CREATE POLICY "Users can view own function invocations"
    ON public.function_invocations
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- 2) ai_agent_outputs table
CREATE TABLE IF NOT EXISTS public.ai_agent_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  project_id uuid NULL,
  agent_type text NOT NULL,
  input jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_md text NOT NULL,
  kpis jsonb NOT NULL DEFAULT '{}'::jsonb,
  handoff_to text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_agent_outputs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_agent_outputs' AND policyname = 'Users can manage own ai_agent_outputs'
  ) THEN
    CREATE POLICY "Users can manage own ai_agent_outputs"
    ON public.ai_agent_outputs
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ai_agent_outputs_user ON public.ai_agent_outputs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_outputs_project ON public.ai_agent_outputs(project_id);

-- 3) updated_at trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- attach trigger to ai_agent_outputs
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_ai_agent_outputs_updated_at'
  ) THEN
    CREATE TRIGGER set_ai_agent_outputs_updated_at
    BEFORE UPDATE ON public.ai_agent_outputs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 4) RPC audit_log to write into security_audit_logs
CREATE OR REPLACE FUNCTION public.audit_log(
  action_type text,
  table_name text,
  record_id uuid,
  details jsonb DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    event_type,
    event_description,
    metadata,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    action_type,
    table_name,
    COALESCE(details, '{}'::jsonb),
    NULL,
    NULL
  );
END;
$$;