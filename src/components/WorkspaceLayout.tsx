import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalHeader from './GlobalHeader';
import { View, UserRole } from '../types';

const WorkspaceLayout = ({ children, currentView, setView, isLoggedIn, userRole, onLogout }: { 
  children: React.ReactNode, 
  currentView: View, 
  setView: (v: View) => void, 
  isLoggedIn: boolean, 
  userRole: UserRole | null,
  onLogout: () => void 
}) => {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white flex flex-col no-scrollbar">
      <GlobalHeader 
        setView={setView} 
        isLoggedIn={isLoggedIn} 
        userRole={userRole}
        onLogout={onLogout} 
      />
      <main ref={mainRef} className="flex-1 overflow-y-auto no-scrollbar">
        {children}
      </main>
    </div>
  );
};

export default WorkspaceLayout;
