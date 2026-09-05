import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  Award,
  BookOpen,
  Briefcase,
  TrendingUp,
  Building2,
  GraduationCap,
  CheckCircle2,
  Users,
  ShieldCheck,
  Zap,
  Layers,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { MatchScoreBadge } from '../../components/common/MatchScoreBadge';
import { UserRole } from '../../types';

interface LandingPageProps {
  onOpenAuth: (role?: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { loginAs } = useApp();
  const [activePersonaTab, setActivePersonaTab] = useState<'student' | 'industry' | 'institution'>('student');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  // Click outside to close demo dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (demoRef.current && !demoRef.current.contains(event.target as Node)) {
        setIsDemoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-8 py-3 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-5 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                SkillBridge <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-50 text-brand-700 border border-brand-200">AI</span>
              </span>
            </div>
          </div>

          {/* Click + Hover Activated 1-Click Demo Dropdown (Visible on BOTH Mobile & Desktop) */}
          <div
            className="relative"
            ref={demoRef}
            onMouseEnter={() => setIsDemoOpen(true)}
            onMouseLeave={() => setIsDemoOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsDemoOpen(prev => !prev)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-50 hover:bg-brand-100/80 text-brand-700 border border-brand-200/90 transition-all cursor-pointer shadow-2xs"
              aria-expanded={isDemoOpen}
              aria-haspopup="true"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="hidden xs:inline">⚡ 1-Click Demo</span>
              <span className="xs:hidden">⚡ Demo</span>
              <ChevronDown className={`w-3.5 h-3.5 text-brand-600 transition-transform duration-200 shrink-0 ${isDemoOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Revealed on click or hover with safe mobile alignment */}
            {isDemoOpen && (
              <div className="absolute left-0 sm:left-0 top-full pt-1.5 w-64 max-w-[calc(100vw-24px)] z-50 animate-fadeIn">
                <div className="bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Instant Demo Personas
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDemoOpen(false);
                      loginAs('student');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-blue-50 text-slate-700 hover:text-blue-900 transition-colors cursor-pointer"
                  >
                    <span className="p-1 rounded bg-blue-100 text-blue-700 font-bold text-xs shrink-0">👨‍🎓</span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">Student Demo</div>
                      <div className="text-[10px] text-slate-500 truncate">Aarav Sharma • NIT CSE</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDemoOpen(false);
                      loginAs('industry');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors cursor-pointer"
                  >
                    <span className="p-1 rounded bg-emerald-100 text-emerald-700 font-bold text-xs shrink-0">🏢</span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">Industry Recruiter Demo</div>
                      <div className="text-[10px] text-slate-500 truncate">Priya Sen • TechNova HR</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDemoOpen(false);
                      loginAs('faculty');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 transition-colors cursor-pointer"
                  >
                    <span className="p-1 rounded bg-indigo-100 text-indigo-700 font-bold text-xs shrink-0">🎓</span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">Faculty Mentor Demo</div>
                      <div className="text-[10px] text-slate-500 truncate">Dr. Ramesh Kumar • Prof</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDemoOpen(false);
                      loginAs('admin');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-purple-50 text-slate-700 hover:text-purple-900 transition-colors cursor-pointer"
                  >
                    <span className="p-1 rounded bg-purple-100 text-purple-700 font-bold text-xs shrink-0">🏛️</span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">Institution Admin Demo</div>
                      <div className="text-[10px] text-slate-500 truncate">Dr. Ananya Iyer • Dean</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-3.5 sm:px-8 pt-6 sm:pt-12 pb-12 sm:pb-20 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[700px] h-[180px] sm:h-[350px] bg-gradient-to-tr from-brand-200/40 via-cyan-200/30 to-indigo-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span>Smart Skill-to-Industry Integration Portal</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.18]">
            Turn Your Skills <br />
            <span className="text-gradient">Into Opportunities.</span>
          </h1>

          <p className="text-xs sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-1">
            Discover your verified skill gaps, build industry-ready capabilities with targeted learning, and connect with high-match internships and careers.
          </p>

          {/* Central Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto font-bold shadow-lg shadow-brand-500/25 px-8 py-3.5 text-sm sm:text-base rounded-xl"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              onClick={() => onOpenAuth()}
            >
              Sign In / Register
            </Button>
          </div>
        </div>

        {/* Hero Interactive Product UI Preview (Live Ecosystem Metrics & Notable Achievements) */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="p-2 sm:p-4 rounded-3xl bg-slate-900/5 border border-slate-200/80 shadow-2xl backdrop-blur-xs">
            <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xl p-5 sm:p-8 space-y-6">
              {/* Preview Header: Live Ecosystem Stream */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        National Skill-to-Industry Ecosystem Intelligence
                      </h4>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Stream
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Aggregated Real-time Benchmarks Across 48 Partner Engineering Institutions & Corporate Hiring Networks
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200 shadow-2xs">
                    86.4% Industry Alignment Index (+14.2% YoY)
                  </span>
                </div>
              </div>

              {/* Ecosystem Key Achievement Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Talent Pool</span>
                  <span className="text-base sm:text-lg font-black text-slate-900">1,420+ Candidates</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">48 Accredited Campuses</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assessment Completion</span>
                  <span className="text-base sm:text-lg font-black text-slate-900">85.2% Rate</span>
                  <span className="text-[10px] text-blue-600 font-semibold block">Standardized Proctored</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Placed Package</span>
                  <span className="text-base sm:text-lg font-black text-slate-900">₹8.9 LPA Avg</span>
                  <span className="text-[10px] text-purple-600 font-semibold block">Highest: ₹44.0 LPA</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Corporate Partnerships</span>
                  <span className="text-base sm:text-lg font-black text-slate-900">22 Active MoUs</span>
                  <span className="text-[10px] text-brand-600 font-semibold block">Direct PPO Pathways</span>
                </div>
              </div>

              {/* Core Ecosystem Intelligence Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Industry Demand Stream */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase">
                    1. Real-Time Demand Bar
                  </span>
                  <h5 className="font-bold text-slate-900 text-xs">Full Stack & Cloud Hiring Criteria</h5>
                  <div className="flex justify-between text-xs text-slate-600 font-mono">
                    <span>Curriculum Baseline: 58%</span>
                    <span>Industry Bar: 75%</span>
                  </div>
                  <ProgressBar value={58} target={75} height="xs" variant="brand" />
                  <p className="text-[11px] text-slate-500 pt-1">
                    Continuous feedback loop syncing academic syllabi with live hiring requirements.
                  </p>
                </div>

                {/* 2. Automated Gap Remediation */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full uppercase">
                    2. Automated Remediation
                  </span>
                  <h5 className="font-bold text-slate-900 text-xs">Curated Masterclasses & Labs</h5>
                  <p className="text-[11px] text-slate-600">
                    Targeted micro-credentials bridging syntax, database optimization, and cloud deployment deficits.
                  </p>
                  <div className="text-[11px] font-bold text-brand-600 flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> +18.4% Average Score Uplift
                  </div>
                </div>

                {/* 3. Direct Verified Placements */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                    3. High-Match Hiring
                  </span>
                  <h5 className="font-bold text-slate-900 text-xs">Objective Competency Pipeline</h5>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center justify-between">
                    <span>Skill Match Threshold</span>
                    <span className="font-bold text-emerald-700">≥ 80% Verified</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-mono font-bold pt-1">
                    78.4% Placement Velocity • Zero Resume Spam
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works 4-Step Pipeline */}
      <section className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              The Intelligence Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How SkillBridge Closes the Industry Gap
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              A transparent, objective pathway from classroom learning to verified corporate hiring.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Assess Your Skills',
                desc: 'Take standardized proctored assessments covering modern web, databases, algorithms, and cloud tools.',
                icon: <Award className="w-5 h-5 text-brand-600" />
              },
              {
                step: '02',
                title: 'Discover Skill Gaps',
                desc: 'Select a target career role to generate an instant side-by-side gap analysis against industry benchmarks.',
                icon: <Target className="w-5 h-5 text-amber-600" />
              },
              {
                step: '03',
                title: 'Learn What Matters',
                desc: 'Enroll in laser-focused bridge courses directly mapped to eliminate detected competency gaps.',
                icon: <BookOpen className="w-5 h-5 text-indigo-600" />
              },
              {
                step: '04',
                title: 'Find Opportunities',
                desc: 'Apply to pre-screened internships and jobs with verified match percentages and transparent score breakdowns.',
                icon: <Briefcase className="w-5 h-5 text-emerald-600" />
              }
            ].map(item => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-brand-200 hover:shadow-card transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    {item.icon}
                  </div>
                  <span className="text-xl font-black text-slate-300 font-mono">{item.step}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholder Value Propositions (Students, Industry, Institutions) */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Ecosystem Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tailored Experiences for Every Stakeholder
          </h2>
        </div>

        {/* Persona Tabs */}
        <div className="flex justify-center">
          <div className="flex p-1 bg-slate-200/80 rounded-xl max-w-md w-full">
            {[
              { id: 'student', label: 'For Students' },
              { id: 'industry', label: 'For Industry' },
              { id: 'institution', label: 'For Institutions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePersonaTab(tab.id as any)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activePersonaTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {activePersonaTab === 'student' && (
            <>
              <Card className="space-y-2">
                <div className="p-2 rounded-lg bg-blue-50 text-brand-600 w-fit mb-2">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Verified Skill Credential</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Prove your competencies with verified proctored assessments rather than self-reported resume claims.
                </p>
              </Card>
              <Card className="space-y-2">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 w-fit mb-2">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Actionable Gap Insights</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Know exactly what skills you lack for Full Stack, DevOps, or AI roles and how many weeks needed to bridge them.
                </p>
              </Card>
              <Card className="space-y-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 w-fit mb-2">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">High-Conversion Matching</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct recruiter visibility with transparent match badges and 1-click verified application forwarding.
                </p>
              </Card>
            </>
          )}

          {activePersonaTab === 'industry' && (
            <>
              <Card className="space-y-2">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600 w-fit mb-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Pre-Screened Talent</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Eliminate resume spam. Filter candidates by strict verified score thresholds (e.g. React &gt;= 70%).
                </p>
              </Card>
              <Card className="space-y-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 w-fit mb-2">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Reduced Time-to-Hire</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reduce preliminary screening rounds by 60% with standardized code and architecture scorecards.
                </p>
              </Card>
              <Card className="space-y-2">
                <div className="p-2 rounded-lg bg-blue-50 text-brand-600 w-fit mb-2">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Direct Campus MoUs</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Partner with universities to run sponsored apprenticeships and Centers of Excellence.
                </p>
              </Card>
            </>
          )}

          {activePersonaTab === 'institution' && (
            <>
              <Card className="space-y-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 w-fit mb-2">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Curriculum Alignment</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Detect cohort-wide skill deficits in real time and update semester course syllabi to match corporate demand.
                </p>
              </Card>
              <Card className="space-y-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 w-fit mb-2">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Placement Rate Boost</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track student readiness curves and assign remedial modules to at-risk students before campus placement drives.
                </p>
              </Card>
              <Card className="space-y-2">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600 w-fit mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Accreditation Ready</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate instant NBA, NAAC, and AICTE skill intelligence and corporate partnership reports with 1 click.
                </p>
              </Card>
            </>
          )}
        </div>
      </section>

      {/* Bottom Final Call to Action */}
      <section className="py-16 px-4 sm:px-8 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Bridge the Skill-to-Industry Gap?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experience the complete Smart India Hackathon prototype with real-time reactive updates across Student, Industry, Faculty, and Admin personas.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="bg-brand-500 hover:bg-brand-400 text-white font-bold"
              onClick={() => loginAs('student')}
            >
              Launch Student Demo Workspace
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => loginAs('industry')}
            >
              Launch Industry ATS Workspace
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
