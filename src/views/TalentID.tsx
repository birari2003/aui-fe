import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Share2, Download, TrendingUp, Shield, Briefcase, GraduationCap as GraduationCapIcon, Search, ArrowRight, CheckCircle2, Users } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ShareModal from '../components/ShareModal';
import TalentIDCard from '../components/TalentIDCard';
import { MOCK_TALENT } from '../data/mockData';
import { View } from '../types';

import { useParams, useNavigate } from 'react-router-dom';
import { getPublicProfile } from '../services/professionalServices';
import { getEmbedUrl } from '../utils/videoUtils';

const TalentIDPage = ({ setView }: { setView: (v: View) => void }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [talent, setTalent] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchTalent = async () => {
      if (!id) return;
      try {
        const response = await getPublicProfile(id);
        if (response.ok) {
          const data = await response.json();
          setTalent(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch talent:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTalent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-12">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-12 text-center space-y-6">
        <h2 className="text-2xl font-display font-bold text-brand-primary">Talent Not Found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/talent/${id}`;
  const shareMessage = `I’m a verified professional on AUI (Production Talent Network).\n\nTalent ID: ${id}\nRole: ${talent.primarySkill}\n\nView my verified profile: ${shareUrl}`;

  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        title="Share Talent ID"
        subtitle="Share your verified professional identity with studios and institutes."
        shareUrl={shareUrl}
        shareMessage={shareMessage}
      >
        <TalentIDCard talent={talent} />
      </ShareModal>
      <main className="no-scrollbar pb-32">
        {/* Back Button Sub-header */}
        <div className="max-w-7xl mx-auto px-6 pt-8 text-left">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-premium text-xs font-bold uppercase tracking-widest"
          >
            <ArrowRight size={14} className="rotate-180" />
            Back to Talent Discovery
          </button>
        </div>
        {/* Profile Header */}
        <section className="bg-brand-surface py-20 border-b border-gray-100 text-left">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 items-center md:items-start text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
                <img src={talent.avatarUrl || 'https://picsum.photos/seed/placeholder/200/200'} className="w-48 h-48 rounded-brand object-cover shadow-premium" alt="" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-brand-accent rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <ShieldCheck size={24} className="text-white" />
              </div>
            </motion.div>
            
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <Badge variant="success" className="px-3 py-1">Available Now</Badge>
                  <Badge variant="info" className="px-3 py-1">Verified Professional</Badge>
                </div>
                <h1 className="text-5xl font-display font-bold tracking-tight text-brand-primary">{talent.fullName}</h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-text-secondary font-medium">
                  <span className="text-brand-accent font-bold uppercase tracking-widest text-xs">{id}</span>
                  <span>•</span>
                  <span>{talent.primarySkill}</span>
                  <span>•</span>
                  <span>{talent.experienceYears}y Experience</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="secondary" onClick={() => setIsShareModalOpen(true)} className="px-8 py-3 border border-gray-100 hover:bg-brand-surface">
                <Share2 size={18} />
                Share Talent ID
              </Button>
              <Button 
                variant="secondary" 
                className="px-8 py-3"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Talent ID: ${id}\nName: ${talent.fullName}\nRole: ${talent.primarySkill}\nExperience: ${talent.experienceYears}y`);
                  link.download = `TalentID_${id}.txt`;
                  link.click();
                }}
              >
                <Download size={18} />
                Download Talent ID
              </Button>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16 text-left">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-20 text-left">
            {/* Confidence Score Section */}
            <section className="space-y-8 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-gray-100 pb-4 text-left">Confidence Scores</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {[
                  { label: 'Experience Score', val: talent.experienceScore, icon: TrendingUp, color: 'text-brand-accent' },
                  { label: 'Reliability Score', val: talent.reliabilityScore, icon: Shield, color: 'text-emerald-500' },
                  { label: 'Project Count', val: talent.projectCount, icon: Briefcase, color: 'text-brand-primary' },
                ].map(s => (
                  <div key={s.label} className="p-8 bg-brand-surface rounded-brand border border-gray-50 text-center space-y-4">
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-white flex items-center justify-center shadow-sm ${s.color}`}>
                      <s.icon size={24} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-brand-primary">{s.val}{s.label.includes('Score') ? '%' : ''}</p>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Showreel Section */}
            <section className="space-y-8 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-gray-100 pb-4 text-left">Showreel</h3>
              <div className="aspect-video bg-brand-surface rounded-brand overflow-hidden border border-gray-100 shadow-premium relative text-left">
                <iframe 
                  src={getEmbedUrl(talent.showreelUrl)} 
                  className="w-full h-full border-none" 
                  title="Showreel"
                  allowFullScreen
                />
              </div>
            </section>

            {/* Responsibility Scope */}
            <section className="space-y-8 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-gray-100 pb-4 text-left">Responsibility Scope</h3>
              <div className="p-10 bg-brand-surface rounded-brand border border-gray-50 text-left">
                <p className="text-brand-primary text-lg leading-relaxed font-medium">{talent.responsibilityScope}</p>
              </div>
            </section>

            {/* Work Ledger (Responsive View) */}
            <section className="space-y-8 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-gray-100 pb-4 text-left">Work Ledger</h3>
              
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto text-left">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Project Name</th>
                      <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Studio / Institute</th>
                      <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Role</th>
                      <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Duration</th>
                      <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Completion Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {talent.workLedgers?.map((entry: any) => (
                      <tr key={entry.id} className="border-b border-gray-50 hover:bg-brand-surface transition-premium group text-left">
                        <td className="py-6 font-bold text-brand-primary">{entry.projectName}</td>
                        <td className="py-6 text-text-secondary">{entry.organizationType === 'studio' ? 'Studio' : 'Institute'}</td>
                        <td className="py-6 text-text-secondary">{entry.role}</td>
                        <td className="py-6 text-text-secondary">{entry.duration}</td>
                        <td className="py-6 text-text-secondary">{entry.completionDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {talent.workLedgers?.map((entry: any) => (
                  <div key={entry.id} className="p-6 bg-brand-surface rounded-2xl border border-gray-100 space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Project</p>
                        <h4 className="text-lg font-bold text-brand-primary">{entry.projectName}</h4>
                      </div>
                      <Badge variant="info" className="text-[9px] px-2 py-0.5">{entry.duration}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100/50">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Type</p>
                        <p className="text-sm font-medium text-text-secondary">{entry.organizationType === 'studio' ? 'Studio' : 'Institute'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Role</p>
                        <p className="text-sm font-medium text-text-secondary">{entry.role}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Date</p>
                        <p className="text-sm font-medium text-text-secondary">{entry.completionDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Timeline & Work */}
          <aside className="space-y-16 text-left">
            {/* Career Timeline */}
            <section className="space-y-8 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-gray-100 pb-4 text-left">Career Timeline</h3>
              <div className="flex items-center justify-between relative py-12 px-2 text-left">
                <div className="absolute left-0 right-0 h-1 bg-brand-surface border border-gray-100/50 top-1/2 -translate-y-1/2 rounded-full text-left" />
                {[
                  { label: 'Junior', active: true },
                  { label: 'Mid', active: true },
                  { label: 'Senior', active: true },
                  { label: 'Lead', active: false },
                ].map((step, i) => (
                  <div key={step.label} className="relative z-10 flex flex-col items-center gap-3 text-left">
                    <div className={`w-6 h-6 rounded-full border-4 border-white shadow-md ${step.active ? 'bg-brand-accent scale-110' : 'bg-gray-200'} transition-transform text-left`} />
                    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] ${step.active ? 'text-brand-primary' : 'text-text-muted'} text-left`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-gray-100 pb-4 text-left">Mentorship & Industry Work</h3>
              <div className="space-y-4 text-left">
                {[
                  { label: 'Workshops Conducted', val: talent.workshopsConducted || 0, icon: GraduationCapIcon },
                  { label: 'Mentorship Sessions', val: talent.mentorshipSessions || 0, icon: Users },
                  { label: 'Portfolio Reviews', val: talent.portfolioReviews || 0, icon: Search },
                ].map(item => (
                  <div key={item.label} className="p-6 flex items-center justify-between hover:bg-brand-surface transition-colors border-none bg-brand-surface/30 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary shadow-sm">
                        <item.icon size={18} />
                      </div>
                      <span className="text-sm font-bold text-brand-primary">{item.label}</span>
                    </div>
                    <span className="text-2xl font-display font-bold text-brand-primary">{item.val}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TalentIDPage;
