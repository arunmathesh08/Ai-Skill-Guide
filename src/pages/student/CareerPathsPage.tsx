import React from 'react';
import {
  Compass,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { calculateCareerReadiness } from '../../utils/skillMatcher';
import { CAREER_PATHS } from '../../data/mockData';

export const CareerPathsPage: React.FC = () => {
  const { studentProfile, updateTargetCareer, navigateTo } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Career Exploration & Industry Demand</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Industry Career Paths
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Discover in-demand software engineering, cloud, and data roles. See your dynamic readiness score for each track.
          </p>
        </div>
      </div>

      {/* Grid of Career Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CAREER_PATHS.map(career => {
          const readiness = calculateCareerReadiness(career, studentProfile.skills);
          const isTarget = studentProfile.targetCareerId === career.id;

          let readinessColor = 'text-rose-600';
          let readinessBadge = 'bg-rose-50 text-rose-700 border-rose-200';
          if (readiness >= 80) {
            readinessColor = 'text-emerald-600';
            readinessBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          } else if (readiness >= 65) {
            readinessColor = 'text-blue-600';
            readinessBadge = 'bg-blue-50 text-blue-700 border-blue-200';
          } else if (readiness >= 50) {
            readinessColor = 'text-amber-600';
            readinessBadge = 'bg-amber-50 text-amber-700 border-amber-200';
          }

          return (
            <Card
              key={career.id}
              hover
              onClick={() => navigateTo('career-detail', { careerId: career.id })}
              className={`flex flex-col justify-between group relative overflow-hidden ${
                isTarget ? 'border-brand-500 ring-1 ring-brand-500/30' : ''
              }`}
            >
              {isTarget && (
                <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg uppercase tracking-wider shadow-2xs">
                  Active Target Role
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={career.demandLevel === 'Critical Demand' ? 'danger' : 'brand'}
                    size="xs"
                  >
                    {career.demandLevel}
                  </Badge>
                  <span className="text-xs font-mono text-slate-500 font-semibold">{career.avgSalary}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {career.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 line-clamp-2 leading-relaxed">
                  {career.description}
                </p>

                {/* Readiness Progress */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Your Current Readiness</span>
                    <span className={`font-mono font-bold ${readinessColor}`}>{readiness}%</span>
                  </div>
                  <ProgressBar value={readiness} height="xs" variant="tier" />
                </div>

                {/* Key Required Skills */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Core Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {career.requiredSkills.slice(0, 4).map(req => {
                      const studentSkill = studentProfile.skills.find(
                        s => s.name.toLowerCase() === req.skillName.toLowerCase()
                      );
                      const isStrong = studentSkill && studentSkill.score >= req.requiredScore;
                      return (
                        <span
                          key={req.skillName}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            isStrong
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {isStrong && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                          {req.skillName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {!isTarget ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTargetCareer(career.id);
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Set as Target
                  </button>
                ) : (
                  <span className="text-xs font-bold text-brand-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Target Role
                  </span>
                )}

                <Button
                  variant="outline"
                  size="xs"
                  icon={<ArrowRight className="w-3 h-3" />}
                  iconPosition="right"
                >
                  Explore Roadmap
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
