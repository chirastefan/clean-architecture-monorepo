import { describe, expect, it } from 'vitest';

import { createMobileDependencies } from '../di-container';
import { createMobileCartStore } from './use-cart-store';

describe('Mobile Zustand Cart Store (apps/mobile)', () => {
  it('should initialize with null cart and loading false', () => {
    const store = createMobileCartStore();
    expect(store.getState().cart).toBeNull();
    expect(store.getState().loading).toBe(false);
  });

  it('should add item using Mobile DI Container', async () => {
    const deps = createMobileDependencies({
      generateId: () => 'store-item-1',
    });
    const useStore = createMobileCartStore(deps);

    const success = await useStore.getState().addItem('cart-1', 'Mobile Tablet', 300, 'gadgets');
    expect(success).toBe(true);
    expect(useStore.getState().cart?.items).toHaveLength(1);
    expect(useStore.getState().cart?.items[0].name).toBe('Mobile Tablet');
  });
});
