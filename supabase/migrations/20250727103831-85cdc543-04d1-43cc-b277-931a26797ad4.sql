
-- Create user_security_settings table
CREATE TABLE public.user_security_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  login_notifications BOOLEAN DEFAULT true,
  suspicious_activity_alerts BOOLEAN DEFAULT true,
  device_tracking BOOLEAN DEFAULT true,
  session_timeout INTEGER DEFAULT 30,
  allowed_ip_ranges TEXT[] DEFAULT '{}',
  max_failed_attempts INTEGER DEFAULT 5,
  auto_lock_enabled BOOLEAN DEFAULT true,
  password_expiry_days INTEGER DEFAULT 90,
  require_2fa_for_sensitive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create security_audit_logs table
CREATE TABLE public.security_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_description TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for user_security_settings
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own security settings" 
  ON public.user_security_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own security settings" 
  ON public.user_security_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own security settings" 
  ON public.user_security_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for security_audit_logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own security audit logs" 
  ON public.security_audit_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert security audit logs" 
  ON public.security_audit_logs 
  FOR INSERT 
  WITH CHECK (true);

-- Create log_security_event function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_description TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    event_type,
    event_description,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    p_user_id,
    p_event_type,
    p_description,
    p_ip_address,
    p_user_agent,
    p_metadata
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$function$;

-- Add trigger to update updated_at column for user_security_settings
CREATE TRIGGER update_user_security_settings_updated_at
  BEFORE UPDATE ON public.user_security_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
