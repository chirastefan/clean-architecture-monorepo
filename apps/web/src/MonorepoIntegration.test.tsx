import { describe, it, expect } from 'vitest';
import { BudgetCart, AddItemUseCase } from '@clean/cart';
import { UserEntity, LoginUseCase } from '@clean/auth';
import { LocalStorageCartRepository } from './adapters/LocalStorageCartRepository';
import { CartMapper } from './adapters/mappers/CartMapper';

describe('Clean Architecture Monorepo Integration Tests (apps/web)', () => {
  it('should import domain entities and use cases from @clean/cart', () => {
    const cart = new BudgetCart('mono-cart-1', 500);
    expect(cart.id).toBe('mono-cart-1');
    expect(cart.limit).toBe(500);
    expect(AddItemUseCase).toBeDefined();
  });

  it('should import domain entities and use cases from @clean/auth', () => {
    const user = new UserEntity('u-100', 'alex@example.com', 'Alex');
    expect(user.name).toBe('Alex');
    expect(LoginUseCase).toBeDefined();
  });

  it('should allow web adapters to implement ports from @clean/cart', async () => {
    const repo = new LocalStorageCartRepository();
    const cart = await repo.getCart('mono-test');
    expect(cart).toBeInstanceOf(BudgetCart);
  });

  it('should map DTOs using web CartMapper to domain entities', () => {
    const dto = { id: 'mono-dto', limit: 300, items: [] };
    const domain = CartMapper.toDomain(dto);
    expect(domain).toBeInstanceOf(BudgetCart);
    expect(domain.limit).toBe(300);
  });
});
