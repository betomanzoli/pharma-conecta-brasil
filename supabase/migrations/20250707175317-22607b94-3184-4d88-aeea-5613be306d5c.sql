-- Corrigir warnings de segurança do Supabase (versão compatível)

-- 1. Criar função segura para verificar permissões de admin
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

-- 2. Criar função segura para acessar perfis de usuário
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
  IF auth.uid() != user_id AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: sem permissão para acessar este perfil';
  END IF;
  
  RETURN QUERY
  SELECT p.id, p.email, p.first_name, p.last_name, p.user_type
  FROM profiles p
  WHERE p.id = user_id;
END;
$$;

-- 3. Criar função para log de auditoria
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
      'timestamp', now()
    )
  );
END;
$$;

-- 4. Melhorar políticas RLS para usar função segura
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

-- 5. Criar índices para melhorar performance de consultas de segurança
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_messages_participants ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name_time ON performance_metrics(metric_name, measured_at DESC);

-- 6. Adicionar constraint para validar emails
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS valid_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 7. Adicionar triggers de auditoria para tabelas importantes
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Log da operação para tabelas críticas
  IF TG_TABLE_NAME IN ('profiles', 'companies', 'api_configurations', 'cron_jobs') THEN
    PERFORM public.audit_log(
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      jsonb_build_object(
        'old_values', to_jsonb(OLD),
        'new_values', to_jsonb(NEW)
      )
    );
  END IF;
  
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

-- 8. Criar função para validar força de senha (para usar no frontend)
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb := '{"valid": true, "issues": []}'::jsonb;
  issues text[] := '{}';
BEGIN
  -- Verificar comprimento mínimo
  IF length(password) < 8 THEN
    issues := array_append(issues, 'Senha deve ter pelo menos 8 caracteres');
  END IF;
  
  -- Verificar maiúscula
  IF password !~ '[A-Z]' THEN
    issues := array_append(issues, 'Senha deve conter pelo menos uma letra maiúscula');
  END IF;
  
  -- Verificar minúscula
  IF password !~ '[a-z]' THEN
    issues := array_append(issues, 'Senha deve conter pelo menos uma letra minúscula');
  END IF;
  
  -- Verificar número
  IF password !~ '[0-9]' THEN
    issues := array_append(issues, 'Senha deve conter pelo menos um número');
  END IF;
  
  -- Verificar símbolos
  IF password !~ '[^A-Za-z0-9]' THEN
    issues := array_append(issues, 'Senha deve conter pelo menos um símbolo especial');
  END IF;
  
  -- Construir resultado
  IF array_length(issues, 1) > 0 THEN
    result := jsonb_build_object(
      'valid', false,
      'issues', to_jsonb(issues)
    );
  END IF;
  
  RETURN result;
END;
$$;

-- 9. Melhorar função de criação de notificações para incluir auditoria
CREATE OR REPLACE FUNCTION public.create_system_notification_secure(
  target_user_id uuid, 
  notification_title text, 
  notification_message text, 
  notification_type text DEFAULT 'system'::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
  should_notify BOOLEAN := true;
BEGIN
  -- Verificar se o usuário de destino existe
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = target_user_id) THEN
    RAISE EXCEPTION 'Usuário de destino não encontrado';
  END IF;
  
  -- Verificar preferências do usuário
  SELECT 
    CASE 
      WHEN notification_type = 'mentorship' THEN np.mentorship_enabled
      WHEN notification_type = 'forum' THEN np.forum_enabled
      WHEN notification_type = 'system' THEN np.system_enabled
      WHEN notification_type = 'knowledge' THEN np.knowledge_enabled
      ELSE true
    END INTO should_notify
  FROM public.notification_preferences np
  WHERE np.user_id = target_user_id;
  
  -- Se não encontrou preferências, criar padrão e permitir notificação
  IF should_notify IS NULL THEN
    INSERT INTO public.notification_preferences (user_id)
    VALUES (target_user_id)
    ON CONFLICT (user_id) DO NOTHING;
    should_notify := true;
  END IF;
  
  -- Criar notificação se usuário permitir
  IF should_notify THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (target_user_id, notification_title, notification_message, notification_type)
    RETURNING id INTO notification_id;
    
    -- Log da criação da notificação
    PERFORM public.audit_log(
      'CREATE_NOTIFICATION',
      'notifications',
      notification_id,
      jsonb_build_object(
        'target_user_id', target_user_id,
        'type', notification_type,
        'title', notification_title
      )
    );
  END IF;
  
  RETURN notification_id;
END;
$$;