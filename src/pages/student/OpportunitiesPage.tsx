import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  Building,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MatchScoreBadge } from '../../components/common/MatchScoreBadge';
import { calculateOpportunityMatch } from '../../utils/skillMatcher';

export const OpportunitiesPage: React.FC = () => {
  const {
    opportunities,
    studentProfile,
    applications,
    searchTerm,
    setSearchTerm,
    navigateTo
  } = useApp();

  const [typeFilter, setTypeFilter] = useState<'all' | 'internship' | 'job' | 'training'>('all');
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'match' | 'recent' | 'stipend'>('match');

  // Filter and calculate match for all opportunities
  const processedOpps = opportunities
    .map(opp => {
      const match = calculateOpportunityMatch(opp, studentProfile.skills);
      const isApplied = applications.some(a => a.opportunityId === opp.id);
      return {
        opp,
        match,
        isApplied
      };
    })
    .filter(({ opp, match }) => {
      // Type filter
      if (typeFilter !== 'all' && opp.type !== typeFilter) return false;
      // Remote filter
      if (remoteOnly && !opp.isRemote) return false;
      // Match score filter
      if (match.matchPercentage < minMatchFilter) return false;
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(query);
        const matchesCompany = opp.company.name.toLowerCase().includes(query);
        const matchesSkill = opp.requiredSkills.some(s => s.skillName.toLowerCase().includes(query));
        const matchesLocation = opp.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesSkill && !matchesLocation) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'match') return b.match.matchPercentage - a.match.matchPercentage;
      if (sortBy === 'recent') return b.opp.id.localeCompare(a.opp.id);
      return 0;
    });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Opportunity Match Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Industry Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Discover internships, jobs, and training programs ranked transparently by your verified technical skill alignment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('applications')}
          >
            My Application Pipeline ({applications.length})
          </Button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <Card padding="sm" className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Type Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Opportunities' },
              { id: 'internship', label: 'Internships' },
              { id: 'job', label: 'Full-time Jobs' },
              { id: 'training', label: 'Training & PPO' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  typeFilter === t.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Sort & Remote checkbox */}
          <div className="flex items-center gap-3 text-xs">
            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={e => setRemoteOnly(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <span>Remote Only</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="match">Match Score (Highest)</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search & Min Match Slider */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filter by title, skill (e.g. React, SQL), company, city..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-slate-500 whitespace-nowrap">Min Match: {minMatchFilter}%</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minMatchFilter}
              onChange={e => setMinMatchFilter(Number(e.target.value))}
              className="w-28 accent-brand-600 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Opportunities List */}
      <div className="space-y-4">
        {processedOpps.length === 0 ? (
          <Card className="text-center py-12">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">No opportunities match your filter</h4>
            <p className="text-xs text-slate-500 mt-1">Try clearing your filters or lowering the minimum match threshold.</p>
            <Button
              variant="outline"
              size="xs"
              className="mt-4"
              onClick={() => {
                setTypeFilter('all');
                setRemoteOnly(false);
                setMinMatchFilter(0);
                setSearchTerm('');
              }}
            >
              Reset All Filters
            </Button>
          </Card>
        ) : (
          processedOpps.map(({ opp, match, isApplied }) => (
            <Card
              key={opp.id}
              hover
              onClick={() => navigateTo('opportunity-detail', { opportunityId: opp.id })}
              className="group transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left: Company & Role Details */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${opp.company.color} text-white font-black text-base flex items-center justify-center shadow-xs shrink-0`}
                  >
                    {opp.company.initials}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                        {opp.title}
                      </h3>
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

                    <p className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        {opp.company.name}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {opp.location}
                      </span>
                      <span>•</span>
                      <span className="font-bold font-mono text-emerald-700">
                        {opp.stipendSalary}
                      </span>
                      {opp.duration && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500">{opp.duration}</span>
                        </>
                      )}
                    </p>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>
                </div>

                {/* Right: Match Score Badge & Breakdown */}
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <MatchScoreBadge
                    score={match.matchPercentage}
                    strongSkills={match.strongSkills}
                    developingSkills={match.developingSkills}
                    missingSkills={match.missingSkills}
                    expandable={true}
                  />
                  {isApplied && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Application Submitted
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Skills & Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-400">Required Skills:</span>
                  {opp.requiredSkills.map(req => {
                    const studentSkill = studentProfile.skills.find(
                      s => s.name.toLowerCase() === req.skillName.toLowerCase()
                    );
                    const isStrong = studentSkill && studentSkill.score >= req.minScore;
                    return (
                      <span
                        key={req.skillName}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isStrong
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isStrong && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                        {req.skillName} ({req.minScore}%+)
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Deadline: {opp.deadline}
                  </span>
                  <Button
                    variant={isApplied ? 'outline' : 'primary'}
                    size="xs"
                    icon={<ArrowRight className="w-3 h-3" />}
                    iconPosition="right"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('opportunity-detail', { opportunityId: opp.id });
                    }}
                  >
                    {isApplied ? 'View Status' : 'View & Apply'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
