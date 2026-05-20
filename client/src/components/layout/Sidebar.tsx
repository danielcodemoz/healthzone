import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Droplets, Heart, Pill, BarChart3,
  Lightbulb, Video, AlertTriangle, Settings, LogOut, ChevronLeft, Activity
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/water', icon: Droplets, label: 'Water Tracker' },
  { to: '/heart-rate', icon: Heart, label: 'Heart Rate' },
  { to: '/medical', icon: Pill, label: 'Medical' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/tips', icon: Lightbulb, label: 'Health Tips' },
  { to: '/telemedicine', icon: Video, label: 'Telemedicine' },
  { to: '/emergency', icon: AlertTriangle, label: 'Emergency' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 260 : 76 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen sticky top-0 glass border-r border-surface-200/50 dark:border-surface-700/50 z-30"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-surface-200/50 dark:border-surface-700/50">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <Activity size={20} className="text-white" />
        </div>
        {sidebarOpen && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-lg bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            HealthZone
          </motion.span>
        )}
        <button onClick={toggleSidebar} className="ml-auto p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
          <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }}><ChevronLeft size={18} /></motion.div>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`
            }
          >
            <Icon size={20} className="flex-shrink-0" />
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-surface-200/50 dark:border-surface-700/50">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 w-full transition-all">
          <LogOut size={20} className="flex-shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
