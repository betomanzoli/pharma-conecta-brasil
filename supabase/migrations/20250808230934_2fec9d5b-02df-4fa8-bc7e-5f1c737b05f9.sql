-- Create table to store AI chat telemetry events
CREATE TABLE IF NOT EXISTS public.ai_chat_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  source TEXT NOT NULL, -- e.g., 'master_ai_hub', 'ai_assistant'
  action TEXT NOT NULL DEFAULT 'message', -- e.g., 'message', 'init', 'search'
  message TEXT NOT NULL,
  intents TEXT[] DEFAULT '{}'::text[],
  topics TEXT[] DEFAULT '{}'::text[],
  project_id UUID NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_chat_events ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ BEGIN
  -- Allow users to insert their own events
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_chat_events' AND policyname = 'Users can insert own ai chat events'
  ) THEN
    CREATE POLICY "Users can insert own ai chat events"
    ON public.ai_chat_events
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Allow users to view their own events
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_chat_events' AND policyname = 'Users can view own ai chat events'
  ) THEN
    CREATE POLICY "Users can view own ai chat events"
    ON public.ai_chat_events
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  -- Allow admins to view all events
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_chat_events' AND policyname = 'Admins can view all ai chat events'
  ) THEN
    CREATE POLICY "Admins can view all ai chat events"
    ON public.ai_chat_events
    FOR SELECT
    USING (public.is_admin());
  END IF;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_ai_chat_events_user_created ON public.ai_chat_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_chat_events_source_created ON public.ai_chat_events (source, created_at DESC);
