import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Zap,
  Building,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, ProficiencyTag } from '../../components/common/Badge';
import { MatchScoreBadge } from '../../components/common/MatchScoreBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { calculateOpportunityMatch, calculateSkillGaps } from '../../utils/skillMatcher';
import { CAREER_PATHS, MOCK_COURSES } from '../../data/mockData';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    studentProfile,
    opportunities,
    applications,
    navigateTo
  } = useApp();

  const targetCareer =
    CAREER_PATHS.find(c => c.id === studentProfile.targetCareerId) || CAREER_PATHS[0];

  // Calculate gaps for target career
  const gapAnalysis = calculateSkillGaps(targetCareer.requiredSkills, studentProfile.skills);

  // Top skill gaps (sorted by lowest score / biggest negative delta)
  const topSkillGaps = gapAnalysis.gaps
    .filter(g => g.status === 'gap' || g.status === 'moderate')
    .sort((a, b) => a.studentScore - b.studentScore)
    .slice(0, 3);

  // Strong skills
  const strongSkills = studentProfile.skills
    .filter(s => s.score >= 75)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Recommended opportunities sorted by match score
  const recommendedOpps = opportunities
    .map(opp => ({
      opp,
      match: calculateOpportunityMatch(opp, studentProfile.skills)
    }))
    .sort((a, b) => b.match.matchPercentage - a.match.matchPercentage)
    .slice(0, 2);

  // Courses targeting the top skill gap
  const primaryGapSkill = topSkillGaps[0]?.skillName || 'React.js';
  const targetedCourses = MOCK_COURSES.filter(c =>
    c.targetSkill.toLowerCase().includes(primaryGapSkill.toLowerCase()) ||
    primaryGapSkill.toLowerCase().includes(c.targetSkill.toLowerCase())
  );
  const displayCourse = targetedCourses[0] || MOCK_COURSES[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Welcome & Summary Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target Role: {targetCareer.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Here is your verified career readiness breakdown and the most impactful actions to land your target role.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="bg-brand-500/20 hover:bg-brand-500/30 text-brand-200 border-brand-400/40"
              icon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              onClick={() => navigateTo('profile-setup')}
            >
              Personalize Feed (Setup Wizard)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => navigateTo('skill-gaps')}
            >
              Analyze Skill Gaps
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Award className="w-4 h-4" />}
              onClick={() => navigateTo('skill-assessment', { assessmentId: 'asm-react' })}
            >
              Take Assessment
            </Button>
          </div>
        </div>
      </div>

      {/* Main KPI Grid: Career Readiness & Focus Areas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Readiness Score Card */}
        <Card className="bg-gradient-to-br from-white to-slate-50 border-brand-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <span>Career Readiness</span>
              <Badge variant="brand" size="xs">
                {targetCareer.title}
              </Badge>
            </div>
            <div className="flex items-baseline gap-3 my-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                {studentProfile.careerReadiness}%
              </span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +{studentProfile.careerReadinessDelta}% this month
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Calculated across {targetCareer.requiredSkills.length} required competencies for {targetCareer.title}.
            </p>
          </div>

          <div>
            <ProgressBar value={studentProfile.careerReadiness} height="sm" variant="brand" />
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Benchmarked with industry:</span>
              <span className="font-semibold text-slate-800">Top 18% of Batch</span>
            </div>
          </div>
        </Card>

        {/* Top Skill Gaps to Improve */}
        <Card className="md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Top Skill Gaps</h3>
                  <p className="text-xs text-slate-500">Prioritized skills needing improvement for {targetCareer.title}</p>
                </div>
              </div>
              <button
                onClick={() => navigateTo('skill-gaps')}
                className="text-xs text-brand-600 hover:text-brand-800 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                View all gaps <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Gap List Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topSkillGaps.map(gap => (
                <div
                  key={gap.skillName}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-800 truncate">{gap.skillName}</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                        Gap {Math.abs(gap.gapDelta)}%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs text-slate-500 mb-1.5">
                      <span>Score: <strong className="text-slate-900">{gap.studentScore}%</strong></span>
                      <span>Target: {gap.requiredScore}%</span>
                    </div>
                    <ProgressBar value={gap.studentScore} target={gap.requiredScore} height="xs" variant="warning" />
                  </div>

                  <button
                    onClick={() => navigateTo('learning')}
                    className="mt-3 text-[11px] font-bold text-brand-600 hover:text-brand-800 inline-flex items-center gap-1 cursor-pointer pt-1 border-t border-slate-200/60"
                  >
                    Bridge Gap <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Strong Skills footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-medium">Your Strongest Skills:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {strongSkills.map(skill => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {skill.name} ({skill.score}%)
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recommended Opportunities & Learning Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Opportunities (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-brand-600">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recommended Opportunities</h3>
                <p className="text-xs text-slate-500">Transparent AI match scoring based on your verified skills</p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('opportunities')}
              className="text-xs text-brand-600 hover:text-brand-800 font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              Explore All ({opportunities.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendedOpps.map(({ opp, match }) => (
              <Card
                key={opp.id}
                hover
                onClick={() => navigateTo('opportunity-detail', { opportunityId: opp.id })}
                className="group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl ${opp.company.color} text-white font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0`}
                    >
                      {opp.company.initials}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                          {opp.title}
                        </h4>
                        <Badge
                          variant={opp.type === 'internship' ? 'brand' : opp.type === 'job' ? 'success' : 'purple'}
                          size="xs"
                        >
                          {opp.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 font-medium flex items-center gap-2">
                        <span>{opp.company.name}</span>
                        <span>•</span>
                        <span>{opp.location}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-900">{opp.stipendSalary}</span>
                      </p>
                    </div>
                  </div>

                  {/* Match score badge with transparent breakdown */}
                  <div className="shrink-0 flex sm:flex-col items-end gap-2">
                    <MatchScoreBadge
                      score={match.matchPercentage}
                      strongSkills={match.strongSkills}
                      developingSkills={match.developingSkills}
                      missingSkills={match.missingSkills}
                      expandable={true}
                    />
                  </div>
                </div>

                {/* Required skills chips */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">Required:</span>
                    {opp.requiredSkills.map(req => {
                      const studentSkill = studentProfile.skills.find(s => s.name.toLowerCase() === req.skillName.toLowerCase());
                      const isStrong = studentSkill && studentSkill.score >= req.minScore;
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

                  <Button
                    variant="outline"
                    size="xs"
                    icon={<ArrowRight className="w-3 h-3" />}
                    iconPosition="right"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('opportunity-detail', { opportunityId: opp.id });
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Learning & Activity Stream (1 Column) */}
        <div className="space-y-5">
          {/* Recommended Learning Widget */}
          <Card className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-0 shadow-md">
            <div className="flex items-center justify-between text-xs font-semibold text-brand-300 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Targeted Upskilling
              </span>
              <span>Based on Skill Gap</span>
            </div>
            
            <h4 className="font-bold text-base text-white mt-1 mb-1">
              Improve {primaryGapSkill}
            </h4>
            <p className="text-xs text-slate-300 mb-4 line-clamp-2">
              {displayCourse.title}
            </p>

            <div className="p-3 rounded-xl bg-white/10 border border-white/10 mb-4 text-xs space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Course Duration:</span>
                <span className="font-semibold text-white">{displayCourse.duration}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Rating:</span>
                <span className="font-semibold text-amber-300">★ {displayCourse.rating} / 5.0</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold"
              icon={<BookOpen className="w-4 h-4" />}
              onClick={() => navigateTo('learning')}
            >
              Explore 3 Recommended Courses
            </Button>
          </Card>

          {/* Recent Activity Card */}
          <Card>
            <CardHeader
              title="Recent Activity"
              subtitle="Your latest milestones and interactions"
              icon={<Clock className="w-4 h-4" />}
            />
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Application Shortlisted</p>
                  <p className="text-slate-500 text-[11px]">TechNova Solutions shortlisted you for Frontend Intern</p>
                  <span className="text-[10px] text-slate-400 font-mono">2 hours ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-blue-100 text-blue-700 mt-0.5 shrink-0">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Assessment Completed</p>
                  <p className="text-slate-500 text-[11px]">Verified score of 88% in JavaScript Architecture</p>
                  <span className="text-[10px] text-slate-400 font-mono">2 days ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-purple-100 text-purple-700 mt-0.5 shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Application Submitted</p>
                  <p className="text-slate-500 text-[11px]">Applied to Full Stack Associate at CloudBridge</p>
                  <span className="text-[10px] text-slate-400 font-mono">3 days ago</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
