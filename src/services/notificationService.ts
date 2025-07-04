
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';

export class NotificationService {
  static validateNotificationType = (type: string): 'info' | 'success' | 'warning' | 'error' => {
    if (type === 'info' || type === 'success' || type === 'warning' || type === 'error') {
      return type;
    }
    return 'info';
  };

  static convertToNotification = (dbNotification: any): Notification => ({
    id: dbNotification.id,
    title: dbNotification.title,
    message: dbNotification.message,
    type: this.validateNotificationType(dbNotification.type),
    read: dbNotification.read,
    created_at: dbNotification.created_at
  });

  static async fetchNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return (data || []).map(this.convertToNotification);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  static async addNotification(
    userId: string,
    notification: Omit<Notification, 'id' | 'created_at' | 'read'>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: userId,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            read: false
          }
        ]);

      if (error) {
        console.error('Error adding notification:', error);
      }
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  }

  static async markAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('mark_notification_read', {
        notification_id: id
      });

      if (error) {
        console.error('Error marking notification as read:', error);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  static async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('mark_all_notifications_read');

      if (error) {
        console.error('Error marking all notifications as read:', error);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  static async clearNotifications(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error clearing notifications:', error);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }
}
