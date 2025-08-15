
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
