-- Criar tabela para configurações de cron jobs
CREATE TABLE public.cron_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT UNIQUE NOT NULL,
  function_name TEXT NOT NULL,
  schedule TEXT NOT NULL, -- Formato cron
  is_active BOOLEAN DEFAULT true,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cron_jobs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Only admins can manage cron jobs" 
ON public.cron_jobs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.user_type = 'admin'
));

-- Trigger para updated_at
CREATE TRIGGER update_cron_jobs_updated_at 
BEFORE UPDATE ON public.cron_jobs 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir jobs padrão
INSERT INTO public.cron_jobs (job_name, function_name, schedule) VALUES
('anvisa-daily-sync', 'anvisa-sync', '0 2 * * *'),
('integration-sync', 'comprehensive-integration-sync', '0 */6 * * *'),
('notification-cleanup', 'notification-cleanup', '0 0 * * 0');

-- Criar tabela para métricas de performance
CREATE TABLE public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  tags JSONB DEFAULT '{}',
  measured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index para performance
CREATE INDEX idx_performance_metrics_name_time ON public.performance_metrics(metric_name, measured_at DESC);

-- Enable RLS
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Política para visualizar métricas
CREATE POLICY "Anyone can view performance metrics" 
ON public.performance_metrics 
FOR SELECT 
USING (true);

-- Política para inserir métricas (apenas sistema)
CREATE POLICY "System can insert metrics" 
ON public.performance_metrics 
FOR INSERT 
WITH CHECK (true);

-- Função para limpar métricas antigas
CREATE OR REPLACE FUNCTION clean_old_metrics()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.performance_metrics 
  WHERE measured_at < NOW() - INTERVAL '30 days';
END;
$$;