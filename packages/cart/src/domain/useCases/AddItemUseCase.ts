import { type LoggerPort } from '@clean/logger';
import { CartRepositoryPort } from '../../ports/CartRepositoryPort';
import { NotificationPort } from '../../ports/NotificationPort';
import { IdGeneratorPort } from '../../ports/IdGeneratorPort';
import { ClockPort } from '../../ports/ClockPort';
import { BudgetCart } from '../entities/BudgetCart';
import { DomainError } from '../errors/DomainError';
import { Result, ok, fail } from '../result/Result';

export class AddItemUseCase {
  constructor(
    private readonly cartRepository: CartRepositoryPort,
    private readonly notifier: NotificationPort,
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort,
    private readonly logger?: LoggerPort
  ) {}

  public async execute(
    cartId: string,
    name: string,
    price: number,
    category: string
  ): Promise<Result<BudgetCart>> {
    try {
      this.logger?.info('Executing AddItemUseCase...', { cartId, name, price });

      const cart = await this.cartRepository.getCart(cartId);

      const txId = this.idGenerator.generateId();
      const timestamp = this.clock.now();

      cart.addItem(name, price, category, txId, timestamp);

      await this.cartRepository.saveCart(cart);

      this.notifier.notify(`Added "${name}" ($${price.toFixed(2)}) to planner.`, 'success');
      return ok(cart);
    } catch (error) {
      const domainError = error instanceof DomainError
        ? error
        : new DomainError('Failed to add item.', 'ADD_ITEM_ERROR');

      this.logger?.error('AddItemUseCase failed', domainError);
      this.notifier.notify(domainError.message, 'error');
      return fail(domainError);
    }
  }
}
