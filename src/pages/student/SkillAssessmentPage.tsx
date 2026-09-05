import React, { useState, useEffect } from 'react';
import {
  Clock,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { COURSE_CONFIGS, COURSE_ASSESSMENTS } from '../../data/courseAssessments';
import { CourseCategoryId } from '../../types';
import confetti from 'canvas-confetti';

export const SkillAssessmentPage: React.FC = () => {
  const { submitAssessment } = useApp();

  // State: selected course category
  const [selectedCourseId, setSelectedCourseId] = useState<CourseCategoryId>('data-analyst');
  const [isTestStarted, setIsTestStarted] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15 mins (900s)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  const selectedConfig = COURSE_CONFIGS.find(c => c.id === selectedCourseId) || COURSE_CONFIGS[0];
  const assessment = COURSE_ASSESSMENTS[selectedCourseId] || COURSE_ASSESSMENTS['fullstack'];
  const questions = assessment.questions;
  const currentQ = questions[currentQuestionIdx];

  // Timer countdown handler
  useEffect(() => {
    if (!isTestStarted || !isTimerRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTestStarted, isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectCourse = (courseId: CourseCategoryId) => {
    if (isTestStarted) return; // prevent mid-test change
    setSelectedCourseId(courseId);
    setAnswers({});
    setCurrentQuestionIdx(0);
  };

  const handleStartAssessment = () => {
    setIsTestStarted(true);
    setIsTimerRunning(true);
    setTimeLeft(selectedConfig.durationMinutes * 60);
    setCurrentQuestionIdx(0);
    setAnswers({});
  };

  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const handleFinalSubmit = () => {
    setIsTimerRunning(false);
    setIsSubmitModalOpen(false);
    const timeSpent = (selectedConfig.durationMinutes * 60) - timeLeft;

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }

    submitAssessment(assessment.id, answers, Math.max(15, timeSpent));
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const progressPercentage = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* 1. Course / Category Selector Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Proctored Industry Competency Benchmark</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Verified Skill Assessment
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Proctored, industry-aligned skill benchmarks. Results instantly recalibrate your match score and verified badge.
            </p>
          </div>

          {/* Prominent Course Selection Dropdown */}
          <div className="w-full md:w-80">
            <label htmlFor="course-select-dropdown" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Course / Career Category:
            </label>
            <div className="relative">
              <select
                id="course-select-dropdown"
                disabled={isTestStarted}
                value={selectedCourseId}
                onChange={(e) => handleSelectCourse(e.target.value as CourseCategoryId)}
                className="w-full bg-slate-50 border-2 border-brand-500 text-slate-900 font-semibold text-sm rounded-xl px-3.5 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-600 disabled:opacity-60 transition shadow-sm cursor-pointer"
              >
                {COURSE_CONFIGS.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Selected Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {COURSE_CONFIGS.map(c => {
            const isSelected = c.id === selectedCourseId;
            return (
              <button
                key={c.id}
                disabled={isTestStarted}
                onClick={() => handleSelectCourse(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                } ${isTestStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{c.badge}</span>
                <span className={`px-1.5 py-0.2 text-[10px] rounded ${
                  isSelected ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {c.demandTag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Assignment Overview Card (Before Test Starts) */}
      {!isTestStarted ? (
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-white via-slate-50/50 to-brand-50/20 border-2 border-brand-100 shadow-md rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Header / Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="brand" size="md">
                  <Award className="w-3.5 h-3.5" />
                  <span>{selectedConfig.badge}</span>
                </Badge>
                <Badge variant="indigo" size="md">
                  {selectedConfig.demandTag}
                </Badge>
              </div>
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                <span>Duration: {selectedConfig.durationMinutes} Minutes</span>
              </div>
            </div>

            {/* Course Title & Description */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {selectedConfig.title.split(' (')[0]} Assessment
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mt-2 max-w-3xl">
                {selectedConfig.description}
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Questions</span>
                <p className="text-lg font-extrabold text-slate-900">{selectedConfig.totalQuestions} MCQs</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duration</span>
                <p className="text-lg font-extrabold text-slate-900">{selectedConfig.durationMinutes} Mins</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Passing Score</span>
                <p className="text-lg font-extrabold text-emerald-600">{selectedConfig.passingScore}%</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Difficulty</span>
                <p className="text-lg font-extrabold text-brand-600">{selectedConfig.difficulty}</p>
              </div>
            </div>

            {/* Skills Covered Tags */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Skills Evaluated in this Course:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedConfig.skillsCovered.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Start Assessment CTA */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Passing generates an industry-verified digital certificate & boosts match score.</span>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-bold shadow-md shadow-brand-500/20"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={handleStartAssessment}
              >
                Start Assessment
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        /* 3. Live Assessment Test View */
        <div className="space-y-6">
          {/* Active Test Header Bar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                  {selectedConfig.badge}
                </span>
                <span className="text-xs text-slate-500 font-medium">Proctored Session</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedConfig.title.split(' (')[0]} Assessment
              </h2>
            </div>

            {/* Timer & Question Counter */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
              {/* Timer Pill */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold shadow-xs border ${
                timeLeft < 180
                  ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                  : 'bg-slate-900 text-white border-slate-800'
              }`}>
                <Clock className="w-4 h-4 text-brand-400" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {/* Progress Counters */}
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900">
                  Question {currentQuestionIdx + 1} of {questions.length}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {answeredCount} / {questions.length} Answered
                </div>
              </div>
            </div>
          </div>

          {/* Question Navigation Palette Grid (1-10) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
              <span>Question Palette:</span>
              <span className="text-slate-400 font-normal">Click any number to jump</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = idx === currentQuestionIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`h-9 rounded-lg text-xs font-bold transition flex items-center justify-center relative ${
                      isCurrent
                        ? 'bg-brand-600 text-white ring-2 ring-brand-400 ring-offset-1 shadow-sm'
                        : isAnswered
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isAnswered && !isCurrent && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Question & Options Card */}
          <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                QUESTION #{currentQuestionIdx + 1}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Difficulty: {currentQ.difficulty.charAt(0).toUpperCase() + currentQ.difficulty.slice(1)}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>

            {/* Optional Code Snippet */}
            {currentQ.codeSnippet && (
              <div className="rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
                <pre>{currentQ.codeSnippet}</pre>
              </div>
            )}

            {/* MCQ Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = answers[currentQ.id] === optIdx;
                const optionLabel = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 group ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <span className={`w-7 h-7 shrink-0 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}>
                      {optionLabel}
                    </span>
                    <span className={`text-sm leading-relaxed mt-0.5 ${
                      isSelected ? 'font-semibold text-slate-900' : 'text-slate-700'
                    }`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Previous / Next / Submit Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                disabled={currentQuestionIdx === 0}
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={handlePrev}
              >
                Previous
              </Button>

              {currentQuestionIdx < questions.length - 1 ? (
                <Button
                  variant="primary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="md"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={() => setIsSubmitModalOpen(true)}
                >
                  Submit Assessment
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* 5. Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <Card className="max-w-md w-full p-6 sm:p-7 bg-white rounded-2xl shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">
                Are you sure you want to submit?
              </h3>
              <p className="text-xs text-slate-500">
                Once submitted, your answers will be scored automatically and your verified badge will be generated.
              </p>
            </div>

            {/* Stats Summary Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between font-medium text-slate-700">
                <span>Selected Course:</span>
                <span className="font-bold text-slate-900">{selectedConfig.badge}</span>
              </div>
              <div className="flex justify-between font-medium text-slate-700">
                <span>Answered Questions:</span>
                <span className="font-bold text-emerald-600">{answeredCount} / {questions.length}</span>
              </div>
              <div className="flex justify-between font-medium text-slate-700">
                <span>Unanswered Questions:</span>
                <span className={`font-bold ${unansweredCount > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                  {unansweredCount}
                </span>
              </div>
              <div className="flex justify-between font-medium text-slate-700">
                <span>Time Remaining:</span>
                <span className="font-mono font-bold text-slate-900">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={() => setIsSubmitModalOpen(false)}
              >
                Continue Test
              </Button>

              <Button
                variant="primary"
                size="md"
                className="flex-1 bg-brand-600 hover:bg-brand-700 font-bold"
                onClick={handleFinalSubmit}
              >
                Submit Assessment
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
