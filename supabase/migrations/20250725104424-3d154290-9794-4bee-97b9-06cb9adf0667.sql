
-- Corrigir as rotas duplicadas no App.tsx removendo a duplicata
-- Vamos também adicionar tabelas necessárias para as novas funcionalidades

-- Tabela para sistema de gamificação
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Tabela para sistema de videoconferência
CREATE TABLE public.video_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID NOT NULL,
  mentee_id UUID NOT NULL,
  session_id UUID REFERENCES public.mentorship_sessions,
  room_id TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para marketplace de equipamentos
CREATE TABLE public.equipment_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  condition TEXT NOT NULL DEFAULT 'used',
  price NUMERIC,
  currency TEXT DEFAULT 'BRL',
  location TEXT,
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para cotações de equipamentos
CREATE TABLE public.equipment_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.equipment_listings NOT NULL,
  buyer_id UUID REFERENCES auth.users NOT NULL,
  quoted_price NUMERIC NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_quotes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create achievements" ON public.user_achievements FOR INSERT WITH CHECK (true);

-- Políticas RLS para video sessions
CREATE POLICY "Users can view own video sessions" ON public.video_sessions FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);
CREATE POLICY "Users can create video sessions" ON public.video_sessions FOR INSERT WITH CHECK (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Políticas RLS para equipment listings
CREATE POLICY "Anyone can view equipment listings" ON public.equipment_listings FOR SELECT USING (true);
CREATE POLICY "Users can create own equipment listings" ON public.equipment_listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own equipment listings" ON public.equipment_listings FOR UPDATE USING (auth.uid() = seller_id);

-- Políticas RLS para equipment quotes
CREATE POLICY "Users can view relevant equipment quotes" ON public.equipment_quotes FOR SELECT USING (
  auth.uid() = buyer_id OR 
  EXISTS (SELECT 1 FROM public.equipment_listings WHERE id = listing_id AND seller_id = auth.uid())
);
CREATE POLICY "Users can create equipment quotes" ON public.equipment_quotes FOR INSERT WITH CHECK (auth.uid() = buyer_id);
