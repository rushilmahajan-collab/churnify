import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  stripeConnected: boolean;
  stripeSyncStatus: string;
}

export interface AuthState {
  user: User | null;
  org: Organization | null;
  token: string | null;

  setAuth: (user: User, org: Organization, token: string) => void;
  setUser: (user: User) => void;
  setOrg: (org: Organization) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      org: null,
      token: null,

      setAuth: (user, org, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', token);
        }
        set({ user, org, token });
      },

      setUser: (user) => set({ user }),

      setOrg: (org) => set({ org }),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
        }
        set({ user: null, org: null, token: null });
      },

      isAuthenticated: () => {
        const state = useAuthStore.getState();
        return !!state.token && !!state.user;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        org: state.org,
        token: state.token,
      }),
    }
  )
);
