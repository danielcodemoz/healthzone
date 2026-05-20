import { motion } from 'framer-motion';

interface Props {
  value: number;
  max: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
  animate?: boolean;
}

export default function ProgressBar({ value, max, color = 'from-primary-500 to-accent-500', height = 'h-3', showLabel = false, animate = true }: Props) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full">
      {showLabel && <div className="flex justify-between text-xs font-medium mb-1.5 text-surface-500 dark:text-surface-400"><span>{value}</span><span>{max}</span></div>}
      <div className={`${height} rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={animate ? { width: 0 } : undefined}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  );
}
