import { describe, it, expect, vi } from 'vitest';
import { UserEntity } from './domain/entities/UserEntity';
import { LoginUseCase } from './domain/useCases/LoginUseCase';
import { AuthRepositoryPort } from './ports/AuthRepositoryPort';

describe('Auth Feature Package Tests (@domain/auth)', () => {
  it('should create valid UserEntity', () => {
    const user = new UserEntity('u1', 'user@example.com', 'Alice');
    expect(user.email).toBe('user@example.com');
  });

  it('should execute LoginUseCase and return UserEntity', async () => {
    const mockUser = new UserEntity('u1', 'user@example.com', 'Alice');
    const mockRepo: AuthRepositoryPort = {
      findUserByEmail: vi.fn().mockResolvedValue(mockUser),
    };

    const loginUseCase = new LoginUseCase(mockRepo);
    const user = await loginUseCase.execute('user@example.com');

    expect(user.name).toBe('Alice');
  });
});
