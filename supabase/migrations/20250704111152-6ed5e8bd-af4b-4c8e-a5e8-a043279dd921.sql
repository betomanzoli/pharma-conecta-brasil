-- Fase 2E: Implementar Sistema de Mentoria Real

-- Habilitar realtime para sessões de mentoria
ALTER PUBLICATION supabase_realtime ADD TABLE mentorship_sessions;
ALTER TABLE mentorship_sessions REPLICA IDENTITY FULL;

-- Criar tabela de mentores
CREATE TABLE public.mentors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialty TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER NOT NULL DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  availability_schedule JSONB,
  bio TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  average_rating DECIMAL(2,1) DEFAULT 0.0,
  total_ratings INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profile_id)
);

-- Atualizar tabela de sessões com mais campos
ALTER TABLE public.mentorship_sessions 
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS meeting_url TEXT,
ADD COLUMN IF NOT EXISTS mentor_notes TEXT,
ADD COLUMN IF NOT EXISTS mentee_notes TEXT,
ADD COLUMN IF NOT EXISTS session_summary TEXT;

-- Criar tabela de disponibilidade de mentores
CREATE TABLE public.mentor_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_availability ENABLE ROW LEVEL SECURITY;

-- Políticas para mentors
CREATE POLICY "Anyone can view active mentors" ON public.mentors FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create own mentor profile" ON public.mentors FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Mentors can update own profile" ON public.mentors FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Mentors can delete own profile" ON public.mentors FOR DELETE USING (auth.uid() = profile_id);

-- Políticas para mentor_availability
CREATE POLICY "Anyone can view mentor availability" ON public.mentor_availability FOR SELECT USING (true);
CREATE POLICY "Mentors can manage own availability" ON public.mentor_availability FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.mentors m 
    WHERE m.id = mentor_availability.mentor_id AND m.profile_id = auth.uid()
  )
);

-- Atualizar políticas de mentorship_sessions
DROP POLICY IF EXISTS "Users can create mentorship sessions" ON public.mentorship_sessions;
DROP POLICY IF EXISTS "Users can update their mentorship sessions" ON public.mentorship_sessions;
DROP POLICY IF EXISTS "Users can view their mentorship sessions" ON public.mentorship_sessions;

CREATE POLICY "Users can create mentorship sessions" ON public.mentorship_sessions 
FOR INSERT WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Users can update their mentorship sessions" ON public.mentorship_sessions 
FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Users can view their mentorship sessions" ON public.mentorship_sessions 
FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Função para atualizar estatísticas do mentor
CREATE OR REPLACE FUNCTION public.update_mentor_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar estatísticas quando uma sessão é concluída
  IF TG_OP = 'UPDATE' AND OLD.status != 'completed' AND NEW.status = 'completed' THEN
    UPDATE public.mentors 
    SET 
      total_sessions = total_sessions + 1,
      average_rating = CASE 
        WHEN NEW.mentor_rating IS NOT NULL THEN
          CASE 
            WHEN total_ratings = 0 THEN NEW.mentor_rating
            ELSE ROUND(((average_rating * total_ratings) + NEW.mentor_rating) / (total_ratings + 1), 1)
          END
        ELSE average_rating
      END,
      total_ratings = CASE 
        WHEN NEW.mentor_rating IS NOT NULL THEN total_ratings + 1
        ELSE total_ratings
      END
    WHERE id = NEW.mentor_id;
  END IF;
  
  -- Atualizar rating quando é modificado
  IF TG_OP = 'UPDATE' AND OLD.mentor_rating IS DISTINCT FROM NEW.mentor_rating AND NEW.mentor_rating IS NOT NULL THEN
    UPDATE public.mentors 
    SET 
      average_rating = (
        SELECT ROUND(AVG(mentor_rating), 1)
        FROM public.mentorship_sessions 
        WHERE mentor_id = NEW.mentor_id AND mentor_rating IS NOT NULL
      ),
      total_ratings = (
        SELECT COUNT(*)
        FROM public.mentorship_sessions 
        WHERE mentor_id = NEW.mentor_id AND mentor_rating IS NOT NULL
      )
    WHERE id = NEW.mentor_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar estatísticas
CREATE TRIGGER update_mentor_stats_trigger
  AFTER UPDATE ON public.mentorship_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_mentor_stats();

-- Função para buscar mentores disponíveis
CREATE OR REPLACE FUNCTION public.get_available_mentors(
  specialty_filter TEXT[] DEFAULT NULL,
  min_rating DECIMAL DEFAULT 0.0,
  max_hourly_rate DECIMAL DEFAULT NULL
)
RETURNS TABLE (
  mentor_id UUID,
  profile_id UUID,
  first_name TEXT,
  last_name TEXT,
  specialty TEXT[],
  experience_years INTEGER,
  hourly_rate DECIMAL,
  bio TEXT,
  average_rating DECIMAL,
  total_sessions INTEGER,
  total_ratings INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.profile_id,
    p.first_name,
    p.last_name,
    m.specialty,
    m.experience_years,
    m.hourly_rate,
    m.bio,
    m.average_rating,
    m.total_sessions,
    m.total_ratings
  FROM public.mentors m
  JOIN public.profiles p ON m.profile_id = p.id
  WHERE 
    m.is_active = true
    AND (specialty_filter IS NULL OR m.specialty && specialty_filter)
    AND m.average_rating >= min_rating
    AND (max_hourly_rate IS NULL OR m.hourly_rate <= max_hourly_rate)
  ORDER BY m.average_rating DESC, m.total_sessions DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Inserir dados de exemplo
INSERT INTO public.mentors (profile_id, specialty, experience_years, hourly_rate, bio, total_sessions, average_rating, total_ratings) VALUES
((SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 
 ARRAY['Assuntos Regulatórios', 'Registro de Medicamentos', 'ANVISA'], 
 15, 250.00, 
 'Especialista em assuntos regulatórios com mais de 15 anos de experiência na indústria farmacêutica. Ajudo empresas a navegar pelos complexos processos de registro na ANVISA.',
 45, 4.8, 32);

-- Inserir disponibilidade de exemplo
INSERT INTO public.mentor_availability (mentor_id, day_of_week, start_time, end_time) VALUES
((SELECT id FROM mentors WHERE profile_id = (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com')), 1, '09:00', '17:00'),
((SELECT id FROM mentors WHERE profile_id = (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com')), 2, '09:00', '17:00'),
((SELECT id FROM mentors WHERE profile_id = (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com')), 3, '09:00', '17:00'),
((SELECT id FROM mentors WHERE profile_id = (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com')), 4, '09:00', '17:00');

-- Inserir sessões de exemplo
INSERT INTO public.mentorship_sessions (
  mentor_id, mentee_id, title, description, scheduled_at, duration_minutes, 
  price, status, mentor_rating, mentee_rating
) VALUES
((SELECT id FROM mentors WHERE profile_id = (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com')),
 (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'),
 'Consultoria sobre Registro de Medicamento Genérico',
 'Sessão para esclarecimento sobre documentação necessária para registro de medicamento genérico na ANVISA.',
 now() + interval '2 days',
 60,
 250.00,
 'scheduled',
 NULL,
 NULL);