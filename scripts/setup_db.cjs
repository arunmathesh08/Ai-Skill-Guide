const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const config = {
  user: 'postgres.zuqiowzprzbshjrywzkf',
  password: 'Arun@6844123',
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
};

async function setupDatabase() {
  console.log('Connecting to Supabase PostgreSQL...');
  const client = new Client(config);

  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL database successfully!');

    // 1. Read and execute supabase_schema.sql
    const sqlSchemaPath = path.join(__dirname, '..', 'supabase_schema.sql');
    const sqlContent = fs.readFileSync(sqlSchemaPath, 'utf8');

    console.log('Executing database schema creation...');
    await client.query(sqlContent);
    console.log('✅ Tables and RLS policies created successfully!');

    // 2. Seed initial data
    console.log('Seeding initial data...');

    // Seed profiles
    const profiles = [
      {
        id: 'usr-std-01',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@institution.edu.in',
        role: 'student',
        organization: 'National Institute of Technology (NIT)',
        title: 'B.Tech Computer Science (Final Year)',
        avatar: 'AS',
        roll_no: '21CS8042',
        department: 'Computer Science & Engineering',
        batch: '2022 - 2026',
        cgpa: '8.84 / 10',
        bio: 'Passionate aspiring full-stack engineer and open-source enthusiast with strong foundations in JavaScript, UI engineering, and API architectures. Actively building scalable web systems and seeking high-impact software engineering roles.',
        career_readiness: 78,
        career_readiness_delta: 6,
        target_career_id: 'cp-fullstack'
      },
      {
        id: 'usr-ind-01',
        name: 'Priya Sen',
        email: 'priya.sen@technova.io',
        role: 'industry',
        organization: 'TechNova Solutions',
        title: 'Head of University Talent Acquisition',
        avatar: 'PS',
        roll_no: null,
        department: 'Talent Acquisition',
        batch: null,
        cgpa: null,
        bio: 'Leading campus recruitment and corporate apprenticeships across tier-1 engineering institutions.',
        career_readiness: 95,
        career_readiness_delta: 0,
        target_career_id: 'cp-fullstack'
      },
      {
        id: 'usr-fac-01',
        name: 'Dr. Ramesh Kumar',
        email: 'ramesh.kumar@institution.edu.in',
        role: 'faculty',
        organization: 'Department of Computer Science & Engineering',
        title: 'Professor & Placement Coordinator',
        avatar: 'RK',
        roll_no: null,
        department: 'Computer Science & Engineering',
        batch: null,
        cgpa: null,
        bio: 'Department placement coordinator focused on closing curriculum-industry competency gaps.',
        career_readiness: 90,
        career_readiness_delta: 0,
        target_career_id: 'cp-fullstack'
      },
      {
        id: 'usr-adm-01',
        name: 'Dr. Ananya Iyer',
        email: 'ananya.iyer@institution.edu.in',
        role: 'admin',
        organization: 'Apex Technical University System',
        title: 'Dean of Industry Partnerships & Academic Strategy',
        avatar: 'AI',
        roll_no: null,
        department: 'Executive Academic Council',
        batch: null,
        cgpa: null,
        bio: 'Overseeing institutional accreditation, corporate MoUs, and university-wide placement velocity.',
        career_readiness: 92,
        career_readiness_delta: 0,
        target_career_id: 'cp-fullstack'
      }
    ];

    for (const p of profiles) {
      await client.query(
        `INSERT INTO public.profiles (id, name, email, role, organization, title, avatar, roll_no, department, batch, cgpa, bio, career_readiness, career_readiness_delta, target_career_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           career_readiness = EXCLUDED.career_readiness,
           target_career_id = EXCLUDED.target_career_id;`,
        [p.id, p.name, p.email, p.role, p.organization, p.title, p.avatar, p.roll_no, p.department, p.batch, p.cgpa, p.bio, p.career_readiness, p.career_readiness_delta, p.target_career_id]
      );
    }
    console.log('✅ Profiles seeded.');

    // Seed verified skills
    const skills = [
      { id: 'sk-js', student_id: 'usr-std-01', name: 'JavaScript', category: 'Frontend', score: 88, verified: true, last_assessed: '2 days ago' },
      { id: 'sk-html-css', student_id: 'usr-std-01', name: 'HTML5 & Modern CSS', category: 'Frontend', score: 92, verified: true, last_assessed: '1 week ago' },
      { id: 'sk-react', student_id: 'usr-std-01', name: 'React.js', category: 'Frontend', score: 58, verified: true, last_assessed: '3 days ago' },
      { id: 'sk-sql', student_id: 'usr-std-01', name: 'SQL & Database Design', category: 'Database', score: 67, verified: true, last_assessed: '5 days ago' },
      { id: 'sk-git', student_id: 'usr-std-01', name: 'Git & Version Control', category: 'DevOps & Cloud', score: 43, verified: true, last_assessed: '1 week ago' },
      { id: 'sk-node', student_id: 'usr-std-01', name: 'Node.js & Express', category: 'Backend', score: 72, verified: true, last_assessed: '2 weeks ago' },
      { id: 'sk-ts', student_id: 'usr-std-01', name: 'TypeScript', category: 'Frontend', score: 64, verified: false, last_assessed: '1 month ago' },
      { id: 'sk-dsa', student_id: 'usr-std-01', name: 'Data Structures & Algorithms', category: 'Core CS', score: 84, verified: true, last_assessed: '3 weeks ago' },
      { id: 'sk-comm', student_id: 'usr-std-01', name: 'Technical Communication', category: 'Soft Skills', score: 82, verified: true, last_assessed: '1 month ago' }
    ];

    for (const s of skills) {
      await client.query(
        `INSERT INTO public.skills (id, student_id, name, category, score, verified, last_assessed)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, verified = EXCLUDED.verified;`,
        [s.id, s.student_id, s.name, s.category, s.score, s.verified, s.last_assessed]
      );
    }
    console.log('✅ Skills seeded.');

    // Seed opportunities
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
      await client.query(
        `INSERT INTO public.opportunities (id, title, company_id, company_name, company_initials, company_location, company_color, type, is_remote, location, duration, stipend_salary, deadline, eligibility, description, responsibilities, required_skills, perks, applicants_count, posted_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
         ON CONFLICT (id) DO UPDATE SET applicants_count = EXCLUDED.applicants_count;`,
        [o.id, o.title, o.company_id, o.company_name, o.company_initials, o.company_location, o.company_color, o.type, o.is_remote, o.location, o.duration, o.stipend_salary, o.deadline, o.eligibility, o.description, o.responsibilities, o.required_skills, o.perks, o.applicants_count, o.posted_date]
      );
    }
    console.log('✅ Opportunities seeded.');

    // Seed applications
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
      await client.query(
        `INSERT INTO public.applications (id, opportunity_id, opportunity_title, opportunity_type, company_name, company_initials, company_location, stipend_salary, student_id, student_name, student_email, student_college, applied_date, status, match_score, matching_skills, missing_skills, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
         ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;`,
        [a.id, a.opportunity_id, a.opportunity_title, a.opportunity_type, a.company_name, a.company_initials, a.company_location, a.stipend_salary, a.student_id, a.student_name, a.student_email, a.student_college, a.applied_date, a.status, a.match_score, a.matching_skills, a.missing_skills, a.notes]
      );
    }
    console.log('✅ Applications seeded.');

    // Seed courses
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
      await client.query(
        `INSERT INTO public.courses (id, title, provider, duration, level, target_skill, rating, students_enrolled, thumbnail_gradient, description, match_reason, url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET rating = EXCLUDED.rating;`,
        [c.id, c.title, c.provider, c.duration, c.level, c.target_skill, c.rating, c.students_enrolled, c.thumbnail_gradient, c.description, c.match_reason, c.url]
      );
    }
    console.log('✅ Courses seeded.');

    // Seed partners
    const partners = [
      { id: 'p-1', name: 'TechNova Solutions', initials: 'TN', color: 'bg-blue-600', location: 'Bengaluru, Karnataka', active_postings: 4, students_hired: 42, mou_title: 'Strategic Center of Excellence in Full Stack & Cloud', mou_status: 'Active (2025-2028)', tier: 'Platinum Tier Partner' },
      { id: 'p-2', name: 'CloudBridge Technologies', initials: 'CB', color: 'bg-indigo-600', location: 'Hyderabad, Telangana', active_postings: 2, students_hired: 28, mou_title: 'Corporate Apprenticeship & Direct PPO Pathway', mou_status: 'Active (2024-2027)', tier: 'Gold Tier Partner' },
      { id: 'p-3', name: 'DataSphere Labs', initials: 'DS', color: 'bg-emerald-600', location: 'Pune, Maharashtra', active_postings: 3, students_hired: 19, mou_title: 'Advanced Relational Database & Pipeline Engineering Lab', mou_status: 'Active (2025-2027)', tier: 'Gold Tier Partner' },
      { id: 'p-4', name: 'InnoSoft Systems', initials: 'IS', color: 'bg-violet-600', location: 'Noida, NCR', active_postings: 2, students_hired: 15, mou_title: 'Software Quality Automation & SDET Training', mou_status: 'Active (2025-2026)', tier: 'Silver Tier Partner' },
      { id: 'p-5', name: 'NextGen Digital', initials: 'ND', color: 'bg-sky-600', location: 'Chennai, Tamil Nadu', active_postings: 1, students_hired: 24, mou_title: 'Cloud DevOps & AWS Infrastructure Apprenticeship', mou_status: 'Active (2024-2027)', tier: 'Gold Tier Partner' }
    ];

    for (const part of partners) {
      await client.query(
        `INSERT INTO public.partners (id, name, initials, color, location, active_postings, students_hired, mou_title, mou_status, tier)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO UPDATE SET active_postings = EXCLUDED.active_postings;`,
        [part.id, part.name, part.initials, part.color, part.location, part.active_postings, part.students_hired, part.mou_title, part.mou_status, part.tier]
      );
    }
    console.log('✅ Corporate Partners seeded.');

    // Check table counts
    const resProfiles = await client.query('SELECT count(*) FROM public.profiles;');
    const resOpps = await client.query('SELECT count(*) FROM public.opportunities;');
    const resSkills = await client.query('SELECT count(*) FROM public.skills;');
    const resApps = await client.query('SELECT count(*) FROM public.applications;');
    const resCourses = await client.query('SELECT count(*) FROM public.courses;');

    console.log('----------------------------------------------------');
    console.log('🎉 SUPABASE DATABASE SETUP COMPLETE!');
    console.log(`- Profiles in DB: ${resProfiles.rows[0].count}`);
    console.log(`- Opportunities in DB: ${resOpps.rows[0].count}`);
    console.log(`- Skills in DB: ${resSkills.rows[0].count}`);
    console.log(`- Applications in DB: ${resApps.rows[0].count}`);
    console.log(`- Courses in DB: ${resCourses.rows[0].count}`);
    console.log('----------------------------------------------------');
  } catch (err) {
    console.error('❌ Database setup error:', err);
  } finally {
    await client.end();
  }
}

setupDatabase();
