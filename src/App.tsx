import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AuthModal } from './pages/public/AuthModal';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { SkillAssessmentPage } from './pages/student/SkillAssessmentPage';
import { SkillResultsPage } from './pages/student/SkillResultsPage';
import { SkillGapAnalysisPage } from './pages/student/SkillGapAnalysisPage';
import { CareerPathsPage } from './pages/student/CareerPathsPage';
import { CareerDetailPage } from './pages/student/CareerDetailPage';
import { OpportunitiesPage } from './pages/student/OpportunitiesPage';
import { OpportunityDetailPage } from './pages/student/OpportunityDetailPage';
import { ApplicationsPage } from './pages/student/ApplicationsPage';
import { LearningPage } from './pages/student/LearningPage';
import { PortfolioPage } from './pages/student/PortfolioPage';
import { ProfileSetupPage } from './pages/student/ProfileSetupPage';

// Industry Pages
import { IndustryDashboard } from './pages/industry/IndustryDashboard';
import { PostOpportunityWizard } from './pages/industry/PostOpportunityWizard';
import { CandidateDiscoveryPage } from './pages/industry/CandidateDiscoveryPage';
import { IndustryApplicationsPage } from './pages/industry/IndustryApplicationsPage';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { SkillAnalyticsPage } from './pages/faculty/SkillAnalyticsPage';
import { MentorshipPage } from './pages/faculty/MentorshipPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { PartnersPage } from './pages/admin/PartnersPage';

export const App: React.FC = () => {
  const { isLoggedIn, currentRole, activeTab } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // If not logged in or on public landing
  if (!isLoggedIn || activeTab === 'landing') {
    return (
      <>
        <LandingPage onOpenAuth={() => setIsAuthModalOpen(true)} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    );
  }

  // Render role specific views within AppShell
  const renderContent = () => {
    // 1. Student Experience
    if (currentRole === 'student') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'skill-assessment':
          return <SkillAssessmentPage />;
        case 'skill-results':
          return <SkillResultsPage />;
        case 'skill-gaps':
          return <SkillGapAnalysisPage />;
        case 'careers':
          return <CareerPathsPage />;
        case 'career-detail':
          return <CareerDetailPage />;
        case 'opportunities':
          return <OpportunitiesPage />;
        case 'opportunity-detail':
          return <OpportunityDetailPage />;
        case 'applications':
          return <ApplicationsPage />;
        case 'learning':
          return <LearningPage />;
        case 'portfolio':
          return <PortfolioPage />;
        case 'profile-setup':
          return <ProfileSetupPage />;
        case 'notifications':
          return <ApplicationsPage />;
        default:
          return <StudentDashboard />;
      }
    }

    // 2. Industry Experience
    if (currentRole === 'industry') {
      switch (activeTab) {
        case 'dashboard':
          return <IndustryDashboard />;
        case 'post-opportunity':
          return <PostOpportunityWizard />;
        case 'candidates':
          return <CandidateDiscoveryPage />;
        case 'industry-applications':
          return <IndustryApplicationsPage />;
        case 'opportunities':
          return <OpportunitiesPage />;
        case 'opportunity-detail':
          return <OpportunityDetailPage />;
        case 'company-profile':
          return <IndustryDashboard />;
        default:
          return <IndustryDashboard />;
      }
    }

    // 3. Faculty Experience
    if (currentRole === 'faculty') {
      switch (activeTab) {
        case 'dashboard':
          return <FacultyDashboard />;
        case 'skill-analytics':
          return <SkillAnalyticsPage />;
        case 'mentorship':
          return <MentorshipPage />;
        case 'learning':
          return <LearningPage />;
        case 'opportunities':
          return <OpportunitiesPage />;
        default:
          return <FacultyDashboard />;
      }
    }

    // 4. Institution Admin Experience
    if (currentRole === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'admin-analytics':
        case 'reports':
          return <AdminAnalyticsPage />;
        case 'partners':
          return <PartnersPage />;
        case 'opportunities':
          return <OpportunitiesPage />;
        default:
          return <AdminDashboard />;
      }
    }

    return <StudentDashboard />;
  };

  return (
    <AppShell>
      {renderContent()}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </AppShell>
  );
};
