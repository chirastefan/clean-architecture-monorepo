import { DomainError } from './domain-error';

export class InvalidItemError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidItemError';
  }
}
