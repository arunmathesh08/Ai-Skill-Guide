import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Award,
  BookOpen,
  Send,
  Building,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, ProficiencyTag } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ProgressBar } from '../../components/common/ProgressBar';
import { MOCK_CANDIDATES } from '../../data/mockData';

export const CandidateDiscoveryPage: React.FC = () => {
  const { showToast, navigateTo } = useApp();

  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(60);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectCandidate, setInspectCandidate] = useState<any | null>(null);

  const filteredCandidates = MOCK_CANDIDATES.filter(cand => {
    // Skill filter
    if (selectedSkill !== 'all') {
      const matchSkill = cand.skills.find(
        s => s.name.toLowerCase().includes(selectedSkill.toLowerCase())
      );
      if (!matchSkill || matchSkill.score < minScore) return false;
    }
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = cand.name.toLowerCase().includes(q);
      const matchCollege = cand.college.toLowerCase().includes(q);
      const matchRole = cand.targetRole.toLowerCase().includes(q);
      if (!matchName && !matchCollege && !matchRole) return false;
    }
    return true;
  });

  const handleInvite = (candidateName: string) => {
    showToast(
      'success',
      `Sent formal interview invitation and priority application link to ${candidateName}.`,
      'Candidate Invited'
    );
    setInspectCandidate(null);
  };

  const handleShortlist = (candidateName: string) => {
    showToast(
      'info',
      `${candidateName} added to your company shortlisted talent pool.`,
      'Shortlisted'
    );
    setInspectCandidate(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>AI Verified Talent Discovery</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Discover Verified Talent
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Search pre-evaluated students with cryptographically verified assessment scores across partner colleges and universities.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigateTo('industry-applications')}
        >
          Manage ATS Pipeline
        </Button>
      </div>

      {/* Filter and Skill Threshold Toolbar */}
      <Card padding="sm" className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {['all', 'React.js', 'JavaScript', 'SQL & Database', 'Node.js', 'Git'].map(s => (
              <button
                key={s}
                onClick={() => setSelectedSkill(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  selectedSkill === s
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s === 'all' ? 'All Skills' : s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs justify-end">
            <span className="text-slate-500 font-medium">Min Verified Score: {minScore}%</span>
            <input
              type="range"
              min="40"
              max="90"
              step="5"
              value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              className="w-28 accent-brand-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student name, college (e.g. NIT, IIT, BITS), role..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </Card>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCandidates.map(cand => (
          <Card
            key={cand.id}
            hover
            onClick={() => setInspectCandidate(cand)}
            className="flex flex-col justify-between group"
          >
            <div>
              {/* Header: Avatar, Name, Match */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {cand.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                      {cand.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-slate-400" />
                      {cand.college}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                    {cand.readiness}% Match
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">CGPA: {cand.cgpa}</div>
                </div>
              </div>

              {/* Target Role & Top Project */}
              <div className="space-y-1.5 mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="brand" size="xs">
                    Target: {cand.targetRole}
                  </Badge>
                  <span className="text-slate-400 text-[11px] font-mono">
                    {cand.certificationsCount} Certifications
                  </span>
                </div>
                <p className="text-slate-600 text-xs">
                  <strong className="text-slate-700">Project:</strong> {cand.topProject}
                </p>
              </div>

              {/* Verified Skills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Verified Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {cand.skills.map(s => (
                    <span
                      key={s.name}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold font-mono"
                    >
                      {s.name} ({s.score}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready for Interview
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectCandidate(cand);
                  }}
                >
                  Full Profile
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  icon={<Send className="w-3 h-3" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInvite(cand.name);
                  }}
                >
                  Invite
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Candidate Inspection Modal */}
      {inspectCandidate && (
        <Modal
          isOpen={!!inspectCandidate}
          onClose={() => setInspectCandidate(null)}
          title={`Candidate Profile: ${inspectCandidate.name}`}
          subtitle={`${inspectCandidate.degree} • ${inspectCandidate.college}`}
          maxWidth="2xl"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShortlist(inspectCandidate.name)}
              >
                Add to Shortlist
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Send className="w-4 h-4" />}
                onClick={() => handleInvite(inspectCandidate.name)}
              >
                Extend Interview Invitation
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-xs">Target Engineering Role</span>
                <h4 className="font-bold text-slate-900 text-base">{inspectCandidate.targetRole}</h4>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-xs">Overall Role Readiness</span>
                <span className="text-xl font-black text-emerald-600">
                  {inspectCandidate.readiness}%
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">Verified Skill Competencies</h4>
              <div className="space-y-2">
                {inspectCandidate.skills.map((s: any) => (
                  <div key={s.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{s.name}</span>
                      <span className="font-mono text-slate-900">{s.score}%</span>
                    </div>
                    <ProgressBar value={s.score} height="xs" variant="tier" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">Featured Project</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border">
                {inspectCandidate.topProject}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
