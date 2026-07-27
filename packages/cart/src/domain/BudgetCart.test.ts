import { describe, it, expect, vi } from 'vitest';
import { BudgetCart } from './entities/BudgetCart';
import { AddItemUseCase } from './useCases/AddItemUseCase';
import { CartRepositoryPort } from '../ports/CartRepositoryPort';
import { NotificationPort } from '../ports/NotificationPort';
import { IdGeneratorPort } from '../ports/IdGeneratorPort';
import { ClockPort } from '../ports/ClockPort';
import { BudgetExceededError } from './errors/BudgetExceededError';

describe('Feature Package Domain Tests (@domain/cart)', () => {
  it('should initialize BudgetCart entity with default properties', () => {
    const cart = new BudgetCart('cart-1', 300);
    expect(cart.id).toBe('cart-1');
    expect(cart.limit).toBe(300);
    expect(cart.getRemainingBudget()).toBe(300);
  });

  it('should enforce budget rules and throw BudgetExceededError when breached', () => {
    const cart = new BudgetCart('cart-1', 100);
    expect(() => cart.addItem('Expensive TV', 150, 'other', 'tx-1', 1000)).toThrow(
      BudgetExceededError
    );
  });

  it('should orchestrate AddItemUseCase using mock ports in pure node', async () => {
    const mockCart = new BudgetCart('test-cart', 200);
    const mockRepo: CartRepositoryPort = {
      getCart: vi.fn().mockResolvedValue(mockCart),
      saveCart: vi.fn().mockResolvedValue(undefined),
    };
    const mockNotifier: NotificationPort = { notify: vi.fn() };
    const mockIdGen: IdGeneratorPort = { generateId: vi.fn().mockReturnValue('uuid-1') };
    const mockClock: ClockPort = { now: vi.fn().mockReturnValue(1234) };

    const useCase = new AddItemUseCase(mockRepo, mockNotifier, mockIdGen, mockClock);
    const result = await useCase.execute('test-cart', 'Book', 25, 'other');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.getTotalSpent()).toBe(25);
    }
    expect(mockNotifier.notify).toHaveBeenCalledWith(
      'Added "Book" ($25.00) to planner.',
      'success'
    );
  });
});
