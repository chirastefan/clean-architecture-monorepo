import { AuthRepositoryPort } from '../../ports/AuthRepositoryPort';
import { UserEntity } from '../entities/UserEntity';

export class LoginUseCase {
  constructor(private readonly authRepo: AuthRepositoryPort) {}

  public async execute(email: string): Promise<UserEntity> {
    const user = await this.authRepo.findUserByEmail(email);
    if (!user) {
      throw new Error(`User with email "${email}" not found.`);
    }
    return user;
  }
}
