import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  badgeType?: 'safe' | 'warning' | 'critical' | 'brand' | 'neutral';
  icon?: LucideIcon;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  badge,
  badgeType = 'brand',
  icon: Icon,
  onClick,
}) => {
  const badgeStyles = {
    safe: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-amber-50 text-amber-700 border-amber-200',
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-surface-300 p-5 shadow-card transition-all ${
        onClick ? 'cursor-pointer hover:border-brand-400 hover:shadow-elevation' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-brand-600">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold tracking-tight text-brand-950 font-sans">
          {value}
        </div>
        {badge && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyles[badgeType]}`}
          >
            {badge}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1.5 text-xs text-slate-500 font-medium leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
};
