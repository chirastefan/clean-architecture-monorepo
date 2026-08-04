import { describe, expect, it, vi } from 'vitest';
import {
  AddItemUseCase,
  BudgetCart,
  CartUseCase,
  RemoveItemUseCase,
  UpdateLimitUseCase,
} from '@clean/cart';
import { addItemThunk, createCartReduxStore, fetchCartThunk } from './index';

describe('@clean/cart-store Integration Tests', () => {
  const createMockDeps = () => {
    const mockRepo = {
      getCart: vi.fn().mockResolvedValue(new BudgetCart('shared-store-1', 600, [])),
      saveCart: vi.fn().mockResolvedValue(undefined),
    };
    const mockNotify = { notify: vi.fn() };
    const mockIdGen = { generateId: () => 'shared-id-999' };
    const mockClock = { now: () => 1700000000000 };

    return {
      cartUseCase: new CartUseCase(mockRepo),
      addItemUseCase: new AddItemUseCase(mockRepo, mockNotify as any, mockIdGen, mockClock),
      updateLimitUseCase: new UpdateLimitUseCase(mockRepo, mockNotify as any),
      removeItemUseCase: new RemoveItemUseCase(mockRepo, mockNotify as any),
      mockNotify,
    };
  };

  it('should fetch cart using shared Redux thunk', async () => {
    const deps = createMockDeps();
    const store = createCartReduxStore(deps);

    await store.dispatch(fetchCartThunk('shared-store-1'));

    const state = store.getState().cart;
    expect(state.loading).toBe(false);
    expect(state.cart?.id).toBe('shared-store-1');
    expect(state.cart?.limit).toBe(600);
  });

  it('should add item using shared Redux thunk', async () => {
    const deps = createMockDeps();
    const store = createCartReduxStore(deps);

    await store.dispatch(
      addItemThunk({
        cartId: 'shared-store-1',
        name: 'Shared Headset',
        price: 200,
        category: 'electronics',
      })
    );

    const state = store.getState().cart;
    expect(state.cart?.items).toHaveLength(1);
    expect(state.cart?.items[0].name).toBe('Shared Headset');
  });
});
