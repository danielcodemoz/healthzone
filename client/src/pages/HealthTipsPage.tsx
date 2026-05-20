import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, RefreshCw } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ExportButtons from '../components/ui/ExportButtons';
import { staggerContainer, staggerItem } from '../animations/variants';
import type { HealthTip } from '../types';

const catColors: Record<string, string> = {
  hydration: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
  exercise: 'from-emerald-500/10 to-green-500/10 border-emerald-500/20',
  nutrition: 'from-orange-500/10 to-amber-500/10 border-orange-500/20',
  sleep: 'from-violet-500/10 to-purple-500/10 border-violet-500/20',
  mental: 'from-pink-500/10 to-rose-500/10 border-pink-500/20',
};

export default function HealthTipsPage() {
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [cat, setCat] = useState('');

  const load = () => {
    api.get(`/tips?limit=10${cat ? `&category=${cat}` : ''}`).then((r) => setTips(r.data));
  };
  useEffect(() => { load(); }, [cat]);

  const cats = ['', 'hydration', 'exercise', 'nutrition', 'sleep', 'mental'];

  const getExportData = () => ({
    headers: ['Category', 'Title', 'Content'],
    rows: tips.map((tip) => [tip.category, tip.title, tip.content]),
  });

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem} className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-bold">💡 Health Tips</h1><p className="text-surface-500 mt-1">Daily wellness advice</p></div>
        <div className="flex items-center gap-3 flex-wrap">
          <ExportButtons title={`Health Tips${cat ? ` - ${cat}` : ''}`} getData={getExportData} />
          <Button variant="ghost" onClick={load}><RefreshCw size={16} className="mr-1" /> Refresh</Button>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="flex gap-2 flex-wrap">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${cat === c ? 'bg-primary-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'}`}>
            {c || 'All'}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip) => (
          <motion.div key={tip.id} variants={staggerItem}>
            <Card className={`border bg-gradient-to-br ${catColors[tip.category] || ''}`}>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-500">{tip.category}</span>
              <h3 className="text-lg font-semibold mt-2">{tip.title}</h3>
              <p className="text-sm text-surface-600 dark:text-surface-300 mt-2 leading-relaxed">{tip.content}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
