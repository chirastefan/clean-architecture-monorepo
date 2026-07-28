import { AuthRepositoryPort } from '../../ports/auth-repository-port';
import { UserEntity } from '../entities/user-entity';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepositoryPort) {}

  public async execute(email: string, pass: string): Promise<UserEntity | null> {
    return this.authRepository.login(email, pass);
  }
}
