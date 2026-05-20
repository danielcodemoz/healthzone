export default function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse-soft rounded-xl bg-surface-200 dark:bg-surface-700 ${className}`} />;
}
