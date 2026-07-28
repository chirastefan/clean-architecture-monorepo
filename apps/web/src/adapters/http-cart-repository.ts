import { type CartRepositoryPort, BudgetCart } from '@clean/cart';
import { CartDTO } from './dtos/cart-dto';
import { CartMapper } from './mappers/cart-mapper';

export class HttpCartRepository implements CartRepositoryPort {
  constructor(private readonly baseUrl: string) {}

  public async getCart(cartId: string): Promise<BudgetCart> {
    const res = await fetch(`${this.baseUrl}/api/carts/${cartId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch cart payload (Status ${res.status}).`);
    }
    const dto = (await res.json()) as CartDTO;
    return CartMapper.toDomain(dto);
  }

  public async saveCart(cart: BudgetCart): Promise<void> {
    const dto = CartMapper.toDTO(cart);
    const res = await fetch(`${this.baseUrl}/api/carts/${cart.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      throw new Error(`Failed to persist cart payload (Status ${res.status}).`);
    }
  }
}
