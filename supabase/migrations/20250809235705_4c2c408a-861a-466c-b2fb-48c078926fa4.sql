-- Create ai_chat_events table for telemetry logging
CREATE TABLE IF NOT EXISTS public.ai_chat_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  source text NOT NULL,
  action text NOT NULL DEFAULT 'message',
  message text NOT NULL,
  intents text[] NOT NULL DEFAULT '{}'::text[],
  topics text[] NOT NULL DEFAULT '{}'::text[],
  project_id uuid NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_chat_events ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can insert own ai chat events" ON public.ai_chat_events;
CREATE POLICY "Users can insert own ai chat events"
ON public.ai_chat_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own ai chat events" ON public.ai_chat_events;
CREATE POLICY "Users can view own ai chat events"
ON public.ai_chat_events
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all ai chat events" ON public.ai_chat_events;
CREATE POLICY "Admins can view all ai chat events"
ON public.ai_chat_events
FOR SELECT
USING (public.is_admin());

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_ai_chat_events_user_id ON public.ai_chat_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_events_created_at ON public.ai_chat_events(created_at);
