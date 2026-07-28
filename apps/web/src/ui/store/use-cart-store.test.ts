import { describe, it, expect, vi } from 'vitest';
import { createCartStore } from './use-cart-store';
import {
  CartUseCase,
  AddItemUseCase,
  UpdateLimitUseCase,
  RemoveItemUseCase,
  BudgetCart,
} from '@clean/cart';

describe('Zustand CartStore Integration Tests (apps/web)', () => {
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
    };
  };

  it('should fetch cart and update Zustand store state', async () => {
    const deps = createMockDeps();
    const useStore = createCartStore(deps);

    await useStore.getState().fetchCart('store-test-1');

    const state = useStore.getState();
    expect(state.loading).toBe(false);
    expect(state.cart).not.toBeNull();
    expect(state.cart?.id).toBe('store-test-1');
    expect(state.cart?.limit).toBe(500);
  });

  it('should dispatch addItem action and update store state', async () => {
    const deps = createMockDeps();
    const useStore = createCartStore(deps);

    await useStore.getState().addItem('store-test-2', 'Zustand Monitor', 150, 'electronics');

    const state = useStore.getState();
    expect(state.loading).toBe(false);
    expect(state.cart?.items).toHaveLength(1);
    expect(state.cart?.items[0].name).toBe('Zustand Monitor');
    expect(deps.notificationAdapter.notify).toHaveBeenCalledWith(
      'Added "Zustand Monitor" ($150.00) to planner.',
      'success'
    );
  });

  it('should dispatch updateLimit action and update store state', async () => {
    const deps = createMockDeps();
    const useStore = createCartStore(deps);

    await useStore.getState().updateLimit('store-test-3', 750);

    const state = useStore.getState();
    expect(state.loading).toBe(false);
    expect(state.cart?.limit).toBe(750);
  });
});
