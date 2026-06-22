import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  MapPin, Mail, Phone, Globe, Play, 
  ChevronLeft, ChevronRight, ArrowRight,
  Linkedin, Instagram, Youtube, Twitter,
  CheckCircle2, Star, Briefcase, Users,
  Layout, ShieldCheck,
  Building2, Clock,
  GraduationCap, BookOpen, BarChart3, Quote,
  Trophy, ExternalLink
} from 'lucide-react';

import { getInstitutePublicProfileByCode } from '../services/instituteProfileService';
import { BASE_URL } from '../utils/urls';

const InstitutePublicProfile = () => {
  const { talentCode } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isShowcasePlaying, setIsShowcasePlaying] = useState(false);
  
  const programsRef = React.useRef<HTMLDivElement>(null);

  const scrollPrograms = (direction: 'left' | 'right') => {
    if (programsRef.current) {
      const scrollAmount = programsRef.current.clientWidth;
      programsRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!talentCode) return;
      try {
        const res = await getInstitutePublicProfileByCode(talentCode);
        const payload = await res.json();
        if (res.ok) {
          setProfile(payload.data);
        } else {
          setError(payload.message || 'Institute profile not found');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [talentCode]);

  const getFileUrl = (path: any) => {
    if (!path || typeof path !== 'string') return '';
    if (path.startsWith('http')) return path;
    return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : url;
    }
    if (url.includes('vimeo.com')) {
      const match = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
      const vimeoId = match ? match[3] : '';
      return vimeoId ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1` : url;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isIncomplete = profile && !profile.name;

  if (error || !profile || isIncomplete) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-white rounded-[24px] shadow-premium flex items-center justify-center mb-6 border border-gray-100">
          <GraduationCap size={32} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">
          {isIncomplete ? 'Profile Not Completed' : (error === 'Institute profile not published' ? 'Profile Not Published Yet' : (error || 'Profile Not Found'))}
        </h1>
        <p className="text-gray-500 font-medium mb-8 max-w-sm">
          {isIncomplete 
            ? "This institute hasn't completed their public profile setup yet. Check back soon!"
            : (error === 'Institute profile not published' 
                ? "This institute hasn't set up their public portfolio yet. Check back later!" 
                : "We couldn't find the institute profile you're looking for.")}
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-brand-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <ArrowRight size={16} className="rotate-180" />
          Go Back
        </button>
      </div>
    );
  }

  const seoTitle = profile ? `${profile.name} - Institute Profile` : "Loading Institute Profile";
  const seoDescription = profile 
    ? `${profile.name} located in ${profile.location} is a verified institute on AUI. Tagline: ${profile.tagline || ''}. Explore their academic excellence, programs, testimonials, and contact details.`
    : "View creative training institutes and design school profiles on AUI.";
  const seoKeywords = profile 
    ? `${profile.name}, institute profile, creative training, design school, animation course, VFX academy, AUI`
    : "creative training, design school, animation course, VFX academy, AUI";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans pb-12 text-left selection:bg-brand-primary/10">
      <SEO 
        title={seoTitle} 
        description={seoDescription} 
        keywords={seoKeywords} 
      />
      {/* 0. TOP NAV */}
      <div className="w-full px-4 sm:px-6 lg:px-12 pt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-brand-primary font-black uppercase tracking-[0.2em] text-[10px] transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      </div>

      {/* 1. HERO SECTION (IMAGE 2 STYLE) */}
      <div className="w-full px-4 sm:px-6 lg:px-12 mt-4">
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative min-h-[450px] flex items-end">
          {/* Banner Background */}
          <div className="absolute inset-0">
             <img 
              src={getFileUrl(profile.bannerImage) || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2000&auto=format&fit=crop'} 
              className="w-full h-full object-cover opacity-40"
              alt="Campus"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-10 w-full p-8 md:p-10 space-y-6">
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
              {/* Logo Box */}
              <div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-3xl p-4 flex items-center justify-center shadow-2xl shrink-0">
                {profile.logo ? (
                  <img src={getFileUrl(profile.logo)} className="max-w-full max-h-full object-contain" alt="Logo" />
                ) : (
                  <GraduationCap size={64} className="text-brand-primary" />
                )}
              </div>

              {/* Info Column */}
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 bg-brand-primary/20 backdrop-blur-md px-3 py-1 rounded-full border border-brand-primary/30">
                  <ShieldCheck size={14} className="text-brand-primary" />
                  <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Verified Institute</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                  {profile.name}
                </h1>
                <p className="text-brand-primary text-xl md:text-2xl font-bold italic opacity-90">{profile.tagline || 'Learn. Create. Build Your Future.'}</p>
                
                <div className="flex flex-wrap gap-6 text-white/70 text-xs font-bold pt-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-brand-primary" />
                    {profile.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-brand-primary" />
                    {profile.website?.replace(/^https?:\/\//, '')}
                  </div>
                </div>
              </div>

              {/* Institute Overview Video Preview */}
              <div className="hidden xl:block w-80 aspect-video bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden relative group cursor-pointer" onClick={() => setIsShowcasePlaying(true)}>
                 <img src={getFileUrl(profile.bannerImage)} className="w-full h-full object-cover opacity-50" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                       <Play size={20} className="fill-white ml-1" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-3">Institute Overview</p>
                    <p className="text-[8px] opacity-60">Watch Video</p>
                 </div>
              </div>
            </div>

            {/* Hero Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 pt-8 border-t border-white/10">
              {[
                { label: 'Est. Year', val: profile.estYear || '2012', icon: Clock },
                { label: 'Students Trained', val: profile.studentsTrained || '8,500+', icon: Users },
                { label: 'Industry Mentors', val: profile.industryMentors || '120+', icon: Star },
                { label: 'Placement Rate', val: profile.placementRate || '92%', icon: BarChart3 },
                { label: 'Partner Studios', val: profile.partnerStudios || '100+', icon: Building2 },
                { label: 'Alumni Working', val: profile.alumniWorking || '2,300+', icon: Trophy },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                   <div className="flex items-center gap-2 text-white/40">
                      <stat.icon size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{stat.label}</span>
                   </div>
                   <div className="text-xl font-black text-white tracking-tighter">{stat.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. PARTNERSHIP BAR & FEATURES */}
      <div className="w-full px-4 sm:px-6 lg:px-12 mt-6 space-y-6">
        {/* AUI Partnership Stats */}
        <div className="bg-brand-primary rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-brand-primary/10">
          <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
             <div className="text-left">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Our Partnership with AUI</p>
                <div className="h-1 w-12 bg-white/20 rounded-full" />
             </div>
             <div className="flex gap-12">
                {[
                  { label: 'Industry Workshops Conducted', val: profile.workshopsConducted || '24', icon: BookOpen },
                  { label: 'Mentorship Sessions Completed', val: profile.mentorshipSessions || '18', icon: Users },
                  { label: 'Portfolio Reviews Conducted', val: profile.portfolioReviews || '12', icon: Briefcase },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                        <p.icon size={18} />
                     </div>
                     <div className="text-left">
                        <p className="text-2xl font-black text-white leading-none">{p.val}</p>
                        <p className="text-[9px] font-bold text-white/50 uppercase tracking-tight mt-1 max-w-[80px]">{p.label}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
          <div className="flex items-center gap-4 border-l border-white/10 pl-8">
             <p className="text-[10px] font-black text-white/60 uppercase tracking-widest max-w-[150px] leading-relaxed">Empowering our students through practical industry exposure and expert guidance.</p>
             <div className="text-center">
                <p className="text-2xl font-black text-white">AUI</p>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Industry Partner</p>
             </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {[
             { label: 'Industry-Oriented Curriculum', icon: GraduationCap, desc: 'Designed with industry experts' },
             { label: 'Expert Mentorship', icon: Users, desc: 'Learn from working professionals' },
             { label: 'Practical Learning', icon: Layout, desc: 'Hands-on projects and live training' },
             { label: 'Placement Support', icon: BarChart3, desc: '100+ hiring partners across India' },
             { label: 'Certified Courses', icon: ShieldCheck, desc: 'Industry-recognized certifications' },
             { label: 'Global Opportunities', icon: Globe, desc: 'Prepare for global careers' },
           ].map((f, i) => (
             <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center space-y-3 group">
                <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary mx-auto group-hover:bg-brand-primary group-hover:text-white transition-all">
                   <f.icon size={24} />
                </div>
                <div className="space-y-1">
                   <p className="text-[11px] font-black text-slate-800 leading-tight">{f.label}</p>
                   <p className="text-[9px] text-slate-400 font-medium leading-tight">{f.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* 3. ABOUT & SHOWCASE */}
      <div className="w-full px-4 sm:px-6 lg:px-12 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
         <div className="lg:col-span-5 space-y-8 pt-4">
            <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">About the Institute</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight">
               Shaping Creative Professionals for Tomorrow
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
               {profile.about || "Framebox Institute of Animation & Design is committed to delivering quality education in animation, VFX, gaming, and design. Our industry-driven programs, modern infrastructure, and placement support help students turn their passion into successful careers."}
            </p>
            <button 
              onClick={() => {
                if (profile.website) {
                  const url = profile.website.startsWith('http') ? profile.website : `https://${profile.website}`;
                  window.open(url, '_blank');
                }
              }}
              className="flex items-center gap-3 bg-brand-primary/5 text-brand-primary px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary hover:text-white transition-all group"
            >
               Know More About Us
               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>

         <div className="lg:col-span-7 h-[360px] bg-slate-900 rounded-3xl overflow-hidden shadow-premium relative border-4 border-white group">
            {!isShowcasePlaying ? (
               <div className="w-full h-full relative cursor-pointer" onClick={() => setIsShowcasePlaying(true)}>
                  <img src={getFileUrl(profile.bannerImage)} className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                     <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all shadow-2xl">
                        <Play size={32} className="fill-white" />
                     </div>
                     <p className="text-sm font-black uppercase tracking-[0.3em] mt-6">Institute Showcase</p>
                     <p className="text-xs opacity-60 mt-1">Watch Video</p>
                  </div>
               </div>
            ) : (
              <div className="relative w-full h-full">
                <iframe 
                  src={getEmbedUrl(profile.showcaseVideoUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4')} 
                  className="w-full h-full border-0" 
                  allow="autoplay; fullscreen" 
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                {(profile.showcaseVideoUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4') && ((profile.showcaseVideoUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4').includes('youtube.com') || (profile.showcaseVideoUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4').includes('youtu.be') || (profile.showcaseVideoUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4').includes('vimeo.com')) && (
                  <>
                    <a
                      href={profile.showcaseVideoUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-md z-20"
                    >
                      <ExternalLink size={12} className="text-white" />
                      Watch on {(profile.showcaseVideoUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4').includes('vimeo.com') ? 'Vimeo' : 'YouTube'}
                    </a>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] md:text-[11px] font-medium flex items-center gap-2 shadow-2xl z-20 whitespace-nowrap border border-white/10">
                      <span className="opacity-90">Having trouble playing?</span>
                      <a
                        href={profile.showcaseVideoUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#818CF8] hover:text-[#A5B4FC] hover:underline font-black flex items-center gap-1 transition-colors"
                      >
                        Watch directly on {(profile.showcaseVideoUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4').includes('vimeo.com') ? 'Vimeo' : 'YouTube'} <ExternalLink size={11} className="inline" />
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}
         </div>
      </div>

      {/* 4. OUR PROGRAMS (DYNAMIC SLIDER) */}
      <div className="w-full px-4 sm:px-6 lg:px-12 mt-12 space-y-6">
         <div className="flex justify-between items-end">
            <div className="space-y-2">
               <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Our Programs</p>
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Academic Excellence</h3>
            </div>
            <div className="flex gap-4">
               <button onClick={() => scrollPrograms('left')} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md hover:bg-brand-primary hover:text-white transition-all">
                  <ChevronLeft size={20} />
               </button>
               <button onClick={() => scrollPrograms('right')} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md hover:bg-brand-primary hover:text-white transition-all">
                  <ChevronRight size={20} />
               </button>
            </div>
         </div>

         <div 
            ref={programsRef}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-8"
         >
            {(Array.isArray(profile.programs) && profile.programs.length > 0 ? profile.programs : [
               { name: 'B.Sc. in Animation & VFX', duration: '3 Years', type: 'Full Time' },
               { name: 'Diploma in 3D Animation', duration: '18 Months', type: 'Full Time' },
               { name: 'Diploma in VFX', duration: '18 Months', type: 'Full Time' },
               { name: 'Game Design & Development', duration: '12 Months', type: 'Full Time' },
               { name: 'Interior Design & Visualization', duration: '12 Months', type: 'Full Time' },
            ]).map((prog: any, i: number) => (
               <div key={i} className="w-[340px] flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group cursor-pointer">
                  <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                     {prog.thumbnail ? (
                        <img src={getFileUrl(prog.thumbnail)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                           <BookOpen size={48} />
                        </div>
                     )}
                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-brand-primary">
                        {prog.type}
                     </div>
                  </div>
                  <div className="p-6 space-y-4">
                     <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-brand-primary transition-colors">{prog.name}</h4>
                     <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                        <div className="flex items-center gap-2 text-slate-400">
                           <Clock size={14} />
                           <span className="text-[11px] font-bold">{prog.duration}</span>
                        </div>
                        <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                           <ArrowRight size={14} />
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* 5. WHY CHOOSE & PARTNERS & TESTIMONIALS */}
      <div className="w-full px-4 sm:px-6 lg:px-12 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-4">
         {/* Why Choose */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4 flex flex-col min-h-[350px]">
             <h3 className="text-base font-black text-slate-900 uppercase tracking-tighter">Why Choose {profile.name?.split(' ')[0]}?</h3>
             <div className="space-y-3">
                {(Array.isArray(profile.whyChooseUs) && profile.whyChooseUs.length > 0 ? profile.whyChooseUs : [
                   'Industry-relevant curriculum and practical training',
                   'Learning from experienced industry professionals',
                   'Regular workshops, masterclasses & industry visits',
                   'Strong placement assistance and alumni network',
                   'Focus on creativity, innovation & career growth'
                ]).map((p: string, i: number) => (
                   <div key={i} className="flex gap-3 items-center group">
                      <div className="w-5 h-5 bg-brand-primary/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-primary transition-all">
                         <CheckCircle2 size={12} className="text-brand-primary group-hover:text-white" />
                      </div>
                      <p className="text-[12px] font-bold text-slate-600 leading-snug">{p}</p>
                   </div>
                ))}
             </div>
             {/* Abstract Graphic */}
             <div className="opacity-5 flex justify-center mt-auto pb-2">
                <GraduationCap size={100} />
             </div>
          </div>

         {/* Industry Partners */}
         <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4 flex flex-col min-h-[350px]">
            <div className="flex justify-between items-center">
               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Our Industry Partners</h3>
               <button className="text-[9px] font-black text-brand-primary uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
               {(Array.isArray(profile.industryPartners) && profile.industryPartners.length > 0 ? profile.industryPartners : [1,2,3,4,5,6]).map((p: any, i: number) => (
                  <div key={i} className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center p-3 hover:scale-110 transition-transform cursor-pointer">
                     {typeof p === 'string' ? (
                        <img src={getFileUrl(p)} className="max-h-full max-w-full object-contain transition-all" />
                     ) : (
                        <Star size={20} className="text-slate-200" />
                     )}
                  </div>
               ))}
            </div>
         </div>

         {/* Student Testimonials */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4 flex flex-col min-h-[350px]">
            <div className="flex justify-between items-center">
               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Student Testimonials</h3>
               <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
               </div>
            </div>

            {(Array.isArray(profile.testimonials) && profile.testimonials.length > 0 ? profile.testimonials : [
               { name: 'Ananya Sharma', role: 'VFX Artist, MPC', text: 'Framebox gave me the skills, confidence, and exposure I needed. The mentors and hands-on learning made all the difference.' }
            ]).slice(0, 1).map((t: any, i: number) => (
               <div key={i} className="space-y-6 flex-1 flex flex-col justify-center text-center">
                  <div className="relative inline-block mx-auto">
                     <div className="w-20 h-20 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        {t.photo ? <img src={getFileUrl(t.photo)} className="w-full h-full object-cover" /> : <Users size={40} className="mt-4 text-slate-400 mx-auto" />}
                     </div>
                     <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white p-2 rounded-full shadow-lg">
                        <Quote size={12} fill="white" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <p className="text-sm font-bold text-slate-500 leading-relaxed italic">"{t.text}"</p>
                     <div>
                        <p className="text-base font-black text-slate-900 leading-none">-{t.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.role}</p>
                     </div>
                  </div>
               </div>
            ))}
            
            <div className="flex gap-3 justify-center pt-4">
               <button className="w-10 h-10 border border-slate-100 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                  <ChevronLeft size={16} />
               </button>
               <button className="w-10 h-10 border border-slate-100 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                  <ChevronRight size={16} />
               </button>
            </div>
         </div>
      </div>

      {/* 6. CONTACT SECTION (FOOTER STYLE) */}
      <div className="w-full px-4 sm:px-6 lg:px-12 mt-12 pb-12">
         <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
               <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Contact Us</p>
               <div className="space-y-6 pt-4">
                  <div className="flex gap-4 group">
                     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all shadow-sm">
                        <Mail size={20} />
                     </div>
                     <div className="text-left">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Email</p>
                        <p className="text-sm font-black text-slate-800">{profile.email || 'info@framebox.in'}</p>
                     </div>
                  </div>
                  <div className="flex gap-4 group">
                     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all shadow-sm">
                        <Phone size={20} />
                     </div>
                     <div className="text-left">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Phone</p>
                        <p className="text-sm font-black text-slate-800">{profile.phone || '+91 98765 43210'}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Address</p>
               <div className="flex gap-4 group pt-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all shadow-sm shrink-0">
                     <MapPin size={20} />
                  </div>
                  <div className="text-left">
                     <p className="text-[13px] font-bold text-slate-600 leading-relaxed">{profile.address || '601, Creative Hub, Andheri (W), Mumbai, Maharashtra 400053'}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Follow Us</p>
               <div className="flex gap-4 pt-4">
                  {[
                    { icon: Linkedin, url: profile.socialLinks?.linkedin },
                    { icon: Instagram, url: profile.socialLinks?.instagram },
                    { icon: Youtube, url: profile.socialLinks?.youtube },
                    { icon: Twitter, url: profile.socialLinks?.twitter },
                  ].map((s, i) => (
                    <a key={i} href={s.url || '#'} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white hover:scale-110 transition-all shadow-sm">
                      <s.icon size={20} />
                    </a>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Office Hours</p>
               <div className="flex gap-4 group pt-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all shadow-sm shrink-0">
                     <Clock size={20} />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-black text-slate-800">{profile.officeHours || 'Mon - Sat : 10:00 AM - 7:00 PM'}</p>
                     <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Sunday Closed</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default InstitutePublicProfile;
