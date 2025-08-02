
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
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
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export const EnhancedToast: React.FC<EnhancedToastProps> = ({
  id,
  type,
  title,
  description,
  duration = 5000,
  dismissible = true,
  action,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const Icon = iconMap[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss(id);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        ${colorMap[type]}
        border rounded-lg p-4 shadow-lg max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{title}</p>
          {description && (
            <p className="text-sm opacity-90 mt-1">{description}</p>
          )}
        </div>

        {dismissible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {action && (
        <div className="mt-3 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              action.onClick();
              handleDismiss();
            }}
            className="text-xs"
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};

export interface ToastContainerProps {
  toasts: EnhancedToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right'
}) => {
  return (
    <div className={`fixed ${positionClasses[position]} z-50 space-y-2 pointer-events-none`}>
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <EnhancedToast {...toast} />
        </div>
      ))}
    </div>
  );
};
