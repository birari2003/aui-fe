import React from 'react';
import './index.css';
import WorkspaceLayout from './components/WorkspaceLayout';
import AppRoutes from './routes/AppRoutes';
import { View, UserRole } from './types';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getMe } from './services/userServices';

function App() {
  const [view, setView] = React.useState<View>('landing');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userRole, setUserRole] = React.useState<UserRole | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMe(token);
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUserRole(data.data.role);
          
          // Sync view with role on initial load if we're not on a specific sub-route
          // AppRoutes handles URL-based navigation, but we need to sync the internal 'view' state
          if (window.location.pathname === '/') {
            if (data.data.role === 'professional') setView('dashboard_pro');
            else if (data.data.role === 'studio') setView('dashboard_studio');
            else if (data.data.role === 'institute') setView('dashboard_institute');
            else if (data.data.role === 'admin') setView('admin');
          }
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setView('landing');
    setUserRole(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <WorkspaceLayout 
        currentView={view} 
        setView={setView} 
        isLoggedIn={isLoggedIn} 
        userRole={userRole}
        onLogout={handleLogout}
      >
        <AppRoutes 
          view={view} 
          setView={setView} 
          userRole={userRole} 
          setUserRole={setUserRole} 
          setIsLoggedIn={setIsLoggedIn} 
        />
        <ToastContainer position="bottom-right" theme="dark" />
      </WorkspaceLayout>
    </BrowserRouter>
  );
}

export default App;
