import { DomainError } from './DomainError';

export class InvalidBudgetLimitError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_BUDGET_LIMIT');
  }
}
