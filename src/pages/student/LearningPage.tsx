import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Star,
  Clock,
  Award,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Play,
  ArrowRight,
  AlertCircle,
  Check,
  Zap,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { calculateSkillGaps, generateBridgeCourses, getSkillStatus } from '../../utils/skillMatcher';
import { CAREER_PATHS, MOCK_COURSES } from '../../data/mockData';
import { BridgeCourse } from '../../types';

export const LearningPage: React.FC = () => {
  const { studentProfile, completeBridgeCourse, hasTakenAssessment, navigateTo, showToast } = useApp();
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCourseModal, setActiveCourseModal] = useState<BridgeCourse | null>(null);

  const targetCareer = CAREER_PATHS.find(c => c.id === studentProfile.targetCareerId) || CAREER_PATHS[0];
  const { gaps, gapSkillsCount } = calculateSkillGaps(
    targetCareer.requiredSkills,
    studentProfile.skills,
    targetCareer.title,
    hasTakenAssessment
  );

  const bridgeCourses = generateBridgeCourses(gaps);

  // Filter bridge courses based on search & filter
  const filteredBridgeCourses = bridgeCourses.filter(c => {
    if (selectedSkillFilter !== 'all' && !c.skillName.toLowerCase().includes(selectedSkillFilter.toLowerCase())) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.skillName.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCompleteCourse = (skillName: string) => {
    completeBridgeCourse(skillName);
    setActiveCourseModal(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-1.5 border border-brand-100 dark:border-brand-800">
            <Zap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Targeted Bridge Courses & Remediation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Targeted Learning & Upskilling
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Curated industry modules aligned directly with your detected skill gaps to elevate your readiness for tier-1 roles.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="text-xs font-bold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
          icon={<Target className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
          onClick={() => navigateTo('skill-gaps')}
        >
          Check Skill Gap Analysis
        </Button>
      </div>

      {/* 2. Top Gap Remediation Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Continuous Improvement Loop</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            {!hasTakenAssessment
              ? 'Complete Assessment to Generate Custom Bridge Modules'
              : gapSkillsCount > 0
              ? `${gapSkillsCount} Personalized Bridge Modules Available`
              : 'All Required Skills Verified Strong!'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {!hasTakenAssessment
              ? 'Complete your assessment to receive personalized recommendations and auto-calibrated bridge modules.'
              : 'Completing any bridge course automatically updates your verified skill scores and recalculates your career readiness in real-time.'}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md"
            icon={<Award className="w-4 h-4" />}
            onClick={() => navigateTo('skill-assessment')}
          >
            Take Skill Assessment
          </Button>
        </div>
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          {['all', 'React', 'SQL', 'Node', 'JavaScript', 'Git'].map(s => (
            <button
              key={s}
              onClick={() => setSelectedSkillFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedSkillFilter === s
                  ? 'bg-slate-900 dark:bg-brand-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {s === 'all' ? 'All Skills' : s}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search bridge courses..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
          />
        </div>
      </div>

      {/* 4. Grid of Dynamic Bridge Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBridgeCourses.map(course => {
          const isCompleted = course.status === 'completed';

          return (
            <Card
              key={course.id}
              className={`flex flex-col justify-between group overflow-hidden bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm ${
                isCompleted ? 'bg-emerald-50/20 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' : ''
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 font-bold text-[11px] px-2.5 py-0.5 rounded-md">
                      {course.difficulty}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {course.estimatedDuration}
                    </span>
                  </div>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Completed
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded">
                      Gap: {course.gapSize}% Deficit
                    </span>
                  )}
                </div>

                {/* Course Title & Target Skill */}
                <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 mb-3 leading-relaxed">
                  {course.description}
                </p>

                {/* Score vs Target Progress */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 mb-3 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-300">Verified Skill: {course.skillName}</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">{course.userScore}% / {course.requiredScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isCompleted ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(100, course.userScore)}%` }}
                    />
                  </div>
                </div>

                {/* Topics Preview */}
                <div className="flex flex-wrap items-center gap-1 mb-4">
                  {course.topics.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
                  onClick={() => setActiveCourseModal(course)}
                >
                  View Details & Tasks
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  className={`text-xs font-bold ${isCompleted ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-brand-600 hover:bg-brand-700'}`}
                  icon={isCompleted ? <Check className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  onClick={() => handleCompleteCourse(course.skillName)}
                >
                  {isCompleted ? 'Re-take Quiz' : 'Complete & Re-Assess'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal for Bridge Course Detailed View */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <Card className="max-w-xl w-full p-6 sm:p-7 bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <Badge variant="brand" size="xs">
                  {activeCourseModal.difficulty} • {activeCourseModal.estimatedDuration}
                </Badge>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {activeCourseModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveCourseModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">Learning Objectives:</span>
              <ul className="space-y-1 pl-1">
                {activeCourseModal.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">Practice Tasks:</span>
              <div className="space-y-1.5">
                {activeCourseModal.practiceTasks.map((task, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 text-xs space-y-1">
              <span className="font-bold text-brand-900 dark:text-brand-200 uppercase tracking-wider block">Capstone Task:</span>
              <p className="text-brand-800 dark:text-brand-300">{activeCourseModal.miniProject}</p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="md"
                className="text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                onClick={() => setActiveCourseModal(null)}
              >
                Close
              </Button>

              <Button
                variant="primary"
                size="md"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                icon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => handleCompleteCourse(activeCourseModal.skillName)}
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
