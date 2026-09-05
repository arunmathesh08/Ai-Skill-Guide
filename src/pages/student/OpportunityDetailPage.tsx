import React, { useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Building,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  ShieldCheck,
  Award,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, ProficiencyTag } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ProgressBar } from '../../components/common/ProgressBar';
import { MatchScoreBadge } from '../../components/common/MatchScoreBadge';
import { calculateOpportunityMatch } from '../../utils/skillMatcher';
import confetti from 'canvas-confetti';

export const OpportunityDetailPage: React.FC = () => {
  const {
    selectedOpportunityId,
    opportunities,
    studentProfile,
    applications,
    applyToOpportunity,
    navigateTo
  } = useApp();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const opp =
    opportunities.find(o => o.id === selectedOpportunityId) || opportunities[0];

  const match = calculateOpportunityMatch(opp, studentProfile.skills);
  const isApplied = applications.some(a => a.opportunityId === opp.id);
  const activeApp = applications.find(a => a.opportunityId === opp.id);

  const handleApply = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      applyToOpportunity(opp.id, coverNote);
      setIsSubmitting(false);
      setIsApplyModalOpen(false);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // safe fallback
      }
    }, 400);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigateTo('opportunities')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Opportunities Discovery
      </button>

      {/* Header Banner */}
      <Card className="bg-white border-slate-200/90 shadow-md">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-16 h-16 rounded-2xl ${opp.company.color} text-white font-black text-xl flex items-center justify-center shadow-md shrink-0`}
            >
              {opp.company.initials}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {opp.title}
                </h1>
                <Badge
                  variant={opp.type === 'internship' ? 'brand' : opp.type === 'job' ? 'success' : 'purple'}
                  size="xs"
                >
                  {opp.type.toUpperCase()}
                </Badge>
                {opp.isRemote && (
                  <Badge variant="indigo" size="xs">
                    REMOTE
                  </Badge>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-semibold flex flex-wrap items-center gap-3">
                <span className="text-slate-900 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {opp.company.name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {opp.location}
                </span>
                <span>•</span>
                <span className="font-mono text-emerald-700 font-bold">
                  {opp.stipendSalary}
                </span>
              </p>
            </div>
          </div>

          {/* Match Score & Apply Action */}
          <div className="shrink-0 flex flex-col items-end gap-3">
            <MatchScoreBadge
              score={match.matchPercentage}
              strongSkills={match.strongSkills}
              developingSkills={match.developingSkills}
              missingSkills={match.missingSkills}
              size="lg"
              showDetails={true}
            />

            {isApplied ? (
              <div className="flex flex-col items-end gap-1">
                <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Status: {activeApp?.status || 'Applied'}
                </div>
                <button
                  onClick={() => navigateTo('applications')}
                  className="text-[11px] text-brand-600 hover:text-brand-800 font-semibold"
                >
                  View in Pipeline &rarr;
                </button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
                icon={<Send className="w-4 h-4" />}
                onClick={() => setIsApplyModalOpen(true)}
              >
                1-Click Apply with Verified Skills
              </Button>
            )}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Application Deadline</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-brand-600" /> {opp.deadline}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Eligibility Criteria</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {opp.eligibility}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Applicants</span>
            <span className="font-bold text-slate-800 block mt-0.5">
              {opp.applicantsCount} Candidates applied
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Posted</span>
            <span className="font-bold text-slate-800 block mt-0.5">
              {opp.postedDate}
            </span>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Role Details & Responsibilities (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Role */}
          <Card>
            <h3 className="text-base font-bold text-slate-900 mb-2">About the Role</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {opp.description}
            </p>

            <h4 className="text-sm font-bold text-slate-900 mt-6 mb-3">Key Responsibilities</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              {opp.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>

            {opp.perks && opp.perks.length > 0 && (
              <>
                <h4 className="text-sm font-bold text-slate-900 mt-6 mb-3">Perks & Benefits</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {opp.perks.map((perk, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 font-medium text-slate-700"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Transparent Skill Requirement Matrix */}
          <Card>
            <CardHeader
              title="Verified Skill Compatibility Matrix"
              subtitle="Compare your verified competence with the company's minimum hiring threshold"
              icon={<Award className="w-4 h-4" />}
            />

            <div className="space-y-3">
              {opp.requiredSkills.map(req => {
                const studentSkill = studentProfile.skills.find(
                  s => s.name.toLowerCase() === req.skillName.toLowerCase()
                );
                const score = studentSkill ? studentSkill.score : 30;
                const isMet = score >= req.minScore;

                return (
                  <div
                    key={req.skillName}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      isMet ? 'bg-emerald-50/20 border-emerald-200' : 'bg-rose-50/20 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-800 flex items-center gap-2 font-bold">
                        {isMet ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        {req.skillName}
                      </span>
                      <div className="flex items-center gap-2 font-mono">
                        <span>Your: <strong className="text-slate-900">{score}%</strong></span>
                        <span className="text-slate-400">|</span>
                        <span>Min Req: {req.minScore}%</span>
                      </div>
                    </div>
                    <ProgressBar
                      value={score}
                      target={req.minScore}
                      height="xs"
                      variant={isMet ? 'success' : 'danger'}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right: Company Profile & Application Process (1 Column) */}
        <div className="space-y-5">
          {/* Company Card */}
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${opp.company.color} text-white font-bold text-sm flex items-center justify-center`}
              >
                {opp.company.initials}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{opp.company.name}</h4>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-brand-600" />
                  Verified Industry Partner
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Premier technology organisation collaborating with higher education institutions for smart skill-based campus hiring.
            </p>
            <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>HQ Location:</span>
                <span className="font-semibold text-slate-800">{opp.company.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Hiring Status:</span>
                <span className="font-semibold text-emerald-600">Actively Reviewing</span>
              </div>
            </div>
          </Card>

          {/* Hiring Workflow */}
          <Card>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-3">
              Application Pipeline
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Skill-Match Shortlisting</div>
                  <div className="text-[11px] text-slate-500">Automated match evaluation using verified skill scores.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Technical Code Assessment</div>
                  <div className="text-[11px] text-slate-500">Domain-specific challenge or live pair programming.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Engineering Interview & Offer</div>
                  <div className="text-[11px] text-slate-500">Discussion with Technical Lead and final offer rollout.</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 1-Click Application Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${opp.title}`}
        subtitle={`${opp.company.name} • ${opp.location}`}
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={isSubmitting}
              icon={<Send className="w-4 h-4" />}
              onClick={handleApply}
            >
              Submit Application
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-brand-50/60 border border-brand-200 text-brand-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Verified Skill Score Attachment ({match.matchPercentage}% Alignment)</span>
            </div>
            <p className="text-xs text-brand-800 leading-relaxed">
              Your verified scores in {match.strongSkills.join(', ')} will be directly forwarded to the hiring team at {opp.company.name}.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Applicant Profile:
            </label>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-0.5">
              <div className="font-bold text-slate-900">{studentProfile.user.name}</div>
              <div className="text-slate-600">{studentProfile.education[0]?.degree} • {studentProfile.education[0]?.institution}</div>
              <div className="text-slate-500 font-mono">CGPA: {studentProfile.cgpa}</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Pitch / Cover Note (Optional):
            </label>
            <textarea
              rows={3}
              value={coverNote}
              onChange={e => setCoverNote(e.target.value)}
              placeholder="Highlight any relevant open-source project, repository, or portfolio details..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
