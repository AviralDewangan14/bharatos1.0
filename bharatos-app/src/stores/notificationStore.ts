import { create } from 'zustand';
import type { Notification, NotificationType } from '../types/notification';

interface NotificationStore {
  notifications: Notification[];
  drawerOpen: boolean;
  
  addNotification: (title: string, message: string, type?: NotificationType, appId?: string) => string;
  dismissNotification: (id: string) => void;
  markRead: (id: string) => void;
  clearAll: () => void;
  toggleDrawer: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  drawerOpen: false,

  addNotification: (title, message, type = 'info', appId = 'system') => {
    const id = crypto.randomUUID();
    const notification: Notification = {
      id,
      title,
      message,
      type,
      appId,
      timestamp: Date.now(),
      read: false,
    };

    set((state) => ({
      notifications: [notification, ...state.notifications]
    }));
    
    return id;
  },

  dismissNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  markRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
  })),

  clearAll: () => set({ notifications: [] }),

  toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
  
  getUnreadCount: () => get().notifications.filter(n => !n.read).length,
}));
