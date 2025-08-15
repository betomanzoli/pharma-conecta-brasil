
-- Tabela para armazenar modelos ML
CREATE TABLE public.ml_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name TEXT NOT NULL,
  version TEXT NOT NULL,
  model_type TEXT NOT NULL DEFAULT 'prioritization',
  accuracy NUMERIC(5,4) NOT NULL DEFAULT 0.0,
  precision_score NUMERIC(5,4) DEFAULT 0.0,
  recall_score NUMERIC(5,4) DEFAULT 0.0,
  f1_score NUMERIC(5,4) DEFAULT 0.0,
  training_data_size INTEGER DEFAULT 0,
  last_trained TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT false,
  model_data JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(model_name, version)
);

-- Tabela para feedback de ML
CREATE TABLE public.ml_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  model_id UUID REFERENCES public.ml_models(id),
  source_id TEXT NOT NULL,
  query_text TEXT NOT NULL,
  predicted_priority NUMERIC(5,4) NOT NULL,
  actual_outcome TEXT NOT NULL, -- 'accepted', 'rejected', 'ignored'
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  response_time_ms INTEGER DEFAULT 0,
  feedback_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para métricas de federated learning
CREATE TABLE public.federated_learning_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id TEXT NOT NULL,
  model_version TEXT NOT NULL,
  round_number INTEGER NOT NULL,
  local_accuracy NUMERIC(5,4) DEFAULT 0.0,
  global_accuracy NUMERIC(5,4) DEFAULT 0.0,
  data_samples INTEGER DEFAULT 0,
  training_time_ms INTEGER DEFAULT 0,
  sync_status TEXT DEFAULT 'pending', -- 'pending', 'syncing', 'completed', 'failed'
  weights_hash TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS policies para ml_models
ALTER TABLE public.ml_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ML models" 
  ON public.ml_models 
  FOR SELECT 
  USING (true);

CREATE POLICY "System can manage ML models" 
  ON public.ml_models 
  FOR ALL 
  USING (true);

-- RLS policies para ml_feedback
ALTER TABLE public.ml_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own ML feedback" 
  ON public.ml_feedback 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own ML feedback" 
  ON public.ml_feedback 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can view all ML feedback" 
  ON public.ml_feedback 
  FOR SELECT 
  USING (true);

-- RLS policies para federated_learning_metrics
ALTER TABLE public.federated_learning_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view federated learning metrics" 
  ON public.federated_learning_metrics 
  FOR SELECT 
  USING (true);

CREATE POLICY "System can manage federated learning metrics" 
  ON public.federated_learning_metrics 
  FOR ALL 
  USING (true);

-- Índices para performance
CREATE INDEX idx_ml_models_active ON public.ml_models(is_active, model_type);
CREATE INDEX idx_ml_feedback_user_created ON public.ml_feedback(user_id, created_at DESC);
CREATE INDEX idx_federated_metrics_node_round ON public.federated_learning_metrics(node_id, round_number);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_ml_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ml_models_updated_at 
  BEFORE UPDATE ON public.ml_models 
  FOR EACH ROW EXECUTE FUNCTION update_ml_updated_at_column();

CREATE TRIGGER update_ml_feedback_updated_at 
  BEFORE UPDATE ON public.ml_feedback 
  FOR EACH ROW EXECUTE FUNCTION update_ml_updated_at_column();

CREATE TRIGGER update_federated_metrics_updated_at 
  BEFORE UPDATE ON public.federated_learning_metrics 
  FOR EACH ROW EXECUTE FUNCTION update_ml_updated_at_column();
