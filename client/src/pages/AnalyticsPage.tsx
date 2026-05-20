import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Droplets, Heart } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../services/api';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import ExportButtons from '../components/ui/ExportButtons';
import { staggerContainer, staggerItem } from '../animations/variants';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/analytics/weekly').then((r) => setData(r.data)).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{[1, 2].map((i) => <Skeleton key={i} className="h-80" />)}</div>;

  const waterData = (data?.water || []).map((w: any) => ({
    date: new Date(w.date + 'T00:00').toLocaleDateString('en', { weekday: 'short' }), total: w.total,
  }));
  const hrData = (data?.heartRate || []).map((h: any) => ({
    date: new Date(h.date + 'T00:00').toLocaleDateString('en', { weekday: 'short' }), bpm: h.avg_bpm,
  }));

  const getWaterExport = () => ({ headers: ['Day', 'Total (ml)'], rows: waterData.map((w: any) => [w.date, `${w.total}`]) });
  const getHrExport = () => ({ headers: ['Day', 'Avg BPM'], rows: hrData.map((h: any) => [h.date, `${Math.round(h.bpm)}`]) });
  const tooltipStyle = { borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem} className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/10"><BarChart3 size={24} className="text-indigo-500" /></div>
        <div><h1 className="text-2xl font-bold">Analytics</h1><p className="text-surface-500 mt-0.5">Your weekly health insights</p></div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={staggerItem}>
          <Card hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><Droplets size={18} className="text-blue-500" /> Hydration (Weekly)</h3>
              <ExportButtons title="Hydration Weekly" getData={getWaterExport} />
            </div>
            {waterData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={waterData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="total" fill="url(#waterBarGrad)" radius={[8, 8, 0, 0]} />
                  <defs><linearGradient id="waterBarGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-surface-400 text-center py-16">No hydration data this week</p>}
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><Heart size={18} className="text-red-500" /> Heart Rate (Weekly Avg)</h3>
              <ExportButtons title="Heart Rate Weekly" getData={getHrExport} />
            </div>
            {hrData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={hrData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis domain={[50, 120]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <defs><linearGradient id="hrAreaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient></defs>
                  <Area type="monotone" dataKey="bpm" stroke="#ef4444" fill="url(#hrAreaGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <p className="text-surface-400 text-center py-16">No heart rate data this week</p>}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
