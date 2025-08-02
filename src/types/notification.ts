
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system' | 'mentorship' | 'forum' | 'knowledge';
  read: boolean;
  created_at: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => Promise<void>;
  clearNotifications: () => Promise<void>;
}

export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  categories: {
    system: boolean;
    mentorship: boolean;
    forum: boolean;
    knowledge: boolean;
    marketing: boolean;
  };
}
