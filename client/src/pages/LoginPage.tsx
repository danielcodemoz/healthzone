import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, User, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function LoginPage() {
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-500/10 via-surface-50 to-accent-500/10 dark:from-primary-900/30 dark:via-surface-900 dark:to-accent-900/30">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Activity size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-surface-500 text-sm mt-1">Sign in to your HealthZone account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-xl">{error}</div>}
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 mt-3" />
            <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-10" placeholder="your username" required autoFocus />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 mt-3" />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" placeholder="••••••" required />
          </div>
          <Button type="submit" className="w-full" loading={loading}>Sign In</Button>
        </form>

        <p className="text-center text-sm text-surface-500 mt-6">
          Don't have an account? <Link to="/register" className="text-primary-500 font-semibold hover:underline">Create one</Link>
        </p>
        <div className="mt-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-center">
          <p className="text-xs text-primary-600 dark:text-primary-300 font-medium">🔑 Demo Account: <strong>demo</strong> / <strong>demo123</strong></p>
        </div>
      </motion.div>
    </div>
  );
}
