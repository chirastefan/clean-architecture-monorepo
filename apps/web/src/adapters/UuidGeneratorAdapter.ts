import { type IdGeneratorPort } from '@clean/cart';

export class UuidGeneratorAdapter implements IdGeneratorPort {
  public generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `item-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }
}
