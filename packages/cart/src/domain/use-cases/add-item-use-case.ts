import { BudgetCart } from '../entities/budget-cart';
import { Result, fail } from '../result/result';
import { CartRepositoryPort } from '../../ports/cart-repository-port';
import { NotificationPort } from '../../ports/notification-port';
import { IdGeneratorPort } from '../../ports/id-generator-port';
import { ClockPort } from '../../ports/clock-port';
import { DomainError } from '../errors/domain-error';
import { LoggerPort } from '@clean/logger';

export class AddItemUseCase {
  constructor(
    private readonly repository: CartRepositoryPort,
    private readonly notificationAdapter: NotificationPort,
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort,
    private readonly logger?: LoggerPort
  ) {}

  public async execute(
    cartId: string,
    name: string,
    price: number,
    category: string
  ): Promise<Result<BudgetCart, DomainError>> {
    this.logger?.info('Executing AddItemUseCase...', { cartId, name, price });

    const cart = await this.repository.getCart(cartId);

    const newItem = {
      id: this.idGenerator.generateId(),
      name,
      price,
      category,
      timestamp: this.clock.now(),
    };

    const addResult = cart.addItem(newItem);

    if (!addResult.ok) {
      this.logger?.warn('Failed to add item to cart', { error: addResult.error.message });
      this.notificationAdapter.notify(addResult.error.message, 'error');
      return fail(addResult.error);
    }

    await this.repository.saveCart(cart);

    this.notificationAdapter.notify(
      `Added "${name}" ($${price.toFixed(2)}) to planner.`,
      'success'
    );

    return addResult;
  }
}
