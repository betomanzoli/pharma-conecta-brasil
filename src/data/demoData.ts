
// Dados de demonstração para popular a plataforma
export const demoCompanies = [
  {
    name: "Farmácia Brasileira S.A.",
    cnpj: "12.345.678/0001-90",
    expertise_area: ["Medicamentos Genéricos", "Fitoterapia"],
    description: "Líder em medicamentos genéricos no Brasil, com mais de 30 anos de experiência no mercado farmacêutico.",
    website: "https://farmaciabrasileira.com.br",
    city: "São Paulo",
    state: "SP",
    compliance_status: "compliant"
  },
  {
    name: "BioTech Inovação Ltda.",
    cnpj: "98.765.432/0001-10",
    expertise_area: ["Biotecnologia", "Medicamentos Biológicos"],
    description: "Empresa focada em desenvolvimento de medicamentos biológicos e terapias inovadoras.",
    website: "https://biotechinnovacao.com.br",
    city: "Campinas",
    state: "SP",
    compliance_status: "compliant"
  },
  {
    name: "Laboratório Mineiro de Análises",
    cnpj: "11.222.333/0001-44",
    expertise_area: ["Análises Clínicas", "Controle de Qualidade"],
    description: "Laboratório especializado em análises farmacêuticas e controle de qualidade com certificação ISO.",
    website: "https://labmineiro.com.br",
    city: "Belo Horizonte",
    state: "MG",
    compliance_status: "compliant"
  },
  {
    name: "Pharma Solutions Rio",
    cnpj: "55.666.777/0001-88",
    expertise_area: ["Consultoria Regulatória", "Registro de Medicamentos"],
    description: "Consultoria especializada em assuntos regulatórios e registro de medicamentos na ANVISA.",
    website: "https://pharmasolutions.com.br",
    city: "Rio de Janeiro",
    state: "RJ",
    compliance_status: "compliant"
  },
  {
    name: "Nordeste Farmacêutica",
    cnpj: "22.333.444/0001-55",
    expertise_area: ["Medicamentos Populares", "Distribuição"],
    description: "Distribuidora de medicamentos com foco no mercado nordestino e medicamentos de baixo custo.",
    website: "https://nordestefarmaceutica.com.br",
    city: "Recife",
    state: "PE",
    compliance_status: "pending"
  }
];

export const demoLaboratories = [
  {
    name: "Lab Control São Paulo",
    certifications: ["ISO 17025", "INMETRO", "ANVISA"],
    location: "São Paulo, SP",
    description: "Laboratório de controle de qualidade especializado em análises farmacêuticas.",
    equipment_list: ["HPLC", "GC-MS", "UV-Vis", "Microscópio"],
    available_capacity: 85,
    operating_hours: "Segunda a Sexta: 7h às 19h"
  },
  {
    name: "Instituto de Análises Avançadas",
    certifications: ["ISO 17025", "GLP", "ANVISA"],
    location: "Campinas, SP",
    description: "Instituto de pesquisa com foco em análises microbiológicas e físico-químicas.",
    equipment_list: ["LC-MS/MS", "ICP-MS", "Karl Fischer", "Autoclave"],
    available_capacity: 60,
    operating_hours: "24 horas"
  },
  {
    name: "Biolab Nordeste",
    certifications: ["ANVISA", "ISO 9001"],
    location: "Fortaleza, CE",
    description: "Laboratório regional especializado em análises de matérias-primas farmacêuticas.",
    equipment_list: ["HPLC", "UV-Vis", "pH metro", "Balança analítica"],
    available_capacity: 40,
    operating_hours: "Segunda a Sexta: 6h às 18h"
  }
];

export const demoConsultants = [
  {
    expertise: ["Assuntos Regulatórios", "ANVISA", "Registro de Medicamentos"],
    description: "Consultora sênior com 15 anos de experiência em assuntos regulatórios na ANVISA.",
    hourly_rate: 250,
    availability: "Disponível",
    location: "Brasília, DF",
    certifications: ["RAC", "DIA", "ANVISA"],
    projects_completed: 89
  },
  {
    expertise: ["Desenvolvimento Farmacêutico", "Formulação", "Estabilidade"],
    description: "Farmacêutico industrial especializado em desenvolvimento de formulações sólidas.",
    hourly_rate: 180,
    availability: "Disponível",
    location: "São Paulo, SP",
    certifications: ["CRF-SP", "Especialização USP"],
    projects_completed: 67
  },
  {
    expertise: ["Controle de Qualidade", "Validação", "Métodos Analíticos"],
    description: "Especialista em validação de métodos analíticos e controle de qualidade farmacêutica.",
    hourly_rate: 200,
    availability: "Parcialmente Disponível",
    location: "Rio de Janeiro, RJ",
    certifications: ["CRF-RJ", "Mestrado UFRJ"],
    projects_completed: 54
  }
];

export const demoProjects = [
  {
    title: "Análise de Estabilidade de Medicamento Genérico",
    description: "Estudo de estabilidade acelerada e de longa duração para medicamento genérico de liberação imediata.",
    service_type: "laboratory_analysis",
    budget_min: 15000,
    budget_max: 25000,
    deadline: "2025-03-15",
    requirements: ["Estudos de estabilidade", "Métodos validados", "Relatório ANVISA"],
    status: "open"
  },
  {
    title: "Consultoria para Registro de Medicamento Biológico",
    description: "Assessoria completa para registro de medicamento biológico na ANVISA, incluindo dossiê técnico.",
    service_type: "regulatory_consulting",
    budget_min: 80000,
    budget_max: 120000,
    deadline: "2025-06-30",
    requirements: ["Experiência com biológicos", "Conhecimento ANVISA", "Dossiê CTD"],
    status: "open"
  },
  {
    title: "Desenvolvimento de Formulação Pediátrica",
    description: "Desenvolvimento de formulação líquida para uso pediátrico com sabor agradável e estabilidade.",
    service_type: "formulation_development",
    budget_min: 50000,
    budget_max: 75000,
    deadline: "2025-04-20",
    requirements: ["Experiência pediátrica", "Estudos de palatabilidade", "Estabilidade"],
    status: "in_progress"
  },
  {
    title: "Validação de Métodos Analíticos",
    description: "Validação completa de métodos analíticos para controle de qualidade de matérias-primas.",
    service_type: "method_validation",
    budget_min: 30000,
    budget_max: 45000,
    deadline: "2025-02-28",
    requirements: ["ICH Q2", "Métodos por HPLC", "Relatório de validação"],
    status: "completed"
  }
];

export const demoPartnershipOpportunities = [
  {
    title: "Parceria para Desenvolvimento de Medicamentos Oncológicos",
    description: "Busca por parceiro tecnológico para desenvolvimento conjunto de medicamentos oncológicos inovadores.",
    partnership_type: "joint_venture",
    budget_range: "R$ 2-5 milhões",
    deadline: "2025-08-15",
    requirements: ["Experiência oncológica", "Laboratório P&D", "Certificação GMP"],
    status: "open"
  },
  {
    title: "Distribuição Regional - Nordeste",
    description: "Oportunidade de parceria para distribuição de medicamentos genéricos na região Nordeste.",
    partnership_type: "distribution",
    budget_range: "R$ 500mil - 1 milhão",
    deadline: "2025-05-30",
    requirements: ["Rede de distribuição", "Logística refrigerada", "Licença ANVISA"],
    status: "open"
  }
];

export const demoRegulatoryAlerts = [
  {
    title: "Nova RDC sobre Medicamentos Biológicos",
    description: "ANVISA publica nova resolução sobre registro e controle de medicamentos biológicos.",
    alert_type: "regulation_change",
    severity: "high",
    source: "ANVISA",
    published_at: "2025-01-15T10:00:00Z",
    expires_at: "2025-04-15T23:59:59Z",
    url: "https://www.gov.br/anvisa/pt-br"
  },
  {
    title: "Recall de Lote de Medicamento Antihipertensivo",
    description: "Recall voluntário de lote específico devido a desvio de qualidade identificado.",
    alert_type: "safety_alert",
    severity: "critical",
    source: "ANVISA",
    published_at: "2025-01-10T15:30:00Z",
    expires_at: "2025-02-10T23:59:59Z",
    url: "https://www.gov.br/anvisa/pt-br"
  },
  {
    title: "Atualização de Bula - Medicamentos Anticoagulantes",
    description: "Obrigatoriedade de atualização de bulas de medicamentos anticoagulantes com novas contraindicações.",
    alert_type: "documentation_update",
    severity: "medium",
    source: "ANVISA",
    published_at: "2025-01-05T09:00:00Z",
    expires_at: "2025-07-05T23:59:59Z",
    url: "https://www.gov.br/anvisa/pt-br"
  }
];

export const demoMentorshipSessions = [
  {
    title: "Introdução aos Assuntos Regulatórios",
    description: "Sessão introdutória sobre regulamentação farmacêutica no Brasil e processos da ANVISA.",
    scheduled_at: "2025-01-25T14:00:00Z",
    duration_minutes: 60,
    status: "scheduled",
    meeting_link: "https://meet.google.com/demo-session-1"
  },
  {
    title: "Desenvolvimento de Métodos Analíticos",
    description: "Workshop prático sobre desenvolvimento e validação de métodos analíticos farmacêuticos.",
    scheduled_at: "2025-01-30T16:00:00Z",
    duration_minutes: 90,
    status: "scheduled",
    meeting_link: "https://meet.google.com/demo-session-2"
  }
];

export const demoNotifications = [
  {
    title: "Nova Oportunidade de Projeto",
    message: "Um novo projeto de análise de estabilidade foi publicado e corresponde ao seu perfil.",
    type: "project_match",
    read: false
  },
  {
    title: "Alerta Regulatório",
    message: "Nova RDC publicada pela ANVISA sobre medicamentos biológicos.",
    type: "regulatory_alert",
    read: false
  },
  {
    title: "Sessão de Mentoria Confirmada",
    message: "Sua sessão de mentoria sobre assuntos regulatórios foi confirmada para amanhã às 14h.",
    type: "mentorship",
    read: true
  }
];
