import React from 'react';
import {
  GraduationCap,
  TrendingUp,
  Award,
  AlertCircle,
  Users,
  Briefcase,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { FACULTY_ANALYTICS } from '../../data/mockData';

export const FacultyDashboard: React.FC = () => {
  const { currentUser, navigateTo } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{FACULTY_ANALYTICS.department} • Batch 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {currentUser.name} 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Academic & Placement Coordinator Dashboard. Monitor cohort skill distributions and align curriculum with hiring trends.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => navigateTo('mentorship')}
            >
              Student Mentorship List
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<TrendingUp className="w-4 h-4" />}
              onClick={() => navigateTo('skill-analytics')}
            >
              Full Cohort Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Students Enrolled"
          value={FACULTY_ANALYTICS.totalStudents}
          icon={<Users className="w-5 h-5 text-brand-600" />}
          subtitle="Final Year CSE Batch"
        />
        <StatCard
          title="Students Assessed"
          value={`${FACULTY_ANALYTICS.assessedStudents} (${FACULTY_ANALYTICS.assessedPercentage}%)`}
          delta={8}
          deltaType="positive"
          icon={<Award className="w-5 h-5 text-emerald-600" />}
          subtitle="Verified through assessments"
        />
        <StatCard
          title="Average Skill Score"
          value={`${FACULTY_ANALYTICS.averageSkillScore}%`}
          delta={4.2}
          deltaType="positive"
          icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
          subtitle="Department mean"
        />
        <StatCard
          title="Students With Gaps"
          value={FACULTY_ANALYTICS.studentsWithSkillGaps}
          delta={-6}
          deltaType="positive"
          icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
          subtitle="Requiring remedial support"
        />
      </div>

      {/* Analytics Visualizations: Skill Gaps vs Industry Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Student Skill Gaps in Batch */}
        <Card>
          <CardHeader
            title="Most Common Skill Gaps in Batch"
            subtitle="Prioritized competency deficits across enrolled CSE students"
            icon={<AlertCircle className="w-4 h-4 text-amber-600" />}
            action={
              <button
                onClick={() => navigateTo('skill-analytics')}
                className="text-xs font-bold text-brand-600 hover:text-brand-800"
              >
                Detailed Heatmap &rarr;
              </button>
            }
          />

          <div className="space-y-3.5">
            {FACULTY_ANALYTICS.topGaps.map(gap => (
              <div key={gap.skill} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 flex items-center gap-1.5">
                    {gap.skill}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        gap.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {gap.severity}
                    </span>
                  </span>
                  <span className="text-slate-500 font-mono">
                    {gap.affectedStudents} students ({gap.gapRate}%)
                  </span>
                </div>
                <ProgressBar
                  value={gap.gapRate}
                  height="xs"
                  variant={gap.severity === 'Critical' ? 'danger' : 'warning'}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Most Demanded Skills by Industry Partners */}
        <Card>
          <CardHeader
            title="Most Demanded Skills by Industry"
            subtitle="Real-time demand index derived from active postings & partner hiring specs"
            icon={<Briefcase className="w-4 h-4 text-brand-600" />}
          />

          <div className="space-y-3.5">
            {FACULTY_ANALYTICS.topDemandedSkills.map(skill => (
              <div key={skill.skill} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 font-bold">{skill.skill}</span>
                  <span className="text-slate-500 font-mono">
                    {skill.openRoles} Open Roles • Demand: <strong className="text-emerald-700">{skill.demandScore}%</strong>
                  </span>
                </div>
                <ProgressBar value={skill.demandScore} height="xs" variant="success" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Cohort Readiness Distribution Bar */}
      <Card>
        <CardHeader
          title="Cohort Career Readiness Tier Distribution"
          subtitle="Classification of students across standard proficiency bands"
          icon={<Award className="w-4 h-4 text-brand-600" />}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FACULTY_ANALYTICS.readinessTiers.map(tier => (
            <div key={tier.tier} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">
                {tier.tier}
              </span>
              <div className="text-2xl font-black text-slate-900">{tier.count}</div>
              <span className="text-xs text-slate-500 font-mono">{tier.percentage}% of cohort</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
