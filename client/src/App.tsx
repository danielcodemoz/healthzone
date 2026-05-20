import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import DashboardLayout from './components/layout/DashboardLayout';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WaterTrackerPage = lazy(() => import('./pages/WaterTrackerPage'));
const HeartRatePage = lazy(() => import('./pages/HeartRatePage'));
const MedicalPage = lazy(() => import('./pages/MedicalPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const HealthTipsPage = lazy(() => import('./pages/HealthTipsPage'));
const TelemedicinePage = lazy(() => import('./pages/TelemedicinePage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
}

function Loader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrateTheme = useThemeStore((s) => s.hydrate);

  useEffect(() => { hydrate(); hydrateTheme(); }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="water" element={<WaterTrackerPage />} />
            <Route path="heart-rate" element={<HeartRatePage />} />
            <Route path="medical" element={<MedicalPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="tips" element={<HealthTipsPage />} />
            <Route path="telemedicine" element={<TelemedicinePage />} />
            <Route path="emergency" element={<EmergencyPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
