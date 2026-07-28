import { type NotificationPort } from '@clean/cart';

export type ToastSubscriber = (message: string, type: 'success' | 'error' | 'info') => void;

export class ToastNotificationAdapter implements NotificationPort {
  private subscribers: Set<ToastSubscriber> = new Set();

  public notify(message: string, type: 'success' | 'error' | 'info'): void {
    this.subscribers.forEach((sub) => sub(message, type));
  }

  public subscribe(callback: ToastSubscriber): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }
}
