import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, TrendingUp, HeartPulse, Clock, AlertCircle, Trash2, Pencil } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ExportButtons from '../components/ui/ExportButtons';
import { useUIStore } from '../store/uiStore';
import { staggerContainer, staggerItem } from '../animations/variants';
import type { HeartRateLog } from '../types';

function getBpmZone(bpm: number) {
  if (bpm < 60) return { label: 'Bradycardia', color: '#3b82f6', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' };
  if (bpm <= 100) return { label: 'Normal', color: '#10b981', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
  if (bpm <= 120) return { label: 'Elevated', color: '#f59e0b', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' };
  return { label: 'Tachycardia', color: '#ef4444', bg: 'bg-red-500/10 text-red-600 dark:text-red-400' };
}

export default function HeartRatePage() {
  const [logs, setLogs] = useState<HeartRateLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [bpm, setBpm] = useState('');
  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const addToast = useUIStore((s) => s.addToast);

  const load = useCallback(() => {
    Promise.all([api.get('/heart-rate'), api.get('/heart-rate/stats')])
      .then(([l, s]) => { setLogs(l.data); setStats(s.data); })
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    const v = parseInt(bpm);
    if (!v || v < 30 || v > 250) return addToast('BPM must be 30-250', 'error');
    if (modal === 'add') {
      await api.post('/heart-rate', { bpm: v, note });
      addToast('Heart rate logged! ❤️', 'success');
    } else {
      await api.put(`/heart-rate/${editingId}`, { bpm: v, note });
      addToast('Log updated!', 'success');
    }
    setBpm(''); setNote(''); setModal(null); setEditingId(null); load();
  };

  const removeLog = async (id: number) => {
    await api.delete(`/heart-rate/${id}`);
    addToast('Log removed', 'info');
    load();
  };

  const getExportData = () => ({
    headers: ['Date/Time', 'BPM', 'Status', 'Note'],
    rows: logs.map((l) => [
      new Date(l.recorded_at).toLocaleString(),
      `${l.bpm}`,
      getBpmZone(l.bpm).label,
      l.note || '-',
    ]),
  });

  const chartData = (stats?.history || []).map((h: any) => ({
    date: new Date(h.date + 'T00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    avg: Math.round(h.avg_bpm),
  }));
  const latest = stats?.latest;
  const zone = latest ? getBpmZone(latest) : null;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem} className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10"><HeartPulse size={24} className="text-red-500" /></div>
          <div><h1 className="text-2xl font-bold">Heart Rate</h1><p className="text-surface-500 mt-0.5">Monitor your cardiovascular health</p></div>
        </div>
        <div className="flex items-center gap-3">
          <ExportButtons title="Heart Rate Report" getData={getExportData} />
          <Button onClick={() => { setBpm(''); setNote(''); setModal('add'); }}><Plus size={16} className="mr-1" /> Log BPM</Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={staggerItem}>
          <Card className="text-center space-y-4">
            <Heart size={40} className={`mx-auto ${latest ? 'text-red-500 animate-pulse' : 'text-surface-300'}`} />
            {latest ? (<>
              <div className="text-5xl font-bold">{latest}</div>
              <span className="text-sm text-surface-400">BPM</span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${zone!.bg}`}>{zone!.label}</span>
              <div className="flex items-center justify-center gap-1 text-xs text-surface-400"><Clock size={12} /> Last reading</div>
            </>) : (
              <div className="space-y-2"><AlertCircle size={20} className="mx-auto text-surface-300" /><p className="text-surface-400 text-sm">No readings yet</p></div>
            )}
          </Card>
        </motion.div>

        <motion.div variants={staggerItem} className="lg:col-span-2">
          <Card hover={false}>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-red-500" /> BPM Trends</h3>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <defs><linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis domain={[40, 140]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <ReferenceLine y={60} stroke="#3b82f6" strokeDasharray="4 4" /><ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="avg" stroke="#ef4444" fill="url(#hrGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <p className="text-surface-400 text-sm text-center py-12">Log at least 2 readings for chart</p>}
          </Card>
        </motion.div>
      </div>

      <motion.div variants={staggerItem}>
        <Card hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Clock size={16} /> Recent Readings</h3>
          </div>
          <div className="space-y-2">
            {logs.slice(0, 15).map((l) => { const z = getBpmZone(l.bpm); return (
              <div key={l.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800">
                <div className="flex items-center gap-3">
                  <Heart size={16} style={{ color: z.color }} />
                  <span className="font-semibold">{l.bpm} BPM</span>
                  <span className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded-full ${z.bg}`}>{z.label}</span>
                  {l.note && <span className="text-xs text-surface-400 hidden md:inline-block">· {l.note}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-surface-400">{new Date(l.recorded_at).toLocaleString()}</span>
                  <button onClick={() => { setBpm(l.bpm.toString()); setNote(l.note || ''); setEditingId(l.id); setModal('edit'); }} className="text-primary-400 hover:text-primary-500 p-1.5" aria-label="Edit"><Pencil size={14} /></button>
                  <button onClick={() => removeLog(l.id)} className="text-red-400 hover:text-red-500 p-1.5" aria-label="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            ); })}
            {logs.length === 0 && <p className="text-sm text-surface-400 text-center py-4">No readings yet</p>}
          </div>
        </Card>
      </motion.div>

      <Modal open={!!modal} onClose={() => { setModal(null); setEditingId(null); }} title={modal === 'edit' ? 'Edit Heart Rate' : 'Log Heart Rate'}>
        <div className="space-y-4">
          <Input label="BPM" type="number" value={bpm} onChange={(e) => setBpm(e.target.value)} placeholder="e.g. 72" autoFocus />
          <Input label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. After exercise" />
          <div className="flex gap-3 justify-end"><Button variant="ghost" onClick={() => { setModal(null); setEditingId(null); }}>Cancel</Button><Button onClick={submit}>{modal === 'edit' ? 'Update' : 'Save'}</Button></div>
        </div>
      </Modal>
    </motion.div>
  );
}
