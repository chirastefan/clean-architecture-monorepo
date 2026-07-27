import { describe, it, expect, vi } from 'vitest';
import { ConsoleLoggerAdapter } from './ConsoleLoggerAdapter';

describe('Shared Logger Tests (@shared/logger)', () => {
  it('should format info logs correctly', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = new ConsoleLoggerAdapter();

    logger.info('User logged in', { userId: '123' });

    expect(spy).toHaveBeenCalledWith('[INFO] User logged in', '{"userId":"123"}');
    spy.mockRestore();
  });
});
