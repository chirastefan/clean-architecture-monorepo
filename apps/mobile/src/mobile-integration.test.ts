import { describe, it, expect } from 'vitest';
import { mobileDependencies } from './ui/di-container';

describe('React Native Mobile Architecture Integration Tests (apps/mobile)', () => {
  it('should initialize mobile dependency injection container cleanly', () => {
    expect(mobileDependencies.cartUseCase).toBeDefined();
    expect(mobileDependencies.addItemUseCase).toBeDefined();
  });

  it('should execute AddItemUseCase on mobile platform with AsyncStorage adapter', async () => {
    const result = await mobileDependencies.addItemUseCase.execute(
      'mobile-cart-1',
      'Mobile Noise-Canceling Headphones',
      250,
      'electronics'
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.items).toHaveLength(1);
      expect(result.value.items[0].name).toBe('Mobile Noise-Canceling Headphones');
    }
  });

  it('should execute UpdateLimitUseCase on mobile platform', async () => {
    const result = await mobileDependencies.updateLimitUseCase.execute('mobile-cart-1', 600);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.limit).toBe(600);
    }
  });
});
