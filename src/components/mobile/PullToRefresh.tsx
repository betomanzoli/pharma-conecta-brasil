import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  refreshThreshold?: number;
  className?: string;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  disabled = false,
  refreshThreshold = 80,
  className = ''
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!containerRef.current || disabled) return;

    const container = containerRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0 && !isRefreshing) {
        startYRef.current = e.touches[0].clientY;
        isDraggingRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startYRef.current;

      if (diff > 0 && container.scrollTop === 0) {
        e.preventDefault();
        
        // Apply resistance to make the pull feel natural
        const resistance = Math.min(diff * 0.5, refreshThreshold * 1.5);
        setPullDistance(resistance);
        setCanRefresh(resistance >= refreshThreshold);
      }
    };

    const handleTouchEnd = async () => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;

      if (canRefresh && !isRefreshing) {
        setIsRefreshing(true);
        
        // Add vibration feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }

        try {
          await onRefresh();
        } catch (error) {
          console.error('Error during refresh:', error);
        } finally {
          setIsRefreshing(false);
        }
      }

      setPullDistance(0);
      setCanRefresh(false);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, canRefresh, isRefreshing, onRefresh, refreshThreshold]);

  const getRefreshIndicatorStyle = () => {
    const progress = Math.min(pullDistance / refreshThreshold, 1);
    const opacity = Math.min(pullDistance / 30, 1);
    const scale = Math.min(0.6 + (progress * 0.4), 1);
    
    return {
      transform: `translateY(${Math.min(pullDistance - 40, 40)}px) scale(${scale})`,
      opacity: opacity
    };
  };

  const getRefreshTextStyle = () => {
    const opacity = Math.min(pullDistance / 40, 1);
    return {
      transform: `translateY(${Math.min(pullDistance - 20, 20)}px)`,
      opacity: opacity
    };
  };

  return (
    <div 
      ref={containerRef}
      className={cn('relative overflow-auto', className)}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Pull to Refresh Indicator */}
      <div className="absolute top-0 left-0 right-0 z-10 flex flex-col items-center justify-center h-20 pointer-events-none">
        <div 
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200",
            canRefresh ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            isRefreshing && "bg-primary text-primary-foreground"
          )}
          style={getRefreshIndicatorStyle()}
        >
          <RefreshCw 
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              (isRefreshing || canRefresh) && "animate-spin"
            )} 
          />
        </div>
        
        <div 
          className="text-xs font-medium text-muted-foreground mt-1 transition-all duration-200"
          style={getRefreshTextStyle()}
        >
          {isRefreshing 
            ? 'Atualizando...' 
            : canRefresh 
              ? 'Solte para atualizar' 
              : 'Puxe para atualizar'
          }
        </div>
      </div>

      {/* Content */}
      <div 
        className="transition-transform duration-200 ease-out"
        style={{ 
          transform: `translateY(${isRefreshing ? 60 : Math.min(pullDistance * 0.3, 20)}px)` 
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;