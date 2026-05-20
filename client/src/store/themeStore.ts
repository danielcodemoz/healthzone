import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggle: () => void;
  setTheme: (t: 'light' | 'dark') => void;
  hydrate: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggle: () =>
    set((s) => {
      const next = s.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('hz_theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return { theme: next };
    }),
  setTheme: (t) => {
    localStorage.setItem('hz_theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    set({ theme: t });
  },
  hydrate: () => {
    const saved = localStorage.getItem('hz_theme') as 'light' | 'dark' | null;
    const theme = saved || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
}));
