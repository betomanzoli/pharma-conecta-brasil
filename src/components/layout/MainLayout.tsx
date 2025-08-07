
import React from 'react';
import PersistentNavigation from './PersistentNavigation';
import UniversalDemoBanner from './UniversalDemoBanner';
import { useAuth } from '@/contexts/AuthContext';
import { isDemoMode } from '@/utils/demoMode';

interface MainLayoutProps {
  children: React.ReactNode;
  showDemoIndicator?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showDemoIndicator = true 
}) => {
  const { user } = useAuth();
  const isDemo = isDemoMode();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      {showDemoIndicator && isDemo && (
        <UniversalDemoBanner variant="minimal" className="border-b" />
      )}
      <PersistentNavigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
