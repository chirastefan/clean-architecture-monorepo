import { BudgetCart } from '../entities/budget-cart';
import { Result, ok } from '../result/result';
import { CartRepositoryPort } from '../../ports/cart-repository-port';
import { NotificationPort } from '../../ports/notification-port';
import { DomainError } from '../errors/domain-error';

export class RemoveItemUseCase {
  constructor(
    private readonly repository: CartRepositoryPort,
    private readonly notificationAdapter: NotificationPort
  ) {}

  public async execute(cartId: string, itemId: string): Promise<Result<BudgetCart, DomainError>> {
    const cart = await this.repository.getCart(cartId);
    const itemToRemove = cart.items.find((i) => i.id === itemId);

    cart.removeItem(itemId);
    await this.repository.saveCart(cart);

    if (itemToRemove) {
      this.notificationAdapter.notify(`Removed "${itemToRemove.name}" from planner.`, 'info');
    }

    return ok(cart);
  }
}
