
import { useState, useEffect, useRef } from 'react';

interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useLazyLoading = (options: LazyLoadOptions = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element || (triggerOnce && hasLoaded)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && triggerOnce) {
          setHasLoaded(true);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasLoaded]);

  return {
    elementRef,
    isIntersecting: triggerOnce ? (hasLoaded || isIntersecting) : isIntersecting,
    hasLoaded
  };
};
