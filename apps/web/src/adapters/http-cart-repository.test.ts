import { describe, expect, it, vi } from 'vitest';
import { BudgetCart } from '@clean/cart';
import { HttpCartRepository } from './http-cart-repository';

describe('HttpCartRepository with RTK Query createApi (Infrastructure Layer)', () => {
  it('should fetch cart using RTK Query endpoints.getCartById', async () => {
    const mockDispatch = vi.fn().mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        id: 'rtk-cart-1',
        limit: 500,
        items: [{ id: 'item-1', name: 'RTK Headset', price: 100, category: 'utilities' }],
      }),
    });

    const repo = new HttpCartRepository(mockDispatch);
    const cart = await repo.getCart('rtk-cart-1');

    expect(cart).toBeInstanceOf(BudgetCart);
    expect(cart.id).toBe('rtk-cart-1');
    expect(cart.limit).toBe(500);
    expect(cart.items).toHaveLength(1);
  });

  it('should save cart using RTK Query endpoints.updateCart', async () => {
    const mockDispatch = vi.fn().mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });

    const repo = new HttpCartRepository(mockDispatch);
    const cart = new BudgetCart('rtk-cart-2', 750, []);
    await repo.saveCart(cart);

    expect(mockDispatch).toHaveBeenCalled();
  });
});
