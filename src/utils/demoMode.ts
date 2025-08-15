
// Sistema de gerenciamento robusto de modo demo vs real
export const isDemoMode = () => {
  // Verificar múltiplas formas de ativar demo
  const urlPath = window.location.pathname.startsWith('/demo');
  const urlParam = window.location.search.includes('demo=true');
  const localStorage = window.localStorage.getItem('demo_mode') === 'true';
  const hostDemo = window.location.hostname.includes('demo');
  
  return urlPath || urlParam || localStorage || hostDemo;
};

export const setDemoMode = (enabled: boolean) => {
  if (enabled) {
    localStorage.setItem('demo_mode', 'true');
  } else {
    localStorage.removeItem('demo_mode');
  }
  // Recarregar página para aplicar mudanças
  window.location.reload();
};

export const toggleDemoMode = () => {
  const current = isDemoMode();
  setDemoMode(!current);
};

// Dados demo estruturados e realísticos
export const demoData = {
  companies: [
    {
      id: 'demo-company-1',
      name: 'BioFarma Solutions',
      expertise_area: ['Biotecnologia', 'Medicamentos Genéricos'],
      city: 'São Paulo',
      state: 'SP',
      description: 'Empresa líder em desenvolvimento de medicamentos biotecnológicos',
      industrial_segment: 'pharmaceutical_company',
      cnpj: '12.345.678/0001-90',
      employees: 150,
      revenue: 45000000
    },
    {
      id: 'demo-company-2',
      name: 'Pharma Tech Brasil',
      expertise_area: ['Desenvolvimento Clínico', 'Regulatório'],
      city: 'Rio de Janeiro',
      state: 'RJ',
      description: 'Especializada em desenvolvimento e registro de medicamentos',
      industrial_segment: 'pharmaceutical_company',
      cnpj: '98.765.432/0001-10',
      employees: 200,
      revenue: 67000000
    },
    {
      id: 'demo-company-3',
      name: 'MediCorp Inovação',
      expertise_area: ['Pesquisa Clínica', 'Farmacologia'],
      city: 'Belo Horizonte',
      state: 'MG',
      description: 'Focada em pesquisa e desenvolvimento farmacêutico',
      industrial_segment: 'pharmaceutical_company',
      cnpj: '55.444.333/0001-22',
      employees: 80,
      revenue: 23000000
    }
  ],
  
  laboratories: [
    {
      id: 'demo-lab-1',
      name: 'LabAnalise Avançado',
      certifications: ['ISO 17025', 'ANVISA', 'INMETRO'],
      location: 'São Paulo, SP',
      specializations: ['Análise Microbiológica', 'Controle de Qualidade'],
      description: 'Laboratório especializado em análises farmacêuticas',
      capacity: 500,
      turnaround_time: '5-7 dias'
    },
    {
      id: 'demo-lab-2',
      name: 'Centro de Análises Farmacêuticas',
      certifications: ['ISO 17025', 'ANVISA'],
      location: 'Campinas, SP',
      specializations: ['Análise Físico-Química', 'Estabilidade'],
      description: 'Centro especializado em análises de estabilidade',
      capacity: 300,
      turnaround_time: '7-10 dias'
    }
  ],

  consultants: [
    {
      id: 'demo-consultant-1',
      name: 'Dr. Maria Santos',
      expertise: ['Regulatório ANVISA', 'Registro de Medicamentos'],
      location: 'Brasília, DF',
      description: 'Consultora especialista em regulamentações ANVISA',
      experience_years: 15,
      hourly_rate: 350
    },
    {
      id: 'demo-consultant-2',
      name: 'Dr. João Silva',
      expertise: ['Desenvolvimento Clínico', 'Boas Práticas'],
      location: 'São Paulo, SP',
      description: 'Consultor em desenvolvimento clínico e GCP',
      experience_years: 12,
      hourly_rate: 280
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
      progress: 65,
      created_at: '2024-01-15'
    },
    {
      id: 'demo-project-2',
      name: 'Registro de Medicamento Biotecnológico',
      status: 'planning',
      phase: 'regulatory',
      partners: ['Pharma Tech Brasil', 'Dr. Maria Santos'],
      timeline: '12 meses',
      budget: 280000,
      progress: 25,
      created_at: '2024-02-20'
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
    platformUptime: 99.2,
    monthlyGrowth: 15.3,
    revenue: 125000
  },

  notifications: [
    {
      id: 'demo-notif-1',
      title: 'Nova mensagem de parceiro',
      message: 'LabAnalise Avançado enviou uma proposta para seu projeto',
      type: 'partnership',
      created_at: '2024-01-10T10:30:00Z',
      read: false
    },
    {
      id: 'demo-notif-2',
      title: 'Atualização regulatória ANVISA',
      message: 'Nova resolução sobre medicamentos genéricos publicada',
      type: 'regulatory',
      created_at: '2024-01-09T14:15:00Z',
      read: false
    }
  ]
};

// Mock API melhorado para demo
export const demoAPI = {
  aiMatching: async (userType: string, preferences: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const matches = [];
    const { companies, laboratories, consultants } = demoData;
    
    if (userType === 'pharmaceutical_company') {
      laboratories.forEach((lab) => {
        const score = 0.85 + (Math.random() * 0.13);
        matches.push({
          id: lab.id,
          name: lab.name,
          type: 'laboratory',
          score,
          specialties: lab.specializations,
          location: lab.location,
          verified: true,
          capacity: lab.capacity,
          turnaround_time: lab.turnaround_time,
          compatibility_factors: [
            'Certificações compatíveis',
            'Localização estratégica',
            'Especialização na área',
            'Capacidade adequada'
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
          experience_years: consultant.experience_years,
          hourly_rate: consultant.hourly_rate,
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
  getNotifications: () => demoData.notifications,
  
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

  // Simular chamadas de API reais
  uploadDocument: async (file: File) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, url: `demo-uploads/${file.name}`, id: `demo-${Date.now()}` };
  },

  downloadDocument: async (docId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, url: `demo-downloads/${docId}.pdf` };
  }
};

// Estados vazios para modo real
export const realEmptyStates = {
  companies: [],
  laboratories: [],
  consultants: [],
  projects: [],
  metrics: {
    totalUsers: 0,
    activeCompanies: 0,
    activeLaboratories: 0,
    activeConsultants: 0,
    completedProjects: 0,
    successfulMatches: 0,
    avgMatchScore: 0,
    platformUptime: 100,
    monthlyGrowth: 0,
    revenue: 0
  },
  notifications: []
};
