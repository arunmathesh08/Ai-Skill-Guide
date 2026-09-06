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
  DEMO_USERS,
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
   * Register a new user and store in Supabase profiles & students tables
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
      const cleanEmail = userData.email.trim().toLowerCase();
      const cleanUsername = userData.username.trim().toLowerCase().replace(/^@/, '');

      // 1. Check for duplicate email or username in Supabase profiles & students tables
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('id, email, username')
        .or(`email.ilike."${cleanEmail}",username.ilike."${cleanUsername}"`);

      if (existingProfiles && existingProfiles.length > 0) {
        const isEmailMatch = existingProfiles.some(u => u.email?.toLowerCase() === cleanEmail);
        if (isEmailMatch) {
          return { success: false, message: 'An account with this email address already exists. Please sign in.' };
        }
        return { success: false, message: 'This username is already taken. Please choose a different username.' };
      }

      // 2. Create Supabase Auth Account
      let authUserId = `usr-${userData.role.slice(0, 3)}-${Date.now()}`;
      try {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: cleanEmail,
          password: userData.password || 'password123',
          options: {
            data: {
              name: userData.name.trim(),
              username: cleanUsername,
              role: userData.role
            }
          }
        });

        if (authData?.user?.id) {
          authUserId = authData.user.id;
          console.log('[Supabase Auth] Created Auth account. User ID:', authUserId);
        } else if (authErr && !authErr.message.includes('already registered')) {
          console.warn('[Supabase Auth SignUp Notice]:', authErr.message);
        }
      } catch (authException) {
        console.warn('[Supabase Auth Exception]:', authException);
      }

      const initials = userData.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      // 3. Insert profile into public.profiles using auth.users.id
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .upsert({
          id: authUserId,
          name: userData.name.trim(),
          username: cleanUsername,
          email: cleanEmail,
          password: userData.password || 'password123',
          role: userData.role,
          organization: userData.organization.trim(),
          title: userData.title || (userData.role === 'student' ? 'Student' : 'Professional'),
          avatar: initials,
          roll_no: userData.rollNo || null,
          department: userData.department || null,
          batch: userData.batch || null,
          cgpa: userData.cgpa || null,
          bio: userData.bio || `Registered ${userData.role} on SkillBridge.`,
          location: userData.location || null,
          specialization: userData.specialization || null,
          career_readiness: userData.role === 'student' ? 75 : 90,
          career_readiness_delta: 5,
          target_career_id: 'cp-fullstack'
        })
        .select()
        .single();

      if (profileErr || !profileData) {
        console.error('[Supabase Register Profile Error]:', profileErr);
        return { success: false, message: profileErr?.message || 'Failed to save profile in Supabase.' };
      }

      // 4. Save into public.students table if role is student
      if (userData.role === 'student') {
        try {
          await supabase.from('students').upsert({
            id: authUserId,
            name: userData.name.trim(),
            username: cleanUsername,
            email: cleanEmail
          });
          console.log('[Supabase] Saved student record to public.students table with auth.users.id');
        } catch (studentErr) {
          console.warn('[Supabase Students Table Notice]:', studentErr);
        }
      }

      const registeredUser: User = {
        id: profileData.id,
        name: profileData.name,
        username: profileData.username,
        email: profileData.email,
        role: profileData.role as UserRole,
        organization: profileData.organization,
        title: profileData.title,
        avatar: profileData.avatar,
        location: profileData.location,
        specialization: profileData.specialization
      };

      // 5. Create initial default verified skills for new students
      if (userData.role === 'student') {
        const defaultSkills = [
          { id: `sk-js-${authUserId.slice(-6)}`, student_id: authUserId, name: 'JavaScript', category: 'Frontend', score: 75, verified: true, last_assessed: 'Recently' },
          { id: `sk-react-${authUserId.slice(-6)}`, student_id: authUserId, name: 'React.js', category: 'Frontend', score: 65, verified: false, last_assessed: 'Recently' },
          { id: `sk-sql-${authUserId.slice(-6)}`, student_id: authUserId, name: 'SQL & Database Design', category: 'Database', score: 60, verified: false, last_assessed: 'Recently' },
        ];
        await supabase.from('skills').upsert(defaultSkills);
      }

      console.log('[Supabase Service] User registered successfully in Supabase Cloud:', registeredUser.email);
      return { success: true, user: registeredUser, message: 'Account created successfully in Supabase!' };
    } catch (err: any) {
      console.error('[Supabase Register Exception]:', err);
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

      // 1. Try Supabase Auth SignInWithPassword if email pattern
      if (cleanIdent.includes('@') && password) {
        try {
          const { data: signInData } = await supabase.auth.signInWithPassword({
            email: cleanIdent,
            password
          });
          if (signInData?.user?.id) {
            const { data: authProf } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', signInData.user.id)
              .single();

            if (authProf) {
              const authUser: User = {
                id: authProf.id,
                name: authProf.name,
                username: authProf.username,
                email: authProf.email,
                role: authProf.role as UserRole,
                organization: authProf.organization,
                title: authProf.title,
                avatar: authProf.avatar || 'SB',
                location: authProf.location,
                specialization: authProf.specialization
              };
              return {
                success: true,
                user: authUser,
                role: authProf.role as UserRole,
                message: `Welcome back, ${authProf.name}!`
              };
            }
          }
        } catch (authErr) {
          console.warn('[Supabase Auth SignIn Notice]:', authErr);
        }
      }

      // 2. Search via Supabase Client Profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`email.ilike."${cleanIdent}",username.ilike."${cleanIdent}"`)
        .limit(1);

      if (!error && data && data.length > 0) {
        const userRecord = data[0];

        if (password && userRecord.password && userRecord.password !== password) {
          return { success: false, message: 'Incorrect password. Please check your password and try again.' };
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
      const matchedDemoKey = (Object.keys(DEMO_USERS) as UserRole[]).find((key) => {
        const u = DEMO_USERS[key];
        return u.email.toLowerCase() === cleanIdent || u.username?.toLowerCase() === cleanIdent;
      });

      if (matchedDemoKey) {
        const matchedDemo = DEMO_USERS[matchedDemoKey];
        return {
          success: true,
          user: matchedDemo,
          role: matchedDemoKey,
          message: `Welcome back, ${matchedDemo.name}!`
        };
      }

      return { success: false, message: 'User not found. Please check your username or email address.' };
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
        user: {
          id: data.id,
          name: data.name,
          username: data.username,
          email: data.email,
          role: data.role as UserRole,
          organization: data.organization,
          title: data.title || 'Student',
          avatar: data.avatar || 'SB',
          location: data.location || undefined,
          specialization: data.specialization || undefined
        },
        careerReadiness: data.career_readiness,
        careerReadinessDelta: data.career_readiness_delta,
        targetCareerId: data.target_career_id,
        rollNo: data.roll_no || undefined,
        department: data.department || undefined,
        batch: data.batch || undefined,
        cgpa: data.cgpa || undefined,
        bio: data.bio || undefined,
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

