
-- Create table for ML models and training data
CREATE TABLE public.ml_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  model_name TEXT NOT NULL,
  model_type TEXT NOT NULL CHECK (model_type IN ('classification', 'regression', 'clustering', 'recommendation')),
  version TEXT NOT NULL DEFAULT '1.0.0',
  accuracy NUMERIC(5,4) DEFAULT 0.0,
  precision_score NUMERIC(5,4) DEFAULT 0.0,
  recall_score NUMERIC(5,4) DEFAULT 0.0,
  f1_score NUMERIC(5,4) DEFAULT 0.0,
  is_active BOOLEAN DEFAULT false,
  training_samples INTEGER DEFAULT 0,
  model_data JSONB DEFAULT '{}',
  weights JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  last_trained TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for constellation analysis
CREATE TABLE public.constellation_nodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  project_id UUID,
  node_name TEXT NOT NULL,
  node_type TEXT NOT NULL CHECK (node_type IN ('anchor', 'partner', 'supplier', 'distributor', 'client')),
  strength_score NUMERIC(5,4) DEFAULT 0.0,
  value_contribution NUMERIC(5,4) DEFAULT 0.0,
  risk_level TEXT DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
  strategic_importance NUMERIC(5,4) DEFAULT 0.0,
  network_density NUMERIC(5,4) DEFAULT 0.0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for constellation relationships
CREATE TABLE public.constellation_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  source_node_id UUID REFERENCES public.constellation_nodes(id) ON DELETE CASCADE,
  target_node_id UUID REFERENCES public.constellation_nodes(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  strength NUMERIC(5,4) DEFAULT 0.0,
  trust_level NUMERIC(5,4) DEFAULT 0.0,
  communication_frequency TEXT DEFAULT 'monthly',
  collaboration_history JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for portfolio optimization
CREATE TABLE public.portfolio_optimizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  optimization_name TEXT NOT NULL,
  portfolio_data JSONB NOT NULL DEFAULT '{}',
  risk_tolerance NUMERIC(5,4) DEFAULT 0.5,
  expected_return NUMERIC(10,4) DEFAULT 0.0,
  sharpe_ratio NUMERIC(10,4) DEFAULT 0.0,
  var_95 NUMERIC(10,4) DEFAULT 0.0,
  optimization_results JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  monte_carlo_simulations JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for predictive insights
CREATE TABLE public.predictive_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  project_id UUID,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('success_probability', 'risk_assessment', 'market_forecast', 'partnership_recommendation')),
  prediction_value NUMERIC(10,4) NOT NULL,
  confidence_score NUMERIC(5,4) DEFAULT 0.0,
  time_horizon TEXT DEFAULT '12_months',
  contributing_factors JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  model_version TEXT DEFAULT '1.0.0',
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for ml_models
ALTER TABLE public.ml_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own ML models" ON public.ml_models
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for constellation_nodes
ALTER TABLE public.constellation_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own constellation nodes" ON public.constellation_nodes
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for constellation_relationships
ALTER TABLE public.constellation_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own constellation relationships" ON public.constellation_relationships
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for portfolio_optimizations
ALTER TABLE public.portfolio_optimizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own portfolio optimizations" ON public.portfolio_optimizations
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for predictive_insights
ALTER TABLE public.predictive_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own predictive insights" ON public.predictive_insights
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_ml_models_user_active ON public.ml_models(user_id, is_active);
CREATE INDEX idx_constellation_nodes_user_type ON public.constellation_nodes(user_id, node_type);
CREATE INDEX idx_constellation_relationships_nodes ON public.constellation_relationships(source_node_id, target_node_id);
CREATE INDEX idx_portfolio_optimizations_user_status ON public.portfolio_optimizations(user_id, status);
CREATE INDEX idx_predictive_insights_user_type ON public.predictive_insights(user_id, insight_type);
CREATE INDEX idx_predictive_insights_expires ON public.predictive_insights(expires_at) WHERE expires_at IS NOT NULL;

-- Add trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ml_models_updated_at BEFORE UPDATE ON public.ml_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_constellation_nodes_updated_at BEFORE UPDATE ON public.constellation_nodes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_constellation_relationships_updated_at BEFORE UPDATE ON public.constellation_relationships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_optimizations_updated_at BEFORE UPDATE ON public.portfolio_optimizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_predictive_insights_updated_at BEFORE UPDATE ON public.predictive_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
