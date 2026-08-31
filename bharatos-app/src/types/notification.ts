/**
 * Notification type — used by toast popups
 * and the notification drawer.
 */

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  read: boolean;
  appId?: string; // which app sent this, if any
  duration?: number; // auto-dismiss in ms, default 5000
}
