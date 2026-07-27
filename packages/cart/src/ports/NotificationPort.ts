export interface NotificationPort {
  notify(message: string, type: 'success' | 'error' | 'info'): void;
}
