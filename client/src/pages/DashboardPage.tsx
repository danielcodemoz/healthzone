import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Heart, Scale, Pill, Trophy, Zap } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Skeleton from '../components/ui/Skeleton';
import { staggerContainer, staggerItem } from '../animations/variants';
import { useAuthStore } from '../store/authStore';
import type { AnalyticsOverview, HealthTip } from '../types';

function AnimatedNumber({ value, duration = 1 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.round(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display}</>;
}

function getBmiLabel(bmi: number) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-500' };
  if (bmi < 25) return { label: 'Normal', color: 'text-emerald-500' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-amber-500' };
  return { label: 'Obese', color: 'text-red-500' };
}

function getHrStatus(bpm: number) {
  if (bpm < 60) return { label: 'Low', color: 'text-blue-500' };
  if (bpm <= 100) return { label: 'Normal', color: 'text-emerald-500' };
  return { label: 'High', color: 'text-red-500' };
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    Promise.all([api.get('/analytics/overview'), api.get('/tips?limit=3')])
      .then(([a, t]) => { setData(a.data); setTips(t.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
    </div>
  );

  const d = data!;
  const bmiInfo = d.bmi ? getBmiLabel(d.bmi) : null;
  const hrInfo = d.heartRate ? getHrStatus(d.heartRate) : null;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
      {/* Greeting */}
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl md:text-3xl font-bold">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-surface-500 mt-1">Here's your wellness overview for today</p>
      </motion.div>

      {/* Main widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Health Score */}
        <motion.div variants={staggerItem}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/5 dark:from-primary-500/5" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary-500/10"><Zap size={22} className="text-primary-500" /></div>
                <span className="text-sm font-medium text-surface-500">Health Score</span>
              </div>
              <div className="text-4xl font-bold"><AnimatedNumber value={d.healthScore} /><span className="text-lg text-surface-400">/100</span></div>
              <ProgressBar value={d.healthScore} max={100} color="from-primary-500 to-accent-500" />
            </div>
          </Card>
        </motion.div>

        {/* Hydration */}
        <motion.div variants={staggerItem}>
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10"><Droplets size={22} className="text-blue-500" /></div>
              <span className="text-sm font-medium text-surface-500">Hydration</span>
            </div>
            <div className="text-3xl font-bold mb-1"><AnimatedNumber value={d.water.total} /> <span className="text-base text-surface-400">/ {d.water.goal} ml</span></div>
            <ProgressBar value={d.water.total} max={d.water.goal} color="from-blue-400 to-cyan-500" />
          </Card>
        </motion.div>

        {/* Heart Rate */}
        <motion.div variants={staggerItem}>
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-500/10"><Heart size={22} className="text-red-500" /></div>
              <span className="text-sm font-medium text-surface-500">Heart Rate</span>
            </div>
            {d.heartRate ? (
              <>
                <div className="text-3xl font-bold mb-1"><AnimatedNumber value={d.heartRate} /> <span className="text-base text-surface-400">bpm</span></div>
                <span className={`text-sm font-semibold ${hrInfo!.color}`}>{hrInfo!.label}</span>
              </>
            ) : <p className="text-surface-400 text-sm">No readings yet</p>}
          </Card>
        </motion.div>

        {/* BMI */}
        <motion.div variants={staggerItem}>
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10"><Scale size={22} className="text-emerald-500" /></div>
              <span className="text-sm font-medium text-surface-500">BMI</span>
            </div>
            {d.bmi ? (
              <>
                <div className="text-3xl font-bold mb-1">{d.bmi}</div>
                <span className={`text-sm font-semibold ${bmiInfo!.color}`}>{bmiInfo!.label}</span>
              </>
            ) : <p className="text-surface-400 text-sm">Add height & weight in settings</p>}
          </Card>
        </motion.div>

        {/* Medications */}
        <motion.div variants={staggerItem}>
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-violet-500/10"><Pill size={22} className="text-violet-500" /></div>
              <span className="text-sm font-medium text-surface-500">Active Medications</span>
            </div>
            <div className="text-3xl font-bold"><AnimatedNumber value={d.activeMeds} /></div>
          </Card>
        </motion.div>

        {/* Streak */}
        <motion.div variants={staggerItem}>
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10"><Trophy size={22} className="text-amber-500" /></div>
              <span className="text-sm font-medium text-surface-500">Hydration Streak</span>
            </div>
            <div className="text-3xl font-bold"><AnimatedNumber value={d.streak} /> <span className="text-base text-surface-400">days</span></div>
          </Card>
        </motion.div>
      </div>

      {/* Health Tips */}
      {tips.length > 0 && (
        <motion.div variants={staggerItem}>
          <h2 className="text-lg font-semibold mb-4">💡 Daily Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tips.map((tip) => (
              <Card key={tip.id} className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-500">{tip.category}</span>
                <h3 className="font-semibold">{tip.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{tip.content}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
