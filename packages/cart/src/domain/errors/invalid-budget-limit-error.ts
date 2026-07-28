import { DomainError } from './domain-error';

export class InvalidBudgetLimitError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBudgetLimitError';
  }
}
