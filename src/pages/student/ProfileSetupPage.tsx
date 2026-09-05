import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Award,
  Target,
  BookOpen,
  MapPin,
  Building,
  TrendingUp,
  Sliders,
  DollarSign,
  User,
  ShieldCheck,
  Zap,
  Layers,
  Check,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { CAREER_PATHS } from '../../data/mockData';
import { SkillScore } from '../../types';

interface ProfileSetupPageProps {
  onComplete?: () => void;
}

export const ProfileSetupPage: React.FC<ProfileSetupPageProps> = ({ onComplete }) => {
  const { studentProfile, currentUser, currentRole, updateFullProfileAndPreferences, navigateTo, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Academic Profile
  const [name, setName] = useState(currentUser.name || 'Aarav Sharma');
  const [organization, setOrganization] = useState(studentProfile.user.organization || 'National Institute of Technology (NIT)');
  const [degree, setDegree] = useState('B.Tech in Computer Science');
  const [department, setDepartment] = useState(studentProfile.department || 'Computer Science & Engineering');
  const [rollNo, setRollNo] = useState(studentProfile.rollNo || '21CS8042');
  const [batch, setBatch] = useState(studentProfile.batch || '2022 - 2026');
  const [cgpa, setCgpa] = useState(studentProfile.cgpa || '8.84 / 10');
  const [bio, setBio] = useState(studentProfile.bio || 'Aspiring Full Stack Engineer & Cloud Developer passionate about React, TypeScript, and modern system architectures.');

  // Step 2: Career Targets & Preferences
  const [targetCareerId, setTargetCareerId] = useState(studentProfile.targetCareerId || 'cp-fullstack');
  const [preferredOppType, setPreferredOppType] = useState<'internship' | 'job' | 'all'>('internship');
  const [preferredLocation, setPreferredLocation] = useState('Bengaluru, Karnataka (Hybrid)');
  const [targetSalary, setTargetSalary] = useState('₹40,000 / month (Internship) • ₹14.0 LPA (PPO)');

  // Step 3: Self-Assessed Skills (Your Pros / Strengths)
  const availableSkillOptions: { name: string; category: SkillScore['category']; defaultScore: number }[] = [
    { name: 'JavaScript', category: 'Frontend', defaultScore: 80 },
    { name: 'React.js', category: 'Frontend', defaultScore: 65 },
    { name: 'TypeScript', category: 'Frontend', defaultScore: 60 },
    { name: 'HTML & CSS / Tailwind', category: 'Frontend', defaultScore: 85 },
    { name: 'SQL & Database Design', category: 'Database', defaultScore: 70 },
    { name: 'Node.js & Express', category: 'Backend', defaultScore: 65 },
    { name: 'Python', category: 'Core CS', defaultScore: 75 },
    { name: 'Data Structures & Algorithms', category: 'Core CS', defaultScore: 68 },
    { name: 'Git & Version Control', category: 'DevOps & Cloud', defaultScore: 60 },
    { name: 'AWS Cloud Fundamentals', category: 'DevOps & Cloud', defaultScore: 50 },
    { name: 'Docker & Containers', category: 'DevOps & Cloud', defaultScore: 55 },
    { name: 'System Design & REST APIs', category: 'Backend', defaultScore: 62 },
  ];

  // User selected skills with scores
  const [selectedSkills, setSelectedSkills] = useState<{ [skillName: string]: number }>(() => {
    const map: { [key: string]: number } = {};
    studentProfile.skills.forEach(s => {
      map[s.name] = s.score;
    });
    // Defaults if empty
    if (Object.keys(map).length === 0) {
      map['JavaScript'] = 80;
      map['React.js'] = 65;
      map['SQL & Database Design'] = 70;
      map['Data Structures & Algorithms'] = 68;
    }
    return map;
  });

  // Step 4: Learning Focus & Urgent Needs
  const [priorityGoal, setPriorityGoal] = useState<string>('all-round');
  const [needsAssistanceIn, setNeedsAssistanceIn] = useState<string[]>([
    'Bridging React & Database Architecture Gaps',
    'Landing High-Paying PPO Internship'
  ]);

  const handleToggleSkill = (skillName: string, defaultScore: number) => {
    setSelectedSkills(prev => {
      const next = { ...prev };
      if (next[skillName]) {
        delete next[skillName];
      } else {
        next[skillName] = defaultScore;
      }
      return next;
    });
  };

  const handleUpdateSkillScore = (skillName: string, score: number) => {
    setSelectedSkills(prev => ({
      ...prev,
      [skillName]: score
    }));
  };

  const handleGeneratePersonalizedFeed = async () => {
    // Format customized skills array
    const customSkillsList: SkillScore[] = Object.keys(selectedSkills).map(name => {
      const found = availableSkillOptions.find(o => o.name === name);
      return {
        id: `sk-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name,
        category: found ? found.category : 'Frontend',
        score: selectedSkills[name],
        verified: selectedSkills[name] >= 75,
        lastAssessed: 'Self-Assessed Setup'
      };
    });

    await updateFullProfileAndPreferences(
      {
        user: {
          ...studentProfile.user,
          name,
          organization
        },
        rollNo,
        department,
        batch,
        cgpa,
        bio,
        targetCareerId
      },
      customSkillsList
    );

    if (onComplete) {
      onComplete();
    } else {
      navigateTo('dashboard');
    }
  };

  const selectedCareer = CAREER_PATHS.find(c => c.id === targetCareerId) || CAREER_PATHS[0];

  const steps = [
    { number: 1, title: 'Academic Profile' },
    { number: 2, title: 'Career Target' },
    { number: 3, title: 'Skill Strengths' },
    { number: 4, title: 'Learning Needs' },
    { number: 5, title: 'Generate Feed' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-brand-100 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Personalized Feed & Skill Setup Wizard</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Configure Your Academic & Career Profile
            </h1>
            <p className="text-xs sm:text-sm text-brand-100 max-w-xl mt-1">
              Customize your institutional credentials, target roles, current skill proficiencies, and learning needs to generate your personalized skill intelligence feed.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 shrink-0"
            onClick={() => navigateTo('dashboard')}
          >
            Skip to Dashboard →
          </Button>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
          {steps.map(s => {
            const isCompleted = currentStep > s.number;
            const isCurrent = currentStep === s.number;
            return (
              <div key={s.number} className="relative z-10 flex flex-col items-center">
                <button
                  onClick={() => setCurrentStep(s.number)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow-xs'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.number}
                </button>
                <span
                  className={`text-[10px] font-bold mt-1.5 hidden sm:block ${
                    isCurrent ? 'text-brand-600' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: ACADEMIC & INSTITUTION PROFILE */}
      {currentStep === 1 && (
        <Card className="space-y-5">
          <CardHeader
            title="Step 1: Academic & Institution Details"
            subtitle="Enter your verified academic standing and university enrollment data"
            action={<Badge variant="brand">Academic Baseline</Badge>}
          />

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">College / University Name *</label>
                <input
                  type="text"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  placeholder="e.g. National Institute of Technology (NIT)"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500 font-semibold"
                />
              </div>
            </div>

            {/* Quick College Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-semibold">Quick Autofill:</span>
              {[
                'National Institute of Technology (NIT)',
                'Indian Institute of Technology (IIT)',
                'Anna University',
                'BITS Pilani',
                'Apex University'
              ].map(univ => (
                <button
                  key={univ}
                  type="button"
                  onClick={() => setOrganization(univ)}
                  className="px-2 py-0.5 text-[10px] rounded-md bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  {univ.split('(')[0]}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Degree Program</label>
                <input
                  type="text"
                  value={degree}
                  onChange={e => setDegree(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department / Major</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Roll / Registration Number</label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={e => setRollNo(e.target.value)}
                  placeholder="e.g. 21CS8042"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Batch Year</label>
                <input
                  type="text"
                  value={batch}
                  onChange={e => setBatch(e.target.value)}
                  placeholder="2022 - 2026 (Final Year)"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Academic CGPA</label>
                <input
                  type="text"
                  value={cgpa}
                  onChange={e => setCgpa(e.target.value)}
                  placeholder="8.84 / 10.0"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Professional Bio & Aspirations</label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Briefly describe your background, tech stacks you love, and what roles you are preparing for..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => setCurrentStep(2)}
            >
              Continue to Career Targets →
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: CAREER TARGETS & PREFERENCES */}
      {currentStep === 2 && (
        <Card className="space-y-5">
          <CardHeader
            title="Step 2: Career Targets & Opportunity Aspirations"
            subtitle="Choose your target career path so the AI can compute your specific skill gaps"
            action={<Badge variant="warning">AI Matching Core</Badge>}
          />

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Your Primary Target Career Track *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CAREER_PATHS.map(path => (
                  <button
                    key={path.id}
                    type="button"
                    onClick={() => setTargetCareerId(path.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      targetCareerId === path.id
                        ? 'border-brand-500 bg-brand-50/70 shadow-xs ring-2 ring-brand-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900">{path.title}</span>
                      {targetCareerId === path.id && (
                        <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{path.description}</p>
                    <div className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                      {path.avgSalary}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Opportunity Type</label>
                <select
                  value={preferredOppType}
                  onChange={e => setPreferredOppType(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  <option value="internship">6-Month Paid Internship with PPO Offer</option>
                  <option value="job">Direct Full-Time Graduate Role</option>
                  <option value="all">Both Internships & Full-Time Careers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Location / Mode</label>
                <input
                  type="text"
                  value={preferredLocation}
                  onChange={e => setPreferredLocation(e.target.value)}
                  placeholder="e.g. Bengaluru / Hyderabad (Hybrid)"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Compensation / Stipend Range</label>
              <input
                type="text"
                value={targetSalary}
                onChange={e => setTargetSalary(e.target.value)}
                placeholder="e.g. ₹35,000 / month (Internship) • ₹14 LPA (Full-time)"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(1)}>
              ← Back
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => setCurrentStep(3)}
            >
              Continue to Skill Strengths →
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: SELF-ASSESSED SKILL BASELINE (YOUR PROS) */}
      {currentStep === 3 && (
        <Card className="space-y-5">
          <CardHeader
            title="Step 3: Current Skill Strengths & Proficiencies (Your Pros)"
            subtitle="Select the skills you already know or are learning, and rate your estimated proficiency"
            action={<Badge variant="success">Skill Profile Engine</Badge>}
          />

          <div className="space-y-4 text-xs">
            <p className="text-xs text-slate-600">
              Click on the technologies you know. Use the sliders to tune your estimated proficiency score (0-100%).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {availableSkillOptions.map(opt => {
                const isSelected = selectedSkills[opt.name] !== undefined;
                const score = selectedSkills[opt.name] || opt.defaultScore;

                return (
                  <div
                    key={opt.name}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/40 shadow-2xs ring-1 ring-brand-500/20'
                        : 'border-slate-200 bg-slate-50/60 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSkill(opt.name, opt.defaultScore)}
                          className="w-4 h-4 rounded text-brand-600 cursor-pointer"
                        />
                        <span className="font-bold text-xs text-slate-900">{opt.name}</span>
                      </div>
                      <Badge variant="neutral" size="xs">
                        {opt.category}
                      </Badge>
                    </div>

                    {isSelected && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-500">Proficiency:</span>
                          <span className={`font-bold ${score >= 75 ? 'text-emerald-700' : score >= 60 ? 'text-blue-700' : 'text-amber-700'}`}>
                            {score}% {score >= 85 ? '(Advanced)' : score >= 70 ? '(Proficient)' : score >= 55 ? '(Intermediate)' : '(Beginner)'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="98"
                          value={score}
                          onChange={e => handleUpdateSkillScore(opt.name, parseInt(e.target.value))}
                          className="w-full accent-brand-600 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(2)}>
              ← Back
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => setCurrentStep(4)}
            >
              Continue to Needs & Priorities →
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: LEARNING NEEDS & PRIORITIES */}
      {currentStep === 4 && (
        <Card className="space-y-5">
          <CardHeader
            title="Step 4: Your Priority Needs & Learning Focus"
            subtitle="Tell our AI engine what you want to achieve first so we can rank your feed"
            action={<Badge variant="brand">Focus Optimization</Badge>}
          />

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'internship-match',
                  title: '⚡ 1-Click High Match Internships',
                  desc: 'Rank job postings with ≥ 80% skill match at TechNova, CloudBridge & DataSphere.'
                },
                {
                  id: 'skill-gaps',
                  title: '🎯 Automated Gap Diagnostics',
                  desc: 'Pinpoint exact missing competencies against the full stack industry standard.'
                },
                {
                  id: 'proctored-tests',
                  title: '🏆 Proctored Skill Assessment & Badges',
                  desc: 'Take timed MCQs & coding challenges to earn verified recruiter badges.'
                },
                {
                  id: 'remedial-courses',
                  title: '📚 Curated Remediation Masterclasses',
                  desc: 'Unlock targeted video labs specifically addressing your deficit skills.'
                }
              ].map(goal => (
                <div
                  key={goal.id}
                  onClick={() => setPriorityGoal(goal.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    priorityGoal === goal.id
                      ? 'border-brand-500 bg-brand-50/70 shadow-xs ring-2 ring-brand-500/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{goal.title}</span>
                    {priorityGoal === goal.id && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500">{goal.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(3)}>
              ← Back
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => setCurrentStep(5)}
            >
              Preview & Generate Feed →
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: PREVIEW & GENERATE FEED */}
      {currentStep === 5 && (
        <Card className="space-y-6">
          <CardHeader
            title="Step 5: Review & Generate Your Very Own Feed"
            subtitle="Our AI has synthesized your inputs and generated your personalized dashboard feed"
            action={<Badge variant="success">Ready to Launch</Badge>}
          />

          {/* Synthesis Preview Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">{name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/30 text-brand-300 border border-brand-500/40">
                    {selectedCareer.title}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {organization} • {department} ({batch})
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 block">
                  Initial Computed Readiness: ~76%
                </span>
                <span className="text-[10px] text-slate-400">Based on {Object.keys(selectedSkills).length} custom skills</span>
              </div>
            </div>

            {/* Generated Strengths & Identified Gaps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Your Primary Strengths (Pros)</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {Object.keys(selectedSkills)
                    .filter(k => selectedSkills[k] >= 70)
                    .map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 text-[10px] font-semibold">
                        {s}: {selectedSkills[s]}%
                      </span>
                    ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Priority Gaps to Remediate</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {Object.keys(selectedSkills)
                    .filter(k => selectedSkills[k] < 70)
                    .map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 text-[10px] font-semibold">
                        {s}: {selectedSkills[s]}% (Gap)
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(4)}>
              ← Back to Edit
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="font-bold shadow-md shadow-brand-500/20"
              icon={<Sparkles className="w-4 h-4 text-amber-300" />}
              iconPosition="right"
              onClick={handleGeneratePersonalizedFeed}
            >
              Generate My Feed & Launch Dashboard 🚀
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
