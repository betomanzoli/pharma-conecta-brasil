
import React from 'react';
import PersistentNavigation from './PersistentNavigation';
import DemoModeIndicator from './DemoModeIndicator';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
  showDemoIndicator?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showDemoIndicator = true 
}) => {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      {showDemoIndicator && <DemoModeIndicator variant="banner" />}
      <PersistentNavigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
