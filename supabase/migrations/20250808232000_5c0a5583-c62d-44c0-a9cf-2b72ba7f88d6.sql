-- Harden function search_path for security (avoid search_path hijacking)
-- This migration adds SET search_path to 'public' for all custom functions

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