
-- Correção 1: Estrutura da Tabela Consultants
-- Verificar se a tabela consultants existe e tem a estrutura correta
CREATE TABLE IF NOT EXISTS public.consultants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  profile_id UUID,
  expertise TEXT[] DEFAULT '{}',
  hourly_rate NUMERIC DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  location TEXT,
  description TEXT,
  website TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  certifications TEXT[] DEFAULT '{}',
  sentiment_score NUMERIC DEFAULT 0,
  sentiment_label TEXT DEFAULT 'neutral',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela consultants
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para consultants
CREATE POLICY "Users can create consultant profiles" ON public.consultants
  FOR INSERT WITH CHECK ((auth.uid() = user_id) OR (auth.uid() = profile_id));

CREATE POLICY "Users can view all consultants" ON public.consultants
  FOR SELECT USING (true);

CREATE POLICY "Consultants can update own profile" ON public.consultants
  FOR UPDATE USING ((auth.uid() = user_id) OR (auth.uid() = profile_id));

-- Correção 4: Cache Persistente para Embeddings
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ai_embedding_cache_key ON public.ai_embedding_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_ai_embedding_cache_entity ON public.ai_embedding_cache(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ai_embedding_cache_expires ON public.ai_embedding_cache(expires_at);

-- RLS para cache
ALTER TABLE public.ai_embedding_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage embedding cache" ON public.ai_embedding_cache
  FOR ALL USING (true);

-- Função para limpeza automática do cache
CREATE OR REPLACE FUNCTION public.clean_expired_embedding_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.ai_embedding_cache 
  WHERE expires_at < NOW();
END;
$$;

-- Correção 3: Função segura para verificar admin (corrigir search_path)
CREATE OR REPLACE FUNCTION public.is_admin_safe(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF user_id IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND user_type = 'admin'
  );
END;
$$;

-- Trigger para limpeza automática do cache
CREATE OR REPLACE FUNCTION public.trigger_clean_embedding_cache()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Limpar cache expirado a cada 100 inserções
  IF (SELECT COUNT(*) FROM public.ai_embedding_cache) % 100 = 0 THEN
    PERFORM public.clean_expired_embedding_cache();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Aplicar trigger
DROP TRIGGER IF EXISTS trigger_clean_embedding_cache ON public.ai_embedding_cache;
CREATE TRIGGER trigger_clean_embedding_cache
  AFTER INSERT ON public.ai_embedding_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_clean_embedding_cache();

-- Inserir dados de demonstração para consultants se a tabela estiver vazia
INSERT INTO public.consultants (user_id, profile_id, expertise, hourly_rate, projects_completed, location, description, city, state, certifications, sentiment_score, sentiment_label)
SELECT 
  gen_random_uuid(),
  p.id,
  ARRAY['Regulatory Affairs', 'Clinical Research', 'Quality Assurance'],
  CASE 
    WHEN random() < 0.3 THEN 150 + (random() * 100)::INTEGER
    WHEN random() < 0.7 THEN 100 + (random() * 50)::INTEGER
    ELSE 200 + (random() * 150)::INTEGER
  END,
  (random() * 20)::INTEGER + 1,
  CASE 
    WHEN random() < 0.3 THEN 'São Paulo, SP'
    WHEN random() < 0.6 THEN 'Rio de Janeiro, RJ'
    ELSE 'Belo Horizonte, MG'
  END,
  'Consultor especializado em assuntos regulatórios farmacêuticos e desenvolvimento de medicamentos.',
  CASE 
    WHEN random() < 0.3 THEN 'São Paulo'
    WHEN random() < 0.6 THEN 'Rio de Janeiro'
    ELSE 'Belo Horizonte'
  END,
  CASE 
    WHEN random() < 0.3 THEN 'SP'
    WHEN random() < 0.6 THEN 'RJ'
    ELSE 'MG'
  END,
  ARRAY['CRF', 'ANVISA Certified', 'Good Manufacturing Practices'],
  (random() * 0.4 + 0.3)::NUMERIC, -- Score entre 0.3 e 0.7
  CASE 
    WHEN random() < 0.4 THEN 'positive'
    WHEN random() < 0.8 THEN 'neutral'
    ELSE 'negative'
  END
FROM public.profiles p
WHERE p.user_type = 'consultant'
AND NOT EXISTS (
  SELECT 1 FROM public.consultants c WHERE c.profile_id = p.id
)
LIMIT 10;
