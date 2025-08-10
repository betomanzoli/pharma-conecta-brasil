-- 1) Tabela para outputs dos agentes de IA, usada pelos hooks e pelo orquestrador
CREATE TABLE IF NOT EXISTS public.ai_agent_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID NULL,
  agent_type TEXT NOT NULL,
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_md TEXT NOT NULL,
  kpis JSONB NULL,
  handoff_to TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and policies
ALTER TABLE public.ai_agent_outputs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users can manage own agent outputs" ON public.ai_agent_outputs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Updated-at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ai_agent_outputs_updated_at ON public.ai_agent_outputs;
CREATE TRIGGER trg_ai_agent_outputs_updated_at
BEFORE UPDATE ON public.ai_agent_outputs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Tabelas para chat persistente com contexto
CREATE TABLE IF NOT EXISTS public.ai_chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  messages_count INT NOT NULL DEFAULT 0,
  last_message_preview TEXT NULL
);

ALTER TABLE public.ai_chat_threads ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users can manage own chat threads" ON public.ai_chat_threads
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DROP TRIGGER IF EXISTS trg_ai_chat_threads_updated_at ON public.ai_chat_threads;
CREATE TRIGGER trg_ai_chat_threads_updated_at
BEFORE UPDATE ON public.ai_chat_threads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.ai_chat_threads(id) ON DELETE CASCADE,
  user_id UUID NULL, -- null for assistant
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  tokens INT NULL,
  metadata JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users can manage messages in own threads" ON public.ai_chat_messages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_chat_threads t
      WHERE t.id = thread_id AND t.user_id = auth.uid()
    )
  )
  WITH CHECK (
    (user_id IS NULL OR user_id = auth.uid()) AND EXISTS (
      SELECT 1 FROM public.ai_chat_threads t
      WHERE t.id = thread_id AND t.user_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Helper function to update thread counters
CREATE OR REPLACE FUNCTION public.update_ai_thread_counters()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.ai_chat_threads
  SET 
    messages_count = (SELECT COUNT(*) FROM public.ai_chat_messages m WHERE m.thread_id = NEW.thread_id),
    last_message_preview = LEFT(NEW.content, 120),
    updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ai_chat_messages_after_insert ON public.ai_chat_messages;
CREATE TRIGGER trg_ai_chat_messages_after_insert
AFTER INSERT ON public.ai_chat_messages
FOR EACH ROW EXECUTE FUNCTION public.update_ai_thread_counters();

-- 3) Índices úteis
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_thread_created ON public.ai_chat_messages(thread_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_chat_threads_user_updated ON public.ai_chat_threads(user_id, updated_at DESC);

-- 4) Opcional: view para obter últimas N mensagens de um thread
CREATE OR REPLACE VIEW public.v_ai_chat_context AS
SELECT 
  t.id as thread_id,
  t.user_id,
  array_agg(jsonb_build_object('role', role, 'content', content, 'created_at', created_at) ORDER BY created_at DESC) FILTER (WHERE true) as messages_desc
FROM public.ai_chat_threads t
JOIN public.ai_chat_messages m ON m.thread_id = t.id
GROUP BY t.id, t.user_id;