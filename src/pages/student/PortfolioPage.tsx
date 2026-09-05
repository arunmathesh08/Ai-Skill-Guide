import React, { useState } from 'react';
import {
  User,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Download,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  MapPin,
  Mail,
  Calendar,
  Code,
  FileText,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, ProficiencyTag } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';

export const PortfolioPage: React.FC = () => {
  const { studentProfile, navigateTo, showToast } = useApp();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const handleDownload = () => {
    showToast('success', 'Generated SkillBridge Verified ATS Resume (PDF Simulation)', 'Resume Downloaded');
    setIsResumeModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Profile Header Banner */}
      <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
              {studentProfile.user.avatar || 'AS'}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {studentProfile.user.name}
                </h1>
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />
                  Verified Student
                </Badge>
              </div>

              <p className="text-sm font-semibold text-brand-600">
                {studentProfile.department} • {studentProfile.education[0]?.institution}
              </p>

              <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {studentProfile.user.email}
                </span>
                <span>•</span>
                <span className="font-mono font-bold text-slate-800">Roll: {studentProfile.rollNo}</span>
                <span>•</span>
                <span className="font-bold text-slate-900">CGPA: {studentProfile.cgpa}</span>
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              icon={<Sparkles className="w-4 h-4 text-brand-600" />}
              onClick={() => navigateTo('profile-setup')}
            >
              Academic & Feed Setup
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<FileText className="w-4 h-4" />}
              onClick={() => setIsResumeModalOpen(true)}
            >
              Generate Verified Resume
            </Button>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            About & Career Objective
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
            {studentProfile.bio}
          </p>
        </div>
      </Card>

      {/* Verified Skills Matrix */}
      <Card>
        <CardHeader
          title="Verified Skill Competency Matrix"
          subtitle="Proctored assessment scores verified through academic benchmarks and institutional code sandboxes"
          icon={<Award className="w-4 h-4 text-brand-600" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {studentProfile.skills.map(skill => (
            <div
              key={skill.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 truncate">{skill.name}</span>
                {skill.verified && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <ProficiencyTag score={skill.score} size="xs" />
                <span className="text-[10px] text-slate-400 font-mono">{skill.lastAssessed}</span>
              </div>

              <ProgressBar value={skill.score} height="xs" variant="tier" />
            </div>
          ))}
        </div>
      </Card>

      {/* Technical Projects Showcase */}
      <Card>
        <CardHeader
          title="Featured Engineering Projects"
          subtitle="Production-grade full stack and distributed systems architecture projects"
          icon={<Code className="w-4 h-4 text-brand-600" />}
        />

        <div className="space-y-4">
          {studentProfile.projects.map(proj => (
            <div
              key={proj.id}
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">{proj.title}</h4>
                <div className="flex items-center gap-2">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200"
                    >
                      <GitBranch className="w-3.5 h-3.5" /> Source Code
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live Preview
                    </a>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{proj.description}</p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {proj.techStack.map(tech => (
                  <span
                    key={tech}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Certifications, Experience, and Education Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work Experience */}
        <Card>
          <CardHeader
            title="Industry Experience"
            subtitle="Internships and software development roles"
            icon={<Briefcase className="w-4 h-4 text-brand-600" />}
          />
          <div className="space-y-3">
            {studentProfile.experience.map(exp => (
              <div key={exp.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <div className="flex justify-between items-start">
                  <h5 className="font-bold text-slate-900 text-xs">{exp.role}</h5>
                  <span className="text-[10px] text-slate-500 font-mono">{exp.duration}</span>
                </div>
                <p className="font-semibold text-brand-700 text-[11px]">{exp.organization}</p>
                <p className="text-slate-600 leading-relaxed pt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Certifications & Education */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Verified Certifications"
              subtitle="Industry-recognized credentials"
              icon={<Award className="w-4 h-4 text-brand-600" />}
            />
            <div className="space-y-2.5">
              {studentProfile.certifications.map(cert => (
                <div
                  key={cert.id}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-2 text-xs"
                >
                  <div>
                    <h5 className="font-bold text-slate-900">{cert.title}</h5>
                    <p className="text-[11px] text-slate-500">{cert.issuer} • {cert.date}</p>
                    {cert.credentialId && (
                      <span className="text-[10px] font-mono text-slate-400">ID: {cert.credentialId}</span>
                    )}
                  </div>
                  {cert.verified && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded shrink-0">
                      Verified
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Academic Education"
              icon={<GraduationCap className="w-4 h-4 text-brand-600" />}
            />
            <div className="space-y-2 text-xs">
              {studentProfile.education.map((edu, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{edu.degree}</span>
                    <span className="font-mono text-brand-700">{edu.grade}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{edu.institution} ({edu.year})</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Resume Preview & Download Modal */}
      <Modal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        title="SkillBridge Verified ATS Resume Preview"
        subtitle="Formatted with cryptographic skill verification badges for campus & industry recruiting"
        maxWidth="3xl"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsResumeModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={handleDownload}
            >
              Download PDF Resume
            </Button>
          </>
        }
      >
        <div className="p-6 bg-white border border-slate-300 rounded-xl shadow-inner text-slate-800 space-y-4 text-xs font-sans">
          {/* Resume Header */}
          <div className="text-center border-b pb-3 space-y-1">
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
              {studentProfile.user.name}
            </h2>
            <p className="text-xs text-slate-600">
              {studentProfile.user.email} | +91 98765 43210 | NIT Campus | GitHub & LinkedIn
            </p>
            <p className="text-[11px] text-brand-700 font-semibold">
              SkillBridge Verified Portfolio ID: SKB-2026-NIT-{studentProfile.rollNo}
            </p>
          </div>

          {/* Resume Verified Skills */}
          <div>
            <h4 className="font-bold uppercase text-[11px] border-b pb-0.5 mb-1.5 text-slate-900">
              Verified Technical Competencies
            </h4>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              {studentProfile.skills.map(s => (
                <div key={s.id} className="flex justify-between pr-4">
                  <span className="font-medium text-slate-800">{s.name}:</span>
                  <span className="font-bold text-slate-900">{s.score}% ({s.verified ? 'Verified' : 'Self-assessed'})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Projects */}
          <div>
            <h4 className="font-bold uppercase text-[11px] border-b pb-0.5 mb-1.5 text-slate-900">
              Featured Software Engineering Projects
            </h4>
            <div className="space-y-2">
              {studentProfile.projects.map(p => (
                <div key={p.id}>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{p.title}</span>
                    <span className="font-mono text-[10px] text-slate-500">{p.techStack.join(', ')}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Education */}
          <div>
            <h4 className="font-bold uppercase text-[11px] border-b pb-0.5 mb-1 text-slate-900">
              Education
            </h4>
            {studentProfile.education.map((e, idx) => (
              <div key={idx} className="flex justify-between text-[11px]">
                <span className="font-medium text-slate-800">{e.degree} — {e.institution}</span>
                <span className="font-bold text-slate-900">{e.grade} ({e.year})</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
