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
    isSupabaseConnected,
    theme,
    toggleTheme
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);

  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

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
      color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
    },
    {
      role: 'industry',
      title: 'Priya Sen (TechNova HR)',
      label: 'Industry / Recruiter',
      icon: <Building className="w-4 h-4" />,
      color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
    },
    {
      role: 'faculty',
      title: 'Dr. Ramesh Kumar (Professor)',
      label: 'Faculty Mentor',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300'
    },
    {
      role: 'admin',
      title: 'Dr. Ananya Iyer (Dean)',
      label: 'Institution Admin',
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
    }
  ];

  const currentRoleConfig = roles.find(r => r.role === currentRole) || roles[0];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0 transition-colors duration-200">
      {/* Left section: Mobile menu & Quick Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-xs sm:max-w-sm lg:max-w-md">
        <button
          onClick={onOpenMobileSidebar}
          className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden cursor-pointer shrink-0"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar with responsive flex-shrink */}
        <div className="relative w-full min-w-0 hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search skills, jobs, courses..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 font-medium truncate"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold"
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
          className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold shrink-0"
          title="Supabase PostgreSQL REST API Connected (ysqggazrfrmpvxqzmyru)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[11px] font-mono font-bold whitespace-nowrap">Cloud Connected</span>
        </div>

        {/* Persona Switcher Dropdown */}
        <div className="relative shrink-0" ref={personaRef}>
          <button
            onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-all cursor-pointer whitespace-nowrap"
            title="Switch Stakeholder Persona"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="hidden sm:inline text-slate-400 dark:text-slate-400 font-normal">Role:</span>
            <span className="capitalize font-bold text-slate-900 dark:text-slate-100">{currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isPersonaMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#111827] rounded-xl shadow-dropdown border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fadeIn">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Switch Persona / Role
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Experience portal from different stakeholder views</p>
              </div>

              {roles.map(r => (
                <button
                  key={r.role}
                  onClick={() => {
                    loginAs(r.role);
                    setIsPersonaMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                    currentRole === r.role ? 'bg-brand-50/70 dark:bg-brand-950/60 font-bold text-brand-900 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-md ${r.color} shrink-0`}>{r.icon}</div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{r.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{DEMO_USERS[r.role].name}</div>
                    </div>
                  </div>
                  {currentRole === r.role && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 ml-2" />}
                </button>
              ))}

              <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-1.5 px-3">
                <button
                  onClick={() => {
                    resetToDefaults();
                    setIsPersonaMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Simulation State</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light Mode Toggle Button (Compact, accessible) */}
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none shrink-0"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <span className="text-base sm:text-lg leading-none" role="img" aria-hidden="true">☀</span>
          ) : (
            <span className="text-base sm:text-lg leading-none" role="img" aria-hidden="true">🌙</span>
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative shrink-0" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            <span className={`absolute top-1 right-1 min-w-[16px] h-4 px-1 font-bold text-[10px] rounded-full flex items-center justify-center shadow-xs ${
              unreadCount > 0
                ? 'bg-brand-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {unreadCount}
            </span>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#111827] rounded-xl shadow-dropdown border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fadeIn">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Notifications ({userNotifications.length})
                  </span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                    unreadCount > 0
                      ? 'bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {unreadCount} new
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {userNotifications.length === 0 ? (
                  <div className="py-8 text-center px-4 space-y-1">
                    <Bell className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No notifications yet (0)</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">You're all caught up! New alerts will appear here.</p>
                  </div>
                ) : (
                  userNotifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex gap-3 ${
                        !notif.read ? 'bg-brand-50/30 dark:bg-brand-950/30' : ''
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          !notif.read ? 'bg-brand-600 dark:bg-brand-400' : 'bg-transparent'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 mb-0.5 truncate">{notif.title}</div>
                        <div className="text-slate-600 dark:text-slate-300 leading-relaxed mb-1 line-clamp-2">{notif.message}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{notif.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 px-3 pt-2 text-center">
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigateTo('notifications');
                  }}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 cursor-pointer"
                >
                  View All Notifications ({userNotifications.length}) →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu with perfect responsive truncation */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 max-w-[160px] sm:max-w-[200px] min-w-0"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-brand-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
              {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block min-w-0 flex-1">
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs leading-tight truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.organization || currentUser.title}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111827] rounded-xl shadow-dropdown border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{currentUser.title || currentUser.organization}</p>
              </div>

              <div className="py-1">
                {currentRole === 'student' && (
                  <>
                    <button
                      onClick={() => {
                        navigateTo('portfolio');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>View Student Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('profile-setup');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 cursor-pointer font-semibold"
                    >
                      <Sliders className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      <span>Academic & Feed Setup</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    navigateTo('dashboard');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <span>Role Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>About & Landing Page</span>
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
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
