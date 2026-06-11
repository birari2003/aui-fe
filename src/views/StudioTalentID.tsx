import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  MapPin, Mail, Phone, Globe, Play, 
  ChevronLeft, ChevronRight, ArrowRight,
  Linkedin, Instagram, Youtube, Twitter,
  CheckCircle2, Star, Briefcase, Users,
  Target, Layout, ShieldCheck,
  Building2, Plus, Clock, ExternalLink
} from 'lucide-react';
import { getStudioPublicProfileByCode } from '../services/studioProfileService';
import { BASE_URL } from '../utils/urls';

const BACKEND_URL = BASE_URL;

const StudioTalentID = () => {
  const { talentCode } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const goToTalentPool = () => {
    navigate('/hire');
  };
  const projectsRef = React.useRef<HTMLDivElement>(null);

  const scrollProjects = (direction: 'left' | 'right') => {
    if (projectsRef.current) {
      const scrollAmount = projectsRef.current.clientWidth;
      projectsRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!talentCode) return;
      try {
        const res = await getStudioPublicProfileByCode(talentCode);
        const payload = await res.json();
        if (res.ok) {
          setProfile(payload.data);
        } else {
          setError(payload.message || 'Studio profile not found');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const payload = await res.json();
          setCurrentUserRole(payload.data?.role || null);
        }
      } catch (err) {
        console.error('Fetch user role error:', err);
      }
    };
    fetchProfile();
    fetchUserRole();
  }, [talentCode]);

  const getFileUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}/${path.replace(/\\/g, '/')}`;
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : url;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isIncomplete = profile && !profile.name;

  if (error || !profile || isIncomplete) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-white rounded-[24px] shadow-premium flex items-center justify-center mb-6 border border-gray-100">
          <Building2 size={32} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">
          {isIncomplete ? 'Profile Not Completed' : (error === 'Studio profile not published' ? 'Profile Not Published Yet' : (error || 'Profile Not Found'))}
        </h1>
        <p className="text-gray-500 font-medium mb-8 max-w-sm">
          {isIncomplete 
            ? "This studio hasn't completed their public profile setup yet. Check back soon!"
            : (error === 'Studio profile not published' 
                ? "Studio hasn't set up their public portfolio yet. Check back later!" 
                : "Studio hasn't set up their public portfolio yet. Check back later!")}
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <ArrowRight size={16} className="rotate-180" />
          Go Back
        </button>
      </div>
    );
  }

  // Use dynamic job postings from profile if available
  const jobPostings = profile.user?.studio?.jobPostings || [
    { title: 'Lighting Artist', projectType: 'Feature Film', experienceRequired: '3-5 Years' },
    { title: '3D Animator', projectType: 'Animated Series', experienceRequired: '2-5 Years' },
    { title: 'Compositing Artist', projectType: 'Feature Film', experienceRequired: '3-5 Years' },
    { title: 'VFX Artist', projectType: 'Short Film', experienceRequired: '2-4 Years' },
  ];

  const seoTitle = profile ? `${profile.name} - Studio Portfolio` : "Loading Studio Profile";
  const seoDescription = profile 
    ? `${profile.name} is a verified studio specializing in ${profile.specialty || 'creative production'}. Completed ${profile.projectsCompleted || '0'}+ projects. View their projects, open roles, and showreel.`
    : "View studio profiles and creative showcases on AUI.";
  const seoKeywords = profile 
    ? `${profile.name}, ${profile.specialty || ''}, studio profile, animation studio, VFX studio, AUI`
    : "animation studio, VFX studio, creative portfolio, AUI";

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] font-sans pb-8 text-left selection:bg-[#4F46E5]/10">
      <SEO 
        title={seoTitle} 
        description={seoDescription} 
        keywords={seoKeywords} 
      />
      {/* 0. TOP NAVIGATION: BACK BUTTON */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#4F46E5] font-black uppercase tracking-[0.2em] text-[10px] transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      </div>

      {/* 1. HERO SECTION - FULL WIDTH */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 mt-2">
        <div className="bg-[#1A1C1E] rounded-3xl overflow-hidden shadow-2xl relative p-4 md:p-6 min-h-[300px] flex items-center">
          {/* Banner Image Background */}
          <div className="absolute inset-0 z-0">
             <img 
              src={getFileUrl(profile.bannerImage) || 'https://images.unsplash.com/photo-1618172193622-ae2d025f4128?q=80&w=2000&auto=format&fit=crop'} 
              className="w-full h-full object-cover opacity-25"
              alt="Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1C1E] via-[#1A1C1E]/80 to-transparent" />
          </div>

          <div className="relative z-10 w-full flex flex-col gap-4">
            {/* Top Row: Logo & Info */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Logo Box */}
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex items-center justify-center shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="w-full h-full bg-[#1A1C1E] rounded-xl flex items-center justify-center overflow-hidden border border-white/10">
                  {profile.logo ? (
                    <img 
                      src={getFileUrl(profile.logo)} 
                      className="max-w-[85%] max-h-[85%] object-contain"
                      alt="Logo"
                    />
                  ) : (
                    <div className="text-white font-black text-lg tracking-tighter">STUDIO</div>
                  )}
                </div>
              </div>

              {/* Main Text Content */}
              <div className="flex-1 space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight">
                      {profile.name}
                    </h1>
                    <div className="w-6 h-6 bg-[#2563EB] rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                  </div>
                  <p className="text-[#818CF8] text-lg md:text-xl font-bold tracking-tight">{profile.specialty || 'Premium Animation & VFX Studio'}</p>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-white/60 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#818CF8]" />
                    {profile.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-[#818CF8]" />
                    {profile.email}
                  </div>
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                      <Globe size={14} className="text-[#818CF8]" />
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>

                <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-3xl font-semibold italic">
                  "{profile.about || 'We are a global creative studio delivering top-tier animation and VFX for feature films, series, and commercials.'}"
                </p>
              </div>
            </div>

            {/* Middle Row: Stats Bar */}
            <div className="flex flex-wrap items-center gap-6 md:gap-10 py-4 border-y border-white/10 w-full lg:w-fit px-6 bg-white/5 backdrop-blur-sm rounded-xl">
              <div className="space-y-0">
                <div className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-tighter">{profile.projectsCompleted || '48'}+</div>
                <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Projects</div>
              </div>
              <div className="hidden md:block h-8 w-[1px] bg-white/20" />
              <div className="space-y-0">
                <div className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-tighter">{profile.artistsHired || '126'}+</div>
                <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Artists</div>
              </div>
              <div className="hidden md:block h-8 w-[1px] bg-white/20" />
              <div className="space-y-0">
                <div className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-tighter">{profile.yearsActive || '8'}+</div>
                <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Years</div>
              </div>
              <div className="hidden md:block h-8 w-[1px] bg-white/20" />
              <div className="space-y-0">
                <div className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-tighter">{profile.awardsWon || '12'}</div>
                <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Awards</div>
              </div>
            </div>

            {/* Bottom Row: Button */}
            <div className="flex flex-wrap items-center gap-3">
              {currentUserRole === 'studio' && (
                <button 
                  onClick={() => navigate('/dashboard/studio')}
                  className="bg-white hover:bg-gray-100 text-[#111827] px-6 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  <Building2 size={16} />
                  Studio Hub
                </button>
              )}
              <button 
                onClick={goToTalentPool}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all hover:scale-105 active:scale-95 group"
              >
                <Users size={16} className="group-hover:scale-110 transition-transform" />
                Go to Talent Pool
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THREE-CARD ROW: About, What We Do, Why Us */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
        {/* About Studio */}
        <div className="bg-white rounded-2xl p-4 shadow-lg shadow-gray-200/50 relative overflow-hidden h-full flex flex-col justify-between border border-gray-100 group hover:-translate-y-0.5 transition-all duration-500">
          <div className="space-y-2">
            <h3 className="text-lg font-black tracking-tight border-b border-gray-50 pb-2">About Studio</h3>
            <p className="text-gray-500 leading-relaxed text-[13px] font-medium">
              {profile.about || "Roll A Rock Studios is an award-winning animation and VFX studio with expertise in feature films, OTT series, commercials, and real-time content."}
            </p>
          </div>
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center ml-auto mt-4 group-hover:bg-[#4F46E5]/5 transition-colors border border-gray-100">
            <Building2 className="text-gray-300 w-6 h-6 group-hover:text-[#4F46E5] transition-colors" />
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-2xl p-4 shadow-lg shadow-gray-200/50 h-full border border-gray-100 hover:-translate-y-0.5 transition-all duration-500">
          <h3 className="text-lg font-black tracking-tight border-b border-gray-50 pb-2 mb-3">What We Do</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-3">
            {(Array.isArray(profile.whatWeDo) && profile.whatWeDo.length > 0 ? profile.whatWeDo : ['Concept Development', 'Lighting & Rendering', 'Animation Production', 'Post Production', 'Visual Effects', 'Real-time Engines']).slice(0, 6).map((service: string, i: number) => (
              <div key={i} className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center text-[#4F46E5] shrink-0 group-hover:bg-[#4F46E5] group-hover:text-white transition-all shadow-sm">
                  {i === 0 ? <img src="/assets/logo_blck.png" className="w-[14px] h-[14px] rounded-[3px] object-contain group-hover:invert transition-all" alt="" /> : i === 1 ? <Target size={14} /> : i === 2 ? <Layout size={14} /> : i === 3 ? <Clock size={14} /> : i === 4 ? <ShieldCheck size={14} /> : <img src="/assets/logo_blck.png" className="w-[14px] h-[14px] rounded-[3px] object-contain group-hover:invert transition-all" alt="" />}
                </div>
                <span className="text-[11px] font-black text-gray-700 leading-tight group-hover:text-[#4F46E5] transition-colors">{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Work With Us */}
        <div className="bg-white rounded-2xl p-4 shadow-lg shadow-gray-200/50 h-full border border-gray-100 hover:-translate-y-0.5 transition-all duration-500">
          <h3 className="text-lg font-black tracking-tight border-b border-gray-50 pb-2 mb-3">Why Work With Us</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-3">
            {(Array.isArray(profile.whyWorkWithUs) && profile.whyWorkWithUs.length > 0 ? profile.whyWorkWithUs : ['Creative Team', 'On-time Delivery', 'Global Standards', 'Learning Hub', 'Cutting-edge Tech', 'Vibrant Culture']).slice(0, 6).map((point: string, i: number) => (
              <div key={i} className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center text-[#4F46E5] shrink-0 group-hover:bg-[#4F46E5] group-hover:text-white transition-all shadow-sm">
                   {i % 2 === 0 ? <CheckCircle2 size={14} /> : <Star size={14} />}
                </div>
                <span className="text-[11px] font-black text-gray-700 leading-tight group-hover:text-[#4F46E5] transition-colors">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SIDE-BY-SIDE: Studio Reel & Our Projects */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 grid grid-cols-1 lg:grid-cols-12 gap-3 mt-2">
        {/* Studio Reel (LHS - 7/12) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-black tracking-tight">Studio Reel</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Main Video Player */}
              <div className="flex-[7] aspect-[2/1] bg-[#1A1C1E] rounded-xl overflow-hidden relative shadow-2xl border-2 border-gray-50 group">
                {!isPlaying ? (
                  <div className="w-full h-full relative cursor-pointer" onClick={() => setIsPlaying(true)}>
                     <img 
                      src={getFileUrl(profile.bannerImage) || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop'} 
                      className="w-full h-full object-cover opacity-70 transition-transform duration-1000 group-hover:scale-105" 
                      alt="Reel"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:scale-110 group-hover:bg-white transition-all duration-500">
                        <Play size={24} className="fill-[#4F46E5] text-[#4F46E5] ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                      <div className="text-white font-black text-[9px] tracking-[0.2em] uppercase opacity-80">02:45 / 02:45</div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <iframe 
                      src={getEmbedUrl(profile.studioReelUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4')} 
                      className="w-full h-full border-0" 
                      allow="autoplay; fullscreen" 
                      title="Studio Reel"
                    />
                    {profile.studioReelUrl && (profile.studioReelUrl.includes('youtube.com') || profile.studioReelUrl.includes('youtu.be') || profile.studioReelUrl.includes('vimeo.com')) && (
                      <a
                        href={profile.studioReelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-md z-20"
                      >
                        <ExternalLink size={12} className="text-white" />
                        Watch on {profile.studioReelUrl.includes('vimeo.com') ? 'Vimeo' : 'YouTube'}
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* More Videos List */}
              <div className="flex-[3] space-y-3">
                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] border-l-4 border-[#4F46E5] pl-2">Videos</h4>
                <div className="space-y-2">
                  {[
                    { title: 'Showreel 2024', dur: '02:45' },
                    { title: 'Cyber City 2099', dur: '03:12' },
                    { title: 'The Last Kingdom', dur: '04:03' },
                    { title: 'BTS - Production', dur: '02:48' },
                  ].map((v, i) => (
                    <div key={i} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition-all cursor-pointer group border border-transparent hover:border-gray-100">
                      <div className="w-20 h-14 bg-gray-900 rounded-md shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 relative shadow-sm">
                         <Play size={12} className="text-white/30 group-hover:text-white transition-all" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] font-black text-gray-800 truncate leading-tight group-hover:text-[#4F46E5] transition-colors">{v.title}</div>
                        <div className="text-[8px] text-gray-400 font-bold uppercase mt-0.5 tracking-tighter">{v.dur}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="text-[9px] font-black text-[#4F46E5] uppercase tracking-[0.2em] flex items-center gap-1 hover:translate-x-1 transition-transform px-1">
                  View <ArrowRight size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Our Projects (RHS - 5/12) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col relative">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-black tracking-tight">Our Projects</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => scrollProjects('left')}
                className="w-7 h-7 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center hover:bg-white hover:shadow-lg transition-all transform hover:scale-110 active:scale-90"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                onClick={() => scrollProjects('right')}
                className="w-7 h-7 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center hover:bg-white hover:shadow-lg transition-all transform hover:scale-110 active:scale-90"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          
          <div 
            ref={projectsRef}
            className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 items-start snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {(Array.isArray(profile.projects) && profile.projects.length > 0 ? profile.projects : [
              { name: 'The Last Kingdom', type: 'Feature Film', year: '2023', thumbnail: '' },
              { name: 'Cyber City 2099', type: 'Sci-Fi Series', year: '2022', thumbnail: '' },
              { name: 'Hanuman Chronicles', type: 'Feature Film', year: '2022', thumbnail: '' },
              { name: 'Elysium', type: 'Short Film', year: '2021', thumbnail: '' },
              { name: 'Visual Tech', type: 'Short Film', year: '2024', thumbnail: '' },
              { name: 'BTS - Production', type: 'Short Film', year: '2024', thumbnail: '' },
            ]).map((proj: any, i: number) => (
              <div 
                key={i} 
                className="min-w-[45%] bg-[#F9FAFB] rounded-xl p-2 group cursor-pointer border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col snap-start"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 relative mb-2">
                  {proj.thumbnail ? (
                    <img src={getFileUrl(proj.thumbnail)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={proj.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gradient-to-br from-gray-100 to-gray-200">
                      <Layout size={18} />
                    </div>
                  )}
                </div>
                <div className="px-0.5">
                  <h4 className="text-[10px] font-black text-gray-800 group-hover:text-[#4F46E5] truncate transition-colors tracking-tight leading-tight">{proj.name}</h4>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{proj.type} • {proj.year}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 flex justify-end">
            <button className="text-[9px] font-black text-[#4F46E5] uppercase tracking-[0.2em] flex items-center gap-1 hover:underline transition-all">
              View all <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM GRID: Roles, Clients, Contact */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 grid grid-cols-1 lg:grid-cols-3 gap-3 mt-2">
        {/* Open Roles - DYNAMIC */}
        <div className="bg-white rounded-2xl p-4 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-all duration-500">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-black tracking-tight">Open Roles</h3>
            <button className="text-[9px] font-black text-[#4F46E5] uppercase tracking-[0.2em] hover:underline flex items-center gap-1 transition-all">
              View roles <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {jobPostings.map((job: any, i: number) => (
              <div key={i} className="p-2 bg-gray-50/50 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-gray-300 group-hover:text-[#4F46E5] group-hover:scale-110 transition-all shadow-md group-hover:shadow-[#4F46E5]/10">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <div className="text-[13px] font-black text-gray-800 leading-tight group-hover:text-[#4F46E5] transition-colors">{job.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[8px] font-black bg-[#EEF2FF] text-[#4F46E5] px-1.5 py-0.5 rounded-full uppercase">Full Time</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase">{job.projectType || 'Project'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] font-bold text-gray-400 uppercase mb-0.5">{job.experienceRequired || '3-5 Years'}</div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-[#4F46E5] group-hover:translate-x-1 transition-all ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Clients */}
        <div className="bg-white rounded-2xl p-4 shadow-lg shadow-gray-200/50 flex flex-col border border-gray-100 hover:shadow-xl transition-all duration-500">
          <h3 className="text-lg font-black tracking-tight border-b border-gray-50 pb-2 mb-3">Our Clients</h3>
          <div className="grid grid-cols-3 gap-6 flex-1 items-start mt-4">
            {(Array.isArray(profile.clients) && profile.clients.length > 0 ? profile.clients : [1,2,3,4,5,6,7,8,9]).map((c: any, i: number) => (
              <div key={i} className="h-12 flex items-center justify-center transition-all duration-500 transform hover:scale-125 opacity-80 hover:opacity-100 cursor-pointer">
                {typeof c === 'string' ? (
                  <img src={getFileUrl(c)} className="max-h-full max-w-full object-contain filter drop-shadow-sm" alt="Client" />
                ) : (
                  <div className="w-8 h-8 bg-gray-50 rounded-lg animate-pulse flex items-center justify-center">
                     <Star size={12} className="text-gray-200" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-4 shadow-lg shadow-gray-200/50 space-y-4 border border-gray-100 hover:shadow-xl transition-all duration-500">
          <h3 className="text-lg font-black tracking-tight border-b border-gray-50 pb-2">Contact</h3>
          <div className="space-y-3">
            <div className="flex gap-3 group">
              <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-[#4F46E5] shrink-0 group-hover:bg-[#4F46E5] group-hover:text-white transition-all shadow-md group-hover:shadow-[#4F46E5]/20">
                <Mail size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-0.5">Email</div>
                <div className="text-[13px] font-black text-gray-800 truncate tracking-tight">{profile.email}</div>
              </div>
            </div>
            <div className="flex gap-3 group">
              <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-[#4F46E5] shrink-0 group-hover:bg-[#4F46E5] group-hover:text-white transition-all shadow-md group-hover:shadow-[#4F46E5]/20">
                <Phone size={16} />
              </div>
              <div>
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-0.5">Phone</div>
                <div className="text-[13px] font-black text-gray-800 tracking-tight">{profile.phone || '+91 98765 43210'}</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 space-y-2">
            <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Follow</h4>
            <div className="flex gap-2">
              {[
                { icon: Linkedin, url: profile.socialLinks?.linkedin },
                { icon: Instagram, url: profile.socialLinks?.instagram },
                { icon: Youtube, url: profile.socialLinks?.youtube },
                { icon: Twitter, url: profile.socialLinks?.twitter },
              ].map((s, i) => (
                <a key={i} href={s.url || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-[#4F46E5] hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-xl shadow-gray-200">
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. FOOTER CTA */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 mt-4">
        <div className="bg-[#4F46E5] rounded-3xl p-6 md:p-8 text-white flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
          {/* Abstract Design Elements */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10 space-y-3 text-center lg:text-left max-w-xl">
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter leading-tight">
              Looking for the perfect talent?
            </h2>
            <p className="text-white/80 text-sm font-bold">Join our network of elite creators today.</p>
          </div>
          <button 
            onClick={goToTalentPool}
            className="relative z-10 bg-white text-[#4F46E5] px-8 py-4 rounded-xl font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-xs group"
          >
            <Users size={20} />
            Go to Talent Pool
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudioTalentID;
