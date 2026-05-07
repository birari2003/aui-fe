import React from 'react';
import { motion } from 'motion/react';
import { Zap, Bell, Users, LogOut, ArrowLeft, Menu, X } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from './Button';
import { View, UserRole } from '../types';
import ConfirmModal from './ConfirmModal';
import { getMyNotifications, markAsRead } from '../services/notificationServices';


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
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const fetchNotifications = React.useCallback(async () => {
    if (!isLoggedIn || userRole !== 'professional') return;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await getMyNotifications(token);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [isLoggedIn, userRole]);

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);


  const navItems = [
    { id: 'hire', label: 'Hire Talent', path: '/hire' },
    { id: 'experts', label: 'Book Expert', path: '/experts' },
    { id: 'studio_list', label: 'Studios', path: '/studios' },
    { id: 'institute_list', label: 'Institutes', path: '/institutes' },
    { id: 'pro_studio_requests', label: 'Studio Request', path: '/dashboard/pro/studio-requests' },
    { id: 'pro_job_postings', label: 'Jobs by Studios', path: '/dashboard/pro/jobs-by-studios' },
    { id: 'dashboard_pro', label: 'My Dashboard', path: '/dashboard/pro' }
  ].filter(item => {
    if (userRole === 'institute') {
      return !['hire', 'institute_list', 'pro_studio_requests', 'pro_job_postings', 'dashboard_pro'].includes(item.id);
    }
    if (userRole === 'studio') {
      return !['experts', 'studio_list', 'pro_studio_requests', 'pro_job_postings', 'dashboard_pro'].includes(item.id);
    }
    if (userRole === 'professional') {
      return !['hire', 'experts'].includes(item.id);
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
    <>
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
                    onClick={() => {
                      if (item.id === 'pro_studio_requests') {
                        navigate('/dashboard/pro/studio-requests');
                        return;
                      }
                      if (item.id === 'pro_job_postings') {
                        navigate('/dashboard/pro/jobs-by-studios');
                        return;
                      }
                      handleNav(item.id as View, item.path);
                    }}
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
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2.5 text-text-muted hover:text-brand-primary hover:bg-brand-surface rounded-xl relative transition-premium"
                  >
                    <Bell size={20} />
                    {notifications.some(n => !n.isRead) && (
                      <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-brand-accent rounded-full border-2 border-white shadow-sm" />
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">Notifications</h3>
                        <button onClick={() => setShowNotifications(false)} className="text-text-muted hover:text-brand-primary">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto no-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-text-muted">
                            <Bell size={24} className="mx-auto mb-2 opacity-20" />
                            <p className="text-xs font-medium">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={async (e) => {
                                if (!n.studio) return;
                                e.preventDefault();
                                e.stopPropagation();
                                try {
                                  const token = localStorage.getItem('token');
                                  // Permissive check for talentCode
                                  const talentCode = n.studio?.user?.talentId?.talentCode || 
                                                     n.studio?.User?.talentId?.talentCode ||
                                                     (n.studio?.userId ? `AUI-STU-${String(n.studio.userId).padStart(6, '0')}` : null);
                                  
                                  if (token && !n.isRead) {
                                    markAsRead(token, n.id).catch(console.error);
                                  }
                                  
                                  setShowNotifications(false);
                                  if (talentCode) {
                                    navigate(`/talent/${talentCode}`);
                                  } else {
                                    console.warn("Studio talentCode not found in notification:", n);
                                  }
                                  fetchNotifications();
                                } catch (err) {
                                  console.error("Navigation error:", err);
                                  setShowNotifications(false);
                                }
                              }}
                              className={`p-4 border-b border-gray-50 last:border-0 hover:bg-brand-surface/50 transition-colors ${n.studio ? 'cursor-pointer' : 'cursor-default'} ${!n.isRead ? 'bg-brand-accent/5' : ''}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-primary shadow-sm flex-shrink-0">
                                  <Zap size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-brand-primary leading-tight">{n.message}</p>
                                  <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider font-semibold">
                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                                  </p>
                                  {n.studio && (
                                    <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-accent flex items-center gap-1.5 transition-colors">
                                      View Studio Profile <ArrowLeft size={12} className="rotate-180" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
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
                  <button 
                    onClick={() => setShowLogoutConfirm(true)} 
                    className="p-2 text-text-muted hover:text-red-500 transition-premium"
                  >
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
                  if (item.id === 'pro_studio_requests') {
                    navigate('/dashboard/pro/studio-requests');
                  } else if (item.id === 'pro_job_postings') {
                    navigate('/dashboard/pro/jobs-by-studios');
                  } else {
                    handleNav(item.id as View, item.path);
                  }
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

      {/* Logout Confirmation Modal - Moved outside header to avoid centering issues */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          onLogout();
          navigate('/login');
        }}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        type="danger"
      />
    </>

  );
};

export default GlobalHeader;
