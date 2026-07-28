import { describe, it, expect } from 'vitest';
import { BudgetCart } from './entities/budget-cart';
import { BudgetExceededError } from './errors/budget-exceeded-error';

describe('BudgetCart Domain Entity (packages/cart)', () => {
  it('should calculate total spent and remaining budget correctly', () => {
    const cart = new BudgetCart('cart-1', 200, [
      { id: '1', name: 'Item A', price: 50, category: 'grocery', timestamp: 100 },
      { id: '2', name: 'Item B', price: 30, category: 'entertainment', timestamp: 200 },
    ]);

    expect(cart.getTotalSpent()).toBe(80);
    expect(cart.getRemainingBudget()).toBe(120);
  });

  it('should return a failure Result when adding item that exceeds budget limit', () => {
    const cart = new BudgetCart('cart-1', 100);
    const result = cart.addItem({
      id: 'tx-1',
      name: 'Expensive Headphones',
      price: 150,
      category: 'entertainment',
      timestamp: Date.now(),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(BudgetExceededError);
      expect(result.error.message).toContain('exceeds monthly limit');
    }
  });

  it('should allow adding item within budget limit using Result.ok', () => {
    const cart = new BudgetCart('cart-1', 100);
    const result = cart.addItem({
      id: 'tx-1',
      name: 'Coffee',
      price: 15,
      category: 'grocery',
      timestamp: Date.now(),
    });

    expect(result.ok).toBe(true);
    expect(cart.items).toHaveLength(1);
    expect(cart.getTotalSpent()).toBe(15);
  });
});
