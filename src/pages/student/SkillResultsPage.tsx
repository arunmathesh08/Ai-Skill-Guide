import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Target,
  Clock,
  Sparkles,
  RotateCcw,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, ProficiencyTag } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';

export const SkillResultsPage: React.FC = () => {
  const { lastAssessmentResult, studentProfile, navigateTo } = useApp();
  const [showDetailedAnswers, setShowDetailedAnswers] = useState<boolean>(false);

  // Use lastAssessmentResult or latest assessment record from profile
  const latestHistory = studentProfile.assessmentHistory && studentProfile.assessmentHistory.length > 0
    ? studentProfile.assessmentHistory[0]
    : null;

  const result = lastAssessmentResult;

  if (!result && !latestHistory) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12 pt-8">
        <Card className="p-8 sm:p-12 text-center bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              No Assessment Results Found
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              You haven't completed a skill assessment yet. Take an assessment to view your verified scores and detailed question breakdown.
            </p>
          </div>
          <div>
            <Button
              variant="primary"
              size="lg"
              className="px-8 font-bold shadow-md shadow-brand-500/20"
              icon={<Award className="w-5 h-5" />}
              onClick={() => navigateTo('skill-assessment')}
            >
              Take Skill Assessment
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const courseTitle = result?.courseCategoryTitle || result?.assessment.title || latestHistory?.title || 'Verified Skill Assessment';
  const calculatedScore = result ? result.calculatedScore : (latestHistory?.score || 0);
  const passed = result ? result.passed : (latestHistory?.passed || false);
  const totalQuestions = result ? result.totalQuestions : 10;
  const correctCount = result ? result.correctAnswersCount : Math.round((calculatedScore / 100) * totalQuestions);
  const incorrectCount = result ? result.incorrectAnswersCount : (totalQuestions - correctCount);
  const timeSpentSeconds = result ? result.timeSpentSeconds : 600;
  const skillLevel = calculatedScore >= 80 ? 'Advanced' : calculatedScore >= 60 ? 'Intermediate' : 'Developing';

  const formatMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Skill breakdown derived strictly from result or profile skills
  const skillBreakdown = result?.skillBreakdown && result.skillBreakdown.length > 0
    ? result.skillBreakdown
    : Object.entries(latestHistory?.skillScores || {}).map(([skill, percentage]) => ({
        skill,
        total: 1,
        correct: percentage >= 60 ? 1 : 0,
        percentage
      }));

  // Strongest and weakest skills for recommendation
  const sortedBreakdown = [...skillBreakdown].sort((a, b) => b.percentage - a.percentage);
  const strongestSkill = sortedBreakdown[0]?.skill || 'Assessed Domain';
  const weakestSkill = sortedBreakdown[sortedBreakdown.length - 1]?.skill || 'Core Fundamentals';

  // Circular Ring Parameters
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calculatedScore / 100) * circumference;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Assessment Completed!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {courseTitle.split(' (')[0]}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Your assessment has been evaluated. Your verified skill metrics and readiness scores have been recalibrated.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="shrink-0 flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white/20 hover:bg-white/10 text-xs font-semibold"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => navigateTo('skill-assessment')}
            >
              Retake
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white/20 hover:bg-white/10 text-xs font-semibold"
              icon={<Target className="w-3.5 h-3.5 text-brand-300" />}
              onClick={() => navigateTo('skill-gaps')}
            >
              Skill Gap Analysis
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-brand-600 hover:bg-brand-500 font-bold text-xs shadow-md"
              icon={<Compass className="w-3.5 h-3.5" />}
              onClick={() => navigateTo('careers')}
            >
              Career Paths
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Score Overview & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Circular Progress Score Card */}
        <Card className="p-6 sm:p-7 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4 rounded-2xl">
          <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Overall Score Percentage
          </div>

          {/* SVG Circular Ring */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              {/* Background Ring */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress Ring */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className={passed ? 'text-emerald-500' : 'text-amber-500'}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {calculatedScore}%
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full mt-1 ${
                passed ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              }`}>
                {passed ? 'Passed' : 'Needs Practice'}
              </span>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs">
            <div>
              <span className="block text-slate-400 dark:text-slate-500 font-medium">Passing Score</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">60%</span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="block text-slate-400 dark:text-slate-500 font-medium">Skill Level</span>
              <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{skillLevel}</span>
            </div>
          </div>
        </Card>

        {/* Detailed Metrics Card (2 cols on LG) */}
        <Card className="lg:col-span-2 p-6 sm:p-7 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 rounded-2xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Assessment Summary Statistics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed performance metrics evaluated during your proctored assessment session.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Questions</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{totalQuestions}</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 space-y-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Correct</span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{correctCount}</span>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60 space-y-1">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">Incorrect</span>
              <span className="text-2xl font-black text-rose-700 dark:text-rose-300">{incorrectCount}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Time Taken</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{formatMinutes(timeSpentSeconds)}</span>
            </div>
          </div>

          {/* 8. Result Recommendation */}
          <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-800/80 space-y-1">
            <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>AI Skill Performance Feedback</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {calculatedScore >= 80 ? (
                <>
                  <strong className="text-slate-900 dark:text-white font-bold">Excellent Performance!</strong> You demonstrated strong knowledge in <strong className="text-brand-700 dark:text-brand-300">{strongestSkill}</strong> and core concepts. Consider polishing your <strong className="text-slate-900 dark:text-white">{weakestSkill}</strong> to achieve 90%+ target readiness.
                </>
              ) : (
                <>
                  <strong className="text-slate-900 dark:text-white font-bold font-semibold">Good Effort!</strong> You passed the benchmark score. Strengthening <strong className="text-slate-900 dark:text-white">{weakestSkill}</strong> will boost your job match probability significantly.
                </>
              )}
            </p>
          </div>
        </Card>
      </div>

      {/* 7. Skill Breakdown Progress Bars */}
      <Card className="p-6 sm:p-8 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl space-y-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Performance Breakdown by Skill
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Detailed score distribution across specific technical domains tested in this course.
          </p>
        </div>

        <div className="space-y-4">
          {skillBreakdown.map((sb, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">{sb.skill}</span>
                <span className="font-mono text-slate-900 dark:text-white font-bold">{sb.percentage}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-600">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    sb.percentage >= 80
                      ? 'bg-emerald-500'
                      : sb.percentage >= 60
                      ? 'bg-brand-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${sb.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Answers Section (Toggle) */}
      <Card className="p-6 sm:p-8 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Detailed Question Review
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review all questions, your submitted answers, and official explanations.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
            onClick={() => setShowDetailedAnswers(!showDetailedAnswers)}
            icon={showDetailedAnswers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          >
            {showDetailedAnswers ? 'Hide Answers' : 'View Detailed Answers'}
          </Button>
        </div>

        {showDetailedAnswers && result?.questionResults && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
            {result.questionResults.map((qr, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  qr.isCorrect
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50/40 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                } space-y-2`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Q{idx + 1}. {qr.question}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    qr.isCorrect ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                  }`}>
                    {qr.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block font-medium">Your Answer:</span>
                    <span className={`font-semibold ${qr.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                      {qr.selectedOption}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block font-medium">Correct Answer:</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">{qr.correctOption}</span>
                  </div>
                </div>

                {qr.explanation && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700 mt-2">
                    <strong className="text-slate-800 dark:text-slate-100">Explanation: </strong> {qr.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
