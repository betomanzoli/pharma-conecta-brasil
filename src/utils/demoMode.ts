import React from 'react';

// Demo mode utility functions
export const isDemoMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('pharmaconnect-demo-mode') === 'true';
};

export const setDemoMode = (isDemo: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('pharmaconnect-demo-mode', isDemo.toString());
  // Trigger a custom event so components can react to the change
  window.dispatchEvent(new CustomEvent('demo-mode-changed', { detail: { isDemo } }));
  // Force a page reload to ensure all components update
  window.location.reload();
};

export const toggleDemoMode = (): void => {
  const currentMode = isDemoMode();
  setDemoMode(!currentMode);
};

// Hook for components that need to react to demo mode changes
export const useDemoMode = () => {
  const [isDemo, setIsDemo] = React.useState(isDemoMode());

  React.useEffect(() => {
    const handleModeChange = (event: CustomEvent) => {
      setIsDemo(event.detail.isDemo);
    };

    window.addEventListener('demo-mode-changed', handleModeChange as EventListener);
    
    return () => {
      window.removeEventListener('demo-mode-changed', handleModeChange as EventListener);
    };
  }, []);

  return isDemo;
};

// Demo data for testing
export const demoData = {
  user: {
    id: 'demo-user-1',
    email: 'demo@pharmaconnect.com.br',
    first_name: 'João',
    last_name: 'Silva',
    user_type: 'company'
  },
  analytics: {
    activeProjects: 12,
    totalProjects: 45,
    completedProjects: 33,
    complianceScore: 94,
    pendingApprovals: 3,
    monthlyGrowth: 15
  },
  projects: [
    {
      id: 'proj-1',
      name: 'Registro de Medicamento Genérico',
      status: 'active',
      progress: 75,
      deadline: '2024-12-15'
    },
    {
      id: 'proj-2', 
      name: 'Análise de Bioequivalência',
      status: 'review',
      progress: 45,
      deadline: '2024-11-30'
    },
    {
      id: 'proj-3',
      name: 'Validação de Processo Produtivo',
      status: 'active',
      progress: 90,
      deadline: '2024-10-22'
    }
  ],
  consultants: [
    {
      name: 'Dr. Maria Santos',
      specialization: 'Assuntos Regulatórios',
      rating: 4.9,
      location: 'São Paulo, SP',
      avatar: '',
      expertise: ['ANVISA', 'Registro de Medicamentos', 'Farmacovigilância', 'GMP']
    },
    {
      name: 'Dr. Carlos Oliveira',
      specialization: 'Desenvolvimento Analítico',
      rating: 4.8,
      location: 'Rio de Janeiro, RJ',
      avatar: '',
      expertise: ['Validação Analítica', 'HPLC', 'Bioanalítica', 'ICH Guidelines']
    },
    {
      name: 'Dra. Ana Costa',
      specialization: 'Qualidade e Compliance',
      rating: 4.9,
      location: 'Belo Horizonte, MG',
      avatar: '',
      expertise: ['ISO 13485', 'Auditoria', 'Sistemas da Qualidade', 'CAPA']
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      title: 'Documento aprovado',
      message: 'Seu protocolo de validação foi aprovado pela equipe técnica.',
      type: 'info',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 'notif-2',
      title: 'Prazo próximo',
      message: 'O projeto "Análise de Bioequivalência" vence em 7 dias.',
      type: 'warning', 
      created_at: '2024-01-14T14:22:00Z'
    },
    {
      id: 'notif-3',
      title: 'Nova mensagem',
      message: 'Dr. Maria Santos enviou uma nova mensagem sobre seu projeto.',
      type: 'info',
      created_at: '2024-01-13T09:15:00Z'
    }
  ]
};
