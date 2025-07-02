-- Fase 2A: Popular dados de teste e criar usuário admin (valores corretos)

-- Inserir dados de teste para companies
INSERT INTO public.companies (name, cnpj, expertise_area, compliance_status, description, website, phone, city, state) VALUES
('Farmaceutica Alpha Ltda', '12.345.678/0001-90', ARRAY['farmacologia', 'pesquisa_clinica'], 'approved', 'Empresa especializada em desenvolvimento de medicamentos inovadores', 'https://alpha-pharma.com.br', '(11) 3456-7890', 'São Paulo', 'SP'),
('Beta Labs Biotecnologia', '23.456.789/0001-01', ARRAY['biotecnologia', 'vacinas'], 'approved', 'Laboratório focado em biotecnologia e desenvolvimento de vacinas', 'https://betalabs.com.br', '(21) 2345-6789', 'Rio de Janeiro', 'RJ'),
('Gamma Research Institute', '34.567.890/0001-12', ARRAY['pesquisa_clinica', 'bioequivalencia'], 'pending', 'Instituto de pesquisa clínica e estudos de bioequivalência', 'https://gamma-research.com.br', '(31) 3456-7890', 'Belo Horizonte', 'MG'),
('Delta Pharma Solutions', '45.678.901/0001-23', ARRAY['regulatorio', 'consultoria'], 'approved', 'Consultoria especializada em assuntos regulatórios farmacêuticos', 'https://deltapharma.com.br', '(47) 3456-7890', 'Joinville', 'SC'),
('Epsilon Medicamentos', '56.789.012/0001-34', ARRAY['medicamentos_genericos', 'farmacologia'], 'approved', 'Fabricante de medicamentos genéricos de alta qualidade', 'https://epsilon-med.com.br', '(85) 3456-7890', 'Fortaleza', 'CE');

-- Inserir dados de teste para laboratories
INSERT INTO public.laboratories (name, location, city, state, certifications, equipment_list, phone, website, description, operating_hours, available_capacity) VALUES
('Laboratório Central de Análises', 'Avenida Paulista, 1000', 'São Paulo', 'SP', ARRAY['ISO 17025', 'ANVISA', 'INMETRO'], ARRAY['HPLC', 'LC-MS/MS', 'Espectrofotômetro'], '(11) 3456-7890', 'https://labcentral.com.br', 'Laboratório especializado em análises farmacêuticas e controle de qualidade', '08:00-18:00', 85),
('BioLab Research Center', 'Rua das Flores, 500', 'Rio de Janeiro', 'RJ', ARRAY['ISO 17025', 'GLP'], ARRAY['PCR', 'Sequenciador DNA', 'Microscópio confocal'], '(21) 2345-6789', 'https://biolab-research.com.br', 'Centro de pesquisa em biotecnologia e análises moleculares', '07:00-19:00', 92),
('MedLab Diagnósticos', 'Rua Central, 300', 'Belo Horizonte', 'MG', ARRAY['ANVISA', 'CAP'], ARRAY['Analisador bioquímico', 'Citômetro de fluxo'], '(31) 3456-7890', 'https://medlab-diagnosticos.com.br', 'Laboratório de diagnósticos clínicos e análises especializadas', '06:00-20:00', 78),
('TechLab Innovation', 'Avenida Tecnológica, 1500', 'Campinas', 'SP', ARRAY['ISO 17025', 'ANVISA', 'FDA'], ARRAY['UPLC', 'GC-MS', 'ICP-MS'], '(19) 3456-7890', 'https://techlab-innovation.com.br', 'Laboratório de alta tecnologia para desenvolvimento farmacêutico', '24 horas', 95);

-- Inserir dados de teste para consultants
INSERT INTO public.consultants (expertise, description, availability, location, certifications, hourly_rate, projects_completed) VALUES
(ARRAY['assuntos_regulatorios', 'registro_medicamentos'], 'Consultor sênior com 15 anos de experiência em assuntos regulatórios na indústria farmacêutica', 'Disponível', 'São Paulo, SP', ARRAY['RAC', 'DIA'], 350.00, 45),
(ARRAY['pesquisa_clinica', 'farmacovigilancia'], 'Especialista em pesquisa clínica e farmacovigilância com experiência internacional', 'Parcialmente disponível', 'Rio de Janeiro, RJ', ARRAY['GCP', 'ICH'], 420.00, 32),
(ARRAY['controle_qualidade', 'validacao_processos'], 'Expert em controle de qualidade e validação de processos farmacêuticos', 'Disponível', 'Campinas, SP', ARRAY['Six Sigma', 'ISO 9001'], 280.00, 28),
(ARRAY['biotecnologia', 'desenvolvimento_produtos'], 'Consultor especializado em biotecnologia e desenvolvimento de produtos biológicos', 'Ocupado até março', 'Belo Horizonte, MG', ARRAY['Biotec', 'PMP'], 450.00, 22),
(ARRAY['marketing_farmaceutico', 'estrategia_comercial'], 'Consultor em marketing farmacêutico e estratégias comerciais', 'Disponível', 'Porto Alegre, RS', ARRAY['MBA Marketing', 'CRM'], 300.00, 38);

-- Inserir dados de teste para regulatory_alerts (source correto: anvisa, fda)
INSERT INTO public.regulatory_alerts (title, description, source, alert_type, severity, published_at, expires_at, url) VALUES
('Nova Resolução RDC 786/2023 - Medicamentos Genéricos', 'ANVISA publica nova resolução sobre critérios para registro de medicamentos genéricos, incluindo novos requisitos de bioequivalência', 'anvisa', 'guideline', 'high', '2024-01-15 09:00:00+00', '2024-03-15 23:59:59+00', 'https://www.anvisa.gov.br/rdc786'),
('Recall: Lote 2024ABC do Medicamento XYZ', 'Recall voluntário do lote 2024ABC do medicamento XYZ devido a problemas de qualidade detectados', 'anvisa', 'recall', 'high', '2024-01-10 14:30:00+00', '2024-02-10 23:59:59+00', 'https://www.anvisa.gov.br/recall/xyz'),
('Atualização das Diretrizes de Farmacovigilância', 'Publicação das diretrizes atualizadas para notificação de eventos adversos e farmacovigilância', 'anvisa', 'guideline', 'medium', '2024-01-08 08:00:00+00', NULL, 'https://www.anvisa.gov.br/farmacovigilancia'),
('Aprovação de Novo Medicamento Oncológico', 'FDA aprova novo medicamento para tratamento de câncer de mama em estágio avançado', 'fda', 'approval', 'high', '2024-01-05 10:00:00+00', NULL, 'https://www.fda.gov/novo-onco'),
('Recall: Medicamento Cardiovascular Lote 2023XYZ', 'Recall preventivo de medicamento cardiovascular devido a desvio de qualidade', 'anvisa', 'recall', 'medium', '2024-01-03 16:00:00+00', '2024-02-03 23:59:59+00', 'https://www.anvisa.gov.br/recall-cardio');

-- Inserir dados de teste para partnership_opportunities
INSERT INTO public.partnership_opportunities (title, description, partnership_type, budget_range, requirements, status, deadline, company_id) VALUES
('Parceria para Desenvolvimento de Vacina COVID-19 Atualizada', 'Busca-se parceiro tecnológico para desenvolvimento de vacina atualizada contra variantes do COVID-19', 'joint_venture', 'R$ 5-10 milhões', ARRAY['experiencia_vacinas', 'infraestrutura_p3', 'certificacao_anvisa'], 'open', '2024-03-15', (SELECT id FROM companies WHERE name = 'Beta Labs Biotecnologia')),
('Licenciamento de Tecnologia para Medicamento Oncológico', 'Disponibilizamos tecnologia patenteada para desenvolvimento de medicamento oncológico inovador', 'licensing', 'R$ 2-5 milhões', ARRAY['experiencia_oncologia', 'capacidade_producao', 'registro_anvisa'], 'open', '2024-02-28', (SELECT id FROM companies WHERE name = 'Farmaceutica Alpha Ltda')),
('Joint Venture para Expansão Internacional', 'Parceria para expansão de produtos farmacêuticos para mercados da América Latina', 'joint_venture', 'R$ 10-20 milhões', ARRAY['presenca_internacional', 'network_regulatorio', 'capacidade_distribuicao'], 'open', '2024-04-30', (SELECT id FROM companies WHERE name = 'Epsilon Medicamentos')),
('Contrato de Pesquisa e Desenvolvimento', 'Contratação de serviços especializados para P&D de formulação farmacêutica inovadora', 'research_contract', 'R$ 1-3 milhões', ARRAY['expertise_formulacao', 'laboratorio_p2', 'experiencia_desenvolvimento'], 'open', '2024-02-15', (SELECT id FROM companies WHERE name = 'Gamma Research Institute'));

-- Atualizar perfil para admin
UPDATE public.profiles 
SET user_type = 'admin' 
WHERE email = 'betomanzoli@gmail.com';

-- Criar notificações
INSERT INTO public.notifications (user_id, title, message, type, read) VALUES
((SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 'Bem-vindo ao PharmaConnect', 'Seu perfil foi atualizado para administrador. Agora você tem acesso a todas as funcionalidades da plataforma.', 'system', false),
((SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 'Novos alertas regulatórios', 'Há 5 novos alertas regulatórios da ANVISA disponíveis para revisão.', 'regulatory', false),
((SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 'Nova oportunidade de parceria', 'Uma nova oportunidade de parceria foi publicada na plataforma.', 'partnership', false);