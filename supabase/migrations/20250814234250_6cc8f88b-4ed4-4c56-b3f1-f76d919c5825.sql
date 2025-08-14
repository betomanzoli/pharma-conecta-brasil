
-- Adicionar as colunas que estão faltando na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cnpj TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expertise_area TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS certifications TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specializations TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Garantir que a tabela notification_preferences existe
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  mentorship_enabled BOOLEAN DEFAULT true,
  forum_enabled BOOLEAN DEFAULT true,
  system_enabled BOOLEAN DEFAULT true,
  knowledge_enabled BOOLEAN DEFAULT true,
  marketing_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Criar política para notification_preferences
DROP POLICY IF EXISTS "Users can manage own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can manage own notification preferences"
  ON public.notification_preferences
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Limpar dados corrompidos e órfãos
DELETE FROM public.profiles WHERE email IS NULL OR user_type IS NULL;
DELETE FROM public.user_security_settings WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.notification_preferences WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Recriar a função handle_new_user de forma mais robusta
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
DECLARE
  user_type_value TEXT;
  expertise_array TEXT[];
  certifications_array TEXT[];
  specializations_array TEXT[];
BEGIN
  -- Obter user_type com fallback
  user_type_value := COALESCE(NEW.raw_user_meta_data->>'user_type', 'individual');
  
  -- Processar arrays de expertise
  IF NEW.raw_user_meta_data->>'expertise_area' IS NOT NULL AND NEW.raw_user_meta_data->>'expertise_area' != '' THEN
    expertise_array := string_to_array(NEW.raw_user_meta_data->>'expertise_area', ',');
  ELSE
    expertise_array := NULL;
  END IF;
  
  -- Processar arrays de certificações
  IF NEW.raw_user_meta_data->>'certifications' IS NOT NULL AND NEW.raw_user_meta_data->>'certifications' != '' THEN
    certifications_array := string_to_array(NEW.raw_user_meta_data->>'certifications', ',');
  ELSE
    certifications_array := NULL;
  END IF;
  
  -- Processar arrays de especializações
  IF NEW.raw_user_meta_data->>'specializations' IS NOT NULL AND NEW.raw_user_meta_data->>'specializations' != '' THEN
    specializations_array := string_to_array(NEW.raw_user_meta_data->>'specializations', ',');
  ELSE
    specializations_array := NULL;
  END IF;

  -- Inserir perfil com tratamento de erro
  BEGIN
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
      zip_code,
      expertise_area,
      certifications,
      specializations,
      linkedin_url,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name',
      user_type_value,
      NEW.raw_user_meta_data->>'organization_name',
      NEW.raw_user_meta_data->>'cnpj',
      NEW.raw_user_meta_data->>'description',
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'website',
      NEW.raw_user_meta_data->>'address',
      NEW.raw_user_meta_data->>'city',
      NEW.raw_user_meta_data->>'state',
      NEW.raw_user_meta_data->>'zip_code',
      expertise_array,
      certifications_array,
      specializations_array,
      NEW.raw_user_meta_data->>'linkedin_url',
      now(),
      now()
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log do erro mas não bloquear a criação do usuário
    RAISE WARNING 'Erro ao criar perfil para usuário %: %', NEW.id, SQLERRM;
    -- Inserir perfil mínimo
    INSERT INTO public.profiles (id, email, user_type, created_at, updated_at)
    VALUES (NEW.id, NEW.email, 'individual', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END;
  
  RETURN NEW;
END;
$$;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
