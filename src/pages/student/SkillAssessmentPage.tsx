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
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { MOCK_ASSESSMENTS } from '../../data/mockData';
import confetti from 'canvas-confetti';

export const SkillAssessmentPage: React.FC = () => {
  const { activeAssessmentId, submitAssessment, navigateTo } = useApp();

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    activeAssessmentId || 'asm-react'
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15 mins default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  const assessment =
    MOCK_ASSESSMENTS.find(a => a.id === selectedAssessmentId) || MOCK_ASSESSMENTS[0];
  const questions = assessment.questions;
  const currentQ = questions[currentQuestionIdx];

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsTimerRunning(false);
    const timeSpent = (assessment.durationMinutes * 60) - timeLeft;

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }

    submitAssessment(assessment.id, answers, Math.max(15, timeSpent));
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Assessment Selector Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-brand-600" />
            Verified Skill Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Proctored, industry-aligned skill benchmarks. Results instantly recalibrate your match score.
          </p>
        </div>

        {/* Assessment picker */}
        <div className="flex items-center gap-2">
          {MOCK_ASSESSMENTS.map(asm => (
            <button
              key={asm.id}
              onClick={() => {
                setSelectedAssessmentId(asm.id);
                setCurrentQuestionIdx(0);
                setAnswers({});
                setTimeLeft(asm.durationMinutes * 60);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedAssessmentId === asm.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {asm.skillCategory.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Assessment Header Bar */}
      <Card className="bg-white border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="brand" size="xs">
                {assessment.skillCategory}
              </Badge>
              <Badge variant="indigo" size="xs">
                {assessment.badge}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{assessment.title}</h3>
          </div>

          {/* Timer & Question Counter */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-sm font-bold text-slate-800">
              <Clock className="w-4 h-4 text-brand-600 animate-pulse" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-slate-900">
                Question {currentQuestionIdx + 1} of {questions.length}
              </div>
              <div className="text-[11px] text-slate-500">
                {answeredCount} / {questions.length} Answered
              </div>
            </div>
          </div>
        </div>

        {/* Top Progress bar */}
        <div className="mt-4">
          <ProgressBar value={progressPercentage} height="xs" variant="brand" />
        </div>
      </Card>

      {/* Question Card */}
      <Card className="p-6 sm:p-8 border-slate-200 shadow-md">
        {/* Difficulty & Skill Tag */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Question #{currentQuestionIdx + 1}
          </span>
          <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            Difficulty: {currentQ.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-4">
          {currentQ.question}
        </h4>

        {/* Code Snippet (if available) */}
        {currentQ.codeSnippet && (
          <div className="mb-6 rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
            <pre>
              <code>{currentQ.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3 mt-4">
          {currentQ.options.map((option, idx) => {
            const isSelected = answers[currentQ.id] === idx;
            const letter = String.fromCharCode(65 + idx); // A, B, C, D

            return (
              <div
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/50 shadow-xs ring-1 ring-brand-500/30'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {letter}
                </div>
                <div className="flex-1 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                  {option}
                </div>
              </div>
            );
          })}
        </div>

        {/* Question Navigator Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentQuestionIdx === 0}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {/* Question Dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = currentQuestionIdx === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-brand-600 text-white ring-2 ring-brand-300'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {currentQuestionIdx < questions.length - 1 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Next Question
            </Button>
          ) : (
            <Button
              variant="success"
              size="sm"
              onClick={handleSubmit}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Submit & Verify ({answeredCount}/{questions.length})
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
