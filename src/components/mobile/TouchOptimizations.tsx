
import React, { useRef, useEffect } from 'react';

interface TouchOptimizationsProps {
  children: React.ReactNode;
  enableFastTap?: boolean;
  enableSwipeGestures?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

const TouchOptimizations: React.FC<TouchOptimizationsProps> = ({
  children,
  enableFastTap = true,
  enableSwipeGestures = false,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Otimizações de CSS para touch
    container.style.touchAction = enableSwipeGestures ? 'manipulation' : 'auto';
    container.style.webkitTouchCallout = 'none';
    container.style.webkitTapHighlightColor = 'transparent';

    if (enableFastTap) {
      // Implementar FastClick-like behavior
      const handleTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };
      };

      const handleTouchEnd = (e: TouchEvent) => {
        if (!touchStartRef.current) return;

        const touch = e.changedTouches[0];
        touchEndRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };

        const deltaX = Math.abs(touchEndRef.current.x - touchStartRef.current.x);
        const deltaY = Math.abs(touchEndRef.current.y - touchStartRef.current.y);
        const deltaTime = touchEndRef.current.time - touchStartRef.current.time;

        // Se foi um tap rápido e preciso
        if (deltaTime < 200 && deltaX < 10 && deltaY < 10) {
          const target = e.target as HTMLElement;
          if (target && (target.tagName === 'BUTTON' || target.onclick || target.getAttribute('role') === 'button')) {
            e.preventDefault();
            
            // Trigger click imediatamente
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            });
            target.dispatchEvent(clickEvent);
          }
        }

        // Handle swipe gestures
        if (enableSwipeGestures && deltaTime < 300) {
          const minSwipeDistance = 50;
          
          if (deltaX > minSwipeDistance && deltaX > deltaY) {
            // Horizontal swipe
            if (touchEndRef.current.x > touchStartRef.current.x) {
              onSwipeRight?.();
            } else {
              onSwipeLeft?.();
            }
          } else if (deltaY > minSwipeDistance && deltaY > deltaX) {
            // Vertical swipe
            if (touchEndRef.current.y > touchStartRef.current.y) {
              onSwipeDown?.();
            } else {
              onSwipeUp?.();
            }
          }
        }

        touchStartRef.current = null;
        touchEndRef.current = null;
      };

      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: false });

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [enableFastTap, enableSwipeGestures, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return (
    <div
      ref={containerRef}
      className="touch-optimization-container"
      style={{
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: enableSwipeGestures ? 'manipulation' : 'auto'
      }}
    >
      {children}
    </div>
  );
};

export default TouchOptimizations;
