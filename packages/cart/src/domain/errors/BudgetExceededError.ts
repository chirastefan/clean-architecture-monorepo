import { DomainError } from './DomainError';

export class BudgetExceededError extends DomainError {
  constructor(itemName: string, itemPrice: number, remaining: number) {
    super(
      `Cannot add "${itemName}" ($${itemPrice.toFixed(2)}) as it exceeds the remaining budget of $${remaining.toFixed(2)}.`,
      'BUDGET_EXCEEDED'
    );
  }
}
