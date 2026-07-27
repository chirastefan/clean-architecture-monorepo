import { CartRepositoryPort } from '../../ports/CartRepositoryPort';
import { NotificationPort } from '../../ports/NotificationPort';
import { BudgetCart } from '../entities/BudgetCart';
import { DomainError } from '../errors/DomainError';
import { Result, ok, fail } from '../result/Result';

export class RemoveItemUseCase {
  constructor(
    private readonly cartRepository: CartRepositoryPort,
    private readonly notifier: NotificationPort
  ) {}

  public async execute(cartId: string, itemId: string): Promise<Result<BudgetCart>> {
    try {
      const cart = await this.cartRepository.getCart(cartId);

      cart.removeItem(itemId);

      await this.cartRepository.saveCart(cart);

      this.notifier.notify('Removed item from planner.', 'info');
      return ok(cart);
    } catch (error) {
      const domainError =
        error instanceof DomainError
          ? error
          : new DomainError('Failed to remove item.', 'REMOVE_ITEM_ERROR');

      this.notifier.notify(domainError.message, 'error');
      return fail(domainError);
    }
  }
}
