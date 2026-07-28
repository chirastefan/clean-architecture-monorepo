import { TelemetryPort } from './telemetry-port';

export class ConsoleTelemetryAdapter implements TelemetryPort {
  public trackEvent(eventName: string, properties?: Record<string, any>): void {
    console.log(`[TELEMETRY EVENT] ${eventName}`, properties ? JSON.stringify(properties) : '');
  }
}
