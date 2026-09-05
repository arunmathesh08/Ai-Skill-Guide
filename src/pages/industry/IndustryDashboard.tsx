import React from 'react';
import {
  Briefcase,
  Users,
  Send,
  UserCheck,
  PlusCircle,
  Sparkles,
  TrendingUp,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { MOCK_CANDIDATES } from '../../data/mockData';

export const IndustryDashboard: React.FC = () => {
  const { currentUser, opportunities, applications, navigateTo } = useApp();

  const totalApplicants = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const interviewCount = applications.filter(a => a.status === 'Interview').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Building className="w-3.5 h-3.5" />
              <span>{currentUser.organization} • University Talent Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Discover verified student competencies, review AI-matched candidates, and manage campus hiring pipelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => navigateTo('candidates')}
            >
              Discover Talent
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<PlusCircle className="w-4 h-4" />}
              onClick={() => navigateTo('post-opportunity')}
            >
              Post New Opportunity
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Postings"
          value={opportunities.length}
          icon={<Briefcase className="w-5 h-5 text-brand-600" />}
          subtitle="4 Internships, 1 Full-time"
        />
        <StatCard
          title="Total Applications"
          value={totalApplicants}
          delta={18}
          deltaType="positive"
          icon={<Send className="w-5 h-5 text-indigo-600" />}
          subtitle="Across active roles"
        />
        <StatCard
          title="Shortlisted Candidates"
          value={shortlistedCount}
          delta={12}
          deltaType="positive"
          icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
          subtitle="Ready for technical round"
        />
        <StatCard
          title="Interviews In-Flight"
          value={interviewCount}
          icon={<Users className="w-5 h-5 text-purple-600" />}
          subtitle="Scheduled this week"
        />
      </div>

      {/* Top Matching Candidates Feed (Standout AI Feature) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Top Matching Candidates</h3>
                <p className="text-xs text-slate-500">
                  Pre-screened candidates ranked by verified competency alignment with your active job specs
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('candidates')}
              className="text-xs text-brand-600 font-bold hover:text-brand-800 cursor-pointer"
            >
              View All Candidates &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_CANDIDATES.map(cand => (
              <Card key={cand.id} hover className="group transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {cand.avatar}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                          {cand.name}
                        </h4>
                        <Badge variant="brand" size="xs">
                          {cand.targetRole}
                        </Badge>
                        <span className="text-xs font-mono text-slate-500">CGPA: {cand.cgpa}</span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        {cand.degree} • <strong className="text-slate-800">{cand.college}</strong>
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Top Project: <span className="font-semibold text-slate-700">{cand.topProject}</span>
                      </p>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                      {cand.readiness}% Match
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Verified Profile</span>
                  </div>
                </div>

                {/* Verified Skills breakdown */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[11px] text-slate-400 font-medium mr-1">Skills:</span>
                    {cand.skills.map(s => (
                      <span
                        key={s.name}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold font-mono"
                      >
                        {s.name} ({s.score}%)
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => navigateTo('candidates')}
                    >
                      Inspect Profile
                    </Button>
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => navigateTo('industry-applications')}
                    >
                      Review in ATS
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Active Postings & Fast Actions (1 Column) */}
        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Active Postings"
              subtitle="Open roles currently receiving student applications"
              icon={<Briefcase className="w-4 h-4 text-brand-600" />}
              action={
                <button
                  onClick={() => navigateTo('post-opportunity')}
                  className="text-xs text-brand-600 font-bold hover:text-brand-800"
                >
                  + Post
                </button>
              }
            />

            <div className="space-y-3">
              {opportunities.map(opp => (
                <div
                  key={opp.id}
                  onClick={() => navigateTo('industry-applications')}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-slate-900 text-xs hover:text-brand-600">
                      {opp.title}
                    </h5>
                    <Badge variant={opp.type === 'internship' ? 'brand' : 'success'} size="xs">
                      {opp.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>{opp.location}</span>
                    <span className="font-bold text-slate-800">{opp.applicantsCount} Applicants</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Recruitment Tip */}
          <Card className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-0 shadow-md">
            <h4 className="font-bold text-xs uppercase tracking-wider text-brand-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Skill-Based Hiring Advantage
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed mt-2">
              SkillBridge candidates have taken proctored assessments. Filter by minimum required scores (e.g. React &gt;= 70%) to reduce screening cycles by up to 60%.
            </p>
            <Button
              variant="primary"
              size="xs"
              className="mt-4 w-full bg-brand-500 hover:bg-brand-400 text-white font-bold"
              onClick={() => navigateTo('candidates')}
            >
              Filter Candidates by Skill Threshold
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
