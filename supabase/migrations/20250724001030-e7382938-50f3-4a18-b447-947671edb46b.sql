-- Criar tabelas necessárias para as novas implementações

-- Tabela para medicamentos ANVISA
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
CREATE POLICY "Public can view ANVISA medicamentos" ON public.anvisa_medicamentos
  FOR SELECT USING (true);

CREATE POLICY "Public can view ANVISA laboratórios" ON public.anvisa_laboratorios
  FOR SELECT USING (true);

CREATE POLICY "Public can view FDA food enforcement" ON public.fda_food_enforcement
  FOR SELECT USING (true);

CREATE POLICY "Public can view FDA device events" ON public.fda_device_events
  FOR SELECT USING (true);

-- Políticas para consultores
CREATE POLICY "Anyone can view consultants" ON public.consultants
  FOR SELECT USING (true);

CREATE POLICY "Users can create own consultant profile" ON public.consultants
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Consultants can update own profile" ON public.consultants
  FOR UPDATE USING (auth.uid() = profile_id);

-- Políticas para admins gerenciarem dados regulatórios
CREATE POLICY "Admins can manage ANVISA medicamentos" ON public.anvisa_medicamentos
  FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage ANVISA laboratórios" ON public.anvisa_laboratorios
  FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage FDA food enforcement" ON public.fda_food_enforcement
  FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage FDA device events" ON public.fda_device_events
  FOR ALL USING (is_admin());

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_anvisa_medicamentos_principio_ativo ON public.anvisa_medicamentos(principio_ativo);
CREATE INDEX IF NOT EXISTS idx_anvisa_medicamentos_laboratorio ON public.anvisa_medicamentos(laboratorio);
CREATE INDEX IF NOT EXISTS idx_anvisa_laboratorios_cnpj ON public.anvisa_laboratorios(cnpj);
CREATE INDEX IF NOT EXISTS idx_anvisa_laboratorios_cidade ON public.anvisa_laboratorios(cidade);
CREATE INDEX IF NOT EXISTS idx_fda_food_enforcement_classification ON public.fda_food_enforcement(classification);
CREATE INDEX IF NOT EXISTS idx_fda_device_events_event_type ON public.fda_device_events(event_type);
CREATE INDEX IF NOT EXISTS idx_consultants_specialization ON public.consultants USING GIN(specialization);
CREATE INDEX IF NOT EXISTS idx_laboratories_industrial_segment ON public.laboratories(industrial_segment);
CREATE INDEX IF NOT EXISTS idx_companies_industrial_segment ON public.companies(industrial_segment);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_anvisa_medicamentos_updated_at 
  BEFORE UPDATE ON public.anvisa_medicamentos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_anvisa_laboratorios_updated_at 
  BEFORE UPDATE ON public.anvisa_laboratorios 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fda_food_enforcement_updated_at 
  BEFORE UPDATE ON public.fda_food_enforcement 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fda_device_events_updated_at 
  BEFORE UPDATE ON public.fda_device_events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultants_updated_at 
  BEFORE UPDATE ON public.consultants 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();