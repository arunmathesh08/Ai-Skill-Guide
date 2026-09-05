import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string | number;
  deltaType?: 'positive' | 'negative' | 'neutral';
  deltaLabel?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  progress?: number;
  badgeText?: string;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  delta,
  deltaType = 'positive',
  deltaLabel = 'vs last month',
  icon,
  subtitle,
  progress,
  badgeText,
  onClick,
  className = ''
}) => {
  return (
    <Card hover={!!onClick} onClick={onClick} className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h4>
            {badgeText && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {(delta !== undefined || subtitle) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {delta !== undefined && (
            <span
              className={`inline-flex items-center font-bold gap-0.5 px-1.5 py-0.5 rounded ${
                deltaType === 'positive'
                  ? 'text-emerald-700 bg-emerald-50'
                  : deltaType === 'negative'
                  ? 'text-rose-700 bg-rose-50'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              {deltaType === 'positive' && <TrendingUp className="w-3 h-3" />}
              {deltaType === 'negative' && <TrendingDown className="w-3 h-3" />}
              {deltaType === 'neutral' && <Minus className="w-3 h-3" />}
              {typeof delta === 'number' && delta > 0 ? `+${delta}%` : `${delta}`}
            </span>
          )}
          <span className="text-slate-500 truncate">{subtitle || deltaLabel}</span>
        </div>
      )}
    </Card>
  );
};
