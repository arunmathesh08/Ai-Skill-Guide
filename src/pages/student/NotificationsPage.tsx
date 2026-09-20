import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Award,
  Send,
  Building,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsRead,
    navigateTo
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread' | 'assessment' | 'application'>('all');

  // Load only notifications for current logged-in user
  const userNotifications = notifications.filter(n => n.userId === currentUser.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const filteredNotifications = userNotifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const getIcon = (type?: string) => {
    switch (type) {
      case 'assessment':
        return <Award className="w-4 h-4 text-brand-600 dark:text-brand-400" />;
      case 'application':
        return <Send className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const tabs = [
    { id: 'all', label: 'All Notifications', count: userNotifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'assessment', label: 'Skill Assessments', count: userNotifications.filter(n => n.type === 'assessment').length },
    { id: 'application', label: 'Applications', count: userNotifications.filter(n => n.type === 'application').length }
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-1.5 border border-brand-100 dark:border-brand-800">
            <Bell className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Activity Alerts & System Updates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Stay updated with verified assessment evaluations, application status progressions, and recruiter alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold border-slate-300 dark:border-slate-700"
            icon={<Check className="w-3.5 h-3.5" />}
            onClick={markAllNotificationsRead}
          >
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={filter}
        onChange={(id) => setFilter(id as any)}
        variant="pills"
      />

      {/* Notifications List */}
      <div className="space-y-3">
        {userNotifications.length === 0 ? (
          <Card className="text-center py-16 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">No notifications yet (0)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Your notifications will appear here when you complete assessments or receive status updates from recruiters.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                className="font-bold shadow-sm"
                icon={<Award className="w-4 h-4" />}
                onClick={() => navigateTo('skill-assessment')}
              >
                Take Assessment
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="font-semibold"
                onClick={() => navigateTo('opportunities')}
              >
                Explore Opportunities
              </Button>
            </div>
          </Card>
        ) : filteredNotifications.length === 0 ? (
          <Card className="text-center py-12 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No notifications found in this category (0)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try switching to all notifications.</p>
          </Card>
        ) : (
          filteredNotifications.map(notif => (
            <Card
              key={notif.id}
              className={`p-4 transition-all duration-150 bg-white dark:bg-[#111827] border ${
                !notif.read
                  ? 'border-brand-300 dark:border-brand-800/80 bg-brand-50/20 dark:bg-brand-950/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" title="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      {notif.time}
                    </span>
                  </div>
                </div>

                {!notif.read && (
                  <button
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 shrink-0 cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
