import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Share2, Download, GraduationCap, MapPin, Globe, Mail, Users, Star, BookOpen, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ShareModal from '../components/ShareModal';
import { View } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicInstituteProfile } from '../services/instituteServices';

const InstitutePublicProfile = ({ setView }: { setView: (v: View) => void }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [institute, setInstitute] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        const response = await getPublicInstituteProfile(id);
        if (response.ok) {
          const data = await response.json();
          setInstitute(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch institute profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-12">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-12 text-center space-y-6">
        <h2 className="text-2xl font-display font-bold text-brand-primary">Institute Not Found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareMessage = `Check out ${institute.instituteName} on AUI - Production Talent Network.\n\nView profile: ${shareUrl}`;

  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        title="Share Institute Profile"
        subtitle="Share this institute's verified profile."
        shareUrl={shareUrl}
        shareMessage={shareMessage}
      />
      
      <main className="no-scrollbar pb-32 text-left">
        <div className="max-w-7xl mx-auto px-6 pt-8 text-left">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-premium text-xs font-bold uppercase tracking-widest"
          >
            <ArrowRight size={14} className="rotate-180" />
            Back
          </button>
        </div>

        {/* Header Section */}
        <section className="bg-brand-surface py-20 border-b border-gray-100 text-left mt-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 items-center md:items-start text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <img src={institute.avatarUrl || 'https://picsum.photos/seed/institute/200/200'} className="w-48 h-48 rounded-brand object-cover shadow-premium" alt="" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-brand-accent rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <ShieldCheck size={24} className="text-white" />
              </div>
            </motion.div>
            
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <Badge variant="info" className="px-3 py-1">Verified Institute</Badge>
                  {institute.conductsWorkshops && <Badge variant="success" className="px-3 py-1">Host Workshops</Badge>}
                </div>
                <h1 className="text-5xl font-display font-bold tracking-tight text-brand-primary">{institute.instituteName}</h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-text-secondary font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-brand-accent" />
                    <span>{institute.location || 'Location Not Set'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe size={16} className="text-brand-accent" />
                    <a href={institute.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">{institute.website ? 'Visit Website' : 'No Website'}</a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail size={16} className="text-brand-accent" />
                    <span>{institute.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => setIsShareModalOpen(true)} className="px-8 py-3 shadow-premium">
                <Share2 size={18} />
                Share Profile
              </Button>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16 text-left">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-20 text-left">
            <section className="space-y-8 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-gray-100 pb-4 text-left">About the Institute</h3>
              <div className="p-10 bg-brand-surface rounded-brand border border-gray-50 text-left">
                <p className="text-brand-primary text-lg leading-relaxed font-medium">
                  {institute.description || 'Welcome to our institute. We are dedicated to providing high-quality education and industry exposure to our students.'}
                </p>
              </div>
            </section>

            <section className="space-y-8 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-gray-100 pb-4 text-left">Key Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {[
                  { label: 'Student Impact', val: institute.studentCount || 0, icon: Star, color: 'text-orange-400' },
                  { label: 'Courses Offered', val: institute.coursesOffered?.split(',').length || 0, icon: BookOpen, color: 'text-brand-accent' },
                  { label: 'Experts Booked', val: institute.bookings?.length || 0, icon: Users, color: 'text-brand-primary' },
                ].map(s => (
                  <div key={s.label} className="p-8 bg-brand-surface rounded-brand border border-gray-50 text-center space-y-4">
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-white flex items-center justify-center shadow-sm ${s.color}`}>
                      <s.icon size={24} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-brand-primary">{s.val}+</p>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-8 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-gray-100 pb-4 text-left">Educational Activity</h3>
              <div className="space-y-4">
                {institute.bookings?.map((item: any) => (
                  <div key={item.id} className="p-6 bg-brand-surface rounded-brand border border-gray-50 flex items-center justify-between text-left">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary shadow-sm text-left">
                        <Activity size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-brand-primary text-left">
                          {item.type === 'workshop' ? 'Workshop hosted' : 'Industry engagement'}: {item.professional?.fullName}
                        </p>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest text-left">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge variant={item.status === 'completed' ? 'success' : 'info'}>{item.status}</Badge>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <aside className="space-y-16 text-left">
            <section className="space-y-8 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-gray-100 pb-4 text-left">Institute Info</h3>
              <div className="bg-brand-surface rounded-3xl p-8 border border-gray-50 space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Established</p>
                  <p className="font-bold text-brand-primary text-xl">{institute.establishedYear || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Contact Person</p>
                  <p className="font-bold text-brand-primary text-xl">{institute.contactPerson}</p>
                  {institute.designation && <p className="text-sm text-text-secondary">{institute.designation}</p>}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Industry Exposure</p>
                  <Badge variant="info" className="text-sm px-4 py-1.5 uppercase tracking-wider">{institute.industryExposure}</Badge>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default InstitutePublicProfile;
