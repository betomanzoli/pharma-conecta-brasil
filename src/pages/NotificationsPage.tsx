
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import NotificationHistory from '@/components/notifications/NotificationHistory';
import SystemAlerts from '@/components/notifications/SystemAlerts';
import ProtectedRoute from '@/components/ProtectedRoute';

const NotificationsPage = () => {
  const { profile } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Central de Notificações
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie todas as suas notificações e alertas do sistema
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <NotificationHistory />
            </div>
            <div className="lg:col-span-1">
              <SystemAlerts />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default NotificationsPage;
