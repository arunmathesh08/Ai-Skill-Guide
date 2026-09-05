import React from 'react';
import {
  TrendingUp,
  Award,
  AlertCircle,
  BookOpen,
  ArrowLeft,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { FACULTY_ANALYTICS } from '../../data/mockData';

export const SkillAnalyticsPage: React.FC = () => {
  const { showToast, navigateTo } = useApp();

  const handleExport = () => {
    showToast('success', 'Exported Department Skill Accreditation & Gap Audit (CSV/PDF)', 'Report Exported');
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
            Cohort Skill Analytics & Curriculum Alignment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Institutional insight into student competency strengths, curriculum deficiencies, and recommended faculty interventions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={handleExport}
        >
          Export NBA / NAAC Report
        </Button>
      </div>

      {/* Curriculum Intervention Recommendations Card */}
      <Card className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-0 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-300 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Automated Academic Action Items</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Recommended Curriculum Adjustments for Next Semester
        </h3>
        <ul className="space-y-2 text-xs text-slate-200 leading-relaxed max-w-3xl">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
            <span>
              <strong>Introduce hands-on TypeScript & Modern UI labs:</strong> 45% of final-year students exhibit gaps in type systems despite 94% industry demand.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
            <span>
              <strong>Integrate Cloud CI/CD & Docker into Software Engineering lab:</strong> 52% deficit detected in containerization workflows.
            </span>
          </li>
        </ul>
      </Card>

      {/* Deep-Dive Gap Matrix */}
      <Card>
        <CardHeader
          title="Skill Gap Severity Matrix"
          subtitle="Detailed breakdown of tested competencies vs industry benchmarks"
          icon={<AlertCircle className="w-4 h-4 text-amber-600" />}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Skill Competency</th>
                <th className="py-3 px-4 font-bold">Assessed Gap Rate</th>
                <th className="py-3 px-4 font-bold">Affected Students</th>
                <th className="py-3 px-4 font-bold">Severity</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {FACULTY_ANALYTICS.topGaps.map(gap => (
                <tr key={gap.skill} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{gap.skill}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{gap.gapRate}%</span>
                      <div className="w-20 bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: `${gap.gapRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {gap.affectedStudents} / {FACULTY_ANALYTICS.assessedStudents}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={gap.severity === 'Critical' ? 'danger' : 'warning'}
                      size="xs"
                    >
                      {gap.severity}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => navigateTo('mentorship')}
                    >
                      Assign Modules
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
