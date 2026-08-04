import { describe, it, expect, vi } from 'vitest';
import {
  addItemThunk,
  createCartReduxStore,
  fetchCartThunk,
  updateLimitThunk,
} from '@clean/cart-store';
import {
  CartUseCase,
  AddItemUseCase,
  UpdateLimitUseCase,
  RemoveItemUseCase,
  BudgetCart,
} from '@clean/cart';

describe('Redux Toolkit CartStore Integration Tests (apps/web)', () => {
  const createMockDeps = () => {
    const mockRepo = {
      getCart: vi.fn().mockResolvedValue(new BudgetCart('store-test-1', 500, [])),
      saveCart: vi.fn().mockResolvedValue(undefined),
    };
    const mockNotify = { notify: vi.fn() };
    const mockIdGen = { generateId: () => 'generated-id-123' };
    const mockClock = { now: () => 1700000000000 };

    return {
      notificationAdapter: mockNotify as any,
      cartUseCase: new CartUseCase(mockRepo),
      addItemUseCase: new AddItemUseCase(mockRepo, mockNotify as any, mockIdGen, mockClock),
      updateLimitUseCase: new UpdateLimitUseCase(mockRepo, mockNotify as any),
      removeItemUseCase: new RemoveItemUseCase(mockRepo, mockNotify as any),
      mockRepo,
      mockNotify,
    };
  };

  it('should fetch cart and update Redux store state', async () => {
    const deps = createMockDeps();
    const store = createCartReduxStore(deps);

    await store.dispatch(fetchCartThunk('store-test-1'));

    const state = store.getState().cart;
    expect(state.loading).toBe(false);
    expect(state.cart).not.toBeNull();
    expect(state.cart?.id).toBe('store-test-1');
    expect(state.cart?.limit).toBe(500);
  });

  it('should dispatch addItem thunk and update Redux store state', async () => {
    const deps = createMockDeps();
    const store = createCartReduxStore(deps);

    await store.dispatch(
      addItemThunk({
        cartId: 'store-test-2',
        name: 'Redux Monitor',
        price: 150,
        category: 'electronics',
      })
    );

    const state = store.getState().cart;
    expect(state.loading).toBe(false);
    expect(state.cart?.items).toHaveLength(1);
    expect(state.cart?.items[0].name).toBe('Redux Monitor');
    expect(deps.mockNotify.notify).toHaveBeenCalledWith(
      'Added "Redux Monitor" ($150.00) to planner.',
      'success'
    );
  });

  it('should dispatch updateLimit thunk and update Redux store state', async () => {
    const deps = createMockDeps();
    const store = createCartReduxStore(deps);

    await store.dispatch(updateLimitThunk({ cartId: 'store-test-3', newLimit: 750 }));

    const state = store.getState().cart;
    expect(state.loading).toBe(false);
    expect(state.cart?.limit).toBe(750);
  });
});
