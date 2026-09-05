export type UserRole = 'student' | 'industry' | 'faculty' | 'admin';

export type ProficiencyTier = 'beginner' | 'developing' | 'proficient' | 'advanced';

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  organization: string; // College name or Company name
  title?: string;
  location?: string;
  specialization?: string;
}

export interface SkillScore {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps & Cloud' | 'Core CS' | 'Soft Skills' | 'AI & Data';
  score: number; // 0-100
  verified: boolean;
  lastAssessed?: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  skill: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export type CourseCategoryId = 
  | 'fullstack' 
  | 'frontend' 
  | 'backend' 
  | 'devops' 
  | 'ai-data' 
  | 'data-analyst';

export interface CourseCategoryConfig {
  id: CourseCategoryId;
  title: string;
  demandTag: string; // e.g. 'Critical Demand', 'Very High', 'High'
  badge: string;
  skillsCovered: string[];
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number; // e.g. 60
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Assessment {
  id: string;
  courseCategoryId: CourseCategoryId;
  title: string;
  skillCategory: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  badge: string;
  skillsCovered: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: AssessmentQuestion[];
}

export interface RequiredSkill {
  skillName: string;
  requiredScore: number;
  weight?: number;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  avgReadiness: number; // calculated against current student
  demandLevel: 'High' | 'Very High' | 'Critical Demand';
  avgSalary: string;
  requiredSkills: RequiredSkill[];
  roadmapSteps: {
    step: number;
    title: string;
    description: string;
    skills: string[];
    status: 'completed' | 'in-progress' | 'upcoming';
  }[];
}

export interface Opportunity {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    initials: string;
    location: string;
    verified: boolean;
    color: string;
  };
  type: 'internship' | 'job' | 'training';
  isRemote: boolean;
  location: string;
  duration?: string;
  stipendSalary: string;
  deadline: string;
  eligibility: string;
  description: string;
  responsibilities: string[];
  requiredSkills: {
    skillName: string;
    minScore: number;
  }[];
  perks: string[];
  applicantsCount: number;
  postedDate: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  targetSkill: string;
  rating: number;
  studentsEnrolled: number;
  thumbnailGradient: string;
  description: string;
  url: string;
  matchReason?: string;
}

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  opportunityType: 'internship' | 'job' | 'training';
  companyName: string;
  companyInitials: string;
  companyLocation: string;
  stipendSalary: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  appliedDate: string;
  status: ApplicationStatus;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  notes?: string;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface StudentCertification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verified: boolean;
}

export interface StudentProfile {
  user: User;
  rollNo: string;
  department: string;
  batch: string;
  cgpa: string;
  bio: string;
  careerReadiness: number;
  careerReadinessDelta: number;
  targetCareerId: string;
  skills: SkillScore[];
  projects: StudentProject[];
  certifications: StudentCertification[];
  experience: {
    id: string;
    role: string;
    organization: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    grade: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'assessment' | 'application' | 'recommendation' | 'match';
}

export interface SkillGapItem {
  skillName: string;
  requiredScore: number;
  studentScore: number;
  status: 'strong' | 'moderate' | 'gap';
  gapDelta: number;
}

export interface CorporatePartner {
  id: string;
  name: string;
  initials: string;
  color: string;
  location: string;
  activePostings: number;
  studentsHired: number;
  mouTitle: string;
  mouStatus: string;
  tier: string;
}

