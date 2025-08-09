-- SECURITY: Harden function search_path for security (avoid search_path hijacking)
-- Adds SET search_path = 'public' for all custom functions

ALTER FUNCTION public.update_forum_topic_stats() SET search_path = 'public';
ALTER FUNCTION public.update_reply_likes_count() SET search_path = 'public';
ALTER FUNCTION public.update_knowledge_rating_stats() SET search_path = 'public';
ALTER FUNCTION public.increment_download_count() SET search_path = 'public';
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.clean_old_metrics() SET search_path = 'public';
ALTER FUNCTION public.update_brazilian_content_stats() SET search_path = 'public';
ALTER FUNCTION public.update_chat_activity() SET search_path = 'public';
ALTER FUNCTION public.update_anvisa_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.clean_expired_embedding_cache() SET search_path = 'public';
ALTER FUNCTION public.update_verification_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.safe_get_user_profile(uuid) SET search_path = 'public';
ALTER FUNCTION public.audit_log(text, text, uuid, jsonb) SET search_path = 'public';
ALTER FUNCTION public.trigger_clean_embedding_cache() SET search_path = 'public';
ALTER FUNCTION public.audit_trigger_function() SET search_path = 'public';
ALTER FUNCTION public.is_admin(uuid) SET search_path = 'public';
ALTER FUNCTION public.get_analytics_data(date, date, text) SET search_path = 'public';
ALTER FUNCTION public.validate_password_strength(text) SET search_path = 'public';
ALTER FUNCTION public.log_security_event(uuid, text, text, text, text, jsonb) SET search_path = 'public';
ALTER FUNCTION public.create_initial_verification_status() SET search_path = 'public';
ALTER FUNCTION public.auto_validate_cnpj() SET search_path = 'public';
ALTER FUNCTION public.mark_notification_read(uuid) SET search_path = 'public';
ALTER FUNCTION public.mark_all_notifications_read() SET search_path = 'public';
ALTER FUNCTION public.create_auto_notifications() SET search_path = 'public';
ALTER FUNCTION public.create_mentorship_notifications() SET search_path = 'public';
ALTER FUNCTION public.create_system_notification(uuid, text, text, text) SET search_path = 'public';
ALTER FUNCTION public.update_mentor_stats() SET search_path = 'public';
ALTER FUNCTION public.get_available_mentors(text[], numeric, numeric) SET search_path = 'public';
ALTER FUNCTION public.create_forum_notifications() SET search_path = 'public';
ALTER FUNCTION public.handle_forum_like_removal() SET search_path = 'public';
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';
ALTER FUNCTION public.create_default_notification_preferences() SET search_path = 'public';

-- FEATURE: Create ai_embeddings table to persist user/profile embeddings for reuse
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'ai_embeddings'
  ) THEN
    CREATE TABLE public.ai_embeddings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      entity_type TEXT NOT NULL, -- 'user' | 'company' | 'laboratory' | 'consultant' | 'project'
      entity_id UUID NULL,
      model TEXT NULL,
      dimension INTEGER NULL,
      embedding_data JSONB NOT NULL, -- stores numeric array
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    -- Indexes for lookups
    CREATE INDEX IF NOT EXISTS idx_ai_embeddings_user ON public.ai_embeddings(user_id);
    CREATE INDEX IF NOT EXISTS idx_ai_embeddings_entity ON public.ai_embeddings(entity_type, entity_id);

    -- Enable RLS and policies
    ALTER TABLE public.ai_embeddings ENABLE ROW LEVEL SECURITY;

    -- Users can insert/select/update their own embeddings
    CREATE POLICY "Users can manage own embeddings"
    ON public.ai_embeddings
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

    -- Update updated_at automatically
    CREATE TRIGGER update_ai_embeddings_updated_at
    BEFORE UPDATE ON public.ai_embeddings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;