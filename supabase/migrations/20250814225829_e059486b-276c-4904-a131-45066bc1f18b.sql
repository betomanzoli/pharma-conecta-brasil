
-- Inserir usuário administrador provisório no sistema de autenticação
-- Nota: Este é um método temporário para desenvolvimento/teste
-- Em produção, use o processo normal de registro

-- Primeiro, vamos criar um perfil de administrador provisório
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  user_type,
  organization_name
) VALUES (
  gen_random_uuid(),
  'admin@pharmaconnect.dev',
  'Admin',
  'Provisório',
  'admin',
  'PharmaConnect Admin'
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
  'Criação de usuário administrador provisório para desenvolvimento',
  jsonb_build_object(
    'email', 'admin@pharmaconnect.dev',
    'temporary', true,
    'created_by', 'system'
  )
FROM public.profiles p 
WHERE p.email = 'admin@pharmaconnect.dev';
