import { describe, it, expect, vi } from 'vitest';
import { ConsoleTelemetryAdapter } from './ConsoleTelemetryAdapter';

describe('Shared Telemetry Tests (@shared/telemetry)', () => {
  it('should format telemetry events correctly', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const telemetry = new ConsoleTelemetryAdapter();

    telemetry.trackEvent('item_added', { itemId: 'tx-1' });

    expect(spy).toHaveBeenCalledWith('[TELEMETRY EVENT] item_added', '{"itemId":"tx-1"}');
    spy.mockRestore();
  });
});
