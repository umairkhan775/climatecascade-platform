import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = (status || '').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (normalized.includes('critical') || normalized.includes('severe') || normalized.includes('first failure') || normalized.includes('at risk')) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (normalized.includes('warning') || normalized.includes('vulnerable') || normalized.includes('low buffer') || normalized.includes('alert')) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (normalized.includes('safe') || normalized.includes('healthy') || normalized.includes('operational') || normalized.includes('running') || normalized.includes('normal')) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (normalized.includes('info') || normalized.includes('active')) {
    styles = 'bg-brand-50 text-brand-700 border-brand-200';
    dotColor = 'bg-brand-500';
  }

  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-0.5';

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full font-semibold border ${styles} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      <span>{status}</span>
    </span>
  );
};
