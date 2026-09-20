import React from 'react';
import {
  Compass,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  BookOpen,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { calculateCareerReadiness, findMatchingSkill } from '../../utils/skillMatcher';
import { formatSalary } from '../../utils/salaryUtils';
import { CAREER_PATHS } from '../../data/mockData';

export const CareerPathsPage: React.FC = () => {
  const { studentProfile, lastAssessmentResult, updateTargetCareer, hasTakenAssessment, navigateTo } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* 1. Header (Matching Screenshot 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-1.5 border border-brand-100 dark:border-brand-800">
            <Compass className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Career Exploration & Industry Demand</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Industry Career Paths
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Discover in-demand software engineering, cloud, and data roles. See your dynamic readiness score for each track.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="text-xs font-bold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
          icon={<Award className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
          onClick={() => navigateTo('skill-assessment')}
        >
          Take Assessment
        </Button>
      </div>

      {/* 2. Grid of 6 Career Cards (Matching Screenshot 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CAREER_PATHS.map(career => {
          const isTarget = studentProfile.targetCareerId === career.id;
          const isMatchingAssessment =
            isTarget ||
            (lastAssessmentResult && (
              (lastAssessmentResult.courseCategoryId === 'data-analyst' && career.id === 'cp-data-analyst') ||
              (lastAssessmentResult.courseCategoryId === 'fullstack' && career.id === 'cp-fullstack') ||
              (lastAssessmentResult.courseCategoryId === 'frontend' && career.id === 'cp-frontend') ||
              (lastAssessmentResult.courseCategoryId === 'backend' && career.id === 'cp-backend') ||
              (lastAssessmentResult.courseCategoryId === 'devops' && career.id === 'cp-cloud-devops') ||
              (lastAssessmentResult.courseCategoryId === 'ai-data' && career.id === 'cp-ai-ml')
            ));

          const readiness = isMatchingAssessment && hasTakenAssessment
            ? (lastAssessmentResult?.calculatedScore ?? studentProfile.careerReadiness ?? 0)
            : calculateCareerReadiness(career, studentProfile.skills, hasTakenAssessment);

          let readinessColor = 'text-rose-600 dark:text-rose-400';

          if (readiness >= 80) {
            readinessColor = 'text-emerald-600 dark:text-emerald-400';
          } else if (readiness >= 65) {
            readinessColor = 'text-blue-600 dark:text-blue-400';
          } else if (readiness >= 45) {
            readinessColor = 'text-amber-600 dark:text-amber-400';
          }

          return (
            <Card
              key={career.id}
              hover
              onClick={() => navigateTo('career-detail', { careerId: career.id })}
              className={`flex flex-col justify-between group relative overflow-hidden bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all ${
                isTarget ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-sm' : ''
              }`}
            >
              {/* Active Target Role Badge in Top-Right */}
              {isTarget && (
                <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-extrabold px-3.5 py-1 rounded-bl-xl uppercase tracking-wider shadow-xs">
                  ACTIVE TARGET ROLE
                </div>
              )}

              <div>
                {/* Demand Level & Salary Badge Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                      career.demandLevel === 'Critical Demand'
                        ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        : career.demandLevel === 'Very High'
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                        : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    {career.demandLevel}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">{formatSalary(career.avgSalary)}</span>
                </div>

                {/* Career Title & Description */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {career.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 line-clamp-2 leading-relaxed">
                  {career.description}
                </p>

                {/* Readiness Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-300">Your Current Readiness</span>
                    {!hasTakenAssessment ? (
                      <span className="font-mono font-extrabold text-sm text-slate-400 dark:text-slate-500">
                        --
                      </span>
                    ) : (
                      <span className={`font-mono font-extrabold text-sm ${readinessColor}`}>
                        {readiness}%
                      </span>
                    )}
                  </div>
                  <div className="w-full h-2 bg-slate-200/70 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        !hasTakenAssessment
                          ? 'bg-slate-300 dark:bg-slate-600'
                          : readiness >= 80
                          ? 'bg-emerald-500'
                          : readiness >= 65
                          ? 'bg-blue-600'
                          : readiness >= 45
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${hasTakenAssessment ? Math.min(100, readiness) : 0}%` }}
                    />
                  </div>
                </div>

                {/* Core Skills List */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    CORE SKILLS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {career.requiredSkills.slice(0, 4).map(req => {
                      const studentSkill = findMatchingSkill(req.skillName, studentProfile.skills);
                      const isStrong = hasTakenAssessment && studentSkill && studentSkill.score >= req.requiredScore;

                      return (
                        <span
                          key={req.skillName}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                            isStrong
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {isStrong && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                          <span>{req.skillName}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {!isTarget ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTargetCareer(career.id);
                    }}
                    className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-colors"
                  >
                    Set as Target
                  </button>
                ) : (
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Target Role
                  </span>
                )}

                <Button
                  variant="outline"
                  size="xs"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400"
                  icon={<ArrowRight className="w-3 h-3" />}
                  iconPosition="right"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo('career-detail', { careerId: career.id });
                  }}
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
