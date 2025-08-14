
-- Corrigir a tabela security_audit_logs para permitir user_id NULL durante operações de sistema
ALTER TABLE public.security_audit_logs ALTER COLUMN user_id DROP NOT NULL;

-- Adicionar uma constraint para garantir que ou user_id está presente OU é uma operação de sistema
ALTER TABLE public.security_audit_logs ADD CONSTRAINT security_audit_logs_user_or_system_check 
CHECK (
  user_id IS NOT NULL OR 
  (event_type IN ('system_startup', 'admin_user_creation', 'database_migration', 'system_maintenance'))
);

-- Limpar qualquer dado corrompido que possa estar causando problemas
DELETE FROM public.profiles WHERE email IN ('admin@pharmaconnect.dev', 'betomanzoli@gmail.com') AND user_type IS NULL;

-- Verificar e limpar registros órfãos na tabela user_roles
DELETE FROM public.user_roles WHERE user_id NOT IN (SELECT id FROM public.profiles);

-- Atualizar a função handle_new_user para não tentar criar logs de auditoria durante a criação
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recriar a função handle_new_user sem logs de auditoria problemáticos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  -- Inserir perfil sem tentar criar logs de auditoria durante a criação
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    user_type,
    organization_name,
    cnpj,
    description,
    phone,
    website,
    address,
    city,
    state,
    expertise_area,
    certifications,
    specializations
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'individual'),
    NEW.raw_user_meta_data->>'organization_name',
    NEW.raw_user_meta_data->>'cnpj',
    NEW.raw_user_meta_data->>'description',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'website',
    NEW.raw_user_meta_data->>'address',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'state',
    CASE 
      WHEN NEW.raw_user_meta_data->>'expertise_area' IS NOT NULL 
      THEN string_to_array(NEW.raw_user_meta_data->>'expertise_area', ',')
      ELSE NULL
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'certifications' IS NOT NULL 
      THEN string_to_array(NEW.raw_user_meta_data->>'certifications', ',')
      ELSE NULL
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'specializations' IS NOT NULL 
      THEN string_to_array(NEW.raw_user_meta_data->>'specializations', ',')
      ELSE NULL
    END
  );
  
  RETURN NEW;
END;
$$;

-- Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Criar configurações de segurança padrão para usuários
CREATE OR REPLACE FUNCTION public.create_default_user_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Criar configurações de notificação padrão
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Criar configurações de segurança padrão
  INSERT INTO public.user_security_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger para criar configurações padrão após inserção no profiles
DROP TRIGGER IF EXISTS create_user_defaults ON public.profiles;
CREATE TRIGGER create_user_defaults
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_default_user_settings();
