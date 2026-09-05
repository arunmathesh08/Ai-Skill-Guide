import {
  User,
  StudentProfile,
  CareerPath,
  Opportunity,
  Course,
  Assessment,
  Application,
  NotificationItem,
  CorporatePartner
} from '../types';

export const DEMO_USERS: Record<string, User> = {
  student: {
    id: 'usr-std-01',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@institution.edu.in',
    role: 'student',
    organization: 'National Institute of Technology (NIT)',
    title: 'B.Tech Computer Science (Final Year)',
    avatar: 'AS',
  },
  industry: {
    id: 'usr-ind-01',
    name: 'Priya Sen',
    email: 'priya.sen@technova.io',
    role: 'industry',
    organization: 'TechNova Solutions',
    title: 'Head of University Talent Acquisition',
    avatar: 'PS',
  },
  faculty: {
    id: 'usr-fac-01',
    name: 'Dr. Ramesh Kumar',
    email: 'ramesh.kumar@institution.edu.in',
    role: 'faculty',
    organization: 'Department of Computer Science & Engineering',
    title: 'Professor & Placement Coordinator',
    avatar: 'RK',
  },
  admin: {
    id: 'usr-adm-01',
    name: 'Dr. Ananya Iyer',
    email: 'ananya.iyer@institution.edu.in',
    role: 'admin',
    organization: 'Apex Technical University System',
    title: 'Dean of Industry Partnerships & Academic Strategy',
    avatar: 'AI',
  }
};

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  user: DEMO_USERS.student,
  rollNo: '21CS8042',
  department: 'Computer Science & Engineering',
  batch: '2022 - 2026',
  cgpa: '8.84 / 10',
  bio: 'Passionate aspiring full-stack engineer and open-source enthusiast with strong foundations in JavaScript, UI engineering, and API architectures. Actively building scalable web systems and seeking high-impact software engineering roles.',
  careerReadiness: 78,
  careerReadinessDelta: 6,
  targetCareerId: 'cp-fullstack',
  skills: [
    { id: 'sk-js', name: 'JavaScript', category: 'Frontend', score: 88, verified: true, lastAssessed: '2 days ago' },
    { id: 'sk-html-css', name: 'HTML5 & Modern CSS', category: 'Frontend', score: 92, verified: true, lastAssessed: '1 week ago' },
    { id: 'sk-react', name: 'React.js', category: 'Frontend', score: 58, verified: true, lastAssessed: '3 days ago' },
    { id: 'sk-sql', name: 'SQL & Database Design', category: 'Database', score: 67, verified: true, lastAssessed: '5 days ago' },
    { id: 'sk-git', name: 'Git & Version Control', category: 'DevOps & Cloud', score: 43, verified: true, lastAssessed: '1 week ago' },
    { id: 'sk-node', name: 'Node.js & Express', category: 'Backend', score: 72, verified: true, lastAssessed: '2 weeks ago' },
    { id: 'sk-ts', name: 'TypeScript', category: 'Frontend', score: 64, verified: false, lastAssessed: '1 month ago' },
    { id: 'sk-dsa', name: 'Data Structures & Algorithms', category: 'Core CS', score: 84, verified: true, lastAssessed: '3 weeks ago' },
    { id: 'sk-comm', name: 'Technical Communication', category: 'Soft Skills', score: 82, verified: true, lastAssessed: '1 month ago' },
  ],
  projects: [
    {
      id: 'prj-01',
      title: 'DevCollab — Realtime Markdown & Code Editor',
      description: 'Built a collaborative coding workspace featuring operational transformation, syntax highlighting, and live presence indicator using WebSockets and React.',
      techStack: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'Tailwind CSS'],
      githubUrl: 'https://github.com/aaravsharma/devcollab',
      liveUrl: 'https://devcollab-demo.vercel.app'
    },
    {
      id: 'prj-02',
      title: 'CampusRecruit — Placement Analytics System',
      description: 'Architected a role-based analytics portal for campus recruitment drives with automated skill ranking and schedule management.',
      techStack: ['React', 'Express', 'PostgreSQL', 'Prisma', 'Tailwind'],
      githubUrl: 'https://github.com/aaravsharma/campus-recruit'
    },
    {
      id: 'prj-03',
      title: 'MicroPay — Distributed Ledger Payment Sandbox',
      description: 'Implemented an idempotent RESTful microservice handling transactional state management with Redis caching and PostgreSQL audit trails.',
      techStack: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
      githubUrl: 'https://github.com/aaravsharma/micropay'
    }
  ],
  certifications: [
    {
      id: 'cert-01',
      title: 'Meta Frontend Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      date: 'Jan 2026',
      credentialId: 'META-FE-90821',
      verified: true
    },
    {
      id: 'cert-02',
      title: 'AWS Certified Cloud Practitioner (Foundational)',
      issuer: 'Amazon Web Services',
      date: 'Nov 2025',
      credentialId: 'AWS-CCP-77192',
      verified: true
    }
  ],
  experience: [
    {
      id: 'exp-01',
      role: 'Frontend Engineering Intern',
      organization: 'InnovateX Labs',
      duration: 'May 2025 – Jul 2025 (3 mos)',
      description: 'Refactored customer onboarding flow with React and Zustand, reducing bounce rate by 22%. Implemented responsive dashboard views and unit test suites with Vitest.'
    }
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science and Engineering',
      institution: 'National Institute of Technology',
      year: '2022 – 2026',
      grade: '8.84 CGPA'
    },
    {
      degree: 'Higher Secondary School Certificate (CBSE Class XII)',
      institution: 'Delhi Public School',
      year: '2020 – 2022',
      grade: '96.2%'
    }
  ]
};

export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'cp-fullstack',
    title: 'Full Stack Developer',
    description: 'Design and engineer end-to-end web applications, encompassing responsive client-side UIs, robust REST/GraphQL APIs, database architectures, and cloud deployment pipelines.',
    avgReadiness: 74,
    demandLevel: 'Critical Demand',
    avgSalary: '₹8.5L – ₹18.0L / yr',
    requiredSkills: [
      { skillName: 'React.js', requiredScore: 75, weight: 1.2 },
      { skillName: 'JavaScript', requiredScore: 80, weight: 1.0 },
      { skillName: 'SQL & Database Design', requiredScore: 70, weight: 1.0 },
      { skillName: 'Node.js & Express', requiredScore: 70, weight: 1.0 },
      { skillName: 'Git & Version Control', requiredScore: 65, weight: 0.8 },
      { skillName: 'TypeScript', requiredScore: 65, weight: 0.9 },
    ],
    roadmapSteps: [
      { step: 1, title: 'Modern Frontend Fundamentals', description: 'Semantic HTML, modern CSS layouts (Flexbox/Grid), and advanced ES6+ JavaScript concepts.', skills: ['HTML5 & Modern CSS', 'JavaScript'], status: 'completed' },
      { step: 2, title: 'Stateful UI & Component Architecture', description: 'Mastering React hooks, component lifecycle, rendering optimization, and TypeScript integration.', skills: ['React.js', 'TypeScript'], status: 'in-progress' },
      { step: 3, title: 'Server-side APIs & Microservices', description: 'Building RESTful APIs with Node.js, middleware authentication, and database schemas with SQL/PostgreSQL.', skills: ['Node.js & Express', 'SQL & Database Design'], status: 'in-progress' },
      { step: 4, title: 'DevOps & CI/CD Pipelines', description: 'Version control branching models, Docker containerization, and AWS/Vercel continuous deployments.', skills: ['Git & Version Control'], status: 'upcoming' }
    ]
  },
  {
    id: 'cp-frontend',
    title: 'Frontend Engineer',
    description: 'Specialise in building fast, accessible, and delightful web interfaces with modern JavaScript frameworks, design systems, and client-side performance engineering.',
    avgReadiness: 81,
    demandLevel: 'Very High',
    avgSalary: '₹7.0L – ₹15.0L / yr',
    requiredSkills: [
      { skillName: 'JavaScript', requiredScore: 85, weight: 1.2 },
      { skillName: 'React.js', requiredScore: 80, weight: 1.3 },
      { skillName: 'HTML5 & Modern CSS', requiredScore: 85, weight: 1.0 },
      { skillName: 'TypeScript', requiredScore: 70, weight: 1.0 },
      { skillName: 'Git & Version Control', requiredScore: 65, weight: 0.8 },
    ],
    roadmapSteps: [
      { step: 1, title: 'CSS Mastery & Responsive Layouts', description: 'Modern CSS, CSS variables, utility-first patterns, and responsive UX.', skills: ['HTML5 & Modern CSS'], status: 'completed' },
      { step: 2, title: 'Deep JavaScript & DOM APIs', description: 'Asynchronous event loop, closures, web workers, and modern browser APIs.', skills: ['JavaScript'], status: 'completed' },
      { step: 3, title: 'Advanced React & Architecture', description: 'Custom hooks, state management, bundle optimization, and SSR.', skills: ['React.js', 'TypeScript'], status: 'in-progress' }
    ]
  },
  {
    id: 'cp-backend',
    title: 'Backend Systems Engineer',
    description: 'Develop resilient distributed systems, database architectures, microservices, high-throughput caching layers, and secure cloud API gateways.',
    avgReadiness: 71,
    demandLevel: 'Critical Demand',
    avgSalary: '₹8.0L – ₹17.5L / yr',
    requiredSkills: [
      { skillName: 'Node.js & Express', requiredScore: 80, weight: 1.2 },
      { skillName: 'SQL & Database Design', requiredScore: 75, weight: 1.3 },
      { skillName: 'Data Structures & Algorithms', requiredScore: 80, weight: 1.1 },
      { skillName: 'Git & Version Control', requiredScore: 70, weight: 0.9 },
    ],
    roadmapSteps: [
      { step: 1, title: 'Data Structures & Algorithmic Complexity', description: 'Efficient algorithmic problem solving and system performance.', skills: ['Data Structures & Algorithms'], status: 'completed' },
      { step: 2, title: 'Database Optimization & Normalization', description: 'Indexing, query plans, transactions, ACID compliance, and connection pooling.', skills: ['SQL & Database Design'], status: 'in-progress' },
      { step: 3, title: 'Scalable Microservices & Caching', description: 'Asynchronous event streaming, Redis caching, and rate limiting.', skills: ['Node.js & Express'], status: 'in-progress' }
    ]
  },
  {
    id: 'cp-cloud-devops',
    title: 'Cloud & DevOps Engineer',
    description: 'Automate infrastructure as code, CI/CD pipelines, container orchestration, Kubernetes clusters, and cloud observability.',
    avgReadiness: 56,
    demandLevel: 'Very High',
    avgSalary: '₹9.0L – ₹20.0L / yr',
    requiredSkills: [
      { skillName: 'Git & Version Control', requiredScore: 80, weight: 1.2 },
      { skillName: 'SQL & Database Design', requiredScore: 65, weight: 0.8 },
      { skillName: 'Node.js & Express', requiredScore: 65, weight: 0.8 },
      { skillName: 'Technical Communication', requiredScore: 75, weight: 0.8 },
    ],
    roadmapSteps: [
      { step: 1, title: 'Linux & Scripting Foundations', description: 'Shell automation, bash scripting, and networking fundamentals.', skills: ['Git & Version Control'], status: 'in-progress' },
      { step: 2, title: 'Containerization & Docker', description: 'Dockerizing multi-tier applications and Docker compose orchestration.', skills: ['Git & Version Control'], status: 'upcoming' },
      { step: 3, title: 'Cloud Infrastructure & Kubernetes', description: 'AWS VPCs, EC2, S3, IAM security, and automated GitHub Actions CI/CD.', skills: ['Git & Version Control'], status: 'upcoming' }
    ]
  },
  {
    id: 'cp-ai-ml',
    title: 'AI & Data Science Engineer',
    description: 'Build predictive machine learning models, statistical data pipelines, NLP applications, and LLM-powered enterprise integrations.',
    avgReadiness: 62,
    demandLevel: 'Critical Demand',
    avgSalary: '₹9.5L – ₹22.0L / yr',
    requiredSkills: [
      { skillName: 'SQL & Database Design', requiredScore: 80, weight: 1.2 },
      { skillName: 'Data Structures & Algorithms', requiredScore: 85, weight: 1.2 },
      { skillName: 'JavaScript', requiredScore: 70, weight: 0.7 },
    ],
    roadmapSteps: [
      { step: 1, title: 'Mathematical & Statistical Foundations', description: 'Linear algebra, multivariate calculus, and probability theory.', skills: ['Data Structures & Algorithms'], status: 'completed' },
      { step: 2, title: 'Data Wrangling & SQL Warehousing', description: 'Large-scale relational querying, ETL pipelines, and feature engineering.', skills: ['SQL & Database Design'], status: 'in-progress' },
      { step: 3, title: 'Deep Learning & Neural Architectures', description: 'PyTorch models, embeddings, transformers, and vector databases.', skills: ['Data Structures & Algorithms'], status: 'upcoming' }
    ]
  },
  {
    id: 'cp-data-analyst',
    title: 'Data Analyst & BI Specialist',
    description: 'Transform complex business datasets into actionable executive insights with advanced SQL querying, statistical storytelling, and BI dashboards.',
    avgReadiness: 76,
    demandLevel: 'High',
    avgSalary: '₹6.5L – ₹13.0L / yr',
    requiredSkills: [
      { skillName: 'SQL & Database Design', requiredScore: 85, weight: 1.4 },
      { skillName: 'Technical Communication', requiredScore: 80, weight: 1.0 },
      { skillName: 'Data Structures & Algorithms', requiredScore: 70, weight: 0.9 },
    ],
    roadmapSteps: [
      { step: 1, title: 'Advanced SQL & Data Modeling', description: 'Window functions, CTEs, indexing, and dimensional modeling.', skills: ['SQL & Database Design'], status: 'in-progress' },
      { step: 2, title: 'Data Storytelling & Executive Reporting', description: 'Building interactive BI dashboards and cross-functional presentations.', skills: ['Technical Communication'], status: 'completed' }
    ]
  }
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-01',
    title: 'Frontend Developer Intern',
    company: {
      id: 'cmp-01',
      name: 'TechNova Solutions',
      initials: 'TN',
      location: 'Bengaluru, Karnataka (Hybrid)',
      verified: true,
      color: 'bg-blue-600'
    },
    type: 'internship',
    isRemote: false,
    location: 'Bengaluru (Hybrid)',
    duration: '6 Months (PPO Opportunity)',
    stipendSalary: '₹35,000 / month',
    deadline: '15 Sep 2026',
    eligibility: 'B.Tech/BE (CSE/IT/ECE) 2026 Batch, Min 7.5 CGPA',
    description: 'Join TechNova Solutions as a Frontend Developer Intern in our Core Cloud Platform group. You will collaborate with senior architects to craft modular, high-performance UI components for our next-generation enterprise SaaS portal.',
    responsibilities: [
      'Implement reusable UI components in React and TypeScript following our strict design system.',
      'Optimize Web Vitals (LCP, INP) across real-time data streaming widgets.',
      'Collaborate with UX designers and backend engineers in agile two-week sprints.',
      'Write end-to-end component tests and maintain comprehensive documentation.'
    ],
    requiredSkills: [
      { skillName: 'React.js', minScore: 65 },
      { skillName: 'JavaScript', minScore: 75 },
      { skillName: 'HTML5 & Modern CSS', minScore: 75 },
      { skillName: 'Git & Version Control', minScore: 50 },
    ],
    perks: ['Pre-Placement Offer (PPO) worth ₹14 LPA', 'Flexible Hybrid Work Mode', 'Mentorship from Principal Engineers', 'Hardware & Learning Allowance'],
    applicantsCount: 42,
    postedDate: '3 days ago'
  },
  {
    id: 'opp-02',
    title: 'Full Stack Engineering Associate',
    company: {
      id: 'cmp-02',
      name: 'CloudBridge Technologies',
      initials: 'CB',
      location: 'Hyderabad, Telangana (Onsite)',
      verified: true,
      color: 'bg-indigo-600'
    },
    type: 'job',
    isRemote: false,
    location: 'Hyderabad (Onsite)',
    stipendSalary: '₹9.5L – ₹12.0L / year',
    deadline: '20 Sep 2026',
    eligibility: 'Graduating 2026 / Recent Graduates (0-1 yr exp)',
    description: 'CloudBridge Technologies is looking for high-caliber Full Stack Engineers to build resilient distributed web applications. You will work across the entire stack, from React frontends to Node.js microservices and PostgreSQL databases.',
    responsibilities: [
      'Design REST and GraphQL microservice endpoints with high concurrency handling.',
      'Construct stateful frontend applications utilizing modern React patterns and Tailwind.',
      'Author complex SQL queries, database migrations, and caching layers with Redis.',
      'Participate in code reviews and CI/CD automation pipelines.'
    ],
    requiredSkills: [
      { skillName: 'React.js', minScore: 70 },
      { skillName: 'JavaScript', minScore: 75 },
      { skillName: 'Node.js & Express', minScore: 65 },
      { skillName: 'SQL & Database Design', minScore: 65 },
      { skillName: 'Git & Version Control', minScore: 60 }
    ],
    perks: ['Health Insurance for Family', 'Annual Performance Bonus', 'Relocation Assistance', 'Dedicated Upskilling Budget'],
    applicantsCount: 78,
    postedDate: '1 week ago'
  },
  {
    id: 'opp-03',
    title: 'Data & Database Systems Intern',
    company: {
      id: 'cmp-03',
      name: 'DataSphere Labs',
      initials: 'DS',
      location: 'Pune, Maharashtra (Remote)',
      verified: true,
      color: 'bg-emerald-600'
    },
    type: 'internship',
    isRemote: true,
    location: 'Pune / Remote',
    duration: '4 Months',
    stipendSalary: '₹28,000 / month',
    deadline: '10 Sep 2026',
    eligibility: 'All Engineering & MCA Disciplines with Database Proficiency',
    description: 'DataSphere Labs is a leader in data pipeline automation. As an intern, you will help design relational data schemas, perform query optimizations, and build analytics ingestion workflows.',
    responsibilities: [
      'Analyze and optimize SQL queries for enterprise data warehouses.',
      'Assist in constructing automated data validation scripts and ETL pipelines.',
      'Work alongside data scientists to prepare clean structured datasets.'
    ],
    requiredSkills: [
      { skillName: 'SQL & Database Design', minScore: 70 },
      { skillName: 'Data Structures & Algorithms', minScore: 65 },
      { skillName: 'Technical Communication', minScore: 60 },
    ],
    perks: ['100% Remote Work', 'High Conversion Rate to Full-time', 'Certifications Sponsorship'],
    applicantsCount: 31,
    postedDate: '4 days ago'
  },
  {
    id: 'opp-04',
    title: 'Software Development Engineer in Test (SDET)',
    company: {
      id: 'cmp-04',
      name: 'InnoSoft Systems',
      initials: 'IS',
      location: 'Noida, NCR (Hybrid)',
      verified: true,
      color: 'bg-violet-600'
    },
    type: 'job',
    isRemote: false,
    location: 'Noida / NCR',
    stipendSalary: '₹8.0L – ₹10.5L / year',
    deadline: '28 Sep 2026',
    eligibility: 'B.Tech/BE graduating in 2026, minimum 7.0 CGPA',
    description: 'InnoSoft Systems is expanding its quality automation engineering team. You will write automated test frameworks in TypeScript and Node.js for scalable cloud SaaS services.',
    responsibilities: [
      'Build end-to-end integration and API testing suites.',
      'Integrate test harnesses into GitHub Actions CI/CD pipelines.',
      'Identify edge cases in complex asynchronous distributed workflows.'
    ],
    requiredSkills: [
      { skillName: 'JavaScript', minScore: 70 },
      { skillName: 'Node.js & Express', minScore: 60 },
      { skillName: 'Git & Version Control', minScore: 60 },
      { skillName: 'TypeScript', minScore: 60 }
    ],
    perks: ['Quarterly Hackathons', 'Stock Options (ESOPs)', 'Free Shuttle Service & Meals'],
    applicantsCount: 54,
    postedDate: '5 days ago'
  },
  {
    id: 'opp-05',
    title: 'Cloud DevOps Trainee Program',
    company: {
      id: 'cmp-05',
      name: 'NextGen Digital',
      initials: 'ND',
      location: 'Chennai, Tamil Nadu (Hybrid)',
      verified: true,
      color: 'bg-sky-600'
    },
    type: 'training',
    isRemote: false,
    location: 'Chennai (Hybrid)',
    duration: '3 Months Training + Guaranteed Placement',
    stipendSalary: '₹22,000 / month (stipend during training)',
    deadline: '05 Oct 2026',
    eligibility: 'Pre-final and Final Year Students passionate about Cloud Infrastructure',
    description: 'An industry-sponsored 3-month intensive apprenticeship program covering AWS infrastructure, Docker containerization, Kubernetes cluster management, and automated continuous delivery.',
    responsibilities: [
      'Complete guided hands-on cloud labs and infrastructure as code projects.',
      'Deploy containerized applications on AWS ECS and EKS.',
      'Collaborate with certified AWS architects on real-world industry migrations.'
    ],
    requiredSkills: [
      { skillName: 'Git & Version Control', minScore: 65 },
      { skillName: 'Technical Communication', minScore: 65 },
      { skillName: 'Data Structures & Algorithms', minScore: 60 }
    ],
    perks: ['Guaranteed Job Offer upon successful completion (₹8.2 LPA)', 'AWS Certified Solutions Architect Exam Voucher', 'Direct Executive Mentorship'],
    applicantsCount: 65,
    postedDate: '2 days ago'
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'crs-01',
    title: 'React 19 & Next.js: Component Mastery & State Optimization',
    provider: 'Industry Tech Academy',
    duration: '14 hours • 28 lessons',
    level: 'Intermediate',
    targetSkill: 'React.js',
    rating: 4.9,
    studentsEnrolled: 3420,
    thumbnailGradient: 'from-blue-600 to-cyan-500',
    description: 'Bridge your React proficiency gap. Master hooks under the hood, server components, reconciliation, memoization strategies, and state patterns.',
    url: '#',
    matchReason: 'Targeted to boost your React score from 58% to 75%+'
  },
  {
    id: 'crs-02',
    title: 'Mastering SQL: Indexes, Query Optimization & Schema Architecture',
    provider: 'DataSphere Engineering',
    duration: '10 hours • 20 lessons',
    level: 'Intermediate',
    targetSkill: 'SQL & Database Design',
    rating: 4.8,
    studentsEnrolled: 2890,
    thumbnailGradient: 'from-emerald-600 to-teal-500',
    description: 'Go beyond basic SELECT queries. Master EXPLAIN ANALYZE, B-tree indexes, CTEs, transactions, ACID compliance, and query performance tuning.',
    url: '#',
    matchReason: 'Required for Full Stack & Backend career requirements (Current 67% → Target 75%)'
  },
  {
    id: 'crs-03',
    title: 'Professional Git & GitHub: Branching Strategies & Merge Conflict Resolution',
    provider: 'DevOps Guild',
    duration: '6 hours • 12 lessons',
    level: 'Beginner',
    targetSkill: 'Git & Version Control',
    rating: 4.9,
    studentsEnrolled: 4120,
    thumbnailGradient: 'from-amber-600 to-orange-500',
    description: 'Unlock enterprise-grade version control skills: interactive rebasing, cherry-picking, Git hook automation, submodules, and clean commit history.',
    url: '#',
    matchReason: 'Critical gap: Increase your Git score from 43% to 65%+'
  },
  {
    id: 'crs-04',
    title: 'TypeScript for Enterprise React Development',
    provider: 'Frontend Masters Hub',
    duration: '12 hours • 24 lessons',
    level: 'Intermediate',
    targetSkill: 'TypeScript',
    rating: 4.9,
    studentsEnrolled: 2150,
    thumbnailGradient: 'from-indigo-600 to-blue-500',
    description: 'Generics, union types, conditional types, utility types, and typing complex React hooks & Redux/Zustand stores.',
    url: '#',
    matchReason: 'High demand in TechNova Solutions and CloudBridge job descriptions'
  }
];

import { COURSE_CONFIGS, COURSE_ASSESSMENTS } from './courseAssessments';

export { COURSE_CONFIGS, COURSE_ASSESSMENTS };

export const MOCK_ASSESSMENTS: Assessment[] = Object.values(COURSE_ASSESSMENTS);

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-01',
    opportunityId: 'opp-01',
    opportunityTitle: 'Frontend Developer Intern',
    opportunityType: 'internship',
    companyName: 'TechNova Solutions',
    companyInitials: 'TN',
    companyLocation: 'Bengaluru (Hybrid)',
    stipendSalary: '₹35,000 / month',
    studentId: 'usr-std-01',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@institution.edu.in',
    studentCollege: 'National Institute of Technology (NIT)',
    appliedDate: '24 Aug 2026',
    status: 'Shortlisted',
    matchScore: 89,
    matchingSkills: ['JavaScript (88%)', 'HTML5 & Modern CSS (92%)'],
    missingSkills: ['React.js (58% vs 65% req)', 'Git & Version Control (43% vs 50% req)'],
    notes: 'Technical portfolio reviewed by Engineering Manager. Round 1 Technical scheduled for Aug 29.'
  },
  {
    id: 'app-02',
    opportunityId: 'opp-02',
    opportunityTitle: 'Full Stack Engineering Associate',
    opportunityType: 'job',
    companyName: 'CloudBridge Technologies',
    companyInitials: 'CB',
    companyLocation: 'Hyderabad (Onsite)',
    stipendSalary: '₹9.5L – ₹12.0L / year',
    studentId: 'usr-std-01',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@institution.edu.in',
    studentCollege: 'National Institute of Technology (NIT)',
    appliedDate: '21 Aug 2026',
    status: 'Under Review',
    matchScore: 84,
    matchingSkills: ['JavaScript (88%)', 'Node.js & Express (72%)', 'SQL & Database Design (67%)'],
    missingSkills: ['React.js (58% vs 70% req)', 'Git & Version Control (43% vs 60% req)'],
    notes: 'Application undergoing resume & verified skill score verification.'
  },
  {
    id: 'app-03',
    opportunityId: 'opp-03',
    opportunityTitle: 'Data & Database Systems Intern',
    opportunityType: 'internship',
    companyName: 'DataSphere Labs',
    companyInitials: 'DS',
    companyLocation: 'Pune / Remote',
    stipendSalary: '₹28,000 / month',
    studentId: 'usr-std-01',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@institution.edu.in',
    studentCollege: 'National Institute of Technology (NIT)',
    appliedDate: '15 Aug 2026',
    status: 'Interview',
    matchScore: 91,
    matchingSkills: ['SQL & Database Design (67%)', 'Data Structures & Algorithms (84%)', 'Technical Communication (82%)'],
    missingSkills: [],
    notes: 'Passed initial screening test with 94% score. Managerial discussion scheduled.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Application Shortlisted!',
    message: 'TechNova Solutions shortlisted your application for Frontend Developer Intern.',
    time: '2 hours ago',
    read: false,
    type: 'application'
  },
  {
    id: 'notif-02',
    title: 'New High-Match Internship',
    message: '92% skill match found for Full Stack Engineering Associate at CloudBridge Technologies.',
    time: '1 day ago',
    read: false,
    type: 'match'
  },
  {
    id: 'notif-03',
    title: 'Skill Gap Milestone',
    message: 'Complete the React 19 Mastery course to increase your career readiness score to 85%.',
    time: '2 days ago',
    read: true,
    type: 'recommendation'
  },
  {
    id: 'notif-04',
    title: 'Assessment Verified',
    message: 'Your SQL & Database Design score (67%) has been officially verified by the department.',
    time: '5 days ago',
    read: true,
    type: 'assessment'
  }
];

export const MOCK_CANDIDATES = [
  {
    id: 'cand-01',
    name: 'Aarav Sharma',
    college: 'NIT Tiruchirappalli',
    degree: 'B.Tech CSE (2026)',
    cgpa: '8.84',
    readiness: 78,
    targetRole: 'Full Stack Developer',
    skills: [
      { name: 'JavaScript', score: 88 },
      { name: 'React.js', score: 58 },
      { name: 'SQL & Database', score: 67 },
      { name: 'Node.js', score: 72 },
      { name: 'Git', score: 43 }
    ],
    avatar: 'AS',
    status: 'Active Seeker',
    topProject: 'DevCollab — Realtime Collaborative Code Workspace',
    certificationsCount: 2
  },
  {
    id: 'cand-02',
    name: 'Rohan Verma',
    college: 'IIT Madras',
    degree: 'B.Tech CSE (2026)',
    cgpa: '9.12',
    readiness: 91,
    targetRole: 'Frontend Engineer',
    skills: [
      { name: 'React.js', score: 92 },
      { name: 'JavaScript', score: 95 },
      { name: 'TypeScript', score: 86 },
      { name: 'CSS/Tailwind', score: 90 },
      { name: 'Git', score: 82 }
    ],
    avatar: 'RV',
    status: 'Shortlisted',
    topProject: 'HyperUI — Accessible React Design System Engine',
    certificationsCount: 3
  },
  {
    id: 'cand-03',
    name: 'Meera Nambiar',
    college: 'BITS Pilani',
    degree: 'B.E. Computer Science (2026)',
    cgpa: '8.95',
    readiness: 87,
    targetRole: 'Data & Database Systems',
    skills: [
      { name: 'SQL & Database', score: 94 },
      { name: 'Data Structures', score: 89 },
      { name: 'Node.js', score: 78 },
      { name: 'Python', score: 91 },
      { name: 'Git', score: 76 }
    ],
    avatar: 'MN',
    status: 'Interview Scheduled',
    topProject: 'StreamLake — Distributed Data Partitioning Simulator',
    certificationsCount: 4
  },
  {
    id: 'cand-04',
    name: 'Tanmay Kulkarni',
    college: 'IIIT Hyderabad',
    degree: 'B.Tech IT (2026)',
    cgpa: '8.45',
    readiness: 82,
    targetRole: 'Cloud DevOps Engineer',
    skills: [
      { name: 'Git', score: 88 },
      { name: 'Docker/AWS', score: 85 },
      { name: 'Node.js', score: 74 },
      { name: 'Linux', score: 90 },
      { name: 'SQL', score: 68 }
    ],
    avatar: 'TK',
    status: 'Active Seeker',
    topProject: 'AutoDeploy — Zero Downtime Blue-Green Pipeline',
    certificationsCount: 2
  }
];

export const FACULTY_ANALYTICS = {
  department: 'Computer Science & Engineering',
  batch: 'Final Year (2022 - 2026)',
  totalStudents: 180,
  assessedStudents: 154, // 85.5%
  assessedPercentage: 86,
  averageSkillScore: 71.4,
  studentsWithSkillGaps: 48,
  internshipParticipation: 68,
  topGaps: [
    { skill: 'React.js & Modern UI', gapRate: 42, affectedStudents: 64, severity: 'High' },
    { skill: 'Git & Branching Workflows', gapRate: 38, affectedStudents: 58, severity: 'High' },
    { skill: 'SQL Optimization & Indexing', gapRate: 31, affectedStudents: 47, severity: 'Moderate' },
    { skill: 'TypeScript & Type Systems', gapRate: 45, affectedStudents: 69, severity: 'Critical' },
    { skill: 'Cloud Deployment (AWS/Docker)', gapRate: 52, affectedStudents: 80, severity: 'Critical' }
  ],
  topDemandedSkills: [
    { skill: 'React.js', demandScore: 96, openRoles: 38 },
    { skill: 'SQL & Database Design', demandScore: 92, openRoles: 44 },
    { skill: 'JavaScript / TypeScript', demandScore: 94, openRoles: 52 },
    { skill: 'Node.js & Backend APIs', demandScore: 88, openRoles: 31 },
    { skill: 'Git & CI/CD', demandScore: 85, openRoles: 29 }
  ],
  readinessTiers: [
    { tier: 'Advanced (80-100%)', count: 48, percentage: 31, color: 'bg-emerald-500' },
    { tier: 'Proficient (60-79%)', count: 68, percentage: 44, color: 'bg-blue-500' },
    { tier: 'Developing (40-59%)', count: 32, percentage: 21, color: 'bg-amber-500' },
    { tier: 'Beginner (0-39%)', count: 6, percentage: 4, color: 'bg-rose-500' }
  ]
};

export const ADMIN_KPIS = {
  totalStudents: 1420,
  studentsAssessed: 1210,
  assessedPercentage: 85.2,
  dailyStudentSignIns: 984,
  activeSignInsTodayPercentage: 69.3,
  totalStudentSignIns: 14820,
  activeIndustryPartners: 48,
  activeMoUs: 22,
  totalOpportunitiesPosted: 142,
  totalInternships: 84,
  totalJobs: 58,
  totalPlacements: 312,
  placementRate: 78.4,
  placementGrowth: 14.2,
  averagePackage: '₹8.9 LPA',
  highestPackage: '₹44.0 LPA',
  skillSupplyDemandIndex: 86.4,
  departments: [
    { name: 'Computer Science & Engineering', students: 360, avgReadiness: 76, placed: 142, placementRate: 84, activeSignIns: 298 },
    { name: 'Information Technology', students: 240, avgReadiness: 73, placed: 88, placementRate: 79, activeSignIns: 184 },
    { name: 'Electronics & Communication', students: 320, avgReadiness: 68, placed: 94, placementRate: 71, activeSignIns: 215 },
    { name: 'Data Science & AI', students: 180, avgReadiness: 81, placed: 74, placementRate: 88, activeSignIns: 152 },
    { name: 'Mechanical & Automation', students: 320, avgReadiness: 62, placed: 82, placementRate: 64, activeSignIns: 135 }
  ]
};

export interface StudentSignInRecord {
  id: string;
  studentName: string;
  rollNo: string;
  department: string;
  time: string;
  method: string;
  ip: string;
  status: 'Active Session' | 'Signed Out';
}

export const MOCK_STUDENT_SIGNINS: StudentSignInRecord[] = [
  { id: 'log-1', studentName: 'Aarav Sharma', rollNo: '21CS8042', department: 'Computer Science & Engg', time: '10 minutes ago', method: 'Institutional SSO (Google)', ip: '192.168.1.45', status: 'Active Session' },
  { id: 'log-2', studentName: 'Rohan Verma', rollNo: '21CS8015', department: 'Computer Science & Engg', time: '22 minutes ago', method: 'Email & Password', ip: '192.168.1.88', status: 'Active Session' },
  { id: 'log-3', studentName: 'Ananya Gupta', rollNo: '21IT7022', department: 'Information Technology', time: '45 minutes ago', method: 'Institutional SSO (Microsoft)', ip: '10.0.4.12', status: 'Active Session' },
  { id: 'log-4', studentName: 'Priya Nair', rollNo: '21DS9011', department: 'Data Science & AI', time: '1 hour ago', method: 'Google OAuth', ip: '10.0.4.55', status: 'Signed Out' },
  { id: 'log-5', studentName: 'Karthik Raja', rollNo: '21ECE504', department: 'Electronics & Comm', time: '2 hours ago', method: 'Institutional SSO (Google)', ip: '192.168.2.14', status: 'Active Session' },
  { id: 'log-6', studentName: 'Sneha Patel', rollNo: '21CS8099', department: 'Computer Science & Engg', time: '3 hours ago', method: 'Email & Password', ip: '192.168.1.102', status: 'Signed Out' },
  { id: 'log-7', studentName: 'Vikram Singh', rollNo: '21ME3012', department: 'Mechanical & Automation', time: '4 hours ago', method: 'Institutional SSO (Google)', ip: '10.0.8.21', status: 'Signed Out' },
];


export const INITIAL_PARTNERS: CorporatePartner[] = [
  {
    id: 'p-1',
    name: 'TechNova Solutions',
    initials: 'TN',
    color: 'bg-blue-600',
    location: 'Bengaluru, Karnataka',
    activePostings: 4,
    studentsHired: 42,
    mouTitle: 'Strategic Center of Excellence in Full Stack & Cloud',
    mouStatus: 'Active (2025-2028)',
    tier: 'Platinum Tier Partner'
  },
  {
    id: 'p-2',
    name: 'CloudBridge Technologies',
    initials: 'CB',
    color: 'bg-indigo-600',
    location: 'Hyderabad, Telangana',
    activePostings: 2,
    studentsHired: 28,
    mouTitle: 'Corporate Apprenticeship & Direct PPO Pathway',
    mouStatus: 'Active (2024-2027)',
    tier: 'Gold Tier Partner'
  },
  {
    id: 'p-3',
    name: 'DataSphere Labs',
    initials: 'DS',
    color: 'bg-emerald-600',
    location: 'Pune, Maharashtra',
    activePostings: 3,
    studentsHired: 19,
    mouTitle: 'Advanced Relational Database & Pipeline Engineering Lab',
    mouStatus: 'Active (2025-2027)',
    tier: 'Gold Tier Partner'
  },
  {
    id: 'p-4',
    name: 'InnoSoft Systems',
    initials: 'IS',
    color: 'bg-violet-600',
    location: 'Noida, NCR',
    activePostings: 2,
    studentsHired: 15,
    mouTitle: 'Software Quality Automation & SDET Training',
    mouStatus: 'Active (2025-2026)',
    tier: 'Silver Tier Partner'
  },
  {
    id: 'p-5',
    name: 'NextGen Digital',
    initials: 'ND',
    color: 'bg-sky-600',
    location: 'Chennai, Tamil Nadu',
    activePostings: 1,
    studentsHired: 24,
    mouTitle: 'Cloud DevOps & AWS Infrastructure Apprenticeship',
    mouStatus: 'Active (2024-2027)',
    tier: 'Gold Tier Partner'
  }
];

