import { describe, expect, it, vi } from 'vitest';

import { ConsoleLoggerAdapter } from './console-logger-adapter';

describe('ConsoleLoggerAdapter (packages/logger)', () => {
  it('should format and print info logs correctly', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = new ConsoleLoggerAdapter();

    logger.info('Test Log', { key: 'val' });

    expect(consoleSpy).toHaveBeenCalledWith('[INFO] Test Log', '{"key":"val"}');
    consoleSpy.mockRestore();
  });
});
