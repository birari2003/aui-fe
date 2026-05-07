import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, CheckCircle2, AlertCircle, Save, 
  Building2, Image as ImageIcon, MapPin, Mail, Phone, Globe,
  BarChart3, Plus, Trash2, Video, Users, Briefcase, Trophy,
  Linkedin, Instagram, Youtube, Twitter
} from 'lucide-react';
import { getMyStudioPublicProfile, upsertStudioPublicProfile } from '../services/studioProfileService';
import { BASE_URL } from '../utils/urls';

interface Project {
  name: string;
  type: string;
  year: string;
  thumbnail: string;
}

interface ExtraVideo {
  title: string;
  duration: string;
  url: string;
}

interface StudioProfileData {
  name: string;
  specialty: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  about: string;
  projectsCompleted: number;
  artistsHired: number;
  yearsActive: number;
  awardsWon: number;
  whatWeDo: string[];
  whyWorkWithUs: string[];
  studioReelUrl: string;
  extraVideos: ExtraVideo[];
  projects: Project[];
  clients: string[];
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  logo: string;
  bannerImage: string;
}

const INITIAL_DATA: StudioProfileData = {
  name: '',
  specialty: '',
  location: '',
  email: '',
  phone: '',
  website: '',
  about: '',
  projectsCompleted: 0,
  artistsHired: 0,
  yearsActive: 0,
  awardsWon: 0,
  whatWeDo: [],
  whyWorkWithUs: [],
  studioReelUrl: '',
  extraVideos: [],
  projects: [],
  clients: [],
  socialLinks: {},
  logo: '',
  bannerImage: ''
};

const ManageStudioProfileModal = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('identity');
  const [formData, setFormData] = useState<StudioProfileData>(INITIAL_DATA);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Files state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [projectThumbnailFiles, setProjectThumbnailFiles] = useState<Record<number, File>>({});
  const [clientLogoFiles, setClientLogoFiles] = useState<Record<number, File>>({});

  const tabs = ['identity', 'insights', 'showcase', 'socials'];
  const currentStepIndex = tabs.indexOf(activeTab);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await getMyStudioPublicProfile(token);
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
        if (typeof value === 'object') {
          // Handled separately or stringified
        } else {
          data.append(key, value);
        }
      });

      // Handle JSON fields
      data.append('whatWeDo', JSON.stringify(formData.whatWeDo));
      data.append('whyWorkWithUs', JSON.stringify(formData.whyWorkWithUs));
      data.append('extraVideos', JSON.stringify(formData.extraVideos));
      data.append('socialLinks', JSON.stringify(formData.socialLinks));

      // Handle Projects with thumbnails
      const updatedProjects = formData.projects.map((p, idx) => {
        const file = projectThumbnailFiles[idx];
        if (file) {
          return { ...p, thumbnail: `PENDING_UPLOAD:${file.name}` };
        }
        return p;
      });
      data.append('projects', JSON.stringify(updatedProjects));

      // Handle Clients with logos
      const updatedClients = formData.clients.map((c, idx) => {
        const file = clientLogoFiles[idx];
        if (file) {
          return `PENDING_UPLOAD:${file.name}`;
        }
        return c;
      });
      data.append('clients', JSON.stringify(updatedClients));

      // Append files
      if (logoFile) data.append('logoFile', logoFile);
      if (bannerFile) data.append('bannerImageFile', bannerFile);
      
      Object.values(projectThumbnailFiles).forEach(file => {
        data.append('projectThumbnails', file);
      });
      
      Object.values(clientLogoFiles).forEach(file => {
        data.append('clientLogos', file);
      });

      const res = await upsertStudioPublicProfile(token, data);
      if (res.ok) {
        showToast('Profile updated successfully!');
        const payload = await res.json();
        setFormData(payload.data);
        // Clear file states
        setLogoFile(null);
        setBannerFile(null);
        setProjectThumbnailFiles({});
        setClientLogoFiles({});
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

  const getFilePreview = (file: File | null, existing: string) => {
    if (file) return URL.createObjectURL(file);
    if (existing) {
      if (existing.startsWith('http')) return existing;
      return `${BASE_URL}/${existing}`;
    }
    return '/assets/placeholder-image.png'; // Make sure this exists or use a generic path
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
          <div>
            <h2 className="text-3xl font-display font-bold text-brand-primary flex items-center gap-3 text-left">
              <Sparkles className="text-brand-accent" /> Manage Studio Profile
            </h2>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1 text-left">
              Step {currentStepIndex + 1} of 4: {activeTab.toUpperCase()}
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
                    <Building2 size={20} />
                    <label className="text-sm font-bold uppercase tracking-widest text-left">Studio Logo</label>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-brand-accent/20 shrink-0">
                      <img src={getFilePreview(logoFile, formData.logo)} className="w-full h-full object-cover" alt="Logo" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                      <label htmlFor="logo-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-brand-primary/90">
                        <Plus size={14} /> Upload Logo
                      </label>
                      <p className="text-[10px] text-text-muted text-left">Recommended: Square, PNG/JPG</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand-primary">
                    <ImageIcon size={20} />
                    <label className="text-sm font-bold uppercase tracking-widest text-left">Banner Image</label>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-40 h-24 rounded-2xl overflow-hidden border-2 border-brand-accent/20 shrink-0">
                      <img src={getFilePreview(bannerFile, formData.bannerImage)} className="w-full h-full object-cover" alt="Banner" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input type="file" id="banner-upload" className="hidden" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
                      <label htmlFor="banner-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-brand-primary/90">
                        <Plus size={14} /> Upload Banner
                      </label>
                      <p className="text-[10px] text-text-muted text-left">Recommended: 1200x400</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Studio Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Roll A Rock Studios"
                    className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors text-left"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Specialty</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    placeholder="e.g. Premium Animation & VFX Studio"
                    className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors text-left"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">About Studio</label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({...formData, about: e.target.value})}
                  placeholder="Describe your studio's mission and history..."
                  className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors min-h-[120px] text-left"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. Mumbai, India"
                      className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-primary transition-colors text-left"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="e.g. www.studio.com"
                      className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-primary transition-colors text-left"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Projects Completed', key: 'projectsCompleted', icon: CheckCircle2 },
                  { label: 'Artists Hired', key: 'artistsHired', icon: Users },
                  { label: 'Years Active', key: 'yearsActive', icon: Briefcase },
                  { label: 'Awards Won', key: 'awardsWon', icon: Trophy },
                ].map(stat => (
                  <div key={stat.key} className="p-4 bg-brand-surface/50 rounded-2xl border border-brand-accent/10 text-center space-y-2">
                    <stat.icon className="mx-auto text-brand-accent" size={20} />
                    <label className="text-[8px] font-bold uppercase tracking-widest text-text-muted">{stat.label}</label>
                    <input
                      type="number"
                      value={(formData as any)[stat.key]}
                      onChange={(e) => setFormData({...formData, [stat.key]: parseInt(e.target.value) || 0})}
                      className="w-full bg-transparent text-center font-bold text-xl outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted text-left">What We Do (Services)</label>
                  <button 
                    onClick={() => setFormData({...formData, whatWeDo: [...formData.whatWeDo, '']})}
                    className="text-xs font-bold text-brand-primary hover:underline"
                  >
                    + Add Service
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.whatWeDo.map((service, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={service}
                        onChange={(e) => {
                          const newList = [...formData.whatWeDo];
                          newList[idx] = e.target.value;
                          setFormData({...formData, whatWeDo: newList});
                        }}
                        className="flex-1 bg-brand-surface/50 border border-brand-accent/10 rounded-xl px-4 py-3 text-sm outline-none text-left"
                        placeholder="e.g. Concept Development"
                      />
                      <button onClick={() => {
                        const newList = formData.whatWeDo.filter((_, i) => i !== idx);
                        setFormData({...formData, whatWeDo: newList});
                      }} className="p-3 text-red-500 hover:bg-red-50 rounded-xl">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted text-left">Why Work With Us (Key Benefits)</label>
                  <button 
                    onClick={() => setFormData({...formData, whyWorkWithUs: [...formData.whyWorkWithUs, '']})}
                    className="text-xs font-bold text-brand-primary hover:underline"
                  >
                    + Add Point
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.whyWorkWithUs.map((point, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const newList = [...formData.whyWorkWithUs];
                          newList[idx] = e.target.value;
                          setFormData({...formData, whyWorkWithUs: newList});
                        }}
                        className="flex-1 bg-brand-surface/50 border border-brand-accent/10 rounded-xl px-4 py-3 text-sm outline-none text-left"
                        placeholder="e.g. On-time Delivery"
                      />
                      <button onClick={() => {
                        const newList = formData.whyWorkWithUs.filter((_, i) => i !== idx);
                        setFormData({...formData, whyWorkWithUs: newList});
                      }} className="p-3 text-red-500 hover:bg-red-50 rounded-xl">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'showcase' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Studio Reel URL (YouTube/Direct)</label>
                <div className="relative">
                  <Video className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                  <input
                    type="text"
                    value={formData.studioReelUrl}
                    onChange={(e) => setFormData({...formData, studioReelUrl: e.target.value})}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-primary transition-colors text-left"
                  />
                </div>
              </div>

              {/* Projects Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-brand-primary text-left">Our Projects</h3>
                  <button 
                    onClick={() => setFormData({
                      ...formData, 
                      projects: [...formData.projects, { name: '', type: '', year: '', thumbnail: '' }]
                    })}
                    className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary/90"
                  >
                    + Add Project
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.projects.map((project, idx) => (
                    <div key={idx} className="p-6 bg-brand-surface/30 rounded-3xl border border-brand-accent/10 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <img 
                            src={getFilePreview(projectThumbnailFiles[idx] || null, project.thumbnail)} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <input type="file" id={`project-thumb-${idx}`} className="hidden" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setProjectThumbnailFiles({...projectThumbnailFiles, [idx]: file});
                          }} />
                          <label htmlFor={`project-thumb-${idx}`} className="text-[10px] font-bold text-brand-primary hover:underline cursor-pointer">
                            Change Image
                          </label>
                        </div>
                        <button onClick={() => {
                          const newList = formData.projects.filter((_, i) => i !== idx);
                          setFormData({...formData, projects: newList});
                        }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="space-y-2 text-left">
                        <input
                          type="text"
                          value={project.name}
                          onChange={(e) => {
                            const newList = [...formData.projects];
                            newList[idx].name = e.target.value;
                            setFormData({...formData, projects: newList});
                          }}
                          placeholder="Project Name"
                          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none text-left"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={project.type}
                            onChange={(e) => {
                              const newList = [...formData.projects];
                              newList[idx].type = e.target.value;
                              setFormData({...formData, projects: newList});
                            }}
                            placeholder="Type (e.g. VFX)"
                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none text-left"
                          />
                          <input
                            type="text"
                            value={project.year}
                            onChange={(e) => {
                              const newList = [...formData.projects];
                              newList[idx].year = e.target.value;
                              setFormData({...formData, projects: newList});
                            }}
                            placeholder="Year"
                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none text-left"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clients Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-brand-primary text-left">Our Clients</h3>
                  <button 
                    onClick={() => setFormData({...formData, clients: [...formData.clients, '']})}
                    className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary/90"
                  >
                    + Add Client Logo
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {formData.clients.map((client, idx) => (
                    <div key={idx} className="relative group">
                      <div className="aspect-video bg-white rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center p-2">
                        <img src={getFilePreview(clientLogoFiles[idx] || null, client)} className="max-h-full max-w-full object-contain" />
                      </div>
                      <input type="file" id={`client-logo-${idx}`} className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setClientLogoFiles({...clientLogoFiles, [idx]: file});
                      }} />
                      <label htmlFor={`client-logo-${idx}`} className="absolute inset-0 bg-black/60 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity rounded-xl">
                        Upload
                      </label>
                      <button onClick={() => {
                        const newList = formData.clients.filter((_, i) => i !== idx);
                        setFormData({...formData, clients: newList});
                      }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'socials' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {[
                { key: 'linkedin', icon: Linkedin, label: 'LinkedIn URL', color: '#0077B5' },
                { key: 'instagram', icon: Instagram, label: 'Instagram URL', color: '#E4405F' },
                { key: 'youtube', icon: Youtube, label: 'YouTube URL', color: '#FF0000' },
                { key: 'twitter', icon: Twitter, label: 'Twitter URL', color: '#1DA1F2' },
              ].map(social => (
                <div key={social.key} className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">{social.label}</label>
                  <div className="relative">
                    <social.icon className="absolute left-6 top-1/2 -translate-y-1/2" style={{ color: social.color }} size={18} />
                    <input
                      type="text"
                      value={(formData.socialLinks as any)[social.key] || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, [social.key]: e.target.value }
                      })}
                      placeholder={`https://${social.key}.com/...`}
                      className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-primary transition-colors text-left"
                    />
                  </div>
                </div>
              ))}
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
                  {currentStepIndex === tabs.length - 1 ? 'Submit Profile' : 'Next Step'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStudioProfileModal;
