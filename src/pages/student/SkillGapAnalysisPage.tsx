import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Award,
  Compass,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, ProficiencyTag } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { calculateSkillGaps } from '../../utils/skillMatcher';
import { CAREER_PATHS, MOCK_COURSES } from '../../data/mockData';

export const SkillGapAnalysisPage: React.FC = () => {
  const { studentProfile, updateTargetCareer, navigateTo } = useApp();
  const [selectedCareerId, setSelectedCareerId] = useState<string>(
    studentProfile.targetCareerId || 'cp-fullstack'
  );

  const currentCareer =
    CAREER_PATHS.find(c => c.id === selectedCareerId) || CAREER_PATHS[0];

  const {
    gaps,
    overallMatchScore,
    biggestOpportunity,
    strongSkillsCount,
    gapSkillsCount
  } = calculateSkillGaps(currentCareer.requiredSkills, studentProfile.skills);

  const handleCareerChange = (careerId: string) => {
    setSelectedCareerId(careerId);
    updateTargetCareer(careerId);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>AI Competency Gap Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Skill Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare your verified skill proficiency against industry job profiles to identify high-impact learning targets.
          </p>
        </div>

        {/* Quick Career Selector Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Target Career:</label>
          <select
            value={selectedCareerId}
            onChange={e => handleCareerChange(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-900 shadow-2xs focus:ring-2 focus:ring-brand-500 focus:outline-none cursor-pointer"
          >
            {CAREER_PATHS.map(cp => (
              <option key={cp.id} value={cp.id}>
                {cp.title} ({cp.demandLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Career Summary & "Biggest Opportunity" Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Readiness Metric Card */}
        <Card className="flex flex-col justify-between bg-gradient-to-br from-white to-slate-50">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <span>Overall Role Readiness</span>
              <Badge variant="brand" size="xs">
                {currentCareer.demandLevel}
              </Badge>
            </div>
            <div className="flex items-baseline gap-3 my-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900">
                {overallMatchScore}%
              </span>
              <span className="text-xs text-slate-500">
                Target: <strong>85%+</strong> for tier-1 shortlist
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Based on {currentCareer.requiredSkills.length} required competencies weighted against industry hiring criteria.
            </p>
          </div>

          <div>
            <ProgressBar value={overallMatchScore} height="sm" variant="brand" />
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {strongSkillsCount} Strong
              </span>
              <span className="text-rose-700 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {gapSkillsCount} Gaps to Bridge
              </span>
            </div>
          </div>
        </Card>

        {/* "Your Biggest Opportunity" Highlight Banner (Standout Feature) */}
        <Card className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-0 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Strategic Recommendation</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              Your Biggest Career Opportunity
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              {biggestOpportunity}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              Average industry compensation: <strong className="text-white font-mono">{currentCareer.avgSalary}</strong>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={() => navigateTo('career-detail', { careerId: currentCareer.id })}
              >
                View Career Roadmap
              </Button>
              <Button
                variant="primary"
                size="xs"
                className="bg-brand-500 hover:bg-brand-400 text-white"
                icon={<BookOpen className="w-3.5 h-3.5" />}
                onClick={() => navigateTo('learning')}
              >
                Start Bridge Courses
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Side-by-Side Skill Breakdown Table / Cards */}
      <Card>
        <CardHeader
          title={`Required Skills Breakdown for ${currentCareer.title}`}
          subtitle="Side-by-side comparison between industry requirement benchmarks and your verified competence"
          icon={<Award className="w-4 h-4" />}
          action={
            <Button
              variant="outline"
              size="xs"
              icon={<Award className="w-3.5 h-3.5" />}
              onClick={() => navigateTo('skill-assessment')}
            >
              Take Skill Assessment
            </Button>
          }
        />

        <div className="space-y-3">
          {gaps.map(item => {
            const isStrong = item.status === 'strong';
            const isGap = item.status === 'gap';

            // Find matching courses for this skill
            const matchedCourse = MOCK_COURSES.find(c =>
              c.targetSkill.toLowerCase().includes(item.skillName.toLowerCase()) ||
              item.skillName.toLowerCase().includes(c.targetSkill.toLowerCase())
            );

            return (
              <div
                key={item.skillName}
                className={`p-4 rounded-xl border transition-all ${
                  isStrong
                    ? 'bg-white border-slate-200/90'
                    : isGap
                    ? 'bg-rose-50/30 border-rose-200/80'
                    : 'bg-amber-50/20 border-amber-200/80'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Skill name & Status Badge */}
                  <div className="space-y-1 md:w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.skillName}</span>
                      {isStrong ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Strong
                        </span>
                      ) : isGap ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertCircle className="w-3 h-3 text-rose-600" /> Skill Gap
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Moderate
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isStrong
                        ? 'Meets or exceeds minimum role requirements.'
                        : `Gap of ${Math.abs(item.gapDelta)}% below recommended threshold.`}
                    </p>
                  </div>

                  {/* Progress Comparison */}
                  <div className="flex-1 max-w-md space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                      <span>
                        Your Score: <strong className="text-slate-900 font-mono">{item.studentScore}%</strong>
                      </span>
                      <span>
                        Required: <strong className="text-slate-900 font-mono">{item.requiredScore}%</strong>
                      </span>
                    </div>
                    <ProgressBar
                      value={item.studentScore}
                      target={item.requiredScore}
                      height="sm"
                      variant={isStrong ? 'success' : isGap ? 'danger' : 'warning'}
                    />
                  </div>

                  {/* Remedial Action Button */}
                  <div className="shrink-0 flex items-center gap-2">
                    {matchedCourse ? (
                      <Button
                        variant={isStrong ? 'outline' : 'primary'}
                        size="xs"
                        icon={<BookOpen className="w-3 h-3" />}
                        onClick={() => navigateTo('learning')}
                      >
                        {isStrong ? 'Mastery Module' : 'Bridge Course'}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="xs"
                        icon={<Award className="w-3 h-3" />}
                        onClick={() => navigateTo('skill-assessment')}
                      >
                        Assess Skill
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Alternative Career Paths Explorer Banner */}
      <Card className="bg-slate-900 text-white border-0 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-base text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-400" />
              Explore All 6 Industry Career Roadmaps
            </h4>
            <p className="text-xs text-slate-300 max-w-lg">
              Compare your readiness across Frontend, Backend, Cloud & DevOps, AI/ML, and Data Analytics.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="bg-brand-500 hover:bg-brand-400 text-white shrink-0"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => navigateTo('careers')}
          >
            Explore Career Tracks
          </Button>
        </div>
      </Card>
    </div>
  );
};
