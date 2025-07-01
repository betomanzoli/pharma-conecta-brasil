
import React, { useState, useCallback } from 'react';
import NotificationToast from './NotificationToast';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

const NotificationContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((notification: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastNotification = {
      ...notification,
      id,
      timestamp: Date.now()
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Auto-remove old toasts (older than 10 seconds)
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setToasts(prev => prev.filter(toast => now - toast.timestamp < 10000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Expose methods globally for easy access
  React.useEffect(() => {
    // @ts-ignore
    window.showNotification = addToast;
  }, [addToast]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <NotificationToast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
