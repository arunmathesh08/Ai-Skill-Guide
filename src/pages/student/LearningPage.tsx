import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Star,
  Clock,
  Award,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MOCK_COURSES } from '../../data/mockData';

export const LearningPage: React.FC = () => {
  const { showToast, navigateTo } = useApp();
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCourses = MOCK_COURSES.filter(c => {
    if (selectedSkillFilter !== 'all' && !c.targetSkill.toLowerCase().includes(selectedSkillFilter.toLowerCase())) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.targetSkill.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q);
    }
    return true;
  });

  const handleEnroll = (courseTitle: string) => {
    showToast('success', `Enrolled in "${courseTitle}". Module progress will reflect on your skill profile upon completion.`, 'Course Enrolled');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Targeted Skill Remediation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Targeted Learning & Upskilling
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Curated industry modules aligned directly with your detected skill gaps to elevate your readiness for tier-1 roles.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateTo('skill-gaps')}
        >
          Check Skill Gap Analysis
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'React.js', 'SQL', 'Git', 'TypeScript'].map(s => (
            <button
              key={s}
              onClick={() => setSelectedSkillFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedSkillFilter === s
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {s === 'all' ? 'All Skills' : s}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search courses or topics..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCourses.map(course => (
          <Card key={course.id} className="flex flex-col justify-between group overflow-hidden">
            <div>
              {/* Header Gradient Thumbnail Strip */}
              <div
                className={`h-24 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 p-4 bg-gradient-to-r ${course.thumbnailGradient} text-white flex flex-col justify-between mb-4 shadow-inner`}
              >
                <div className="flex justify-between items-start">
                  <Badge variant="neutral" size="xs" className="bg-black/30 text-white border-0 font-bold">
                    {course.level}
                  </Badge>
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> {course.rating}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-white/90 truncate">
                  {course.provider}
                </span>
              </div>

              {/* Title & Target Skill */}
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="brand" size="xs">
                  Target: {course.targetSkill}
                </Badge>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {course.duration}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 mb-3 leading-relaxed">
                {course.description}
              </p>

              {/* Match Reason Alert */}
              {course.matchReason && (
                <div className="p-2.5 rounded-lg bg-brand-50/70 border border-brand-200/60 text-xs text-brand-900 font-medium flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span className="truncate">{course.matchReason}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {course.studentsEnrolled.toLocaleString()} learners enrolled
              </span>
              <Button
                variant="primary"
                size="sm"
                icon={<Play className="w-3.5 h-3.5 fill-white" />}
                onClick={() => handleEnroll(course.title)}
              >
                Start Learning
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
