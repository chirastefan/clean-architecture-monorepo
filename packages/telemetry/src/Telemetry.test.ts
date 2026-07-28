import { describe, it, expect, vi } from 'vitest';
import { ConsoleTelemetryAdapter } from './console-telemetry-adapter';

describe('ConsoleTelemetryAdapter (packages/telemetry)', () => {
  it('should format and track telemetry events', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const telemetry = new ConsoleTelemetryAdapter();

    telemetry.trackEvent('PAGE_VIEW', { page: '/dashboard' });

    expect(consoleSpy).toHaveBeenCalledWith('[TELEMETRY EVENT] PAGE_VIEW', '{"page":"/dashboard"}');
    consoleSpy.mockRestore();
  });
});
