import { BudgetCart } from '../entities/budget-cart';
import { Result, ok, fail } from '../result/result';
import { CartRepositoryPort } from '../../ports/cart-repository-port';
import { NotificationPort } from '../../ports/notification-port';
import { DomainError } from '../errors/domain-error';

export class UpdateLimitUseCase {
  constructor(
    private readonly repository: CartRepositoryPort,
    private readonly notificationAdapter: NotificationPort
  ) {}

  public async execute(cartId: string, newLimit: number): Promise<Result<BudgetCart, DomainError>> {
    const cart = await this.repository.getCart(cartId);

    const limitResult = cart.setLimit(newLimit);
    if (!limitResult.ok) {
      this.notificationAdapter.notify(limitResult.error.message, 'error');
      return fail(limitResult.error);
    }

    await this.repository.saveCart(cart);

    this.notificationAdapter.notify(
      `Updated monthly budget limit to $${newLimit.toFixed(2)}.`,
      'info'
    );

    return ok(cart);
  }
}
