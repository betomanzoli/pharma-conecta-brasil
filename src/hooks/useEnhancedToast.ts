import { useState, useCallback } from 'react';
import { EnhancedToastProps } from '@/components/ui/enhanced-toast';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useEnhancedToast = () => {
  const [toasts, setToasts] = useState<EnhancedToastProps[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'warning' | 'info', options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    const toast: EnhancedToastProps = {
      id,
      type,
      ...options,
      onDismiss: (toastId: string) => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      },
    };

    setToasts(prev => [...prev, toast]);
    
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback((options: ToastOptions) => {
    return addToast('success', options);
  }, [addToast]);

  const error = useCallback((options: ToastOptions) => {
    return addToast('error', options);
  }, [addToast]);

  const warning = useCallback((options: ToastOptions) => {
    return addToast('warning', options);
  }, [addToast]);

  const info = useCallback((options: ToastOptions) => {
    return addToast('info', options);
  }, [addToast]);

  return {
    toasts,
    success,
    error,
    warning,
    info,
    dismissToast,
    dismissAll,
  };
};