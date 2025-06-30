
-- Criar tabela para produtos farmacêuticos
CREATE TABLE public.pharmaceutical_products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  active_ingredient text NOT NULL,
  therapeutic_class text NOT NULL,
  anvisa_registration text,
  status text NOT NULL DEFAULT 'development' CHECK (status IN ('development', 'registered', 'approved', 'discontinued')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela para oportunidades de parceria
CREATE TABLE public.partnership_opportunities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  partnership_type text NOT NULL CHECK (partnership_type IN ('research', 'manufacturing', 'distribution', 'regulatory', 'funding')),
  budget_range text,
  deadline date,
  requirements text[],
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed', 'cancelled')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela para alertas regulatórios
CREATE TABLE public.regulatory_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source text NOT NULL CHECK (source IN ('anvisa', 'fda', 'ema', 'inpi')),
  title text NOT NULL,
  description text NOT NULL,
  alert_type text NOT NULL CHECK (alert_type IN ('safety', 'recall', 'approval', 'guideline', 'inspection')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  published_at timestamp with time zone NOT NULL,
  expires_at timestamp with time zone,
  url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela para interações/matching
CREATE TABLE public.company_interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_a_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  company_b_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('match', 'view', 'contact', 'partnership')),
  compatibility_score numeric CHECK (compatibility_score >= 0 AND compatibility_score <= 1),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(company_a_id, company_b_id, interaction_type)
);

-- Criar tabela para assinaturas/planos
CREATE TABLE public.subscription_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  plan_type text NOT NULL CHECK (plan_type IN ('freemium', 'professional', 'enterprise')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  started_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  features text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS para todas as novas tabelas
ALTER TABLE public.pharmaceutical_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulatory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para pharmaceutical_products
CREATE POLICY "Companies can view all pharmaceutical products" ON public.pharmaceutical_products FOR SELECT USING (true);
CREATE POLICY "Companies can manage own pharmaceutical products" ON public.pharmaceutical_products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE c.id = pharmaceutical_products.company_id 
    AND (c.user_id = auth.uid() OR c.profile_id = auth.uid())
  )
);

-- Políticas RLS para partnership_opportunities
CREATE POLICY "Companies can view all partnership opportunities" ON public.partnership_opportunities FOR SELECT USING (true);
CREATE POLICY "Companies can manage own partnership opportunities" ON public.partnership_opportunities FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE c.id = partnership_opportunities.company_id 
    AND (c.user_id = auth.uid() OR c.profile_id = auth.uid())
  )
);

-- Políticas RLS para regulatory_alerts
CREATE POLICY "All users can view regulatory alerts" ON public.regulatory_alerts FOR SELECT USING (true);

-- Políticas RLS para company_interactions
CREATE POLICY "Companies can view interactions involving them" ON public.company_interactions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE (c.id = company_interactions.company_a_id OR c.id = company_interactions.company_b_id)
    AND (c.user_id = auth.uid() OR c.profile_id = auth.uid())
  )
);
CREATE POLICY "Companies can create interactions" ON public.company_interactions FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE c.id = company_interactions.company_a_id 
    AND (c.user_id = auth.uid() OR c.profile_id = auth.uid())
  )
);

-- Políticas RLS para subscription_plans
CREATE POLICY "Companies can view own subscription plans" ON public.subscription_plans FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE c.id = subscription_plans.company_id 
    AND (c.user_id = auth.uid() OR c.profile_id = auth.uid())
  )
);
CREATE POLICY "Companies can manage own subscription plans" ON public.subscription_plans FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE c.id = subscription_plans.company_id 
    AND (c.user_id = auth.uid() OR c.profile_id = auth.uid())
  )
);

-- Inserir dados iniciais para alertas regulatórios
INSERT INTO public.regulatory_alerts (source, title, description, alert_type, severity, published_at, url) VALUES
('anvisa', 'Nova RDC sobre Boas Práticas de Fabricação', 'Publicada nova resolução sobre requisitos de BPF para medicamentos', 'guideline', 'medium', NOW() - INTERVAL '2 days', 'https://www.gov.br/anvisa'),
('anvisa', 'Recall de Lote de Medicamento Genérico', 'Recall voluntário de lote específico por desvio de qualidade', 'recall', 'high', NOW() - INTERVAL '1 day', 'https://www.gov.br/anvisa'),
('fda', 'Aprovação de Nova Terapia Oncológica', 'FDA aprova nova terapia para tratamento de câncer', 'approval', 'medium', NOW() - INTERVAL '3 days', 'https://www.fda.gov');

-- Inserir dados iniciais para planos de assinatura
INSERT INTO public.subscription_plans (company_id, plan_type, status, features) 
SELECT c.id, 'freemium', 'active', ARRAY['basic_search', 'alerts', 'profile_basic']
FROM public.companies c
WHERE EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = c.profile_id);

-- Habilitar realtime para tabelas críticas
ALTER PUBLICATION supabase_realtime ADD TABLE public.pharmaceutical_products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.partnership_opportunities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.regulatory_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.company_interactions;
