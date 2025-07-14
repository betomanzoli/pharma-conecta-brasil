import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface EnhancedToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: {
    background: 'bg-secondary-50 border-secondary-200',
    icon: 'text-secondary-600',
    title: 'text-secondary-900',
    description: 'text-secondary-700',
  },
  error: {
    background: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
    description: 'text-red-700',
  },
  warning: {
    background: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-600',
    title: 'text-yellow-900',
    description: 'text-yellow-700',
  },
  info: {
    background: 'bg-primary-50 border-primary-200',
    icon: 'text-primary-600',
    title: 'text-primary-900',
    description: 'text-primary-700',
  },
};

export const EnhancedToast: React.FC<EnhancedToastProps> = ({
  id,
  type,
  title,
  description,
  dismissible = true,
  action,
  onDismiss,
}) => {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-lg border shadow-sm',
        'animate-slide-up',
        colors.background
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', colors.icon)} />
      
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium', colors.title)}>
          {title}
        </p>
        {description && (
          <p className={cn('mt-1 text-sm', colors.description)}>
            {description}
          </p>
        )}
        
        {action && (
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={action.onClick}
              className="text-xs"
            >
              {action.label}
            </Button>
          </div>
        )}
      </div>

      {dismissible && (
        <button
          onClick={() => onDismiss(id)}
          className={cn(
            'flex-shrink-0 rounded-md p-1.5',
            'hover:bg-black/5 transition-colors',
            colors.icon
          )}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

interface ToastContainerProps {
  toasts: EnhancedToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const positionMap = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
}) => {
  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 w-96 max-w-sm',
        positionMap[position]
      )}
    >
      {toasts.map((toast) => (
        <EnhancedToast key={toast.id} {...toast} />
      ))}
    </div>
  );
};