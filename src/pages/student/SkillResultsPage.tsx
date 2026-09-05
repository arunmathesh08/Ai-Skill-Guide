import React from 'react';
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
  HelpCircle,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, ProficiencyTag } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { getProficiencyTier } from '../../utils/skillMatcher';

export const SkillResultsPage: React.FC = () => {
  const { lastAssessmentResult, studentProfile, navigateTo } = useApp();

  // If no recent assessment taken, show general student profile skills
  const calculatedScore = lastAssessmentResult ? lastAssessmentResult.calculatedScore : 80;
  const skillName = lastAssessmentResult ? lastAssessmentResult.skillName : 'React.js';
  const previousScore = lastAssessmentResult ? lastAssessmentResult.previousScore : 58;
  const timeSpent = lastAssessmentResult ? Math.round(lastAssessmentResult.timeSpentSeconds / 60) : 8;
  const tier = getProficiencyTier(calculatedScore);

  const delta = calculatedScore - previousScore;

  // Strong vs Needs improvement in current student profile
  const sortedSkills = [...studentProfile.skills].sort((a, b) => b.score - a.score);
  const strongestSkills = sortedSkills.filter(s => s.score >= 70);
  const skillsToImprove = sortedSkills.filter(s => s.score < 70);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Banner / Assessment Congratulations */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Assessment Verified & Synced</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Skill Scorecard: {skillName}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Your assessment has been evaluated. Your career readiness and job match probabilities have been dynamically recalculated.
            </p>
          </div>

          {/* Direct CTA to Gap Analysis */}
          <div className="shrink-0 flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={<Target className="w-4 h-4" />}
              onClick={() => navigateTo('skill-gaps')}
            >
              Check Updated Skill Gaps
            </Button>
          </div>
        </div>
      </div>

      {/* Main Score Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Score & Tier Card */}
        <Card className="text-center flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-slate-50">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-3 shadow-inner">
            <Award className="w-8 h-8" />
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Verified Proficiency Score
          </div>
          <div className="text-5xl font-black text-slate-900 tracking-tight my-1">
            {calculatedScore}%
          </div>
          <div className="mt-2">
            <ProficiencyTag score={calculatedScore} size="md" />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 w-full flex items-center justify-around text-xs text-slate-500">
            <div>
              <span className="block font-bold text-slate-800">{previousScore}%</span>
              <span>Previous</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="block font-bold text-emerald-600">
                {delta >= 0 ? `+${delta}%` : `${delta}%`}
              </span>
              <span>Improvement</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="block font-bold text-slate-800">{timeSpent} mins</span>
              <span>Time Taken</span>
            </div>
          </div>
        </Card>

        {/* Strongest Skills & Skills to Improve */}
        <Card className="md:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              Overall Skill Competency Matrix
            </h3>

            <div className="space-y-3">
              {studentProfile.skills.slice(0, 5).map(skill => (
                <div key={skill.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      {skill.name}
                      {skill.verified && (
                        <span title="Verified Assessment">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-slate-900">{skill.score}%</span>
                  </div>
                  <ProgressBar value={skill.score} height="xs" variant="tier" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Benchmark: NIT CSE Cohort 2026</span>
            <button
              onClick={() => navigateTo('skill-gaps')}
              className="text-brand-600 font-bold hover:text-brand-800 cursor-pointer inline-flex items-center gap-1"
            >
              Analyze against Target Career <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>

      {/* Recommended Next Steps */}
      <Card className="border-brand-100 bg-brand-50/20">
        <CardHeader
          title="Recommended Next Steps"
          subtitle="Actions to maximize your internship and placement conversion"
          icon={<Target className="w-4 h-4 text-brand-600" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="p-2 rounded-lg bg-blue-50 text-brand-600 w-fit mb-2">
                <Target className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Target Career Gap Analysis</h4>
              <p className="text-xs text-slate-500 mb-3">
                See how your new score compares against Full Stack Developer requirements.
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              className="w-full"
              onClick={() => navigateTo('skill-gaps')}
            >
              View Gap Analysis
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 w-fit mb-2">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Bridge Remaining Gaps</h4>
              <p className="text-xs text-slate-500 mb-3">
                Enroll in targeted modules for Git & SQL indexing to reach 85%+ readiness.
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              className="w-full"
              onClick={() => navigateTo('learning')}
            >
              Explore Courses
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 w-fit mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Matched Opportunities</h4>
              <p className="text-xs text-slate-500 mb-3">
                Your match score for TechNova & CloudBridge has increased! Apply with verified badge.
              </p>
            </div>
            <Button
              variant="primary"
              size="xs"
              className="w-full"
              onClick={() => navigateTo('opportunities')}
            >
              Apply to Jobs
            </Button>
          </div>
        </div>
      </Card>

      {/* Detailed Question Review Breakdown (if submitted via active assessment) */}
      {lastAssessmentResult && lastAssessmentResult.questionResults && (
        <Card>
          <CardHeader
            title="Question Review & Technical Explanations"
            subtitle={`You answered ${lastAssessmentResult.correctAnswersCount} of ${lastAssessmentResult.totalQuestions} questions correctly.`}
            icon={<HelpCircle className="w-4 h-4" />}
          />

          <div className="space-y-4">
            {lastAssessmentResult.questionResults.map((qr, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  qr.isCorrect
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-rose-50/40 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-bold text-slate-900 text-sm">
                    Q{idx + 1}. {qr.question}
                  </div>
                  {qr.isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      <Check className="w-3 h-3" /> Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
                      <X className="w-3 h-3" /> Incorrect
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-700">
                  <div>
                    <span className="text-slate-500 font-medium">Your Answer: </span>
                    <strong className={qr.isCorrect ? 'text-emerald-800' : 'text-rose-800'}>
                      {qr.selectedOption}
                    </strong>
                  </div>
                  {!qr.isCorrect && (
                    <div>
                      <span className="text-slate-500 font-medium">Correct Answer: </span>
                      <strong className="text-emerald-800">{qr.correctOption}</strong>
                    </div>
                  )}
                </div>

                <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200/80 text-slate-600 leading-relaxed text-[11px]">
                  <strong className="text-slate-800">Explanation: </strong> {qr.explanation}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
