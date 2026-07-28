import { BudgetCart } from '../domain/entities/budget-cart';

export interface CartRepositoryPort {
  getCart(cartId: string): Promise<BudgetCart>;
  saveCart(cart: BudgetCart): Promise<void>;
}
