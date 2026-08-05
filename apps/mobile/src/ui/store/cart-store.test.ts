import { describe, expect, it } from 'vitest';
import { addItemThunk, createCartReduxStore, fetchCartThunk } from '@clean/cart-store';
import { createMobileDependencies } from '../di-container';

describe('Mobile Redux Cart Store (apps/mobile)', () => {
  it('should fetch cart using Mobile DI Container and Redux thunks', async () => {
    const mobileDeps = createMobileDependencies();
    const store = createCartReduxStore({ deps: mobileDeps });

    await store.dispatch(fetchCartThunk('mobile-cart-1'));

    const state = store.getState().cart;
    expect(state.loading).toBe(false);
  });

  it('should add item using Mobile DI Container and Redux thunks', async () => {
    const mobileDeps = createMobileDependencies();
    const store = createCartReduxStore({ deps: mobileDeps });

    await store.dispatch(
      addItemThunk({
        cartId: 'mobile-cart-2',
        name: 'Mobile Tablet',
        price: 300,
        category: 'electronics',
      })
    );

    const state = store.getState().cart;
    expect(state.loading).toBe(false);
    expect(state.cart?.items).toHaveLength(1);
    expect(state.cart?.items[0].name).toBe('Mobile Tablet');
  });
});
