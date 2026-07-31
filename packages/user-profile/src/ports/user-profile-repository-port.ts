import { type UserProfile } from '../domain/entities/user-profile';

export type UserProfileRepositoryPort = {
  getByUserId(userId: string): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<void>;
};
