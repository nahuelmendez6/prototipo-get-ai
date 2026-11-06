import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: 'navy' | 'crimson' | 'teal' | 'indigo' | 'amber' | 'emerald' | 'sky' | 'rose' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'navy',
}) => {
  const colorMap = {
    navy: 'bg-[#0d3471]/10 text-[#0d3471] border-[#0d3471]/20',
    crimson: 'bg-[#c81414]/10 text-[#c81414] border-[#c81414]/20',
    teal: 'bg-[#0d3471]/10 text-[#0d3471] border-[#0d3471]/20',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    rose: 'bg-red-50 text-[#c81414] border-red-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`p-2 rounded-xl border ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{value}</span>
        {trend && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${trend.positive ? 'text-emerald-700 bg-emerald-50' : 'text-[#c81414] bg-red-50'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
      )}
    </div>
  );
};
