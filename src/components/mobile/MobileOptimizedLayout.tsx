import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileHeader from './MobileHeader';
import MobileNavigation from './MobileNavigation';
import PullToRefresh from './PullToRefresh';
import TouchGestures from './TouchGestures';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  title: string;
  showHeader?: boolean;
  showNavigation?: boolean;
  enablePullToRefresh?: boolean;
  enableGestures?: boolean;
  onRefresh?: () => Promise<void>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  headerProps?: {
    showBack?: boolean;
    onBack?: () => void;
    showMenu?: boolean;
    onMenuClick?: () => void;
    rightAction?: React.ReactNode;
  };
}

const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({
  children,
  title,
  showHeader = true,
  showNavigation = true,
  enablePullToRefresh = true,
  enableGestures = true,
  onRefresh,
  onSwipeLeft,
  onSwipeRight,
  className = '',
  headerProps = {}
}) => {
  const isMobile = useIsMobile();

  const defaultRefresh = async () => {
    // Default refresh behavior
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Atualizado!', {
      description: 'Conteúdo atualizado com sucesso.'
    });
  };

  const handleRefresh = onRefresh || defaultRefresh;

  const handleSwipeLeft = () => {
    if (onSwipeLeft) {
      onSwipeLeft();
    } else {
      // Default behavior - could navigate forward or show options
      toast.info('Deslize detectado', {
        description: 'Deslizou para a esquerda'
      });
    }
  };

  const handleSwipeRight = () => {
    if (onSwipeRight) {
      onSwipeRight();
    } else {
      // Default behavior - could navigate back
      toast.info('Deslize detectado', {
        description: 'Deslizou para a direita'
      });
    }
  };

  const content = (
    <div className={cn(
      'min-h-screen bg-background',
      isMobile && 'pb-16', // Space for mobile navigation
      className
    )}>
      {/* Mobile Header */}
      {isMobile && showHeader && (
        <MobileHeader
          title={title}
          {...headerProps}
        />
      )}

      {/* Main Content */}
      <main className={cn(
        'flex-1',
        isMobile && showHeader && 'pt-20', // Space for mobile header
        !isMobile && 'container mx-auto px-4 py-8'
      )}>
        {enablePullToRefresh && isMobile ? (
          <PullToRefresh
            onRefresh={handleRefresh}
            className="h-full"
          >
            {children}
          </PullToRefresh>
        ) : (
          children
        )}
      </main>

      {/* Mobile Navigation */}
      {isMobile && showNavigation && <MobileNavigation />}
    </div>
  );

  // Wrap with touch gestures if enabled and on mobile
  if (enableGestures && isMobile) {
    return (
      <TouchGestures
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        className="min-h-screen"
      >
        {content}
      </TouchGestures>
    );
  }

  return content;
};

export default MobileOptimizedLayout;