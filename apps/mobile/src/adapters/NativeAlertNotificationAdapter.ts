import { type NotificationPort } from '@clean/cart';

export type NativeAlertHandler = (title: string, message: string) => void;

export class NativeAlertNotificationAdapter implements NotificationPort {
  constructor(
    private readonly alertHandler: NativeAlertHandler = (title, msg) => console.log(`[Native Alert - ${title}]: ${msg}`)
  ) {}

  public notify(message: string, type: 'success' | 'error' | 'info'): void {
    const title = type === 'success' ? 'Success' : type === 'error' ? 'Notice' : 'Info';
    this.alertHandler(title, message);
  }
}
