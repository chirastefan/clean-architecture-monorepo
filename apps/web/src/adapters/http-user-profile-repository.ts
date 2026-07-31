import { type UserProfile, type UserProfileRepositoryPort } from '@clean/user-profile';

export class HttpUserProfileRepository implements UserProfileRepositoryPort {
  constructor(private readonly baseUrl: string = 'http://localhost:4000') {}

  public async getByUserId(userId: string): Promise<UserProfile | null> {
    const res = await fetch(`${this.baseUrl}/api/user-profiles/${userId}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch user profile (Status ${res.status}).`);
    }
    return (await res.json()) as UserProfile;
  }

  public async save(profile: UserProfile): Promise<void> {
    const res = await fetch(`${this.baseUrl}/api/user-profiles/${profile.userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) {
      throw new Error(`Failed to save user profile (Status ${res.status}).`);
    }
  }
}
