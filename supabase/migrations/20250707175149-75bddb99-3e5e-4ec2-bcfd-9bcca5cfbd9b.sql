-- Corrigir warnings de segurança do Supabase Security Advisor

-- 1. Habilitar proteção contra senhas vazadas
UPDATE auth.config SET leaked_password_protection = true;

-- 2. Configurar políticas de senha mais seguras
UPDATE auth.config SET 
  password_min_length = 8,
  password_require_uppercase = true,
  password_require_lowercase = true,
  password_require_numbers = true,
  password_require_symbols = true;

-- 3. Configurar expiração de OTP para 5 minutos (300 segundos)
UPDATE auth.config SET otp_expiry = 300;

-- 4. Habilitar verificação de email obrigatória
UPDATE auth.config SET email_confirmation_required = true;

-- 5. Configurar rate limiting mais restritivo
UPDATE auth.config SET 
  rate_limit_email_sent = 60,  -- máximo 60 emails por hora
  rate_limit_sms_sent = 10,    -- máximo 10 SMS por hora
  rate_limit_verify = 10;      -- máximo 10 tentativas de verificação por hora

-- 6. Melhorar configurações de sessão
UPDATE auth.config SET 
  jwt_expiry = 3600,           -- JWT expira em 1 hora
  refresh_token_rotation_enabled = true,  -- rotação de refresh tokens
  session_timeout = 28800;     -- timeout de sessão em 8 horas

-- 7. Habilitar auditoria de login
UPDATE auth.config SET enable_audit_trail = true;

-- 8. Corrigir funções que podem retornar null - adicionar verificações de segurança
CREATE OR REPLACE FUNCTION public.safe_get_user_profile(user_id uuid)
RETURNS TABLE(id uuid, email text, first_name text, last_name text, user_type text)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
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

-- 9. Criar função segura para verificar permissões de admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Verificar se o usuário está autenticado
  IF user_id IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND user_type = 'admin'
  );
END;
$$;

-- 10. Criar função para log de auditoria
CREATE OR REPLACE FUNCTION public.audit_log(
  action_type text,
  table_name text,
  record_id uuid,
  details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO performance_metrics (
    metric_name,
    metric_value,
    metric_unit,
    tags
  ) VALUES (
    'audit_log',
    1,
    'event',
    jsonb_build_object(
      'user_id', auth.uid(),
      'action_type', action_type,
      'table_name', table_name,
      'record_id', record_id,
      'details', details,
      'timestamp', now(),
      'ip_address', current_setting('request.headers', true)::jsonb->>'x-forwarded-for'
    )
  );
END;
$$;

-- 11. Melhorar política RLS para tabelas sensíveis
-- Atualizar política de admin para usar função segura
DROP POLICY IF EXISTS "Only admins can manage cron jobs" ON public.cron_jobs;
CREATE POLICY "Only admins can manage cron jobs" 
ON public.cron_jobs 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can manage API configurations" ON public.api_configurations;
CREATE POLICY "Only admins can manage API configurations" 
ON public.api_configurations 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can manage integration data" ON public.integration_data;
CREATE POLICY "Only admins can manage integration data" 
ON public.integration_data 
FOR ALL 
USING (public.is_admin());

-- 12. Criar índices para melhorar performance de consultas de segurança
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_messages_participants ON messages(sender_id, receiver_id);

-- 13. Adicionar constraint para validar emails
ALTER TABLE profiles ADD CONSTRAINT valid_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 14. Adicionar triggers de auditoria para tabelas importantes
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Log da operação
  PERFORM public.audit_log(
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'old_values', to_jsonb(OLD),
      'new_values', to_jsonb(NEW)
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Adicionar triggers de auditoria em tabelas críticas
DROP TRIGGER IF EXISTS audit_profiles_trigger ON profiles;
CREATE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_companies_trigger ON companies;
CREATE TRIGGER audit_companies_trigger
  AFTER INSERT OR UPDATE OR DELETE ON companies
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_api_configurations_trigger ON api_configurations;
CREATE TRIGGER audit_api_configurations_trigger
  AFTER INSERT OR UPDATE OR DELETE ON api_configurations
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();