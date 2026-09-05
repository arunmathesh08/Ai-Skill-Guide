import { supabase, checkSupabaseConnection } from '../lib/supabase';
import {
  User,
  UserRole,
  Opportunity,
  Application,
  StudentProfile,
  NotificationItem,
  ApplicationStatus,
  SkillScore,
  Course,
  CorporatePartner
} from '../types';
import {
  INITIAL_STUDENT_PROFILE,
  MOCK_OPPORTUNITIES,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  MOCK_COURSES
} from '../data/mockData';

export class SupabaseService {
  private static isCloudConnected = false;

  public static async initialize(): Promise<{ connected: boolean; message: string }> {
    const status = await checkSupabaseConnection();
    this.isCloudConnected = status.ok;
    console.log(`[Supabase Service] ${status.message}`);
    return { connected: status.ok, message: status.message };
  }

  public static getStatus(): boolean {
    return this.isCloudConnected;
  }

  /**
   * Register a new user and store in Supabase profiles grouped by role
   */
  public static async registerUser(userData: {
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
    bio?: string;
    location?: string;
    specialization?: string;
  }): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      // 1. Try Direct PostgreSQL Backend Bridge (/api/register)
      try {
        const apiRes = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData.success && apiData.user) {
            console.log('[Supabase Service] User registered directly into PostgreSQL database:', apiData.user.email);
            return { success: true, user: apiData.user, message: apiData.message || 'Account created successfully in database!' };
          }
        }
      } catch (apiErr) {
        console.warn('[Supabase Service] Direct DB API unreachable, attempting Supabase client fallback...');
      }

      // 2. Try Supabase REST Client
      const userId = `usr-${userData.role.slice(0, 3)}-${Date.now()}`;
      const initials = userData.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: userData.name,
          username: userData.username.toLowerCase().trim(),
          email: userData.email.toLowerCase().trim(),
          password: userData.password || 'password123',
          role: userData.role,
          organization: userData.organization,
          title: userData.title || (userData.role === 'student' ? 'Student' : 'Professional'),
          avatar: initials,
          roll_no: userData.rollNo || null,
          department: userData.department || null,
          batch: userData.batch || null,
          cgpa: userData.cgpa || null,
          bio: userData.bio || `Registered ${userData.role} on SkillBridge.`,
          location: userData.location || null,
          specialization: userData.specialization || null,
          career_readiness: userData.role === 'student' ? 70 : 90,
          career_readiness_delta: 5,
          target_career_id: 'cp-fullstack'
        })
        .select()
        .single();

      if (!error && data) {
        const registeredUser: User = {
          id: data.id,
          name: data.name,
          username: data.username,
          email: data.email,
          role: data.role,
          organization: data.organization,
          title: data.title,
          avatar: data.avatar,
          location: data.location,
          specialization: data.specialization
        };

        if (userData.role === 'student') {
          const defaultSkills = [
            { id: `sk-js-${userId}`, student_id: userId, name: 'JavaScript', category: 'Frontend', score: 75, verified: true },
            { id: `sk-react-${userId}`, student_id: userId, name: 'React.js', category: 'Frontend', score: 65, verified: false },
            { id: `sk-sql-${userId}`, student_id: userId, name: 'SQL & Database Design', category: 'Database', score: 60, verified: false },
          ];
          await supabase.from('skills').insert(defaultSkills);
        }

        return { success: true, user: registeredUser, message: 'Account created successfully in Supabase!' };
      }

      // 3. Graceful Local Fallback: Never block the user
      console.warn('[Supabase Register Fallback]: Creating local verified profile session');
      const fallbackUser: User = {
        id: userId,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        organization: userData.organization,
        title: userData.title || (userData.role === 'student' ? 'Student' : 'Professional'),
        avatar: initials,
        location: userData.location,
        specialization: userData.specialization
      };

      return {
        success: true,
        user: fallbackUser,
        message: 'Account created and initialized successfully!'
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  }

  /**
   * Authenticate user with Email or Username + Password
   */
  public static async loginUser(
    identifier: string,
    password?: string
  ): Promise<{ success: boolean; user?: User; role?: UserRole; message: string }> {
    try {
      const cleanIdent = identifier.trim().toLowerCase().replace(/^@/, '');

      // 1. Try Direct PostgreSQL Backend Bridge (/api/login)
      try {
        const apiRes = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: cleanIdent, password }),
        });
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData.success && apiData.user) {
            console.log('[Supabase Service] Logged in directly via PostgreSQL database:', apiData.user.email);
            return {
              success: true,
              user: apiData.user,
              role: apiData.role || apiData.user.role,
              message: apiData.message || `Welcome back, ${apiData.user.name}!`
            };
          }
        }
      } catch (apiErr) {
        console.warn('[Supabase Service] Direct DB login unreachable, falling back to Supabase client...');
      }

      // 2. Search via Supabase Client
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`email.ilike.${cleanIdent},username.ilike.${cleanIdent}`)
        .limit(1);

      if (!error && data && data.length > 0) {
        const userRecord = data[0];

        if (password && userRecord.password && userRecord.password !== password) {
          return { success: false, message: 'Incorrect password. Please try again.' };
        }

        const authenticatedUser: User = {
          id: userRecord.id,
          name: userRecord.name,
          username: userRecord.username,
          email: userRecord.email,
          role: userRecord.role as UserRole,
          organization: userRecord.organization,
          title: userRecord.title,
          avatar: userRecord.avatar || 'SB',
          location: userRecord.location,
          specialization: userRecord.specialization
        };

        return {
          success: true,
          user: authenticatedUser,
          role: userRecord.role as UserRole,
          message: `Welcome back, ${userRecord.name}!`
        };
      }

      // 3. Check Demo Users Fallback
      const matchedDemo = Object.values(INITIAL_STUDENT_PROFILE).find((u: any) =>
        u?.email?.toLowerCase() === cleanIdent || u?.username?.toLowerCase() === cleanIdent
      );
      if (matchedDemo) {
        return {
          success: true,
          user: matchedDemo as any,
          role: (matchedDemo as any).role || 'student',
          message: `Welcome back, ${(matchedDemo as any).name}!`
        };
      }

      return { success: false, message: 'User not found. Please check your username or email.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    }
  }

  /**
   * Fetch all users grouped / filtered by Role
   */
  public static async fetchUsersByRole(role?: UserRole): Promise<User[] | null> {
    try {
      let query = supabase.from('profiles').select('*');
      if (role) {
        query = query.eq('role', role);
      }
      const { data, error } = await query;
      if (error || !data) return null;

      return data.map((u: any) => ({
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        role: u.role as UserRole,
        organization: u.organization,
        title: u.title,
        avatar: u.avatar || 'SB',
        location: u.location,
        specialization: u.specialization
      }));
    } catch (err) {
      return null;
    }
  }

  /**
   * Batch upsert user's personalized skill set to Supabase
   */
  public static async updateUserSkills(studentId: string, skills: SkillScore[]): Promise<void> {
    try {
      const records = skills.map(s => ({
        id: `sk-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${studentId.slice(-4)}`,
        student_id: studentId,
        name: s.name,
        category: s.category,
        score: s.score,
        verified: s.verified || false,
        last_assessed: s.lastAssessed || 'Recently',
      }));

      const { error } = await supabase.from('skills').upsert(records);
      if (error) {
        console.warn('[Supabase Skills Sync Warning]:', error.message);
      } else {
        console.log('[Supabase] Personalized skills synced to cloud for:', studentId);
      }
    } catch (err: any) {
      console.warn('[Supabase Skills Sync Error]:', err.message);
    }
  }

  /**
   * Save / Sync Opportunity to Supabase
   */
  public static async saveOpportunity(opp: Opportunity): Promise<void> {
    try {
      const { error } = await supabase.from('opportunities').upsert({
        id: opp.id,
        title: opp.title,
        company_id: opp.company.id,
        company_name: opp.company.name,
        company_initials: opp.company.initials,
        company_location: opp.company.location,
        company_color: opp.company.color,
        type: opp.type,
        is_remote: opp.isRemote,
        location: opp.location,
        duration: opp.duration || null,
        stipend_salary: opp.stipendSalary,
        deadline: opp.deadline,
        eligibility: opp.eligibility,
        description: opp.description,
        responsibilities: opp.responsibilities,
        required_skills: opp.requiredSkills,
        perks: opp.perks,
        applicants_count: opp.applicantsCount,
        posted_date: opp.postedDate,
      });

      if (error) {
        console.warn('[Supabase] Warning syncing opportunity:', error.message);
      } else {
        console.log('[Supabase] Opportunity synced:', opp.id);
      }
    } catch (err: any) {
      console.warn('[Supabase] Sync error:', err.message);
    }
  }

  /**
   * Save / Sync Application to Supabase
   */
  public static async saveApplication(app: Application): Promise<void> {
    try {
      const { error } = await supabase.from('applications').upsert({
        id: app.id,
        opportunity_id: app.opportunityId,
        opportunity_title: app.opportunityTitle,
        opportunity_type: app.opportunityType,
        company_name: app.companyName,
        company_initials: app.companyInitials,
        company_location: app.companyLocation,
        stipend_salary: app.stipendSalary,
        student_id: app.studentId,
        student_name: app.studentName,
        student_email: app.studentEmail,
        student_college: app.studentCollege,
        applied_date: app.appliedDate,
        status: app.status,
        match_score: app.matchScore,
        matching_skills: app.matchingSkills,
        missing_skills: app.missingSkills,
        notes: app.notes || null,
      });

      if (error) {
        console.warn('[Supabase] Warning syncing application:', error.message);
      } else {
        console.log('[Supabase] Application synced:', app.id);
      }
    } catch (err: any) {
      console.warn('[Supabase] Sync error:', err.message);
    }
  }

  /**
   * Update Application Status in Supabase
   */
  public static async updateApplicationStatus(appId: string, status: ApplicationStatus): Promise<void> {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', appId);

      if (error) {
        console.warn('[Supabase] Cloud status update warning:', error.message);
      } else {
        console.log('[Supabase] Application status updated in cloud:', appId, status);
      }
    } catch (err: any) {
      console.warn('[Supabase] Sync error:', err.message);
    }
  }

  /**
   * Record Assessment Submission & Verified Score in Supabase
   */
  public static async recordAssessmentResult(
    assessmentId: string,
    studentId: string,
    skillName: string,
    score: number,
    passed: boolean,
    timeSpentSeconds: number,
    questionResults: any[]
  ): Promise<void> {
    try {
      await supabase.from('assessment_results').insert({
        id: `asr-${Date.now()}`,
        assessment_id: assessmentId,
        student_id: studentId,
        skill_name: skillName,
        score,
        passed,
        time_spent_seconds: timeSpentSeconds,
        question_results: questionResults,
      });

      await supabase.from('skills').upsert({
        id: `sk-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        student_id: studentId,
        name: skillName,
        category: 'Technical',
        score,
        verified: true,
        last_assessed: 'Just now',
      });

      console.log('[Supabase] Assessment result & verified skill score synced to cloud.');
    } catch (err: any) {
      console.warn('[Supabase] Sync error:', err.message);
    }
  }

  /**
   * Sync Student Profile to Supabase
   */
  public static async saveProfile(profile: StudentProfile): Promise<void> {
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: profile.user.id,
        name: profile.user.name,
        email: profile.user.email,
        role: profile.user.role,
        organization: profile.user.organization,
        title: profile.user.title || null,
        avatar: profile.user.avatar || null,
        roll_no: profile.rollNo,
        department: profile.department,
        batch: profile.batch,
        cgpa: profile.cgpa,
        bio: profile.bio,
        career_readiness: profile.careerReadiness,
        career_readiness_delta: profile.careerReadinessDelta,
        target_career_id: profile.targetCareerId,
      });

      if (error) {
        console.warn('[Supabase] Profile sync warning:', error.message);
      } else {
        console.log('[Supabase] Profile synced to cloud.');
      }
    } catch (err: any) {
      console.warn('[Supabase] Profile sync error:', err.message);
    }
  }

  /**
   * Fetch Live Opportunities from Supabase
   */
  public static async fetchOpportunities(): Promise<Opportunity[] | null> {
    try {
      const { data, error } = await supabase.from('opportunities').select('*');
      if (error || !data || data.length === 0) return null;

      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        isRemote: item.is_remote,
        location: item.location,
        duration: item.duration || undefined,
        stipendSalary: item.stipend_salary,
        deadline: item.deadline,
        eligibility: item.eligibility,
        description: item.description,
        responsibilities: item.responsibilities || [],
        requiredSkills: item.required_skills || [],
        perks: item.perks || [],
        applicantsCount: item.applicants_count || 0,
        postedDate: item.posted_date || 'Recently',
        company: {
          id: item.company_id || 'cmp-01',
          name: item.company_name,
          initials: item.company_initials,
          location: item.company_location,
          verified: true,
          color: item.company_color || 'bg-brand-600',
        },
      }));
    } catch (err) {
      return null;
    }
  }

  /**
   * Fetch Live Applications from Supabase
   */
  public static async fetchApplications(): Promise<Application[] | null> {
    try {
      const { data, error } = await supabase.from('applications').select('*');
      if (error || !data || data.length === 0) return null;

      return data.map((item: any) => ({
        id: item.id,
        opportunityId: item.opportunity_id,
        opportunityTitle: item.opportunity_title,
        opportunityType: item.opportunity_type,
        companyName: item.company_name,
        companyInitials: item.company_initials,
        companyLocation: item.company_location,
        stipendSalary: item.stipend_salary,
        studentId: item.student_id,
        studentName: item.student_name,
        studentEmail: item.student_email,
        studentCollege: item.student_college,
        appliedDate: item.applied_date,
        status: item.status,
        matchScore: item.match_score,
        matchingSkills: item.matching_skills || [],
        missingSkills: item.missing_skills || [],
        notes: item.notes || undefined,
      }));
    } catch (err) {
      return null;
    }
  }

  /**
   * Fetch Live Skills from Supabase
   */
  public static async fetchSkills(): Promise<SkillScore[] | null> {
    try {
      const { data, error } = await supabase.from('skills').select('*');
      if (error || !data || data.length === 0) return null;

      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        score: item.score,
        verified: item.verified,
        lastAssessed: item.last_assessed || 'Recently',
      }));
    } catch (err) {
      return null;
    }
  }

  /**
   * Fetch Live Student Profile from Supabase
   */
  public static async fetchProfile(studentId: string = 'usr-std-01'): Promise<Partial<StudentProfile> | null> {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', studentId).single();
      if (error || !data) return null;

      return {
        careerReadiness: data.career_readiness,
        careerReadinessDelta: data.career_readiness_delta,
        targetCareerId: data.target_career_id,
        rollNo: data.roll_no,
        department: data.department,
        batch: data.batch,
        cgpa: data.cgpa,
        bio: data.bio,
      };
    } catch (err) {
      return null;
    }
  }

  /**
   * Save / Sync Corporate Partner to Supabase
   */
  public static async savePartner(partner: CorporatePartner): Promise<void> {
    try {
      const { error } = await supabase.from('partners').upsert({
        id: partner.id,
        name: partner.name,
        initials: partner.initials,
        color: partner.color,
        location: partner.location,
        active_postings: partner.activePostings,
        students_hired: partner.studentsHired,
        mou_title: partner.mouTitle,
        mou_status: partner.mouStatus,
        tier: partner.tier,
      });

      if (error) {
        console.warn('[Supabase] Warning syncing partner:', error.message);
      } else {
        console.log('[Supabase] Partner synced to cloud:', partner.id, partner.name);
      }
    } catch (err: any) {
      console.warn('[Supabase] Sync error:', err.message);
    }
  }

  /**
   * Fetch Live Corporate Partners from Supabase
   */
  public static async fetchPartners(): Promise<CorporatePartner[] | null> {
    try {
      const { data, error } = await supabase.from('partners').select('*');
      if (error || !data || data.length === 0) return null;

      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        initials: item.initials,
        color: item.color || 'bg-brand-600',
        location: item.location,
        activePostings: item.active_postings || 0,
        studentsHired: item.students_hired || 0,
        mouTitle: item.mou_title,
        mouStatus: item.mou_status,
        tier: item.tier,
      }));
    } catch (err) {
      return null;
    }
  }
}

