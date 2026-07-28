import { LoggerPort } from './logger-port';

export class ConsoleLoggerAdapter implements LoggerPort {
  public info(message: string, context?: Record<string, any>): void {
    console.log(`[INFO] ${message}`, context ? JSON.stringify(context) : '');
  }

  public error(message: string, error?: any, context?: Record<string, any>): void {
    console.error(`[ERROR] ${message}`, error, context ? JSON.stringify(context) : '');
  }

  public warn(message: string, context?: Record<string, any>): void {
    console.warn(`[WARN] ${message}`, context ? JSON.stringify(context) : '');
  }
}
