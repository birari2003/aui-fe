import React from 'react';
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
  return (
    <div className="min-h-screen bg-white flex flex-col no-scrollbar">
      <GlobalHeader 
        setView={setView} 
        isLoggedIn={isLoggedIn} 
        userRole={userRole}
        onLogout={onLogout} 
      />
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {children}
      </main>
    </div>
  );
};

export default WorkspaceLayout;
