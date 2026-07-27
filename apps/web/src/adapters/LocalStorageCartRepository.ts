import { type CartRepositoryPort, BudgetCart } from '@clean/cart';
import { CartMapper } from './mappers/CartMapper';

const STORAGE_PREFIX = 'comb-cart-';

export class LocalStorageCartRepository implements CartRepositoryPort {
  public async getCart(cartId: string): Promise<BudgetCart> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(`${STORAGE_PREFIX}${cartId}`);
        if (!stored) {
          return CartMapper.toDomain(CartMapper.defaultDTO(cartId));
        }
        const dto = JSON.parse(stored);
        return CartMapper.toDomain(dto);
      }
      return CartMapper.toDomain(CartMapper.defaultDTO(cartId));
    } catch {
      return CartMapper.toDomain(CartMapper.defaultDTO(cartId));
    }
  }

  public async saveCart(cart: BudgetCart): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (typeof window !== 'undefined' && window.localStorage) {
      const dto = CartMapper.toDTO(cart);
      window.localStorage.setItem(`${STORAGE_PREFIX}${cart.id}`, JSON.stringify(dto));
    }
  }
}
