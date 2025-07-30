
-- 1. Corrigir funções de segurança com search_path adequado
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF user_id IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND user_type = 'admin'
  );
END;
$$;

-- 2. Corrigir função de perfil de usuário seguro
CREATE OR REPLACE FUNCTION public.safe_get_user_profile(user_id uuid)
RETURNS TABLE(id uuid, email text, first_name text, last_name text, user_type text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verificar se o usuário está autenticado
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Acesso negado: usuário não autenticado';
  END IF;
  
  -- Verificar se o usuário pode acessar este perfil
  IF auth.uid() != user_id AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: sem permissão para acessar este perfil';
  END IF;
  
  RETURN QUERY
  SELECT p.id, p.email, p.first_name, p.last_name, p.user_type
  FROM profiles p
  WHERE p.id = user_id;
END;
$$;

-- 3. Criar tabela de configurações de segurança se não existir
CREATE TABLE IF NOT EXISTS public.user_security_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  two_factor_enabled boolean DEFAULT false,
  two_factor_secret text,
  two_factor_setup_complete boolean DEFAULT false,
  two_factor_last_used timestamp with time zone,
  two_factor_activated_at timestamp with time zone,
  two_factor_disabled_at timestamp with time zone,
  backup_codes text[],
  backup_codes_regenerated_at timestamp with time zone,
  login_notifications boolean DEFAULT true,
  suspicious_activity_alerts boolean DEFAULT true,
  device_tracking boolean DEFAULT true,
  session_timeout integer DEFAULT 30,
  allowed_ip_ranges text[] DEFAULT '{}',
  max_failed_attempts integer DEFAULT 5,
  auto_lock_enabled boolean DEFAULT true,
  password_expiry_days integer DEFAULT 90,
  require_2fa_for_sensitive boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. Habilitar RLS na tabela de configurações de segurança
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS para configurações de segurança
CREATE POLICY "Users can view own security settings"
  ON public.user_security_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own security settings"
  ON public.user_security_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own security settings"
  ON public.user_security_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own security settings"
  ON public.user_security_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Criar configurações padrão para usuários existentes
INSERT INTO public.user_security_settings (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_security_settings)
ON CONFLICT (user_id) DO NOTHING;

-- 7. Criar função para limpar logs de segurança antigos
CREATE OR REPLACE FUNCTION public.clean_old_security_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM security_audit_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;

-- 8. Função para detectar atividade suspeita
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity(
  p_user_id uuid,
  p_ip_address text,
  p_user_agent text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  failed_attempts integer;
  recent_locations integer;
  suspicious boolean := false;
BEGIN
  -- Verificar tentativas de login falhadas recentes
  SELECT COUNT(*) INTO failed_attempts
  FROM security_audit_logs
  WHERE user_id = p_user_id
    AND event_type = 'failed_login'
    AND created_at > NOW() - INTERVAL '1 hour';
  
  -- Verificar múltiplas localizações recentes
  SELECT COUNT(DISTINCT ip_address) INTO recent_locations
  FROM security_audit_logs
  WHERE user_id = p_user_id
    AND created_at > NOW() - INTERVAL '1 hour'
    AND ip_address IS NOT NULL;
  
  -- Marcar como suspeito se houver muitas tentativas falhadas ou múltiplas localizações
  IF failed_attempts > 5 OR recent_locations > 3 THEN
    suspicious := true;
    
    -- Registrar evento suspeito
    INSERT INTO security_audit_logs (user_id, event_type, event_description, ip_address, user_agent)
    VALUES (
      p_user_id,
      'suspicious_activity',
      'Atividade suspeita detectada: ' || failed_attempts || ' tentativas falhadas, ' || recent_locations || ' localizações',
      p_ip_address,
      p_user_agent
    );
  END IF;
  
  RETURN suspicious;
END;
$$;

-- 9. Função para validar configurações de segurança
CREATE OR REPLACE FUNCTION public.validate_security_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Validar timeout de sessão
  IF NEW.session_timeout < 5 OR NEW.session_timeout > 480 THEN
    RAISE EXCEPTION 'Timeout de sessão deve estar entre 5 e 480 minutos';
  END IF;
  
  -- Validar máximo de tentativas falhadas
  IF NEW.max_failed_attempts < 3 OR NEW.max_failed_attempts > 20 THEN
    RAISE EXCEPTION 'Máximo de tentativas falhadas deve estar entre 3 e 20';
  END IF;
  
  -- Validar expiração de senha
  IF NEW.password_expiry_days < 0 OR NEW.password_expiry_days > 365 THEN
    RAISE EXCEPTION 'Expiração de senha deve estar entre 0 e 365 dias';
  END IF;
  
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 10. Criar trigger para validação de configurações
CREATE TRIGGER validate_security_settings_trigger
  BEFORE UPDATE ON public.user_security_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_security_settings();

-- 11. Criar índices para performance de segurança
CREATE INDEX IF NOT EXISTS idx_security_logs_user_time 
  ON security_audit_logs(user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_security_logs_event_type 
  ON security_audit_logs(event_type, created_at);

CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address 
  ON security_audit_logs(ip_address, created_at);

-- 12. Função para gerar relatório de segurança
CREATE OR REPLACE FUNCTION public.generate_security_report(
  p_user_id uuid DEFAULT auth.uid(),
  p_days integer DEFAULT 30
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  report jsonb;
  failed_logins integer;
  successful_logins integer;
  suspicious_activities integer;
  unique_ips integer;
  last_login timestamp with time zone;
BEGIN
  -- Verificar se o usuário pode acessar este relatório
  IF auth.uid() != p_user_id AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: sem permissão para acessar este relatório';
  END IF;
  
  -- Coletar estatísticas
  SELECT COUNT(*) INTO failed_logins
  FROM security_audit_logs
  WHERE user_id = p_user_id
    AND event_type = 'failed_login'
    AND created_at > NOW() - INTERVAL '%s days', p_days;
  
  SELECT COUNT(*) INTO successful_logins
  FROM security_audit_logs
  WHERE user_id = p_user_id
    AND event_type = 'successful_login'
    AND created_at > NOW() - INTERVAL '%s days', p_days;
  
  SELECT COUNT(*) INTO suspicious_activities
  FROM security_audit_logs
  WHERE user_id = p_user_id
    AND event_type = 'suspicious_activity'
    AND created_at > NOW() - INTERVAL '%s days', p_days;
  
  SELECT COUNT(DISTINCT ip_address) INTO unique_ips
  FROM security_audit_logs
  WHERE user_id = p_user_id
    AND ip_address IS NOT NULL
    AND created_at > NOW() - INTERVAL '%s days', p_days;
  
  SELECT MAX(created_at) INTO last_login
  FROM security_audit_logs
  WHERE user_id = p_user_id
    AND event_type = 'successful_login';
  
  -- Construir relatório
  report := jsonb_build_object(
    'period_days', p_days,
    'failed_logins', failed_logins,
    'successful_logins', successful_logins,
    'suspicious_activities', suspicious_activities,
    'unique_ips', unique_ips,
    'last_login', last_login,
    'security_score', CASE 
      WHEN suspicious_activities > 0 THEN 'baixo'
      WHEN failed_logins > 10 THEN 'médio'
      ELSE 'alto'
    END,
    'generated_at', now()
  );
  
  RETURN report;
END;
$$;
