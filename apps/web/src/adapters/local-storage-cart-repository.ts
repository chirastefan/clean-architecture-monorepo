import { type CartRepositoryPort, BudgetCart } from '@clean/cart';

const STORAGE_KEY_PREFIX = 'budget_cart_';

export class LocalStorageCartRepository implements CartRepositoryPort {
  public async getCart(cartId: string): Promise<BudgetCart> {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${cartId}`);
    if (!raw) {
      const initialCart = new BudgetCart(cartId, 250, []);
      await this.saveCart(initialCart);
      return initialCart;
    }
    try {
      const data = JSON.parse(raw);
      return new BudgetCart(data.id, data.limit, data.items || []);
    } catch {
      return new BudgetCart(cartId, 250, []);
    }
  }

  public async saveCart(cart: BudgetCart): Promise<void> {
    const data = {
      id: cart.id,
      limit: cart.limit,
      items: cart.items,
    };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${cart.id}`, JSON.stringify(data));
  }
}
