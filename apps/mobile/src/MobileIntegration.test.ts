import { describe, it, expect, vi } from 'vitest';
import { BudgetCart, AddItemUseCase, CartUseCase } from '@clean/cart';
import { UserEntity, LoginUseCase } from '@clean/auth';
import { AsyncStorageCartRepository } from './adapters/AsyncStorageCartRepository';
import { NativeAlertNotificationAdapter } from './adapters/NativeAlertNotificationAdapter';

describe('Mobile App Cross-Package Integration Tests (apps/mobile)', () => {
  it('should import and execute shared domain entity and use cases from @clean/cart', async () => {
    const repo = new AsyncStorageCartRepository();
    const alertHandler = vi.fn();
    const notifier = new NativeAlertNotificationAdapter(alertHandler);

    const idGen = { generateId: () => 'mobile-tx-1' };
    const clock = { now: () => 99999 };

    const addItem = new AddItemUseCase(repo, notifier, idGen, clock);

    const result = await addItem.execute('mobile-cart-1', 'Mobile Battery', 45, 'utilities');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBeInstanceOf(BudgetCart);
      expect(result.value.getTotalSpent()).toBe(45);
      expect(result.value.items[0].id).toBe('mobile-tx-1');
    }

    expect(alertHandler).toHaveBeenCalledWith(
      'Success',
      'Added "Mobile Battery" ($45.00) to planner.'
    );
  });

  it('should consume @clean/auth domain entity inside mobile app', () => {
    const user = new UserEntity('u-200', 'sam@mobile.com', 'Sam');
    expect(user.name).toBe('Sam');
    expect(LoginUseCase).toBeDefined();
  });

  it('should load cart state using AsyncStorageCartRepository adapter', async () => {
    const repo = new AsyncStorageCartRepository();
    const cartUseCase = new CartUseCase(repo);

    const result = await cartUseCase.execute('mobile-cart-1');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.limit).toBe(300);
    }
  });
});
