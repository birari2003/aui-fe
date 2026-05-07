import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, CheckCircle2, AlertCircle, Save, 
  Building2, Image as ImageIcon, MapPin, Mail, Phone, Globe,
  BarChart3, Plus, Trash2, Video, Users, Briefcase, Trophy,
  Linkedin, Instagram, Youtube, Twitter, GraduationCap, School,
  Star, Quote, Clock
} from 'lucide-react';
import { getMyInstitutePublicProfile, upsertInstitutePublicProfile } from '../services/instituteProfileService';
import { BASE_URL } from '../utils/urls';

interface Program {
  name: string;
  duration: string;
  type: string;
  thumbnail: string;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  photo: string;
}

interface InstituteProfileData {
  name: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  about: string;
  estYear: number;
  studentsTrained: string;
  industryMentors: string;
  placementRate: string;
  partnerStudios: string;
  alumniWorking: string;
  workshopsConducted: number;
  mentorshipSessions: number;
  portfolioReviews: number;
  features: string[]; // Simplification for MVP
  showcaseVideoUrl: string;
  programs: Program[];
  whyChooseUs: string[];
  industryPartners: string[];
  testimonials: Testimonial[];
  address: string;
  officeHours: string;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  logo: string;
  bannerImage: string;
}

const INITIAL_DATA: InstituteProfileData = {
  name: '',
  tagline: '',
  location: '',
  email: '',
  phone: '',
  website: '',
  about: '',
  estYear: 2024,
  studentsTrained: '',
  industryMentors: '',
  placementRate: '',
  partnerStudios: '',
  alumniWorking: '',
  workshopsConducted: 0,
  mentorshipSessions: 0,
  portfolioReviews: 0,
  features: [],
  showcaseVideoUrl: '',
  programs: [],
  whyChooseUs: [],
  industryPartners: [],
  testimonials: [],
  address: '',
  officeHours: '',
  socialLinks: {},
  logo: '',
  bannerImage: ''
};

const ManageInstituteProfileModal = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('identity');
  const [formData, setFormData] = useState<InstituteProfileData>(INITIAL_DATA);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Files state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [programThumbnailFiles, setProgramThumbnailFiles] = useState<Record<number, File>>({});
  const [partnerLogoFiles, setPartnerLogoFiles] = useState<Record<number, File>>({});
  const [testimonialPhotoFiles, setTestimonialPhotoFiles] = useState<Record<number, File>>({});

  const tabs = ['identity', 'stats', 'academic', 'showcase', 'contact'];
  const currentStepIndex = tabs.indexOf(activeTab);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await getMyInstitutePublicProfile(token);
        if (res.ok) {
          const payload = await res.json();
          if (payload.data) {
            setFormData(payload.data);
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchProfile();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNext = () => {
    if (currentStepIndex < tabs.length - 1) {
      setActiveTab(tabs[currentStepIndex + 1]);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setActiveTab(tabs[currentStepIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setSaving(true);

    try {
      const data = new FormData();
      
      // Basic text fields
      Object.keys(formData).forEach(key => {
        const value = (formData as any)[key];
        if (typeof value !== 'object') {
          data.append(key, value);
        }
      });

      // Handle JSON fields
      data.append('socialLinks', JSON.stringify(formData.socialLinks));
      data.append('whyChooseUs', JSON.stringify(formData.whyChooseUs));
      data.append('features', JSON.stringify(formData.features));

      // Handle Programs
      const updatedPrograms = formData.programs.map((p, idx) => {
        const file = programThumbnailFiles[idx];
        if (file) return { ...p, thumbnail: `PENDING_UPLOAD:${file.name}` };
        return p;
      });
      data.append('programs', JSON.stringify(updatedPrograms));

      // Handle Testimonials
      const updatedTestimonials = formData.testimonials.map((t, idx) => {
        const file = testimonialPhotoFiles[idx];
        if (file) return { ...t, photo: `PENDING_UPLOAD:${file.name}` };
        return t;
      });
      data.append('testimonials', JSON.stringify(updatedTestimonials));

      // Handle Industry Partners
      const updatedPartners = formData.industryPartners.map((p, idx) => {
        const file = partnerLogoFiles[idx];
        if (file) return `PENDING_UPLOAD:${file.name}`;
        return p;
      });
      data.append('industryPartners', JSON.stringify(updatedPartners));

      // Append files
      if (logoFile) data.append('logoFile', logoFile);
      if (bannerFile) data.append('bannerImageFile', bannerFile);
      
      Object.values(programThumbnailFiles).forEach(file => data.append('programThumbnails', file));
      Object.values(partnerLogoFiles).forEach(file => data.append('partnerLogos', file));
      Object.values(testimonialPhotoFiles).forEach(file => data.append('testimonialPhotos', file));

      const res = await upsertInstitutePublicProfile(token, data);
      if (res.ok) {
        showToast('Institute profile updated successfully!');
        const payload = await res.json();
        setFormData(payload.data);
        // Clear file states
        setLogoFile(null);
        setBannerFile(null);
        setProgramThumbnailFiles({});
        setPartnerLogoFiles({});
        setTestimonialPhotoFiles({});
      } else {
        const errBody = await res.json();
        showToast(errBody.message || 'Update failed', 'error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getFilePreview = (file: File | null, existing: any) => {
    if (file) return URL.createObjectURL(file);
    if (existing && typeof existing === 'string') {
      if (existing.startsWith('http')) return existing;
      return `${BASE_URL}/${existing.replace(/\\/g, '/')}`;
    }
    return 'https://via.placeholder.com/400x200?text=Upload+Image';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-primary/20 backdrop-blur-sm">
      {toast && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[110] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? 'bg-brand-primary' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-white" />}
          <span className="text-sm font-bold">{toast.msg}</span>
        </div>
      )}

      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-brand-accent/10">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-brand-surface/30">
          <div className="text-left">
            <h2 className="text-3xl font-display font-bold text-brand-primary flex items-center gap-3">
              <GraduationCap className="text-brand-accent" /> Manage Institute Portfolio
            </h2>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">
              Step {currentStepIndex + 1} of 5: {activeTab.toUpperCase()}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-text-muted hover:text-brand-primary">
            <X size={24} />
          </button>
        </div>

        {/* Tabs Indicators */}
        <div className="flex px-8 bg-brand-surface/10 border-b border-gray-100">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted hover:text-brand-primary'
              }`}
            >
              <span className="mr-2 opacity-50">{idx + 1}.</span> {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {activeTab === 'identity' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand-primary">
                    <School size={20} />
                    <label className="text-sm font-bold uppercase tracking-widest">Institute Logo</label>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-brand-accent/20 shrink-0">
                      <img src={getFilePreview(logoFile, formData.logo)} className="w-full h-full object-cover" alt="Logo" />
                    </div>
                    <div className="flex-1 space-y-2 text-left">
                      <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                      <label htmlFor="logo-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-brand-primary/90">
                        <Plus size={14} /> Upload Logo
                      </label>
                      <p className="text-[10px] text-text-muted">Recommended: Square, Transparent PNG</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand-primary">
                    <ImageIcon size={20} />
                    <label className="text-sm font-bold uppercase tracking-widest">Banner Image</label>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-40 h-24 rounded-2xl overflow-hidden border-2 border-brand-accent/20 shrink-0">
                      <img src={getFilePreview(bannerFile, formData.bannerImage)} className="w-full h-full object-cover" alt="Banner" />
                    </div>
                    <div className="flex-1 space-y-2 text-left">
                      <input type="file" id="banner-upload" className="hidden" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
                      <label htmlFor="banner-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-brand-primary/90">
                        <Plus size={14} /> Upload Banner
                      </label>
                      <p className="text-[10px] text-text-muted">High-res campus or studio shot</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Institute Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Framebox Institute"
                    className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                    placeholder="e.g. Learn. Create. Build Your Future."
                    className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">About Institute</label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({...formData, about: e.target.value})}
                  placeholder="Tell your story..."
                  className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. Mumbai, Maharashtra, India"
                      className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="e.g. www.institute.com"
                      className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
                {[
                  { label: 'Est. Year', key: 'estYear', icon: Clock, type: 'number' },
                  { label: 'Students Trained', key: 'studentsTrained', icon: Users, type: 'text' },
                  { label: 'Industry Mentors', key: 'industryMentors', icon: Star, type: 'text' },
                  { label: 'Placement Rate', key: 'placementRate', icon: BarChart3, type: 'text' },
                  { label: 'Partner Studios', key: 'partnerStudios', icon: Building2, type: 'text' },
                  { label: 'Alumni Working', key: 'alumniWorking', icon: Trophy, type: 'text' },
                ].map(stat => (
                  <div key={stat.key} className="p-4 bg-brand-surface/50 rounded-2xl border border-brand-accent/10 space-y-2">
                    <div className="flex items-center gap-2 text-brand-accent">
                      <stat.icon size={16} />
                      <label className="text-[8px] font-bold uppercase tracking-widest text-text-muted">{stat.label}</label>
                    </div>
                    <input
                      type={stat.type}
                      value={(formData as any)[stat.key]}
                      onChange={(e) => setFormData({...formData, [stat.key]: stat.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value})}
                      className="w-full bg-transparent font-bold text-xl outline-none"
                      placeholder="e.g. 8,500+"
                    />
                  </div>
                ))}
              </div>

              <div className="p-6 bg-brand-primary/5 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-brand-primary uppercase tracking-[0.2em] text-left">Partnership Performance (With AUI)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Workshops Conducted', key: 'workshopsConducted' },
                    { label: 'Mentorship Sessions', key: 'mentorshipSessions' },
                    { label: 'Portfolio Reviews', key: 'portfolioReviews' },
                  ].map(p => (
                    <div key={p.key} className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-text-muted">{p.label}</label>
                      <input
                        type="number"
                        value={(formData as any)[p.key]}
                        onChange={(e) => setFormData({...formData, [p.key]: parseInt(e.target.value) || 0})}
                        className="w-full bg-white border border-brand-accent/10 rounded-xl px-4 py-2 font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted text-left">Academic Features (Core Strengths)</label>
                  <button 
                    onClick={() => setFormData({...formData, features: [...formData.features, '']})}
                    className="text-xs font-bold text-brand-primary hover:underline"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const newList = [...formData.features];
                          newList[idx] = e.target.value;
                          setFormData({...formData, features: newList});
                        }}
                        className="flex-1 bg-brand-surface/50 border border-brand-accent/10 rounded-xl px-4 py-3 text-sm outline-none text-left"
                        placeholder="e.g. Expert Mentorship"
                      />
                      <button onClick={() => {
                        const newList = formData.features.filter((_, i) => i !== idx);
                        setFormData({...formData, features: newList});
                      }} className="p-3 text-red-500 hover:bg-red-50 rounded-xl">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-brand-primary text-left">Our Programs</h3>
                  <button 
                    onClick={() => setFormData({
                      ...formData, 
                      programs: [...formData.programs, { name: '', duration: '', type: '', thumbnail: '' }]
                    })}
                    className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold"
                  >
                    + Add Program
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.programs.map((program, idx) => (
                    <div key={idx} className="p-6 bg-brand-surface/30 rounded-3xl border border-brand-accent/10 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <img 
                            src={getFilePreview(programThumbnailFiles[idx] || null, program.thumbnail)} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 space-y-2 text-left">
                          <input type="file" id={`prog-thumb-${idx}`} className="hidden" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setProgramThumbnailFiles({...programThumbnailFiles, [idx]: file});
                          }} />
                          <label htmlFor={`prog-thumb-${idx}`} className="text-[10px] font-bold text-brand-primary hover:underline cursor-pointer">
                            Upload Thumbnail
                          </label>
                        </div>
                        <button onClick={() => {
                          const newList = formData.programs.filter((_, i) => i !== idx);
                          setFormData({...formData, programs: newList});
                        }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="space-y-2 text-left">
                        <input
                          type="text"
                          value={program.name}
                          onChange={(e) => {
                            const newList = [...formData.programs];
                            newList[idx].name = e.target.value;
                            setFormData({...formData, programs: newList});
                          }}
                          placeholder="Program Name (e.g. B.Sc. in VFX)"
                          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={program.duration}
                            onChange={(e) => {
                              const newList = [...formData.programs];
                              newList[idx].duration = e.target.value;
                              setFormData({...formData, programs: newList});
                            }}
                            placeholder="Duration (e.g. 3 Years)"
                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none"
                          />
                          <input
                            type="text"
                            value={program.type}
                            onChange={(e) => {
                              const newList = [...formData.programs];
                              newList[idx].type = e.target.value;
                              setFormData({...formData, programs: newList});
                            }}
                            placeholder="Type (e.g. Full Time)"
                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'showcase' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Showcase Video URL</label>
                <div className="relative">
                  <Video className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                  <input
                    type="text"
                    value={formData.showcaseVideoUrl}
                    onChange={(e) => setFormData({...formData, showcaseVideoUrl: e.target.value})}
                    placeholder="YouTube URL..."
                    className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-brand-primary text-left">Industry Partners</h3>
                  <button 
                    onClick={() => setFormData({...formData, industryPartners: [...formData.industryPartners, '']})}
                    className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold"
                  >
                    + Add Partner
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {formData.industryPartners.map((partner, idx) => (
                    <div key={idx} className="relative group">
                      <div className="aspect-video bg-white rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center p-2">
                        <img src={getFilePreview(partnerLogoFiles[idx] || null, partner)} className="max-h-full max-w-full object-contain" />
                      </div>
                      <input type="file" id={`partner-logo-${idx}`} className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setPartnerLogoFiles({...partnerLogoFiles, [idx]: file});
                      }} />
                      <label htmlFor={`partner-logo-${idx}`} className="absolute inset-0 bg-black/60 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity rounded-xl">
                        Upload
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-brand-primary text-left">Student Testimonials</h3>
                  <button 
                    onClick={() => setFormData({
                      ...formData, 
                      testimonials: [...formData.testimonials, { name: '', role: '', text: '', photo: '' }]
                    })}
                    className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold"
                  >
                    + Add Testimonial
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.testimonials.map((t, idx) => (
                    <div key={idx} className="p-6 bg-brand-surface/30 rounded-3xl border border-brand-accent/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      <div className="md:col-span-3 space-y-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden mx-auto border-2 border-white shadow-lg">
                          <img src={getFilePreview(testimonialPhotoFiles[idx] || null, t.photo)} className="w-full h-full object-cover" />
                        </div>
                        <input type="file" id={`t-photo-${idx}`} className="hidden" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setTestimonialPhotoFiles({...testimonialPhotoFiles, [idx]: file});
                        }} />
                        <label htmlFor={`t-photo-${idx}`} className="block text-[10px] font-bold text-brand-primary cursor-pointer hover:underline text-center">
                          Change Photo
                        </label>
                      </div>
                      <div className="md:col-span-8 space-y-3 text-left">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => {
                              const newList = [...formData.testimonials];
                              newList[idx].name = e.target.value;
                              setFormData({...formData, testimonials: newList});
                            }}
                            placeholder="Student Name"
                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none"
                          />
                          <input
                            type="text"
                            value={t.role}
                            onChange={(e) => {
                              const newList = [...formData.testimonials];
                              newList[idx].role = e.target.value;
                              setFormData({...formData, testimonials: newList});
                            }}
                            placeholder="Current Role/Company"
                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none"
                          />
                        </div>
                        <textarea
                          value={t.text}
                          onChange={(e) => {
                            const newList = [...formData.testimonials];
                            newList[idx].text = e.target.value;
                            setFormData({...formData, testimonials: newList});
                          }}
                          placeholder="The student's feedback..."
                          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none min-h-[80px]"
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <button onClick={() => {
                          const newList = formData.testimonials.filter((_, i) => i !== idx);
                          setFormData({...formData, testimonials: newList});
                        }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="admissions@institute.com"
                      className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                      className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Full Address</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-6 text-brand-accent" size={18} />
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Building, Street, Landmark, City..."
                    className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-primary min-h-[100px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Office Hours</label>
                  <div className="relative">
                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                    <input
                      type="text"
                      value={formData.officeHours}
                      onChange={(e) => setFormData({...formData, officeHours: e.target.value})}
                      placeholder="e.g. Mon - Sat: 10:00 AM - 7:00 PM"
                      className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Social Media Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: '#0077B5' },
                    { key: 'instagram', icon: Instagram, label: 'Instagram', color: '#E4405F' },
                    { key: 'youtube', icon: Youtube, label: 'YouTube', color: '#FF0000' },
                    { key: 'twitter', icon: Twitter, label: 'Twitter/X', color: '#1DA1F2' },
                  ].map(social => (
                    <div key={social.key} className="relative">
                      <social.icon className="absolute left-6 top-1/2 -translate-y-1/2" style={{ color: social.color }} size={18} />
                      <input
                        type="text"
                        value={(formData.socialLinks as any)[social.key] || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          socialLinks: { ...formData.socialLinks, [social.key]: e.target.value }
                        })}
                        placeholder={`${social.label} Link`}
                        className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-brand-surface/30 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className={`text-sm font-bold uppercase tracking-widest ${currentStepIndex === 0 ? 'text-gray-300' : 'text-text-muted hover:text-brand-primary'}`}
          >
            Previous
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-8 py-4 text-sm font-bold uppercase tracking-widest text-text-muted hover:text-brand-primary"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              disabled={saving}
              className="px-10 py-4 bg-brand-primary text-white rounded-2xl text-sm font-bold uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {saving ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {currentStepIndex === tabs.length - 1 ? <Save size={18} /> : <Sparkles size={18} />}
                  {currentStepIndex === tabs.length - 1 ? 'Publish Portfolio' : 'Next Step'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageInstituteProfileModal;
