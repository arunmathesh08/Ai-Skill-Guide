import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle2,
  Send,
  Plus,
  LogIn
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, ProficiencyTag } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ProgressBar } from '../../components/common/ProgressBar';
import { MOCK_CANDIDATES, MOCK_COURSES } from '../../data/mockData';

export const MentorshipPage: React.FC = () => {
  const { showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(MOCK_COURSES[0].id);

  const filteredStudents = MOCK_CANDIDATES.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.targetRole.toLowerCase().includes(q) || s.college.toLowerCase().includes(q);
  });

  const handleAssignCourse = () => {
    const course = MOCK_COURSES.find(c => c.id === selectedCourseId);
    showToast(
      'success',
      `Assigned "${course?.title}" to ${selectedStudent?.name}. Student notified with priority enrollment link.`,
      'Remedial Module Assigned'
    );
    setIsAssignModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Faculty Mentorship & Remedial Allocation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Mentorship Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Inspect individual student sign-in records, skill competency matrices, and assign personalized bridge courses to close hiring deficits.
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <Card padding="sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search student by name, target role, roll number..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </Card>

      {/* Student Mentorship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStudents.map((student, idx) => {
          const signInTimes = ['Signed in 10 mins ago', 'Signed in 22 mins ago', 'Signed in 1 hour ago', 'Signed in 2 hours ago'];
          const signInStatus = signInTimes[idx % signInTimes.length];
          return (
            <Card key={student.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {student.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{student.name}</h3>
                      <p className="text-xs text-slate-500">
                        {student.degree} • {student.college}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block font-mono">
                      CGPA: {student.cgpa}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                      {student.readiness}% Ready
                    </span>
                  </div>
                </div>

                {/* Sign-in Record Tag */}
                <div className="mb-3 flex items-center gap-1.5 text-[11px] text-sky-700 bg-sky-50 px-2 py-1 rounded-md border border-sky-100 font-mono">
                  <LogIn className="w-3 h-3 text-sky-600" />
                  <span className="font-semibold">Portal Record:</span>
                  <span>{signInStatus}</span>
                </div>

              {/* Verified Skills list */}
              <div className="space-y-1.5 mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Assessed Skills:
                </span>
                <div className="space-y-1">
                  {student.skills.slice(0, 3).map(s => (
                    <div key={s.name} className="flex justify-between items-center text-xs">
                      <span className="text-slate-700 font-medium">{s.name}</span>
                      <ProficiencyTag score={s.score} size="xs" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">Target: {student.targetRole}</span>
              <Button
                variant="outline"
                size="xs"
                icon={<BookOpen className="w-3 h-3" />}
                onClick={() => {
                  setSelectedStudent(student);
                  setIsAssignModalOpen(true);
                }}
              >
                Assign Remedial Course
              </Button>
            </div>
          </Card>
          );
        })}
      </div>

      {/* Assign Remedial Modal */}
      {isAssignModalOpen && selectedStudent && (
        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title={`Assign Remedial Training: ${selectedStudent.name}`}
          subtitle={`Department of Computer Science & Engineering`}
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAssignCourse}>
                Assign & Notify Student
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Recommended Bridge Course:
              </label>
              <select
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              >
                {MOCK_COURSES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} (Target: {c.targetSkill})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-lg bg-brand-50/60 border border-brand-200 text-xs text-brand-900">
              The assigned module will appear as an urgent recommendation on {selectedStudent.name}&apos;s dashboard and learning tracker.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
