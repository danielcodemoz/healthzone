import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import ToastContainer from '../ui/Toast';
import CommandPalette from '../common/CommandPalette';
import OfflineBanner from '../common/OfflineBanner';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <OfflineBanner />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <ToastContainer />
      <CommandPalette />
    </div>
  );
}
