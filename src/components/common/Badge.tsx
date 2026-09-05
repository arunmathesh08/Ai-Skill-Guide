import React from 'react';
import { getProficiencyTier } from '../../utils/skillMatcher';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'indigo' | 'purple';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  dot = false
}) => {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] font-medium rounded',
    sm: 'px-2.5 py-0.5 text-xs font-medium rounded-full',
    md: 'px-3 py-1 text-xs font-semibold rounded-full'
  };

  const variantClasses = {
    brand: 'bg-brand-50 text-brand-700 border border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200'
  };

  const dotColors = {
    brand: 'bg-brand-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    neutral: 'bg-slate-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export const ProficiencyTag: React.FC<{
  score: number;
  showScore?: boolean;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}> = ({ score, showScore = true, size = 'sm', className = '' }) => {
  const tier = getProficiencyTier(score);

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] font-semibold rounded',
    sm: 'px-2 py-0.5 text-xs font-semibold rounded-md',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-md'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border ${tier.badgeBg} ${tier.badgeBorder} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${tier.barColor}`} />
      <span>{tier.label}</span>
      {showScore && <span className="opacity-75 font-mono text-[11px]">({score}%)</span>}
    </span>
  );
};
