-- Harden functions with explicit search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_ai_thread_counters()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.ai_chat_threads
  SET 
    messages_count = (SELECT COUNT(*) FROM public.ai_chat_messages m WHERE m.thread_id = NEW.thread_id),
    last_message_preview = LEFT(NEW.content, 120),
    updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;