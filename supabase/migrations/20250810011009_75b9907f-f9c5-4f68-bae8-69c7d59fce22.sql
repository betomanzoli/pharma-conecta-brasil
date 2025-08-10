-- Create ai_agent_outputs table with RLS and indexes
CREATE TABLE IF NOT EXISTS public.ai_agent_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  project_id uuid NULL REFERENCES public.ai_projects(id) ON DELETE SET NULL,
  agent_type text NOT NULL,
  input jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_md text NOT NULL,
  kpis jsonb NOT NULL DEFAULT '{}'::jsonb,
  handoff_to text[] NOT NULL DEFAULT '{}'::text[],
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_agent_outputs ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can insert own ai_agent_outputs" ON public.ai_agent_outputs;
CREATE POLICY "Users can insert own ai_agent_outputs"
ON public.ai_agent_outputs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own ai_agent_outputs" ON public.ai_agent_outputs;
CREATE POLICY "Users can view own ai_agent_outputs"
ON public.ai_agent_outputs
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ai_agent_outputs" ON public.ai_agent_outputs;
CREATE POLICY "Users can update own ai_agent_outputs"
ON public.ai_agent_outputs
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all ai_agent_outputs" ON public.ai_agent_outputs;
CREATE POLICY "Admins can view all ai_agent_outputs"
ON public.ai_agent_outputs
FOR SELECT
USING (public.is_admin());

-- Trigger to maintain updated_at
DROP TRIGGER IF EXISTS update_ai_agent_outputs_updated_at ON public.ai_agent_outputs;
CREATE TRIGGER update_ai_agent_outputs_updated_at
BEFORE UPDATE ON public.ai_agent_outputs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_ai_agent_outputs_user_id ON public.ai_agent_outputs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_outputs_created_at ON public.ai_agent_outputs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_agent_outputs_project_id ON public.ai_agent_outputs(project_id);
