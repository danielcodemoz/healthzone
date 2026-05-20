import { motion } from 'framer-motion';
import type { ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: string;
}

export default function Card({ children, hover = true, padding = 'p-6', className = '', ...props }: Props) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 20px 40px -12px rgba(99, 102, 241, 0.12)' } : undefined}
      className={`glass-card ${padding} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
