import { CartRepositoryPort } from '../../ports/CartRepositoryPort';
import { NotificationPort } from '../../ports/NotificationPort';
import { BudgetCart } from '../entities/BudgetCart';
import { DomainError } from '../errors/DomainError';
import { Result, ok, fail } from '../result/Result';

export class UpdateLimitUseCase {
  constructor(
    private readonly cartRepository: CartRepositoryPort,
    private readonly notifier: NotificationPort
  ) {}

  public async execute(cartId: string, limit: number): Promise<Result<BudgetCart>> {
    try {
      const cart = await this.cartRepository.getCart(cartId);

      cart.updateLimit(limit);

      await this.cartRepository.saveCart(cart);

      this.notifier.notify(`Budget goal updated to $${limit.toFixed(2)}`, 'success');
      return ok(cart);
    } catch (error) {
      const domainError = error instanceof DomainError
        ? error
        : new DomainError('Failed to update budget limit.', 'UPDATE_LIMIT_ERROR');

      this.notifier.notify(domainError.message, 'error');
      return fail(domainError);
    }
  }
}
