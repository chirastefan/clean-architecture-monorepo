import { describe, expect, it } from 'vitest';
import { addItemThunk, createCartReduxStore } from '@clean/cart-store';
import { dependencies } from './ui/di-container';

describe('Next.js Architecture Integration Tests (apps/web-next)', () => {
  it('should initialize Next.js DI Container and Use Cases cleanly', () => {
    expect(dependencies.cartUseCase).toBeDefined();
    expect(dependencies.addItemUseCase).toBeDefined();
  });

  it('should execute AddItemUseCase via Redux thunks on Next.js platform store', async () => {
    const store = createCartReduxStore(dependencies);
    await store.dispatch(
      addItemThunk({
        cartId: 'next-cart-1',
        name: 'Ergonomic Chair',
        price: 280,
        category: 'utilities',
      })
    );

    const state = store.getState().cart;
    expect(state.loading).toBe(false);
    expect(state.cart?.items).toHaveLength(1);
    expect(state.cart?.items[0].name).toBe('Ergonomic Chair');
  });
});
