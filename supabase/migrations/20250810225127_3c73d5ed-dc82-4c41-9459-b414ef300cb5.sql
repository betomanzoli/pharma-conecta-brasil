-- Fix Security Definer View: recreate with security_invoker so RLS is enforced
DROP VIEW IF EXISTS public.v_ai_chat_context;

CREATE VIEW public.v_ai_chat_context
WITH (security_invoker = on) AS
SELECT
  t.id AS thread_id,
  t.user_id,
  array_agg(
    jsonb_build_object(
      'role', m.role,
      'content', m.content,
      'created_at', m.created_at
    )
    ORDER BY m.created_at DESC
  ) AS messages_desc
FROM public.ai_chat_threads t
JOIN public.ai_chat_messages m ON m.thread_id = t.id
GROUP BY t.id, t.user_id;

GRANT SELECT ON public.v_ai_chat_context TO anon, authenticated;