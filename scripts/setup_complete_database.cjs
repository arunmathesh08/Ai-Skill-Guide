const { Client } = require('pg');

const config = {
  user: 'postgres.zuqiowzprzbshjrywzkf',
  password: 'Arun@6844123',
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
};

async function setup() {
  console.log('🚀 Connecting to Supabase PostgreSQL (zuqiowzprzbshjrywzkf)...');
  const client = new Client(config);

  try {
    await client.connect();
    console.log('✅ Connected successfully to postgres.zuqiowzprzbshjrywzkf!');

    // 1. Create Tables
    console.log('📦 Creating database tables...');
    await client.query(`
      DROP TABLE IF EXISTS public.assessment_results CASCADE;
      DROP TABLE IF EXISTS public.applications CASCADE;
      DROP TABLE IF EXISTS public.skills CASCADE;
      DROP TABLE IF EXISTS public.opportunities CASCADE;
      DROP TABLE IF EXISTS public.assessments CASCADE;
      DROP TABLE IF EXISTS public.courses CASCADE;
      DROP TABLE IF EXISTS public.notifications CASCADE;
      DROP TABLE IF EXISTS public.partners CASCADE;
      DROP TABLE IF EXISTS public.career_paths CASCADE;
      DROP TABLE IF EXISTS public.profiles CASCADE;

      -- PROFILES
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

      -- OPPORTUNITIES
      CREATE TABLE public.opportunities (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          company_id TEXT,
          company_name TEXT NOT NULL,
          company_initials TEXT NOT NULL,
          company_location TEXT NOT NULL,
          company_color TEXT DEFAULT 'bg-blue-600',
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
          questions JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- ASSESSMENT RESULTS
      CREATE TABLE public.assessment_results (
          id TEXT PRIMARY KEY,
          assessment_id TEXT,
          student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
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
          url TEXT DEFAULT '#',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
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
          color TEXT DEFAULT 'bg-blue-600',
          location TEXT NOT NULL,
          active_postings INTEGER DEFAULT 0,
          students_hired INTEGER DEFAULT 0,
          mou_title TEXT NOT NULL,
          mou_status TEXT NOT NULL,
          tier TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- CAREER PATHS
      CREATE TABLE public.career_paths (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          demand TEXT NOT NULL,
          median_salary TEXT NOT NULL,
          growth_rate TEXT NOT NULL,
          description TEXT NOT NULL,
          required_skills JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- ROW LEVEL SECURITY & POLICIES
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "Public Profiles All" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY "Public Skills All" ON public.skills FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY "Public Opportunities All" ON public.opportunities FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY "Public Applications All" ON public.applications FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY "Public Assessments All" ON public.assessments FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY "Public Assessment Results All" ON public.assessment_results FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY "Public Courses All" ON public.courses FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY "Public Notifications All" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY "Public Partners All" ON public.partners FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY "Public Career Paths All" ON public.career_paths FOR ALL USING (true) WITH CHECK (true);

      -- GRANT PERMISSIONS TO anon AND authenticated
      GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
      GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
      GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
      GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
    `);
    console.log('✅ Tables, schemas, and permissions configured successfully!');

    // 2. Seed Profiles
    console.log('🌱 Seeding Profiles...');
    const profiles = [
      {
        id: 'usr-std-01',
        name: 'Aarav Sharma',
        username: 'aarav.sharma',
        email: 'aarav.sharma@institution.edu.in',
        password: 'password123',
        role: 'student',
        organization: 'National Institute of Technology (NIT)',
        title: 'B.Tech Computer Science (Final Year)',
        avatar: 'AS',
        roll_no: '21CS8042',
        department: 'Computer Science & Engineering',
        batch: '2022 - 2026',
        cgpa: '8.84 / 10',
        bio: 'Passionate aspiring full-stack engineer and open-source enthusiast with strong foundations in JavaScript, UI engineering, and API architectures. Actively building scalable web systems and seeking high-impact software engineering roles.',
        location: 'Bengaluru, India',
        specialization: 'Full Stack Web & Distributed Systems',
        career_readiness: 78,
        career_readiness_delta: 6,
        target_career_id: 'cp-fullstack'
      },
      {
        id: 'usr-std-02',
        name: 'Rohan Verma',
        username: 'rohan.verma',
        email: 'rohan.verma@institution.edu.in',
        password: 'password123',
        role: 'student',
        organization: 'National Institute of Technology (NIT)',
        title: 'B.Tech Computer Science',
        avatar: 'RV',
        roll_no: '21CS8015',
        department: 'Computer Science & Engineering',
        batch: '2022 - 2026',
        cgpa: '9.12 / 10',
        bio: 'Frontend enthusiast and open-source contributor specializing in React, TypeScript, and micro-frontend architectures.',
        location: 'Chennai, India',
        specialization: 'Frontend & UI Engineering',
        career_readiness: 91,
        career_readiness_delta: 4,
        target_career_id: 'cp-frontend'
      },
      {
        id: 'usr-std-03',
        name: 'Ananya Gupta',
        username: 'ananya.gupta',
        email: 'ananya.gupta@institution.edu.in',
        password: 'password123',
        role: 'student',
        organization: 'National Institute of Technology (NIT)',
        title: 'B.Tech Information Technology',
        avatar: 'AG',
        roll_no: '21IT7022',
        department: 'Information Technology',
        batch: '2022 - 2026',
        cgpa: '8.76 / 10',
        bio: 'Data engineer and backend builder exploring relational database indexing, distributed queues, and FastAPI microservices.',
        location: 'Hyderabad, India',
        specialization: 'Database Systems & Data Pipelines',
        career_readiness: 85,
        career_readiness_delta: 8,
        target_career_id: 'cp-data'
      },
      {
        id: 'usr-ind-01',
        name: 'Priya Sen',
        username: 'priya.sen',
        email: 'priya.sen@technova.io',
        password: 'password123',
        role: 'industry',
        organization: 'TechNova Solutions',
        title: 'Head of University Talent Acquisition',
        avatar: 'PS',
        roll_no: null,
        department: 'Talent Acquisition',
        batch: null,
        cgpa: null,
        bio: 'Leading campus recruitment and corporate apprenticeships across tier-1 engineering institutions.',
        location: 'Bengaluru, India',
        specialization: 'Campus Talent & Tech Hiring',
        career_readiness: 95,
        career_readiness_delta: 0,
        target_career_id: 'cp-fullstack'
      },
      {
        id: 'usr-fac-01',
        name: 'Dr. Ramesh Kumar',
        username: 'ramesh.kumar',
        email: 'ramesh.kumar@institution.edu.in',
        password: 'password123',
        role: 'faculty',
        organization: 'Department of Computer Science & Engineering',
        title: 'Professor & Placement Coordinator',
        avatar: 'RK',
        roll_no: null,
        department: 'Computer Science & Engineering',
        batch: null,
        cgpa: null,
        bio: 'Department placement coordinator focused on closing curriculum-industry competency gaps.',
        location: 'Tiruchirappalli, India',
        specialization: 'Systems Software & Industry Alliances',
        career_readiness: 90,
        career_readiness_delta: 0,
        target_career_id: 'cp-fullstack'
      },
      {
        id: 'usr-adm-01',
        name: 'Dr. Ananya Iyer',
        username: 'ananya.iyer',
        email: 'ananya.iyer@institution.edu.in',
        password: 'password123',
        role: 'admin',
        organization: 'Apex Technical University System',
        title: 'Dean of Industry Partnerships & Academic Strategy',
        avatar: 'AI',
        roll_no: null,
        department: 'Executive Academic Council',
        batch: null,
        cgpa: null,
        bio: 'Overseeing institutional accreditation, corporate MoUs, and university-wide placement velocity.',
        location: 'New Delhi, India',
        specialization: 'University Accreditation & Strategy',
        career_readiness: 92,
        career_readiness_delta: 0,
        target_career_id: 'cp-fullstack'
      }
    ];

    for (const p of profiles) {
      await client.query(`
        INSERT INTO public.profiles (id, name, username, email, password, role, organization, title, avatar, roll_no, department, batch, cgpa, bio, location, specialization, career_readiness, career_readiness_delta, target_career_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          username = EXCLUDED.username,
          password = EXCLUDED.password,
          career_readiness = EXCLUDED.career_readiness;
      `, [p.id, p.name, p.username, p.email, p.password, p.role, p.organization, p.title, p.avatar, p.roll_no, p.department, p.batch, p.cgpa, p.bio, p.location, p.specialization, p.career_readiness, p.career_readiness_delta, p.target_career_id]);
    }
    console.log(`✅ Seeded ${profiles.length} profiles.`);

    // 3. Seed Skills
    console.log('🌱 Seeding Skills...');
    const skills = [
      { id: 'sk-js', student_id: 'usr-std-01', name: 'JavaScript', category: 'Frontend', score: 88, verified: true, last_assessed: '2 days ago' },
      { id: 'sk-html-css', student_id: 'usr-std-01', name: 'HTML5 & Modern CSS', category: 'Frontend', score: 92, verified: true, last_assessed: '1 week ago' },
      { id: 'sk-react', student_id: 'usr-std-01', name: 'React.js', category: 'Frontend', score: 58, verified: true, last_assessed: '3 days ago' },
      { id: 'sk-sql', student_id: 'usr-std-01', name: 'SQL & Database Design', category: 'Database', score: 67, verified: true, last_assessed: '5 days ago' },
      { id: 'sk-git', student_id: 'usr-std-01', name: 'Git & Version Control', category: 'DevOps & Cloud', score: 43, verified: true, last_assessed: '1 week ago' },
      { id: 'sk-node', student_id: 'usr-std-01', name: 'Node.js & Express', category: 'Backend', score: 72, verified: true, last_assessed: '2 weeks ago' },
      { id: 'sk-ts', student_id: 'usr-std-01', name: 'TypeScript', category: 'Frontend', score: 64, verified: false, last_assessed: '1 month ago' },
      { id: 'sk-dsa', student_id: 'usr-std-01', name: 'Data Structures & Algorithms', category: 'Core CS', score: 84, verified: true, last_assessed: '3 weeks ago' },
      { id: 'sk-comm', student_id: 'usr-std-01', name: 'Technical Communication', category: 'Soft Skills', score: 82, verified: true, last_assessed: '1 month ago' },
      
      // Skills for student 02
      { id: 'sk-r2-react', student_id: 'usr-std-02', name: 'React.js', category: 'Frontend', score: 92, verified: true, last_assessed: 'Yesterday' },
      { id: 'sk-r2-js', student_id: 'usr-std-02', name: 'JavaScript', category: 'Frontend', score: 95, verified: true, last_assessed: '3 days ago' },
      { id: 'sk-r2-ts', student_id: 'usr-std-02', name: 'TypeScript', category: 'Frontend', score: 86, verified: true, last_assessed: '1 week ago' }
    ];

    for (const s of skills) {
      await client.query(`
        INSERT INTO public.skills (id, student_id, name, category, score, verified, last_assessed)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, verified = EXCLUDED.verified;
      `, [s.id, s.student_id, s.name, s.category, s.score, s.verified, s.last_assessed]);
    }
    console.log(`✅ Seeded ${skills.length} skills.`);

    // 4. Seed Opportunities
    console.log('🌱 Seeding Opportunities...');
    const opportunities = [
      {
        id: 'opp-01',
        title: 'Frontend Developer Intern',
        company_id: 'cmp-01',
        company_name: 'TechNova Solutions',
        company_initials: 'TN',
        company_location: 'Bengaluru, Karnataka (Hybrid)',
        company_color: 'bg-blue-600',
        type: 'internship',
        is_remote: false,
        location: 'Bengaluru (Hybrid)',
        duration: '6 Months (PPO Opportunity)',
        stipend_salary: '₹35,000 / month',
        deadline: '15 Sep 2026',
        eligibility: 'B.Tech/BE (CSE/IT/ECE) 2026 Batch, Min 7.5 CGPA',
        description: 'Join TechNova Solutions as a Frontend Developer Intern in our Core Cloud Platform group. You will collaborate with senior architects to craft modular, high-performance UI components.',
        responsibilities: JSON.stringify([
          'Implement reusable UI components in React and TypeScript following our strict design system.',
          'Optimize Web Vitals (LCP, INP) across real-time data streaming widgets.',
          'Collaborate with UX designers and backend engineers in agile two-week sprints.',
          'Write end-to-end component tests and maintain comprehensive documentation.'
        ]),
        required_skills: JSON.stringify([
          { skillName: 'React.js', minScore: 65 },
          { skillName: 'JavaScript', minScore: 75 },
          { skillName: 'HTML5 & Modern CSS', minScore: 75 },
          { skillName: 'Git & Version Control', minScore: 50 }
        ]),
        perks: JSON.stringify(['Pre-Placement Offer (PPO) worth ₹14 LPA', 'Flexible Hybrid Work Mode', 'Mentorship from Principal Engineers']),
        applicants_count: 42,
        posted_date: '3 days ago'
      },
      {
        id: 'opp-02',
        title: 'Full Stack Engineering Associate',
        company_id: 'cmp-02',
        company_name: 'CloudBridge Technologies',
        company_initials: 'CB',
        company_location: 'Hyderabad, Telangana (Onsite)',
        company_color: 'bg-indigo-600',
        type: 'job',
        is_remote: false,
        location: 'Hyderabad (Onsite)',
        duration: null,
        stipend_salary: '₹9.5L – ₹12.0L / year',
        deadline: '20 Sep 2026',
        eligibility: 'Graduating 2026 / Recent Graduates (0-1 yr exp)',
        description: 'CloudBridge Technologies is looking for high-caliber Full Stack Engineers to build resilient distributed web applications with Node.js and PostgreSQL.',
        responsibilities: JSON.stringify([
          'Design REST and GraphQL microservice endpoints with high concurrency handling.',
          'Construct stateful frontend applications utilizing modern React patterns.',
          'Author complex SQL queries, database migrations, and caching layers with Redis.'
        ]),
        required_skills: JSON.stringify([
          { skillName: 'React.js', minScore: 70 },
          { skillName: 'JavaScript', minScore: 75 },
          { skillName: 'Node.js & Express', minScore: 65 },
          { skillName: 'SQL & Database Design', minScore: 65 },
          { skillName: 'Git & Version Control', minScore: 60 }
        ]),
        perks: JSON.stringify(['Health Insurance for Family', 'Annual Performance Bonus', 'Relocation Assistance']),
        applicants_count: 78,
        posted_date: '1 week ago'
      },
      {
        id: 'opp-03',
        title: 'Data & Database Systems Intern',
        company_id: 'cmp-03',
        company_name: 'DataSphere Labs',
        company_initials: 'DS',
        company_location: 'Pune / Remote',
        company_color: 'bg-emerald-600',
        type: 'internship',
        is_remote: true,
        location: 'Pune / Remote',
        duration: '4 Months',
        stipend_salary: '₹28,000 / month',
        deadline: '10 Sep 2026',
        eligibility: 'All Engineering & MCA Disciplines with Database Proficiency',
        description: 'DataSphere Labs is a leader in data pipeline automation. As an intern, you will help design relational data schemas and perform query optimizations.',
        responsibilities: JSON.stringify([
          'Analyze and optimize SQL queries for enterprise data warehouses.',
          'Assist in constructing automated data validation scripts and ETL pipelines.'
        ]),
        required_skills: JSON.stringify([
          { skillName: 'SQL & Database Design', minScore: 70 },
          { skillName: 'Data Structures & Algorithms', minScore: 65 },
          { skillName: 'Technical Communication', minScore: 60 }
        ]),
        perks: JSON.stringify(['100% Remote Work', 'High Conversion Rate to Full-time', 'Certifications Sponsorship']),
        applicants_count: 31,
        posted_date: '4 days ago'
      },
      {
        id: 'opp-04',
        title: 'Software Development Engineer in Test (SDET)',
        company_id: 'cmp-04',
        company_name: 'InnoSoft Systems',
        company_initials: 'IS',
        company_location: 'Noida / NCR',
        company_color: 'bg-violet-600',
        type: 'job',
        is_remote: false,
        location: 'Noida / NCR',
        duration: null,
        stipend_salary: '₹8.0L – ₹10.5L / year',
        deadline: '28 Sep 2026',
        eligibility: 'B.Tech/BE graduating in 2026, minimum 7.0 CGPA',
        description: 'InnoSoft Systems is expanding its quality automation engineering team with TypeScript and Node.js test frameworks.',
        responsibilities: JSON.stringify([
          'Build end-to-end integration and API testing suites.',
          'Integrate test harnesses into GitHub Actions CI/CD pipelines.'
        ]),
        required_skills: JSON.stringify([
          { skillName: 'JavaScript', minScore: 70 },
          { skillName: 'Node.js & Express', minScore: 60 },
          { skillName: 'Git & Version Control', minScore: 60 },
          { skillName: 'TypeScript', minScore: 60 }
        ]),
        perks: JSON.stringify(['Quarterly Hackathons', 'Stock Options (ESOPs)', 'Free Shuttle Service & Meals']),
        applicants_count: 54,
        posted_date: '5 days ago'
      },
      {
        id: 'opp-05',
        title: 'Cloud DevOps Trainee Program',
        company_id: 'cmp-05',
        company_name: 'NextGen Digital',
        company_initials: 'ND',
        company_location: 'Chennai (Hybrid)',
        company_color: 'bg-sky-600',
        type: 'training',
        is_remote: false,
        location: 'Chennai (Hybrid)',
        duration: '3 Months Training + Guaranteed Placement',
        stipend_salary: '₹22,000 / month',
        deadline: '05 Oct 2026',
        eligibility: 'Pre-final and Final Year Students passionate about Cloud Infrastructure',
        description: 'An industry-sponsored 3-month intensive apprenticeship program covering AWS infrastructure, Docker, and Kubernetes.',
        responsibilities: JSON.stringify([
          'Complete guided hands-on cloud labs and infrastructure as code projects.',
          'Deploy containerized applications on AWS ECS and EKS.'
        ]),
        required_skills: JSON.stringify([
          { skillName: 'Git & Version Control', minScore: 65 },
          { skillName: 'Technical Communication', minScore: 65 },
          { skillName: 'Data Structures & Algorithms', minScore: 60 }
        ]),
        perks: JSON.stringify(['Guaranteed Job Offer (₹8.2 LPA)', 'AWS Certified Exam Voucher', 'Direct Executive Mentorship']),
        applicants_count: 65,
        posted_date: '2 days ago'
      }
    ];

    for (const o of opportunities) {
      await client.query(`
        INSERT INTO public.opportunities (id, title, company_id, company_name, company_initials, company_location, company_color, type, is_remote, location, duration, stipend_salary, deadline, eligibility, description, responsibilities, required_skills, perks, applicants_count, posted_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        ON CONFLICT (id) DO UPDATE SET applicants_count = EXCLUDED.applicants_count;
      `, [o.id, o.title, o.company_id, o.company_name, o.company_initials, o.company_location, o.company_color, o.type, o.is_remote, o.location, o.duration, o.stipend_salary, o.deadline, o.eligibility, o.description, o.responsibilities, o.required_skills, o.perks, o.applicants_count, o.posted_date]);
    }
    console.log(`✅ Seeded ${opportunities.length} opportunities.`);

    // 5. Seed Applications
    console.log('🌱 Seeding Applications...');
    const applications = [
      {
        id: 'app-01',
        opportunity_id: 'opp-01',
        opportunity_title: 'Frontend Developer Intern',
        opportunity_type: 'internship',
        company_name: 'TechNova Solutions',
        company_initials: 'TN',
        company_location: 'Bengaluru (Hybrid)',
        stipend_salary: '₹35,000 / month',
        student_id: 'usr-std-01',
        student_name: 'Aarav Sharma',
        student_email: 'aarav.sharma@institution.edu.in',
        student_college: 'National Institute of Technology (NIT)',
        applied_date: '24 Aug 2026',
        status: 'Shortlisted',
        match_score: 89,
        matching_skills: JSON.stringify(['JavaScript (88%)', 'HTML5 & Modern CSS (92%)']),
        missing_skills: JSON.stringify(['React.js (58% vs 65% req)', 'Git & Version Control (43% vs 50% req)']),
        notes: 'Technical portfolio reviewed by Engineering Manager. Round 1 Technical scheduled for Aug 29.'
      },
      {
        id: 'app-02',
        opportunity_id: 'opp-02',
        opportunity_title: 'Full Stack Engineering Associate',
        opportunity_type: 'job',
        company_name: 'CloudBridge Technologies',
        company_initials: 'CB',
        company_location: 'Hyderabad (Onsite)',
        stipend_salary: '₹9.5L – ₹12.0L / year',
        student_id: 'usr-std-01',
        student_name: 'Aarav Sharma',
        student_email: 'aarav.sharma@institution.edu.in',
        student_college: 'National Institute of Technology (NIT)',
        applied_date: '21 Aug 2026',
        status: 'Under Review',
        match_score: 84,
        matching_skills: JSON.stringify(['JavaScript (88%)', 'Node.js & Express (72%)', 'SQL & Database Design (67%)']),
        missing_skills: JSON.stringify(['React.js (58% vs 70% req)', 'Git & Version Control (43% vs 60% req)']),
        notes: 'Application undergoing resume & verified skill score verification.'
      },
      {
        id: 'app-03',
        opportunity_id: 'opp-03',
        opportunity_title: 'Data & Database Systems Intern',
        opportunity_type: 'internship',
        company_name: 'DataSphere Labs',
        company_initials: 'DS',
        company_location: 'Pune / Remote',
        stipend_salary: '₹28,000 / month',
        student_id: 'usr-std-01',
        student_name: 'Aarav Sharma',
        student_email: 'aarav.sharma@institution.edu.in',
        student_college: 'National Institute of Technology (NIT)',
        applied_date: '15 Aug 2026',
        status: 'Interview',
        match_score: 91,
        matching_skills: JSON.stringify(['SQL & Database Design (67%)', 'Data Structures & Algorithms (84%)', 'Technical Communication (82%)']),
        missing_skills: JSON.stringify([]),
        notes: 'Passed initial screening test with 94% score. Managerial discussion scheduled.'
      }
    ];

    for (const a of applications) {
      await client.query(`
        INSERT INTO public.applications (id, opportunity_id, opportunity_title, opportunity_type, company_name, company_initials, company_location, stipend_salary, student_id, student_name, student_email, student_college, applied_date, status, match_score, matching_skills, missing_skills, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;
      `, [a.id, a.opportunity_id, a.opportunity_title, a.opportunity_type, a.company_name, a.company_initials, a.company_location, a.stipend_salary, a.student_id, a.student_name, a.student_email, a.student_college, a.applied_date, a.status, a.match_score, a.matching_skills, a.missing_skills, a.notes]);
    }
    console.log(`✅ Seeded ${applications.length} applications.`);

    // 6. Seed Courses
    console.log('🌱 Seeding Courses...');
    const courses = [
      {
        id: 'crs-01',
        title: 'React 19 & Next.js: Component Mastery & State Optimization',
        provider: 'Industry Tech Academy',
        duration: '14 hours • 28 lessons',
        level: 'Intermediate',
        target_skill: 'React.js',
        rating: 4.9,
        students_enrolled: 3420,
        thumbnail_gradient: 'from-blue-600 to-cyan-500',
        description: 'Bridge your React proficiency gap. Master hooks under the hood, server components, reconciliation, and memoization.',
        match_reason: 'Targeted to boost your React score from 58% to 75%+',
        url: '#'
      },
      {
        id: 'crs-02',
        title: 'Mastering SQL: Indexes, Query Optimization & Schema Architecture',
        provider: 'DataSphere Engineering',
        duration: '10 hours • 20 lessons',
        level: 'Intermediate',
        target_skill: 'SQL & Database Design',
        rating: 4.8,
        students_enrolled: 2890,
        thumbnail_gradient: 'from-emerald-600 to-teal-500',
        description: 'Go beyond basic SELECT queries. Master EXPLAIN ANALYZE, B-tree indexes, CTEs, transactions, and ACID compliance.',
        match_reason: 'Required for Full Stack & Backend career requirements (Current 67% → Target 75%)',
        url: '#'
      },
      {
        id: 'crs-03',
        title: 'Professional Git & GitHub: Branching Strategies & Merge Conflict Resolution',
        provider: 'DevOps Guild',
        duration: '6 hours • 12 lessons',
        level: 'Beginner',
        target_skill: 'Git & Version Control',
        rating: 4.9,
        students_enrolled: 4120,
        thumbnail_gradient: 'from-amber-600 to-orange-500',
        description: 'Unlock enterprise-grade version control skills: interactive rebasing, cherry-picking, and Git hooks.',
        match_reason: 'Critical gap: Increase your Git score from 43% to 65%+',
        url: '#'
      },
      {
        id: 'crs-04',
        title: 'TypeScript for Enterprise React Development',
        provider: 'Frontend Masters Hub',
        duration: '12 hours • 24 lessons',
        level: 'Intermediate',
        target_skill: 'TypeScript',
        rating: 4.9,
        students_enrolled: 2150,
        thumbnail_gradient: 'from-indigo-600 to-blue-500',
        description: 'Generics, union types, conditional types, and typing complex React hooks & stores.',
        match_reason: 'High demand in TechNova Solutions and CloudBridge job descriptions',
        url: '#'
      }
    ];

    for (const c of courses) {
      await client.query(`
        INSERT INTO public.courses (id, title, provider, duration, level, target_skill, rating, students_enrolled, thumbnail_gradient, description, match_reason, url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET rating = EXCLUDED.rating;
      `, [c.id, c.title, c.provider, c.duration, c.level, c.target_skill, c.rating, c.students_enrolled, c.thumbnail_gradient, c.description, c.match_reason, c.url]);
    }
    console.log(`✅ Seeded ${courses.length} courses.`);

    // 7. Seed Corporate Partners
    console.log('🌱 Seeding Partners...');
    const partners = [
      { id: 'p-1', name: 'TechNova Solutions', initials: 'TN', color: 'bg-blue-600', location: 'Bengaluru, Karnataka', active_postings: 4, students_hired: 42, mou_title: 'Strategic Center of Excellence in Full Stack & Cloud', mou_status: 'Active (2025-2028)', tier: 'Platinum Tier Partner' },
      { id: 'p-2', name: 'CloudBridge Technologies', initials: 'CB', color: 'bg-indigo-600', location: 'Hyderabad, Telangana', active_postings: 2, students_hired: 28, mou_title: 'Corporate Apprenticeship & Direct PPO Pathway', mou_status: 'Active (2024-2027)', tier: 'Gold Tier Partner' },
      { id: 'p-3', name: 'DataSphere Labs', initials: 'DS', color: 'bg-emerald-600', location: 'Pune, Maharashtra', active_postings: 3, students_hired: 19, mou_title: 'Advanced Relational Database & Pipeline Engineering Lab', mou_status: 'Active (2025-2027)', tier: 'Gold Tier Partner' },
      { id: 'p-4', name: 'InnoSoft Systems', initials: 'IS', color: 'bg-violet-600', location: 'Noida, NCR', active_postings: 2, students_hired: 15, mou_title: 'Software Quality Automation & SDET Training', mou_status: 'Active (2025-2026)', tier: 'Silver Tier Partner' },
      { id: 'p-5', name: 'NextGen Digital', initials: 'ND', color: 'bg-sky-600', location: 'Chennai, Tamil Nadu', active_postings: 1, students_hired: 24, mou_title: 'Cloud DevOps & AWS Infrastructure Apprenticeship', mou_status: 'Active (2024-2027)', tier: 'Gold Tier Partner' }
    ];

    for (const part of partners) {
      await client.query(`
        INSERT INTO public.partners (id, name, initials, color, location, active_postings, students_hired, mou_title, mou_status, tier)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET active_postings = EXCLUDED.active_postings;
      `, [part.id, part.name, part.initials, part.color, part.location, part.active_postings, part.students_hired, part.mou_title, part.mou_status, part.tier]);
    }
    console.log(`✅ Seeded ${partners.length} partners.`);

    // 8. Seed Assessments
    console.log('🌱 Seeding Assessments...');
    const assessments = [
      {
        id: 'asm-react',
        title: 'React 19 & Modern Web Architecture Assessment',
        skill_category: 'Frontend Engineering',
        description: 'Validate your proficiency in React component lifecycle, Hooks patterns, Concurrent Mode, Virtual DOM reconciliation, and performance optimization.',
        duration_minutes: 20,
        total_questions: 5,
        badge: 'React Verified Specialist',
        questions: JSON.stringify([
          {
            id: 'q-r1',
            question: 'What is the primary benefit of the `useId` hook in React 18+?',
            options: [
              'Generates unique crypto-secure random UUIDs for database primary keys.',
              'Generates stable, unique IDs across client and server renders to prevent hydration mismatch bugs in accessible form inputs.',
              'Increases rendering speed by indexing DOM nodes in GPU memory.',
              'Caches React component subtrees between router transitions.'
            ],
            correctOptionIndex: 1,
            explanation: 'useId generates stable IDs that are identical during server-side rendering and client hydration, crucial for ARIA attributes and form labels.',
            skill: 'React.js',
            difficulty: 'intermediate'
          },
          {
            id: 'q-r2',
            question: 'Why should you avoid using array index keys when rendering dynamic lists in React?',
            options: [
              'Index keys trigger infinite re-renders during state updates.',
              'React does not allow numeric keys in JSX.',
              'When items are reordered, inserted, or deleted, index keys can cause incorrect component state retention and unnecessary DOM re-creations.',
              'Index keys disable garbage collection for unmounted DOM nodes.'
            ],
            correctOptionIndex: 2,
            explanation: 'Keys help React identify which items have changed, been added, or been removed. Using indices as keys can cause unexpected visual bugs and poor performance if items reorder.',
            skill: 'React.js',
            difficulty: 'beginner'
          },
          {
            id: 'q-r3',
            question: 'What happens when you pass a function to a React state setter like setCount(prev => prev + 1) instead of setCount(count + 1)?',
            options: [
              'It executes the state update immediately in the current call stack without batching.',
              'It guarantees access to the most up-to-date pending state value even inside closures or asynchronous callbacks.',
              'It prevents child components from re-rendering.',
              'It automatically converts the state variable into a persistent localStorage item.'
            ],
            correctOptionIndex: 1,
            explanation: 'The functional updater pattern ensures you receive the latest committed/pending state, avoiding stale closure bugs.',
            skill: 'React.js',
            difficulty: 'intermediate'
          },
          {
            id: 'q-r4',
            question: 'Which of the following is true regarding React.memo() and useCallback()?',
            options: [
              'React.memo() deep-compares all nested object props by default.',
              'useCallback() memoizes the return value of a calculation, whereas useMemo() memoizes a function.',
              'React.memo() does a shallow comparison of props; passing a new inline function reference will invalidate memoization unless wrapped in useCallback().',
              'Wrapping every single function in useCallback() is always recommended and has zero memory overhead.'
            ],
            correctOptionIndex: 2,
            explanation: 'React.memo performs shallow reference equality checks. A fresh inline function recreated on every parent render will cause the memoized child to re-render unless stabilized with useCallback.',
            skill: 'React.js',
            difficulty: 'intermediate'
          },
          {
            id: 'q-r5',
            question: 'What is the purpose of the `useTransition` hook introduced in React 18?',
            options: [
              'To animate CSS transitions between page navigation routes.',
              'To mark non-urgent UI updates so the interface remains responsive to urgent user interactions like typing or clicking.',
              'To handle database transactions on the server.',
              'To serialize React state across browser tabs.'
            ],
            correctOptionIndex: 1,
            explanation: 'useTransition lets you mark updates as transitions, keeping the UI snappy and responsive by deferring heavy re-renders in favor of urgent input events.',
            skill: 'React.js',
            difficulty: 'advanced'
          }
        ])
      },
      {
        id: 'asm-sql',
        title: 'SQL & Database Architecture Assessment',
        skill_category: 'Database Engineering',
        description: 'Test your database design skills, relational queries, join strategies, indexing mechanisms, and transaction isolation.',
        duration_minutes: 15,
        total_questions: 4,
        badge: 'SQL Database Practitioner',
        questions: JSON.stringify([
          {
            id: 'q-s1',
            question: 'What is the primary difference between WHERE and HAVING clauses in SQL?',
            options: [
              'WHERE filters individual rows before aggregation, whereas HAVING filters grouped results after GROUP BY calculations.',
              'HAVING can only be used with primary keys.',
              'WHERE is used for UPDATE queries, while HAVING is used for SELECT queries only.',
              'There is no functional difference; they are interchangeable aliases.'
            ],
            correctOptionIndex: 0,
            explanation: 'WHERE filters rows prior to group summarization; HAVING acts on aggregated groupings created by the GROUP BY clause.',
            skill: 'SQL & Database Design',
            difficulty: 'beginner'
          },
          {
            id: 'q-s2',
            question: 'Which index type is best suited for equality and range queries on high-cardinality numerical columns in PostgreSQL?',
            options: [
              'Hash Index',
              'B-Tree Index',
              'GIN (Generalized Inverted Index)',
              'BRIN Index'
            ],
            correctOptionIndex: 1,
            explanation: 'B-Tree is the default and most versatile index in relational databases, excelling at equality (=) and range (<, <=, >, >=, BETWEEN) queries.',
            skill: 'SQL & Database Design',
            difficulty: 'intermediate'
          },
          {
            id: 'q-s3',
            question: 'Under the default READ COMMITTED isolation level in PostgreSQL, what type of read phenomenon is prevented?',
            options: [
              'Dirty Reads (reading uncommitted changes from other transactions)',
              'Non-repeatable Reads',
              'Phantom Reads',
              'Serialization Anomalies'
            ],
            correctOptionIndex: 0,
            explanation: 'READ COMMITTED guarantees that a query sees only data committed before the query began, preventing dirty reads.',
            skill: 'SQL & Database Design',
            difficulty: 'advanced'
          },
          {
            id: 'q-s4',
            question: 'What is the key benefit of database normalization up to Third Normal Form (3NF)?',
            options: [
              'Eliminating insertion, update, and deletion anomalies while reducing duplicate data storage.',
              'Eliminating the need for foreign keys and primary keys.',
              'Making queries faster by eliminating all JOIN operations.',
              'Enabling automatic horizontal sharding.'
            ],
            correctOptionIndex: 0,
            explanation: '3NF ensures every non-key column depends solely on the primary key, eliminating transitive dependencies and update anomalies.',
            skill: 'SQL & Database Design',
            difficulty: 'intermediate'
          }
        ])
      },
      {
        id: 'asm-git',
        title: 'Git & Version Control Mastery Assessment',
        skill_category: 'DevOps & Tooling',
        description: 'Assess enterprise version control skills including merge strategies, interactive rebasing, stashing, and conflict resolution.',
        duration_minutes: 15,
        total_questions: 4,
        badge: 'Git Workflow Expert',
        questions: JSON.stringify([
          {
            id: 'q-g1',
            question: 'What is the primary difference between `git merge` and `git rebase`?',
            options: [
              'Rebase creates a merge commit preserving exact history topology, while merge creates a linear history.',
              'Merge preserves complete commit history and branch structure with a merge commit, while rebase rewrites project history by replaying commits onto the tip of another branch for a clean, linear history.',
              'Rebase can only be used on remote branches, merge only on local branches.',
              'Git rebase deletes all files and clones them again.'
            ],
            correctOptionIndex: 1,
            explanation: 'git rebase reapplies your commits onto another base commit, creating a linear history without additional merge commits.',
            skill: 'Git & Version Control',
            difficulty: 'intermediate'
          },
          {
            id: 'q-g2',
            question: 'What does `git cherry-pick <commit-hash>` do?',
            options: [
              'Applies the changes introduced by a specific existing commit from another branch onto your current branch.',
              'Deletes a commit permanently from GitHub.',
              'Picks the best merge strategy automatically based on file differences.',
              'Rolls back your repository to the initial commit.'
            ],
            correctOptionIndex: 0,
            explanation: 'Cherry-picking copies a specific commit from one branch and applies it as a new commit onto the HEAD of the current branch.',
            skill: 'Git & Version Control',
            difficulty: 'intermediate'
          }
        ])
      },
      {
        id: 'asm-js',
        title: 'Modern JavaScript (ES2024+) Core Assessment',
        skill_category: 'Frontend Engineering',
        description: 'Test your understanding of closures, event loop microtasks vs macrotasks, prototypical inheritance, and asynchronous execution.',
        duration_minutes: 20,
        total_questions: 4,
        badge: 'JavaScript Core Architect',
        questions: JSON.stringify([
          {
            id: 'q-j1',
            question: 'In the JavaScript event loop, what is the execution priority between Promise microtasks and setTimeout macrotasks?',
            options: [
              'Macrotasks (setTimeout) execute first before any microtasks.',
              'Microtasks (Promise callbacks, queueMicrotask) drain completely before the next macrotask in the queue executes.',
              'They execute in strict random order depending on CPU cores.',
              'SetTimeout callbacks always interrupt currently running Promise chains.'
            ],
            correctOptionIndex: 1,
            explanation: 'The microtask queue is fully processed at the end of each macro-task cycle before picking the next macrotask from the queue.',
            skill: 'JavaScript',
            difficulty: 'advanced'
          },
          {
            id: 'q-j2',
            question: 'What will `typeof null` evaluate to in standard JavaScript and why?',
            options: [
              '\'null\' because null is its own distinct primitive type.',
              '\'object\' due to a historical legacy bug in the original 1995 JavaScript implementation where object type tag was 0.',
              '\'undefined\' because null represents an unassigned variable.',
              '\'boolean\' because null is falsy.'
            ],
            correctOptionIndex: 1,
            explanation: 'In the initial implementation of JavaScript, values were stored in 32-bit units with a type tag. The object tag was 000, and null was represented as the NULL pointer (0x00), causing typeof null to return object.',
            skill: 'JavaScript',
            difficulty: 'beginner'
          }
        ])
      }
    ];

    for (const asm of assessments) {
      await client.query(`
        INSERT INTO public.assessments (id, title, skill_category, description, duration_minutes, total_questions, badge, questions)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, questions = EXCLUDED.questions;
      `, [asm.id, asm.title, asm.skill_category, asm.description, asm.duration_minutes, asm.total_questions, asm.badge, asm.questions]);
    }
    console.log(`✅ Seeded ${assessments.length} assessments with questions.`);

    // 9. Seed Notifications
    console.log('🌱 Seeding Notifications...');
    const notifications = [
      {
        id: 'notif-01',
        user_id: 'usr-std-01',
        title: 'Application Shortlisted! 🎉',
        message: 'TechNova Solutions shortlisted your profile for the Frontend Developer Intern role. Technical round scheduled.',
        time: '2 hours ago',
        read: false,
        type: 'application'
      },
      {
        id: 'notif-02',
        user_id: 'usr-std-01',
        title: 'Skill Gap Warning: React.js',
        message: 'CloudBridge Full Stack role requires React.js score ≥ 70%. Your current score is 58%. Take the recommended module to qualify.',
        time: '5 hours ago',
        read: false,
        type: 'skill_gap'
      },
      {
        id: 'notif-03',
        user_id: 'usr-std-01',
        title: 'New Opportunity Match (84%)',
        message: 'CloudBridge Technologies posted Full Stack Engineering Associate matching your profile.',
        time: '1 day ago',
        read: true,
        type: 'opportunity'
      },
      {
        id: 'notif-04',
        user_id: 'usr-std-01',
        title: 'Assessment Ready: Git & Version Control',
        message: 'Retake your Git assessment to upgrade your verified score from 43% to unlocks 12+ additional postings.',
        time: '2 days ago',
        read: true,
        type: 'assessment'
      }
    ];

    for (const n of notifications) {
      await client.query(`
        INSERT INTO public.notifications (id, user_id, title, message, time, read, type)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING;
      `, [n.id, n.user_id, n.title, n.message, n.time, n.read, n.type]);
    }
    console.log(`✅ Seeded ${notifications.length} notifications.`);

    // 10. Seed Career Paths
    console.log('🌱 Seeding Career Paths...');
    const careerPaths = [
      {
        id: 'cp-fullstack',
        title: 'Full Stack Web Architect',
        category: 'Software Engineering',
        demand: 'Very High',
        median_salary: '₹12.5 LPA',
        growth_rate: '+24% YoY',
        description: 'Design and construct end-to-end resilient web applications, distributed APIs, microservices, and reactive user interfaces.',
        required_skills: JSON.stringify([
          { skillName: 'JavaScript', targetScore: 85, weight: 'Critical' },
          { skillName: 'React.js', targetScore: 80, weight: 'Critical' },
          { skillName: 'Node.js & Express', targetScore: 75, weight: 'High' },
          { skillName: 'SQL & Database Design', targetScore: 75, weight: 'High' },
          { skillName: 'Git & Version Control', targetScore: 70, weight: 'Medium' }
        ])
      },
      {
        id: 'cp-frontend',
        title: 'Frontend Systems Engineer',
        category: 'UI & User Experience',
        demand: 'High',
        median_salary: '₹11.0 LPA',
        growth_rate: '+19% YoY',
        description: 'Specialize in high-performance browser applications, accessible design systems, Web Vitals optimization, and state architectures.',
        required_skills: JSON.stringify([
          { skillName: 'JavaScript', targetScore: 90, weight: 'Critical' },
          { skillName: 'React.js', targetScore: 85, weight: 'Critical' },
          { skillName: 'HTML5 & Modern CSS', targetScore: 85, weight: 'High' },
          { skillName: 'TypeScript', targetScore: 75, weight: 'High' }
        ])
      },
      {
        id: 'cp-data',
        title: 'Data & Cloud Infrastructure Specialist',
        category: 'Data & DevOps',
        demand: 'Very High',
        median_salary: '₹14.0 LPA',
        growth_rate: '+28% YoY',
        description: 'Architect scalable data pipelines, relational storage schemas, distributed event streaming, and cloud container orchestration.',
        required_skills: JSON.stringify([
          { skillName: 'SQL & Database Design', targetScore: 85, weight: 'Critical' },
          { skillName: 'Data Structures & Algorithms', targetScore: 80, weight: 'Critical' },
          { skillName: 'Node.js & Express', targetScore: 70, weight: 'Medium' },
          { skillName: 'Git & Version Control', targetScore: 75, weight: 'High' }
        ])
      }
    ];

    for (const cp of careerPaths) {
      await client.query(`
        INSERT INTO public.career_paths (id, title, category, demand, median_salary, growth_rate, description, required_skills)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      `, [cp.id, cp.title, cp.category, cp.demand, cp.median_salary, cp.growth_rate, cp.description, cp.required_skills]);
    }
    console.log(`✅ Seeded ${careerPaths.length} career paths.`);

    // 11. Final Count Verification
    console.log('\n====================================================');
    console.log('🎉 SUPABASE DATABASE COMPLETE VERIFICATION REPORT:');
    console.log('====================================================');

    const counts = await client.query(`
      SELECT 
        (SELECT count(*) FROM public.profiles) as profiles,
        (SELECT count(*) FROM public.skills) as skills,
        (SELECT count(*) FROM public.opportunities) as opportunities,
        (SELECT count(*) FROM public.applications) as applications,
        (SELECT count(*) FROM public.courses) as courses,
        (SELECT count(*) FROM public.partners) as partners,
        (SELECT count(*) FROM public.assessments) as assessments,
        (SELECT count(*) FROM public.notifications) as notifications,
        (SELECT count(*) FROM public.career_paths) as career_paths;
    `);

    console.table(counts.rows[0]);

    // Show users in database
    const users = await client.query('SELECT id, name, username, email, role, organization FROM public.profiles ORDER BY role, name;');
    console.log('\n👤 Registered Users in Database:');
    users.rows.forEach(u => console.log(` [${u.role.toUpperCase()}] ${u.name} (username: @${u.username}, email: ${u.email}) - ${u.organization}`));

    console.log('\n====================================================');
    console.log('✅ ALL DATA SUCCESSFULLY CONNECTED AND SYNCHRONIZED!');
    console.log('====================================================');

  } catch (err) {
    console.error('❌ Database migration error:', err);
  } finally {
    await client.end();
  }
}

setup();
