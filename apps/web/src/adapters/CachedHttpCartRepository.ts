import { type CartRepositoryPort, BudgetCart } from '@clean/cart';
import { CartMapper } from './mappers/CartMapper';
import { CartDTO } from './dtos/CartDTO';

const CACHE_PREFIX = 'offline-cache-cart-';

export class CachedHttpCartRepository implements CartRepositoryPort {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchClient: typeof fetch = fetch
  ) {}

  public async getCart(cartId: string): Promise<BudgetCart> {
    try {
      const response = await this.fetchClient(`${this.baseUrl}/api/carts/${cartId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const dto: CartDTO = await response.json();
        this.saveToLocalCache(cartId, dto);
        return CartMapper.toDomain(dto);
      }
    } catch {
      // Network offline
    }

    const cachedDto = this.loadFromLocalCache(cartId);
    return CartMapper.toDomain(cachedDto ?? CartMapper.defaultDTO(cartId));
  }

  public async saveCart(cart: BudgetCart): Promise<void> {
    const dto: CartDTO = CartMapper.toDTO(cart);

    this.saveToLocalCache(cart.id, dto);

    try {
      await this.fetchClient(`${this.baseUrl}/api/carts/${cart.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });
    } catch {
      // Saved offline
    }
  }

  private saveToLocalCache(cartId: string, dto: CartDTO): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(`${CACHE_PREFIX}${cartId}`, JSON.stringify(dto));
      }
    } catch (e) {
      console.error('Failed to write cache to localStorage', e);
    }
  }

  private loadFromLocalCache(cartId: string): CartDTO | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(`${CACHE_PREFIX}${cartId}`);
        return stored ? JSON.parse(stored) : null;
      }
    } catch {
      return null;
    }
    return null;
  }
}
