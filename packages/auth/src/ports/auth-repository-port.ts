import { UserEntity } from '../domain/entities/user-entity';

export interface AuthRepositoryPort {
  login(email: string, pass: string): Promise<UserEntity | null>;
}
