export type TelemetryPort = {
  trackEvent(eventName: string, properties?: Record<string, any>): void;
};
