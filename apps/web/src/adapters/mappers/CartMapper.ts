import { BudgetCart, type CartItem } from '@clean/cart';
import { CartDTO, CartItemDTO } from '../dtos/CartDTO';

const DEFAULT_LIMIT = 250;

export class CartMapper {
  public static toDomain(dto: CartDTO): BudgetCart {
    const items: CartItem[] = (dto.items ?? []).map((raw: CartItemDTO) => ({
      id: raw.id,
      name: raw.name,
      price: raw.price,
      category: raw.category,
      timestamp: raw.timestamp,
    }));
    return new BudgetCart(dto.id, dto.limit ?? DEFAULT_LIMIT, items);
  }

  public static toDTO(cart: BudgetCart): CartDTO {
    return {
      id: cart.id,
      limit: cart.limit,
      items: cart.items.map((item: CartItem): CartItemDTO => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        timestamp: item.timestamp,
      })),
    };
  }

  public static defaultDTO(cartId: string): CartDTO {
    return { id: cartId, limit: DEFAULT_LIMIT, items: [] };
  }
}
