import React from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import TestNotificationButton from '@/components/notifications/TestNotificationButton';
import { Separator } from '@/components/ui/separator';

const NotificationsPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Central de Notificações</h1>
            <p className="text-muted-foreground mb-4">
              Acompanhe todas as suas notificações em tempo real
            </p>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Testar notificações:</span>
              <TestNotificationButton />
            </div>
          </div>
          
          <Separator className="mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <NotificationCenter />
            </div>
            <div>
              <NotificationSettings />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default NotificationsPage;