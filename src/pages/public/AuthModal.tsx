import React, { useState } from 'react';
import {
  User,
  Building,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AtSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'student'
}) => {
  const { loginWithCredentials, registerWithCredentials, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Role-Specific Fields
  const [organization, setOrganization] = useState('');
  const [title, setTitle] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [batch, setBatch] = useState('2022 - 2026');
  const [cgpa, setCgpa] = useState('8.8 / 10');
  const [location, setLocation] = useState('Bengaluru, Karnataka (Hybrid)');
  const [specialization, setSpecialization] = useState('Full Stack & Cloud Systems');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast('warning', 'Please enter your username or email address.');
      return;
    }

    setIsLoading(true);
    const success = await loginWithCredentials(loginIdentifier, loginPassword);
    setIsLoading(false);

    if (success) {
      onClose();
    }
  };

  const handleEmailChange = (val: string) => {
    setSignupEmail(val);
    const prefix = val.split('@')[0];
    if (prefix) {
      if (!username) {
        setUsername(prefix.toLowerCase().replace(/[^a-z0-9._-]/g, ''));
      }
      if (!fullName) {
        setFullName(prefix.charAt(0).toUpperCase() + prefix.slice(1));
      }
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    setAuthErrorMessage(null);

    const emailPrefix = signupEmail.split('@')[0] || 'user';
    const finalName = fullName.trim() || (emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
    const finalUsername = (username.trim() || emailPrefix).toLowerCase().replace(/^@/, '');

    if (!signupEmail.trim() || !signupPassword) {
      const msg = 'Please enter your email address and password.';
      setAuthErrorMessage(msg);
      showToast('warning', msg);
      return;
    }

    // Password Mismatch Guard
    if (signupPassword !== confirmPassword) {
      const msg = 'Password mismatch. The re-typed password must match.';
      setAuthErrorMessage(msg);
      showToast('error', msg);
      return;
    }

    if (signupPassword.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setAuthErrorMessage(msg);
      showToast('warning', msg);
      return;
    }

    setIsLoading(true);
    const success = await registerWithCredentials({
      name: finalName,
      username: finalUsername,
      email: signupEmail.trim().toLowerCase(),
      password: signupPassword,
      role: selectedRole,
      organization: organization.trim() || (selectedRole === 'student' ? 'Kongu Engineering College (KEC)' : 'TechNova Solutions'),
      title: title.trim() || (selectedRole === 'student' ? 'Student' : 'Talent Lead'),
      rollNo: rollNo.trim() || '25CSR011',
      department: department.trim() || 'Computer Science & Engineering',
      batch: batch.trim() || '2022 - 2026',
      cgpa: cgpa.trim() || '8.8 / 10',
      location: location.trim(),
      specialization: specialization.trim()
    });
    setIsLoading(false);

    if (success) {
      setAuthErrorMessage(null);
      onClose();
    }
  };

  const rolesList: { role: UserRole; title: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'student',
      title: 'Student / Candidate',
      icon: <User className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      role: 'industry',
      title: 'Industry Recruiter',
      icon: <Building className="w-5 h-5" />,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      role: 'faculty',
      title: 'Academic Mentor',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    },
    {
      role: 'admin',
      title: 'Institution Admin',
      icon: <ShieldCheck className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activeTab === 'login' ? 'Sign In to SkillBridge' : 'Create SkillBridge Account'}
      subtitle="Smart Skill-to-Industry Integration Portal"
      maxWidth="2xl"
    >
      <div className="space-y-5 text-sm">
        {/* Navigation Tabs: Sign In / Create Account */}
        <div className="flex border border-slate-200 bg-slate-100/90 p-1.5 rounded-xl shadow-2xs">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 text-center text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In with Credentials
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2.5 text-center text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* TAB 1: SIGN IN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                Username or Email Address *
              </label>
              <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 focus-within:bg-white transition-all overflow-hidden">
                <span className="pl-3.5 pr-2 text-slate-400 shrink-0 flex items-center">
                  <AtSign className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={e => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. Vijay or Vijay@gmail.com"
                  className="w-full py-2.5 sm:py-3 pr-3 text-xs sm:text-sm bg-transparent border-0 focus:outline-none font-medium text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">Password *</label>
              </div>
              <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 focus-within:bg-white transition-all overflow-hidden">
                <span className="pl-3.5 pr-2 text-slate-400 shrink-0 flex items-center">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full py-2.5 sm:py-3 pr-2 text-xs sm:text-sm bg-transparent border-0 focus:outline-none font-medium text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3.5 pl-2 text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full font-bold shadow-md shadow-brand-500/20 py-3 text-sm"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Sign In to Portal
              </Button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-brand-600 font-bold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            </div>
          </form>
        )}

        {/* TAB 2: SIGN UP */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                1. Select your Role *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {rolesList.map(r => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setSelectedRole(r.role)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRole === r.role
                        ? 'border-brand-500 bg-brand-50/70 shadow-xs ring-2 ring-brand-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${r.color}`}>{r.icon}</div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900">{r.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Vijay"
                  className="w-full px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 font-medium placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Choose Username *</label>
                <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500 focus-within:bg-white transition-all overflow-hidden">
                  <span className="pl-3.5 pr-1.5 text-slate-400 font-bold text-xs shrink-0">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="vijay"
                    className="w-full py-2.5 sm:py-3 pr-3 text-xs sm:text-sm bg-transparent border-0 focus:outline-none font-mono placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Email Address *</label>
              <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500 focus-within:bg-white transition-all overflow-hidden">
                <span className="pl-3.5 pr-2 text-slate-400 shrink-0 flex items-center">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={e => handleEmailChange(e.target.value)}
                  placeholder="vijay@institution.edu.in"
                  className="w-full py-2.5 sm:py-3 pr-3 text-xs sm:text-sm bg-transparent border-0 focus:outline-none font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password & Confirm Password with Real-Time Error Highlighting */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    Password * <span className="text-[11px] text-slate-400 font-normal">(min 6 chars)</span>
                  </label>
                  <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500 focus-within:bg-white transition-all overflow-hidden">
                    <span className="pl-3.5 pr-2 text-slate-400 shrink-0 flex items-center">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full py-2.5 sm:py-3 pr-2 text-xs sm:text-sm bg-transparent border-0 focus:outline-none font-medium placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="pr-3 pl-2 text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div
                    className={`flex items-center rounded-xl transition-all overflow-hidden ${
                      confirmPassword.length > 0 && signupPassword !== confirmPassword
                        ? 'bg-rose-50/70 border-2 border-rose-500 ring-2 ring-rose-300'
                        : confirmPassword.length > 0 && signupPassword === confirmPassword
                        ? 'bg-emerald-50/60 border-2 border-emerald-500'
                        : 'bg-slate-50 border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500 focus-within:bg-white'
                    }`}
                  >
                    <span
                      className={`pl-3.5 pr-2 shrink-0 flex items-center ${
                        confirmPassword.length > 0 && signupPassword !== confirmPassword
                          ? 'text-rose-600'
                          : confirmPassword.length > 0 && signupPassword === confirmPassword
                          ? 'text-emerald-600'
                          : 'text-slate-400'
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full py-2.5 sm:py-3 pr-2 text-xs sm:text-sm bg-transparent border-0 focus:outline-none font-medium placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="pr-3 pl-2 text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Mismatch Highlight Error Banner */}
              {confirmPassword.length > 0 && signupPassword !== confirmPassword && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <span className="font-bold text-rose-800">Password Mismatch: </span>
                    <span>The re-typed password does not match your main password. Please verify both fields.</span>
                  </div>
                </div>
              )}

              {/* Password Match Success Notification */}
              {confirmPassword.length > 0 && signupPassword.length > 0 && signupPassword === confirmPassword && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Passwords match!</span>
                </div>
              )}
            </div>

            {/* Institution / Role Specific Data */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                  {selectedRole === 'student'
                    ? 'College / University Name *'
                    : selectedRole === 'industry'
                    ? 'Company / Organization Name *'
                    : 'Institution / Department Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  placeholder={
                    selectedRole === 'student'
                      ? 'e.g. National Institute of Technology (NIT)'
                      : selectedRole === 'industry'
                      ? 'e.g. TechNova Solutions, Google Cloud'
                      : 'Apex Technical University System'
                  }
                  className="w-full px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 font-medium placeholder:text-slate-400"
                />
              </div>

              {selectedRole === 'student' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Roll / Reg Number</label>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={e => setRollNo(e.target.value)}
                      placeholder="22CS8042"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      placeholder="Computer Science"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Academic CGPA</label>
                    <input
                      type="text"
                      value={cgpa}
                      onChange={e => setCgpa(e.target.value)}
                      placeholder="8.8 / 10"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'industry' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Job Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Lead Technical Recruiter"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hiring Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="Bengaluru / Hyderabad (Hybrid)"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {authErrorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fadeIn mt-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{authErrorMessage}</span>
              </div>
            )}

            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full font-bold shadow-md shadow-brand-500/20 py-3 text-sm"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Create Account & Launch
              </Button>
            </div>

            <div className="text-center pt-1 pb-1">
              <p className="text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-brand-600 font-bold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
