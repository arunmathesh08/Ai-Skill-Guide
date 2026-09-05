import React from 'react';
import {
  TrendingUp,
  Award,
  Download,
  Building2,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ADMIN_KPIS } from '../../data/mockData';

export const AdminAnalyticsPage: React.FC = () => {
  const { showToast, navigateTo } = useApp();

  const handleExport = () => {
    showToast('success', 'Generated Executive Placement & Skill Supply Analytics Report (PDF/Excel)', 'Report Downloaded');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <button
            onClick={() => navigateTo('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Institutional Placement & Skill Intelligence Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Longitudinal placement trajectories, skill competency growth curves, and accreditation audit metrics.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={handleExport}
        >
          Export AICTE / NAAC Report
        </Button>
      </div>

      {/* Placement Trends Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="text-center p-6 bg-gradient-to-b from-white to-slate-50">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Overall Placement Velocity
          </span>
          <div className="text-4xl font-black text-emerald-600 my-1">
            {ADMIN_KPIS.placementRate}%
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
            +{ADMIN_KPIS.placementGrowth}% Year-on-Year
          </span>
          <p className="text-xs text-slate-500 mt-3">
            {ADMIN_KPIS.totalPlacements} of {ADMIN_KPIS.totalStudents} students placed across 48+ hiring partners.
          </p>
        </Card>

        <Card className="text-center p-6 bg-gradient-to-b from-white to-slate-50">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Mean Compensation Package
          </span>
          <div className="text-4xl font-black text-brand-600 my-1">
            {ADMIN_KPIS.averagePackage}
          </div>
          <span className="text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full font-bold border border-brand-200">
            +18.4% CTC Expansion
          </span>
          <p className="text-xs text-slate-500 mt-3">
            Highest offered CTC: <strong>{ADMIN_KPIS.highestPackage}</strong> (TechNova Solutions Core R&D).
          </p>
        </Card>

        <Card className="text-center p-6 bg-gradient-to-b from-white to-slate-50">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Skill Assessment Coverage
          </span>
          <div className="text-4xl font-black text-indigo-600 my-1">
            {ADMIN_KPIS.assessedPercentage}%
          </div>
          <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-bold border border-indigo-200">
            {ADMIN_KPIS.studentsAssessed} Students Tested
          </span>
          <p className="text-xs text-slate-500 mt-3">
            Proctored code evaluations across algorithms, modern UI, databases, and DevOps.
          </p>
        </Card>
      </div>

      {/* Cross-Department Readiness Audit */}
      <Card>
        <CardHeader
          title="Cross-Department Competency Audit"
          subtitle="Readiness benchmarks against corporate hiring thresholds"
          icon={<Award className="w-4 h-4 text-brand-600" />}
        />

        <div className="space-y-4">
          {ADMIN_KPIS.departments.map(dept => (
            <div key={dept.name} className="p-3.5 rounded-xl bg-slate-50 border space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-bold text-slate-900 text-sm">{dept.name}</div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-500 font-mono">
                    Enrolled: <strong>{dept.students}</strong>
                  </span>
                  <span className="text-slate-500 font-mono">
                    Placed: <strong>{dept.placed}</strong> ({dept.placementRate}%)
                  </span>
                  <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    Readiness: {dept.avgReadiness}%
                  </span>
                </div>
              </div>
              <ProgressBar value={dept.avgReadiness} height="xs" variant="tier" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
