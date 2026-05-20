import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Moon, Sun, Droplets, Save, Shield, Trash2, Users, UserCog } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ExportButtons from '../components/ui/ExportButtons';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useUIStore } from '../store/uiStore';
import { staggerContainer, staggerItem } from '../animations/variants';

interface UserRecord {
  id: number; name: string; username: string; is_admin: number; created_at: string;
}

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const addToast = useUIStore((s) => s.addToast);
  const [profile, setProfile] = useState({ name: '', dob: '', height: '', weight: '', blood_type: '' });
  const [waterGoal, setWaterGoal] = useState(2000);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (user) setProfile({ name: user.name, dob: user.dob || '', height: user.height?.toString() || '', weight: user.weight?.toString() || '', blood_type: user.blood_type || '' });
    api.get('/settings').then((r) => setWaterGoal(r.data.water_goal || 2000));
    if (user?.is_admin) loadUsers();
  }, [user]);

  const loadUsers = () => {
    setLoadingUsers(true);
    api.get('/auth/users').then((r) => setUsers(r.data)).finally(() => setLoadingUsers(false));
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/update', { ...profile, height: parseFloat(profile.height) || null, weight: parseFloat(profile.weight) || null });
      updateUser(data);
      await api.put('/settings', { theme, water_goal: waterGoal });
      addToast('Settings saved! ✅', 'success');
    } catch { addToast('Failed to save', 'error'); }
    setSaving(false);
  };

  const deleteUser = async (id: number, username: string) => {
    if (!confirm(`Delete user "${username}" and all their data? This cannot be undone.`)) return;
    try {
      await api.delete(`/auth/users/${id}`);
      addToast(`User "${username}" deleted`, 'success');
      loadUsers();
    } catch (err: any) { addToast(err.response?.data?.error || 'Failed to delete', 'error'); }
  };

  const getUsersExport = () => ({
    headers: ['ID', 'Name', 'Username', 'Admin', 'Created'],
    rows: users.map((u) => [`${u.id}`, u.name, u.username, u.is_admin ? 'Yes' : 'No', new Date(u.created_at).toLocaleDateString()]),
  });

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 max-w-2xl">
      <motion.div variants={staggerItem} className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-surface-200 dark:bg-surface-700"><UserCog size={24} className="text-surface-600 dark:text-surface-300" /></div>
        <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-surface-500 mt-0.5">Manage your profile and preferences</p></div>
      </motion.div>

      {/* Profile */}
      <motion.div variants={staggerItem}>
        <Card hover={false}>
          <h2 className="font-semibold mb-4 flex items-center gap-2"><User size={18} className="text-primary-500" /> Profile</h2>
          <div className="space-y-4">
            <Input label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Date of Birth" type="date" value={profile.dob} onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
              <Input label="Blood Type" value={profile.blood_type} onChange={(e) => setProfile({ ...profile, blood_type: e.target.value })} placeholder="e.g. O+" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Height (cm)" type="number" value={profile.height} onChange={(e) => setProfile({ ...profile, height: e.target.value })} />
              <Input label="Weight (kg)" type="number" value={profile.weight} onChange={(e) => setProfile({ ...profile, weight: e.target.value })} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={staggerItem}>
        <Card hover={false}>
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Settings size={18} className="text-surface-500" /> Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon size={18} className="text-violet-400" /> : <Sun size={18} className="text-amber-400" />}
                <div><p className="font-medium text-sm">Dark Mode</p><p className="text-xs text-surface-400">Switch appearance</p></div>
              </div>
              <button onClick={toggle} aria-label="Toggle dark mode" className={`w-12 h-6 rounded-full flex items-center p-0.5 transition-colors ${theme === 'dark' ? 'bg-primary-500 justify-end' : 'bg-surface-300 justify-start'}`}>
                <motion.div layout className="w-5 h-5 rounded-full bg-white shadow" />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3"><Droplets size={18} className="text-blue-500" /><div><p className="font-medium text-sm">Daily Water Goal</p><p className="text-xs text-surface-400">ml per day</p></div></div>
              <Input type="number" value={waterGoal} onChange={(e) => setWaterGoal(parseInt(e.target.value) || 2000)} className="w-28 text-right" />
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Button onClick={saveProfile} loading={saving} className="w-full sm:w-auto"><Save size={16} className="mr-2" /> Save Settings</Button>
      </motion.div>

      {/* Admin: User Management */}
      {user?.is_admin === 1 && (
        <motion.div variants={staggerItem}>
          <Card hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2"><Shield size={18} className="text-amber-500" /> User Management <span className="text-xs bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">Admin</span></h2>
              <ExportButtons title="User List" getData={getUsersExport} />
            </div>
            {loadingUsers ? <p className="text-sm text-surface-400">Loading...</p> : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold text-xs">{u.name.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-sm">{u.name} <span className="text-xs text-surface-400">@{u.username}</span></p>
                        <p className="text-xs text-surface-400">{new Date(u.created_at).toLocaleDateString()} {u.is_admin ? '· Admin' : ''}</p>
                      </div>
                    </div>
                    {u.id !== user.id && (
                      <button onClick={() => deleteUser(u.id, u.username)} className="text-red-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" aria-label="Delete user">
                        <Trash2 size={15} />
                      </button>
                    )}
                    {u.id === user.id && <span className="text-xs text-surface-400">You</span>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
