import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { BudgetCart, type CartRepositoryPort } from '@clean/cart';
import { type CartDTO } from './dtos/cart-dto';
import { CartMapper } from './mappers/cart-mapper';

export class HttpCartRepository implements CartRepositoryPort {
  private readonly baseQuery;

  constructor(baseUrl: string) {
    this.baseQuery = fetchBaseQuery({ baseUrl });
  }

  public async getCart(cartId: string): Promise<BudgetCart> {
    const result = await this.baseQuery(`/api/carts/${cartId}`, {} as any, {});
    if (result.error) {
      throw new Error(`Failed to fetch cart payload: ${JSON.stringify(result.error)}`);
    }
    const dto = result.data as CartDTO;
    return CartMapper.toDomain(dto);
  }

  public async saveCart(cart: BudgetCart): Promise<void> {
    const dto = CartMapper.toDTO(cart);
    const result = await this.baseQuery(
      {
        url: `/api/carts/${cart.id}`,
        method: 'PUT',
        body: dto,
      },
      {} as any,
      {}
    );
    if (result.error) {
      throw new Error(`Failed to persist cart payload: ${JSON.stringify(result.error)}`);
    }
  }
}
