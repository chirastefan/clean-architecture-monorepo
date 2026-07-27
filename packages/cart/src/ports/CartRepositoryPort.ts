import { BudgetCart } from '../domain/entities/BudgetCart';

export interface CartRepositoryPort {
  getCart(cartId: string): Promise<BudgetCart>;
  saveCart(cart: BudgetCart): Promise<void>;
}
