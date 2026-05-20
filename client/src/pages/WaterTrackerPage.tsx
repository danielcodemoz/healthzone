import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, Trash2, GlassWater, CalendarDays, TrendingUp, Target } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import ExportButtons from '../components/ui/ExportButtons';
import { useUIStore } from '../store/uiStore';
import { staggerContainer, staggerItem } from '../animations/variants';
import type { WaterData } from '../types';

export default function WaterTrackerPage() {
  const [data, setData] = useState<WaterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ date: string; total: number }[]>([]);
  const addToast = useUIStore((s) => s.addToast);

  const load = useCallback(() => {
    Promise.all([api.get('/water'), api.get('/water/stats')])
      .then(([w, s]) => { setData(w.data); setStats(s.data); })
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const addWater = async (amount = 250) => {
    await api.post('/water', { amount });
    addToast(`+${amount}ml added! 💧`, 'success');
    load();
  };
  const removeEntry = async (id: number) => {
    await api.delete(`/water/${id}`);
    addToast('Entry removed', 'info');
    load();
  };

  const getExportData = () => ({
    headers: ['Date', 'Amount (ml)', 'Time'],
    rows: (data?.entries || []).map((e) => [e.date, `${e.amount}`, new Date(e.created_at).toLocaleTimeString()]),
  });
  const getWeeklyExportData = () => ({
    headers: ['Date', 'Total (ml)', 'Goal (ml)', 'Progress'],
    rows: stats.map((s) => [
      new Date(s.date + 'T00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
      `${s.total}`, `${data?.goal || 2000}`, `${Math.round((s.total / (data?.goal || 2000)) * 100)}%`,
    ]),
  });

  if (loading || !data) return <div className="animate-pulse-soft h-64 rounded-2xl bg-surface-200 dark:bg-surface-700" />;

  const pct = Math.round((data.total / data.goal) * 100);
  const glasses = Math.floor(data.total / 250);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem} className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10"><GlassWater size={24} className="text-blue-500" /></div>
          <div><h1 className="text-2xl font-bold">Water Tracker</h1><p className="text-surface-500 mt-0.5">Stay hydrated throughout the day</p></div>
        </div>
        <ExportButtons title="Water Intake Report" getData={getWeeklyExportData} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={staggerItem} className="lg:col-span-2">
          <Card hover={false} className="text-center space-y-6">
            <div className="relative w-48 h-48 mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" className="text-surface-200 dark:text-surface-700" strokeWidth="6" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="url(#waterGrad)" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${Math.min(pct, 100) * 5.65} 565`} transform="rotate(-90 100 100)" className="transition-all duration-1000" />
                <defs><linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets size={24} className="text-blue-500 mb-1" />
                <span className="text-3xl font-bold">{Math.min(pct, 100)}%</span>
                <span className="text-xs text-surface-500">{data.total} / {data.goal} ml</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {Array.from({ length: Math.ceil(data.goal / 250) }).map((_, i) => (
                <div key={i} className={`w-6 h-8 rounded-b-lg border-2 transition-colors ${i < glasses ? 'bg-blue-400/30 border-blue-400' : 'border-surface-300 dark:border-surface-600'}`} />
              ))}
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => addWater(150)}><Plus size={16} className="mr-1" /> 150ml</Button>
              <Button onClick={() => addWater(250)}><Plus size={16} className="mr-1" /> 250ml</Button>
              <Button variant="outline" size="sm" onClick={() => addWater(500)}><Plus size={16} className="mr-1" /> 500ml</Button>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem} className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2"><CalendarDays size={16} className="text-blue-500" /> Weekly History</h3>
            </div>
            <div className="space-y-3">
              {stats.map((s) => (
                <div key={s.date} className="space-y-1">
                  <div className="flex justify-between text-xs text-surface-500">
                    <span>{new Date(s.date + 'T00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <span>{s.total}ml</span>
                  </div>
                  <ProgressBar value={s.total} max={data.goal} color="from-blue-400 to-cyan-400" height="h-2" />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2"><TrendingUp size={16} className="text-blue-500" /> Today's Log</h3>
              <ExportButtons title="Today's Water Log" getData={getExportData} />
            </div>
            {data.entries.length === 0 && <p className="text-sm text-surface-400">No entries yet today</p>}
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {data.entries.map((e) => (
                <div key={e.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 group">
                  <div className="flex items-center gap-2 text-sm"><Droplets size={14} className="text-blue-400" /><span>{e.amount}ml</span></div>
                  <button onClick={() => removeEntry(e.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity" aria-label="Remove entry"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
