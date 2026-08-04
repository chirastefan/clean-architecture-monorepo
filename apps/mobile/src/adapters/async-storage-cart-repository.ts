import { type CartRepositoryPort, BudgetCart } from '@clean/cart';

const ASYNC_STORAGE_PREFIX = '@mobile_cart_';

export type AsyncStorageLike = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

export class InMemoryAsyncStorage implements AsyncStorageLike {
  private store = new Map<string, string>();
  public async getItem(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }
  public async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }
}

export class AsyncStorageCartRepository implements CartRepositoryPort {
  constructor(private readonly storage: AsyncStorageLike = new InMemoryAsyncStorage()) {}

  public async getCart(cartId: string): Promise<BudgetCart> {
    try {
      const raw = await this.storage.getItem(`${ASYNC_STORAGE_PREFIX}${cartId}`);
      if (!raw) {
        return new BudgetCart(cartId, 300, []);
      }
      const data = JSON.parse(raw);
      return new BudgetCart(data.id, data.limit ?? 300, data.items ?? []);
    } catch {
      return new BudgetCart(cartId, 300, []);
    }
  }

  public async saveCart(cart: BudgetCart): Promise<void> {
    const payload = JSON.stringify({
      id: cart.id,
      limit: cart.limit,
      items: cart.items,
    });
    await this.storage.setItem(`${ASYNC_STORAGE_PREFIX}${cart.id}`, payload);
  }
}
