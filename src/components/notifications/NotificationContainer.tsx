
import React, { ReactNode } from 'react';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationCenter from './NotificationCenter';

interface NotificationContainerProps {
  children: ReactNode;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ children }) => {
  return (
    <NotificationProvider>
      {children}
      <NotificationCenter />
    </NotificationProvider>
  );
};

export default NotificationContainer;
