import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  StudentProfile,
  Opportunity,
  Application,
  NotificationItem,
  ApplicationStatus,
  Assessment,
  CorporatePartner,
  SkillScore
} from '../types';
import {
  DEMO_USERS,
  INITIAL_STUDENT_PROFILE,
  MOCK_OPPORTUNITIES,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  MOCK_ASSESSMENTS,
  INITIAL_PARTNERS,
  CAREER_PATHS
} from '../data/mockData';
import { COURSE_ASSESSMENTS } from '../data/courseAssessments';
import { calculateCareerReadiness, calculateOpportunityMatch, calculateSkillGaps, findMatchingSkill } from '../utils/skillMatcher';
import { formatSalary } from '../utils/salaryUtils';
import { SupabaseService } from '../services/supabaseService';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
}

export interface AssessmentResultData {
  assessment: Assessment;
  courseCategoryId?: string;
  courseCategoryTitle?: string;
  totalQuestions: number;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  calculatedScore: number;
  previousScore: number;
  passingScore: number;
  timeSpentSeconds: number;
  skillName: string;
  passed: boolean;
  skillLevel: string;
  skillBreakdown: {
    skill: string;
    total: number;
    correct: number;
    percentage: number;
  }[];
  questionResults: {
    question: string;
    selectedOption: string;
    correctOption: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  isLoggedIn: boolean;
  activeTab: string;
  selectedOpportunityId: string | null;
  selectedCareerId: string | null;
  activeAssessmentId: string | null;
  lastAssessmentResult: AssessmentResultData | null;
  studentProfile: StudentProfile;
  opportunities: Opportunity[];
  applications: Application[];
  notifications: NotificationItem[];
  partners: CorporatePartner[];
  toasts: ToastNotification[];
  searchTerm: string;
  isSupabaseConnected: boolean;
  supabaseStatusText: string;
  setSearchTerm: (term: string) => void;
  loginAs: (role: UserRole) => void;
  loginWithCredentials: (identifier: string, password?: string) => Promise<{ success: boolean; message: string }>;
  registerWithCredentials: (userData: {
    name: string;
    username: string;
    email: string;
    password?: string;
    role: UserRole;
    organization: string;
    title?: string;
    rollNo?: string;
    department?: string;
    batch?: string;
    cgpa?: string;
    location?: string;
    specialization?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  navigateTo: (
    tab: string,
    params?: { opportunityId?: string; careerId?: string; assessmentId?: string }
  ) => void;
  submitAssessment: (assessmentId: string, answers: Record<string, number>, timeSpentSeconds: number) => void;
  applyToOpportunity: (opportunityId: string, notes?: string) => boolean;
  updateApplicationStatus: (applicationId: string, newStatus: ApplicationStatus) => void;
  postOpportunity: (newOpp: Omit<Opportunity, 'id' | 'postedDate' | 'applicantsCount'>) => void;
  addPartner: (newPartner: Omit<CorporatePartner, 'id' | 'studentsHired' | 'activePostings'>) => void;
  updateTargetCareer: (careerId: string) => void;
  updateFullProfileAndPreferences: (
    profileData: Partial<StudentProfile>,
    customSkills?: SkillScore[]
  ) => Promise<void>;
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  hasTakenAssessment: boolean;
  reassessSkill: (skillName: string, newScore: number) => void;
  completeBridgeCourse: (skillName: string) => void;
  setDemoProfileState: (preset: 'low' | 'medium' | 'high' | 'unassessed') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  showToast: (type: 'success' | 'info' | 'warning' | 'error', message: string, title?: string) => void;
  removeToast: (id: string) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'skillbridge_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authSession, setAuthSession] = useState<{ user: User; role: UserRole } | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_auth_session`);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!authSession);
  const [currentRole, setCurrentRole] = useState<UserRole>(() => authSession?.role || 'student');
  const [currentUser, setCurrentUser] = useState<User>(() => authSession?.user || DEMO_USERS.student);
  const [activeTab, setActiveTab] = useState<string>(authSession ? 'dashboard' : 'landing');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>('cp-fullstack');
  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>('asm-react');
  const [lastAssessmentResult, setLastAssessmentResult] = useState<AssessmentResultData | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_last_assessment_result`);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);
  const [supabaseStatusText, setSupabaseStatusText] = useState<string>('Supabase Cloud Syncing...');

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_student`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_opps`);
    return saved ? JSON.parse(saved) : MOCK_OPPORTUNITIES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_apps`);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [partners, setPartners] = useState<CorporatePartner[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_partners`);
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    if (lastAssessmentResult) {
      localStorage.setItem(`${STORAGE_KEY}_last_assessment_result`, JSON.stringify(lastAssessmentResult));
    }
  }, [lastAssessmentResult]);

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('skillbridge_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('skillbridge_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initialize Supabase Connection & Hydrate Live Data on Mount
  useEffect(() => {
    async function initSupabase() {
      const res = await SupabaseService.initialize();
      setIsSupabaseConnected(res.connected);
      setSupabaseStatusText(res.message);
      if (res.connected) {
        // Fetch live opportunities from Supabase
        const liveOpps = await SupabaseService.fetchOpportunities();
        if (liveOpps && liveOpps.length > 0) {
          setOpportunities(liveOpps);
        }

        // Fetch live applications from Supabase
        const liveApps = await SupabaseService.fetchApplications();
        if (liveApps && liveApps.length > 0) {
          setApplications(liveApps);
        }

        // Fetch live corporate partners from Supabase
        const livePartners = await SupabaseService.fetchPartners();
        if (livePartners && livePartners.length > 0) {
          setPartners(livePartners);
        }

        // Check live assessment status & skills for authenticated user
        const currentUserId = currentUser?.id || 'usr-std-01';
        const asrStatus = await SupabaseService.fetchUserAssessmentStatus(currentUserId);
        const liveProfile = await SupabaseService.fetchProfile(currentUserId);
        const userSkills = await SupabaseService.fetchUserSkills(currentUserId);
        const isAssessed = asrStatus.hasTakenAssessment || Boolean(userSkills && userSkills.some(s => s.verified));

        if (isAssessed) {
          setStudentProfile(prev => {
            const targetId = liveProfile?.targetCareerId || prev.targetCareerId || 'cp-fullstack';
            const targetCareer = CAREER_PATHS.find(c => c.id === targetId) || CAREER_PATHS[0];
            const skillsToUse = userSkills && userSkills.length > 0 ? userSkills : prev.skills;
            const dynamicReadiness = calculateCareerReadiness(targetCareer, skillsToUse, true);

            return {
              ...prev,
              ...(liveProfile || {}),
              hasTakenAssessment: true,
              careerReadiness: dynamicReadiness,
              skills: skillsToUse,
              assessmentHistory: asrStatus.results || prev.assessmentHistory || []
            };
          });
        } else if (liveProfile) {
          setStudentProfile(prev => ({
            ...prev,
            ...liveProfile,
            hasTakenAssessment: false,
            careerReadiness: 0,
            skills: userSkills && userSkills.length > 0 ? userSkills : []
          }));
        }

        showToast('success', 'Connected to Supabase PostgreSQL (ysqggazrfrmpvxqzmyru). Real-time persistence active.', 'Supabase Cloud Live');
      }
    }
    initSupabase();
  }, []);

  // Persist state changes locally & sync with Supabase
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_student`, JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_opps`, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_apps`, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_partners`, JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifs`, JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (type: 'success' | 'info' | 'warning' | 'error', message: string, title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loginAs = (role: UserRole) => {
    const user = DEMO_USERS[role];
    setCurrentRole(role);
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    localStorage.setItem(`${STORAGE_KEY}_auth_session`, JSON.stringify({ user, role }));
    showToast('success', `Signed in as ${user.name} (${role.toUpperCase()})`, 'Authentication Successful');
  };

  const loginWithCredentials = async (identifier: string, password?: string): Promise<{ success: boolean; message: string }> => {
    const res = await SupabaseService.loginUser(identifier, password);
    if (res.success && res.user && res.role) {
      setCurrentUser(res.user);
      setCurrentRole(res.role);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      localStorage.setItem(`${STORAGE_KEY}_auth_session`, JSON.stringify({ user: res.user, role: res.role }));

      if (res.role === 'student') {
        const asrStatus = await SupabaseService.fetchUserAssessmentStatus(res.user.id);
        const liveProfile = await SupabaseService.fetchProfile(res.user.id);
        const userSkills = await SupabaseService.fetchUserSkills(res.user.id);

        const isAssessed = asrStatus.hasTakenAssessment || Boolean(userSkills && userSkills.some(s => s.verified));

        setStudentProfile(prev => {
          const targetId = liveProfile?.targetCareerId || prev.targetCareerId || 'cp-fullstack';
          const targetCareer = CAREER_PATHS.find(c => c.id === targetId) || CAREER_PATHS[0];
          const skillsToUse = userSkills && userSkills.length > 0 ? userSkills : (isAssessed ? prev.skills : []);
          const dynamicReadiness = isAssessed ? calculateCareerReadiness(targetCareer, skillsToUse, true) : 0;

          return {
            ...prev,
            user: res.user!,
            ...(liveProfile || {}),
            hasTakenAssessment: isAssessed,
            careerReadiness: dynamicReadiness,
            careerReadinessDelta: isAssessed ? (liveProfile?.careerReadinessDelta || 0) : 0,
            skills: skillsToUse,
            assessmentHistory: asrStatus.results || []
          };
        });
      }

      showToast('success', res.message, 'Authenticated with Supabase');
      return { success: true, message: res.message };
    } else {
      showToast('error', res.message, 'Authentication Failed');
      return { success: false, message: res.message };
    }
  };

  const registerWithCredentials = async (userData: {
    name: string;
    username: string;
    email: string;
    password?: string;
    role: UserRole;
    organization: string;
    title?: string;
    rollNo?: string;
    department?: string;
    batch?: string;
    cgpa?: string;
    location?: string;
    specialization?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const res = await SupabaseService.registerUser(userData);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setCurrentRole(userData.role);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      localStorage.setItem(`${STORAGE_KEY}_auth_session`, JSON.stringify({ user: res.user, role: userData.role }));

      if (userData.role === 'student') {
        setStudentProfile(prev => ({
          ...prev,
          user: res.user!,
          rollNo: userData.rollNo || undefined,
          department: userData.department || undefined,
          batch: userData.batch || undefined,
          cgpa: userData.cgpa || undefined,
          hasTakenAssessment: false,
          careerReadiness: 0,
          careerReadinessDelta: 0,
          skills: [],
          assessmentHistory: []
        }));
        setLastAssessmentResult(null);
        localStorage.removeItem(`${STORAGE_KEY}_last_assessment_result`);
      }

      showToast('success', `Welcome to SkillBridge, ${res.user.name}! Your account is stored in Supabase.`, 'Account Created');
      return { success: true, message: res.message };
    } else {
      showToast('error', res.message, 'Registration Failed');
      return { success: false, message: res.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(`${STORAGE_KEY}_auth_session`);
    localStorage.removeItem(`${STORAGE_KEY}_last_assessment_result`);
    localStorage.removeItem(`${STORAGE_KEY}_student`);
    setIsLoggedIn(false);
    setLastAssessmentResult(null);
    setStudentProfile(INITIAL_STUDENT_PROFILE);
    setActiveTab('landing');
    showToast('info', 'You have been logged out of SkillBridge.', 'Logged Out');
  };

  const navigateTo = (
    tab: string,
    params?: { opportunityId?: string; careerId?: string; assessmentId?: string }
  ) => {
    setActiveTab(tab);
    if (params?.opportunityId) setSelectedOpportunityId(params.opportunityId);
    if (params?.careerId) setSelectedCareerId(params.careerId);
    if (params?.assessmentId) setActiveAssessmentId(params.assessmentId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateTargetCareer = (careerId: string) => {
    const updated = {
      ...studentProfile,
      targetCareerId: careerId
    };
    setStudentProfile(updated);
    SupabaseService.saveProfile(updated);
    showToast('info', 'Target career role updated for skill gap analysis.', 'Target Updated');
  };

  const updateFullProfileAndPreferences = async (
    profileData: Partial<StudentProfile>,
    customSkills?: SkillScore[]
  ) => {
    const targetId = profileData.targetCareerId || studentProfile.targetCareerId;
    const skillsToUse = customSkills && customSkills.length > 0 ? customSkills : studentProfile.skills;
    const targetCareer = CAREER_PATHS.find(c => c.id === targetId) || CAREER_PATHS[0];
    const gapAnalysis = calculateSkillGaps(targetCareer.requiredSkills, skillsToUse);
    const calculatedReadiness = gapAnalysis.overallMatchScore;

    const updatedProfile: StudentProfile = {
      ...studentProfile,
      ...profileData,
      targetCareerId: targetId,
      careerReadiness: calculatedReadiness,
      careerReadinessDelta: 6,
      skills: skillsToUse,
      user: {
        ...studentProfile.user,
        ...(profileData.user || {}),
        name: profileData.user?.name || studentProfile.user.name,
        organization: profileData.user?.organization || studentProfile.user.organization,
      }
    };

    setStudentProfile(updatedProfile);
    if (profileData.user?.name) {
      setCurrentUser(prev => ({
        ...prev,
        name: profileData.user!.name,
        organization: profileData.user!.organization || prev.organization,
      }));
    }

    // Persist to Supabase
    await SupabaseService.saveProfile(updatedProfile);
    if (customSkills && customSkills.length > 0) {
      await SupabaseService.updateUserSkills(updatedProfile.user.id, customSkills);
    }

    showToast('success', 'Your custom profile and personalized skill intelligence feed have been generated!', 'Personalized Feed Live');
  };

  const submitAssessment = (
    assessmentId: string,
    answers: Record<string, number>,
    timeSpentSeconds: number
  ) => {
    const assessment =
      Object.values(COURSE_ASSESSMENTS).find(a => a.id === assessmentId || a.courseCategoryId === assessmentId) ||
      COURSE_ASSESSMENTS[assessmentId] ||
      MOCK_ASSESSMENTS.find(a => a.id === assessmentId) ||
      Object.values(COURSE_ASSESSMENTS)[0];

    let correctCount = 0;

    const questionResults = assessment.questions.map((q) => {
      const selectedOptionIdx = answers[q.id];
      const isCorrect = selectedOptionIdx === q.correctOptionIndex;
      if (isCorrect) correctCount++;
      return {
        question: q.question,
        selectedOption: selectedOptionIdx !== undefined ? q.options[selectedOptionIdx] : 'Not answered',
        correctOption: q.options[q.correctOptionIndex],
        isCorrect,
        explanation: q.explanation
      };
    });

    // Calculate per-skill breakdown from questions
    const skillCounts: Record<string, { total: number; correct: number }> = {};
    assessment.questions.forEach((q) => {
      const isCorr = answers[q.id] === q.correctOptionIndex;
      const sName = q.skill || assessment.skillCategory || 'Domain Skill';
      if (!skillCounts[sName]) {
        skillCounts[sName] = { total: 0, correct: 0 };
      }
      skillCounts[sName].total += 1;
      if (isCorr) skillCounts[sName].correct += 1;
    });

    const skillBreakdown = Object.keys(skillCounts).map(sName => {
      const { total, correct } = skillCounts[sName];
      return {
        skill: sName,
        total,
        correct,
        percentage: Math.round((correct / total) * 100)
      };
    });

    const totalQuestions = assessment.questions.length || 1;
    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    const skillName = assessment.questions[0]?.skill || assessment.skillCategory || 'Domain Skill';

    // Find old score for primary skill
    const existingSkill = findMatchingSkill(skillName, studentProfile.skills);
    const previousScore = existingSkill ? existingSkill.score : 0;

    // Update student skills in profile for all skills tested in breakdown
    let updatedSkillList = [...studentProfile.skills];
    skillBreakdown.forEach(sb => {
      const matched = findMatchingSkill(sb.skill, updatedSkillList);
      if (matched) {
        updatedSkillList = updatedSkillList.map(s => {
          if (s.name.toLowerCase().trim() === matched.name.toLowerCase().trim()) {
            return {
              ...s,
              score: sb.percentage,
              verified: true,
              lastAssessed: 'Just now'
            };
          }
          return s;
        });
      } else {
        updatedSkillList.push({
          id: `sk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: sb.skill,
          category: (assessment.skillCategory as any) || 'Domain Skill',
          score: sb.percentage,
          verified: true,
          lastAssessed: 'Just now'
        });
      }
    });

    const uniqueSkillsMap = new Map<string, typeof studentProfile.skills[0]>();
    updatedSkillList.forEach(s => {
      const key = s.name.trim().toLowerCase();
      uniqueSkillsMap.set(key, s);
    });
    const updatedSkills = Array.from(uniqueSkillsMap.values());

    // Map course category to target career path
    const courseToCareerMap: Record<string, string> = {
      'data-analyst': 'cp-data-analyst',
      'fullstack': 'cp-fullstack',
      'frontend': 'cp-frontend',
      'backend': 'cp-backend',
      'devops': 'cp-cloud-devops',
      'ai-data': 'cp-ai-ml'
    };
    const newTargetCareerId = courseToCareerMap[assessment.courseCategoryId] || studentProfile.targetCareerId || 'cp-fullstack';
    const targetCareer = CAREER_PATHS.find(c => c.id === newTargetCareerId) || CAREER_PATHS[0];

    // Calculate delta against old readiness
    const oldReadiness = studentProfile.careerReadiness || 0;
    const delta = calculatedScore - oldReadiness;

    const passingScore = assessment.passingScore || 60;
    const isPassed = calculatedScore >= passingScore;
    const incorrectAnswersCount = assessment.questions.length - correctCount;
    const skillLevel = calculatedScore >= 80 ? 'Advanced' : calculatedScore >= 60 ? 'Intermediate' : 'Developing';

    const newAssessmentRecord = {
      id: `rec-${Date.now()}`,
      assessmentId,
      courseCategoryId: assessment.courseCategoryId,
      title: assessment.title,
      completedAt: 'Just now',
      score: calculatedScore,
      passed: isPassed,
      skillScores: skillBreakdown.reduce((acc, sb) => ({ ...acc, [sb.skill]: sb.percentage }), {})
    };

    const updatedProfile: StudentProfile = {
      ...studentProfile,
      targetCareerId: newTargetCareerId,
      careerReadiness: calculatedScore,
      careerReadinessDelta: delta,
      hasTakenAssessment: true,
      assessmentHistory: [newAssessmentRecord, ...(studentProfile.assessmentHistory || [])],
      skills: updatedSkills
    };

    setSelectedCareerId(newTargetCareerId);

    const resultData: AssessmentResultData = {
      assessment,
      courseCategoryId: assessment.courseCategoryId,
      courseCategoryTitle: assessment.title,
      totalQuestions: assessment.questions.length,
      correctAnswersCount: correctCount,
      incorrectAnswersCount,
      calculatedScore,
      previousScore,
      passingScore,
      timeSpentSeconds,
      skillName,
      passed: isPassed,
      skillLevel,
      skillBreakdown,
      questionResults
    };

    // Persist to state and storage
    setStudentProfile(updatedProfile);
    setLastAssessmentResult(resultData);
    localStorage.setItem(`${STORAGE_KEY}_student`, JSON.stringify(updatedProfile));
    localStorage.setItem(`${STORAGE_KEY}_last_assessment_result`, JSON.stringify(resultData));

    SupabaseService.saveProfile(updatedProfile);
    SupabaseService.recordAssessmentResult(
      assessmentId,
      studentProfile.user.id,
      skillName,
      calculatedScore,
      isPassed,
      timeSpentSeconds,
      questionResults,
      skillBreakdown,
      calculatedScore,
      newTargetCareerId
    );

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: studentProfile.user.id,
      title: `Assessment Completed: ${assessment.title}`,
      message: `You scored ${calculatedScore}% in ${assessment.title}. Your skill profile and readiness scores have been recalibrated!`,
      time: 'Just now',
      read: false,
      type: 'assessment'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('success', `Completed ${assessment.title} with score ${calculatedScore}%!`, 'Skill Verified & Cloud Synced');
    navigateTo('skill-results');
  };

  // 12. RE-ASSESSMENT LOOP: Re-assess a specific skill to boost score & shrink gaps
  const reassessSkill = (skillName: string, newScore: number) => {
    let updatedSkillList = [...studentProfile.skills];
    const matched = findMatchingSkill(skillName, updatedSkillList);
    const oldScore = matched ? matched.score : 0;

    if (matched) {
      updatedSkillList = updatedSkillList.map(s => {
        if (s.name.toLowerCase().trim() === matched.name.toLowerCase().trim()) {
          return {
            ...s,
            score: newScore,
            verified: true,
            lastAssessed: 'Just now'
          };
        }
        return s;
      });
    } else {
      updatedSkillList.push({
        id: `sk-${Date.now()}`,
        name: skillName,
        category: 'Frontend',
        score: newScore,
        verified: true,
        lastAssessed: 'Just now'
      });
    }

    const targetCareer = CAREER_PATHS.find(c => c.id === studentProfile.targetCareerId) || CAREER_PATHS[0];
    const gapAnalysis = calculateSkillGaps(targetCareer.requiredSkills, updatedSkillList, targetCareer.title, true);
    const newReadiness = gapAnalysis.overallMatchScore;
    const delta = newReadiness - studentProfile.careerReadiness;

    const updatedProfile: StudentProfile = {
      ...studentProfile,
      skills: updatedSkillList,
      careerReadiness: newReadiness,
      careerReadinessDelta: delta,
      hasTakenAssessment: true
    };

    setStudentProfile(updatedProfile);
    SupabaseService.saveProfile(updatedProfile);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: studentProfile.user.id,
      title: `Re-assessment Verified: ${skillName}`,
      message: `Your ${skillName} score increased from ${oldScore}% to ${newScore}%. Career readiness recalibrated to ${newReadiness}%.`,
      time: 'Just now',
      read: false,
      type: 'assessment'
    };
    setNotifications(prev => [notif, ...prev]);
    showToast('success', `Re-assessed ${skillName}: Verified score is now ${newScore}%!`, 'Skill Recalibrated');
  };

  // 10. BRIDGE COURSES: Complete a bridge course module
  const completeBridgeCourse = (skillName: string) => {
    const existing = findMatchingSkill(skillName, studentProfile.skills);
    const currentScore = existing ? existing.score : 40;
    // Boost score by +25% up to 88%
    const boostedScore = Math.min(92, Math.max(78, currentScore + 25));
    reassessSkill(skillName, boostedScore);
    showToast('success', `Congratulations! You completed the ${skillName} Bridge Course. Skill score updated to ${boostedScore}%.`, 'Bridge Course Completed');
  };

  // Preset demo states for testing Low, Medium, High & Unassessed profiles
  const setDemoProfileState = (preset: 'low' | 'medium' | 'high' | 'unassessed') => {
    let presetSkills: SkillScore[] = [];
    let hasAssessed = true;

    if (preset === 'low') {
      presetSkills = [
        { id: 'sk-js', name: 'JavaScript', category: 'Frontend', score: 42, verified: true, lastAssessed: 'Today' },
        { id: 'sk-html-css', name: 'HTML5 & Modern CSS', category: 'Frontend', score: 62, verified: true, lastAssessed: 'Today' },
        { id: 'sk-react', name: 'React.js', category: 'Frontend', score: 35, verified: true, lastAssessed: 'Today' },
        { id: 'sk-sql', name: 'SQL & Database Design', category: 'Database', score: 30, verified: true, lastAssessed: 'Today' },
        { id: 'sk-git', name: 'Git & Version Control', category: 'DevOps & Cloud', score: 38, verified: true, lastAssessed: 'Today' },
        { id: 'sk-node', name: 'Node.js & Express', category: 'Backend', score: 25, verified: true, lastAssessed: 'Today' },
        { id: 'sk-ts', name: 'TypeScript', category: 'Frontend', score: 30, verified: true, lastAssessed: 'Today' },
        { id: 'sk-dsa', name: 'Data Structures & Algorithms', category: 'Core CS', score: 45, verified: true, lastAssessed: 'Today' }
      ];
    } else if (preset === 'medium') {
      presetSkills = [
        { id: 'sk-js', name: 'JavaScript', category: 'Frontend', score: 75, verified: true, lastAssessed: 'Today' },
        { id: 'sk-html-css', name: 'HTML5 & Modern CSS', category: 'Frontend', score: 85, verified: true, lastAssessed: 'Today' },
        { id: 'sk-react', name: 'React.js', category: 'Frontend', score: 65, verified: true, lastAssessed: 'Today' },
        { id: 'sk-sql', name: 'SQL & Database Design', category: 'Database', score: 60, verified: true, lastAssessed: 'Today' },
        { id: 'sk-git', name: 'Git & Version Control', category: 'DevOps & Cloud', score: 65, verified: true, lastAssessed: 'Today' },
        { id: 'sk-node', name: 'Node.js & Express', category: 'Backend', score: 58, verified: true, lastAssessed: 'Today' },
        { id: 'sk-ts', name: 'TypeScript', category: 'Frontend', score: 60, verified: true, lastAssessed: 'Today' },
        { id: 'sk-dsa', name: 'Data Structures & Algorithms', category: 'Core CS', score: 70, verified: true, lastAssessed: 'Today' }
      ];
    } else if (preset === 'high') {
      presetSkills = [
        { id: 'sk-js', name: 'JavaScript', category: 'Frontend', score: 92, verified: true, lastAssessed: 'Today' },
        { id: 'sk-html-css', name: 'HTML5 & Modern CSS', category: 'Frontend', score: 95, verified: true, lastAssessed: 'Today' },
        { id: 'sk-react', name: 'React.js', category: 'Frontend', score: 88, verified: true, lastAssessed: 'Today' },
        { id: 'sk-sql', name: 'SQL & Database Design', category: 'Database', score: 85, verified: true, lastAssessed: 'Today' },
        { id: 'sk-git', name: 'Git & Version Control', category: 'DevOps & Cloud', score: 86, verified: true, lastAssessed: 'Today' },
        { id: 'sk-node', name: 'Node.js & Express', category: 'Backend', score: 84, verified: true, lastAssessed: 'Today' },
        { id: 'sk-ts', name: 'TypeScript', category: 'Frontend', score: 88, verified: true, lastAssessed: 'Today' },
        { id: 'sk-dsa', name: 'Data Structures & Algorithms', category: 'Core CS', score: 90, verified: true, lastAssessed: 'Today' }
      ];
    } else {
      presetSkills = [];
      hasAssessed = false;
    }

    const targetCareer = CAREER_PATHS.find(c => c.id === studentProfile.targetCareerId) || CAREER_PATHS[0];
    const gapAnalysis = calculateSkillGaps(targetCareer.requiredSkills, presetSkills, targetCareer.title, hasAssessed);

    const updatedProfile: StudentProfile = {
      ...studentProfile,
      hasTakenAssessment: hasAssessed,
      careerReadiness: gapAnalysis.overallMatchScore,
      careerReadinessDelta: 0,
      skills: presetSkills
    };

    setStudentProfile(updatedProfile);
    SupabaseService.saveProfile(updatedProfile);
    showToast('info', `Switched profile state to: ${preset.toUpperCase()}`, 'Profile State Updated');
  };

  const applyToOpportunity = (opportunityId: string, notes?: string): boolean => {
    const opp = opportunities.find(o => o.id === opportunityId);
    if (!opp) return false;

    // Check if already applied
    const alreadyApplied = applications.some(a => a.opportunityId === opportunityId && a.studentId === currentUser.id);
    if (alreadyApplied) {
      showToast('warning', 'You have already submitted an application for this opportunity.', 'Already Applied');
      return false;
    }

    const match = calculateOpportunityMatch(opp, studentProfile.skills, studentProfile.hasTakenAssessment);

    const newApplication: Application = {
      id: `app-${Date.now()}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      opportunityType: opp.type,
      companyName: opp.company.name,
      companyInitials: opp.company.initials,
      companyLocation: opp.location,
      stipendSalary: formatSalary(opp.stipendSalary),
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      studentCollege: studentProfile.education[0]?.institution || currentUser.organization || 'NIT',
      appliedDate: 'Today',
      status: 'Applied',
      matchScore: match.matchPercentage,
      matchingSkills: match.strongSkills.map(s => `${s} (Verified)`),
      missingSkills: match.missingSkills.map(s => `${s} (Gap)`),
      notes: notes || 'Application submitted with verified skill badge.'
    };

    setApplications(prev => [newApplication, ...prev]);

    // Increment applicant count on opportunity
    setOpportunities(prev =>
      prev.map(o => (o.id === opportunityId ? { ...o, applicantsCount: o.applicantsCount + 1 } : o))
    );

    // Sync to Supabase
    SupabaseService.saveApplication(newApplication);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Application Submitted!',
      message: `Successfully applied to ${opp.title} at ${opp.company.name}. Record saved to Supabase cloud.`,
      time: 'Just now',
      read: false,
      type: 'application'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('success', `Your application for ${opp.title} at ${opp.company.name} was submitted!`, 'Applied Successfully');
    return true;
  };

  const updateApplicationStatus = (applicationId: string, newStatus: ApplicationStatus) => {
    setApplications(prev =>
      prev.map(app => (app.id === applicationId ? { ...app, status: newStatus } : app))
    );

    // Sync to Supabase
    SupabaseService.updateApplicationStatus(applicationId, newStatus);

    const app = applications.find(a => a.id === applicationId);
    if (app) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: app.studentId,
        title: `Status Updated: ${app.opportunityTitle}`,
        message: `Your application status at ${app.companyName} is now "${newStatus}".`,
        time: 'Just now',
        read: false,
        type: 'application'
      };
      setNotifications(prev => [notif, ...prev]);
    }

    showToast('info', `Candidate status changed to "${newStatus}" and updated in Supabase cloud`, 'Pipeline Updated');
  };

  const postOpportunity = (newOppData: Omit<Opportunity, 'id' | 'postedDate' | 'applicantsCount'>) => {
    const newOpp: Opportunity = {
      ...newOppData,
      id: `opp-${Date.now()}`,
      postedDate: 'Just now',
      applicantsCount: 0
    };

    setOpportunities(prev => [newOpp, ...prev]);

    // Sync to Supabase
    SupabaseService.saveOpportunity(newOpp);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Opportunity Published',
      message: `New posting "${newOpp.title}" is now active and stored in Supabase.`,
      time: 'Just now',
      read: false,
      type: 'recommendation'
    };
    setNotifications(prev => [notif, ...prev]);

    showToast('success', `Published "${newOpp.title}" to discovery board and Supabase database!`, 'Opportunity Live');
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => (n.id === notifId ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev =>
      prev.map(n => (!n.userId || n.userId === currentUser.id ? { ...n, read: true } : n))
    );
    showToast('info', 'All notifications marked as read.');
  };

  const addPartner = (newPartnerData: Omit<CorporatePartner, 'id' | 'studentsHired' | 'activePostings'>) => {
    const newPartner: CorporatePartner = {
      ...newPartnerData,
      id: `p-${Date.now()}`,
      studentsHired: 0,
      activePostings: 1
    };

    setPartners(prev => [newPartner, ...prev]);

    // Sync to Supabase table
    SupabaseService.savePartner(newPartner);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Industry MoU Registered',
      message: `Partner "${newPartner.name}" has been registered and synced with Supabase.`,
      time: 'Just now',
      read: false,
      type: 'recommendation'
    };
    setNotifications(prev => [notif, ...prev]);

    showToast('success', `Registered industry MoU with ${newPartner.name}. Data saved in Supabase!`, 'Industry Partner Added');
  };

  const resetToDefaults = () => {
    localStorage.removeItem(`${STORAGE_KEY}_student`);
    localStorage.removeItem(`${STORAGE_KEY}_last_assessment_result`);
    localStorage.removeItem(`${STORAGE_KEY}_opps`);
    localStorage.removeItem(`${STORAGE_KEY}_apps`);
    localStorage.removeItem(`${STORAGE_KEY}_partners`);
    localStorage.removeItem(`${STORAGE_KEY}_notifs`);
    setLastAssessmentResult(null);
    setStudentProfile(INITIAL_STUDENT_PROFILE);
    setOpportunities(MOCK_OPPORTUNITIES);
    setApplications(INITIAL_APPLICATIONS);
    setPartners(INITIAL_PARTNERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('info', 'Reset all demo data to default baseline.', 'Data Reset');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        isLoggedIn,
        activeTab,
        selectedOpportunityId,
        selectedCareerId,
        activeAssessmentId,
        lastAssessmentResult,
        studentProfile,
        opportunities,
        applications,
        notifications,
        partners,
        toasts,
        searchTerm,
        isSupabaseConnected,
        supabaseStatusText,
        setSearchTerm,
        loginAs,
        loginWithCredentials,
        registerWithCredentials,
        logout,
        navigateTo,
        submitAssessment,
        applyToOpportunity,
        updateApplicationStatus,
        postOpportunity,
        addPartner,
        updateTargetCareer,
        updateFullProfileAndPreferences,
        markNotificationAsRead,
        markAllNotificationsRead,
        hasTakenAssessment: Boolean(studentProfile.hasTakenAssessment && studentProfile.skills.length > 0),
        reassessSkill,
        completeBridgeCourse,
        setDemoProfileState,
        theme,
        toggleTheme,
        setTheme,
        showToast,
        removeToast,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
