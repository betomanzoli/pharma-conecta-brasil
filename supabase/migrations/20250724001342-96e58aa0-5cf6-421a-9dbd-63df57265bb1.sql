-- Criar tabelas necessárias corrigindo sintaxe das políticas

-- Criar tabelas necessárias para as novas implementações
CREATE TABLE IF NOT EXISTS public.anvisa_medicamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE NOT NULL,
  nome_comercial TEXT NOT NULL,
  principio_ativo TEXT NOT NULL,
  laboratorio TEXT,
  categoria TEXT,
  status_registro TEXT,
  data_vencimento DATE,
  anvisa_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para laboratórios ANVISA
CREATE TABLE IF NOT EXISTS public.anvisa_laboratorios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  cnpj TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  situacao TEXT,
  atividades TEXT[],
  anvisa_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para food enforcement FDA
CREATE TABLE IF NOT EXISTS public.fda_food_enforcement (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE NOT NULL,
  recall_number TEXT,
  status TEXT,
  classification TEXT,
  product_description TEXT,
  reason_for_recall TEXT,
  recall_initiation_date DATE,
  state TEXT,
  country TEXT,
  fda_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para device events FDA
CREATE TABLE IF NOT EXISTS public.fda_device_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE NOT NULL,
  mdr_report_key TEXT,
  event_type TEXT,
  date_received DATE,
  device_name TEXT,
  manufacturer TEXT,
  patient_problem_code TEXT,
  fda_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar colunas de segmentação industrial nas tabelas existentes
ALTER TABLE public.laboratories 
ADD COLUMN IF NOT EXISTS industrial_segment TEXT,
ADD COLUMN IF NOT EXISTS subsegment TEXT,
ADD COLUMN IF NOT EXISTS specializations TEXT[];

ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS industrial_segment TEXT,
ADD COLUMN IF NOT EXISTS subsegment TEXT;

-- Tabela para consultores especializados
CREATE TABLE IF NOT EXISTS public.consultants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  specialization TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  hourly_rate NUMERIC,
  location TEXT,
  description TEXT,
  industrial_segment TEXT,
  subsegment TEXT,
  availability_status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.anvisa_medicamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anvisa_laboratorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fda_food_enforcement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fda_device_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para visualização pública dos dados regulatórios
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view ANVISA medicamentos' AND tablename = 'anvisa_medicamentos') THEN
        CREATE POLICY "Public can view ANVISA medicamentos" ON public.anvisa_medicamentos FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view ANVISA laboratórios' AND tablename = 'anvisa_laboratorios') THEN
        CREATE POLICY "Public can view ANVISA laboratórios" ON public.anvisa_laboratorios FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view FDA food enforcement' AND tablename = 'fda_food_enforcement') THEN
        CREATE POLICY "Public can view FDA food enforcement" ON public.fda_food_enforcement FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view FDA device events' AND tablename = 'fda_device_events') THEN
        CREATE POLICY "Public can view FDA device events" ON public.fda_device_events FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view consultants' AND tablename = 'consultants') THEN
        CREATE POLICY "Anyone can view consultants" ON public.consultants FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create own consultant profile' AND tablename = 'consultants') THEN
        CREATE POLICY "Users can create own consultant profile" ON public.consultants FOR INSERT WITH CHECK (auth.uid() = profile_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Consultants can update own profile' AND tablename = 'consultants') THEN
        CREATE POLICY "Consultants can update own profile" ON public.consultants FOR UPDATE USING (auth.uid() = profile_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage ANVISA medicamentos' AND tablename = 'anvisa_medicamentos') THEN
        CREATE POLICY "Admins can manage ANVISA medicamentos" ON public.anvisa_medicamentos FOR ALL USING (is_admin());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage ANVISA laboratórios' AND tablename = 'anvisa_laboratorios') THEN
        CREATE POLICY "Admins can manage ANVISA laboratórios" ON public.anvisa_laboratorios FOR ALL USING (is_admin());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage FDA food enforcement' AND tablename = 'fda_food_enforcement') THEN
        CREATE POLICY "Admins can manage FDA food enforcement" ON public.fda_food_enforcement FOR ALL USING (is_admin());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage FDA device events' AND tablename = 'fda_device_events') THEN
        CREATE POLICY "Admins can manage FDA device events" ON public.fda_device_events FOR ALL USING (is_admin());
    END IF;
END
$$;