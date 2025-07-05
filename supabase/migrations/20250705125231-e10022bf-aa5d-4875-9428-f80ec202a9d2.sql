-- Corrigir foreign key constraint e inserir dados de exemplo

-- Primeiro, verificar se a constraint existe e corrigi-la se necessário
DO $$
BEGIN
    -- Remover constraint incorreta se existir
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'mentorship_sessions_mentor_id_fkey' 
        AND table_name = 'mentorship_sessions'
    ) THEN
        ALTER TABLE public.mentorship_sessions DROP CONSTRAINT mentorship_sessions_mentor_id_fkey;
    END IF;
    
    -- Adicionar constraint correta para mentors
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'mentorship_sessions_mentor_id_mentors_fkey' 
        AND table_name = 'mentorship_sessions'
    ) THEN
        ALTER TABLE public.mentorship_sessions 
        ADD CONSTRAINT mentorship_sessions_mentor_id_mentors_fkey 
        FOREIGN KEY (mentor_id) REFERENCES public.mentors(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Inserir dados de exemplo para mentoria
INSERT INTO public.mentors (profile_id, specialty, experience_years, hourly_rate, bio, total_sessions, average_rating, total_ratings) 
VALUES
((SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 
 ARRAY['Assuntos Regulatórios', 'Registro de Medicamentos', 'ANVISA'], 
 15, 250.00, 
 'Especialista em assuntos regulatórios com mais de 15 anos de experiência na indústria farmacêutica.',
 45, 4.8, 32)
ON CONFLICT (profile_id) DO NOTHING;

-- Inserir disponibilidade de exemplo
INSERT INTO public.mentor_availability (mentor_id, day_of_week, start_time, end_time) 
SELECT 
    m.id,
    generate_series(1, 4) as day_of_week,
    '09:00'::time,
    '17:00'::time
FROM public.mentors m 
WHERE m.profile_id = (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com')
ON CONFLICT DO NOTHING;

-- Inserir sessão de exemplo
INSERT INTO public.mentorship_sessions (
  mentor_id, mentee_id, title, description, scheduled_at, duration_minutes, 
  price, status
) 
SELECT 
    m.id,
    p.id,
    'Consultoria sobre Registro de Medicamento Genérico',
    'Sessão para esclarecimento sobre documentação necessária para registro de medicamento genérico na ANVISA.',
    now() + interval '2 days',
    60,
    250.00,
    'scheduled'
FROM public.mentors m
JOIN public.profiles p ON p.email = 'betomanzoli@gmail.com'
WHERE m.profile_id = p.id
ON CONFLICT DO NOTHING;