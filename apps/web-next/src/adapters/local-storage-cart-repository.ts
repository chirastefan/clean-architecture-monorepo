import { BudgetCart, type CartRepositoryPort } from '@clean/cart';

export class LocalStorageCartRepository implements CartRepositoryPort {
  private readonly storageKeyPrefix = 'clean_arch_cart_';

  async getCart(cartId: string): Promise<BudgetCart> {
    if (typeof window === 'undefined') {
      return new BudgetCart(cartId, 300, []);
    }

    try {
      const raw = localStorage.getItem(`${this.storageKeyPrefix}${cartId}`);
      if (!raw) {
        return new BudgetCart(cartId, 300, []);
      }
      const parsed = JSON.parse(raw);
      return new BudgetCart(parsed.id, parsed.limit, parsed.items ?? []);
    } catch {
      return new BudgetCart(cartId, 300, []);
    }
  }

  async saveCart(cart: BudgetCart): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    const payload = {
      id: cart.id,
      limit: cart.limit,
      items: cart.items,
    };
    localStorage.setItem(`${this.storageKeyPrefix}${cart.id}`, JSON.stringify(payload));
  }
}
