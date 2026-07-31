import { create } from 'zustand';
import { type UserProfile, GetUserProfileUseCase } from '@clean/user-profile';
import { HttpUserProfileRepository } from '../../adapters/http-user-profile-repository';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const profileRepository = new HttpUserProfileRepository(apiUrl);
const getUserProfileUseCase = new GetUserProfileUseCase(profileRepository);

export type UserProfileStoreState = {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
};

export const useUserProfileStore = create<UserProfileStoreState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const profile = await getUserProfileUseCase.execute(userId);
      set({ profile, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateProfile: async (profile: UserProfile) => {
    set({ loading: true, error: null });
    try {
      await profileRepository.save(profile);
      set({ profile, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
