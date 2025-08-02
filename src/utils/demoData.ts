
// Sistema de gerenciamento de modo demo expandido
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

// Dados demo baseados em parcerias reais do mercado farmacêutico brasileiro
export const demoData = {
  companies: [
    // Grandes Farmacêuticas
    {
      id: 'demo-company-1',
      name: 'BioFarma Solutions',
      expertise_area: ['Biotecnologia', 'Medicamentos Biológicos', 'Oncologia'],
      city: 'São Paulo',
      state: 'SP',
      description: 'Empresa líder em desenvolvimento de medicamentos biotecnológicos com foco em oncologia e doenças raras',
      industrial_segment: 'pharmaceutical_company',
      revenue_range: 'R$ 500M - 1B',
      employees: '1000-2000',
      certifications: ['GMP', 'ICH', 'ANVISA'],
      recent_partnerships: ['Amgen', 'Roche Brasil', 'Hospital Sírio-Libanês']
    },
    {
      id: 'demo-company-2', 
      name: 'Pharma Tech Brasil',
      expertise_area: ['Genéricos', 'Desenvolvimento Clínico', 'Regulatório'],
      city: 'Rio de Janeiro',
      state: 'RJ',
      description: 'Especializada em medicamentos genéricos e desenvolvimento de formulações inovadoras',
      industrial_segment: 'pharmaceutical_company',
      revenue_range: 'R$ 200M - 500M',
      employees: '500-1000',
      certifications: ['ISO 9001', 'GMP', 'ANVISA'],
      recent_partnerships: ['Sandoz', 'Teva', 'Eurofarma']
    },
    {
      id: 'demo-company-3',
      name: 'MediCorp Inovação',
      expertise_area: ['Pesquisa Clínica', 'Farmacologia', 'Dispositivos Médicos'],
      city: 'Belo Horizonte',
      state: 'MG',
      description: 'Focada em P&D farmacêutico com forte atuação em estudos clínicos fase II/III',
      industrial_segment: 'pharmaceutical_company',
      revenue_range: 'R$ 100M - 200M',
      employees: '200-500',
      certifications: ['GCP', 'ICH', 'FDA'],
      recent_partnerships: ['Pfizer', 'Novartis', 'UFMG']
    },
    // Empresas de Biotecnologia
    {
      id: 'demo-company-4',
      name: 'BrazilBio Therapeutics',
      expertise_area: ['Terapia Celular', 'Medicina Regenerativa', 'Biotecnologia'],
      city: 'Campinas',
      state: 'SP',
      description: 'Pioneira em terapias celulares e medicina regenerativa no Brasil',
      industrial_segment: 'pharmaceutical_company',
      revenue_range: 'R$ 50M - 100M',
      employees: '100-200',
      certifications: ['GMP', 'ANVISA', 'FDA'],
      recent_partnerships: ['Instituto Butantan', 'FAPESP', 'Recepta Biopharma']
    },
    // Startups Farmacêuticas
    {
      id: 'demo-company-5',
      name: 'NanoPharm Startup',
      expertise_area: ['Nanotecnologia', 'Drug Delivery', 'Formulações Inovadoras'],
      city: 'Porto Alegre',
      state: 'RS',
      description: 'Startup focada em sistemas de liberação controlada usando nanotecnologia',
      industrial_segment: 'pharmaceutical_company',
      revenue_range: 'R$ 10M - 50M',
      employees: '50-100',
      certifications: ['ISO 13485', 'ANVISA'],
      recent_partnerships: ['PUCRS', 'FINEP', 'Cristália']
    }
  ],
  
  laboratories: [
    // Laboratórios de Análise
    {
      id: 'demo-lab-1',
      name: 'LabAnalise Avançado',
      certifications: ['ISO 17025', 'ANVISA', 'INMETRO', 'CAP'],
      location: 'São Paulo, SP',
      specializations: ['Análise Microbiológica', 'Controle de Qualidade', 'Bioequivalência'],
      description: 'Laboratório de excelência em análises farmacêuticas com capacidade para 5000 amostras/mês',
      capacity: '95%',
      equipment: ['HPLC-MS/MS', 'GC-MS', 'LC-MS/MS', 'Microbiologia automatizada'],
      annual_revenue: 'R$ 25M',
      major_clients: ['EMS', 'Aché', 'Eurofarma']
    },
    {
      id: 'demo-lab-2',
      name: 'Centro de Análises Farmacêuticas',
      certifications: ['ISO 17025', 'ANVISA', 'GLP'],
      location: 'Campinas, SP',
      specializations: ['Análise Físico-Química', 'Estabilidade', 'Dissolução'],
      description: 'Centro especializado em estudos de estabilidade e desenvolvimento analítico',
      capacity: '78%',
      equipment: ['Estufas de estabilidade', 'Dissolution tester', 'HPLC', 'UV-Vis'],
      annual_revenue: 'R$ 18M',
      major_clients: ['Medley', 'Germed', 'Legrand']
    },
    {
      id: 'demo-lab-3',
      name: 'Instituto de Bioequivalência',
      certifications: ['ANVISA', 'FDA', 'EMA', 'GCP'],
      location: 'São Paulo, SP',
      specializations: ['Bioequivalência', 'Farmacocinética', 'Estudos Clínicos Fase I'],
      description: 'Instituto líder em estudos de bioequivalência com 20 anos de experiência',
      capacity: '85%',
      equipment: ['Centro clínico', 'LC-MS/MS', 'Farmacocinética', 'Bioanalítica'],
      annual_revenue: 'R$ 40M',
      major_clients: ['Sandoz', 'Teva', 'Mylan', 'Neo Química']
    },
    // Laboratórios Especializados
    {
      id: 'demo-lab-4',
      name: 'BioSafety Labs',
      certifications: ['ISO 17025', 'ANVISA', 'Biosafety Level 3'],
      location: 'Rio de Janeiro, RJ',
      specializations: ['Microbiologia', 'Esterilidade', 'Endotoxinas', 'Virologia'],
      description: 'Especializado em testes de segurança microbiológica para produtos injetáveis',
      capacity: '65%',
      equipment: ['Cabines biológicas', 'PCR', 'LAL test', 'Esterilizadores'],
      annual_revenue: 'R$ 12M',
      major_clients: ['Instituto Butantan', 'Bio-Manguinhos', 'Cristália']
    },
    {
      id: 'demo-lab-5',
      name: 'Analytical Excellence Center',
      certifications: ['ISO 17025', 'ANVISA', 'INMETRO', 'FDA'],
      location: 'Brasília, DF',
      specializations: ['Métodos Analíticos', 'Validação', 'Impurezas', 'Genotoxinas'],
      description: 'Centro de excelência em desenvolvimento e validação de métodos analíticos',
      capacity: '90%',
      equipment: ['HPLC-MS/MS', 'NMR', 'ICP-MS', 'GC-MS/MS'],
      annual_revenue: 'R$ 30M',
      major_clients: ['Pfizer', 'Novartis', 'GSK', 'Bayer']
    }
  ],

  consultants: [
    // Consultores Regulatórios
    {
      id: 'demo-consultant-1',
      name: 'Dr. Maria Santos',
      expertise: ['Regulatório ANVISA', 'Registro de Medicamentos', 'CTD', 'Farmacovigilância'],
      location: 'Brasília, DF',
      description: 'Ex-gerente da ANVISA com 20 anos de experiência em assuntos regulatórios',
      hourly_rate: 350,
      success_rate: '98%',
      certifications: ['RAC', 'DIA', 'PharmacoVigilance'],
      recent_projects: ['Registro de 15 genéricos', '5 medicamentos biológicos', '3 dispositivos médicos']
    },
    {
      id: 'demo-consultant-2',
      name: 'Dr. João Silva',
      expertise: ['Desenvolvimento Farmacêutico', 'Formulação', 'Scale-up', 'Estabilidade'],
      location: 'São Paulo, SP',
      description: 'Farmacêutico industrial com experiência em multinacionais farmacêuticas',
      hourly_rate: 280,
      success_rate: '95%',
      certifications: ['CRF-SP', 'Especialização USP', 'Six Sigma Black Belt'],
      recent_projects: ['Desenvolvimento de 8 formulações', '3 scale-ups industriais']
    },
    {
      id: 'demo-consultant-3',
      name: 'Dra. Ana Costa',
      expertise: ['Controle de Qualidade', 'Validação', 'Métodos Analíticos', 'GMP'],
      location: 'Rio de Janeiro, RJ',
      description: 'Especialista em qualidade farmacêutica com certificações internacionais',
      hourly_rate: 250,
      success_rate: '97%',
      certifications: ['CRF-RJ', 'ASQ CQE', 'ICH Guidelines'],
      recent_projects: ['Validação de 12 métodos', '6 auditorias GMP', '4 remediações']
    },
    // Consultores Especializados
    {
      id: 'demo-consultant-4',
      name: 'Dr. Carlos Mendes',
      expertise: ['Desenvolvimento Clínico', 'GCP', 'Bioestatística', 'Regulatory Affairs'],
      location: 'São Paulo, SP',
      description: 'Médico especialista em pesquisa clínica com foco em oncologia',
      hourly_rate: 400,
      success_rate: '99%',
      certifications: ['CRM-SP', 'GCP', 'Biostatistics Certificate'],
      recent_projects: ['10 estudos clínicos fase III', '5 submissões FDA', '3 parcerias internacionais']
    },
    {
      id: 'demo-consultant-5',
      name: 'Dra. Patricia Lima',
      expertise: ['Biotecnologia', 'Produtos Biológicos', 'Biosimilares', 'CMC'],
      location: 'Belo Horizonte, MG',
      description: 'Bióloga com PhD em biotecnologia e experiência em produtos biológicos',
      hourly_rate: 320,
      success_rate: '96%',
      certifications: ['PhD Biotechnology', 'Biosimilar Guidelines', 'ICH Q5 Expert'],
      recent_projects: ['3 biosimilares aprovados', '2 produtos biológicos', '5 processos CMC']
    }
  ],

  projects: [
    // Projetos de Desenvolvimento
    {
      id: 'demo-project-1',
      name: 'Desenvolvimento de Genérico Anti-hipertensivo (Losartana)',
      status: 'in_progress',
      phase: 'clinical_development',
      partners: ['BioFarma Solutions', 'Instituto de Bioequivalência'],
      timeline: '12 meses',
      budget: 850000,
      progress: 75,
      market_potential: 'R$ 45M/ano',
      regulatory_pathway: 'Via genérico ANVISA',
      challenges: ['Bioequivalência', 'Formulação', 'Scale-up industrial']
    },
    {
      id: 'demo-project-2',
      name: 'Registro de Medicamento Biotecnológico (Anti-TNF)',
      status: 'planning',
      phase: 'regulatory',
      partners: ['BrazilBio Therapeutics', 'Dr. Patricia Lima', 'BioSafety Labs'],
      timeline: '18 meses',
      budget: 1200000,
      progress: 25,
      market_potential: 'R$ 120M/ano',
      regulatory_pathway: 'Via produto biológico ANVISA',
      challenges: ['CMC complexo', 'Estudos clínicos', 'Comparabilidade']
    },
    {
      id: 'demo-project-3',
      name: 'Validação de Método Analítico Multi-resíduo',
      status: 'completed',
      phase: 'analytical_development',
      partners: ['Analytical Excellence Center', 'Pharma Tech Brasil'],
      timeline: '6 meses',
      budget: 180000,
      progress: 100,
      market_potential: 'Redução 40% custos analíticos',
      regulatory_pathway: 'Validação ICH Q2',
      challenges: ['Especificidade', 'Robustez', 'Transferência método']
    },
    // Projetos de Parceria
    {
      id: 'demo-project-4',
      name: 'Joint Venture - Medicamentos Oncológicos Pediátricos',
      status: 'negotiation',
      phase: 'business_development',
      partners: ['MediCorp Inovação', 'Hospital Sírio-Libanês', 'Dr. Carlos Mendes'],
      timeline: '24 meses',
      budget: 2500000,
      progress: 15,
      market_potential: 'R$ 80M/ano',
      regulatory_pathway: 'Via inovador ANVISA + FDA',
      challenges: ['Estudos pediátricos', 'Formulação líquida', 'Acesso mercado']
    },
    {
      id: 'demo-project-5',
      name: 'Terceirização de Análises - Vacinas COVID-19',
      status: 'completed',
      phase: 'quality_control',
      partners: ['BioSafety Labs', 'Instituto Butantan'],
      timeline: '8 meses',
      budget: 450000,
      progress: 100,
      market_potential: 'Capacidade 50K doses/mês',
      regulatory_pathway: 'Liberação paramétrica ANVISA',
      challenges: ['Urgência regulatória', 'Capacidade instalada', 'Cold chain']
    }
  ],

  // Simulações de cenários de mercado
  market_scenarios: [
    {
      id: 'scenario-1',
      name: 'Explosão do Mercado de Biosimilares',
      description: 'Crescimento 300% no mercado de biosimilares até 2026',
      impact: 'high',
      opportunities: [
        'Desenvolvimento de biosimilares de adalimumabe',
        'Parcerias internacionais para tecnologia',
        'Centros de excelência em produtos biológicos'
      ],
      threats: [
        'Competição acirrada com multinacionais',
        'Necessidade de investimentos altos em P&D',
        'Regulamentação mais rigorosa'
      ],
      key_players: ['BrazilBio Therapeutics', 'Instituto de Bioequivalência', 'Dra. Patricia Lima']
    },
    {
      id: 'scenario-2', 
      name: 'Revolução da Medicina Personalizada',
      description: 'Crescimento da farmacogenômica e medicina de precisão',
      impact: 'medium',
      opportunities: [
        'Testes farmacogenômicos',
        'Formulações personalizadas',
        'Parcerias com hospitais de referência'
      ],
      threats: [
        'Necessidade de capacitação técnica',
        'Regulamentação ainda em desenvolvimento',
        'Custo inicial elevado'
      ],
      key_players: ['NanoPharm Startup', 'Dr. Carlos Mendes', 'Analytical Excellence Center']
    },
    {
      id: 'scenario-3',
      name: 'Consolidação do Mercado de Genéricos',
      description: 'Pressão por preços e necessidade de diferenciação',
      impact: 'high',
      opportunities: [
        'Genéricos de liberação modificada',
        'Combinações fixas inovadoras',
        'Eficiência operacional'
      ],
      threats: [
        'Guerra de preços',
        'Entrada de players internacionais',
        'Margens reduzidas'
      ],
      key_players: ['Pharma Tech Brasil', 'LabAnalise Avançado', 'Dr. João Silva']
    }
  ],

  partnership_cases: [
    {
      id: 'case-1',
      title: 'Sucesso: Parceria EMS + Merck para Biosimilares',
      description: 'Joint venture resultou em 3 biosimilares aprovados e R$ 200M em receita',
      learning: 'Importância de combinar expertise local com tecnologia internacional',
      replication: 'BrazilBio + multinacional para anti-TNF'
    },
    {
      id: 'case-2',
      title: 'Caso: Eurofarma + Laboratórios Externos',
      description: 'Terceirização estratégica de análises aumentou capacidade em 40%',
      learning: 'Parcerias permitem foco no core business',
      replication: 'Pharma Tech + rede laboratórios especializados'
    },
    {
      id: 'case-3',
      title: 'Inovação: Cristália + Universidades',
      description: 'Parceria com USP resultou em 5 patentes e 2 produtos inovadores',
      learning: 'Academia + indústria = inovação sustentável',
      replication: 'MediCorp + centros de pesquisa'
    }
  ],

  metrics: {
    totalUsers: 2456,
    activeCompanies: 156,
    activeLaboratories: 89,
    activeConsultants: 234,
    completedProjects: 78,
    successfulMatches: 445,
    avgMatchScore: 89.2,
    platformUptime: 99.7,
    avgProjectValue: 485000,
    marketGrowth: '23%',
    customerSatisfaction: 4.7,
    timeToMatch: '1.2s'
  }
};

// API expandida para simulações realísticas
export const demoAPI = {
  aiMatching: async (userType: string, preferences: any) => {
    // Simular processamento de IA mais realístico
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    const matches = [];
    const { companies, laboratories, consultants } = demoData;
    
    if (userType === 'pharmaceutical_company') {
      // Lógica de matching mais sofisticada baseada em cenários reais
      laboratories.forEach((lab, index) => {
        const baseScore = 0.75 + (Math.random() * 0.23);
        const locationBonus = preferences.location && lab.location.includes(preferences.location) ? 0.1 : 0;
        const specialtyBonus = preferences.specialties && 
          lab.specializations.some(spec => preferences.specialties.includes(spec)) ? 0.15 : 0;
        
        const finalScore = Math.min(0.98, baseScore + locationBonus + specialtyBonus);
        
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
          major_clients: lab.major_clients?.slice(0, 2) || [],
          compatibility_factors: [
            'Certificações compatíveis',
            'Expertise na área solicitada',
            'Histórico de projetos similares',
            'Capacidade disponível',
            'Localização estratégica'
          ].filter((_, i) => finalScore > 0.8 || i < 3)
        });
      });
      
      consultants.forEach((consultant, index) => {
        const baseScore = 0.70 + (Math.random() * 0.28);
        const expertiseBonus = preferences.specialties && 
          consultant.expertise.some(exp => preferences.specialties.some(pref => exp.toLowerCase().includes(pref.toLowerCase()))) ? 0.2 : 0;
        
        const finalScore = Math.min(0.98, baseScore + expertiseBonus);
        
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
          compatibility_factors: [
            'Expertise regulatória comprovada',
            'Experiência em projetos similares',
            'Taxa de sucesso elevada',
            'Disponibilidade imediata',
            'Certificações relevantes'
          ].filter((_, i) => finalScore > 0.85 || i < 3)
        });
      });
    }
    
    // Simular cenários de mercado
    const activeScenario = demoData.market_scenarios[Math.floor(Math.random() * demoData.market_scenarios.length)];
    
    return {
      success: true,
      matches: matches.sort((a, b) => b.score - a.score).slice(0, 8),
      market_context: {
        active_scenario: activeScenario.name,
        market_trend: activeScenario.impact,
        recommendations: activeScenario.opportunities.slice(0, 2)
      },
      processing_time: '1.2s',
      algorithm_version: 'enhanced_ai_v2.1'
    };
  },

  getMetrics: () => ({
    ...demoData.metrics,
    last_updated: new Date().toISOString(),
    market_scenarios_active: demoData.market_scenarios.length,
    partnership_cases: demoData.partnership_cases.length
  }),
  
  getProjects: () => demoData.projects.map(project => ({
    ...project,
    estimated_roi: `${Math.floor(Math.random() * 200 + 100)}%`,
    risk_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    success_probability: `${Math.floor(Math.random() * 30 + 70)}%`
  })),
  
  searchEntities: (query: string, type?: string) => {
    const allEntities = [
      ...demoData.companies.map(c => ({ ...c, entity_type: 'company' })),
      ...demoData.laboratories.map(l => ({ ...l, entity_type: 'laboratory' })),
      ...demoData.consultants.map(c => ({ ...c, entity_type: 'consultant' }))
    ];
    
    return allEntities.filter(entity => 
      entity.name.toLowerCase().includes(query.toLowerCase()) &&
      (!type || entity.entity_type === type)
    );
  },

  getMarketInsights: () => ({
    scenarios: demoData.market_scenarios,
    partnership_cases: demoData.partnership_cases,
    trends: [
      { name: 'Biosimilares', growth: '+45%', confidence: 'high' },
      { name: 'Medicina Personalizada', growth: '+32%', confidence: 'medium' },
      { name: 'Genéricos Complexos', growth: '+28%', confidence: 'high' },
      { name: 'Terapias Celulares', growth: '+67%', confidence: 'medium' }
    ],
    recommendations: [
      'Investir em parcerias para biosimilares',
      'Desenvolver capacidades em análises complexas',
      'Fortalecer compliance regulatório',
      'Explorar oportunidades internacionais'
    ]
  })
};
