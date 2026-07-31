import { describe, expect, it } from 'vitest';
import { SharedBadge, SharedButton, SharedCard } from './index';

describe('@clean/web-ui-components exports', () => {
  it('should export SharedButton, SharedCard, and SharedBadge components', () => {
    expect(SharedButton).toBeDefined();
    expect(SharedCard).toBeDefined();
    expect(SharedBadge).toBeDefined();
  });
});
