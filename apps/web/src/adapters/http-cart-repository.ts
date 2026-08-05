import { BudgetCart, type CartRepositoryPort } from '@clean/cart';
import { cartApi } from './cart-api';
import { type CartDTO } from './dtos/cart-dto';
import { CartMapper } from './mappers/cart-mapper';

export class HttpCartRepository implements CartRepositoryPort {
  constructor(private readonly dispatch: any) {}

  public async getCart(cartId: string): Promise<BudgetCart> {
    const result = await this.dispatch(cartApi.endpoints.getCartById.initiate(cartId)).unwrap();
    return CartMapper.toDomain(result as CartDTO);
  }

  public async saveCart(cart: BudgetCart): Promise<void> {
    const dto = CartMapper.toDTO(cart);
    await this.dispatch(cartApi.endpoints.updateCart.initiate(dto)).unwrap();
  }
}
