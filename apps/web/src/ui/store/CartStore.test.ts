import { describe, it, expect, beforeEach } from 'vitest';
import { createCartStore } from './useCartStore';
import { LocalStorageCartRepository } from '../../adapters/LocalStorageCartRepository';
import { ToastNotificationAdapter } from '../../adapters/ToastNotificationAdapter';
import { UuidGeneratorAdapter } from '../../adapters/UuidGeneratorAdapter';
import { SystemClockAdapter } from '../../adapters/SystemClockAdapter';
import { ConsoleLoggerAdapter } from '@clean/logger';
import { CartUseCase, AddItemUseCase, UpdateLimitUseCase, RemoveItemUseCase } from '@clean/cart';

describe('Zustand CartStore Integration Tests (apps/web)', () => {
  let cartStore: ReturnType<typeof createCartStore>;

  beforeEach(() => {
    const repository = new LocalStorageCartRepository();
    const notificationAdapter = new ToastNotificationAdapter();
    const idGenerator = new UuidGeneratorAdapter();
    const clock = new SystemClockAdapter();
    const logger = new ConsoleLoggerAdapter();

    const deps = {
      notificationAdapter,
      cartUseCase: new CartUseCase(repository),
      addItemUseCase: new AddItemUseCase(
        repository,
        notificationAdapter,
        idGenerator,
        clock,
        logger
      ),
      updateLimitUseCase: new UpdateLimitUseCase(repository, notificationAdapter),
      removeItemUseCase: new RemoveItemUseCase(repository, notificationAdapter),
    };

    cartStore = createCartStore(deps);
  });

  it('should initialize with null cart state', () => {
    const state = cartStore.getState();
    expect(state.cart).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should fetch cart and update state with BudgetCart domain entity', async () => {
    await cartStore.getState().fetchCart('store-test-1');

    const state = cartStore.getState();
    expect(state.cart).not.toBeNull();
    expect(state.cart?.id).toBe('store-test-1');
    expect(state.cart?.limit).toBe(250);
    expect(state.loading).toBe(false);
  });

  it('should dispatch addItem action and update store state', async () => {
    await cartStore.getState().fetchCart('store-test-2');
    await cartStore.getState().addItem('Zustand Monitor', 150, 'utilities');

    const state = cartStore.getState();
    expect(state.cart?.items).toHaveLength(1);
    expect(state.cart?.items[0].name).toBe('Zustand Monitor');
    expect(state.cart?.getTotalSpent()).toBe(150);
  });

  it('should dispatch updateLimit action and update store state', async () => {
    await cartStore.getState().fetchCart('store-test-3');
    await cartStore.getState().updateLimit(750);

    const state = cartStore.getState();
    expect(state.cart?.limit).toBe(750);
  });
});
