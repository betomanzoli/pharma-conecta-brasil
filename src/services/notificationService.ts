
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';

export class NotificationService {
  static async fetchNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return data?.map(this.convertToNotification) || [];
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return [];
    }
  }

  static async addNotification(
    userId: string, 
    notification: Omit<Notification, 'id' | 'created_at' | 'read'>
  ): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          read: false
        })
        .select()
        .single();

      if (error) throw error;

      return this.convertToNotification(data);
    } catch (error) {
      console.error('Erro ao adicionar notificação:', error);
      return null;
    }
  }

  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('mark_notification_read', {
        notification_id: notificationId
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return false;
    }
  }

  static async markAllAsRead(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('mark_all_notifications_read');
      
      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
      return 0;
    }
  }

  static async clearNotifications(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
      return false;
    }
  }

  static convertToNotification(data: any): Notification {
    return {
      id: data.id,
      title: data.title,
      message: data.message,
      type: data.type,
      read: data.read,
      created_at: data.created_at
    };
  }

  // Notificações automáticas do sistema
  static async createSystemNotification(
    userId: string, 
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) {
    return this.addNotification(userId, { title, message, type });
  }

  // Notificações de boas-vindas
  static async createWelcomeNotifications(userId: string, userType: string) {
    const notifications = [
      {
        title: 'Bem-vindo à Plataforma!',
        message: 'Sua conta foi criada com sucesso. Complete seu perfil para melhores conexões.',
        type: 'success' as const
      },
      {
        title: 'Complete seu Perfil',
        message: 'Adicione informações sobre sua experiência e áreas de interesse.',
        type: 'info' as const
      }
    ];

    if (userType === 'company') {
      notifications.push({
        title: 'Explore o Marketplace',
        message: 'Descubra laboratórios e consultores especializados para seus projetos.',
        type: 'info' as const
      });
    }

    for (const notification of notifications) {
      await this.addNotification(userId, notification);
    }
  }

  // Notificações de progresso
  static async createProgressNotification(
    userId: string, 
    title: string, 
    progress: number,
    details?: string
  ) {
    return this.addNotification(userId, {
      title,
      message: `Progresso: ${progress}%${details ? ` - ${details}` : ''}`,
      type: 'info'
    });
  }
}
