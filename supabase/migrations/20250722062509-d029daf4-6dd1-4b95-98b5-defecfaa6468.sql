-- Correção Final 0.5%: Criar tabela ai_embedding_cache se não existir
CREATE TABLE IF NOT EXISTS public.ai_embedding_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  embedding_data JSONB NOT NULL,
  similarity_score NUMERIC,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days')
);

-- Índices para performance otimizada
CREATE INDEX IF NOT EXISTS idx_ai_embedding_cache_key ON public.ai_embedding_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_ai_embedding_cache_entity ON public.ai_embedding_cache(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ai_embedding_cache_expires ON public.ai_embedding_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_ai_embedding_cache_score ON public.ai_embedding_cache(similarity_score DESC);

-- RLS para segurança
ALTER TABLE public.ai_embedding_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage embedding cache" ON public.ai_embedding_cache
  FOR ALL USING (true);

-- Função de limpeza automática otimizada
CREATE OR REPLACE FUNCTION public.clean_expired_embedding_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM ai_embedding_cache 
  WHERE expires_at < NOW();
END;
$$;

-- Trigger para limpeza automática
CREATE OR REPLACE FUNCTION public.trigger_clean_embedding_cache()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Limpar cache expirado a cada 100 inserções
  IF (SELECT COUNT(*) FROM ai_embedding_cache) % 100 = 0 THEN
    PERFORM clean_expired_embedding_cache();
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_clean_embedding_cache ON public.ai_embedding_cache;
CREATE TRIGGER trigger_clean_embedding_cache
  AFTER INSERT ON public.ai_embedding_cache
  FOR EACH ROW
  EXECUTE FUNCTION trigger_clean_embedding_cache();

-- Corrigir search_path em funções críticas existentes
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