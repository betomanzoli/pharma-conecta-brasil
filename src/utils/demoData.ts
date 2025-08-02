
// Sistema de gerenciamento de modo demo expandido com dados internacionais
export const isDemoMode = () => {
  return window.location.pathname.startsWith('/demo') || 
         window.location.search.includes('demo=true') ||
         localStorage.getItem('demo_mode') === 'true';
};

export const setDemoMode = (enabled: boolean) => {
  if (enabled) {
    localStorage.setItem('demo_mode', 'true');
  } else {
    localStorage.removeItem('demo_mode');
  }
};

// Dados demo expandidos com cenários internacionais e nacionais
export const demoData = {
  // Empresas Farmacêuticas Nacionais e Internacionais
  companies: [
    // Grandes Multinacionais
    {
      id: 'demo-company-1',
      name: 'Novartis Brasil S.A.',
      expertise_area: ['Oncologia', 'Neurociência', 'Imunologia', 'Medicamentos Órfãos'],
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      description: 'Subsidiária brasileira da multinacional suíça, líder em medicamentos inovadores para doenças complexas',
      industrial_segment: 'pharmaceutical_company',
      revenue_range: 'R$ 2B+',
      employees: '2000+',
      certifications: ['GMP', 'ICH', 'FDA', 'EMA', 'ANVISA'],
      recent_partnerships: ['Hospital Sírio-Libanês', 'INCA', 'Eurofarma', 'Roche'],
      specialties: ['Terapias CAR-T', 'Medicina Nuclear', 'Imunoterapia'],
      licensing_interests: ['Tech Transfer de Oncológicos', 'Parcerias P&D', 'Co-desenvolvimento']
    },
    {
      id: 'demo-company-2',
      name: 'Roche Farma Brasil',
      expertise_area: ['Oncologia', 'Diagnóstico', 'Medicina Personalizada', 'Biológicos'],
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      description: 'Líder mundial em oncologia e diagnóstico in-vitro com forte presença no Brasil',
      industrial_segment: 'pharmaceutical_company',
      revenue_range: 'R$ 1.5B+',
      employees: '1500+',
      certifications: ['GMP', 'ICH', 'FDA', 'EMA', 'ANVISA', 'ISO 13485'],
      recent_partnerships: ['A.C.Camargo', 'Hospital Albert Einstein', 'Dasa', 'Fleury'],
      specialties: ['Medicina Companheira', 'Biomarcadores', 'Terapias Direcionadas'],
      licensing_interests: ['Diagnóstico Molecular', 'Oncologia de Precisão', 'Parcerias Locais']
    },
    // Líderes Nacionais Consolidados
    {
      id: 'demo-company-3',
      name: 'EMS S.A.',
      expertise_area: ['Genéricos', 'Similares', 'Medicamentos Populares', 'Biosimilares'],
      city: 'São Bernardo do Campo',
      state: 'SP',
      country: 'Brasil',
      description: 'Maior grupo farmacêutico nacional, líder em genéricos com expansão internacional',
      industrial_segment: 'pharmaceutical_company',
      revenue_range: 'R$ 8B+',
      employees: '15000+',
      certifications: ['GMP', 'ANVISA', 'FDA', 'COFEPRIS'],
      recent_partnerships: ['Merck KGaA', 'Novartis', 'Laboratórios Bagó', 'Eurofarma'],
      specialties: ['Biosimilares', 'Oncológicos Genéricos', 'SNC', 'Cardiovasculares'],
      licensing_interests: ['Biosimilares Globais', 'Expansão LATAM', 'Tech Transfer Complexos']
    },
    {
      id: 'demo-company-4',
      name: 'Eurofarma Laboratórios S.A.',
      expertise_area: ['Genéricos', 'Hospitalar', 'Oncologia', 'Dermatologia'],
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      description: 'Multinacional brasileira presente em 22 países com foco em mercados emergentes',
      industrial_segment: 'pharmaceutical_company',
      revenue_range: 'R$ 6B+',
      employees: '12000+',
      certifications: ['GMP', 'ANVISA', 'FDA', 'EMA', 'INVIMA'],
      recent_partnerships: ['Cristália', 'Blau Farmacêutica', 'Novartis', 'Sanofi'],
      specialties: ['Injetáveis Hospitalares', 'Oncológicos', 'Dermatológicos'],
      licensing_interests: ['Mercados Emergentes', 'Injetáveis Complexos', 'Parcerias África']
    },
    // Empresas Especializadas em Biotecnologia
    {
      id: 'demo-company-5',
      name: 'Receita Biopharma',
      expertise_area: ['Biotecnologia', 'Biosimilares', 'Medicina Regenerativa'],
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      description: 'Empresa brasileira especializada em desenvolvimento de biossimilares e medicina regenerativa',
      industrial_segment: 'pharmaceutical_company',
      revenue_range: 'R$ 500M - 1B',
      employees: '800-1200',
      certifications: ['GMP', 'ANVISA', 'FDA'],
      recent_partnerships: ['Amgen', 'Instituto Butantan', 'FAPESP'],
      specialties: ['Anti-TNF', 'Insulinas', 'Hormônios'],
      licensing_interests: ['Biosimilares Globais', 'Plataformas Celulares', 'Parcerias Acadêmicas']
    },
    // Players Internacionais com Interesse no Brasil
    {
      id: 'demo-company-6',
      name: 'Teva Pharmaceuticals Brasil',
      expertise_area: ['Genéricos', 'Especialidades', 'Respiratório', 'SNC'],
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      description: 'Braço brasileiro da maior empresa de genéricos do mundo',
      industrial_segment: 'pharmaceutical_company',
      revenue_range: 'R$ 1B+',
      employees: '1000+',
      certifications: ['GMP', 'FDA', 'EMA', 'ANVISA'],
      recent_partnerships: ['Takeda', 'Celltrion', 'Sandoz Brasil'],
      specialties: ['Genéricos Complexos', 'Respiratórios', 'Neurologia'],
      licensing_interests: ['Genéricos Complexos', 'Parcerias Locais', 'Biosimilares']
    },
    {
      id: 'demo-company-7',
      name: 'Sandoz Brasil',
      expertise_area: ['Genéricos', 'Biosimilares', 'Anti-infecciosos', 'Oftalmologia'],
      city: 'Cambé',
      state: 'PR',
      country: 'Brasil',
      description: 'Divisão de genéricos da Novartis, líder global em medicamentos genéricos e biosimilares',
      industrial_segment: 'pharmaceutical_company',
      revenue_range: 'R$ 800M+',
      employees: '900+',
      certifications: ['GMP', 'FDA', 'EMA', 'ANVISA', 'ICH'],
      recent_partnerships: ['Neo Química', 'Eurofarma', 'EMS'],
      specialties: ['Biosimilares', 'Injetáveis', 'Oftálmicos'],
      licensing_interests: ['Biosimilares Latam', 'Oftálmicos Especializados', 'Injetáveis Complexos']
    }
  ],
  
  // Laboratórios Especializados Nacionais e Internacionais
  laboratories: [
    // Laboratórios Analíticos de Classe Mundial
    {
      id: 'demo-lab-1',
      name: 'Eurofins Análises',
      certifications: ['ISO 17025', 'GLP', 'FDA', 'EMA', 'ANVISA', 'INMETRO'],
      location: 'São Paulo, SP, Brasil',
      international_presence: ['Estados Unidos', 'Europa', 'Ásia'],
      specializations: ['Bioequivalência', 'Análise Microbiológica', 'Impurezas Genotóxicas', 'Métodos Bioanalíticos'],
      description: 'Rede global de laboratórios com capacidade para estudos regulatórios multi-regionais',
      capacity: '95%',
      equipment: ['LC-MS/MS Última Geração', 'NMR 600MHz', 'ICP-MS', 'Microscopia Eletrônica'],
      annual_revenue: 'R$ 150M',
      major_clients: ['Novartis', 'Roche', 'EMS', 'Eurofarma', 'Pfizer Global'],
      regulatory_expertise: ['FDA', 'EMA', 'ANVISA', 'ICH', 'OECD GLP'],
      turnaround_time: '15-30 dias',
      speciality_services: ['Extractables & Leachables', 'Nitrosaminas', 'Container Closure Integrity']
    },
    {
      id: 'demo-lab-2',
      name: 'Centro de Bioequivalência UNIFESP',
      certifications: ['GCP', 'ANVISA', 'FDA', 'OECD GLP'],
      location: 'São Paulo, SP, Brasil',
      international_presence: ['Parcerias FDA', 'Rede Latino-Americana'],
      specializations: ['Bioequivalência', 'Farmacocinética', 'Biodisponibilidade', 'Estudos Clínicos Fase I'],
      description: 'Centro acadêmico de excelência em bioequivalência com reconhecimento internacional',
      capacity: '85%',
      equipment: ['Centro Clínico 60 leitos', 'LC-MS/MS Triplo Quadrupolo', 'Farmacocinética Populacional'],
      annual_revenue: 'R$ 45M',
      major_clients: ['EMS', 'Neo Química', 'Germed', 'Medley', 'Teva'],
      regulatory_expertise: ['ANVISA Bioequivalência', 'FDA Biowaiver', 'EMA Guidelines'],
      turnaround_time: '90-120 dias',
      speciality_services: ['Estudos Pediátricos', 'Formulações Complexas', 'Biosimilares Farmacocinética']
    },
    {
      id: 'demo-lab-3',
      name: 'Laboratório Cristália Análises',
      certifications: ['ISO 17025', 'ANVISA', 'GMP', 'FDA'],
      location: 'Itapira, SP, Brasil',
      international_presence: ['Exportação América Latina'],
      specializations: ['Análise de Hormônios', 'Produtos Naturais', 'Controle Microbiológico', 'Esterilidade'],
      description: 'Laboratório especializado em produtos hormonais e naturais com tecnologia própria',
      capacity: '75%',
      equipment: ['HPLC-MS/MS Hormônios', 'Biotecnologia Fermentação', 'Análises Fitoquímicas'],
      annual_revenue: 'R$ 35M',
      major_clients: ['Cristália', 'Eurofarma', 'EMS', 'Aché'],
      regulatory_expertise: ['ANVISA Específicos', 'Produtos Naturais', 'Hormônios Regulamentação'],
      turnaround_time: '20-45 dias',
      speciality_services: ['Análise Hormônios Bioidênticos', 'Fitosteróis', 'Produtos Veterinários']
    },
    // Laboratórios Internacionais com Presença no Brasil
    {
      id: 'demo-lab-4',
      name: 'SGS Brasil - Divisão Pharma',
      certifications: ['ISO 17025', 'GLP', 'GMP', 'FDA', 'EMA', 'ANVISA'],
      location: 'São Paulo, SP, Brasil',
      international_presence: ['140 países', 'Rede Global SGS'],
      specializations: ['GMP Auditorias', 'Validação de Processos', 'Análise Regulatória', 'Consultoria Internacional'],
      description: 'Rede global de inspeção e certificação com expertise em assuntos regulatórios farmacêuticos',
      capacity: '90%',
      equipment: ['Laboratórios Móveis', 'Equipamentos Portáteis', 'Tecnologia Digital'],
      annual_revenue: 'R$ 80M (Brasil)',
      major_clients: ['Multinacionais Globais', 'Indústrias Locais', 'Agências Regulatórias'],
      regulatory_expertise: ['Multi-Regional', 'GMP Global', 'Harmonização ICH'],
      turnaround_time: '10-30 dias',
      speciality_services: ['Auditorias Remotas', 'Treinamentos Regulatórios', 'Gap Analysis']
    },
    {
      id: 'demo-lab-5',
      name: 'Intertek Pharmaceutical Services',
      certifications: ['ISO 17025', 'GLP', 'FDA', 'EMA', 'ANVISA', 'PMDA'],
      location: 'Cotia, SP, Brasil',
      international_presence: ['100+ países', 'Laboratórios Globais'],
      specializations: ['Materiais de Embalagem', 'Extractables & Leachables', 'Estabilidade Acelerada', 'Análise Elementar'],
      description: 'Laboratório global especializado em testes de embalagens e compatibilidade produto-embalagem',
      capacity: '88%',
      equipment: ['GC-MS Headspace', 'LC-MS TOF', 'ICP-MS', 'Simulação Climática'],
      annual_revenue: 'R$ 60M',
      major_clients: ['J&J', 'Pfizer', 'GSK', 'Sanofi', 'Empresas Locais'],
      regulatory_expertise: ['USP <661>', 'ICH Q3C', 'FDA Guidance', 'EMA Guidelines'],
      turnaround_time: '25-50 dias',
      speciality_services: ['Container Closure', 'Migração Específica', 'Simulação Real']
    }
  ],

  // Consultores Especializados Nacionais e Internacionais
  consultants: [
    // Consultores Regulatórios Senior
    {
      id: 'demo-consultant-1',
      name: 'Dr. Roberto Takata',
      expertise: ['Assuntos Regulatórios', 'FDA Submissions', 'EMA Procedures', 'ANVISA Especialista'],
      location: 'São Paulo, SP, Brasil',
      international_experience: ['FDA', 'EMA', 'Health Canada', 'TGA Australia'],
      description: 'Ex-diretor da ANVISA com experiência internacional em agências regulatórias globais',
      hourly_rate: 450,
      success_rate: '98%',
      certifications: ['RAC Global', 'DIA Certificate', 'ICH Expert', 'FDA Alumni'],
      recent_projects: ['20 Registros FDA', '15 Procedimentos EMA', '50 Dossiês ANVISA'],
      languages: ['Português', 'Inglês', 'Espanhol'],
      speciality_areas: ['Medicamentos Órfãos', 'Terapias Avançadas', 'Biosimilares'],
      regulatory_networks: ['DIA Global', 'RAPS', 'TOPRA']
    },
    {
      id: 'demo-consultant-2',
      name: 'Dra. Maria Fernandez-Silva',
      expertise: ['CMC Development', 'Process Development', 'Tech Transfer', 'Scale-up Industrial'],
      location: 'Campinas, SP, Brasil',
      international_experience: ['Novartis Global', 'Roche International', 'GSK R&D'],
      description: 'PhD em Engenharia Química com 25 anos em desenvolvimento farmacêutico em multinacionais',
      hourly_rate: 380,
      success_rate: '97%',
      certifications: ['Six Sigma Master Black Belt', 'PMP', 'ICH Q8/Q9/Q10 Expert'],
      recent_projects: ['12 Tech Transfers Globais', '8 Scale-ups Comerciais', '5 Licenciamentos'],
      languages: ['Português', 'Inglês', 'Alemão', 'Espanhol'],
      speciality_areas: ['Continuous Manufacturing', 'PAT Implementation', 'Solid Dosage Forms'],
      regulatory_networks: ['ISPE', 'AAPS', 'PDA']
    },
    {
      id: 'demo-consultant-3',
      name: 'Dr. James Mitchell',
      expertise: ['Clinical Development', 'Biostatistics', 'Regulatory Strategy', 'Global Development'],
      location: 'São Paulo, SP, Brasil',
      international_experience: ['FDA CDER', 'EMA CHMP', 'Pharma Global'],
      description: 'Ex-reviewer FDA com expertise em desenvolvimento clínico global e estratégias regulatórias',
      hourly_rate: 520,
      success_rate: '99%',
      certifications: ['Board Certified Pharmacology', 'ASA Statistician', 'ICH GCP'],
      recent_projects: ['15 NDAs Aprovadas', '25 Estudos Fase III', '10 Pareceres EMA'],
      languages: ['Inglês', 'Português', 'Francês'],
      speciality_areas: ['Oncology Development', 'Pediatric Studies', 'Rare Diseases'],
      regulatory_networks: ['DIA', 'ISPE', 'ASA', 'ESMO']
    },
    // Especialistas em Áreas Específicas
    {
      id: 'demo-consultant-4',
      name: 'Dr. Giuseppe Rossi',
      expertise: ['Sterile Manufacturing', 'Aseptic Processing', 'Contamination Control', 'Validation'],
      location: 'São Paulo, SP, Brasil',
      international_experience: ['EMA Inspector', 'FDA Consultant', 'PIC/S Expert'],
      description: 'Especialista italiano em manufatura estéril com experiência em inspeções regulatórias globais',
      hourly_rate: 420,
      success_rate: '96%',
      certifications: ['PDA Certified', 'ISPE Fellow', 'EMA Inspector Trained'],
      recent_projects: ['30 Auditorias GMP', '12 Remediações', '8 Tech Transfers Estéreis'],
      languages: ['Italiano', 'Inglês', 'Português'],
      speciality_areas: ['Lyophilization', 'Pre-filled Syringes', 'Cell & Gene Therapy'],
      regulatory_networks: ['PDA', 'ISPE', 'PHSS']
    },
    {
      id: 'demo-consultant-5',
      name: 'Dra. Li Wei Chen',
      expertise: ['Traditional Chinese Medicine', 'Natural Products', 'Regulatory Asia-Pacific', 'Herbal Medicines'],
      location: 'São Paulo, SP, Brasil',
      international_experience: ['NMPA China', 'TGA Australia', 'HSA Singapore'],
      description: 'Especialista sino-brasileira em produtos naturais e regulamentação Asia-Pacífico',
      hourly_rate: 350,
      success_rate: '95%',
      certifications: ['TCM Practitioner', 'Phytochemistry PhD', 'NMPA Consultant'],
      recent_projects: ['15 Registros China', '10 Produtos Naturais', '8 Partnerships Asia'],
      languages: ['Mandarim', 'Português', 'Inglês'],
      speciality_areas: ['Fitoterápicos', 'Medicina Tradicional', 'Extratos Padronizados'],
      regulatory_networks: ['AHPA', 'ASP', 'Chinese Medicine Board']
    }
  ],

  // Projetos Globais e Parcerias Estratégicas
  projects: [
    // Projetos de Licenciamento Internacional
    {
      id: 'demo-project-1',
      name: 'Licenciamento Global Adalimumabe Biosimilar',
      status: 'negotiation',
      phase: 'licensing',
      partners: ['EMS S.A.', 'Celltrion (Coreia do Sul)', 'Dr. Roberto Takata'],
      timeline: '36 meses',
      budget: 15000000,
      progress: 35,
      market_potential: 'US$ 500M/ano (Global)',
      regulatory_pathway: 'FDA 351(k) + EMA Article 10 + ANVISA Via Comparabilidade',
      challenges: ['Manufatura Global', 'Regulatory Multi-Regional', 'Propriedade Intelectual'],
      regions: ['Brasil', 'América Latina', 'Europa', 'Estados Unidos'],
      licensing_terms: 'Milestone + Royalties + Co-desenvolvimento'
    },
    {
      id: 'demo-project-2',
      name: 'Tech Transfer Oncológico Pediátrico',
      status: 'in_progress',
      phase: 'tech_transfer',
      partners: ['Eurofarma', 'St. Jude Research Hospital (EUA)', 'Dr. James Mitchell'],
      timeline: '24 meses',
      budget: 8500000,
      progress: 60,
      market_potential: 'US$ 120M/ano (Mercados Emergentes)',
      regulatory_pathway: 'Orphan Drug Designation + Pediatric Investigation Plan',
      challenges: ['Formulação Pediátrica', 'Estudos Clínicos', 'Acesso Global'],
      regions: ['Brasil', 'México', 'Argentina', 'Colômbia'],
      licensing_terms: 'Exclusive License LATAM + Manufacturing Rights'
    },
    // Parcerias de P&D Colaborativo
    {
      id: 'demo-project-3',
      name: 'Desenvolvimento Conjunto Vacina mRNA',
      status: 'planning',
      phase: 'r_and_d',
      partners: ['Instituto Butantan', 'BioNTech (Alemanha)', 'Dra. Maria Fernandez-Silva'],
      timeline: '48 meses',
      budget: 25000000,
      progress: 15,
      market_potential: 'US$ 2B/ano (Global)',
      regulatory_pathway: 'Breakthrough Therapy + EMA PRIME + ANVISA Fast Track',
      challenges: ['Tecnologia mRNA', 'Cold Chain', 'Manufatura Local'],
      regions: ['Brasil', 'América Latina', 'África'],
      licensing_terms: 'Joint Development + Co-commercialization'
    },
    // Projetos de Manufatura Especializada
    {
      id: 'demo-project-4',
      name: 'Centro de Excelência Produtos Estéreis',
      status: 'in_progress',
      phase: 'manufacturing',
      partners: ['Cristália', 'Novartis Global', 'Dr. Giuseppe Rossi'],
      timeline: '30 meses',
      budget: 12000000,
      progress: 45,
      market_potential: 'US$ 300M/ano (Supply Chain Global)',
      regulatory_pathway: 'FDA Pre-Approval Inspection + EMA GMP Certification',
      challenges: ['Isoladores Assépticos', 'Validação Contínua', 'Supply Chain Global'],
      regions: ['Brasil (Hub)', 'América Latina', 'Europa'],
      licensing_terms: 'Manufacturing Agreement + Technology Transfer'
    },
    // Parcerias de Mercados Emergentes
    {
      id: 'demo-project-5',
      name: 'Expansão África - Medicamentos Essenciais',
      status: 'completed',
      phase: 'market_access',
      partners: ['Eurofarma', 'WHO', 'Ministérios Saúde África'],
      timeline: '18 meses',
      budget: 5500000,
      progress: 100,
      market_potential: 'US$ 150M/ano (Acesso Medicamentos)',
      regulatory_pathway: 'WHO Prequalification + Regulatory Harmonization',
      challenges: ['Logística Complexa', 'Preços Acessíveis', 'Sustentabilidade'],
      regions: ['Angola', 'Moçambique', 'Cabo Verde', 'Guiné-Bissau'],
      licensing_terms: 'Social Impact Partnership + Local Manufacturing'
    }
  ],

  // Cenários de Mercado Globais
  market_scenarios: [
    {
      id: 'scenario-1',
      name: 'Consolidação Global Biosimilares 2025-2030',
      description: 'Mercado de biosimilares cresce 400% globalmente com perda de patentes de blockbusters',
      impact: 'high',
      global_market: 'US$ 200B até 2030',
      opportunities: [
        'Licenciamento de tecnologias asiáticas (Celltrion, Samsung)',
        'Parcerias para mercados emergentes (LATAM, África, Ásia)',
        'Desenvolvimento conjunto para reduzir custos',
        'Centros de excelência manufatureiros regionais'
      ],
      threats: [
        'Competição acirrada com players globais estabelecidos',
        'Necessidade de investimentos massivos em P&D e manufatura',
        'Complexidade regulatória multi-regional',
        'Guerra de preços em mercados desenvolvidos'
      ],
      key_players: ['EMS', 'Eurofarma', 'Celltrion', 'Sandoz', 'Teva'],
      regulatory_trends: ['Fast Track approvals', 'Real World Evidence', 'Harmonização ICH'],
      technology_drivers: ['Manufacturing platforms', 'AI drug discovery', 'Digital therapeutics']
    },
    {
      id: 'scenario-2',
      name: 'Revolução Terapias Avançadas (CAR-T, Gene, Cell)',
      description: 'Explosão de terapias celulares e gênicas redefine tratamento de câncer e doenças raras',
      impact: 'transformational',
      global_market: 'US$ 500B até 2035',
      opportunities: [
        'Parcerias com centros acadêmicos de excelência',
        'Desenvolvimento de capacidades manufatureiras especializadas',
        'Licenciamento de plataformas tecnológicas',
        'Mercados de nicho com margens altas'
      ],
      threats: [
        'Barreira tecnológica extremamente alta',
        'Investimentos iniciais massivos sem garantia de retorno',
        'Regulamentação ainda em evolução',
        'Necessidade de expertise altamente especializada'
      ],
      key_players: ['Novartis', 'Gilead', 'J&J', 'Institutos de Pesquisa'],
      regulatory_trends: ['Expedited pathways', 'Conditional approvals', 'Real-time manufacturing'],
      technology_drivers: ['CRISPR-Cas9', 'iPSC technology', 'Viral vectors', 'AI-guided design']
    },
    {
      id: 'scenario-3',
      name: 'Medicina Personalizada e Farmacogenômica Global',
      description: 'Medicina de precisão baseada em genética individual torna-se mainstream',
      impact: 'high',
      global_market: 'US$ 300B até 2028',
      opportunities: [
        'Desenvolvimento de companion diagnostics',
        'Parcerias com empresas de sequenciamento genético',
        'Formulações personalizadas em pequenos lotes',
        'Plataformas de medicina digital integrada'
      ],
      threats: [
        'Fragmentação extrema de mercados',
        'Complexidade regulatória para produtos personalizados',
        'Necessidade de infraestrutura digital avançada',
        'Questões éticas e de privacidade'
      ],
      key_players: ['Roche', 'Illumina', '23andMe', 'Startups Healthtech'],
      regulatory_trends: ['Adaptive trials', 'Biomarker qualification', 'Data integrity'],
      technology_drivers: ['NGS sequencing', 'AI algorithms', 'Cloud computing', 'Blockchain']
    }
  ],

  // Casos de Sucesso Internacionais Replicáveis
  partnership_cases: [
    {
      id: 'case-1',
      title: 'EMS + Celltrion: Biosimilares para América Latina',
      description: 'Joint venture resultou em 5 biosimilares aprovados e US$ 800M em receita acumulada',
      partners: ['EMS (Brasil)', 'Celltrion (Coreia do Sul)'],
      timeline: '2018-2024',
      investment: 'US$ 200M',
      results: ['5 biosimilares comercializados', '12 países LATAM', '25% market share regional'],
      learning: 'Combinação de expertise local (regulatório + comercial) com tecnologia asiática de ponta',
      replication: 'Modelo aplicável para outros biosimilares e terapias avançadas',
      success_factors: ['Due diligence rigorosa', 'Alinhamento cultural', 'Investimento sustentado'],
      roi: '340% ROI em 6 anos'
    },
    {
      id: 'case-2',
      title: 'Eurofarma + Sanofi: Hub Manufatureiro América Latina',
      description: 'Parceria criou maior centro de produção de vacinas da América Latina',
      partners: ['Eurofarma (Brasil)', 'Sanofi (França)'],
      timeline: '2020-2025',
      investment: 'US$ 150M',
      results: ['200M doses/ano capacidade', '15 países atendidos', 'WHO prequalification'],
      learning: 'Investimento em infraestrutura local com padrões globais cria competitividade sustentável',
      replication: 'Hub model replicável para outras classes terapêuticas',
      success_factors: ['Visão de longo prazo', 'Compliance global', 'Sustentabilidade'],
      roi: '280% ROI projetado'
    },
    {
      id: 'case-3',
      title: 'Instituto Butantan + Sinovac: Desenvolvimento Vacinal',
      description: 'Parceria tecnológica resultou na CoronaVac e plataforma para futuras vacinas',
      partners: ['Instituto Butantan (Brasil)', 'Sinovac (China)'],
      timeline: '2020-2023',
      investment: 'US$ 100M',
      results: ['100M doses produzidas', 'Tecnologia transferida', 'Plataforma estabelecida'],
      learning: 'Parcerias acadêmico-industriais aceleram desenvolvimento e reduzem riscos',
      replication: 'Modelo aplicável para outras doenças infecciosas e endêmicas',
      success_factors: ['Urgência de saúde pública', 'Apoio governamental', 'Expertise complementar'],
      roi: 'Impacto social imensurável + sustentabilidade tecnológica'
    },
    {
      id: 'case-4',
      title: 'Novartis + Multiple Partners: Sandostatin LAR Global',
      description: 'Rede de parcerias globais para produção e distribuição de produto complexo',
      partners: ['Novartis (Suíça)', 'Network Global de Partners'],
      timeline: '2015-2024',
      investment: 'US$ 500M+',
      results: ['Disponível em 80+ países', 'US$ 1.5B receita anual', 'Standard of care'],
      learning: 'Produtos complexos requerem rede global de partners especializados',
      replication: 'Modelo para outros produtos de liberação controlada',
      success_factors: ['Expertise técnica única', 'Rede regulatória global', 'Qualidade consistente'],
      roi: '450% ROI sustentável'
    }
  ],

  // Fornecedores Especializados Globais
  suppliers: [
    {
      id: 'supplier-1',
      name: 'Catalent Pharma Solutions',
      category: 'CDMO',
      location: 'Somerset, NJ, EUA + Global',
      brazil_presence: 'Parceria com laboratórios locais',
      specializations: ['Softgel Technology', 'Modified Release', 'Biologics', 'Clinical Supply'],
      certifications: ['FDA', 'EMA', 'ANVISA approved sites'],
      capacity: 'Global network - 50+ facilities',
      key_technologies: ['OptiForm', 'Zydis', 'OptiDose', 'GPEx'],
      major_clients: ['J&J', 'Pfizer', 'Gilead', 'Novartis'],
      partnership_interests: ['Brazil manufacturing', 'LATAM expansion', 'Local partnerships']
    },
    {
      id: 'supplier-2',
      name: 'Lonza Group AG',
      category: 'CDMO Biológicos',
      location: 'Basel, Suíça + Global',
      brazil_presence: 'Interesse em hub LATAM',
      specializations: ['Mammalian Cell Culture', 'Microbial', 'Cell & Gene Therapy', 'Capsules'],
      certifications: ['FDA', 'EMA', 'Swissmedic', 'Multiple global'],
      capacity: 'Global network - 35+ facilities',
      key_technologies: ['Biologics platforms', 'Viral vectors', 'Capsugel'],
      major_clients: ['Moderna', 'Genentech', 'AstraZeneca'],
      partnership_interests: ['Biologics manufacturing LATAM', 'Technology transfer']
    }
  ],

  // Métricas Expandidas com Contexto Global
  metrics: {
    totalUsers: 12450,
    activeCompanies: 890,
    activeLaboratories: 445,
    activeConsultants: 1230,
    completedProjects: 445,
    successfulMatches: 2850,
    avgMatchScore: 91.5,
    platformUptime: 99.8,
    avgProjectValue: 2850000,
    marketGrowth: '35%',
    customerSatisfaction: 4.8,
    timeToMatch: '0.8s',
    internationalProjects: 180,
    globalPartnerships: 67,
    regulatorySuccessRate: '96.5%',
    techTransferSuccess: '89%',
    licenseDealsValue: 'US$ 2.3B',
    marketCoverage: '45 países'
  }
};

// API expandida com simulações internacionais
export const demoAPI = {
  aiMatching: async (userType: string, preferences: any) => {
    // Simular processamento de IA mais sofisticado com contexto global
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const matches = [];
    const { companies, laboratories, consultants } = demoData;
    
    // Lógica de matching internacional mais complexa
    if (userType === 'pharmaceutical_company') {
      // Matching de laboratórios com preferência geográfica
      laboratories.forEach((lab, index) => {
        const baseScore = 0.72 + (Math.random() * 0.26);
        
        // Bonificações por critérios específicos
        const locationBonus = preferences.location && lab.location.includes(preferences.location) ? 0.12 : 0;
        const internationalBonus = lab.international_presence ? 0.08 : 0;
        const specialtyBonus = preferences.specialties && 
          lab.specializations.some(spec => preferences.specialties.includes(spec)) ? 0.15 : 0;
        const regulatoryBonus = preferences.regulatory && 
          lab.regulatory_expertise?.includes(preferences.regulatory) ? 0.1 : 0;
        
        const finalScore = Math.min(0.98, baseScore + locationBonus + internationalBonus + specialtyBonus + regulatoryBonus);
        
        matches.push({
          id: lab.id,
          name: lab.name,
          type: 'laboratory',
          score: finalScore,
          specialties: lab.specializations,
          location: lab.location,
          verified: true,
          capacity: lab.capacity,
          annual_revenue: lab.annual_revenue,
          major_clients: lab.major_clients?.slice(0, 3) || [],
          international_presence: lab.international_presence || [],
          regulatory_expertise: lab.regulatory_expertise || [],
          turnaround_time: lab.turnaround_time,
          compatibility_factors: [
            'Certificações internacionais compatíveis',
            'Expertise regulatória global',
            'Histórico com multinacionais',
            'Capacidade para projetos complexos',
            'Rede internacional estabelecida',
            'Compliance multi-regional'
          ].filter((_, i) => finalScore > 0.85 || i < 4)
        });
      });
      
      // Matching de consultores com expertise global
      consultants.forEach((consultant, index) => {
        const baseScore = 0.68 + (Math.random() * 0.30);
        
        const expertiseBonus = preferences.specialties && 
          consultant.expertise.some(exp => preferences.specialties.some(pref => exp.toLowerCase().includes(pref.toLowerCase()))) ? 0.2 : 0;
        const internationalBonus = consultant.international_experience ? 0.15 : 0;
        const languageBonus = consultant.languages?.length > 2 ? 0.05 : 0;
        
        const finalScore = Math.min(0.98, baseScore + expertiseBonus + internationalBonus + languageBonus);
        
        matches.push({
          id: consultant.id,
          name: consultant.name,
          type: 'consultant',
          score: finalScore,
          specialties: consultant.expertise,
          location: consultant.location,
          verified: true,
          hourly_rate: consultant.hourly_rate,
          success_rate: consultant.success_rate,
          recent_projects: consultant.recent_projects?.slice(0, 2) || [],
          international_experience: consultant.international_experience || [],
          languages: consultant.languages || [],
          speciality_areas: consultant.speciality_areas || [],
          compatibility_factors: [
            'Experiência regulatória internacional',
            'Expertise em projetos globais',
            'Fluência em múltiplos idiomas',
            'Network regulatório global',
            'Histórico de sucesso comprovado',
            'Certificações internacionais'
          ].filter((_, i) => finalScore > 0.87 || i < 4)
        });
      });
    }
    
    // Cenário de mercado global ativo
    const globalScenarios = demoData.market_scenarios;
    const activeScenario = globalScenarios[Math.floor(Math.random() * globalScenarios.length)];
    
    return {
      success: true,
      matches: matches.sort((a, b) => b.score - a.score).slice(0, 10),
      market_context: {
        active_scenario: activeScenario.name,
        global_market: activeScenario.global_market,
        impact_level: activeScenario.impact,
        key_opportunities: activeScenario.opportunities.slice(0, 3),
        technology_drivers: activeScenario.technology_drivers?.slice(0, 2),
        regulatory_trends: activeScenario.regulatory_trends?.slice(0, 2)
      },
      processing_time: '1.4s',
      algorithm_version: 'global_ai_v3.0',
      geographic_coverage: '45 países',
      confidence_level: '94.5%'
    };
  },

  getGlobalMetrics: () => ({
    ...demoData.metrics,
    last_updated: new Date().toISOString(),
    global_scenarios_active: demoData.market_scenarios.length,
    international_cases: demoData.partnership_cases.length,
    geographic_presence: ['América do Norte', 'Europa', 'Ásia-Pacífico', 'América Latina', 'África'],
    regulatory_coverage: ['FDA', 'EMA', 'ANVISA', 'PMDA', 'Health Canada', 'TGA', 'NMPA']
  }),
  
  getInternationalProjects: () => demoData.projects.map(project => ({
    ...project,
    estimated_roi: `${Math.floor(Math.random() * 300 + 150)}%`,
    risk_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    success_probability: `${Math.floor(Math.random() * 25 + 75)}%`,
    geographic_scope: project.regions?.join(', ') || 'Regional',
    regulatory_complexity: ['Standard', 'Complex', 'Highly Complex'][Math.floor(Math.random() * 3)]
  })),
  
  searchGlobalEntities: (query: string, filters?: any) => {
    const allEntities = [
      ...demoData.companies.map(c => ({ ...c, entity_type: 'company' })),
      ...demoData.laboratories.map(l => ({ ...l, entity_type: 'laboratory' })),
      ...demoData.consultants.map(c => ({ ...c, entity_type: 'consultant' }))
    ];
    
    let filtered = allEntities.filter(entity => 
      entity.name.toLowerCase().includes(query.toLowerCase())
    );

    // Filtros adicionais
    if (filters?.region) {
      filtered = filtered.filter(entity => 
        entity.location?.includes(filters.region) || 
        entity.international_experience?.some(exp => exp.includes(filters.region))
      );
    }

    if (filters?.regulatory) {
      filtered = filtered.filter(entity => 
        entity.regulatory_expertise?.includes(filters.regulatory) ||
        entity.certifications?.includes(filters.regulatory)
      );
    }

    return filtered;
  },

  getGlobalMarketInsights: () => ({
    scenarios: demoData.market_scenarios,
    partnership_cases: demoData.partnership_cases,
    global_trends: [
      { name: 'Biosimilares Globais', growth: '+65%', regions: ['LATAM', 'Ásia', 'Europa'], confidence: 'high' },
      { name: 'Terapias Avançadas', growth: '+120%', regions: ['EUA', 'Europa', 'Japão'], confidence: 'high' },
      { name: 'Medicina Personalizada', growth: '+85%', regions: ['Global'], confidence: 'medium' },
      { name: 'Manufatura Distribuída', growth: '+45%', regions: ['Emerging Markets'], confidence: 'high' }
    ],
    regulatory_harmonization: [
      'ICH Implementation Global',
      'Real World Evidence Acceptance',
      'Digital Submissions Standard',
      'Expedited Pathways Expansion'
    ],
    technology_disruptions: [
      'AI Drug Discovery Mainstream',
      'Continuous Manufacturing Adoption',
      'Digital Therapeutics Integration',
      'Blockchain Supply Chain'
    ],
    strategic_recommendations: [
      'Investir em parcerias asiáticas para biosimilares',
      'Desenvolver capacidades manufatureiras flexíveis',
      'Estabelecer network regulatório global',
      'Explorar mercados emergentes LATAM/África',
      'Preparar para terapias avançadas',
      'Implementar plataformas tecnológicas modulares'
    ]
  })
};
