import React, { useState } from 'react';
import { Check, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface MatchScoreBadgeProps {
  score: number;
  strongSkills?: string[];
  developingSkills?: string[];
  missingSkills?: string[];
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  expandable?: boolean;
  className?: string;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  score,
  strongSkills = [],
  developingSkills = [],
  missingSkills = [],
  size = 'md',
  showDetails = false,
  expandable = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  let badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
  let progressColor = 'bg-rose-500';
  let matchTier = 'Low Match';

  if (score >= 85) {
    badgeColor = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    progressColor = 'bg-emerald-500';
    matchTier = 'Excellent Match';
  } else if (score >= 70) {
    badgeColor = 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800';
    progressColor = 'bg-blue-600';
    matchTier = 'Strong Match';
  } else if (score >= 50) {
    badgeColor = 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    progressColor = 'bg-amber-500';
    matchTier = 'Moderate Match';
  } else {
    badgeColor = 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-bold'
  };

  const hasSkillBreakdown = strongSkills.length > 0 || developingSkills.length > 0 || missingSkills.length > 0;

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div
        className={`inline-flex items-center gap-1.5 font-semibold rounded-lg border shadow-2xs transition-all ${sizeClasses[size]} ${badgeColor} ${
          expandable && hasSkillBreakdown ? 'cursor-pointer hover:opacity-90' : ''
        }`}
        onClick={() => expandable && hasSkillBreakdown && setIsExpanded(!isExpanded)}
        title={`${score}% Skill Alignment Score`}
      >
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span className="font-bold">{score}% Match</span>
        <span className="hidden sm:inline-block opacity-60 font-normal text-[11px]">| {matchTier}</span>
        {expandable && hasSkillBreakdown && (
          <button
            type="button"
            className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors"
            aria-label="Toggle breakdown"
          >
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Expanded or detailed breakdown */}
      {(showDetails || isExpanded) && hasSkillBreakdown && (
        <div className="mt-2 p-2.5 bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-slate-800 rounded-lg text-xs space-y-1.5 animate-fadeIn shadow-inner w-full max-w-sm">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Skill Alignment Breakdown
          </div>
          
          {strongSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-emerald-700 dark:text-emerald-400 font-medium text-[11px] flex items-center gap-0.5 mr-1">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Strong:
              </span>
              {strongSkills.map((s, i) => (
                <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-medium border border-transparent dark:border-emerald-800/40">
                  {s}
                </span>
              ))}
            </div>
          )}

          {developingSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-amber-700 dark:text-amber-400 font-medium text-[11px] flex items-center gap-0.5 mr-1">
                <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Moderate:
              </span>
              {developingSkills.map((s, i) => (
                <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100/70 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-medium border border-transparent dark:border-amber-800/40">
                  {s}
                </span>
              ))}
            </div>
          )}

          {missingSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-rose-700 dark:text-rose-400 font-medium text-[11px] flex items-center gap-0.5 mr-1">
                <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Need Gap:
              </span>
              {missingSkills.map((s, i) => (
                <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded bg-rose-100/70 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-[10px] font-medium border border-transparent dark:border-rose-800/40">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
