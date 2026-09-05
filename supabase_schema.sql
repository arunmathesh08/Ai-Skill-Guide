-- ==============================================================================
-- SkillBridge AI — Full Supabase Database Schema & Initial Data Seeder
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/zuqiowzprzbshjrywzkf/sql/new
-- ==============================================================================

-- 1. DROP EXISTING TABLES IF ANY (Clean Setup)
DROP TABLE IF EXISTS public.assessment_results CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.opportunities CASCADE;
DROP TABLE IF EXISTS public.assessments CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.partners CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. CREATE TABLES

-- PROFILES (Students, Industry, Faculty, Admin)
CREATE TABLE public.profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT DEFAULT 'password123',
    role TEXT NOT NULL CHECK (role IN ('student', 'industry', 'faculty', 'admin')),
    organization TEXT NOT NULL,
    title TEXT,
    avatar TEXT,
    roll_no TEXT,
    department TEXT,
    batch TEXT,
    cgpa TEXT,
    bio TEXT,
    location TEXT,
    specialization TEXT,
    career_readiness INTEGER DEFAULT 78,
    career_readiness_delta INTEGER DEFAULT 6,
    target_career_id TEXT DEFAULT 'cp-fullstack',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- VERIFIED SKILLS
CREATE TABLE public.skills (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    verified BOOLEAN DEFAULT false,
    last_assessed TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- OPPORTUNITIES (Jobs, Internships, Training)
CREATE TABLE public.opportunities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company_id TEXT,
    company_name TEXT NOT NULL,
    company_initials TEXT NOT NULL,
    company_location TEXT NOT NULL,
    company_color TEXT DEFAULT 'bg-brand-600',
    type TEXT NOT NULL CHECK (type IN ('internship', 'job', 'training')),
    is_remote BOOLEAN DEFAULT false,
    location TEXT NOT NULL,
    duration TEXT,
    stipend_salary TEXT NOT NULL,
    deadline TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    required_skills JSONB DEFAULT '[]'::jsonb,
    perks JSONB DEFAULT '[]'::jsonb,
    applicants_count INTEGER DEFAULT 0,
    posted_date TEXT DEFAULT 'Just now',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- APPLICATIONS
CREATE TABLE public.applications (
    id TEXT PRIMARY KEY,
    opportunity_id TEXT REFERENCES public.opportunities(id) ON DELETE CASCADE,
    opportunity_title TEXT NOT NULL,
    opportunity_type TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_initials TEXT NOT NULL,
    company_location TEXT NOT NULL,
    stipend_salary TEXT NOT NULL,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_college TEXT NOT NULL,
    applied_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected')),
    match_score INTEGER NOT NULL,
    matching_skills JSONB DEFAULT '[]'::jsonb,
    missing_skills JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ASSESSMENTS
CREATE TABLE public.assessments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    skill_category TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 15,
    total_questions INTEGER DEFAULT 5,
    badge TEXT NOT NULL,
    questions JSONB DEFAULT '[]'::jsonb
);

-- ASSESSMENT RESULTS
CREATE TABLE public.assessment_results (
    id TEXT PRIMARY KEY,
    assessment_id TEXT,
    student_id TEXT REFERENCES public.profiles(id),
    skill_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    time_spent_seconds INTEGER NOT NULL,
    question_results JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- COURSES
CREATE TABLE public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    duration TEXT NOT NULL,
    level TEXT NOT NULL,
    target_skill TEXT NOT NULL,
    rating NUMERIC(2,1) DEFAULT 4.9,
    students_enrolled INTEGER DEFAULT 0,
    thumbnail_gradient TEXT NOT NULL,
    description TEXT NOT NULL,
    match_reason TEXT,
    url TEXT DEFAULT '#'
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    time TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PARTNERS
CREATE TABLE public.partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    initials TEXT NOT NULL,
    color TEXT DEFAULT 'bg-brand-600',
    location TEXT NOT NULL,
    active_postings INTEGER DEFAULT 0,
    students_hired INTEGER DEFAULT 0,
    mou_title TEXT NOT NULL,
    mou_status TEXT NOT NULL,
    tier TEXT NOT NULL
);

-- 3. ENABLE ROW LEVEL SECURITY & PUBLIC POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Write Profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public Write Skills" ON public.skills FOR ALL USING (true);

CREATE POLICY "Public Read Opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Public Write Opportunities" ON public.opportunities FOR ALL USING (true);

CREATE POLICY "Public Read Applications" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Public Write Applications" ON public.applications FOR ALL USING (true);

CREATE POLICY "Public Read Assessments" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Public Write Assessments" ON public.assessments FOR ALL USING (true);

CREATE POLICY "Public Read Assessment Results" ON public.assessment_results FOR SELECT USING (true);
CREATE POLICY "Public Write Assessment Results" ON public.assessment_results FOR ALL USING (true);

CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public Write Courses" ON public.courses FOR ALL USING (true);

CREATE POLICY "Public Read Notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public Write Notifications" ON public.notifications FOR ALL USING (true);

CREATE POLICY "Public Read Partners" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Public Write Partners" ON public.partners FOR ALL USING (true);

-- 4. SEED INITIAL DATA

-- Profiles
INSERT INTO public.profiles (id, name, email, role, organization, title, avatar, roll_no, department, batch, cgpa, bio, career_readiness, career_readiness_delta, target_career_id)
VALUES
('usr-std-01', 'Aarav Sharma', 'aarav.sharma@institution.edu.in', 'student', 'National Institute of Technology (NIT)', 'B.Tech Computer Science (Final Year)', 'AS', '21CS8042', 'Computer Science & Engineering', '2022 - 2026', '8.84 / 10', 'Passionate aspiring full-stack engineer and open-source enthusiast with strong foundations in JavaScript, UI engineering, and API architectures.', 78, 6, 'cp-fullstack'),
('usr-ind-01', 'Priya Sen', 'priya.sen@technova.io', 'industry', 'TechNova Solutions', 'Head of University Talent Acquisition', 'PS', NULL, 'Talent Acquisition', NULL, NULL, 'Leading campus recruitment and corporate apprenticeships across tier-1 engineering institutions.', 95, 0, 'cp-fullstack'),
('usr-fac-01', 'Dr. Ramesh Kumar', 'ramesh.kumar@institution.edu.in', 'faculty', 'Department of Computer Science & Engineering', 'Professor & Placement Coordinator', 'RK', NULL, 'Computer Science & Engineering', NULL, NULL, 'Department placement coordinator focused on closing curriculum-industry competency gaps.', 90, 0, 'cp-fullstack'),
('usr-adm-01', 'Dr. Ananya Iyer', 'ananya.iyer@institution.edu.in', 'admin', 'Apex Technical University System', 'Dean of Industry Partnerships & Academic Strategy', 'AI', NULL, 'Executive Academic Council', NULL, NULL, 'Overseeing institutional accreditation, corporate MoUs, and university-wide placement velocity.', 92, 0, 'cp-fullstack')
ON CONFLICT (id) DO NOTHING;

-- Verified Skills
INSERT INTO public.skills (id, student_id, name, category, score, verified, last_assessed)
VALUES
('sk-js', 'usr-std-01', 'JavaScript', 'Frontend', 88, true, '2 days ago'),
('sk-html-css', 'usr-std-01', 'HTML5 & Modern CSS', 'Frontend', 92, true, '1 week ago'),
('sk-react', 'usr-std-01', 'React.js', 'Frontend', 58, true, '3 days ago'),
('sk-sql', 'usr-std-01', 'SQL & Database Design', 'Database', 67, true, '5 days ago'),
('sk-git', 'usr-std-01', 'Git & Version Control', 'DevOps & Cloud', 43, true, '1 week ago'),
('sk-node', 'usr-std-01', 'Node.js & Express', 'Backend', 72, true, '2 weeks ago'),
('sk-ts', 'usr-std-01', 'TypeScript', 'Frontend', 64, false, '1 month ago'),
('sk-dsa', 'usr-std-01', 'Data Structures & Algorithms', 'Core CS', 84, true, '3 weeks ago'),
('sk-comm', 'usr-std-01', 'Technical Communication', 'Soft Skills', 82, true, '1 month ago')
ON CONFLICT (id) DO NOTHING;

-- Opportunities
INSERT INTO public.opportunities (id, title, company_id, company_name, company_initials, company_location, company_color, type, is_remote, location, duration, stipend_salary, deadline, eligibility, description, responsibilities, required_skills, perks, applicants_count, posted_date)
VALUES
('opp-01', 'Frontend Developer Intern', 'cmp-01', 'TechNova Solutions', 'TN', 'Bengaluru, Karnataka (Hybrid)', 'bg-blue-600', 'internship', false, 'Bengaluru (Hybrid)', '6 Months (PPO Opportunity)', '₹35,000 / month', '15 Sep 2026', 'B.Tech/BE (CSE/IT/ECE) 2026 Batch, Min 7.5 CGPA', 'Join TechNova Solutions as a Frontend Developer Intern in our Core Cloud Platform group.', '["Implement reusable UI components in React and TypeScript", "Optimize Web Vitals (LCP, INP) across real-time data streaming widgets", "Collaborate with UX designers and backend engineers"]'::jsonb, '[{"skillName": "React.js", "minScore": 65}, {"skillName": "JavaScript", "minScore": 75}, {"skillName": "HTML5 & Modern CSS", "minScore": 75}, {"skillName": "Git & Version Control", "minScore": 50}]'::jsonb, '["Pre-Placement Offer (PPO) worth ₹14 LPA", "Flexible Hybrid Work Mode", "Mentorship from Principal Engineers"]'::jsonb, 42, '3 days ago'),
('opp-02', 'Full Stack Engineering Associate', 'cmp-02', 'CloudBridge Technologies', 'CB', 'Hyderabad, Telangana (Onsite)', 'bg-indigo-600', 'job', false, 'Hyderabad (Onsite)', NULL, '₹9.5L – ₹12.0L / year', '20 Sep 2026', 'Graduating 2026 / Recent Graduates (0-1 yr exp)', 'CloudBridge Technologies is looking for high-caliber Full Stack Engineers to build resilient distributed web applications.', '["Design REST and GraphQL microservice endpoints with high concurrency handling", "Construct stateful frontend applications utilizing modern React patterns", "Author complex SQL queries and database migrations"]'::jsonb, '[{"skillName": "React.js", "minScore": 70}, {"skillName": "JavaScript", "minScore": 75}, {"skillName": "Node.js & Express", "minScore": 65}, {"skillName": "SQL & Database Design", "minScore": 65}, {"skillName": "Git & Version Control", "minScore": 60}]'::jsonb, '["Health Insurance for Family", "Annual Performance Bonus", "Relocation Assistance"]'::jsonb, 78, '1 week ago'),
('opp-03', 'Data & Database Systems Intern', 'cmp-03', 'DataSphere Labs', 'DS', 'Pune / Remote', 'bg-emerald-600', 'internship', true, 'Pune / Remote', '4 Months', '₹28,000 / month', '10 Sep 2026', 'All Engineering & MCA Disciplines with Database Proficiency', 'DataSphere Labs is a leader in data pipeline automation. As an intern, you will help design relational data schemas.', '["Analyze and optimize SQL queries for enterprise data warehouses", "Assist in constructing automated data validation scripts and ETL pipelines"]'::jsonb, '[{"skillName": "SQL & Database Design", "minScore": 70}, {"skillName": "Data Structures & Algorithms", "minScore": 65}, {"skillName": "Technical Communication", "minScore": 60}]'::jsonb, '["100% Remote Work", "High Conversion Rate to Full-time", "Certifications Sponsorship"]'::jsonb, 31, '4 days ago'),
('opp-04', 'Software Development Engineer in Test (SDET)', 'cmp-04', 'InnoSoft Systems', 'IS', 'Noida / NCR', 'bg-violet-600', 'job', false, 'Noida / NCR', NULL, '₹8.0L – ₹10.5L / year', '28 Sep 2026', 'B.Tech/BE graduating in 2026, minimum 7.0 CGPA', 'InnoSoft Systems is expanding its quality automation engineering team with TypeScript and Node.js test frameworks.', '["Build end-to-end integration and API testing suites", "Integrate test harnesses into GitHub Actions CI/CD pipelines"]'::jsonb, '[{"skillName": "JavaScript", "minScore": 70}, {"skillName": "Node.js & Express", "minScore": 60}, {"skillName": "Git & Version Control", "minScore": 60}, {"skillName": "TypeScript", "minScore": 60}]'::jsonb, '["Quarterly Hackathons", "Stock Options (ESOPs)", "Free Meals"]'::jsonb, 54, '5 days ago'),
('opp-05', 'Cloud DevOps Trainee Program', 'cmp-05', 'NextGen Digital', 'ND', 'Chennai (Hybrid)', 'bg-sky-600', 'training', false, 'Chennai (Hybrid)', '3 Months Training + Guaranteed Placement', '₹22,000 / month', '05 Oct 2026', 'Pre-final and Final Year Students passionate about Cloud Infrastructure', 'An industry-sponsored 3-month intensive apprenticeship program covering AWS infrastructure, Docker, and Kubernetes.', '["Complete guided hands-on cloud labs and infrastructure as code projects", "Deploy containerized applications on AWS ECS and EKS"]'::jsonb, '[{"skillName": "Git & Version Control", "minScore": 65}, {"skillName": "Technical Communication", "minScore": 65}, {"skillName": "Data Structures & Algorithms", "minScore": 60}]'::jsonb, '["Guaranteed Job Offer (₹8.2 LPA)", "AWS Certified Exam Voucher", "Direct Mentorship"]'::jsonb, 65, '2 days ago')
ON CONFLICT (id) DO NOTHING;

-- Applications
INSERT INTO public.applications (id, opportunity_id, opportunity_title, opportunity_type, company_name, company_initials, company_location, stipend_salary, student_id, student_name, student_email, student_college, applied_date, status, match_score, matching_skills, missing_skills, notes)
VALUES
('app-01', 'opp-01', 'Frontend Developer Intern', 'internship', 'TechNova Solutions', 'TN', 'Bengaluru (Hybrid)', '₹35,000 / month', 'usr-std-01', 'Aarav Sharma', 'aarav.sharma@institution.edu.in', 'National Institute of Technology (NIT)', '24 Aug 2026', 'Shortlisted', 89, '["JavaScript (88%)", "HTML5 & Modern CSS (92%)"]'::jsonb, '["React.js (58% vs 65% req)", "Git & Version Control (43% vs 50% req)"]'::jsonb, 'Technical portfolio reviewed by Engineering Manager. Round 1 Technical scheduled for Aug 29.'),
('app-02', 'opp-02', 'Full Stack Engineering Associate', 'job', 'CloudBridge Technologies', 'CB', 'Hyderabad (Onsite)', '₹9.5L – ₹12.0L / year', 'usr-std-01', 'Aarav Sharma', 'aarav.sharma@institution.edu.in', 'National Institute of Technology (NIT)', '21 Aug 2026', 'Under Review', 84, '["JavaScript (88%)", "Node.js & Express (72%)", "SQL & Database Design (67%)"]'::jsonb, '["React.js (58% vs 70% req)", "Git & Version Control (43% vs 60% req)"]'::jsonb, 'Application undergoing resume & verified skill score verification.'),
('app-03', 'opp-03', 'Data & Database Systems Intern', 'internship', 'DataSphere Labs', 'DS', 'Pune / Remote', '₹28,000 / month', 'usr-std-01', 'Aarav Sharma', 'aarav.sharma@institution.edu.in', 'National Institute of Technology (NIT)', '15 Aug 2026', 'Interview', 91, '["SQL & Database Design (67%)", "Data Structures & Algorithms (84%)", "Technical Communication (82%)"]'::jsonb, '[]'::jsonb, 'Passed initial screening test with 94% score. Managerial discussion scheduled.')
ON CONFLICT (id) DO NOTHING;

-- Courses
INSERT INTO public.courses (id, title, provider, duration, level, target_skill, rating, students_enrolled, thumbnail_gradient, description, match_reason, url)
VALUES
('crs-01', 'React 19 & Next.js: Component Mastery & State Optimization', 'Industry Tech Academy', '14 hours • 28 lessons', 'Intermediate', 'React.js', 4.9, 3420, 'from-blue-600 to-cyan-500', 'Bridge your React proficiency gap. Master hooks under the hood, server components, and reconciliation.', 'Targeted to boost your React score from 58% to 75%+', '#'),
('crs-02', 'Mastering SQL: Indexes, Query Optimization & Schema Architecture', 'DataSphere Engineering', '10 hours • 20 lessons', 'Intermediate', 'SQL & Database Design', 4.8, 2890, 'from-emerald-600 to-teal-500', 'Go beyond basic SELECT queries. Master EXPLAIN ANALYZE, B-tree indexes, CTEs, and ACID compliance.', 'Required for Full Stack & Backend career requirements', '#'),
('crs-03', 'Professional Git & GitHub: Branching Strategies & Merge Conflict Resolution', 'DevOps Guild', '6 hours • 12 lessons', 'Beginner', 'Git & Version Control', 4.9, 4120, 'from-amber-600 to-orange-500', 'Unlock enterprise-grade version control skills: interactive rebasing, cherry-picking, and Git hooks.', 'Critical gap: Increase your Git score from 43% to 65%+', '#'),
('crs-04', 'TypeScript for Enterprise React Development', 'Frontend Masters Hub', '12 hours • 24 lessons', 'Intermediate', 'TypeScript', 4.9, 2150, 'from-indigo-600 to-blue-500', 'Generics, union types, conditional types, and typing complex React hooks & stores.', 'High demand in TechNova Solutions and CloudBridge job descriptions', '#')
ON CONFLICT (id) DO NOTHING;

-- Partners
INSERT INTO public.partners (id, name, initials, color, location, active_postings, students_hired, mou_title, mou_status, tier)
VALUES
('p-1', 'TechNova Solutions', 'TN', 'bg-blue-600', 'Bengaluru, Karnataka', 4, 42, 'Strategic Center of Excellence in Full Stack & Cloud', 'Active (2025-2028)', 'Platinum Tier Partner'),
('p-2', 'CloudBridge Technologies', 'CB', 'bg-indigo-600', 'Hyderabad, Telangana', 2, 28, 'Corporate Apprenticeship & Direct PPO Pathway', 'Active (2024-2027)', 'Gold Tier Partner'),
('p-3', 'DataSphere Labs', 'DS', 'bg-emerald-600', 'Pune, Maharashtra', 3, 19, 'Advanced Relational Database & Pipeline Engineering Lab', 'Active (2025-2027)', 'Gold Tier Partner'),
('p-4', 'InnoSoft Systems', 'IS', 'bg-violet-600', 'Noida, NCR', 2, 15, 'Software Quality Automation & SDET Training', 'Active (2025-2026)', 'Silver Tier Partner'),
('p-5', 'NextGen Digital', 'ND', 'bg-sky-600', 'Chennai, Tamil Nadu', 1, 24, 'Cloud DevOps & AWS Infrastructure Apprenticeship', 'Active (2024-2027)', 'Gold Tier Partner')
ON CONFLICT (id) DO NOTHING;
