import { create } from 'zustand';
import { UserEntity, type Permission, hasPermission } from '@clean/auth';

export type AuthStoreState = {
  user: UserEntity | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
};

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: new UserEntity('user-1', 'admin@example.com', 'Admin User', ['admin']),
  loading: false,
  error: null,

  login: async (email: string, _pass: string) => {
    set({ loading: true, error: null });
    try {
      // Demo mock authentication returning user with admin & editor roles
      const user = new UserEntity('user-1', email, 'Authenticated User', ['admin', 'editor']);
      set({ user, loading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  logout: () => {
    set({ user: null, error: null });
  },

  hasPermission: (permission: Permission) => {
    const user = get().user;
    if (!user) return false;
    return hasPermission(user.roles, permission);
  },
}));
