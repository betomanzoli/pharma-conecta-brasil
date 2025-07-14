import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'accent' | 'muted';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantMap = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  muted: 'text-muted-foreground',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
}) => {
  return (
    <Loader2
      className={cn(
        'animate-spin',
        sizeMap[size],
        variantMap[variant],
        className
      )}
    />
  );
};

interface LoadingStateProps {
  message?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'accent' | 'muted';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Carregando...',
  description,
  size = 'md',
  variant = 'primary',
  className,
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center space-y-4 p-8',
      className
    )}>
      <LoadingSpinner size={size === 'sm' ? 'lg' : 'xl'} variant={variant} />
      <div className="text-center space-y-2">
        <p className={cn(
          'font-medium',
          size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base',
          variantMap[variant]
        )}>
          {message}
        </p>
        {description && (
          <p className={cn(
            'text-muted-foreground',
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Processando...',
  className,
}) => {
  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      'bg-background/80 backdrop-blur-sm',
      className
    )}>
      <div className="bg-card rounded-lg shadow-pharma-lg p-8 border">
        <LoadingState message={message} size="lg" />
      </div>
    </div>
  );
};

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  loading,
  children,
  loadingText,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'bg-primary text-primary-foreground hover:bg-primary-700',
        'px-4 py-2 rounded-lg font-medium transition-all duration-200',
        'shadow-sm hover:shadow-pharma transform hover:-translate-y-0.5',
        'disabled:opacity-50 disabled:pointer-events-none disabled:transform-none',
        className
      )}
    >
      {loading && <LoadingSpinner size="sm" variant="muted" />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
};