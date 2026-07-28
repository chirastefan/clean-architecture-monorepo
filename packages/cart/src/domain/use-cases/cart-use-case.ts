import { BudgetCart } from '../entities/budget-cart';
import { Result, ok, fail } from '../result/result';
import { CartRepositoryPort } from '../../ports/cart-repository-port';
import { DomainError } from '../errors/domain-error';

export class CartUseCase {
  constructor(private readonly repository: CartRepositoryPort) {}

  public async execute(cartId: string): Promise<Result<BudgetCart, DomainError>> {
    try {
      const cart = await this.repository.getCart(cartId);
      return ok(cart);
    } catch (err: any) {
      return fail(new DomainError(err.message || 'Failed to retrieve budget cart state.'));
    }
  }
}
