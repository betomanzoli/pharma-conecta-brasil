
import { useCallback } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { RegulatoryApiService } from '@/services/regulatoryApiService';

export const useSystemNotifications = () => {
  const { addNotification } = useNotifications();

  const notifyProjectUpdate = useCallback((projectTitle: string, status: string) => {
    const statusMessages = {
      accepted: { title: 'Projeto Aceito', type: 'success' as const },
      rejected: { title: 'Projeto Rejeitado', type: 'error' as const },
      completed: { title: 'Projeto Concluído', type: 'success' as const },
      cancelled: { title: 'Projeto Cancelado', type: 'warning' as const }
    };

    const config = statusMessages[status as keyof typeof statusMessages];
    if (config) {
      addNotification({
        title: config.title,
        message: `Projeto "${projectTitle}" foi ${status === 'accepted' ? 'aceito' : status === 'rejected' ? 'rejeitado' : status === 'completed' ? 'concluído' : 'cancelado'}.`,
        type: config.type
      });
    }
  }, [addNotification]);

  const notifyRegulatoryAlert = useCallback(async () => {
    try {
      const alerts = await RegulatoryApiService.getLatestAlerts(5);
      alerts.forEach(alert => {
        addNotification({
          title: 'Alerta Regulatório',
          message: alert.title,
          type: alert.severity === 'critical' || alert.severity === 'high' ? 'error' : 'warning'
        });
      });
    } catch (error) {
      console.error('Error fetching regulatory alerts:', error);
    }
  }, [addNotification]);

  const notifyConnection = useCallback((userName: string) => {
    addNotification({
      title: 'Nova Conexão',
      message: `${userName} se conectou com você!`,
      type: 'info'
    });
  }, [addNotification]);

  const notifyMentorship = useCallback((mentorName: string, sessionDate: string) => {
    addNotification({
      title: 'Sessão de Mentoria Agendada',
      message: `Sessão com ${mentorName} agendada para ${sessionDate}`,
      type: 'info'
    });
  }, [addNotification]);

  const notifySystemUpdate = useCallback((message: string) => {
    addNotification({
      title: 'Atualização do Sistema',
      message,
      type: 'info'
    });
  }, [addNotification]);

  return {
    notifyProjectUpdate,
    notifyRegulatoryAlert,
    notifyConnection,
    notifyMentorship,
    notifySystemUpdate
  };
};
