import { BudgetCart } from '@clean/cart';
import { CartDTO } from '../dtos/cart-dto';

export class CartMapper {
  public static toDomain(dto: CartDTO): BudgetCart {
    return new BudgetCart(dto.id, dto.limit, dto.items || []);
  }

  public static toDTO(domain: BudgetCart): CartDTO {
    return {
      id: domain.id,
      limit: domain.limit,
      items: domain.items,
    };
  }
}
