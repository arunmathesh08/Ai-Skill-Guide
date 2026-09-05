import React, { useState } from 'react';
import {
  Send,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ApplicationStatus, Application } from '../../types';

export const IndustryApplicationsPage: React.FC = () => {
  const { applications, updateApplicationStatus, showToast } = useApp();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [activeApplicant, setActiveApplicant] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Shortlisted');

  const filteredApplications = applications.filter(app => {
    if (selectedStatusFilter === 'all') return true;
    return app.status.toLowerCase() === selectedStatusFilter.toLowerCase();
  });

  const handleUpdateStatus = () => {
    if (!activeApplicant) return;
    updateApplicationStatus(activeApplicant.id, newStatus);
    showToast(
      'success',
      `Updated ${activeApplicant.studentName}'s status to "${newStatus}" for ${activeApplicant.opportunityTitle}.`,
      'Status Updated'
    );
    setActiveApplicant(null);
  };

  const statusOptions: ApplicationStatus[] = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview',
    'Selected',
    'Rejected'
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-1">
            <Send className="w-3.5 h-3.5" />
            <span>Campus Talent Pipeline (ATS)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Applicant Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review student applicants, verified skill alignment scores, and progress candidates through recruitment stages.
          </p>
        </div>
      </div>

      {/* Stage Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setSelectedStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            selectedStatusFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Applicants ({applications.length})
        </button>
        {statusOptions.map(st => {
          const count = applications.filter(a => a.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedStatusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="space-y-3.5">
        {filteredApplications.length === 0 ? (
          <Card className="text-center py-12">
            <Send className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">No applications found in this stage</h4>
            <p className="text-xs text-slate-500 mt-1">Select another stage or clear filters to view candidates.</p>
          </Card>
        ) : (
          filteredApplications.map(app => (
            <Card key={app.id} className="p-4 sm:p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Applicant Details */}
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0">
                    {app.studentName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-slate-900 text-base">{app.studentName}</h3>
                      <Badge variant="brand" size="xs">
                        {app.opportunityTitle}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {app.studentCollege} • {app.studentEmail}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong className="text-slate-700">Note:</strong> {app.notes}
                    </p>
                  </div>
                </div>

                {/* Right: Skill Match & Action */}
                <div className="shrink-0 flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {app.matchScore}% Match
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">Applied {app.appliedDate}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        app.status === 'Selected'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Shortlisted'
                          ? 'bg-brand-100 text-brand-800'
                          : app.status === 'Interview'
                          ? 'bg-indigo-100 text-indigo-800'
                          : app.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {app.status}
                    </span>

                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setActiveApplicant(app);
                        setNewStatus(app.status);
                      }}
                    >
                      Update Stage
                    </Button>
                  </div>
                </div>
              </div>

              {/* Skills matched tag preview */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] text-slate-400 font-medium">Verified Strengths:</span>
                {app.matchingSkills.map((s, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Update Applicant Status Modal */}
      {activeApplicant && (
        <Modal
          isOpen={!!activeApplicant}
          onClose={() => setActiveApplicant(null)}
          title={`Update Status: ${activeApplicant.studentName}`}
          subtitle={`Position: ${activeApplicant.opportunityTitle} • ${activeApplicant.studentCollege}`}
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setActiveApplicant(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleUpdateStatus}>
                Confirm Status Change
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Recruitment Stage:
              </label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as ApplicationStatus)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-brand-500 font-bold"
              >
                {statusOptions.map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              Updating this stage will immediately notify the student and adjust their application tracker timeline.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
