import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { BudgetCart, CartUseCase } from '@clean/cart';
import { server } from './mocks/server';
import { HttpCartRepository } from './adapters/HttpCartRepository';
import { CachedHttpCartRepository } from './adapters/CachedHttpCartRepository';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('MSW Network Interception Integration Tests', () => {
  const BASE_URL = 'https://api.budgetplanner.internal';

  it('should intercept HttpCartRepository fetch requests and map DTO to BudgetCart domain entity', async () => {
    const httpRepo = new HttpCartRepository(BASE_URL);
    const cartUseCase = new CartUseCase(httpRepo);

    const result = await cartUseCase.execute('msw-cart-1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBeInstanceOf(BudgetCart);
      expect(result.value.id).toBe('msw-cart-1');
      expect(result.value.limit).toBe(450);
      expect(result.value.items).toHaveLength(1);
      expect(result.value.items[0].name).toBe('Wireless Ergonomic Mouse');
    }
  });

  it('should save cart changes via MSW intercepted HTTP PUT request', async () => {
    const httpRepo = new HttpCartRepository(BASE_URL);
    const cart = new BudgetCart('msw-cart-1', 600, []);

    await httpRepo.saveCart(cart);

    const cartUseCase = new CartUseCase(httpRepo);
    const result = await cartUseCase.execute('msw-cart-1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.limit).toBe(600);
    }
  });

  it('should support offline fallback using CachedHttpCartRepository intercepted by MSW', async () => {
    const cachedRepo = new CachedHttpCartRepository(BASE_URL);
    const cart = await cachedRepo.getCart('msw-cart-1');

    expect(cart).toBeInstanceOf(BudgetCart);
    expect(cart.id).toBe('msw-cart-1');
  });
});
