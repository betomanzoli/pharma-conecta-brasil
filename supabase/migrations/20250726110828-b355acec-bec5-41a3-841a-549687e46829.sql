
-- Criar tabela para configurações de segurança do usuário (2FA)
CREATE TABLE public.user_security_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  two_factor_secret TEXT,
  two_factor_setup_complete BOOLEAN NOT NULL DEFAULT false,
  two_factor_last_used TIMESTAMP WITH TIME ZONE,
  backup_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own security settings" 
  ON public.user_security_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own security settings" 
  ON public.user_security_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own security settings" 
  ON public.user_security_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Criar tabela para pesos de modelos ML
CREATE TABLE public.ml_model_weights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_version TEXT NOT NULL,
  weights JSONB NOT NULL DEFAULT '{}',
  training_data_size INTEGER NOT NULL DEFAULT 0,
  accuracy_score NUMERIC(3,2) NOT NULL DEFAULT 0.0,
  trained_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para ML model weights
ALTER TABLE public.ml_model_weights ENABLE ROW LEVEL SECURITY;

-- Política para visualização pública dos modelos
CREATE POLICY "Anyone can view ML model weights" 
  ON public.ml_model_weights 
  FOR SELECT 
  USING (true);

-- Política para admins gerenciarem modelos
CREATE POLICY "Admins can manage ML model weights" 
  ON public.ml_model_weights 
  FOR ALL 
  USING (is_admin());

-- Trigger para updated_at
CREATE TRIGGER update_user_security_settings_updated_at
  BEFORE UPDATE ON public.user_security_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ml_model_weights_updated_at
  BEFORE UPDATE ON public.ml_model_weights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
