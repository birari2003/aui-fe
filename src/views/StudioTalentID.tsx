import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  MapPin, Mail, Phone, Globe, Play, 
  ChevronLeft, ChevronRight, ArrowRight,
  Linkedin, Instagram, Youtube, Twitter,
  CheckCircle2, Star, Briefcase, Users,
  Target, Layout, ShieldCheck,
  Building2, Plus, Clock, ExternalLink, Sparkles
} from 'lucide-react';
import { getStudioPublicProfileByCode } from '../services/studioProfileService';
import { BASE_URL } from '../utils/urls';

const BACKEND_URL = BASE_URL;

const VideoThumbnail = ({ url, active }: { url: string; active?: boolean }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  useEffect(() => {
    if (!url) return;

    // Check YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        setThumbnailUrl(`https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`);
      }
      return;
    }

    // Check Vimeo
    if (url.includes('vimeo.com')) {
      const parts = url.split('?')[0].split('/');
      const id = [...parts].reverse().find(p => /^\d+$/.test(p));
      if (id) {
        fetch(`https://vimeo.com/api/v2/video/${id}.json`)
          .then(res => res.json())
          .then(data => {
            if (data && data[0] && data[0].thumbnail_large) {
              setThumbnailUrl(data[0].thumbnail_large);
            }
          })
          .catch(err => console.error('Error fetching Vimeo thumbnail:', err));
      }
    }
  }, [url]);

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-gray-950 group">
      {thumbnailUrl ? (
        <>
          <img src={thumbnailUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Thumbnail" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        </>
      ) : (
        <div className="w-full h-full bg-gray-900" />
      )}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Play 
          size={12} 
          className={`${active ? 'text-[#4F46E5] fill-[#4F46E5]' : 'text-white/70 group-hover:text-white group-hover:scale-110'} transition-all drop-shadow-md`} 
        />
      </div>
    </div>
  );
};

const getWhyWorkIcon = (point: string) => {
  const p = point.toLowerCase();
  if (p.includes('professional') || p.includes('team')) return <Briefcase size={12} />;
  if (p.includes('delivery') || p.includes('time') || p.includes('deadline')) return <Clock size={12} />;
  if (p.includes('creative') || p.includes('quality') || p.includes('excellence')) return <Star size={12} />;
  if (p.includes('standard') || p.includes('global')) return <Globe size={12} />;
  if (p.includes('support') || p.includes('end-to-end')) return <ShieldCheck size={12} />;
  if (p.includes('communication') || p.includes('transparent')) return <Target size={12} />;
  return <CheckCircle2 size={12} />;
};

const StudioTalentID = () => {
  const { talentCode } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [activeClientPage, setActiveClientPage] = useState(0);
  const [activeProjectPage, setActiveProjectPage] = useState(0);
  const goToTalentPool = () => {
    navigate('/hire');
  };

  const getWhyWorkWithUsPoints = () => {
    let rawPoints: string[] = [];
    if (Array.isArray(profile?.whyWorkWithUs)) {
      rawPoints = profile.whyWorkWithUs;
    }
    if (rawPoints.length === 1 && rawPoints[0].includes('✓')) {
      rawPoints = rawPoints[0].split('✓').map((s: string) => s.trim()).filter(Boolean);
    } else if (rawPoints.length === 0) {
      rawPoints = [
        'Experienced Industry Professionals: Skilled team with years of industry expertise',
        'On-Time Delivery: Committed to deadlines, every time',
        'High-Quality Creative Output: Pixel-perfect creative that stands out',
        'Global Production Standards: International workflows and best practices',
        'End-to-End Production Support: From concept to final delivery',
        'Transparent Communication: Clear, consistent, and collaborative'
      ];
    }
    return rawPoints.map((point: string) => {
      let title = point;
      let subtitle = '';
      if (point.includes(':')) {
        const parts = point.split(':');
        title = parts[0].trim();
        subtitle = parts.slice(1).join(':').trim();
      } else if (point.includes(' - ')) {
        const parts = point.split(' - ');
        title = parts[0].trim();
        subtitle = parts.slice(1).join(' - ').trim();
      }
      return { title, subtitle };
    });
  };

  const projectsRef = React.useRef<HTMLDivElement>(null);
  const clientsRef = React.useRef<HTMLDivElement>(null);

  const scrollProjects = (direction: 'left' | 'right') => {
    if (projectsRef.current) {
      const scrollAmount = projectsRef.current.clientWidth;
      projectsRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const scrollClients = (direction: 'left' | 'right') => {
    if (clientsRef.current) {
      const scrollAmount = clientsRef.current.clientWidth;
      clientsRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const handleClientsScroll = () => {
    if (clientsRef.current) {
      const { scrollLeft, clientWidth } = clientsRef.current;
      if (clientWidth > 0) {
        const page = Math.round(scrollLeft / clientWidth);
        setActiveClientPage(page);
      }
    }
  };

  const scrollToClientPage = (pageIndex: number) => {
    if (clientsRef.current) {
      const clientWidth = clientsRef.current.clientWidth;
      clientsRef.current.scrollTo({
        left: pageIndex * clientWidth,
        behavior: 'smooth'
      });
      setActiveClientPage(pageIndex);
    }
  };

  const handleProjectsScroll = () => {
    if (projectsRef.current) {
      const { scrollLeft, clientWidth } = projectsRef.current;
      if (clientWidth > 0) {
        const page = Math.round(scrollLeft / clientWidth);
        setActiveProjectPage(page);
      }
    }
  };

  const scrollToProjectPage = (pageIndex: number) => {
    if (projectsRef.current) {
      const clientWidth = projectsRef.current.clientWidth;
      projectsRef.current.scrollTo({
        left: pageIndex * clientWidth,
        behavior: 'smooth'
      });
      setActiveProjectPage(pageIndex);
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
    if (url.includes('vimeo.com')) {
      const parts = url.split('?')[0].split('/');
      const id = [...parts].reverse().find(p => /^\d+$/.test(p));
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : url;
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
        <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center mb-6 border border-gray-100">
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
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
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
    ? `${profile.name} is a verified studio specializing in ${profile.specialty || 'creative production'}. Completed ${profile.projectsCompleted || '0'} projects. View their projects, open roles, and showreel.`
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
        <div className="bg-[#1A1C1E] rounded-3xl overflow-hidden relative p-4 md:p-6 min-h-[300px] flex items-center">
          {/* Banner Image Background */}
          <div className="absolute inset-0 z-0">
             <img 
              src={getFileUrl(profile.bannerImage) || 'https://images.unsplash.com/photo-1618172193622-ae2d025f4128?q=80&w=2000&auto=format&fit=crop'} 
              className="w-full h-full object-cover"
              alt="Banner"
            />
          </div>

          <div className="relative z-10 w-full flex flex-col gap-4">
            {/* Top Row: Logo & Info */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Logo Box */}
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex items-center justify-center shrink-0">
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
                    <div className="w-6 h-6 bg-[#2563EB] rounded-full flex items-center justify-center shrink-0">
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
              </div>
            </div>

            {/* Middle Row: Stats Bar */}
            <div className="flex flex-wrap items-center gap-6 md:gap-10 py-4 border-y border-white/10 w-full lg:w-fit px-6 bg-white/5 backdrop-blur-sm rounded-xl">
              <div className="space-y-0">
                <div className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-tighter">
                  {profile.projectsCompleted || '0'}
                </div>
                <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Projects</div>
              </div>
              <div className="hidden md:block h-8 w-[1px] bg-white/20" />
              <div className="space-y-0">
                <div className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-tighter">
                  {profile.artistsHired || '0'}
                </div>
                <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Artists</div>
              </div>
              <div className="hidden md:block h-8 w-[1px] bg-white/20" />
              <div className="space-y-0">
                <div className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-tighter">
                  {profile.yearsActive || '0'}
                </div>
                <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Years</div>
              </div>
              <div className="hidden md:block h-8 w-[1px] bg-white/20" />
              <div className="space-y-0">
                <div className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-tighter">
                  {profile.awardsWon || '0'}
                </div>
                <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Awards</div>
              </div>
            </div>

            {/* Bottom Row: Button */}
            <div className="flex flex-wrap items-center gap-3">
              {currentUserRole === 'studio' && (
                <button 
                  onClick={() => navigate('/dashboard/studio')}
                  className="bg-white hover:bg-gray-100 text-[#111827] px-6 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 border border-white/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Building2 size={16} />
                  Studio Hub
                </button>
              )}
              <button 
                onClick={goToTalentPool}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group"
              >
                <Users size={16} className="group-hover:scale-110 transition-transform" />
                Go to Talent Pool
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ABOUT, WHAT WE DO & SERVICES ROW */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 grid grid-cols-1 lg:grid-cols-3 gap-3 mt-2">
        {/* About Studio */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 transition-all duration-500 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-2 mb-2">
              <Building2 className="text-[#4F46E5] w-4.5 h-4.5" />
              <h3 className="text-lg font-black tracking-tight text-gray-900">About Studio</h3>
            </div>
            <p className="text-gray-500 leading-relaxed text-[13px] font-medium text-justify">
              {profile.about || "Roll A Rock Studios is an award-winning animation and VFX studio with expertise in feature films, OTT series, commercials, and real-time content."}
            </p>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 transition-all duration-500 flex flex-col">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-2 mb-3">
            <CheckCircle2 className="text-[#4F46E5] w-4.5 h-4.5" />
            <h3 className="text-lg font-black tracking-tight text-gray-900">What We Do</h3>
          </div>
          <div className="space-y-3 text-justify">
            {(Array.isArray(profile.whatWeDo) && profile.whatWeDo.length > 0 ? profile.whatWeDo : [
              "We produce high-end character animation, visual effects, and immersive virtual production for filmmakers worldwide.",
              "Our dedicated team leverages cutting-edge technology to transform creative concepts into stunning cinematic realities."
            ]).map((paragraph: string, i: number) => (
              <div key={i} className="flex gap-2.5 items-start">
                <div className="w-5 h-5 bg-[#EEF2FF] rounded-md flex items-center justify-center text-[#4F46E5] shrink-0 mt-0.5">
                  <CheckCircle2 size={11} className="fill-[#EEF2FF]" />
                </div>
                <p className="text-gray-500 leading-relaxed text-[12.5px] font-medium flex-1">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Services Provided */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 transition-all duration-500">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-2 mb-3">
            <Target className="text-[#4F46E5] w-4.5 h-4.5" />
            <h3 className="text-lg font-black tracking-tight text-gray-900">Services Provided</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(profile.services) && profile.services.length > 0 ? profile.services : [
              'Programming', 'Development', 'Teaching', 'Skill Development'
            ]).map((service: string, i: number) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-[#EEF2FF] border border-gray-100 rounded-xl group transition-all duration-300">
                <div className="w-5 h-5 bg-white group-hover:bg-[#4F46E5] group-hover:text-white rounded-md flex items-center justify-center text-[#4F46E5] shrink-0 transition-colors">
                  {i % 4 === 0 ? <Sparkles size={11} /> : i % 4 === 1 ? <Target size={11} /> : i % 4 === 2 ? <Layout size={11} /> : <Clock size={11} />}
                </div>
                <span className="text-[11px] font-black text-gray-700 leading-tight group-hover:text-[#4F46E5] transition-colors">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SIDE-BY-SIDE: Studio Reel & Our Projects */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 grid grid-cols-1 lg:grid-cols-12 gap-3 mt-2">
        {/* Studio Reel (LHS - 7/12) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 border border-gray-100 transition-all duration-500 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-black tracking-tight">Studio Reel</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Main Video Player */}
              <div className="flex-[7] aspect-[2/1] bg-[#1A1C1E] rounded-xl overflow-hidden relative border-2 border-gray-50 group">
                {!isPlaying ? (
                  <div className="w-full h-full relative cursor-pointer" onClick={() => setIsPlaying(true)}>
                     <img 
                      src={getFileUrl(profile.bannerImage) || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop'} 
                      className="w-full h-full object-cover opacity-70 transition-transform duration-1000 group-hover:scale-105" 
                      alt="Reel"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-500">
                        <Play size={24} className="fill-[#4F46E5] text-[#4F46E5] ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                      <div className="text-white font-black text-[9px] tracking-[0.2em] uppercase opacity-80">
                        {Array.isArray(profile.extraVideos) && profile.extraVideos.length > 0 ? `${profile.extraVideos.length + 1} Videos Available` : 'Showreel'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {(() => {
                      const videoUrl = currentVideoUrl || profile.studioReelUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4';
                      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                        const match = videoUrl.match(regExp);
                        const ytId = (match && match[2].length === 11) ? match[2] : 'default';
                        return (
                          <iframe 
                            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} 
                            className="w-full h-full border-0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            title="Studio Reel"
                          />
                        );
                      } else if (videoUrl.includes('vimeo.com')) {
                        const parts = videoUrl.split('?')[0].split('/');
                        const vimeoId = [...parts].reverse().find(p => /^\d+$/.test(p)) || '';
                        return (
                          <iframe 
                            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`} 
                            className="w-full h-full border-0" 
                            allow="autoplay; fullscreen; picture-in-picture" 
                            allowFullScreen
                            title="Studio Reel"
                          />
                        );
                      } else {
                        return (
                          <video
                            src={getFileUrl(videoUrl)}
                            controls
                            autoPlay
                            className="w-full h-full object-contain bg-black"
                            poster={'/assets/showreel_thumbnail_1777487470036.png'}
                          />
                        );
                      }
                    })()}
                    {(currentVideoUrl || profile.studioReelUrl) && ((currentVideoUrl || profile.studioReelUrl).includes('youtube.com') || (currentVideoUrl || profile.studioReelUrl).includes('youtu.be') || (currentVideoUrl || profile.studioReelUrl).includes('vimeo.com')) && (
                      <>
                        <a
                          href={currentVideoUrl || profile.studioReelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all z-20"
                        >
                          <ExternalLink size={12} className="text-white" />
                          Watch on {(currentVideoUrl || profile.studioReelUrl).includes('vimeo.com') ? 'Vimeo' : 'YouTube'}
                        </a>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] md:text-[11px] font-medium flex items-center gap-2 shadow-2xl z-20 whitespace-nowrap border border-white/10">
                          <span className="opacity-90">Having trouble playing?</span>
                          <a
                            href={currentVideoUrl || profile.studioReelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#818CF8] hover:text-[#A5B4FC] hover:underline font-black flex items-center gap-1 transition-colors"
                          >
                            Watch directly on {(currentVideoUrl || profile.studioReelUrl).includes('vimeo.com') ? 'Vimeo' : 'YouTube'} <ExternalLink size={11} className="inline" />
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* More Videos List */}
              <div className="flex-[3] space-y-3">
                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] border-l-4 border-[#4F46E5] pl-2">Videos</h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {/* Main Showreel */}
                  {profile.studioReelUrl && (
                    <div 
                      onClick={() => {
                        setCurrentVideoUrl(profile.studioReelUrl);
                        setIsPlaying(true);
                      }}
                      className={`flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition-all cursor-pointer group border ${(!currentVideoUrl || currentVideoUrl === profile.studioReelUrl) ? 'border-[#4F46E5]/30 bg-gray-50' : 'border-transparent hover:border-gray-100'}`}
                    >
                      <div className="w-20 h-14 rounded-md shrink-0 overflow-hidden border border-gray-100 relative">
                         <VideoThumbnail url={profile.studioReelUrl} active={!currentVideoUrl || currentVideoUrl === profile.studioReelUrl} />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[9px] font-black truncate leading-tight group-hover:text-[#4F46E5] transition-colors ${(!currentVideoUrl || currentVideoUrl === profile.studioReelUrl) ? 'text-[#4F46E5] font-black' : 'text-gray-800'}`}>Main Showreel</div>
                        <div className="text-[8px] text-gray-400 font-bold uppercase mt-0.5 tracking-tighter">Reel</div>
                      </div>
                    </div>
                  )}

                  {Array.isArray(profile.extraVideos) && profile.extraVideos.map((v: any, i: number) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        setCurrentVideoUrl(v.url);
                        setIsPlaying(true);
                      }}
                      className={`flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition-all cursor-pointer group border ${currentVideoUrl === v.url ? 'border-[#4F46E5]/30 bg-gray-50' : 'border-transparent hover:border-gray-100'}`}
                    >
                      <div className="w-20 h-14 rounded-md shrink-0 overflow-hidden border border-gray-100 relative">
                         <VideoThumbnail url={v.url} active={currentVideoUrl === v.url} />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[9px] font-black truncate leading-tight group-hover:text-[#4F46E5] transition-colors ${currentVideoUrl === v.url ? 'text-[#4F46E5] font-black' : 'text-gray-800'}`}>{v.title || `Video ${i + 1}`}</div>
                        {v.duration && <div className="text-[8px] text-gray-400 font-bold uppercase mt-0.5 tracking-tighter">{v.duration}</div>}
                      </div>
                    </div>
                  ))}
                  {(!profile.extraVideos || profile.extraVideos.length === 0) && !profile.studioReelUrl && (
                    <div className="text-center py-6 text-[10px] text-gray-400 font-medium">
                      No videos uploaded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Projects (RHS - 5/12) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 border border-gray-100 transition-all duration-500 flex flex-col relative">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-black tracking-tight">Our Projects</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => scrollProjects('left')}
                className="w-7 h-7 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center hover:bg-white transition-all transform hover:scale-110 active:scale-90"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                onClick={() => scrollProjects('right')}
                className="w-7 h-7 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center hover:bg-white transition-all transform hover:scale-110 active:scale-90"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          
          <div 
            ref={projectsRef}
            onScroll={handleProjectsScroll}
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
                className="min-w-[45%] bg-[#F9FAFB] rounded-xl p-2 group cursor-pointer border border-transparent hover:border-gray-100 hover:bg-white transition-all duration-300 flex flex-col snap-start"
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
          {(() => {
            const projectsList = Array.isArray(profile?.projects) && profile.projects.length > 0 ? profile.projects : [
              { name: 'The Last Kingdom', type: 'Feature Film', year: '2023', thumbnail: '' },
              { name: 'Cyber City 2099', type: 'Sci-Fi Series', year: '2022', thumbnail: '' },
              { name: 'Hanuman Chronicles', type: 'Feature Film', year: '2022', thumbnail: '' },
              { name: 'Elysium', type: 'Short Film', year: '2021', thumbnail: '' },
              { name: 'Visual Tech', type: 'Short Film', year: '2024', thumbnail: '' },
              { name: 'BTS - Production', type: 'Short Film', year: '2024', thumbnail: '' },
            ];
            const totalProjectPages = Math.ceil(projectsList.length / 2);
            if (totalProjectPages <= 1) return null;
            return (
              <div className="flex justify-center gap-1.5 mt-3">
                {Array.from({ length: totalProjectPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToProjectPage(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      activeProjectPage === idx ? 'bg-[#4F46E5] w-3.5' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    aria-label={`Go to project slide page ${idx + 1}`}
                  />
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* 4. BOTTOM GRID: Why Us, Clients, Roles, Contact */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
        {/* Column 1: Why Work With Us */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 transition-all duration-500">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-2 mb-3">
            <Star className="text-[#4F46E5] w-4.5 h-4.5" />
            <h3 className="text-lg font-black tracking-tight text-gray-900">Why Work With Us</h3>
          </div>
          <div className="space-y-3">
            {getWhyWorkWithUsPoints().slice(0, 6).map((item, i) => (
              <div key={i} className="flex gap-3 items-start group">
                <div className="w-6 h-6 bg-[#EEF2FF] rounded-lg flex items-center justify-center text-[#4F46E5] shrink-0 mt-0.5 group-hover:bg-[#4F46E5] group-hover:text-white transition-all">
                  {getWhyWorkIcon(item.title)}
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-black text-gray-800 leading-tight group-hover:text-[#4F46E5] transition-colors">{item.title}</div>
                  {item.subtitle && (
                    <div className="text-[9px] text-gray-400 font-medium mt-0.5 leading-normal">
                      {item.subtitle}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Our Clients */}
        <div className="bg-white rounded-2xl p-4 flex flex-col border border-gray-100 transition-all duration-500">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Users className="text-[#4F46E5] w-4.5 h-4.5" />
              <h3 className="text-lg font-black tracking-tight text-gray-900">Our Clients</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => scrollClients('left')}
                className="w-7 h-7 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center hover:bg-white transition-all transform hover:scale-110 active:scale-90"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                onClick={() => scrollClients('right')}
                className="w-7 h-7 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center hover:bg-white transition-all transform hover:scale-110 active:scale-90"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div 
            ref={clientsRef}
            onScroll={handleClientsScroll}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth flex-1 items-center mt-4 snap-x snap-mandatory py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {(Array.isArray(profile.clients) && profile.clients.length > 0 ? profile.clients : [1,2,3,4,5,6,7,8,9]).map((c: any, i: number) => (
              <div key={i} className="h-16 min-w-[30%] flex-shrink-0 flex items-center justify-center transition-all duration-500 transform hover:scale-125 opacity-80 hover:opacity-100 cursor-pointer snap-start">
                {typeof c === 'string' ? (
                  <img src={getFileUrl(c)} className="max-h-full max-w-full object-contain" alt="Client" />
                ) : (
                  <div className="w-12 h-12 bg-gray-50 rounded-xl animate-pulse flex items-center justify-center">
                     <Star size={18} className="text-gray-200" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {(() => {
            const clientsList = Array.isArray(profile?.clients) && profile.clients.length > 0 ? profile.clients : [1,2,3,4,5,6,7,8,9];
            const totalClientPages = Math.ceil(clientsList.length / 3);
            if (totalClientPages <= 1) return null;
            return (
              <div className="flex justify-center gap-1.5 mt-3">
                {Array.from({ length: totalClientPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToClientPage(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      activeClientPage === idx ? 'bg-[#4F46E5] w-3.5' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    aria-label={`Go to client slide page ${idx + 1}`}
                  />
                ))}
              </div>
            );
          })()}
        </div>

        {/* Column 3: Open Roles */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 transition-all duration-500">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="text-[#4F46E5] w-4.5 h-4.5" />
              <h3 className="text-lg font-black tracking-tight text-gray-900">Open Roles</h3>
            </div>
            <button 
              onClick={() => navigate('/hire', { state: { activeTab: 'open_roles' } })}
              className="text-[9px] font-black text-[#4F46E5] uppercase tracking-[0.2em] hover:underline flex items-center gap-1 transition-all"
            >
              View roles <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {jobPostings.map((job: any, i: number) => (
              <div 
                key={i} 
                onClick={() => navigate('/hire', { state: { activeTab: 'open_roles', selectedJobId: job.id, selectedJobTitle: job.title } })}
                className="p-2 bg-gray-50/50 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-white transition-all duration-500 border border-transparent hover:border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-gray-300 group-hover:text-[#4F46E5] group-hover:scale-110 transition-all">
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

        {/* Column 4: Contact */}
        <div className="bg-white rounded-2xl p-4 space-y-4 border border-gray-100 transition-all duration-500">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
            <Mail className="text-[#4F46E5] w-4.5 h-4.5" />
            <h3 className="text-lg font-black tracking-tight text-gray-900">Contact</h3>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3 group">
              <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-[#4F46E5] shrink-0 group-hover:bg-[#4F46E5] group-hover:text-white transition-all">
                <Mail size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-0.5">Email</div>
                <div className="text-[13px] font-black text-gray-800 truncate tracking-tight">{profile.email}</div>
              </div>
            </div>
            <div className="flex gap-3 group">
              <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-[#4F46E5] shrink-0 group-hover:bg-[#4F46E5] group-hover:text-white transition-all">
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
                <a key={i} href={s.url || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-[#4F46E5] hover:text-white transition-all transform hover:-translate-y-1">
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. FOOTER CTA */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 mt-4">
        <div className="bg-[#4F46E5] rounded-3xl p-6 md:p-8 text-white flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
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
            className="relative z-10 bg-white text-[#4F46E5] px-8 py-4 rounded-xl font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-xs group"
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
