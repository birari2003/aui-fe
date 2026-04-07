import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { View, UserRole } from '../types';

// Views
import LandingPage from '../views/LandingPage';
import LoginPage from '../views/LoginPage';
import RegisterSelect from '../views/RegisterSelect';
import OnboardingFlow from '../views/Onboarding';
import StudioDashboard from '../views/StudioDashboard';
import InstituteDashboard from '../views/InstituteDashboard';
import ProfessionalDashboard from '../views/ProfessionalDashboard';
import StudioProfile from '../views/StudioProfile';
import InstituteProfile from '../views/InstituteProfile';
import StudioList from '../views/StudioList';
import InstituteList from '../views/InstituteList';
import TalentIDPage from '../views/TalentID';
import StudioShowcase from '../views/StudioShowcase';
import InstituteShowcase from '../views/InstituteShowcase';
import AdminPanel from '../views/AdminPanel';
import PendingApprovalPage from '../views/PendingApproval';

interface AppRoutesProps {
  view: View;
  setView: (v: View) => void;
  userRole: UserRole | null;
  setUserRole: (r: UserRole) => void;
  setIsLoggedIn: (v: boolean) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ setView, userRole, setUserRole, setIsLoggedIn }) => {
  const navigate = useNavigate();

  // Helper to sync legacy state-based setView with URL-based navigate
  const handleSetView = (v: View) => {
    setView(v);
    switch (v) {
      case 'landing': navigate('/'); break;
      case 'login': navigate('/login'); break;
      case 'register_select': navigate('/register'); break;
      case 'onboarding': navigate('/onboarding'); break;
      case 'dashboard_studio': navigate('/dashboard/studio'); break;
      case 'dashboard_institute': navigate('/dashboard/institute'); break;
      case 'dashboard_pro': navigate('/dashboard/pro'); break;
      case 'talent_id': navigate('/talent/AUI-000123'); break; // Mock ID
      case 'showcase_studio': navigate('/studio/STU-001'); break; // Mock ID
      case 'showcase_institute': navigate('/institute/INS-001'); break; // Mock ID
      case 'admin': navigate('/admin'); break;
      case 'pending_approval': navigate('/pending-approval'); break;
      case 'hire': navigate('/hire'); break;
      case 'experts': navigate('/experts'); break;
      case 'studio_list': navigate('/studios'); break;
      case 'institute_list': navigate('/institutes'); break;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onStart={handleSetView} userRole={userRole} />} />
      <Route path="/login" element={
        <LoginPage onLogin={(user) => { 
          setIsLoggedIn(true); 
          setUserRole(user.role);
          
          let dashboardView: View = 'landing';
          if (user.role === 'studio') dashboardView = 'dashboard_studio';
          else if (user.role === 'institute') dashboardView = 'dashboard_institute';
          else if (user.role === 'professional') dashboardView = 'dashboard_pro';
          else if (user.role === 'admin') dashboardView = 'admin';
          
          handleSetView(dashboardView); 
        }} />
      } />
      <Route path="/register" element={<RegisterSelect onSelect={(role) => { setUserRole(role); handleSetView('onboarding'); }} />} />
      <Route path="/onboarding" element={<OnboardingFlow role={userRole || 'professional'} onComplete={handleSetView} />} />
      <Route path="/dashboard/studio" element={<StudioProfile setView={handleSetView} />} />
      <Route path="/dashboard/institute" element={<InstituteProfile setView={handleSetView} />} />
      <Route path="/dashboard/pro" element={<ProfessionalDashboard setView={handleSetView} />} />
      
      {/* Functional Lists */}
      <Route path="/hire" element={<StudioDashboard setView={handleSetView} />} />
      <Route path="/experts" element={<InstituteDashboard setView={handleSetView} />} />
      <Route path="/studios" element={<StudioList setView={handleSetView} />} />
      <Route path="/institutes" element={<InstituteList setView={handleSetView} />} />
      
      <Route path="/talent/:id" element={<TalentIDPage setView={handleSetView} />} />
      <Route path="/studio/:id" element={<StudioShowcase setView={handleSetView} />} />
      <Route path="/institute/:id" element={<InstituteShowcase setView={handleSetView} />} />
      <Route path="/admin" element={<AdminPanel setView={handleSetView} />} />
      <Route path="/pending-approval" element={<PendingApprovalPage onBack={() => handleSetView('landing')} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
