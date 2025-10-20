
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  tone?: 'default' | 'subtle' | 'ok' | 'warn' | 'info';
}

const Badge: React.FC<BadgeProps> = ({ children, tone = 'default' }) => {
  const tones = {
    default: 'bg-slate-900 text-white',
    subtle: 'bg-slate-100 text-slate-700 border border-gray-200',
    ok: 'bg-green-100 text-green-800 border border-green-200',
    warn: 'bg-amber-100 text-amber-800 border border-amber-200',
    info: 'bg-sky-100 text-sky-800 border border-sky-200',
  };
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
