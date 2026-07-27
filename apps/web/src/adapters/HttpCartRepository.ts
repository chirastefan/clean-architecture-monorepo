import { type CartRepositoryPort, BudgetCart } from '@clean/cart';
import { CartMapper } from './mappers/CartMapper';
import { CartDTO } from './dtos/CartDTO';

export class HttpCartRepository implements CartRepositoryPort {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchClient: typeof fetch = fetch
  ) {}

  public async getCart(cartId: string): Promise<BudgetCart> {
    try {
      const response = await this.fetchClient(`${this.baseUrl}/api/carts/${cartId}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return CartMapper.toDomain(CartMapper.defaultDTO(cartId));
        }
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const dto: CartDTO = await response.json();
      return CartMapper.toDomain(dto);
    } catch {
      return CartMapper.toDomain(CartMapper.defaultDTO(cartId));
    }
  }

  public async saveCart(cart: BudgetCart): Promise<void> {
    const dto: CartDTO = CartMapper.toDTO(cart);

    const response = await this.fetchClient(`${this.baseUrl}/api/carts/${cart.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error(`Failed to persist cart to server (HTTP ${response.status}).`);
    }
  }
}
