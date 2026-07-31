import { type NotificationPort } from '@clean/cart';

type ToastSubscriber = (message: string, type: string) => void;

export class ToastNotificationAdapter implements NotificationPort {
  private subscribers: ToastSubscriber[] = [];

  notify(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    console.log(`[Next.js Toast - ${type.toUpperCase()}]: ${message}`);
    this.subscribers.forEach((subscriber) => subscriber(message, type));
  }

  subscribe(subscriber: ToastSubscriber): () => void {
    this.subscribers.push(subscriber);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== subscriber);
    };
  }
}
