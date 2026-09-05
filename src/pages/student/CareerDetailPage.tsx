import React from 'react';
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Circle,
  Briefcase,
  BookOpen,
  Award,
  Sparkles,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, ProficiencyTag } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { MatchScoreBadge } from '../../components/common/MatchScoreBadge';
import { calculateCareerReadiness, calculateOpportunityMatch } from '../../utils/skillMatcher';
import { CAREER_PATHS, MOCK_COURSES } from '../../data/mockData';

export const CareerDetailPage: React.FC = () => {
  const {
    selectedCareerId,
    studentProfile,
    opportunities,
    updateTargetCareer,
    navigateTo
  } = useApp();

  const career =
    CAREER_PATHS.find(c => c.id === selectedCareerId) || CAREER_PATHS[0];

  const readiness = calculateCareerReadiness(career, studentProfile.skills);
  const isTarget = studentProfile.targetCareerId === career.id;

  // Filter linked opportunities
  const relatedOpps = opportunities.filter(opp => {
    const hasOverlap = opp.requiredSkills.some(req =>
      career.requiredSkills.some(cReq => cReq.skillName.toLowerCase() === req.skillName.toLowerCase())
    );
    return hasOverlap;
  }).slice(0, 2);

  // Filter recommended courses
  const relatedCourses = MOCK_COURSES.filter(c =>
    career.requiredSkills.some(req => req.skillName.toLowerCase().includes(c.targetSkill.toLowerCase()))
  ).slice(0, 2);

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigateTo('careers')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Career Explorer
      </button>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" size="xs">
                {career.demandLevel}
              </Badge>
              <span className="text-xs font-mono text-slate-300 font-bold bg-white/10 px-2 py-0.5 rounded">
                Avg Compensation: {career.avgSalary}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{career.title}</h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{career.description}</p>
          </div>

          {/* Target button */}
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            {!isTarget ? (
              <Button
                variant="primary"
                size="sm"
                icon={<Sparkles className="w-4 h-4" />}
                onClick={() => updateTargetCareer(career.id)}
              >
                Set as Active Target Career
              </Button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Active Target Career
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Your Readiness Score
            </div>
            <div className="text-4xl font-extrabold text-slate-900 my-1">{readiness}%</div>
            <p className="text-xs text-slate-500 mb-3">
              Computed across {career.requiredSkills.length} required technical competencies.
            </p>
          </div>
          <ProgressBar value={readiness} height="sm" variant="tier" />
        </Card>

        <Card className="md:col-span-2">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Required Technical Competencies</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {career.requiredSkills.map(req => {
              const studentSkill = studentProfile.skills.find(
                s => s.name.toLowerCase() === req.skillName.toLowerCase()
              );
              const score = studentSkill ? studentSkill.score : 30;
              const isMet = score >= req.requiredScore;

              return (
                <div key={req.skillName} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-800 flex items-center gap-1">
                      {isMet ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      {req.skillName}
                    </span>
                    <span className="font-mono text-slate-900">{score}% / {req.requiredScore}%</span>
                  </div>
                  <ProgressBar value={score} target={req.requiredScore} height="xs" variant={isMet ? 'success' : 'warning'} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Visual Career Roadmap (Step 1 -> Step 2 -> Step 3 -> Step 4) */}
      <Card>
        <CardHeader
          title={`Milestone Roadmap: ${career.title}`}
          subtitle="Step-by-step engineering progression from fundamental theory to production architectures"
          icon={<Compass className="w-4 h-4" />}
        />

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {career.roadmapSteps.map(step => {
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in-progress';

            return (
              <div key={step.step} className="relative group">
                {/* Step Node Icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-white transition-all ${
                    isCompleted
                      ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                      : isInProgress
                      ? 'border-brand-600 text-brand-600 ring-4 ring-brand-100'
                      : 'border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.step}
                </div>

                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 hover:bg-white hover:border-slate-300 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isInProgress
                          ? 'bg-brand-100 text-brand-800 animate-pulse'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {step.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400">Target Skills:</span>
                    {step.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-white text-slate-700 text-[10px] font-semibold border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Linked Opportunities & Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Linked Opportunities */}
        <Card>
          <CardHeader
            title="Active Job / Internship Postings"
            subtitle={`Open roles matching ${career.title} requirements`}
            icon={<Briefcase className="w-4 h-4" />}
          />
          <div className="space-y-3">
            {relatedOpps.map(opp => {
              const match = calculateOpportunityMatch(opp, studentProfile.skills);
              return (
                <div
                  key={opp.id}
                  onClick={() => navigateTo('opportunity-detail', { opportunityId: opp.id })}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs hover:text-brand-600">
                        {opp.title}
                      </h5>
                      <p className="text-[11px] text-slate-500">{opp.company.name} • {opp.location}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {match.matchPercentage}% Match
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/60">
                    <span className="font-mono text-slate-700 font-semibold">{opp.stipendSalary}</span>
                    <span className="text-brand-600 font-bold flex items-center gap-0.5">
                      Apply Now <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Linked Courses */}
        <Card>
          <CardHeader
            title="Curated Bridge Courses"
            subtitle="Modules designed to elevate your readiness on this track"
            icon={<BookOpen className="w-4 h-4" />}
          />
          <div className="space-y-3">
            {relatedCourses.map(course => (
              <div
                key={course.id}
                onClick={() => navigateTo('learning')}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="font-bold text-slate-900 text-xs hover:text-brand-600">
                    {course.title}
                  </h5>
                  <Badge variant="indigo" size="xs">
                    {course.targetSkill}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">{course.provider} • {course.duration} • ★ {course.rating}</p>
                <p className="text-[11px] text-brand-700 font-semibold">{course.matchReason}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
