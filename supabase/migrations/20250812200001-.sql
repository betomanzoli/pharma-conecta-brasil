-- Fix security warnings for functions
-- Add search_path parameter to functions for security

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

CREATE OR REPLACE FUNCTION public.audit_log(
  action_type text,
  table_name text,
  record_id uuid,
  details jsonb DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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