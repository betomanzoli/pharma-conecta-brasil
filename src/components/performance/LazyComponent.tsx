
import React, { Suspense, ComponentType } from 'react';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyComponentProps {
  component: ComponentType<any>;
  fallback?: React.ReactNode;
  props?: any;
  className?: string;
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  component: Component,
  fallback,
  props = {},
  className = ''
}) => {
  const { elementRef, isIntersecting } = useLazyLoading();

  const defaultFallback = (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );

  return (
    <div ref={elementRef} className={className}>
      {isIntersecting ? (
        <Suspense fallback={fallback || defaultFallback}>
          <Component {...props} />
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
};

export default LazyComponent;
