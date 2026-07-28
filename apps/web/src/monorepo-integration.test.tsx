import { describe, it, expect, vi } from 'vitest';
import {
  BudgetCart,
  AddItemUseCase,
  BudgetExceededError,
  type CartRepositoryPort,
  type NotificationPort,
  type IdGeneratorPort,
  type ClockPort,
} from '@clean/cart';

describe('Monorepo Architecture Integration Tests (apps/web)', () => {
  it('should execute AddItemUseCase end-to-end with in-memory adapters', async () => {
    const memoryStore = new Map<string, BudgetCart>();

    const mockRepo: CartRepositoryPort = {
      async getCart(id: string) {
        return memoryStore.get(id) || new BudgetCart(id, 200, []);
      },
      async saveCart(cart: BudgetCart) {
        memoryStore.set(cart.id, cart);
      },
    };

    const notifications: string[] = [];
    const mockNotify: NotificationPort = {
      notify(msg) {
        notifications.push(msg);
      },
    };

    const mockIdGen: IdGeneratorPort = { generateId: () => 'item-id-123' };
    const mockClock: ClockPort = { now: () => 1600000000000 };

    const useCase = new AddItemUseCase(mockRepo, mockNotify, mockIdGen, mockClock);

    const result = await useCase.execute('cart-1', 'Groceries', 50, 'grocery');

    expect(result.ok).toBe(true);
    expect(notifications).toHaveLength(1);
    expect(notifications[0]).toContain('Added "Groceries"');

    const savedCart = await mockRepo.getCart('cart-1');
    expect(savedCart.getTotalSpent()).toBe(50);
  });

  it('should trigger notification error when budget is exceeded', async () => {
    const mockRepo: CartRepositoryPort = {
      async getCart(id: string) {
        return new BudgetCart(id, 50, []);
      },
      async saveCart() {},
    };

    const notifySpy = vi.fn();
    const mockNotify: NotificationPort = { notify: notifySpy };

    const useCase = new AddItemUseCase(
      mockRepo,
      mockNotify,
      { generateId: () => '1' },
      { now: () => 100 }
    );

    const result = await useCase.execute('cart-1', 'Laptop', 1200, 'electronics');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(BudgetExceededError);
    }
    expect(notifySpy).toHaveBeenCalledWith(
      expect.stringContaining('exceeds monthly limit'),
      'error'
    );
  });
});
