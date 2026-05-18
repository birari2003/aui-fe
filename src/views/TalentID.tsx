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
  ArrowLeft,
  Share2,
  Download as DownloadIcon,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link as LinkIcon,
  MessageCircle,
  Code,
  Star,
  CheckCircle2,
  Briefcase,
  BadgeCheck,
  Users
} from 'lucide-react';
import { toPng } from 'html-to-image';
import Modal from '../components/Modal';
import QRCode from 'react-qr-code';
import { getPublicProfileByCode } from '../services/publicProfileServices';
import { getMe } from '../services/userServices';
import { addTalentToBench, createStudioRequestProfessional } from '../services/studioServices';
import EngagementModal from '../components/EngagementModal';
import { View, UserRole } from '../types';
import { BASE_URL } from '../utils/urls';

const BACKEND_URL = BASE_URL;

const levelStyles: Record<string, { label: string; className: string }> = {
  fresher: { label: 'Fresher', className: 'bg-[#cfcfcf] text-[#30343a]' },
  junior: { label: 'Junior', className: 'bg-[#3d7be0] text-white' },
  mid: { label: 'Mid', className: 'bg-[#223a82] text-white' },
  senior: { label: 'Senior', className: 'bg-[#18224e] text-white' },
};

const levelHighlightStyles: Record<string, { title: string; subtitle: string; className: string; dotClassName: string }> = {
  fresher: {
    title: 'Learning & Growing',
    subtitle: 'Open to new opportunities',
    className: 'bg-[#e9f7ee] text-[#1b7a48]',
    dotClassName: 'bg-[#27c36b]',
  },
  junior: {
    title: 'Building Experience',
    subtitle: 'Ready for assignments',
    className: 'bg-[#edf3ff] text-[#3065d7]',
    dotClassName: 'bg-[#3f6de2]',
  },
  mid: {
    title: 'Industry Experienced',
    subtitle: 'Proven track record',
    className: 'bg-[#e8eefc] text-[#243f8f]',
    dotClassName: 'bg-[#233ea0]',
  },
  senior: {
    title: 'Production Ready',
    subtitle: 'Lead. Deliver. Inspire.',
    className: 'bg-[#eef0ff] text-[#1d2358]',
    dotClassName: 'bg-[#1d2358]',
  },
};

const productionTypeLabels: Record<string, string> = {
  film: 'Feature Film',
  tv: 'TV',
  web: 'Web',
  ads: 'Ads',
};

const positionLabels: Record<string, string> = {
  artist: 'Artist',
  lead: 'Lead',
  supervisor: 'Supervisor',
  director: 'Director',
  other: 'Other',
};

const isAvailableNow = (availability?: string) => {
  if (!availability) return false;
  return ['available', 'immediate', 'now', 'open'].some((word) =>
    availability.toLowerCase().includes(word)
  );
};

const convertUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to convert image to base64:", error);
    return '';
  }
};

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmittingEngagement, setIsSubmittingEngagement] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const downloadCardRef = React.useRef<HTMLDivElement>(null);
  const [downloadAvatarUrl, setDownloadAvatarUrl] = useState<string>('');

  useEffect(() => {
    if (profileData) {
      const getFileUrlLocal = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${BACKEND_URL}/${path.replace(/\\/g, '/')}`;
      };
      const { professional, publicProfile } = profileData;
      const avatarUrlLocal = publicProfile?.profileImage ? getFileUrlLocal(publicProfile.profileImage) : (professional?.avatarUrl || '/assets/sarah_chen_profile_1777487447512.png');
      
      if (avatarUrlLocal) {
        convertUrlToBase64(avatarUrlLocal).then(base64 => {
          setDownloadAvatarUrl(base64);
        }).catch(err => {
          console.error('Error pre-converting avatar image:', err);
        });
      }
    }
  }, [profileData]);

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

  const handleShare = async () => {
    const url = window.location.href;
    // Check if it's mobile and navigator.share is available
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: `AUI Talent - ${displayName}`,
          text: `Check out ${displayName}'s professional portfolio on AUI.`,
          url: url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOptions = [
    { name: 'WhatsApp', icon: MessageCircle, color: '#25D366', url: `https://wa.me/?text=${encodeURIComponent(`Check out ${displayName}'s portfolio: `)}${encodeURIComponent(window.location.href)}` },
    { name: 'Facebook', icon: Facebook, color: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
    { name: 'X', icon: Twitter, color: '#000000', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${displayName}'s portfolio: `)}&url=${encodeURIComponent(window.location.href)}` },
    { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
    { name: 'Email', icon: Mail, color: '#EA4335', url: `mailto:?subject=${encodeURIComponent(`AUI Talent Portfolio: ${displayName}`)}&body=${encodeURIComponent(`Check out this professional portfolio on AUI: ${window.location.href}`)}` },
    { name: 'Embed', icon: Code, color: '#6B7280', onClick: () => alert('Embed code copied to clipboard!') },
  ];

  const handleDownload = async () => {
    if (downloadCardRef.current === null) return;
    
    try {
      const dataUrl = await toPng(downloadCardRef.current, { 
        cacheBust: true,
        backgroundColor: '#f7f7f8',
        style: {
          borderRadius: '16px'
        }
      });
      const link = document.createElement('a');
      link.download = `TalentID-${displayTalentId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading:', err);
    }
  };

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
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl text-xs font-bold text-[#111827] border border-[#E5E7EB] transition-all"
            >
              <Share2 size={14} className="text-[#2563EB]" />
              Share Talent ID
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <DownloadIcon size={14} />
              Download Talent ID
            </button>
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
        <div ref={cardRef} className="bg-white rounded-[24px] shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col md:flex-row min-h-[400px]">
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
            <div className="w-16 h-16 bg-white p-1 rounded-lg border border-[#E5E7EB] flex items-center justify-center">
              <QRCode value={window.location.href} size={64} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
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

      {/* Share Modal */}
      <Modal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share"
        showFooter={false}
        className="!p-0"
        message={
          <div className="p-8 space-y-8">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2">
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (option.onClick) {
                      e.preventDefault();
                      option.onClick();
                    }
                  }}
                  className="flex flex-col items-center gap-3 min-w-[70px] group transition-transform hover:-translate-y-1"
                >
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all group-hover:shadow-xl"
                    style={{ backgroundColor: option.color }}
                  >
                    <option.icon size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{option.name}</span>
                </a>
              ))}
            </div>

            <div className="relative">
              <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl p-4 pr-32 overflow-hidden">
                <p className="text-xs text-[#111827] font-medium truncate">
                  {window.location.href}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  copied ? 'bg-emerald-500 text-white' : 'bg-[#111827] text-white hover:bg-gray-900'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        }
      />

      {/* Hidden Parent Wrapper positioned off-screen */}
      <div 
        style={{ 
          position: 'fixed', 
          top: '100%', 
          left: 0, 
          width: '640px', 
          zIndex: -9999,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        {/* The actual card that we capture - it has NO offscreen inline styles! */}
        <div 
          ref={downloadCardRef}
          className="bg-[#f7f7f8] p-0 text-left font-sans w-[640px]"
        >
          <div className="overflow-hidden rounded-[16px] border border-[#e1e1e6] bg-[#f7f7f8] p-0 shadow-[0_1px_0_rgba(17,24,39,0.02),0_8px_20px_rgba(15,23,42,0.05)]">
          <div className="grid grid-cols-[162px_1fr] gap-0">
            {/* Left Column: Image */}
            <div className="relative min-h-[262px] bg-[#d8dbe2]">
              <img
                src={downloadAvatarUrl || avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute left-3 top-3 rounded-full bg-[#ececec]/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#3a4048] shadow-sm backdrop-blur-sm">
                {isAvailableNow(professional?.availability) ? 'AVAILABLE NOW' : 'REVIEWING'}
              </div>
              <div
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[#7e8692] shadow-sm backdrop-blur-sm"
              >
                <Star
                  size={15}
                  className="fill-[#4f46e5] text-[#4f46e5]"
                />
              </div>
            </div>

            {/* Right Column: Info */}
            <div className="flex flex-col justify-between px-5 py-4 bg-[#f7f7f8]">
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#55617a]">
                        <ShieldCheck size={13} className="text-[#5f6d88]" />
                        AUI Verified Talent
                      </div>
                      <div className="mt-2 flex items-center gap-2 min-w-0">
                        <h3 className="truncate text-[21px] font-semibold leading-[0.95] tracking-[-0.03em] text-[#1a1f28]">
                          {displayName}
                        </h3>
                        <BadgeCheck size={16} className="shrink-0 text-[#7d848e]" />
                      </div>
                    </div>

                    <div className={`min-w-[62px] rounded-[10px] px-2.5 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.08em] shadow-sm ${(levelStyles[(professional?.level || 'junior').toLowerCase()] || levelStyles.junior).className}`}>
                      <div>{(levelStyles[(professional?.level || 'junior').toLowerCase()] || levelStyles.junior).label}</div>
                      <div className="mt-0.5 text-[10px] font-medium tracking-[0.12em] opacity-90">Level</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#4f46e5] bg-[#eeebff] px-3 py-1.5 rounded-full w-fit border border-[#4f46e5]/10">
                    <Users size={12} />
                    Benched by {professional?.savedByStudios?.length || 0} Studios
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8b9099]">Talent ID</div>
                  <div className="mt-1.5 flex items-center justify-between rounded-[10px] border border-[#d9dce2] bg-[#fbfbfc] px-3.5 py-2.5">
                    <div className="font-mono text-[24px] font-bold leading-[0.95] tracking-[0.18em] bg-gradient-to-r from-[#18224e] to-[#4f46e5] bg-clip-text text-transparent">
                      {displayTalentId}
                    </div>
                    <BadgeCheck className="text-[#4f46e5] shrink-0" size={20} />
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-0 border-b border-[#e5e7eb] pb-2.5">
                    <div className="pr-4">
                      <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9aa0a8]">
                        <ShieldCheck size={11} /> Experience Level
                      </div>
                      <div className="mt-1 text-[13px] font-medium text-[#1d2532] capitalize">
                        {professional?.level || 'Junior'}
                      </div>
                    </div>
                    <div className="border-l border-[#e5e7eb] pl-4">
                      <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9aa0a8]">
                        <Briefcase size={11} /> Production Types
                      </div>
                      <div className="mt-1 text-[13px] font-medium text-[#1d2532]">
                        {productionTypeLabels[(professional?.productionType || 'film').toLowerCase()] || 'Feature Film'} • {positionLabels[(professional?.position || 'artist').toLowerCase()] || 'Artist'}
                      </div>
                    </div>
                  </div>

                  <div className={`mt-2.5 rounded-[10px] px-4 py-3 ${(levelHighlightStyles[(professional?.level || 'junior').toLowerCase()] || levelHighlightStyles.junior).className}`}>
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 h-3 w-3 rounded-full ${(levelHighlightStyles[(professional?.level || 'junior').toLowerCase()] || levelHighlightStyles.junior).dotClassName}`} />
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] leading-none">
                          {(levelHighlightStyles[(professional?.level || 'junior').toLowerCase()] || levelHighlightStyles.junior).title}
                        </div>
                        <div className="mt-1 text-[11px] leading-snug opacity-80">
                          {(levelHighlightStyles[(professional?.level || 'junior').toLowerCase()] || levelHighlightStyles.junior).subtitle}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 text-[#6f7580]">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.14em]">
                    <ShieldCheck size={13} className="text-[#6d7480]" />
                    Identity Verified
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.14em]">
                    <Briefcase size={13} className="text-[#6d7480]" />
                    Work Verified
                  </div>
                </div>
                <div className="w-16 h-16 bg-white p-1 rounded-lg border border-[#E5E7EB] flex shrink-0 items-center justify-center shadow-sm animate-none">
                  <QRCode value={`${window.location.origin}/talent/${displayTalentId}`} size={56} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                <div
                  className="h-10 rounded-[10px] bg-black px-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white flex items-center justify-center"
                >
                  View Profile
                </div>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#5641ea] text-white shadow-[0_10px_20px_rgba(86,65,234,0.22)]"
                >
                  <Bookmark
                    size={14}
                    className="fill-white text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TalentIDPage;



