import { Injectable } from '@nestjs/common';

export type UserProfileDto = {
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  themePreference: 'light' | 'dark' | 'system';
};

@Injectable()
export class UserProfileService {
  private readonly profileStore = new Map<string, UserProfileDto>([
    [
      'user-1',
      {
        userId: 'user-1',
        displayName: 'Stefan Chira',
        bio: 'Clean Architecture Monorepo Specialist',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        themePreference: 'dark',
      },
    ],
  ]);

  getProfile(userId: string): UserProfileDto {
    const existing = this.profileStore.get(userId);
    if (!existing) {
      const defaultProfile: UserProfileDto = {
        userId,
        displayName: 'New User',
        bio: 'Welcome to the platform!',
        themePreference: 'system',
      };
      this.profileStore.set(userId, defaultProfile);
      return defaultProfile;
    }
    return existing;
  }

  saveProfile(userId: string, payload: UserProfileDto): UserProfileDto {
    const profile = { ...payload, userId };
    this.profileStore.set(userId, profile);
    return profile;
  }
}
