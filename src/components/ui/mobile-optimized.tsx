import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const MobileOptimized: React.FC<MobileOptimizedProps> = ({
  children,
  fallback,
  className,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      'mobile-optimized',
      isMobile ? 'mobile-view' : 'desktop-view',
      className
    )}>
      {isMobile && fallback ? fallback : children}
    </div>
  );
};

interface TouchFriendlyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const TouchFriendlyButton: React.FC<TouchFriendlyButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
}) => {
  const isMobile = useIsMobile();

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-700',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-700',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
  };

  const sizeClasses = {
    sm: isMobile ? 'min-h-[44px] px-4 text-sm' : 'h-8 px-3 text-xs',
    md: isMobile ? 'min-h-[48px] px-6 text-base' : 'h-10 px-4 text-sm',
    lg: isMobile ? 'min-h-[52px] px-8 text-lg' : 'h-12 px-8 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-all duration-200 touch-manipulation',
        'disabled:opacity-50 disabled:pointer-events-none',
        'shadow-sm hover:shadow-pharma',
        isMobile && 'active:scale-95',
        !isMobile && 'hover:-translate-y-0.5',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
};

interface SwipeGestureProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  className?: string;
}

export const SwipeGesture: React.FC<SwipeGestureProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className,
}) => {
  const [touchStart, setTouchStart] = React.useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > threshold;
    const isRightSwipe = distanceX < -threshold;
    const isUpSwipe = distanceY > threshold;
    const isDownSwipe = distanceY < -threshold;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
      if (isRightSwipe && onSwipeRight) onSwipeRight();
    } else {
      if (isUpSwipe && onSwipeUp) onSwipeUp();
      if (isDownSwipe && onSwipeDown) onSwipeDown();
    }
  };

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 70,
  className,
}) => {
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [startY, setStartY] = React.useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY > 0) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    if (distance > 0) {
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
  };

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      className={cn('relative', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pullDistance > 0 && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-primary-50 transition-all duration-200"
          style={{ height: `${pullDistance}px` }}
        >
          <div className={cn(
            'text-primary-600 text-sm font-medium transition-opacity duration-200',
            progress >= 1 ? 'opacity-100' : 'opacity-70'
          )}>
            {isRefreshing ? 'Atualizando...' : progress >= 1 ? 'Solte para atualizar' : 'Puxe para atualizar'}
          </div>
        </div>
      )}
      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  );
};