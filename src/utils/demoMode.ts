
// Sistema de gerenciamento de modo demo
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

// Dados demo estruturados para testes
export const demoData = {
  companies: [
    {
      id: 'demo-company-1',
      name: 'BioFarma Solutions',
      expertise_area: ['Biotecnologia', 'Medicamentos Genéricos'],
      city: 'São Paulo',
      state: 'SP',
      description: 'Empresa líder em desenvolvimento de medicamentos biotecnológicos',
      industrial_segment: 'pharmaceutical_company'
    },
    {
      id: 'demo-company-2',
      name: 'Pharma Tech Brasil',
      expertise_area: ['Desenvolvimento Clínico', 'Regulatório'],
      city: 'Rio de Janeiro',
      state: 'RJ',
      description: 'Especializada em desenvolvimento e registro de medicamentos',
      industrial_segment: 'pharmaceutical_company'
    },
    {
      id: 'demo-company-3',
      name: 'MediCorp Inovação',
      expertise_area: ['Pesquisa Clínica', 'Farmacologia'],
      city: 'Belo Horizonte',
      state: 'MG',
      description: 'Focada em pesquisa e desenvolvimento farmacêutico',
      industrial_segment: 'pharmaceutical_company'
    }
  ],
  
  laboratories: [
    {
      id: 'demo-lab-1',
      name: 'LabAnalise Avançado',
      certifications: ['ISO 17025', 'ANVISA', 'INMETRO'],
      location: 'São Paulo, SP',
      specializations: ['Análise Microbiológica', 'Controle de Qualidade'],
      description: 'Laboratório especializado em análises farmacêuticas'
    },
    {
      id: 'demo-lab-2',
      name: 'Centro de Análises Farmacêuticas',
      certifications: ['ISO 17025', 'ANVISA'],
      location: 'Campinas, SP',
      specializations: ['Análise Físico-Química', 'Estabilidade'],
      description: 'Centro especializado em análises de estabilidade'
    },
    {
      id: 'demo-lab-3',
      name: 'Instituto de Bioequivalência',
      certifications: ['ANVISA', 'FDA', 'EMA'],
      location: 'São Paulo, SP',
      specializations: ['Bioequivalência', 'Farmacocinética'],
      description: 'Instituto focado em estudos de bioequivalência'
    }
  ],

  consultants: [
    {
      id: 'demo-consultant-1',
      name: 'Dr. Maria Santos',
      expertise: ['Regulatório ANVISA', 'Registro de Medicamentos'],
      location: 'Brasília, DF',
      description: 'Consultora especialista em regulamentações ANVISA'
    },
    {
      id: 'demo-consultant-2',
      name: 'Dr. João Silva',
      expertise: ['Desenvolvimento Clínico', 'Boas Práticas'],
      location: 'São Paulo, SP',
      description: 'Consultor em desenvolvimento clínico e GCP'
    }
  ],

  projects: [
    {
      id: 'demo-project-1',
      name: 'Desenvolvimento de Genérico Anti-hipertensivo',
      status: 'in_progress',
      phase: 'clinical_development',
      partners: ['BioFarma Solutions', 'LabAnalise Avançado'],
      timeline: '8 meses',
      budget: 450000,
      progress: 65
    },
    {
      id: 'demo-project-2',
      name: 'Registro de Medicamento Biotecnológico',
      status: 'planning',
      phase: 'regulatory',
      partners: ['Pharma Tech Brasil', 'Dr. Maria Santos'],
      timeline: '12 meses',
      budget: 280000,
      progress: 25
    }
  ],

  metrics: {
    totalUsers: 156,
    activeCompanies: 23,
    activeLaboratories: 18,
    activeConsultants: 12,
    completedProjects: 8,
    successfulMatches: 34,
    avgMatchScore: 87,
    platformUptime: 99.2
  }
};

// Mock API para demo
export const demoAPI = {
  aiMatching: async (userType: string, preferences: any) => {
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const matches = [];
    const { companies, laboratories, consultants } = demoData;
    
    if (userType === 'pharmaceutical_company') {
      // Simular matches para empresas farmacêuticas
      laboratories.forEach((lab, index) => {
        const score = 0.85 + (Math.random() * 0.13); // 85-98%
        matches.push({
          id: lab.id,
          name: lab.name,
          type: 'laboratory',
          score,
          specialties: lab.specializations,
          location: lab.location,
          verified: true,
          compatibility_factors: [
            'Certificações compatíveis',
            'Localização estratégica',
            'Especialização na área',
            'Histórico de qualidade'
          ]
        });
      });
      
      consultants.forEach(consultant => {
        const score = 0.80 + (Math.random() * 0.18);
        matches.push({
          id: consultant.id,
          name: consultant.name,
          type: 'consultant',
          score,
          specialties: consultant.expertise,
          location: consultant.location,
          verified: true,
          compatibility_factors: [
            'Expertise regulatória',
            'Experiência comprovada',
            'Localização conveniente'
          ]
        });
      });
    }
    
    return {
      success: true,
      matches: matches.sort((a, b) => b.score - a.score).slice(0, 6)
    };
  },

  getMetrics: () => demoData.metrics,
  
  getProjects: () => demoData.projects,
  
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
  }
};
