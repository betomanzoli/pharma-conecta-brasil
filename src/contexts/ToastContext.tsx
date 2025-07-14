import React, { createContext, useContext } from 'react';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { ToastContainer } from '@/components/ui/enhanced-toast';

interface ToastContextType {
  success: (options: { title: string; description?: string }) => string;
  error: (options: { title: string; description?: string }) => string;
  warning: (options: { title: string; description?: string }) => string;
  info: (options: { title: string; description?: string }) => string;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toastMethods = useEnhancedToast();

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastContainer toasts={toastMethods.toasts} position="top-right" />
    </ToastContext.Provider>
  );
};