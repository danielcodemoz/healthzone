import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Droplets, Heart, Pill, BarChart3,
  Lightbulb, AlertTriangle, Settings, MoreHorizontal
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const main = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/water', icon: Droplets, label: 'Water' },
  { to: '/heart-rate', icon: Heart, label: 'Heart' },
  { to: '/analytics', icon: BarChart3, label: 'Stats' },
];
const more = [
  { to: '/medical', icon: Pill, label: 'Medical' },
  { to: '/tips', icon: Lightbulb, label: 'Tips' },
  { to: '/emergency', icon: AlertTriangle, label: 'Emergency' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function MobileNav() {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-surface-200/50 dark:border-surface-700/50">
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-surface-200/50 dark:border-surface-700/50">
            <div className="grid grid-cols-4 gap-1 p-2">
              {more.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} onClick={() => setExpanded(false)}
                  className={({ isActive }) => `flex flex-col items-center gap-1 py-2 rounded-xl text-xs ${isActive ? 'text-primary-500' : 'text-surface-500'}`}>
                  <Icon size={20} /><span>{label}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center justify-around py-2 px-1">
        {main.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-xs font-medium transition-colors ${isActive ? 'text-primary-500' : 'text-surface-400'}`}>
            <Icon size={22} /><span>{label}</span>
          </NavLink>
        ))}
        <button onClick={() => setExpanded(!expanded)} className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-xs font-medium text-surface-400">
          <MoreHorizontal size={22} /><span>More</span>
        </button>
      </div>
    </nav>
  );
}
