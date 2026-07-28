export interface TelemetryPort {
  trackEvent(eventName: string, properties?: Record<string, any>): void;
}
