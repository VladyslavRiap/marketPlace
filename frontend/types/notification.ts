export interface Notification {
  id: number;
  user_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}
