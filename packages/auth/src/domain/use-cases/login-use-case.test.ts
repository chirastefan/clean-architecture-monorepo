import { describe, expect, it } from 'vitest';

import { UserEntity } from '../entities/user-entity';
import { LoginUseCase } from './login-use-case';

describe('LoginUseCase (packages/auth)', () => {
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
