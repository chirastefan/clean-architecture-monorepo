export type UserProfile = {
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  themePreference: 'light' | 'dark' | 'system';
};
