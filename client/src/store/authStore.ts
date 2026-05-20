import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    localStorage.setItem('hz_token', token);
    localStorage.setItem('hz_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  updateUser: (user) => {
    localStorage.setItem('hz_user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('hz_token');
    localStorage.removeItem('hz_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  hydrate: () => {
    const token = localStorage.getItem('hz_token');
    const userStr = localStorage.getItem('hz_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch { /* ignore */ }
    }
  },
}));
