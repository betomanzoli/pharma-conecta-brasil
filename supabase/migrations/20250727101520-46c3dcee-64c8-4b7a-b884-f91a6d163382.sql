
-- Criar tabela para logs de auditoria de segurança
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  event_type TEXT NOT NULL,
  event_description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para security_audit_logs
CREATE POLICY "Users can view own security logs" 
  ON public.security_audit_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert security logs" 
  ON public.security_audit_logs 
  FOR INSERT 
  WITH CHECK (true);

-- Criar tabela para algoritmos de matching
CREATE TABLE IF NOT EXISTS public.matching_algorithms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  algorithm_name TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  parameters JSONB DEFAULT '{}'::jsonb,
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.matching_algorithms ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para matching_algorithms
CREATE POLICY "Anyone can view active algorithms" 
  ON public.matching_algorithms 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can manage algorithms" 
  ON public.matching_algorithms 
  FOR ALL 
  USING (is_admin());

-- Criar tabela para armazenar embeddings AI
CREATE TABLE IF NOT EXISTS public.ai_embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  embedding_vector VECTOR(1536), -- Para OpenAI embeddings
  content_hash TEXT NOT NULL,
  model_used TEXT NOT NULL DEFAULT 'text-embedding-ada-002',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days')
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ai_embeddings_entity ON public.ai_embeddings(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_ai_embeddings_hash ON public.ai_embeddings(content_hash);
CREATE INDEX IF NOT EXISTS idx_ai_embeddings_expires ON public.ai_embeddings(expires_at);

-- Habilitar RLS
ALTER TABLE public.ai_embeddings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para ai_embeddings
CREATE POLICY "System can manage AI embeddings" 
  ON public.ai_embeddings 
  FOR ALL 
  USING (true);

-- Criar tabela para configurações de segurança do usuário (se não existir)
CREATE TABLE IF NOT EXISTS public.user_security_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,
  backup_codes TEXT[] DEFAULT '{}',
  two_factor_setup_complete BOOLEAN DEFAULT false,
  two_factor_last_used TIMESTAMP WITH TIME ZONE,
  login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_security_settings
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

-- Função para limpar embeddings expirados
CREATE OR REPLACE FUNCTION clean_expired_embeddings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM ai_embeddings 
  WHERE expires_at < NOW();
END;
$$;

-- Função para log de auditoria de segurança
CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_description TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO security_audit_logs (
    user_id, event_type, event_description, 
    ip_address, user_agent, metadata
  ) VALUES (
    p_user_id, p_event_type, p_description,
    p_ip_address, p_user_agent, p_metadata
  );
END;
$$;

-- Atualizar funções existentes com SET search_path
CREATE OR REPLACE FUNCTION public.update_forum_topic_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE forum_topics 
  SET 
    replies_count = (
      SELECT COUNT(*) 
      FROM forum_replies 
      WHERE topic_id = COALESCE(NEW.topic_id, OLD.topic_id)
    ),
    last_activity_at = now()
  WHERE id = COALESCE(NEW.topic_id, OLD.topic_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_reply_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE forum_replies 
  SET likes_count = (
    SELECT COUNT(*) 
    FROM forum_reply_likes 
    WHERE reply_id = COALESCE(NEW.reply_id, OLD.reply_id)
  )
  WHERE id = COALESCE(NEW.reply_id, OLD.reply_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_knowledge_rating_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE knowledge_items 
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM knowledge_ratings 
      WHERE item_id = COALESCE(NEW.item_id, OLD.item_id)
    ),
    ratings_count = (
      SELECT COUNT(*)
      FROM knowledge_ratings 
      WHERE item_id = COALESCE(NEW.item_id, OLD.item_id)
    )
  WHERE id = COALESCE(NEW.item_id, OLD.item_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;
