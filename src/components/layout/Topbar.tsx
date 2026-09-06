import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Check,
  LogOut,
  ChevronDown,
  User,
  Building,
  GraduationCap,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Database,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { DEMO_USERS } from '../../data/mockData';

interface TopbarProps {
  onOpenMobileSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileSidebar }) => {
  const {
    currentUser,
    currentRole,
    loginAs,
    logout,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    searchTerm,
    setSearchTerm,
    navigateTo,
    resetToDefaults,
    isSupabaseConnected
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (personaRef.current && !personaRef.current.contains(event.target as Node)) {
        setIsPersonaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { role: UserRole; title: string; label: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'student',
      title: 'Aarav Sharma (Student)',
      label: 'Student Portal',
      icon: <User className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      role: 'industry',
      title: 'Priya Sen (TechNova HR)',
      label: 'Industry / Recruiter',
      icon: <Building className="w-4 h-4" />,
      color: 'bg-emerald-100 text-emerald-800'
    },
    {
      role: 'faculty',
      title: 'Dr. Ramesh Kumar (Professor)',
      label: 'Faculty Mentor',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      role: 'admin',
      title: 'Dr. Ananya Iyer (Dean)',
      label: 'Institution Admin',
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  const currentRoleConfig = roles.find(r => r.role === currentRole) || roles[0];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
      {/* Left section: Mobile menu & Quick Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-xs sm:max-w-sm lg:max-w-md">
        <button
          onClick={onOpenMobileSidebar}
          className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden cursor-pointer shrink-0"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar with responsive flex-shrink */}
        <div className="relative w-full min-w-0 hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search skills, jobs, courses..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-400 font-medium truncate"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right section: Clean, perfectly aligned controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
        {/* Supabase Connection Status Pill */}
        <div
          className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold shrink-0"
          title="Supabase PostgreSQL REST API Connected (ysqggazrfrmpvxqzmyru)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[11px] font-mono font-bold whitespace-nowrap">Cloud Connected</span>
        </div>

        {/* Persona Switcher Dropdown */}
        <div className="relative shrink-0" ref={personaRef}>
          <button
            onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer whitespace-nowrap"
            title="Switch Stakeholder Persona"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="hidden sm:inline text-slate-400 font-normal">Role:</span>
            <span className="capitalize font-bold text-slate-900">{currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isPersonaMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-dropdown border border-slate-200 py-2 z-50 animate-fadeIn">
              <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Switch Persona / Role
                </div>
                <p className="text-[11px] text-slate-400">Experience portal from different stakeholder views</p>
              </div>

              {roles.map(r => (
                <button
                  key={r.role}
                  onClick={() => {
                    loginAs(r.role);
                    setIsPersonaMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                    currentRole === r.role ? 'bg-brand-50/70 font-bold text-brand-900' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-md ${r.color} shrink-0`}>{r.icon}</div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{r.label}</div>
                      <div className="text-[11px] text-slate-500 truncate">{DEMO_USERS[r.role].name}</div>
                    </div>
                  </div>
                  {currentRole === r.role && <Check className="w-4 h-4 text-brand-600 shrink-0 ml-2" />}
                </button>
              ))}

              <div className="border-t border-slate-100 mt-2 pt-1.5 px-3">
                <button
                  onClick={() => {
                    resetToDefaults();
                    setIsPersonaMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Simulation State</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative shrink-0" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-brand-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-dropdown border border-slate-200 py-2 z-50 animate-fadeIn">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-100 text-brand-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-brand-600 hover:text-brand-800 font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">No notifications yet</div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3 text-xs hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                        !notif.read ? 'bg-brand-50/30' : ''
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          !notif.read ? 'bg-brand-600' : 'bg-transparent'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 mb-0.5 truncate">{notif.title}</div>
                        <div className="text-slate-600 leading-relaxed mb-1 line-clamp-2">{notif.message}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{notif.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu with perfect responsive truncation */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg hover:bg-slate-100 text-left transition-colors cursor-pointer border border-transparent hover:border-slate-200 max-w-[160px] sm:max-w-[200px] min-w-0"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
              {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block min-w-0 flex-1">
              <div className="font-bold text-slate-900 text-xs leading-tight truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">{currentUser.organization || currentUser.title}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block shrink-0" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-dropdown border border-slate-200 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{currentUser.title || currentUser.organization}</p>
              </div>

              <div className="py-1">
                {currentRole === 'student' && (
                  <>
                    <button
                      onClick={() => {
                        navigateTo('portfolio');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>View Student Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('profile-setup');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-brand-700 hover:bg-brand-50 cursor-pointer font-semibold"
                    >
                      <Sliders className="w-4 h-4 text-brand-600" />
                      <span>Academic & Feed Setup</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    navigateTo('dashboard');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <span>Role Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>About & Landing Page</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
