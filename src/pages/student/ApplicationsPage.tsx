import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { ApplicationStatus } from '../../types';

export const ApplicationsPage: React.FC = () => {
  const { applications, navigateTo } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return app.status !== 'Rejected' && app.status !== 'Selected';
    return app.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied':
        return <Badge variant="neutral" dot>Applied</Badge>;
      case 'Under Review':
        return <Badge variant="warning" dot>Under Review</Badge>;
      case 'Shortlisted':
        return <Badge variant="brand" dot>Shortlisted</Badge>;
      case 'Interview':
        return <Badge variant="indigo" dot>Interview Scheduled</Badge>;
      case 'Selected':
        return <Badge variant="success" dot>Offer Extended</Badge>;
      case 'Rejected':
        return <Badge variant="danger" dot>Not Selected</Badge>;
    }
  };

  const statusSteps: ApplicationStatus[] = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview',
    'Selected'
  ];

  const getStepProgress = (currentStatus: ApplicationStatus) => {
    if (currentStatus === 'Rejected') return -1;
    return statusSteps.indexOf(currentStatus);
  };

  const tabs = [
    { id: 'all', label: 'All Applications', count: applications.length },
    { id: 'active', label: 'In Progress', count: applications.filter(a => a.status !== 'Rejected' && a.status !== 'Selected').length },
    { id: 'shortlisted', label: 'Shortlisted', count: applications.filter(a => a.status === 'Shortlisted').length },
    { id: 'interview', label: 'Interview', count: applications.filter(a => a.status === 'Interview').length },
    { id: 'selected', label: 'Offers', count: applications.filter(a => a.status === 'Selected').length }
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-1">
            <Send className="w-3.5 h-3.5" />
            <span>Real-time Candidate Pipeline</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track status updates, assessment evaluations, and interview invitations from industry partners.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigateTo('opportunities')}
        >
          Explore More Opportunities
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={statusFilter}
        onChange={setStatusFilter}
        variant="pills"
      />

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card className="text-center py-12">
            <Send className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">No applications found in this category</h4>
            <p className="text-xs text-slate-500 mt-1">Browse active internships and jobs with verified skill matching.</p>
            <Button
              variant="primary"
              size="xs"
              className="mt-4"
              onClick={() => navigateTo('opportunities')}
            >
              Browse Opportunities
            </Button>
          </Card>
        ) : (
          filteredApplications.map(app => {
            const currentStepIdx = getStepProgress(app.status);

            return (
              <Card key={app.id} className="space-y-4">
                {/* Top Role & Status Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {app.companyInitials}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          {app.opportunityTitle}
                        </h3>
                        <Badge
                          variant={app.opportunityType === 'internship' ? 'brand' : 'success'}
                          size="xs"
                        >
                          {app.opportunityType.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                        <span>{app.companyName}</span>
                        <span>•</span>
                        <span>{app.companyLocation}</span>
                        <span>•</span>
                        <span className="font-mono font-semibold text-slate-800">{app.stipendSalary}</span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {app.matchScore}% Skill Match
                    </span>
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {/* Visual Pipeline Timeline (Desktop/Tablet) */}
                {app.status !== 'Rejected' ? (
                  <div className="py-2">
                    <div className="relative flex items-center justify-between">
                      {/* Background connecting bar */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
                      
                      {/* Active progress bar */}
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-brand-600 z-0 transition-all duration-500"
                        style={{ width: `${(Math.max(0, currentStepIdx) / (statusSteps.length - 1)) * 100}%` }}
                      />

                      {statusSteps.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                                isDone
                                  ? 'bg-brand-600 border-brand-600 text-white shadow-xs'
                                  : 'bg-white border-slate-300 text-slate-400'
                              } ${isCurrent ? 'ring-4 ring-brand-100 scale-110' : ''}`}
                            >
                              {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] font-medium mt-1.5 hidden sm:block ${
                                isCurrent
                                  ? 'font-bold text-brand-700'
                                  : isDone
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                    This application was not selected for further rounds. Continue building your skill competencies to boost future matching.
                  </div>
                )}

                {/* Company Notes & Matching Skills */}
                <div className="pt-2 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-700">Recruiter Updates / Notes:</span>
                    <p className="text-slate-600 text-[11px]">{app.notes || 'Under review by talent acquisition team.'}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">Applied {app.appliedDate}</span>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => navigateTo('opportunity-detail', { opportunityId: app.opportunityId })}
                    >
                      View Job Specs
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
