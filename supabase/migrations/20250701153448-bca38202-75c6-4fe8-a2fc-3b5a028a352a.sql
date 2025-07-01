
-- Criar enum user_type se não existir
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('company', 'laboratory', 'consultant', 'individual', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Alterar a tabela profiles para usar o enum (se ainda não estiver usando)
DO $$ BEGIN
    ALTER TABLE profiles ALTER COLUMN user_type TYPE user_type USING user_type::user_type;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

-- Criar tabela para armazenar configurações de API
CREATE TABLE IF NOT EXISTS public.api_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_name TEXT NOT NULL UNIQUE,
  api_key TEXT,
  base_url TEXT,
  is_active BOOLEAN DEFAULT false,
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_frequency_hours INTEGER DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS para api_configurations (apenas admins)
ALTER TABLE public.api_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage API configurations" 
ON public.api_configurations 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- Criar tabela para dados reais das integrações
CREATE TABLE IF NOT EXISTS public.integration_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  data_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB,
  url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS para integration_data (todos podem ver, apenas sistema pode inserir)
ALTER TABLE public.integration_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view integration data" 
ON public.integration_data 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only admins can manage integration data" 
ON public.integration_data 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);
