import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Copy, 
  Send, 
  Bookmark, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  ArrowRight,
  UserCheck,
  Award,
  History,
  Layout,
  QrCode,
  Star, 
  CheckCircle2, 
  Briefcase, 
  History as HistoryIcon,
  ArrowLeft
} from 'lucide-react';
import { getPublicProfileByCode } from '../services/publicProfileServices';
import { getMe } from '../services/userServices';
import { addTalentToBench, createStudioRequestProfessional } from '../services/studioServices';
import EngagementModal from '../components/EngagementModal';
import { View, UserRole } from '../types';
import { BASE_URL } from '../utils/urls';

const BACKEND_URL = BASE_URL;

const getYouTubeId = (url: string) => {
  if (!url) return 'default';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : 'default';
};

const TalentIDPage = ({ setView }: { setView: (v: View) => void }) => {
  const navigate = useNavigate();
  const { talentCode } = useParams<{ talentCode: string }>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWorkLedgerOpen, setIsWorkLedgerOpen] = useState(true);
  
  const [me, setMe] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isEngagementModalOpen, setIsEngagementModalOpen] = useState(false);
  const [isSubmittingEngagement, setIsSubmittingEngagement] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getMe(token);
          if (res.ok) {
            const data = await res.json();
            setMe(data.data);
            setUserRole(data.data.role);
          }
        } catch (err) {
          console.error('Failed to fetch session:', err);
        }
      }
    };

    fetchSession();
    if (talentCode) {
      fetchProfile();
    }
  }, [talentCode]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getPublicProfileByCode(talentCode!);
      if (res.ok) {
        const data = await res.json();
        setProfileData(data.data);
      } else {
        setError('Profile not found');
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const isOwnProfile = me?.id === profileData?.id;
  const isStudio = userRole === 'studio';

  const handleToggleBench = async () => {
    const token = localStorage.getItem('token');
    if (!token || !profileData?.professional?.id) return;
    
    try {
      await addTalentToBench(token, profileData.professional.id);
      // Navigate to bench section in Studio Dashboard
      navigate('/hire');
      // We could use a query param but StudioDashboard currently uses state
    } catch (err) {
      console.error('Failed to add to bench:', err);
    }
  };

  const handleRequestEngagement = async (formData: any) => {
    const token = localStorage.getItem('token');
    if (!token || !profileData?.professional?.id) return;

    try {
      setIsSubmittingEngagement(true);
      const res = await createStudioRequestProfessional(token, {
        professionalId: profileData.professional.id,
        ...formData
      });
      if (res.ok) {
        setIsEngagementModalOpen(false);
        // Maybe navigate to engagements tab
        navigate('/hire');
      }
    } catch (err) {
      console.error('Failed to request engagement:', err);
    } finally {
      setIsSubmittingEngagement(false);
    }
  };

  const colors = {
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    surface: '#F8F9FB',
    card: '#FFFFFF',
    text: '#111827',
    muted: '#6B7280',
    accent: '#EFF6FF',
    dark: '#1E1B4B'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">{error || 'Profile not found'}</h2>
          <p className="text-gray-500">The Talent ID you are looking for does not exist or is inactive.</p>
        </div>
      </div>
    );
  }

  const getFileUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}/${path.replace(/\\/g, '/')}`;
  };

  const { professional, publicProfile, talentId } = profileData;
  const displayName = professional?.fullName || 'Professional';
  const avatarUrl = publicProfile?.profileImage ? getFileUrl(publicProfile.profileImage) : (professional?.avatarUrl || '/assets/sarah_chen_profile_1777487447512.png');
  const displayTalentId = talentId?.talentCode || 'AUI-000000';
  
  const insight = publicProfile?.auiInsight || 'Senior creative professional with a proven track record in high-impact projects. Consistently delivers exceptional results and excels in collaborative environments.';
  const timeline = Array.isArray(publicProfile?.experienceTimeline) ? publicProfile.experienceTimeline : [];
  const showreel = publicProfile?.showreel || { type: 'youtube', url: 'https://youtube.com', title: 'Professional Showreel', duration: '02:30' };
  const workLedger = Array.isArray(publicProfile?.workLedger) ? publicProfile.workLedger : [];

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#111827] font-sans pb-8">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-[#6B7280] transition-colors"
              title="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#111827] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <span className="font-bold text-lg tracking-tight">AUI <span className="text-[#6B7280] font-normal text-base uppercase tracking-widest ml-1">Studio</span></span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-xs font-medium">
              <span className="text-[#6B7280]">Talent ID</span> <span className="text-[#2563EB] font-bold">{displayTalentId}</span>
            </div>
            {!isOwnProfile && isStudio && (
              <>
                <button 
                  onClick={() => setIsEngagementModalOpen(true)}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  Request Engagement <Send size={14} />
                </button>
                <button 
                  onClick={handleToggleBench}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-[#6B7280]"
                >
                  <Bookmark size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 pt-5 space-y-5">
        {/* Profile Card Section */}
        <div className="bg-white rounded-[24px] shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col md:flex-row min-h-[400px]">
          {/* Left Column: Vertical Image */}
          <div className="w-full md:w-[320px] relative shrink-0">
            <img 
              src={avatarUrl} 
              alt={displayName} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
            
            {/* Reviewing Badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#374151]">
              Verified
            </div>

            {/* Star Icon */}
            <div className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="w-7 h-7 bg-[#2563EB] rounded-full flex items-center justify-center text-white">
                <Star size={14} fill="white" />
              </div>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="flex-1 p-6 flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#6B7280] font-bold text-[10px] uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-[#94A3B8]" />
                  AUI Verified Talent
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
                  <CheckCircle2 size={20} className="text-[#94A3B8]" />
                </div>
              </div>
              <div className="bg-[#1E1B4B] text-white px-4 py-2.5 rounded-xl flex flex-col items-center justify-center leading-tight">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{professional?.position || 'Mid'}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Level</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.2em]">Talent ID</div>
              <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl p-3 flex items-center justify-center">
                <span className="text-3xl font-bold tracking-[0.3em] text-[#0F172A] font-mono uppercase">{displayTalentId}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 py-2 border-b border-[#F1F5F9]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest">
                   <Star size={12} />
                   Experience Level
                </div>
                <div className="text-sm font-bold">{professional?.experienceYears || '0'}+ Years</div>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest">
                   <Briefcase size={12} />
                   Production Types
                </div>
                <div className="text-sm font-bold">{professional?.productionType || 'Feature Film'} • {professional?.primarySkill || 'Artist'}</div>
              </div>
            </div>

            <div className="bg-[#EFF6FF] rounded-xl p-3.5 flex items-center gap-4">
              <div className="w-2.5 h-2.5 bg-[#2563EB] rounded-full"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">Industry Experienced</span>
                <span className="text-xs text-[#64748B]">Proven track record</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest">
               <div className="flex items-center gap-1.5"><ShieldCheck size={14} /> Identity Verified</div>
               <div className="flex items-center gap-1.5"><Briefcase size={14} /> Work Verified</div>
               <div className="flex items-center gap-1.5"><CheckCircle2 size={14} /> Trusted by AUI</div>
            </div>

            {!isOwnProfile && isStudio && (
              <div className="flex gap-3 mt-auto pt-4">
                <button 
                  onClick={() => setIsEngagementModalOpen(true)}
                  className="flex-1 bg-black hover:bg-gray-900 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-all"
                >
                  Request Engagement
                </button>
                <button 
                  onClick={handleToggleBench}
                  className="w-14 bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center rounded-xl transition-all shadow-[0_4px_12px_rgba(37,99,235,0.3)]"
                >
                  <Bookmark size={20} fill="white" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Insight & Timeline Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* AUI Insight */}
          <div className="bg-white p-5 rounded-[24px] border border-[#E5E7EB] space-y-3 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white">
                  <span className="font-bold text-sm">✨</span>
                </div>
                <h3 className="font-bold text-lg">AUI Insight</h3>
              </div>
            </div>
            <div className="relative">
              <span className="absolute -left-1 -top-1 text-2xl text-[#E5E7EB] font-serif italic">“</span>
              <p className="text-[#374151] text-sm leading-relaxed font-medium pl-5">
                {insight}
              </p>
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="bg-white p-5 rounded-[24px] border border-[#E5E7EB] space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <History className="text-[#111827]" size={20} />
              <h3 className="font-bold text-lg">Experience Timeline</h3>
            </div>
            
            <div className="space-y-3 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#F1F5F9]">
              {timeline.length > 0 ? timeline.map((item: any, index: number) => (
                <div key={index} className="flex gap-4 relative">
                  <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm shrink-0 z-10 mt-1 ${index === 0 ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'}`}></div>
                  <div className="space-y-0">
                    <div className="text-[9px] font-bold text-[#2563EB] uppercase">{item.date}</div>
                    <div className="text-sm font-bold text-[#111827]">{item.role}</div>
                    <div className="text-[11px] text-[#6B7280]">{item.company}</div>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-gray-400 pl-6 italic">No timeline entries provided.</p>
              )}
            </div>
          </div>
        </div>

        {/* Showreel Section */}
        <div className="bg-white p-5 rounded-[24px] border border-[#E5E7EB] space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center text-white">
              <Play size={16} fill="white" />
            </div>
            <h3 className="font-bold text-lg">Showreel</h3>
          </div>
          
          <div 
            className="relative rounded-[20px] overflow-hidden aspect-[21/7] bg-black group shadow-premium"
          >
            {showreel.type === 'youtube' ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(showreel.url)}?autoplay=0`}
                title={showreel.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video 
                src={getFileUrl(showreel.url)} 
                controls 
                className="w-full h-full object-contain"
                poster={'/assets/showreel_thumbnail_1777487470036.png'}
              />
            )}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <span className="bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold">{showreel.title}</span>
              <span className="bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold">{showreel.duration}</span>
            </div>
          </div>
        </div>

        {/* Work Ledger Section */}
        <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center text-[#111827]">
                <Briefcase size={20} />
              </div>
              <h3 className="font-bold text-xl">Work Ledger</h3>
            </div>
            <button className="text-[#2563EB] text-sm font-bold flex items-center gap-1 hover:underline">
              View All Projects <ArrowRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {workLedger.length > 0 ? workLedger.map((project: any, idx: number) => (
              <div key={idx} className="border border-[#F1F5F9] rounded-[20px] overflow-hidden">
                <div 
                  className="p-5 flex items-center gap-6 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                  onClick={() => setIsWorkLedgerOpen(idx === 0 ? !isWorkLedgerOpen : true)}
                >
                  <div className="w-[180px] h-[180px] md:h-auto md:aspect-square bg-gray-900 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={publicProfile?.workLedgerImage ? getFileUrl(publicProfile.workLedgerImage) : (project.shotSamples?.length > 0 ? getFileUrl(project.shotSamples[0]) : '/assets/superhero_team_thumbnail_1777487519840.png')} 
                      alt={project.projectName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 self-start pt-2">
                    <div className="flex justify-between items-start w-full">
                      <div className="space-y-1">
                        <h4 className="text-xl font-bold">{project.projectName}</h4>
                        <div className="text-[#64748B] text-sm font-medium">{project.role}  •  {project.year}  •  {project.type}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="bg-[#DCFCE7] text-[#166534] px-4 py-1.5 rounded-full text-xs font-bold">{project.status}</span>
                        {(idx === 0 && isWorkLedgerOpen) ? <ChevronUp size={20} className="text-[#94A3B8]" /> : <ChevronDown size={20} className="text-[#94A3B8]" />}
                      </div>
                    </div>

                    {(idx === 0 && isWorkLedgerOpen) && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 pt-6 border-t border-[#F1F5F9]">
                        <div className="space-y-3">
                          <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Contribution</div>
                          <ul className="space-y-2 text-[11px] text-[#374151] font-medium leading-relaxed">
                            {(project.contribution || '').split('\n').map((line: string, i: number) => (
                               <li key={i} className="flex items-start gap-1.5"><span className="mt-1.5 w-1 h-1 bg-[#374151] rounded-full shrink-0"></span> {line}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Scope</div>
                          <ul className="space-y-2 text-[11px] text-[#374151] font-medium leading-relaxed">
                            {(project.scope || '').split('\n').map((line: string, i: number) => (
                               <li key={i} className="flex items-start gap-1.5"><span className="mt-1.5 w-1 h-1 bg-[#374151] rounded-full shrink-0"></span> {line}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-3 relative">
                          <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Shot Samples</div>
                          <div className="flex flex-wrap gap-2">
                            {(publicProfile?.workLedgerImage ? project.shotSamples : project.shotSamples?.slice(1))?.slice(0, 3).map((sample: string, i: number) => (
                              <div key={i} className="w-[70px] h-[50px] bg-gray-200 rounded-lg overflow-hidden border border-[#F1F5F9] shadow-sm">
                                 <img 
                                  src={getFileUrl(sample)} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                            ))}
                            {(!project.shotSamples || project.shotSamples.length <= 1) && (
                              <p className="text-[10px] text-[#64748B] italic">No additional samples.</p>
                            )}
                          </div>
                          <div className="absolute -bottom-2 right-0">
                            <button className="text-[10px] font-bold text-[#2563EB] flex items-center gap-1 hover:underline">
                              View Shot Samples <ArrowRight size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center bg-brand-surface/30 rounded-3xl border border-dashed border-gray-200">
                <p className="text-sm text-text-muted font-medium">No projects showcase available yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Verification Bar */}
        <div className="bg-[#EFF6FF]/40 p-5 rounded-[24px] border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#2563EB] shadow-sm border border-[#E5E7EB]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-tight">AUI Verified Talent</h4>
              <p className="text-[9px] text-[#6B7280] font-medium leading-tight">Verified by AUI Studio. Trusted Worldwide.</p>
            </div>
          </div>

          <div className="flex gap-6">
            {[
              { label: 'Identity', icon: UserCheck },
              { label: 'Experience', icon: Award },
              { label: 'Background', icon: ShieldCheck },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-7 h-7 bg-[#2563EB] rounded-full flex items-center justify-center text-white">
                  <item.icon size={14} />
                </div>
                <span className="text-[7px] font-bold uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pl-5 border-l border-gray-200">
            <div className="w-10 h-10 bg-white p-1 rounded-lg border border-[#E5E7EB]">
              <QrCode className="w-full h-full text-[#111827]" />
            </div>
            <div className="text-[7px] font-bold uppercase tracking-wider leading-tight">
              Scan to verify
            </div>
          </div>
        </div>

        <EngagementModal
          isOpen={isEngagementModalOpen}
          onClose={() => setIsEngagementModalOpen(false)}
          onSubmit={handleRequestEngagement}
          professionalName={displayName}
          loading={isSubmittingEngagement}
        />
      </main>
    </div>
  );
};

export default TalentIDPage;



