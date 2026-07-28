import { Result, ok, fail } from '../result/result';
import { BudgetExceededError } from '../errors/budget-exceeded-error';
import { InvalidBudgetLimitError } from '../errors/invalid-budget-limit-error';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  timestamp: number;
};

export class BudgetCart {
  constructor(
    public readonly id: string,
    public limit: number = 300,
    public items: CartItem[] = []
  ) {}

  public getTotalSpent(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  public getRemainingBudget(): number {
    return this.limit - this.getTotalSpent();
  }

  public setLimit(newLimit: number): Result<void, InvalidBudgetLimitError> {
    if (newLimit < 0) {
      return fail(new InvalidBudgetLimitError('Budget limit cannot be negative.'));
    }
    this.limit = newLimit;
    return ok(undefined);
  }

  public addItem(
    item: CartItem
  ): Result<BudgetCart, BudgetExceededError | InvalidBudgetLimitError> {
    if (item.price <= 0) {
      return fail(new InvalidBudgetLimitError('Item price must be greater than zero.'));
    }

    const currentTotal = this.getTotalSpent();
    if (currentTotal + item.price > this.limit) {
      return fail(
        new BudgetExceededError(
          `Adding "${item.name}" ($${item.price.toFixed(2)}) exceeds monthly limit of $${this.limit.toFixed(2)}. Remaining: $${this.getRemainingBudget().toFixed(2)}`
        )
      );
    }

    this.items.push(item);
    return ok(this);
  }

  public removeItem(itemId: string): void {
    this.items = this.items.filter((item) => item.id !== itemId);
  }
}
