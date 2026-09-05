import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../common/ToastContainer';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Target,
  Award,
  Briefcase,
  User,
  PlusCircle,
  Users,
  Send,
  GraduationCap,
  Building2,
  TrendingUp
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const { currentRole, activeTab, navigateTo } = useApp();

  const getMobileNavItems = () => {
    switch (currentRole) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'skill-assessment', label: 'Assess', icon: <Award className="w-5 h-5" /> },
          { id: 'skill-gaps', label: 'Gaps', icon: <Target className="w-5 h-5" /> },
          { id: 'opportunities', label: 'Jobs', icon: <Briefcase className="w-5 h-5" /> },
          { id: 'portfolio', label: 'Profile', icon: <User className="w-5 h-5" /> }
        ];
      case 'industry':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'post-opportunity', label: 'Post Job', icon: <PlusCircle className="w-5 h-5" /> },
          { id: 'candidates', label: 'Talent', icon: <Users className="w-5 h-5" /> },
          { id: 'industry-applications', label: 'ATS', icon: <Send className="w-5 h-5" /> }
        ];
      case 'faculty':
        return [
          { id: 'dashboard', label: 'Cohort', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'skill-analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
          { id: 'mentorship', label: 'Mentorship', icon: <GraduationCap className="w-5 h-5" /> }
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'admin-analytics', label: 'KPIs', icon: <TrendingUp className="w-5 h-5" /> },
          { id: 'partners', label: 'Partners', icon: <Building2 className="w-5 h-5" /> }
        ];
      default:
        return [];
    }
  };

  const mobileNavItems = getMobileNavItems();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
      {/* Sidebar (Responsive Drawer on Mobile) */}
      <Sidebar isOpenMobile={isOpenMobile} setIsOpenMobile={setIsOpenMobile} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
        <Topbar onOpenMobileSidebar={() => setIsOpenMobile(true)} />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar for All Roles */}
      {mobileNavItems.length > 0 && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
          {mobileNavItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                  isActive ? 'text-brand-600 font-bold bg-brand-50/60' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {item.icon}
                <span className="mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Global Toast System */}
      <ToastContainer />
    </div>
  );
};
