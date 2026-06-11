import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Users } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import LiveActivity from '../components/LiveActivity';
import ReelsSection from '../components/ReelsSection';
import { View, UserRole } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import SEO from '../components/SEO';

const LandingPage = ({ onStart, userRole }: { onStart: (v: View) => void, userRole: UserRole | null }) => {
  const navigate = useNavigate();
  const [isRestrictedModalOpen, setIsRestrictedModalOpen] = React.useState(false);
  const [restrictedMessage, setRestrictedMessage] = React.useState('');

  const handleAction = (v: View) => {
    if (!userRole) {
      if (v === 'hire' || v === 'dashboard_studio') {
        setRestrictedMessage('To access this feature, please login or register with a studio account.');
        setIsRestrictedModalOpen(true);
        return;
      }
      if (v === 'experts') {
        setRestrictedMessage('To access this feature, please login or register with an institute account.');
        setIsRestrictedModalOpen(true);
        return;
      }
    } else {
      if (v === 'register_select') {
        setRestrictedMessage(`You have already joined as a ${userRole}. You can access your dashboard from the top right menu.`);
        setIsRestrictedModalOpen(true);
        return;
      }
      
      if (userRole === 'professional') {
        if (v === 'hire' || v === 'dashboard_studio') {
          setRestrictedMessage('You have registered as a professional. To access this feature, kindly login with a studio account.');
          setIsRestrictedModalOpen(true);
          return;
        }
        if (v === 'experts') {
          setRestrictedMessage('You have registered as a professional. To access this feature, kindly login with an institute account.');
          setIsRestrictedModalOpen(true);
          return;
        }
      }

      if ((v === 'hire' || v === 'dashboard_studio') && userRole === 'institute') {
        setRestrictedMessage('You have registered as an institute. To access this feature, kindly login with a studio account.');
        setIsRestrictedModalOpen(true);
        return;
      }
      if (v === 'experts' && userRole === 'studio') {
        setRestrictedMessage('You have registered as a studio. To access this feature, kindly login with an institute account.');
        setIsRestrictedModalOpen(true);
        return;
      }
    }
    
    onStart(v);
  };

  return (
    <div className="bg-white min-h-screen no-scrollbar text-left">
      <SEO 
        title="Verified Talent. Ready to Work." 
        description="A private network connecting studios, institutes, and professionals in the animation industry." 
        keywords="animation talent, hire animators, animation network, showreels, portfolios, studios, institutes" 
      />
      <div className="no-scrollbar">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-surface pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-8xl font-display font-bold tracking-tighter leading-[1] text-brand-primary"
            >
              Verified Talent. <br />
              Ready to Work.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
            >
              A private network connecting studios, institutes, and professionals in the animation industry.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 pt-6"
            >
              <Button className="px-10 py-4 text-base" onClick={() => handleAction('hire')}>Hire Talent</Button>
              <Button variant="secondary" className="px-10 py-4 text-base bg-white" onClick={() => handleAction('experts')}>Book Industry Expert</Button>
              <Button variant="outline" className="px-10 py-4 text-base bg-transparent" onClick={() => handleAction('register_select')}>Join Talent</Button>
            </motion.div>
          </div>
        </section>

        <LiveActivity />

        <ReelsSection onAction={handleAction} />

        <div className="max-w-7xl mx-auto px-6 space-y-32 pb-32">
          {/* Trust Section */}
          <section className="space-y-10 pt-16">
            <p className="text-center text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Trusted by Studios, Institutes, and Industry Professionals</p>
            {/* <div className="flex flex-wrap justify-center gap-12 transition-premium">
              {['PIXAR-STYLE', 'DREAMWORKS-STYLE', 'NETFLIX-STYLE', 'DISNEY-STYLE'].map(logo => (
                <div key={logo} className="text-xl font-display font-bold tracking-tighter text-brand-primary hover:text-brand-accent transition-premium cursor-default">{logo}</div>
              ))}
            </div> */}
          </section>

          {/* Metrics */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-gray-100 py-20">
            {[
              { label: 'Verified Professionals', value: '500+' },
              { label: 'Partner Studios', value: '40+' },
              { label: 'Workshops Delivered', value: '120+' },
            ].map(metric => (
              <div key={metric.label} className="text-center space-y-2">
                <h2 className="text-6xl font-display font-bold text-brand-primary tracking-tight">{metric.value}</h2>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{metric.label}</p>
              </div>
            ))}
          </section>

          {/* Role Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                title: 'FOR STUDIOS', 
                desc: 'Find verified production-ready artists for your next major project.', 
                features: ['Advanced talent search', 'Talent bench (saved artists)', 'Fast hiring requests'],
                icon: Briefcase,
                action_view: 'hire'
              },
              { 
                title: 'FOR INSTITUTES', 
                desc: 'Bring industry professionals into your classroom for high-impact learning.', 
                features: ['Workshop booking', 'Mentorship sessions', 'Portfolio reviews'],
                icon: GraduationCap,
                action_view: 'experts'
              },
              { 
                title: 'FOR PROFESSIONALS', 
                desc: 'Build your professional identity with a verified work history ledger.', 
                features: ['Verified profile', 'Showreel display', 'Work history ledger'],
                icon: Users,
                action_view: 'dashboard_pro'
              },
            ].map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleAction(role.action_view as View)}
                className="group cursor-pointer"
              >
                <Card className="h-full flex flex-col bg-white border-gray-100 shadow-premium hover:shadow-premium-hover hover:-translate-y-2 transition-premium p-10">
                  <div className="w-14 h-14 bg-brand-surface rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-premium group-hover:rotate-3">
                    <role.icon size={28} />
                  </div>
                  <h3 className="text-[10px] font-bold tracking-[0.3em] text-text-muted mb-6 uppercase">{role.title}</h3>
                  <p className="text-2xl text-brand-primary font-bold mb-10 leading-tight">{role.desc}</p>
                  <ul className="space-y-5 mt-auto">
                    {role.features.map(f => (
                      <li key={f} className="flex items-center gap-4 text-sm text-text-secondary font-medium">
                        <div className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </section>

          {/* How It Works */}
          <section className="space-y-24 py-24">
            <div className="text-center space-y-4">
              <h2 className="text-6xl font-display font-bold tracking-tight text-brand-primary">How It Works</h2>
              <p className="text-text-secondary text-xl max-w-xl mx-auto">A simple three-step professional infrastructure designed for clarity and trust.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
              {[
                { step: '01', title: 'Verified Profiles', desc: 'Professionals create verified profiles with their production history, backed by our ledger.' },
                { step: '02', title: 'Find & Connect', desc: 'Studios and institutes find and connect with the right talent for their specific needs using intent-first search.' },
                { step: '03', title: 'Record History', desc: 'Engagements are completed and automatically recorded in the work history ledger, building long-term trust.' },
              ].map(item => (
                <div key={item.step} className="space-y-8 relative group text-left">
                  <span className="text-[120px] font-display font-bold text-brand-surface absolute -top-20 -left-6 -z-10 opacity-50 group-hover:opacity-100 transition-premium group-hover:scale-110">{item.step}</span>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-brand-primary tracking-tight">{item.title}</h3>
                    <p className="text-text-secondary text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-brand-surface py-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/logo_blck.png" 
                className="w-8 h-8 rounded-[10px] object-cover" 
                alt="AUI Logo" 
              />
              <span className="text-xl font-bold tracking-tight text-brand-primary">AUI</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-text-secondary">
              <Link to="/terms" className="hover:text-brand-primary transition-premium">Terms</Link>
              <Link to="/privacy" className="hover:text-brand-primary transition-premium">Privacy</Link>
              <Link to="/contact" className="hover:text-brand-primary transition-premium">Contact</Link>
              <Link to="/sitemap" className="hover:text-brand-primary transition-premium">Sitemap</Link>
            </div>
            <p className="text-xs text-text-muted">© 2026 AUI – Production Talent Network. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <Modal 
        isOpen={isRestrictedModalOpen} 
        onClose={() => setIsRestrictedModalOpen(false)} 
        title="Restricted Feature"
        message={<p className="text-text-secondary leading-relaxed">{restrictedMessage}</p>}
        type="warning"
      />
    </div>
  );
};

export default LandingPage;
