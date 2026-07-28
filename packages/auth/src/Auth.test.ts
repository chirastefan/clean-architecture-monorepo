import { describe, it, expect } from 'vitest';
import { UserEntity } from './domain/entities/user-entity';
import { LoginUseCase } from './domain/use-cases/login-use-case';

describe('Auth Domain Entity & Use Case (packages/auth)', () => {
  it('should instantiate UserEntity correctly', () => {
    const user = new UserEntity('u-1', 'alex@example.com', 'Alex');
    expect(user.id).toBe('u-1');
    expect(user.name).toBe('Alex');
  });

  it('should execute LoginUseCase via mock repository', async () => {
    const mockRepo = {
      login: async (email: string) => new UserEntity('u-1', email, 'Alex'),
    };
    const useCase = new LoginUseCase(mockRepo);

    const user = await useCase.execute('alex@example.com', 'password123');
    expect(user).not.toBeNull();
    expect(user?.email).toBe('alex@example.com');
  });
});
