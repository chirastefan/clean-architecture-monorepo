import { describe, expect, it } from 'vitest';
import { dependencies } from './ui/di-container';
import { createCartStore } from './ui/store/use-cart-store';

describe('Next.js Architecture Integration Tests (apps/web-next)', () => {
  it('should initialize Next.js DI Container and Use Cases cleanly', () => {
    expect(dependencies.cartUseCase).toBeDefined();
    expect(dependencies.addItemUseCase).toBeDefined();
  });

  it('should execute AddItemUseCase on Next.js platform store', async () => {
    const store = createCartStore(dependencies);
    const ok = await store.getState().addItem('next-cart-1', 'Ergonomic Chair', 280, 'utilities');
    expect(ok).toBe(true);
    expect(store.getState().cart?.items).toHaveLength(1);
    expect(store.getState().cart?.items[0].name).toBe('Ergonomic Chair');
  });
});
