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
import { calculateOpportunityMatch, calculateSkillGaps, findMatchingSkill } from '../utils/skillMatcher';
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
  loginWithCredentials: (identifier: string, password?: string) => Promise<boolean>;
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
  }) => Promise<boolean>;
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
  const [lastAssessmentResult, setLastAssessmentResult] = useState<AssessmentResultData | null>(null);
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

        // Fetch live skills from Supabase
        const liveSkills = await SupabaseService.fetchSkills();
        if (liveSkills && liveSkills.length > 0) {
          setStudentProfile(prev => ({
            ...prev,
            skills: liveSkills
          }));
        }

        // Fetch live profile details if user logged in
        const currentUserId = currentUser?.id || 'usr-std-01';
        const liveProfile = await SupabaseService.fetchProfile(currentUserId);
        if (liveProfile) {
          setStudentProfile(prev => ({
            ...prev,
            ...liveProfile
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

  const loginWithCredentials = async (identifier: string, password?: string): Promise<boolean> => {
    const res = await SupabaseService.loginUser(identifier, password);
    if (res.success && res.user && res.role) {
      setCurrentUser(res.user);
      setCurrentRole(res.role);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      localStorage.setItem(`${STORAGE_KEY}_auth_session`, JSON.stringify({ user: res.user, role: res.role }));

      if (res.role === 'student') {
        const liveProfile = await SupabaseService.fetchProfile(res.user.id);
        if (liveProfile) {
          setStudentProfile(prev => ({
            ...prev,
            user: res.user!,
            ...liveProfile
          }));
        } else {
          setStudentProfile(prev => ({
            ...prev,
            user: res.user!
          }));
        }

        const liveSkills = await SupabaseService.fetchSkills();
        if (liveSkills && liveSkills.length > 0) {
          setStudentProfile(prev => ({
            ...prev,
            skills: liveSkills
          }));
        }
      }

      showToast('success', res.message, 'Authenticated with Supabase');
      return true;
    } else {
      showToast('error', res.message, 'Authentication Failed');
      return false;
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
  }): Promise<boolean> => {
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
          cgpa: userData.cgpa || undefined
        }));
      }

      showToast('success', `Welcome to SkillBridge, ${res.user.name}! Your account is stored in Supabase.`, 'Account Created');
      return true;
    } else {
      showToast('error', res.message, 'Registration Failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(`${STORAGE_KEY}_auth_session`);
    setIsLoggedIn(false);
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
    const assessment = MOCK_ASSESSMENTS.find(a => a.id === assessmentId) || MOCK_ASSESSMENTS[0];
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
      const sName = q.skill || 'General Skill';
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

    const calculatedScore = Math.round((correctCount / assessment.questions.length) * 100);
    const skillName = assessment.questions[0]?.skill || 'React.js';

    // Find old score for primary skill
    const existingSkill = findMatchingSkill(skillName, studentProfile.skills);
    const previousScore = existingSkill ? existingSkill.score : 50;

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
      const existing = uniqueSkillsMap.get(key);
      if (!existing || s.score > existing.score) {
        uniqueSkillsMap.set(key, s);
      }
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

    // Compute dynamic readiness score from skill gaps
    const gapAnalysis = calculateSkillGaps(targetCareer.requiredSkills, updatedSkills);
    const newReadiness = gapAnalysis.overallMatchScore;
    const oldReadiness = studentProfile.careerReadiness;
    const delta = newReadiness - oldReadiness;

    const updatedProfile: StudentProfile = {
      ...studentProfile,
      targetCareerId: newTargetCareerId,
      careerReadiness: newReadiness,
      careerReadinessDelta: delta !== 0 ? delta : 5,
      skills: updatedSkills
    };

    const passingScore = assessment.passingScore || 60;
    const isPassed = calculatedScore >= passingScore;
    const incorrectAnswersCount = assessment.questions.length - correctCount;
    const skillLevel = calculatedScore >= 80 ? 'Advanced' : calculatedScore >= 60 ? 'Intermediate' : 'Developing';

    // Persist to Supabase
    SupabaseService.saveProfile(updatedProfile);
    SupabaseService.recordAssessmentResult(
      assessmentId,
      studentProfile.user.id,
      skillName,
      calculatedScore,
      isPassed,
      timeSpentSeconds,
      questionResults
    );

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

    setLastAssessmentResult(resultData);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
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

  const applyToOpportunity = (opportunityId: string, notes?: string): boolean => {
    const opp = opportunities.find(o => o.id === opportunityId);
    if (!opp) return false;

    // Check if already applied
    const alreadyApplied = applications.some(a => a.opportunityId === opportunityId && a.studentId === currentUser.id);
    if (alreadyApplied) {
      showToast('warning', 'You have already submitted an application for this opportunity.', 'Already Applied');
      return false;
    }

    const match = calculateOpportunityMatch(opp, studentProfile.skills);

    const newApplication: Application = {
      id: `app-${Date.now()}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      opportunityType: opp.type,
      companyName: opp.company.name,
      companyInitials: opp.company.initials,
      companyLocation: opp.location,
      stipendSalary: opp.stipendSalary,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      studentCollege: studentProfile.education[0]?.institution || 'NIT',
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
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
    localStorage.removeItem(`${STORAGE_KEY}_opps`);
    localStorage.removeItem(`${STORAGE_KEY}_apps`);
    localStorage.removeItem(`${STORAGE_KEY}_partners`);
    localStorage.removeItem(`${STORAGE_KEY}_notifs`);
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
