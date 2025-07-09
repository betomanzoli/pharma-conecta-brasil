import React, { useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface TouchGesturesProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  className?: string;
  enabled?: boolean;
}

const TouchGestures: React.FC<TouchGesturesProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onDoubleTap,
  onLongPress,
  className = '',
  enabled = true
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialPinchDistanceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;

    const getDistance = (touch1: Touch, touch2: Touch) => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const now = Date.now();
      
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: now
      };

      // Handle double tap
      if (onDoubleTap && now - lastTapRef.current < 300) {
        onDoubleTap();
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;

      // Handle long press
      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          onLongPress();
          // Vibrate if available
          if ('vibrate' in navigator) {
            navigator.vibrate(50);
          }
        }, 500);
      }

      // Handle pinch start
      if (e.touches.length === 2 && onPinch) {
        initialPinchDistanceRef.current = getDistance(e.touches[0], e.touches[1]);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Clear long press timer on move
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      // Handle pinch
      if (e.touches.length === 2 && onPinch && initialPinchDistanceRef.current) {
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const scale = currentDistance / initialPinchDistanceRef.current;
        onPinch(scale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      if (!touchStartRef.current || e.touches.length > 0) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      
      const minSwipeDistance = 50;
      const maxSwipeTime = 500;
      
      // Only process swipes if they're fast enough and long enough
      if (deltaTime < maxSwipeTime) {
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        if (absDeltaX > minSwipeDistance && absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } else if (absDeltaY > minSwipeDistance && absDeltaY > absDeltaX) {
          // Vertical swipe
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }

      touchStartRef.current = null;
      initialPinchDistanceRef.current = null;
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [enabled, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPinch, onDoubleTap, onLongPress]);

  return (
    <div 
      ref={elementRef} 
      className={className}
      style={{ touchAction: 'manipulation' }}
    >
      {children}
    </div>
  );
};

export default TouchGestures;