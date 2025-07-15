-- Criar tabela para cache persistente
CREATE TABLE public.cache_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  cache_data JSONB NOT NULL,
  ttl INTEGER NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_cache_entries_key ON public.cache_entries(cache_key);
CREATE INDEX idx_cache_entries_source ON public.cache_entries(source);
CREATE INDEX idx_cache_entries_created_at ON public.cache_entries(created_at);

-- RLS
ALTER TABLE public.cache_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage cache entries"
  ON public.cache_entries FOR ALL
  USING (is_admin());

-- Trigger para updated_at
CREATE TRIGGER update_cache_entries_updated_at
  BEFORE UPDATE ON public.cache_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar tabela para monitoramento de APIs
CREATE TABLE public.api_monitoring_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('success', 'error')),
  response_time INTEGER,
  error_message TEXT,
  endpoint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_api_monitoring_service ON public.api_monitoring_events(service);
CREATE INDEX idx_api_monitoring_created_at ON public.api_monitoring_events(created_at);
CREATE INDEX idx_api_monitoring_event_type ON public.api_monitoring_events(event_type);

-- RLS
ALTER TABLE public.api_monitoring_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view api monitoring events"
  ON public.api_monitoring_events FOR SELECT
  USING (is_admin());

CREATE POLICY "System can insert api monitoring events"
  ON public.api_monitoring_events FOR INSERT
  WITH CHECK (true);