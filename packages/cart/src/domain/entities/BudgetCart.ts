import { BudgetExceededError } from '../errors/BudgetExceededError';
import { InvalidBudgetLimitError } from '../errors/InvalidBudgetLimitError';
import { InvalidItemError } from '../errors/InvalidItemError';

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
    private _limit: number,
    private _items: CartItem[] = []
  ) {}

  public get limit(): number {
    return this._limit;
  }

  public get items(): CartItem[] {
    return [...this._items];
  }

  public updateLimit(newLimit: number): void {
    if (newLimit < 0) {
      throw new InvalidBudgetLimitError('Budget limit cannot be negative.');
    }
    const totalSpent = this.getTotalSpent();
    if (newLimit < totalSpent) {
      throw new InvalidBudgetLimitError(
        `Cannot lower budget limit to $${newLimit} because current spent amount is $${totalSpent}.`
      );
    }
    this._limit = newLimit;
  }

  public addItem(
    name: string,
    price: number,
    category: string,
    txId: string,
    timestamp: number
  ): void {
    if (!name.trim()) {
      throw new InvalidItemError('Item name cannot be empty.');
    }
    if (price <= 0) {
      throw new InvalidItemError('Item price must be greater than zero.');
    }

    const remaining = this.getRemainingBudget();
    if (price > remaining) {
      throw new BudgetExceededError(name, price, remaining);
    }

    this._items.unshift({
      id: txId,
      name: name.trim(),
      price,
      category,
      timestamp,
    });
  }

  public removeItem(itemId: string): void {
    this._items = this._items.filter((item) => item.id !== itemId);
  }

  public getTotalSpent(): number {
    return this._items.reduce((sum, item) => sum + item.price, 0);
  }

  public getRemainingBudget(): number {
    return this._limit - this.getTotalSpent();
  }
}
