import { type CartRepositoryPort, BudgetCart } from '@clean/cart';
import { HttpCartRepository } from './http-cart-repository';

export class CachedHttpCartRepository implements CartRepositoryPort {
  private readonly httpRepository: HttpCartRepository;
  private readonly memoryCache = new Map<string, BudgetCart>();

  constructor(baseUrl: string) {
    this.httpRepository = new HttpCartRepository(baseUrl);
  }

  public async getCart(cartId: string): Promise<BudgetCart> {
    try {
      const cart = await this.httpRepository.getCart(cartId);
      this.memoryCache.set(cartId, cart);
      return cart;
    } catch (err) {
      console.warn('[CachedHttpCartRepository] Network failed, serving cached cart state.', err);
      const cached = this.memoryCache.get(cartId);
      if (cached) return cached;
      return new BudgetCart(cartId, 300, []);
    }
  }

  public async saveCart(cart: BudgetCart): Promise<void> {
    this.memoryCache.set(cart.id, cart);
    try {
      await this.httpRepository.saveCart(cart);
    } catch (err) {
      console.warn(
        '[CachedHttpCartRepository] Network sync failed, saved locally to memory cache.',
        err
      );
    }
  }
}
