import { CartRepositoryPort } from '../../ports/CartRepositoryPort';
import { Result, ok, fail } from '../result/Result';
import { DomainError } from '../errors/DomainError';
import { BudgetCart } from '../entities/BudgetCart';

export class CartUseCase {
  constructor(
    private readonly cartRepository: CartRepositoryPort
  ) {}

  public async execute(cartId: string): Promise<Result<BudgetCart>> {
    try {
      const cart = await this.cartRepository.getCart(cartId);
      return ok(cart);
    } catch (error) {
      const domainError = error instanceof DomainError
        ? error
        : new DomainError(
            error instanceof Error ? error.message : 'Failed to load cart.',
            'CART_LOAD_ERROR'
          );
      return fail(domainError);
    }
  }
}
