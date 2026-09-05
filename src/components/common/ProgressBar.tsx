import React from 'react';
import { getProficiencyTier } from '../../utils/skillMatcher';

interface ProgressBarProps {
  value: number; // 0 - 100
  target?: number; // optional target threshold mark
  max?: number;
  height?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'tier';
  showLabel?: boolean;
  animate?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  target,
  max = 100,
  height = 'sm',
  variant = 'tier',
  showLabel = false,
  animate = true,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const targetPercentage = target ? Math.min(100, Math.max(0, Math.round((target / max) * 100))) : null;

  const heightClasses = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  let fillColor = 'bg-brand-600';
  if (variant === 'success') fillColor = 'bg-emerald-500';
  else if (variant === 'warning') fillColor = 'bg-amber-500';
  else if (variant === 'danger') fillColor = 'bg-rose-500';
  else if (variant === 'tier') {
    fillColor = getProficiencyTier(percentage).barColor;
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
          <span>Proficiency</span>
          <span className="font-mono text-slate-900">{percentage}%</span>
        </div>
      )}
      <div className={`relative w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${fillColor} ${
            animate ? 'transform-gpu' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
        {/* Optional Target Marker line */}
        {targetPercentage !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10 opacity-70"
            style={{ left: `${targetPercentage}%` }}
            title={`Required: ${target}%`}
          />
        )}
      </div>
    </div>
  );
};
