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
  LayoutDashboard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, ProficiencyTag } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';

export const SkillResultsPage: React.FC = () => {
  const { lastAssessmentResult, studentProfile, navigateTo } = useApp();
  const [showDetailedAnswers, setShowDetailedAnswers] = useState<boolean>(false);

  // Fallback default values if direct navigate
  const result = lastAssessmentResult;
  const courseTitle = result?.courseCategoryTitle || result?.assessment.title || 'Data Analyst & BI Specialist Assessment';
  const calculatedScore = result ? result.calculatedScore : 82;
  const passed = result ? result.passed : true;
  const totalQuestions = result ? result.totalQuestions : 10;
  const correctCount = result ? result.correctAnswersCount : 8;
  const incorrectCount = result ? result.incorrectAnswersCount : 2;
  const timeSpentSeconds = result ? result.timeSpentSeconds : 702; // 11:42
  const skillLevel = result ? result.skillLevel : 'Intermediate';

  const formatMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Skill breakdown array fallback
  const skillBreakdown = result?.skillBreakdown && result.skillBreakdown.length > 0
    ? result.skillBreakdown
    : [
        { skill: 'SQL & Queries', total: 3, correct: 3, percentage: 90 },
        { skill: 'Data Analysis', total: 2, correct: 2, percentage: 85 },
        { skill: 'Statistics & Probability', total: 2, correct: 1, percentage: 75 },
        { skill: 'Data Visualization', total: 2, correct: 1, percentage: 80 },
        { skill: 'Business Intelligence', total: 1, correct: 1, percentage: 82 }
      ];

  // Strongest and weakest skills for recommendation
  const sortedBreakdown = [...skillBreakdown].sort((a, b) => b.percentage - a.percentage);
  const strongestSkill = sortedBreakdown[0]?.skill || 'SQL';
  const weakestSkill = sortedBreakdown[sortedBreakdown.length - 1]?.skill || 'Statistics';

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
          <div className="shrink-0 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              className="text-white border-slate-700 hover:bg-slate-800"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={() => navigateTo('skill-assessment')}
            >
              Retake Assessment
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<LayoutDashboard className="w-4 h-4" />}
              onClick={() => navigateTo('dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Score Overview & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Circular Progress Score Card */}
        <Card className="p-6 sm:p-7 bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4 rounded-2xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
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
                className="text-slate-100"
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
              <span className="text-4xl font-black text-slate-900 tracking-tight">
                {calculatedScore}%
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full mt-1 ${
                passed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {passed ? 'Passed' : 'Needs Practice'}
              </span>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-around text-xs">
            <div>
              <span className="block text-slate-400 font-medium">Passing Score</span>
              <span className="text-sm font-bold text-slate-700">60%</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="block text-slate-400 font-medium">Skill Level</span>
              <span className="text-sm font-bold text-brand-600">{skillLevel}</span>
            </div>
          </div>
        </Card>

        {/* Detailed Metrics Card (2 cols on LG) */}
        <Card className="lg:col-span-2 p-6 sm:p-7 bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 rounded-2xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Assessment Summary Statistics
            </h3>
            <p className="text-xs text-slate-500">
              Detailed performance metrics evaluated during your proctored assessment session.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Questions</span>
              <span className="text-2xl font-black text-slate-900">{totalQuestions}</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Correct</span>
              <span className="text-2xl font-black text-emerald-700">{correctCount}</span>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/60 space-y-1">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Incorrect</span>
              <span className="text-2xl font-black text-rose-700">{incorrectCount}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Time Taken</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{formatMinutes(timeSpentSeconds)}</span>
            </div>
          </div>

          {/* 8. Result Recommendation */}
          <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-200/80 space-y-1">
            <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>AI Skill Performance Feedback</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {calculatedScore >= 80 ? (
                <>
                  <strong className="text-slate-900 font-bold">Excellent Performance!</strong> You demonstrated strong knowledge in <strong className="text-brand-700">{strongestSkill}</strong> and core concepts. Consider polishing your <strong className="text-slate-900">{weakestSkill}</strong> to achieve 90%+ target readiness.
                </>
              ) : (
                <>
                  <strong className="text-slate-900 font-bold font-semibold">Good Effort!</strong> You passed the benchmark score. Strengthening <strong className="text-slate-900">{weakestSkill}</strong> will boost your job match probability significantly.
                </>
              )}
            </p>
          </div>
        </Card>
      </div>

      {/* 7. Skill Breakdown Progress Bars */}
      <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Performance Breakdown by Skill
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed score distribution across specific technical domains tested in this course.
          </p>
        </div>

        <div className="space-y-4">
          {skillBreakdown.map((sb, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-800">{sb.skill}</span>
                <span className="font-mono text-slate-900 font-bold">{sb.percentage}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
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
      <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Detailed Question Review
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review all questions, your submitted answers, and official explanations.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetailedAnswers(!showDetailedAnswers)}
            icon={showDetailedAnswers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          >
            {showDetailedAnswers ? 'Hide Answers' : 'View Detailed Answers'}
          </Button>
        </div>

        {showDetailedAnswers && result?.questionResults && (
          <div className="space-y-4 pt-4 border-t border-slate-100 animate-fadeIn">
            {result.questionResults.map((qr, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  qr.isCorrect
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-rose-50/40 border-rose-200'
                } space-y-2`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500">
                    Q{idx + 1}. {qr.question}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    qr.isCorrect ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                  }`}>
                    {qr.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block font-medium">Your Answer:</span>
                    <span className={`font-semibold ${qr.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {qr.selectedOption}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Correct Answer:</span>
                    <span className="font-semibold text-emerald-700">{qr.correctOption}</span>
                  </div>
                </div>

                {qr.explanation && (
                  <div className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200/60 mt-2">
                    <strong className="text-slate-800">Explanation: </strong> {qr.explanation}
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
