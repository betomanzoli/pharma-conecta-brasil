
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMobile } from '@/hooks/use-mobile';
import MobileHeader from './MobileHeader';
import MobileNavigation from './MobileNavigation';
import PullToRefresh from './PullToRefresh';
import TouchGestures from './TouchGestures';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showNavigation?: boolean;
  enablePullToRefresh?: boolean;
  enableGestures?: boolean;
  onRefresh?: () => Promise<void>;
  headerProps?: {
    showMenu?: boolean;
    showBack?: boolean;
    rightAction?: React.ReactNode;
  };
}

const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({
  children,
  title = 'PharmaConnect Brasil',
  showHeader = true,
  showNavigation = true,
  enablePullToRefresh = false,
  enableGestures = false,
  onRefresh,
  headerProps = {}
}) => {
  const { user, profile, signOut } = useAuth();
  const isMobile = useMobile();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  const handleNavigate = () => {
    setIsNavigationOpen(false);
  };

  const content = (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && (
        <MobileHeader
          title={title}
          showMenu={headerProps.showMenu && showNavigation}
          showBack={headerProps.showBack}
          rightAction={headerProps.rightAction}
          onMenuClick={() => setIsNavigationOpen(true)}
        />
      )}

      <main className="flex-1 overflow-auto">
        {enablePullToRefresh && onRefresh ? (
          <PullToRefresh onRefresh={onRefresh}>
            {children}
          </PullToRefresh>
        ) : (
          children
        )}
      </main>

      {showNavigation && (
        <Sheet open={isNavigationOpen} onOpenChange={setIsNavigationOpen}>
          <SheetContent side="left" className="p-0 w-80">
            <MobileNavigation
              user={user}
              profile={profile}
              onNavigate={handleNavigate}
              onSignOut={signOut}
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );

  if (enableGestures) {
    return <TouchGestures>{content}</TouchGestures>;
  }

  return content;
};

export default MobileOptimizedLayout;
