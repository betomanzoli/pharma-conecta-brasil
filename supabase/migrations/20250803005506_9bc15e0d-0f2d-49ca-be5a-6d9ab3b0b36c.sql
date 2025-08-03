
-- Criar tabela para armazenar documentos de verificação
CREATE TABLE public.user_verification_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('cnpj_certificate', 'anvisa_license', 'professional_certificate', 'company_registration', 'laboratory_accreditation')),
  document_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para o status de verificação dos usuários
CREATE TABLE public.user_verification_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('identity', 'company', 'laboratory', 'consultant', 'anvisa')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'verified', 'rejected', 'expired')),
  verified_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  verified_by UUID REFERENCES public.profiles(id),
  verification_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, verification_type)
);

-- Criar tabela para validação de CNPJ
CREATE TABLE public.cnpj_validations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cnpj TEXT NOT NULL,
  company_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'valid', 'invalid', 'not_found')),
  receita_federal_data JSONB DEFAULT '{}',
  anvisa_registration_data JSONB DEFAULT '{}',
  validated_at TIMESTAMP WITH TIME ZONE,
  last_check TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cnpj)
);

-- Criar tabela para badges de verificação
CREATE TABLE public.verification_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('verified_company', 'anvisa_registered', 'certified_lab', 'expert_consultant', 'premium_member')),
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT,
  badge_color TEXT DEFAULT '#10B981',
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  verification_criteria JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_type)
);

-- Ativar RLS nas tabelas
ALTER TABLE public.user_verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_verification_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cnpj_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_badges ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_verification_documents
CREATE POLICY "Users can view own verification documents" 
  ON public.user_verification_documents 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own verification documents" 
  ON public.user_verification_documents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all verification documents" 
  ON public.user_verification_documents 
  FOR SELECT 
  USING (is_admin());

-- Políticas RLS para user_verification_status
CREATE POLICY "Users can view own verification status" 
  ON public.user_verification_status 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage verification status" 
  ON public.user_verification_status 
  FOR ALL 
  USING (is_admin());

CREATE POLICY "System can update verification status" 
  ON public.user_verification_status 
  FOR UPDATE 
  USING (true);

-- Políticas RLS para cnpj_validations
CREATE POLICY "Users can view own CNPJ validations" 
  ON public.cnpj_validations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own CNPJ validations" 
  ON public.cnpj_validations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage CNPJ validations" 
  ON public.cnpj_validations 
  FOR ALL 
  USING (is_admin());

-- Políticas RLS para verification_badges
CREATE POLICY "Users can view all verification badges" 
  ON public.verification_badges 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage verification badges" 
  ON public.verification_badges 
  FOR ALL 
  USING (is_admin());

CREATE POLICY "System can award verification badges" 
  ON public.verification_badges 
  FOR INSERT 
  WITH CHECK (true);

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_verification_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_user_verification_documents_updated_at 
  BEFORE UPDATE ON public.user_verification_documents 
  FOR EACH ROW EXECUTE PROCEDURE public.update_verification_updated_at_column();

CREATE TRIGGER update_user_verification_status_updated_at 
  BEFORE UPDATE ON public.user_verification_status 
  FOR EACH ROW EXECUTE PROCEDURE public.update_verification_updated_at_column();

CREATE TRIGGER update_cnpj_validations_updated_at 
  BEFORE UPDATE ON public.cnpj_validations 
  FOR EACH ROW EXECUTE PROCEDURE public.update_verification_updated_at_column();

CREATE TRIGGER update_verification_badges_updated_at 
  BEFORE UPDATE ON public.verification_badges 
  FOR EACH ROW EXECUTE PROCEDURE public.update_verification_updated_at_column();

-- Função para criar status de verificação inicial
CREATE OR REPLACE FUNCTION public.create_initial_verification_status()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Criar status de verificação baseado no tipo de usuário
  IF NEW.user_type = 'company' OR NEW.user_type = 'pharmaceutical_company' THEN
    INSERT INTO public.user_verification_status (user_id, profile_id, verification_type, status)
    VALUES 
      (NEW.id, NEW.id, 'identity', 'pending'),
      (NEW.id, NEW.id, 'company', 'pending');
  ELSIF NEW.user_type = 'laboratory' THEN
    INSERT INTO public.user_verification_status (user_id, profile_id, verification_type, status)
    VALUES 
      (NEW.id, NEW.id, 'identity', 'pending'),
      (NEW.id, NEW.id, 'company', 'pending'),
      (NEW.id, NEW.id, 'laboratory', 'pending'),
      (NEW.id, NEW.id, 'anvisa', 'pending');
  ELSIF NEW.user_type = 'consultant' THEN
    INSERT INTO public.user_verification_status (user_id, profile_id, verification_type, status)
    VALUES 
      (NEW.id, NEW.id, 'identity', 'pending'),
      (NEW.id, NEW.id, 'consultant', 'pending');
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Trigger para criar status de verificação inicial
CREATE TRIGGER on_profile_created_verification
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.create_initial_verification_status();

-- Função para validar CNPJ automaticamente
CREATE OR REPLACE FUNCTION public.auto_validate_cnpj()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Validar formato do CNPJ
  IF LENGTH(REPLACE(REPLACE(REPLACE(NEW.cnpj, '.', ''), '/', ''), '-', '')) = 14 THEN
    NEW.status := 'pending';
  ELSE
    NEW.status := 'invalid';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Trigger para validação automática de CNPJ
CREATE TRIGGER auto_validate_cnpj_trigger
  BEFORE INSERT ON public.cnpj_validations
  FOR EACH ROW EXECUTE PROCEDURE public.auto_validate_cnpj();
