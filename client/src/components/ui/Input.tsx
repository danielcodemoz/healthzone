import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: Props) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">{label}</label>}
      <input className={`input-field ${error ? 'border-red-400 focus:ring-red-400/50' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
