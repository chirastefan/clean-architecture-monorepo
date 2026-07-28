import { DomainError } from './domain-error';

export class BudgetExceededError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'BudgetExceededError';
  }
}
