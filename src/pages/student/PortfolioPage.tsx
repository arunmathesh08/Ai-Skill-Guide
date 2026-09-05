import React, { useState, useRef } from 'react';
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
  Printer,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, ProficiencyTag } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const PortfolioPage: React.FC = () => {
  const { studentProfile, navigateTo, showToast } = useApp();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const resumePrintRef = useRef<HTMLDivElement>(null);

  // Deduplicate skills by lowercased skill name so duplicates never appear
  const uniqueSkillsMap = new Map<string, typeof studentProfile.skills[0]>();
  studentProfile.skills.forEach(s => {
    const key = s.name.trim().toLowerCase();
    const existing = uniqueSkillsMap.get(key);
    if (!existing || s.score > existing.score) {
      uniqueSkillsMap.set(key, s);
    }
  });
  const uniqueSkills = Array.from(uniqueSkillsMap.values());

  const handleDownload = () => {
    setIsGeneratingPdf(true);

    const cleanName = studentProfile.user.name.trim().replace(/\s+/g, '_');
    const filename = `${cleanName}_Verified_ATS_Resume.pdf`;

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      let y = 16; // Vertical position in mm

      // --- 1. HEADER (NAME & CONTACT) ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // #0f172a
      doc.text(studentProfile.user.name.toUpperCase(), 105, y, { align: 'center' });

      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85); // #334155
      const deptText = `${studentProfile.department} • ${studentProfile.education[0]?.institution || studentProfile.user.organization}`;
      doc.text(deptText, 105, y, { align: 'center' });

      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const contactText = `${studentProfile.user.email}  |  +91 98765 43210  |  NIT Campus, India  |  GitHub & LinkedIn`;
      doc.text(contactText, 105, y, { align: 'center' });

      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235); // #2563eb
      doc.text(`SkillBridge Verified Portfolio ID: SKB-2026-NIT-${studentProfile.rollNo}`, 105, y, { align: 'center' });

      y += 4;
      doc.setDrawColor(203, 213, 225); // #cbd5e1
      doc.setLineWidth(0.5);
      doc.line(15, y, 195, y);

      // --- SUMMARY ---
      if (studentProfile.bio) {
        y += 6;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text('PROFESSIONAL SUMMARY', 15, y);

        y += 2;
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.3);
        doc.line(15, y, 195, y);

        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const splitBio = doc.splitTextToSize(studentProfile.bio, 180);
        doc.text(splitBio, 15, y);
        y += (splitBio.length * 4) + 2;
      } else {
        y += 4;
      }

      // --- 2. VERIFIED COMPETENCIES ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text('VERIFIED TECHNICAL COMPETENCIES & ASSESSMENT REPORTS', 15, y);
      doc.setFontSize(8);
      doc.setTextColor(5, 150, 105); // #059669
      doc.text('crypto-verified', 195, y, { align: 'right' });

      y += 2;
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.line(15, y, 195, y);
      y += 5;

      // Render 2-column unique skills list
      const skillsHalf = Math.ceil(uniqueSkills.length / 2);
      const col1 = uniqueSkills.slice(0, skillsHalf);
      const col2 = uniqueSkills.slice(skillsHalf);
      const maxRows = Math.max(col1.length, col2.length);

      for (let i = 0; i < maxRows; i++) {
        const s1 = col1[i];
        const s2 = col2[i];

        if (s1) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(30, 41, 59);
          doc.text(`${s1.name}:`, 15, y);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(15, 23, 42);
          const tag1 = s1.verified ? `${s1.score}%  (Verified)` : `${s1.score}%  (Self-assessed)`;
          doc.text(tag1, 98, y, { align: 'right' });
        }

        if (s2) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(30, 41, 59);
          doc.text(`${s2.name}:`, 108, y);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(15, 23, 42);
          const tag2 = s2.verified ? `${s2.score}%  (Verified)` : `${s2.score}%  (Self-assessed)`;
          doc.text(tag2, 195, y, { align: 'right' });
        }

        y += 4.5;
      }

      y += 3;

      // --- 3. FEATURED PROJECTS ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text('FEATURED SOFTWARE ENGINEERING PROJECTS', 15, y);

      y += 2;
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.line(15, y, 195, y);
      y += 5;

      studentProfile.projects.forEach(p => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(p.title, 15, y);

        doc.setFont('courier', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(p.techStack.join(' • '), 195, y, { align: 'right' });

        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const splitDesc = doc.splitTextToSize(p.description, 180);
        doc.text(splitDesc, 15, y);
        y += (splitDesc.length * 4) + 2;
      });

      y += 2;

      // --- 4. EDUCATION & CERTIFICATIONS ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text('ACADEMIC EDUCATION & CERTIFICATIONS', 15, y);

      y += 2;
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.line(15, y, 195, y);
      y += 5;

      studentProfile.education.forEach(e => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);
        doc.text(`${e.degree} — ${e.institution} (${e.year})`, 15, y);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(e.grade, 195, y, { align: 'right' });

        y += 4.5;
      });

      if (studentProfile.certifications.length > 0) {
        y += 2;
        studentProfile.certifications.forEach(c => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(30, 41, 59);
          doc.text(`${c.title} (${c.issuer} • ${c.date})`, 15, y);

          if (c.verified) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(5, 150, 105);
            doc.text('(Verified Credential)', 195, y, { align: 'right' });
          }
          y += 4.5;
        });
      }

      // Save PDF directly to user's Downloads folder
      doc.save(filename);

      showToast('success', 'Resume downloaded successfully!', 'PDF Download Complete');
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('error', 'Failed to generate PDF. Please try again.', 'Download Error');
    } finally {
      setIsGeneratingPdf(false);
    }
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
          {uniqueSkills.map(skill => (
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

      {/* Certifications & Education Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry Experience */}
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

      {/* Redesigned Student ATS Resume Preview & Download Modal */}
      <Modal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        title="SkillBridge Verified ATS Resume Preview"
        subtitle="Clean, structured ATS resume formatted with student profile, verified skills, projects & education."
        maxWidth="3xl"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsResumeModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isGeneratingPdf}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold"
              icon={<Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />}
              onClick={handleDownload}
            >
              {isGeneratingPdf ? 'Downloading PDF...' : 'Download PDF Resume'}
            </Button>
          </>
        }
      >
        <div
          ref={resumePrintRef}
          className="p-6 sm:p-8 bg-white border border-slate-300 rounded-xl shadow-xs text-slate-800 space-y-5 text-xs font-sans"
        >
          {/* SECTION 1: STUDENT PROFILE HEADER & SUMMARY */}
          <div className="resume-header text-center border-b-2 border-slate-300 pb-3 space-y-1">
            <h2 className="resume-name text-2xl font-black uppercase tracking-wider text-slate-900">
              {studentProfile.user.name}
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              {studentProfile.department} • {studentProfile.education[0]?.institution || studentProfile.user.organization}
            </p>
            <p className="resume-contact text-xs text-slate-600 flex items-center justify-center flex-wrap gap-2 pt-0.5">
              <span>{studentProfile.user.email}</span>
              <span>•</span>
              <span>+91 98765 43210</span>
              <span>•</span>
              <span>NIT Campus, India</span>
              <span>•</span>
              <span>GitHub & LinkedIn</span>
            </p>
            <p className="resume-id text-[11px] text-brand-600 font-mono font-bold pt-1">
              SkillBridge Verified Portfolio ID: SKB-2026-NIT-{studentProfile.rollNo}
            </p>

            {/* Professional Summary / Bio */}
            {studentProfile.bio && (
              <div className="text-left pt-3">
                <h4 className="section-title font-extrabold uppercase text-[11px] tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
                  Professional Summary
                </h4>
                <p className="summary-text text-xs text-slate-700 leading-relaxed">
                  {studentProfile.bio}
                </p>
              </div>
            )}
          </div>

          {/* SECTION 2: VERIFIED TECHNICAL COMPETENCIES & ASSESSMENT REPORTS */}
          <div>
            <h4 className="section-title font-extrabold uppercase text-[11px] tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 flex items-center justify-between">
              <span>Verified Technical Competencies & Assessment Reports</span>
              <span className="text-[10px] text-emerald-700 font-semibold lowercase">crypto-verified</span>
            </h4>
            <div className="skills-grid grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
              {uniqueSkills.map(s => (
                <div key={s.id} className="skill-item flex justify-between items-center pr-2 py-0.5 border-b border-slate-100">
                  <span className="skill-name font-semibold text-slate-800">{s.name}:</span>
                  <span className="skill-score font-bold text-slate-900 flex items-center gap-1">
                    {s.score}%
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      s.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {s.verified ? 'Verified' : 'Self-assessed'}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: FEATURED SOFTWARE ENGINEERING PROJECTS */}
          <div>
            <h4 className="section-title font-extrabold uppercase text-[11px] tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
              Featured Software Engineering Projects
            </h4>
            <div className="space-y-3">
              {studentProfile.projects.map(p => (
                <div key={p.id} className="project-item">
                  <div className="project-header flex justify-between items-baseline font-bold text-slate-900">
                    <span className="text-xs">{p.title}</span>
                    <span className="project-tech font-mono text-[10px] text-slate-500 font-semibold">
                      {p.techStack.join(' • ')}
                    </span>
                  </div>
                  <p className="project-desc text-xs text-slate-700 leading-relaxed mt-0.5">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: EDUCATION & CERTIFICATIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <h4 className="section-title font-extrabold uppercase text-[11px] tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Academic Education
              </h4>
              <div className="space-y-1.5">
                {studentProfile.education.map((e, idx) => (
                  <div key={idx} className="edu-item flex justify-between text-xs">
                    <div>
                      <div className="edu-degree font-semibold text-slate-800">{e.degree}</div>
                      <div className="text-[10px] text-slate-500">{e.institution} ({e.year})</div>
                    </div>
                    <span className="edu-grade font-bold text-slate-900">{e.grade}</span>
                  </div>
                ))}
              </div>
            </div>

            {studentProfile.certifications.length > 0 && (
              <div>
                <h4 className="section-title font-extrabold uppercase text-[11px] tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                  Verified Certifications
                </h4>
                <div className="space-y-1.5">
                  {studentProfile.certifications.map(c => (
                    <div key={c.id} className="flex justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-800">{c.title}</div>
                        <div className="text-[10px] text-slate-500">{c.issuer} • {c.date}</div>
                      </div>
                      {c.verified && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded shrink-0">
                          Verified
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
