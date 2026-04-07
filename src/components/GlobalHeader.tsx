import React from 'react';
import { motion } from 'motion/react';
import { Zap, Bell, Users, LogOut, ArrowLeft, Menu, X } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from './Button';
import { View, UserRole } from '../types';

const GlobalHeader = ({ setView, isLoggedIn, userRole, onLogout }: { 
  setView: (v: View) => void, 
  isLoggedIn: boolean, 
  userRole: UserRole | null,
  onLogout: () => void 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'hire', label: 'Hire Talent', path: '/hire' },
    { id: 'experts', label: 'Book Expert', path: '/experts' },
    { id: 'studio_list', label: 'Studios', path: '/studios' },
    { id: 'institute_list', label: 'Institutes', path: '/institutes' },
    { id: 'dashboard_pro', label: 'My Dashboard', path: '/dashboard/pro' }
  ].filter(item => {
    if (userRole === 'institute') {
      return !['hire', 'institute_list', 'dashboard_pro'].includes(item.id);
    }
    if (userRole === 'studio') {
      return !['experts', 'studio_list', 'dashboard_pro'].includes(item.id);
    }
    if (userRole === 'professional') {
      return !['hire', 'experts', 'dashboard_pro'].includes(item.id);
    }
    return true;
  });

  const handleNav = (v: View, route: string) => {
    setView(v);
    navigate(route);
  };

  const isAuthPage = ['/login', '/register', '/onboarding'].includes(path);
  const isDashboard = path.startsWith('/dashboard');
  const isShowcase = path.startsWith('/studio/') || path.startsWith('/institute/') || path.startsWith('/talent/');

  if (isShowcase) return null;

  return (
    <header className="h-20 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-8 h-8 bg-brand-primary rounded-[6px] flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-brand-primary">AUI</span>
          </Link>
          
          {/* Contextual Navigation */}
          {!isAuthPage && !isShowcase && isLoggedIn && userRole !== 'admin' && (
            <nav className="hidden md:flex items-center gap-10">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id as View, item.path)}
                  className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-premium relative py-2 ${
                    path === item.path 
                      ? 'text-brand-primary' 
                      : 'text-text-muted hover:text-brand-primary'
                  }`}
                >
                  {item.label}
                  {path === item.path && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-primary rounded-full"
                    />
                  )}
                </button>
              ))}
            </nav>
          )}

          {isShowcase && (
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-premium text-[11px] font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
        </div>

        <div className="flex items-center gap-6">
          {!isLoggedIn ? (
            !isAuthPage && (
              <div className="flex items-center gap-4">
                <Button variant="ghost" className="px-6" onClick={() => handleNav('login', '/login')}>Login</Button>
                <Button className="px-6" onClick={() => handleNav('register_select', '/register')}>Register</Button>
              </div>
            )
          ) : (
            <>
              <button className="p-2.5 text-text-muted hover:text-brand-primary hover:bg-brand-surface rounded-xl relative transition-premium">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-accent rounded-full border-2 border-white shadow-sm" />
              </button>
              <div className="flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-full bg-brand-surface border border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-accent/30 transition-premium shadow-sm" 
                  onClick={() => {
                    if (userRole === 'admin') handleNav('admin', '/admin');
                    else if (userRole === 'institute') handleNav('dashboard_institute', '/dashboard/institute');
                    else if (userRole === 'studio') handleNav('dashboard_studio', '/dashboard/studio');
                    else if (userRole === 'professional') handleNav('dashboard_pro', '/dashboard/pro');
                  }}
                >
                  <Users size={20} className="text-text-muted" />
                </div>
                <button onClick={onLogout} className="p-2 text-text-muted hover:text-red-500 transition-premium">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          )}

          {/* Mobile Menu Toggle */}
          {!isAuthPage && isLoggedIn && userRole !== 'admin' && (
            <button 
              className="md:hidden p-2 text-text-muted hover:text-brand-primary transition-premium"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 shadow-xl z-40 p-6 space-y-4"
        >
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                handleNav(item.id as View, item.path);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left py-4 px-6 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-premium ${
                path === item.path 
                  ? 'bg-brand-surface text-brand-primary' 
                  : 'text-text-muted hover:bg-brand-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </header>
  );
};

export default GlobalHeader;
