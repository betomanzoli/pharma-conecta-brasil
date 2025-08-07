
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotificationHistory from '@/components/notifications/NotificationHistory';
import DemoModeIndicator from '@/components/layout/DemoModeIndicator';

const NotificationsPage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Central de Notificações
            </h1>
            <p className="text-muted-foreground">
              Acompanhe todas as atualizações e alertas importantes
            </p>
          </div>

          <DemoModeIndicator variant="alert" className="mb-6" />
          
          <NotificationHistory />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default NotificationsPage;
