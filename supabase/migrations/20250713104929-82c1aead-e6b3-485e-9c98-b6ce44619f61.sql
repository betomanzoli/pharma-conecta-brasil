-- Criar tabela para feedback de matches
CREATE TABLE public.match_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  match_id TEXT NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('accepted', 'rejected')),
  rejection_reason TEXT,
  provider_name TEXT,
  provider_type TEXT,
  match_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.match_feedback ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can create own feedback" 
ON public.match_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback" 
ON public.match_feedback 
FOR SELECT 
USING (auth.uid() = user_id);

-- Criar trigger para updated_at
CREATE TRIGGER update_match_feedback_updated_at
  BEFORE UPDATE ON public.match_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();