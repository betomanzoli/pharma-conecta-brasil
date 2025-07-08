
-- Criar tabela para conteúdo brasileiro
CREATE TABLE public.brazilian_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES public.profiles(id),
  source_url TEXT,
  publication_date DATE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_featured BOOLEAN DEFAULT false,
  difficulty_level TEXT DEFAULT 'intermediate', -- basic, intermediate, advanced
  estimated_read_time INTEGER, -- em minutos
  downloads_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para compliance tracking
CREATE TABLE public.compliance_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id),
  profile_id UUID REFERENCES public.profiles(id),
  compliance_type TEXT NOT NULL, -- anvisa, lgpd, cff, cns
  status TEXT NOT NULL DEFAULT 'pending', -- compliant, partial, non_compliant, pending
  score NUMERIC(3,2) DEFAULT 0.0, -- 0.0 to 1.0
  last_check TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para monitoramento de APIs regulatórias
CREATE TABLE public.regulatory_api_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_source TEXT NOT NULL, -- anvisa, cff, cns, etc
  endpoint TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  data_updated BOOLEAN DEFAULT false,
  records_processed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.brazilian_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulatory_api_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para brazilian_content
CREATE POLICY "Anyone can view brazilian content" 
ON public.brazilian_content FOR SELECT 
USING (true);

CREATE POLICY "Authors can create brazilian content" 
ON public.brazilian_content FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own brazilian content" 
ON public.brazilian_content FOR UPDATE 
USING (auth.uid() = author_id);

-- Políticas para compliance_tracking
CREATE POLICY "Users can view own compliance tracking" 
ON public.compliance_tracking FOR SELECT 
USING (
  auth.uid() = profile_id OR 
  EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE c.id = compliance_tracking.company_id 
    AND (c.user_id = auth.uid() OR c.profile_id = auth.uid())
  )
);

CREATE POLICY "Users can create own compliance tracking" 
ON public.compliance_tracking FOR INSERT 
WITH CHECK (
  auth.uid() = profile_id OR 
  EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE c.id = compliance_tracking.company_id 
    AND (c.user_id = auth.uid() OR c.profile_id = auth.uid())
  )
);

CREATE POLICY "Users can update own compliance tracking" 
ON public.compliance_tracking FOR UPDATE 
USING (
  auth.uid() = profile_id OR 
  EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE c.id = compliance_tracking.company_id 
    AND (c.user_id = auth.uid() OR c.profile_id = auth.uid())
  )
);

-- Políticas para regulatory_api_logs (somente admins)
CREATE POLICY "Only admins can view regulatory API logs" 
ON public.regulatory_api_logs FOR SELECT 
USING (is_admin());

CREATE POLICY "System can create regulatory API logs" 
ON public.regulatory_api_logs FOR INSERT 
WITH CHECK (true);

-- Criar índices para performance
CREATE INDEX idx_brazilian_content_category ON public.brazilian_content(category);
CREATE INDEX idx_brazilian_content_tags ON public.brazilian_content USING GIN(tags);
CREATE INDEX idx_compliance_tracking_company ON public.compliance_tracking(company_id);
CREATE INDEX idx_compliance_tracking_profile ON public.compliance_tracking(profile_id);
CREATE INDEX idx_regulatory_api_logs_source ON public.regulatory_api_logs(api_source);
CREATE INDEX idx_regulatory_api_logs_created_at ON public.regulatory_api_logs(created_at);

-- Inserir conteúdo brasileiro inicial
INSERT INTO public.brazilian_content (title, content, category, subcategory, tags, difficulty_level, estimated_read_time) VALUES
(
  'Guia Completo ANVISA 2024', 
  '# Guia Completo ANVISA 2024\n\n## Introdução\nA Agência Nacional de Vigilância Sanitária (ANVISA) é o órgão responsável pela regulamentação e fiscalização de produtos e serviços relacionados à saúde no Brasil.\n\n## Principais Regulamentações\n- RDC 301/2019: Boas Práticas de Fabricação\n- RDC 318/2019: Critérios para Estudos de Bioequivalência\n- Lei 13.709/2018: LGPD aplicada ao setor farmacêutico\n\n## Processo de Registro\n1. Documentação técnica\n2. Estudos de segurança e eficácia\n3. Análise pela ANVISA\n4. Emissão do registro\n\n## Prazos e Custos\n- Medicamento novo: 12-18 meses\n- Genérico: 6-12 meses\n- Taxas variam de R$ 5.000 a R$ 50.000',
  'regulamentacao',
  'anvisa',
  ARRAY['anvisa', 'registro', 'medicamentos', 'regulamentacao'],
  'intermediate',
  15
),
(
  'LGPD no Setor Farmacêutico',
  '# LGPD no Setor Farmacêutico\n\n## Visão Geral\nA Lei Geral de Proteção de Dados (LGPD) impacta significativamente o setor farmacêutico brasileiro.\n\n## Principais Impactos\n- Dados de pacientes\n- Pesquisa clínica\n- Farmacovigilância\n- Marketing farmacêutico\n\n## Adequação Necessária\n1. Mapeamento de dados pessoais\n2. Implementação de controles\n3. Treinamento de equipes\n4. Políticas de privacidade\n\n## Penalidades\n- Advertência\n- Multa de até 2% do faturamento\n- Suspensão de atividades\n\n## Checklist de Compliance\n- [ ] DPO nomeado\n- [ ] Políticas atualizadas\n- [ ] Contratos revisados\n- [ ] Equipe treinada',
  'compliance',
  'lgpd',
  ARRAY['lgpd', 'privacidade', 'dados', 'compliance'],
  'advanced',
  20
),
(
  'Oportunidades de Inovação no Brasil',
  '# Oportunidades de Inovação Farmacêutica no Brasil\n\n## Cenário Atual\nO Brasil representa o maior mercado farmacêutico da América Latina com mais de R$ 180 bilhões em 2023.\n\n## Áreas de Oportunidade\n- Biotecnologia\n- Medicamentos raros\n- Telemedicina\n- Inteligência artificial em saúde\n\n## Programas de Incentivo\n- FINEP\n- CNPq\n- EMBRAPII\n- Lei do Bem\n\n## Parcerias Estratégicas\n- Universidades públicas\n- Institutos de pesquisa\n- Startups de healthtech\n- Incubadoras especializadas\n\n## Casos de Sucesso\n1. Cristália Produtos Químicos\n2. Eurofarma\n3. Aché Laboratórios\n4. União Química',
  'inovacao',
  'oportunidades',
  ARRAY['inovacao', 'biotecnologia', 'investimento', 'parcerias'],
  'basic',
  12
);

-- Criar função para atualizar estatísticas de conteúdo
CREATE OR REPLACE FUNCTION public.update_brazilian_content_stats()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_brazilian_content_updated_at
  BEFORE UPDATE ON public.brazilian_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_brazilian_content_stats();

-- Criar trigger para compliance_tracking
CREATE TRIGGER update_compliance_tracking_updated_at
  BEFORE UPDATE ON public.compliance_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
