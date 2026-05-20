import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, Droplets, Heart, Pill, BarChart3, Lightbulb, Video, AlertTriangle, Settings } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const commands = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Water Tracker', to: '/water', icon: Droplets },
  { label: 'Heart Rate', to: '/heart-rate', icon: Heart },
  { label: 'Medical', to: '/medical', icon: Pill },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Health Tips', to: '/tips', icon: Lightbulb },
  { label: 'Telemedicine', to: '/telemedicine', icon: Video },
  { label: 'Emergency', to: '/emergency', icon: AlertTriangle },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPalette } = useUIStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filtered = useMemo(() =>
    commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCommandPalette(!commandPaletteOpen); }
      if (e.key === 'Escape') setCommandPalette(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, setCommandPalette]);

  useEffect(() => { if (!commandPaletteOpen) setQuery(''); }, [commandPaletteOpen]);

  const go = (to: string) => { navigate(to); setCommandPalette(false); };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setCommandPalette(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg glass-card overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200/50 dark:border-surface-700/50">
              <Search size={18} className="text-surface-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pages..."
                className="flex-1 bg-transparent outline-none text-sm" autoFocus />
            </div>
            <div className="max-h-64 overflow-y-auto py-2 px-2">
              {filtered.length === 0 && <p className="text-sm text-surface-400 text-center py-4">No results found</p>}
              {filtered.map((c) => (
                <button key={c.to} onClick={() => go(c.to)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-left">
                  <c.icon size={18} className="text-surface-400" />
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
