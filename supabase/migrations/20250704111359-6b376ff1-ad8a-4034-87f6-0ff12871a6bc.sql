-- Inserir dados de exemplo para mentoria

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