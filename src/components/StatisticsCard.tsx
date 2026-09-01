'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  change,
  isPositive = true,
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 font-poppins">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
        {change && (
          <p
            className={`text-xs font-bold mt-1.5 flex items-center gap-1 ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            <span>{isPositive ? '↑' : '↓'}</span> {change}
          </p>
        )}
      </div>

      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
};
