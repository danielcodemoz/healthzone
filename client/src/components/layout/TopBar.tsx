import { Search, Moon, Sun, Bell, Command } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

export default function TopBar() {
  const { theme, toggle } = useThemeStore();
  const setCommandPalette = useUIStore((s) => s.setCommandPalette);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-20 h-16 glass border-b border-surface-200/50 dark:border-surface-700/50 flex items-center justify-between px-4 md:px-8 gap-4">
      {/* Search */}
      <button
        onClick={() => setCommandPalette(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-400 text-sm hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors flex-1 max-w-md"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Search or command...</span>
        <kbd className="hidden sm:inline ml-auto text-xs bg-surface-200 dark:bg-surface-700 px-1.5 py-0.5 rounded font-mono">
          <Command size={10} className="inline mr-0.5" />K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <button onClick={toggle} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
        </button>
        <button className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm ml-1">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
}
