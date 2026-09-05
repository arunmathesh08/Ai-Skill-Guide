import React from 'react';
import {
  Building2,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  LogIn,
  Activity,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ADMIN_KPIS, MOCK_STUDENT_SIGNINS } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { currentUser, navigateTo } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{currentUser.organization}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Executive Institutional Dashboard
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              University-wide placement analytics, student sign-in records, skill supply-demand alignment index, and corporate partner governance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => navigateTo('partners')}
            >
              Industry MoUs & Partners
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<TrendingUp className="w-4 h-4" />}
              onClick={() => navigateTo('admin-analytics')}
            >
              Institutional Reports
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students Enrolled"
          value={ADMIN_KPIS.totalStudents.toLocaleString()}
          icon={<Users className="w-5 h-5 text-brand-600" />}
          subtitle={`${ADMIN_KPIS.assessedPercentage}% Assessed & Verified`}
        />
        <StatCard
          title="Daily Student Sign-Ins"
          value={ADMIN_KPIS.dailyStudentSignIns.toLocaleString()}
          delta={12.8}
          deltaType="positive"
          icon={<LogIn className="w-5 h-5 text-sky-600" />}
          subtitle={`${ADMIN_KPIS.activeSignInsTodayPercentage}% Daily Active Rate`}
        />
        <StatCard
          title="Active Corporate Partners"
          value={ADMIN_KPIS.activeIndustryPartners}
          delta={22}
          deltaType="positive"
          icon={<Building2 className="w-5 h-5 text-purple-600" />}
          subtitle={`${ADMIN_KPIS.activeMoUs} Signed Strategic MoUs`}
        />
        <StatCard
          title="Total Placements"
          value={ADMIN_KPIS.totalPlacements}
          delta={ADMIN_KPIS.placementGrowth}
          deltaType="positive"
          icon={<Award className="w-5 h-5 text-emerald-600" />}
          subtitle={`${ADMIN_KPIS.placementRate}% Placement Rate`}
        />
        <StatCard
          title="Average Compensation"
          value={ADMIN_KPIS.averagePackage}
          icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
          subtitle={`Highest: ${ADMIN_KPIS.highestPackage}`}
        />
      </div>

      {/* Student Sign-in & Portal Login Audit Log */}
      <Card>
        <CardHeader
          title="Live Student Sign-in & Portal Activity Log"
          subtitle="Real-time audit record of student sign-in timestamps, auth methods, and session statuses"
          icon={<LogIn className="w-4 h-4 text-sky-600" />}
          action={
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sign-in Feed
              </span>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Student Name</th>
                <th className="py-3 px-4 font-bold">Roll Number</th>
                <th className="py-3 px-4 font-bold">Department</th>
                <th className="py-3 px-4 font-bold">Sign-in Time</th>
                <th className="py-3 px-4 font-bold">Auth Method</th>
                <th className="py-3 px-4 font-bold">Session Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_STUDENT_SIGNINS.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                      {log.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span>{log.studentName}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{log.rollNo}</td>
                  <td className="py-3 px-4 text-slate-600">{log.department}</td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-500">{log.time}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border text-[11px]">
                      {log.method}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {log.status === 'Active Session' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active Session
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">
                        Signed Out
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>


      {/* Department-wise Placement & Skill Readiness Table */}
      <Card>
        <CardHeader
          title="Department-wise Placement & Skill Readiness Index"
          subtitle="Comparative analysis across all constituent engineering departments"
          icon={<Award className="w-4 h-4 text-brand-600" />}
          action={
            <Button
              variant="outline"
              size="xs"
              icon={<FileSpreadsheet className="w-3.5 h-3.5" />}
              onClick={() => navigateTo('admin-analytics')}
            >
              Full Analytics Report
            </Button>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Department</th>
                <th className="py-3 px-4 font-bold">Students Enrolled</th>
                <th className="py-3 px-4 font-bold">Daily Active Sign-ins</th>
                <th className="py-3 px-4 font-bold">Avg Readiness</th>
                <th className="py-3 px-4 font-bold">Placed Students</th>
                <th className="py-3 px-4 font-bold">Placement Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ADMIN_KPIS.departments.map(dept => (
                <tr key={dept.name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{dept.name}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{dept.students}</td>
                  <td className="py-3 px-4 font-mono font-bold text-sky-700">
                    <span className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200">
                      {dept.activeSignIns} ({Math.round((dept.activeSignIns / dept.students) * 100)}%)
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{dept.avgReadiness}%</span>
                      <div className="w-20 bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-brand-600 h-1.5 rounded-full"
                          style={{ width: `${dept.avgReadiness}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{dept.placed}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {dept.placementRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Strategic Supply-Demand Index */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-0 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-300 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Skill Supply vs Demand Index</span>
          </div>
          <div className="text-4xl font-black text-white my-1">
            {ADMIN_KPIS.skillSupplyDemandIndex} / 100
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-2">
            Measures the algorithmic alignment between curriculum-verified student skills and the active job requirements of 48+ hiring partners.
          </p>
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-xs text-brand-300">
            <span>Target Index: 90.0+</span>
            <span className="text-emerald-400 font-bold">+5.8 pts vs last academic year</span>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Strategic Industry Partnerships"
            subtitle="Tier-1 industry collaborations & MoUs"
            icon={<Building2 className="w-4 h-4 text-brand-600" />}
          />
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border">
              <div>
                <span className="font-bold text-slate-900 block">TechNova Solutions</span>
                <span className="text-[11px] text-slate-500">Center of Excellence • Cloud & UI Architecture</span>
              </div>
              <Badge variant="success" size="xs">Active MoU</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border">
              <div>
                <span className="font-bold text-slate-900 block">CloudBridge Technologies</span>
                <span className="text-[11px] text-slate-500">Sponsored Apprenticeship & PPO Track</span>
              </div>
              <Badge variant="success" size="xs">Active MoU</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border">
              <div>
                <span className="font-bold text-slate-900 block">DataSphere Labs</span>
                <span className="text-[11px] text-slate-500">Big Data & Relational Pipelines Lab</span>
              </div>
              <Badge variant="brand" size="xs">Renewing</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
