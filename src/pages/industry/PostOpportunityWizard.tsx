import React, { useState } from 'react';
import {
  PlusCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building,
  Briefcase,
  Sliders,
  DollarSign,
  Calendar,
  Sparkles,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Opportunity } from '../../types';

export const PostOpportunityWizard: React.FC = () => {
  const { currentUser, postOpportunity, navigateTo } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [title, setTitle] = useState('Frontend Developer Intern');
  const [type, setType] = useState<'internship' | 'job' | 'training'>('internship');
  const [isRemote, setIsRemote] = useState(false);
  const [location, setLocation] = useState('Bengaluru, Karnataka (Hybrid)');
  const [duration, setDuration] = useState('6 Months (PPO Opportunity)');
  const [stipendSalary, setStipendSalary] = useState('₹35,000 / month');
  const [deadline, setDeadline] = useState('30 Sep 2026');
  const [eligibility, setEligibility] = useState('B.Tech/BE (CSE/IT/ECE) 2026 Batch, Min 7.5 CGPA');
  const [description, setDescription] = useState(
    'Join our core product team to build high-performance, modular UI components with React, TypeScript, and modern state architectures.'
  );
  const [responsibilitiesText, setResponsibilitiesText] = useState(
    'Implement reusable UI components in React & TypeScript.\nOptimize client-side performance and Core Web Vitals.\nParticipate in daily engineering standups and code reviews.'
  );
  const [perksText, setPerksText] = useState('PPO Opportunity worth ₹14 LPA\nFlexible Hybrid Work\nLearning Budget');

  // Required skills list with proficiency thresholds
  const [skills, setSkills] = useState<{ skillName: string; minScore: number }[]>([
    { skillName: 'React.js', minScore: 70 },
    { skillName: 'JavaScript', minScore: 75 },
    { skillName: 'SQL & Database Design', minScore: 60 }
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillScore, setNewSkillScore] = useState(65);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills(prev => [...prev, { skillName: newSkillName.trim(), minScore: newSkillScore }]);
    setNewSkillName('');
    setNewSkillScore(65);
  };

  const handleRemoveSkill = (idx: number) => {
    setSkills(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateSkillScore = (idx: number, score: number) => {
    setSkills(prev => prev.map((s, i) => (i === idx ? { ...s, minScore: score } : s)));
  };

  const handlePublish = () => {
    const oppPayload: Omit<Opportunity, 'id' | 'postedDate' | 'applicantsCount'> = {
      title,
      type,
      isRemote,
      location,
      duration,
      stipendSalary,
      deadline,
      eligibility,
      description,
      responsibilities: responsibilitiesText.split('\n').filter(r => r.trim()),
      perks: perksText.split('\n').filter(p => p.trim()),
      requiredSkills: skills,
      company: {
        id: currentUser.id,
        name: currentUser.organization || 'TechNova Solutions',
        initials: (currentUser.organization || 'TN').slice(0, 2).toUpperCase(),
        location,
        verified: true,
        color: 'bg-brand-600'
      }
    };

    postOpportunity(oppPayload);
    navigateTo('opportunities');
  };

  const steps = [
    { number: 1, title: 'Basic Details' },
    { number: 2, title: 'Role Specs' },
    { number: 3, title: 'Skill Thresholds' },
    { number: 4, title: 'Eligibility' },
    { number: 5, title: 'Review & Publish' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Post Job / Internship Opportunity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Define competency-based hiring criteria to automatically match with pre-assessed student candidates.
        </p>
      </div>

      {/* Step Progress Stepper */}
      <div className="flex items-center justify-between relative px-4">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
        {steps.map(s => {
          const isDone = s.number < currentStep;
          const isCurrent = s.number === currentStep;
          return (
            <div key={s.number} className="relative z-10 flex flex-col items-center">
              <button
                onClick={() => setCurrentStep(s.number)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 scale-110'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.number}
              </button>
              <span
                className={`text-[10px] font-semibold mt-1 hidden sm:block ${
                  isCurrent ? 'text-brand-700 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Container Card */}
      <Card className="p-6 sm:p-8 shadow-md">
        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              Step 1: Basic Opportunity Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Opportunity Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Frontend Developer Intern"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Opportunity Type *</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500"
                >
                  <option value="internship">Internship (With PPO potential)</option>
                  <option value="job">Full-time Graduate Engineer</option>
                  <option value="training">Industry Training Program</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location & Work Mode *</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru / Hybrid"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isRemote}
                onChange={e => setIsRemote(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <span>This position is 100% Remote / Work from Home</span>
            </label>
          </div>
        )}

        {/* Step 2: Role Details */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              Step 2: Role Description & Responsibilities
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role Summary *</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Key Responsibilities (One per line)
              </label>
              <textarea
                rows={4}
                value={responsibilitiesText}
                onChange={e => setResponsibilitiesText(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Perks & Benefits (One per line)
              </label>
              <textarea
                rows={3}
                value={perksText}
                onChange={e => setPerksText(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500 font-mono text-[11px]"
              />
            </div>
          </div>
        )}

        {/* Step 3: Required Skills & Proficiency Thresholds */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b pb-2">
              <h3 className="text-base font-bold text-slate-900">
                Step 3: Required Skills & Minimum Proficiency
              </h3>
              <p className="text-xs text-slate-500">
                Candidates must achieve these verified assessment benchmark thresholds for automated recommendation.
              </p>
            </div>

            {/* Existing Skills List */}
            <div className="space-y-3">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="font-bold text-slate-900 text-sm flex-1">{skill.skillName}</div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-600 font-mono font-semibold">
                      Min Score: <strong className="text-brand-700">{skill.minScore}%</strong>
                    </span>
                    <input
                      type="range"
                      min="40"
                      max="90"
                      step="5"
                      value={skill.minScore}
                      onChange={e => handleUpdateSkillScore(idx, Number(e.target.value))}
                      className="w-28 accent-brand-600 cursor-pointer"
                    />
                    <button
                      onClick={() => handleRemoveSkill(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Skill Bar */}
            <div className="p-3.5 rounded-xl bg-brand-50/50 border border-brand-200 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                placeholder="Add skill (e.g. TypeScript, Git, AWS)..."
                className="flex-1 p-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-600 font-mono">{newSkillScore}%</span>
                <input
                  type="range"
                  min="40"
                  max="90"
                  step="5"
                  value={newSkillScore}
                  onChange={e => setNewSkillScore(Number(e.target.value))}
                  className="w-24 accent-brand-600"
                />
                <Button variant="primary" size="xs" onClick={handleAddSkill}>
                  Add Skill
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Eligibility & Compensation */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              Step 4: Eligibility & Compensation Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Stipend / Annual Compensation *
              </label>
              <input
                type="text"
                value={stipendSalary}
                onChange={e => setStipendSalary(e.target.value)}
                placeholder="e.g. ₹35,000 / month or ₹9.5L – ₹12.0L / year"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500 font-mono font-bold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration / Commitment</label>
                <input
                  type="text"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="e.g. 6 Months"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Application Deadline *</label>
                <input
                  type="text"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  placeholder="e.g. 30 Sep 2026"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility Criteria</label>
              <input
                type="text"
                value={eligibility}
                onChange={e => setEligibility(e.target.value)}
                placeholder="e.g. B.Tech/BE (CSE/IT) 2026 Batch, Min 7.5 CGPA"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        )}

        {/* Step 5: Preview & Publish */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b pb-2">
              <h3 className="text-base font-bold text-slate-900">
                Step 5: Preview & Confirm Publication
              </h3>
              <p className="text-xs text-slate-500">
                Review your opportunity card before broadcasting it to verified students and campus placement cells.
              </p>
            </div>

            {/* Opportunity Card Preview */}
            <div className="p-5 rounded-2xl bg-white border-2 border-brand-200 shadow-md space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold text-slate-900">{title}</h4>
                    <Badge variant="brand" size="xs">
                      {type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {currentUser.organization} • {location} • <strong className="text-emerald-700 font-mono">{stipendSalary}</strong>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  TN
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{description}</p>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] text-slate-400 font-medium">Required Skill Thresholds:</span>
                {skills.map(s => (
                  <span
                    key={s.skillName}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold border border-slate-200"
                  >
                    {s.skillName} (&ge; {s.minScore}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {currentStep < 5 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Continue to Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              variant="success"
              size="sm"
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={handlePublish}
            >
              Publish Opportunity Live
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
