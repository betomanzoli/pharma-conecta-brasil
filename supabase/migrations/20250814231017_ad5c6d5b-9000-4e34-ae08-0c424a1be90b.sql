
-- Corrigir a constraint da tabela profiles para permitir 'admin' como user_type válido
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- Recriar a constraint incluindo 'admin'
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN (
  'company', 'laboratory', 'consultant', 'individual', 'admin',
  'professional', 'regulatory_body', 'sector_entity', 
  'research_institution', 'supplier', 'funding_agency', 'healthcare_provider'
));

-- Limpar dados inconsistentes (se existirem)
DELETE FROM public.profiles WHERE email = 'admin@pharmaconnect.dev';
DELETE FROM public.user_roles WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email = 'admin@pharmaconnect.dev'
);

-- Criar o perfil administrador provisório (sem organization_name que não existe)
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  user_type
) VALUES (
  gen_random_uuid(),
  'admin@pharmaconnect.dev',
  'Admin',
  'Provisório',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Adicionar role de admin para este usuário
INSERT INTO public.user_roles (
  user_id,
  role
) 
SELECT 
  p.id,
  'admin'::app_role
FROM public.profiles p 
WHERE p.email = 'admin@pharmaconnect.dev'
ON CONFLICT (user_id, role) DO NOTHING;

-- Log da criação do usuário provisório
INSERT INTO public.security_audit_logs (
  user_id,
  event_type,
  event_description,
  metadata
) 
SELECT 
  p.id,
  'admin_user_creation',
  'Criação de usuário administrador provisório para desenvolvimento (corrigido)',
  jsonb_build_object(
    'email', 'admin@pharmaconnect.dev',
    'temporary', true,
    'created_by', 'system',
    'fix_applied', true
  )
FROM public.profiles p 
WHERE p.email = 'admin@pharmaconnect.dev';
