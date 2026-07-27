import { type LoggerPort } from './LoggerPort';

export class ConsoleLoggerAdapter implements LoggerPort {
  public info(message: string, meta?: Record<string, any>): void {
    console.log(`[INFO] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  public warn(message: string, meta?: Record<string, any>): void {
    console.warn(`[WARN] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  public error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error ?? '');
  }
}
