import { DomainError } from './DomainError';

export class InvalidItemError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_ITEM');
  }
}
