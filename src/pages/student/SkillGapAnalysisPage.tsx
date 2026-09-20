import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  Check,
  X,
  Clock,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { calculateSkillGaps, generateBridgeCourses, findMatchingSkill, getSkillStatus } from '../../utils/skillMatcher';
import { formatSalary } from '../../utils/salaryUtils';
import { CAREER_PATHS, MOCK_COURSES } from '../../data/mockData';
import { BridgeCourse, SkillGapItem } from '../../types';

export const SkillGapAnalysisPage: React.FC = () => {
  const {
    studentProfile,
    lastAssessmentResult,
    updateTargetCareer,
    hasTakenAssessment,
    reassessSkill,
    completeBridgeCourse,
    setDemoProfileState,
    navigateTo
  } = useApp();

  const [selectedCareerId, setSelectedCareerId] = useState<string>(
    studentProfile.targetCareerId || 'cp-fullstack'
  );

  const [activeBridgeModal, setActiveBridgeModal] = useState<BridgeCourse | null>(null);

  useEffect(() => {
    if (studentProfile.targetCareerId) {
      setSelectedCareerId(studentProfile.targetCareerId);
    }
  }, [studentProfile.targetCareerId]);

  const currentCareer =
    CAREER_PATHS.find(c => c.id === selectedCareerId) || CAREER_PATHS[0];

  const isMatchingActiveAssessment =
    selectedCareerId === studentProfile.targetCareerId ||
    (lastAssessmentResult && (
      (lastAssessmentResult.courseCategoryId === 'data-analyst' && selectedCareerId === 'cp-data-analyst') ||
      (lastAssessmentResult.courseCategoryId === 'fullstack' && selectedCareerId === 'cp-fullstack') ||
      (lastAssessmentResult.courseCategoryId === 'frontend' && selectedCareerId === 'cp-frontend') ||
      (lastAssessmentResult.courseCategoryId === 'backend' && selectedCareerId === 'cp-backend') ||
      (lastAssessmentResult.courseCategoryId === 'devops' && selectedCareerId === 'cp-cloud-devops') ||
      (lastAssessmentResult.courseCategoryId === 'ai-data' && selectedCareerId === 'cp-ai-ml')
    ));

  const activeAssessmentScore = isMatchingActiveAssessment && hasTakenAssessment
    ? (lastAssessmentResult?.calculatedScore ?? studentProfile.careerReadiness)
    : undefined;

  const {
    gaps,
    overallMatchScore,
    readinessStatus,
    biggestOpportunity,
    strategicExplanation,
    strongSkillsCount,
    gapSkillsCount,
    sortedGaps
  } = calculateSkillGaps(
    currentCareer.requiredSkills,
    studentProfile.skills,
    currentCareer.title,
    hasTakenAssessment,
    activeAssessmentScore
  );

  const displayReadinessScore = hasTakenAssessment ? overallMatchScore : 0;

  const bridgeCourses = generateBridgeCourses(gaps);

  const handleCareerChange = (careerId: string) => {
    setSelectedCareerId(careerId);
    updateTargetCareer(careerId);
  };

  const handleOpenBridgeCourse = (skillName: string) => {
    const course = bridgeCourses.find(bc => bc.skillName.toLowerCase() === skillName.toLowerCase());
    if (course) {
      setActiveBridgeModal(course);
    } else {
      navigateTo('learning');
    }
  };

  const handleCompleteBridgeCourseModal = (skillName: string) => {
    completeBridgeCourse(skillName);
    setActiveBridgeModal(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* 1. Header with Title, Subtitle, and Target Career Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-1.5 border border-brand-100 dark:border-brand-800">
            <Target className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>AI Competency Gap Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Skill Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Compare your verified skill proficiency against industry job profiles to identify high-impact learning targets.
          </p>
        </div>

        {/* Target Career Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full md:w-auto">
          <label htmlFor="target-career-select" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
            Target Career:
          </label>
          <div className="relative w-full sm:w-80">
            <select
              id="target-career-select"
              value={selectedCareerId}
              onChange={e => handleCareerChange(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm rounded-xl px-3.5 py-2.5 pr-9 shadow-2xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none cursor-pointer transition"
            >
              {CAREER_PATHS.map(cp => (
                <option key={cp.id} value={cp.id}>
                  {cp.title} ({cp.demandLevel})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="space-y-6">
        {/* Top Dual Cards: Overall Role Readiness + AI Strategic Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Card: OVERALL ROLE READINESS */}
          <Card className="flex flex-col justify-between bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-2xl">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <span>OVERALL ROLE READINESS</span>
                <Badge variant={currentCareer.demandLevel === 'Critical Demand' ? 'brand' : 'indigo'} size="xs">
                  {currentCareer.demandLevel.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-baseline gap-3 my-2">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                  {hasTakenAssessment ? `${displayReadinessScore}%` : '--'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Target: <strong className="text-slate-900 dark:text-slate-200">85%+</strong> for tier-1 shortlist
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                {hasTakenAssessment
                  ? `Calculated across ${currentCareer.requiredSkills.length} required competencies from your completed assessment.`
                  : `Complete your Skill Assessment to calculate your verified role readiness.`}
              </p>
            </div>

            <div>
              {/* Visual Progress Bar with Threshold Target */}
              <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    !hasTakenAssessment
                      ? 'bg-slate-300 dark:bg-slate-600'
                      : displayReadinessScore >= 80
                      ? 'bg-blue-600'
                      : displayReadinessScore >= 60
                      ? 'bg-brand-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${hasTakenAssessment ? Math.min(100, displayReadinessScore) : 0}%` }}
                />
                {/* Benchmark 85% tick indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-900/60 dark:bg-white/60"
                  style={{ left: '85%' }}
                  title="Tier-1 Shortlist Target: 85%"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{hasTakenAssessment ? `${strongSkillsCount} Strong` : '-- Strong'}</span>
                </span>
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                  <span>{hasTakenAssessment ? `${gapSkillsCount} Gaps to Bridge` : '-- Gaps'}</span>
                </span>
              </div>
            </div>
          </Card>

          {/* Right Card: AI STRATEGIC RECOMMENDATION */}
          <Card className="lg:col-span-2 bg-[#0d1527] text-white border-0 shadow-md p-6 sm:p-7 rounded-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI STRATEGIC RECOMMENDATION</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Your Career Roadmap Strategy
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl mt-1">
                {hasTakenAssessment
                  ? biggestOpportunity
                  : 'No verified assessment data found. Complete a proctored skill benchmark assessment to calculate your exact competency gaps and unlock personalized learning modules.'}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div className="text-xs text-slate-300">
                Average industry compensation: <strong className="text-white font-mono text-sm">{formatSalary(currentCareer.avgSalary)}</strong>
              </div>
              <div className="flex items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold"
                  onClick={() => navigateTo('career-detail', { careerId: currentCareer.id })}
                >
                  View Career Roadmap
                </Button>
                {hasTakenAssessment ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md"
                    icon={<BookOpen className="w-4 h-4" />}
                    onClick={() => navigateTo('learning')}
                  >
                    Start Bridge Courses
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md"
                    icon={<Award className="w-4 h-4" />}
                    onClick={() => navigateTo('skill-assessment')}
                  >
                    Take Skill Assessment
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* 3. Detailed Side-by-Side Required Skills Breakdown */}
        <Card className="p-6 sm:p-7 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Required Skills Breakdown for {currentCareer.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                Side-by-side comparison between industry requirement benchmarks and your verified competence
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 shrink-0"
              icon={<Award className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
              onClick={() => navigateTo('skill-assessment')}
            >
              Take Skill Assessment
            </Button>
          </div>

          {/* List of Skill Rows */}
          <div className="space-y-3.5">
            {sortedGaps.map(item => {
              const isUnassessed = !hasTakenAssessment || item.status === 'unassessed';
              const isStrong = !isUnassessed && (item.status === 'excellent' || item.status === 'strong');
              const isGap = !isUnassessed && (item.status === 'gap' || item.status === 'critical_gap');

              return (
                <div
                  key={item.skillName}
                  className={`p-4 rounded-xl border transition-all ${
                    isUnassessed
                      ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700'
                      : isStrong
                      ? 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                      : isGap
                      ? 'bg-rose-50/20 dark:bg-rose-950/20 border-rose-200/90 dark:border-rose-800/60'
                      : 'bg-amber-50/20 dark:bg-amber-950/20 border-amber-200/90 dark:border-amber-800/60'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Skill Name + Status Badge + Gap Subtitle */}
                    <div className="space-y-1 md:w-1/3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{item.skillName}</span>
                        {isUnassessed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            <span>Not Assessed</span>
                          </span>
                        ) : isStrong ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{item.statusLabel}</span>
                          </span>
                        ) : isGap ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                            <span>{item.statusLabel}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            <span>{item.statusLabel}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isUnassessed
                          ? 'Assessment required to calculate verified competency score.'
                          : isStrong
                          ? 'Meets or exceeds minimum role requirements.'
                          : `Gap of ${item.gapPercentage}% below required benchmark.`}
                      </p>
                    </div>

                    {/* Middle: Score Comparison & Visual Progress Bar with Target Benchmark Line */}
                    <div className="flex-1 max-w-md space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <span>
                          Your Score: <strong className="text-slate-900 dark:text-white font-mono font-bold">{isUnassessed ? '--' : `${item.studentScore}%`}</strong>
                        </span>
                        <span>
                          Required: <strong className="text-slate-900 dark:text-white font-mono font-bold">{item.requiredScore}%</strong>
                        </span>
                      </div>
                      <div className="relative w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isUnassessed
                              ? 'bg-slate-300 dark:bg-slate-600'
                              : isStrong
                              ? 'bg-emerald-500'
                              : isGap
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${isUnassessed ? 0 : Math.min(100, item.studentScore)}%` }}
                        />
                        {/* Required threshold tick mark */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-slate-900/70 dark:bg-white/70"
                          style={{ left: `${item.requiredScore}%` }}
                          title={`Required Benchmark: ${item.requiredScore}%`}
                        />
                      </div>
                    </div>

                    {/* Right: Remedial Action Button */}
                    <div className="shrink-0 flex items-center gap-2">
                      {isUnassessed ? (
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs"
                          icon={<Award className="w-3.5 h-3.5" />}
                          onClick={() => navigateTo('skill-assessment')}
                        >
                          Assess Skill
                        </Button>
                      ) : isGap ? (
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs"
                          icon={<BookOpen className="w-3.5 h-3.5" />}
                          onClick={() => handleOpenBridgeCourse(item.skillName)}
                        >
                          Bridge Course
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 font-bold text-xs"
                          icon={<Award className="w-3.5 h-3.5" />}
                          onClick={() => navigateTo('skill-assessment')}
                        >
                          Retake
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 4. Interactive Personalized Bridge Course Modal */}
      {activeBridgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <Card className="max-w-xl w-full p-6 sm:p-7 bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="brand" size="xs">
                    Bridge Course • {activeBridgeModal.difficulty}
                  </Badge>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 inline mr-1" /> {activeBridgeModal.estimatedDuration}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {activeBridgeModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveBridgeModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gap Info Banner */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <div className="flex justify-between font-bold text-amber-900">
                <span>Current Score: {activeBridgeModal.userScore}%</span>
                <span>Target Benchmark: {activeBridgeModal.requiredScore}%</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                {activeBridgeModal.description}
              </p>
            </div>

            {/* Topics Included */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">
                Topics Covered:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeBridgeModal.topics.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span className="font-medium">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Tasks */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">
                Hands-on Practice Tasks:
              </span>
              <ul className="space-y-1.5 pl-1">
                {activeBridgeModal.practiceTasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mini Project */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">
                Mini Project:
              </span>
              <p className="text-slate-600 leading-relaxed">
                {activeBridgeModal.miniProject}
              </p>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                className="text-slate-600"
                onClick={() => setActiveBridgeModal(null)}
              >
                Close
              </Button>

              <Button
                variant="primary"
                size="md"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                icon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => handleCompleteBridgeCourseModal(activeBridgeModal.skillName)}
              >
                Complete Module & Re-Assess
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
