
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
    id: 'demo-user-123',
    email: 'demo@pharmaconnect.com',
    first_name: 'João',
    last_name: 'Silva',
    user_type: 'pharmaceutical_company'
  },
  projects: [
    {
      id: '1',
      name: 'Desenvolvimento Genérico XYZ',
      status: 'active',
      progress: 65,
      deadline: '2024-12-31',
      type: 'generic_development'
    },
    {
      id: '2',
      name: 'Registro ANVISA - Produto ABC',
      status: 'review',
      progress: 80,
      deadline: '2024-10-15',
      type: 'regulatory_submission'
    }
  ],
  analytics: {
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    pendingApprovals: 3,
    monthlyGrowth: 15.5,
    complianceScore: 94
  },
  notifications: [
    {
      id: '1',
      title: 'Deadline Approaching',
      message: 'Projeto XYZ precisa ser finalizado em 5 dias',
      type: 'warning',
      read: false,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Aprovação ANVISA',
      message: 'Produto ABC foi aprovado pela ANVISA',
      type: 'success',
      read: false,
      created_at: new Date().toISOString()
    }
  ],
  aiAgents: {
    businessStrategist: {
      active: true,
      lastRun: '2024-01-15T10:30:00Z',
      suggestions: 3
    },
    technicalRegulatory: {
      active: true,
      lastRun: '2024-01-15T09:15:00Z',
      suggestions: 5
    },
    projectAnalyst: {
      active: true,
      lastRun: '2024-01-15T11:45:00Z',
      suggestions: 2
    }
  }
};
