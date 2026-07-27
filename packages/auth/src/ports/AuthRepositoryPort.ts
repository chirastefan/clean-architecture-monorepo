import { UserEntity } from '../domain/entities/UserEntity';

export interface AuthRepositoryPort {
  findUserByEmail(email: string): Promise<UserEntity | null>;
}
