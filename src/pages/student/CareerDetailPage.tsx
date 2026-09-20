import React, { useState } from 'react';
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
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import {
  calculateCareerReadiness,
  calculateSkillGaps,
  calculateOpportunityMatch,
  generatePersonalizedRoadmap,
  findMatchingSkill,
  getSkillStatus
} from '../../utils/skillMatcher';
import { formatSalary } from '../../utils/salaryUtils';
import { CAREER_PATHS, MOCK_COURSES } from '../../data/mockData';

export const CareerDetailPage: React.FC = () => {
  const {
    selectedCareerId,
    studentProfile,
    lastAssessmentResult,
    opportunities,
    hasTakenAssessment,
    updateTargetCareer,
    completeBridgeCourse,
    navigateTo
  } = useApp();

  const career =
    CAREER_PATHS.find(c => c.id === selectedCareerId) || CAREER_PATHS[0];

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

  const activeAssessmentScore = isMatchingAssessment && hasTakenAssessment
    ? (lastAssessmentResult?.calculatedScore ?? studentProfile.careerReadiness)
    : undefined;

  const readiness = isMatchingAssessment && hasTakenAssessment
    ? (lastAssessmentResult?.calculatedScore ?? studentProfile.careerReadiness ?? 0)
    : calculateCareerReadiness(career, studentProfile.skills, hasTakenAssessment);

  const gapAnalysis = calculateSkillGaps(
    career.requiredSkills,
    studentProfile.skills,
    career.title,
    hasTakenAssessment,
    activeAssessmentScore
  );
  const roadmapPhases = generatePersonalizedRoadmap(career, studentProfile.skills, hasTakenAssessment);

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
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Back button */}
      <button
        onClick={() => navigateTo('careers')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Career Explorer
      </button>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" size="xs">
                {career.demandLevel}
              </Badge>
              <span className="text-xs font-mono text-slate-300 font-bold bg-white/10 px-2.5 py-0.5 rounded">
                Avg Compensation: {formatSalary(career.avgSalary)}
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
                className="font-bold shadow-md"
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

      {/* Top Metrics Row: Readiness + AI Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Readiness Card */}
        <Card className="flex flex-col justify-between p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Your Current Readiness
            </div>
            <div className="flex items-baseline gap-2 my-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                {hasTakenAssessment ? `${readiness}%` : '--'}
              </span>
              {hasTakenAssessment ? (
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  readiness >= 80
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : readiness >= 60
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                }`}>
                  {gapAnalysis.readinessStatus}
                </span>
              ) : (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Not Assessed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Calculated dynamically against {career.requiredSkills.length} required competencies.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  !hasTakenAssessment ? 'bg-slate-300 dark:bg-slate-600' : readiness >= 80 ? 'bg-emerald-500' : readiness >= 60 ? 'bg-blue-600' : 'bg-rose-500'
                }`}
                style={{ width: `${hasTakenAssessment ? Math.min(100, readiness) : 0}%` }}
              />
            </div>
          </div>
        </Card>

        {/* AI Personalized Recommendation Panel */}
        <Card className="md:col-span-2 p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-0 shadow-md rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Personalized Roadmap Explanation</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-2">
              Adaptive Learning Strategy for {career.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {gapAnalysis.biggestOpportunity}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Adaptive Progression: Beginner steps auto-skip for verified strong skills</span>
            <Button
              variant="outline"
              size="xs"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold"
              onClick={() => navigateTo('skill-gaps')}
            >
              View Gap Analysis
            </Button>
          </div>
        </Card>
      </div>

      {/* Required Technical Competencies Breakdown Card */}
      <Card className="p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
          Required Technical Competencies Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {career.requiredSkills.map(req => {
            const studentSkill = findMatchingSkill(req.skillName, studentProfile.skills);
            const score = hasTakenAssessment && studentSkill ? studentSkill.score : 0;
            const isMet = hasTakenAssessment && score >= req.requiredScore;

            return (
              <div key={req.skillName} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    {isMet ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    )}
                    <span className="font-bold">{req.skillName}</span>
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">{hasTakenAssessment ? `${score}%` : '--'} / {req.requiredScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${!hasTakenAssessment ? 'bg-slate-300 dark:bg-slate-600' : isMet ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${hasTakenAssessment ? Math.min(100, (score / req.requiredScore) * 100) : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 8. Sequential Personalized Career Roadmap (Phases 1 - 6) */}
      <Card className="p-6 sm:p-7 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6">
        <CardHeader
          title={`Personalized Sequential Roadmap: ${career.title}`}
          subtitle="Adaptive sequential path calibrated from your actual skill assessment results"
          icon={<Compass className="w-5 h-5 text-brand-600 dark:text-brand-400" />}
          action={
            <Button
              variant="outline"
              size="xs"
              icon={<Award className="w-3.5 h-3.5" />}
              onClick={() => navigateTo('skill-assessment')}
            >
              Re-Assess Skills
            </Button>
          }
        />

        {/* Sequential Phases List */}
        <div className="space-y-6">
          {roadmapPhases.map((phase) => {
            const isCompleted = phase.status === 'completed';
            const isInProgress = phase.status === 'in-progress';

            return (
              <div
                key={phase.phaseNumber}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                    : isInProgress
                    ? 'bg-brand-50/20 dark:bg-brand-950/20 border-brand-300 dark:border-brand-800 ring-1 ring-brand-400/30 shadow-xs'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-7 h-7 rounded-xl font-extrabold text-xs flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isInProgress
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : phase.phaseNumber}
                    </span>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                      {phase.phaseTitle}
                    </h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : isInProgress
                      ? 'bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {phase.status.replace('-', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 pl-9">
                  {phase.phaseDescription}
                </p>

                {/* Milestone Items in this Phase */}
                <div className="space-y-3 pl-9">
                  {phase.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
                          {m.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                          )}
                          <span>{m.title}</span>
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {m.level}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {m.description}
                      </p>

                      {m.topics && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Topics:</span>
                          {m.topics.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-slate-200 dark:border-slate-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Linked Opportunities & Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Linked Opportunities */}
        <Card className="p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl">
          <CardHeader
            title="Active Job / Internship Postings"
            subtitle={`Open roles matching ${career.title} requirements`}
            icon={<Briefcase className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
          />
          <div className="space-y-3">
            {relatedOpps.map(opp => {
              const match = calculateOpportunityMatch(opp, studentProfile.skills, hasTakenAssessment);
              return (
                <div
                  key={opp.id}
                  onClick={() => navigateTo('opportunity-detail', { opportunityId: opp.id })}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs hover:text-brand-600 dark:hover:text-brand-400">
                        {opp.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{opp.company.name} • {opp.location}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      {match.matchPercentage}% Match
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{formatSalary(opp.stipendSalary)}</span>
                    <span className="text-brand-600 dark:text-brand-400 font-bold flex items-center gap-0.5">
                      Apply Now <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Linked Courses */}
        <Card className="p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl">
          <CardHeader
            title="Curated Bridge Courses"
            subtitle="Modules designed to elevate your readiness on this track"
            icon={<BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
          />
          <div className="space-y-3">
            {relatedCourses.map(course => (
              <div
                key={course.id}
                onClick={() => navigateTo('learning')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs hover:text-brand-600 dark:hover:text-brand-400">
                    {course.title}
                  </h5>
                  <Badge variant="indigo" size="xs">
                    {course.targetSkill}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{course.provider} • {course.duration} • ★ {course.rating}</p>
                <p className="text-[11px] text-brand-700 dark:text-brand-300 font-semibold">{course.matchReason}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
