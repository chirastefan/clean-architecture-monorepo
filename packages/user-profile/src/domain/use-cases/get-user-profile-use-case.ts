import { type UserProfileRepositoryPort } from '../../ports/user-profile-repository-port';
import { type UserProfile } from '../entities/user-profile';

export class GetUserProfileUseCase {
  constructor(private readonly profileRepo: UserProfileRepositoryPort) {}

  public async execute(userId: string): Promise<UserProfile | null> {
    return this.profileRepo.getByUserId(userId);
  }
}
