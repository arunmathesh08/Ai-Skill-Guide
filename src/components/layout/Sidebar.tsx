import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Award,
  Compass,
  Briefcase,
  BookOpen,
  Send,
  UserCheck,
  Bell,
  PlusCircle,
  Users,
  Building2,
  TrendingUp,
  FileSpreadsheet,
  Settings,
  GraduationCap,
  Sparkles,
  Layers,
  CheckCircle2,
  Target,
  Database,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
}

interface NavDivision {
  id: string;
  title: string;
  icon?: React.ReactNode;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, setIsOpenMobile }) => {
  const { currentRole, activeTab, navigateTo, applications, notifications } = useApp();

  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const activeAppsCount = applications.filter(a => a.status !== 'Rejected').length;

  // Student Navigation Divisions
  const studentDivisions: NavDivision[] = [
    {
      id: 'student-overview',
      title: 'Overview & Profile',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
      items: [
        { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'portfolio', label: 'My Verified Profile', icon: <UserCheck className="w-4 h-4" /> },
        { id: 'profile-setup', label: 'Academic & Feed Setup', icon: <Sliders className="w-4 h-4" />, badge: 'Wizard', badgeColor: 'bg-amber-500/20 text-amber-300' }
      ]
    },
    {
      id: 'student-skills',
      title: 'Skill Intelligence (AI)',
      icon: <Target className="w-3.5 h-3.5 text-amber-400" />,
      items: [
        { id: 'skill-assessment', label: 'Skill Assessment', icon: <Award className="w-4 h-4" />, badge: 'Live Test', badgeColor: 'bg-brand-500/20 text-brand-300' },
        { id: 'skill-gaps', label: 'Skill Gap Analysis', icon: <Target className="w-4 h-4" />, badge: 'Core AI', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
        { id: 'careers', label: 'Career Paths & Roadmaps', icon: <Compass className="w-4 h-4" /> }
      ]
    },
    {
      id: 'student-growth',
      title: 'Opportunities & Growth',
      icon: <Briefcase className="w-3.5 h-3.5 text-blue-400" />,
      items: [
        { id: 'opportunities', label: 'Internships & Jobs', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'learning', label: 'Targeted Learning', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'applications', label: 'Application Pipeline', icon: <Send className="w-4 h-4" />, badge: activeAppsCount },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: unreadNotifsCount }
      ]
    }
  ];

  // Industry Navigation Divisions
  const industryDivisions: NavDivision[] = [
    {
      id: 'industry-overview',
      title: 'Hiring Overview',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
      items: [
        { id: 'dashboard', label: 'Company Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'post-opportunity', label: 'Post Opportunity', icon: <PlusCircle className="w-4 h-4" />, badge: 'Wizard', badgeColor: 'bg-brand-500/20 text-brand-300' }
      ]
    },
    {
      id: 'industry-talent',
      title: 'Talent Acquisition (ATS)',
      icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
      items: [
        { id: 'candidates', label: 'AI Candidate Discovery', icon: <Users className="w-4 h-4" />, badge: 'Match Engine', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
        { id: 'industry-applications', label: 'Applicant Tracking (ATS)', icon: <Send className="w-4 h-4" /> },
        { id: 'opportunities', label: 'Active Postings', icon: <Briefcase className="w-4 h-4" /> }
      ]
    },
    {
      id: 'industry-relations',
      title: 'Corporate Ecosystem',
      icon: <Building2 className="w-3.5 h-3.5 text-purple-400" />,
      items: [
        { id: 'company-profile', label: 'Company Profile & MoUs', icon: <Building2 className="w-4 h-4" /> }
      ]
    }
  ];

  // Faculty Navigation Divisions
  const facultyDivisions: NavDivision[] = [
    {
      id: 'faculty-monitoring',
      title: 'Academic Monitoring',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
      items: [
        { id: 'dashboard', label: 'Faculty Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'skill-analytics', label: 'Cohort Skill Analytics', icon: <TrendingUp className="w-4 h-4" />, badge: 'Heatmap', badgeColor: 'bg-blue-500/20 text-blue-300' }
      ]
    },
    {
      id: 'faculty-mentorship',
      title: 'Mentorship & Remediation',
      icon: <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />,
      items: [
        { id: 'mentorship', label: 'Student Directory & Gaps', icon: <GraduationCap className="w-4 h-4" /> },
        { id: 'learning', label: 'Assigned Remedial Hub', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'opportunities', label: 'Industry Program Tracks', icon: <Briefcase className="w-4 h-4" /> }
      ]
    }
  ];

  // Admin Navigation Divisions
  const adminDivisions: NavDivision[] = [
    {
      id: 'admin-governance',
      title: 'Institutional Governance',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'admin-analytics', label: 'Placement & Skill KPIs', icon: <TrendingUp className="w-4 h-4" /> }
      ]
    },
    {
      id: 'admin-relations',
      title: 'Partnerships & Reports',
      icon: <Building2 className="w-3.5 h-3.5 text-purple-400" />,
      items: [
        { id: 'partners', label: 'Industry MoUs & Partners', icon: <Building2 className="w-4 h-4" /> },
        { id: 'opportunities', label: 'Opportunities Review', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'reports', label: 'Accreditation Reports', icon: <FileSpreadsheet className="w-4 h-4" /> }
      ]
    }
  ];

  const divisionMap: Record<UserRole, NavDivision[]> = {
    student: studentDivisions,
    industry: industryDivisions,
    faculty: facultyDivisions,
    admin: adminDivisions
  };

  const currentDivisions = divisionMap[currentRole] || studentDivisions;

  // Track expanded state for each division (all open by default)
  const [expandedDivisions, setExpandedDivisions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    studentDivisions.concat(industryDivisions, facultyDivisions, adminDivisions).forEach(div => {
      initial[div.id] = true;
    });
    return initial;
  });

  // Ensure active tab's parent division is automatically expanded
  useEffect(() => {
    currentDivisions.forEach(div => {
      if (div.items.some(item => item.id === activeTab)) {
        setExpandedDivisions(prev => ({ ...prev, [div.id]: true }));
      }
    });
  }, [activeTab, currentRole]);

  const toggleDivision = (divisionId: string) => {
    setExpandedDivisions(prev => ({
      ...prev,
      [divisionId]: !prev[divisionId]
    }));
  };

  const handleNavClick = (id: string) => {
    navigateTo(id);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-white text-base tracking-tight leading-none flex items-center gap-1.5">
                SkillBridge <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">AI</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Skill-to-Industry Integration</p>
            </div>
          </button>
        </div>

        {/* Role Badge Indicator */}
        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Active Workspace</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-600/30 text-brand-300 border border-brand-500/40">
              {currentRole}
            </span>
          </div>
        </div>

        {/* Navigation Divisions (Collapsible Accordion Dropdowns) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {currentDivisions.map(division => {
            const isExpanded = expandedDivisions[division.id] !== false;
            const hasActiveChild = division.items.some(item => item.id === activeTab);

            return (
              <div key={division.id} className="rounded-xl bg-slate-950/30 border border-slate-800/50 overflow-hidden">
                {/* Division Header Dropdown Button */}
                <button
                  onClick={() => toggleDivision(division.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                    hasActiveChild
                      ? 'bg-slate-800/80 text-white font-bold'
                      : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    {division.icon}
                    <span className="truncate">{division.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono">
                      {division.items.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" />
                    )}
                  </div>
                </button>

                {/* Collapsible Sub-items */}
                {isExpanded && (
                  <div className="p-1 space-y-0.5 border-t border-slate-800/40 bg-slate-900/60 animate-fadeIn">
                    {division.items.map(item => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                            isActive
                              ? 'bg-brand-600 text-white shadow-sm font-bold'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                            <span className="truncate">{item.label}</span>
                          </div>

                          {item.badge !== undefined && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                item.badgeColor
                                  ? item.badgeColor
                                  : isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Skill Loop & Supabase Cloud Status Badge */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/30 space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <div className="flex items-center gap-2 text-brand-400 font-bold text-[11px] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Skill Intelligence Core</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Skill &rarr; Gap &rarr; Learning &rarr; Opportunity
            </p>
          </div>

          <div className="px-2 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between text-[10px] text-emerald-300">
            <div className="flex items-center gap-1.5 font-mono">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Cloud Database Sync</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </aside>
    </>
  );
};
