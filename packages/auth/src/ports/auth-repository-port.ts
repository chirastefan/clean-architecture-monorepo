import { UserEntity } from '../domain/entities/user-entity';

export type AuthRepositoryPort = {
  login(email: string, pass: string): Promise<UserEntity | null>;
};
