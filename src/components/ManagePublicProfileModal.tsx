import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Video, Image as ImageIcon, Layout, History, Sparkles, Send, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from './Button';
import { getMyPublicProfile, upsertPublicProfile } from '../services/publicProfileServices';
import { BASE_URL } from '../utils/urls';

interface ManagePublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const ManagePublicProfileModal: React.FC<ManagePublicProfileModalProps> = ({ isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'insight' | 'timeline' | 'showreel' | 'workLedger'>('insight');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const tabs = ['insight', 'timeline', 'showreel', 'workLedger'] as const;
  const currentStepIndex = tabs.indexOf(activeTab);

  const [formData, setFormData] = useState({
    auiInsight: '',
    experienceTimeline: [] as any[],
    showreel: {
      type: 'youtube',
      url: '',
      title: '',
      duration: '',
    },
    workLedger: [] as any[],
    profileImage: '',
    workLedgerImage: '',
  });

  const [showreelFile, setShowreelFile] = useState<File | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [workLedgerImageFile, setWorkLedgerImageFile] = useState<File | null>(null);
  const [projectImages, setProjectImages] = useState<{[key: number]: File[]}>({});

  useEffect(() => {
    if (isOpen) {
      fetchCurrentProfile();
    }
  }, [isOpen]);

  const fetchCurrentProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    try {
      const res = await getMyPublicProfile(token);
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setFormData({
            auiInsight: data.data.auiInsight || '',
            experienceTimeline: Array.isArray(data.data.experienceTimeline) ? data.data.experienceTimeline : [],
            showreel: data.data.showreel || { type: 'youtube', url: '', title: '', duration: '' },
            workLedger: Array.isArray(data.data.workLedger) ? data.data.workLedger : [],
            profileImage: data.data.profileImage || '',
            workLedgerImage: data.data.workLedgerImage || '',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching public profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validateStep = () => {
    if (activeTab === 'insight') {
      if (!formData.auiInsight.trim()) {
        showNotification('Please provide some insight description.', 'error');
        return false;
      }
    }

    if (activeTab === 'timeline') {
      for (const item of formData.experienceTimeline) {
        if (!item.date || !item.role || !item.company) {
          showNotification('Please fill all fields for each timeline entry.', 'error');
          return false;
        }
      }
    }

    if (activeTab === 'showreel') {
      if (!formData.showreel.title.trim()) {
        showNotification('Showreel title is mandatory.', 'error');
        return false;
      }
      if (formData.showreel.type === 'youtube' && !formData.showreel.url.trim()) {
        showNotification('Youtube URL is required for youtube showreels.', 'error');
        return false;
      }
      if (formData.showreel.type === 'direct' && !formData.showreel.url && !showreelFile) {
        showNotification('Please upload a video file.', 'error');
        return false;
      }
    }

    if (activeTab === 'workLedger') {
      for (const project of formData.workLedger) {
        if (!project.projectName || !project.year || !project.role) {
          showNotification('Project name, year, and role are mandatory for all projects.', 'error');
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    
    if (currentStepIndex < tabs.length - 1) {
      showNotification(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} data saved!`);
      setActiveTab(tabs[currentStepIndex + 1]);
    }
  };

  const handlePrevious = () => {
    setActiveTab(tabs[currentStepIndex - 1]);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const token = localStorage.getItem('token');
    if (!token) return;
    setSaving(true);

    const data = new FormData();
    data.append('auiInsight', formData.auiInsight);
    data.append('experienceTimeline', JSON.stringify(formData.experienceTimeline));
    data.append('showreelType', formData.showreel.type);
    data.append('showreelTitle', formData.showreel.title);
    data.append('showreelDuration', formData.showreel.duration);
    data.append('showreelUrl', formData.showreel.url);
    data.append('profileImage', formData.profileImage);
    data.append('workLedgerImage', formData.workLedgerImage);

    const updatedWorkLedger = (formData.workLedger || []).map((project, idx) => {
      const newImages = projectImages[idx] || [];
      return {
        ...project,
        shotSamples: [
          ...(project.shotSamples || []).filter(s => typeof s === 'string' && !s.startsWith('blob:')),
          ...newImages.map(f => `PENDING_UPLOAD:${f.name}`)
        ]
      };
    });

    console.log('Final workLedger before sending:', updatedWorkLedger);

    data.append('workLedger', JSON.stringify(updatedWorkLedger));

    if (showreelFile) {
      data.append('showreelVideo', showreelFile);
    }

    if (profileImageFile) {
      data.append('profileImageFile', profileImageFile);
    }

    if (workLedgerImageFile) {
      data.append('workLedgerImageFile', workLedgerImageFile);
    }

    Object.values(projectImages).flat().forEach(file => {
      data.append('projectImages', file);
    });

    // Log the final FormData keys being sent
    const entries: any = {};
    data.forEach((value, key) => { entries[key] = value; });
    console.log('Final FormData Payload:', entries);

    try {
      const res = await upsertPublicProfile(token, data);
      if (res.ok) {
        showNotification('Profile updated successfully!');
        onUpdate();
        setTimeout(onClose, 1000);
      }
    } catch (err) {
      console.error('Error saving public profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const addTimelineItem = () => {
    setFormData(prev => ({
      ...prev,
      experienceTimeline: [...(prev.experienceTimeline || []), { date: '', role: '', company: '' }]
    }));
  };

  const removeTimelineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experienceTimeline: (prev.experienceTimeline || []).filter((_, i) => i !== index)
    }));
  };

  const addWorkLedgerItem = () => {
    setFormData(prev => ({
      ...prev,
      workLedger: [...(prev.workLedger || []), { 
        projectName: '', 
        status: 'Completed', 
        role: '', 
        year: '', 
        type: '', 
        contribution: '', 
        scope: '',
        shotSamples: []
      }]
    }));
  };

  const removeWorkLedgerItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workLedger: (prev.workLedger || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-primary/20 backdrop-blur-sm">
      {/* Custom Toast */}
      {toast && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[110] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? 'bg-brand-primary' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-white" />}
          <span className="text-sm font-bold">{toast.msg}</span>
        </div>
      )}

      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-brand-accent/10 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-brand-surface/30">
          <div>
            <h2 className="text-3xl font-display font-bold text-brand-primary flex items-center gap-3">
              <Sparkles className="text-brand-accent" /> Manage Public Profile
            </h2>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">
              Section {currentStepIndex + 1} of 4: {activeTab.toUpperCase().replace('_', ' ')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-text-muted hover:text-brand-primary">
            <X size={24} />
          </button>
        </div>

        {/* Tabs - Now indicators */}
        <div className="flex px-8 bg-brand-surface/10 border-b border-gray-100">
          {[
            { id: 'insight', label: 'AUI Insight', icon: Sparkles },
            { id: 'timeline', label: 'Timeline', icon: History },
            { id: 'showreel', label: 'Showreel', icon: Video },
            { id: 'workLedger', label: 'Work Ledger', icon: Layout },
          ].map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                activeTab === tab.id 
                ? 'border-brand-accent text-brand-accent bg-white/50' 
                : idx < currentStepIndex 
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-text-muted hover:text-brand-primary hover:bg-gray-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {idx < currentStepIndex && <CheckCircle2 size={14} className="ml-1" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-white">
          {activeTab === 'insight' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 bg-brand-surface rounded-3xl border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 text-brand-primary">
                  <Sparkles size={20} />
                  <label className="text-sm font-bold uppercase tracking-widest">AUI Insight (AI Generated Personality)</label>
                </div>
                <textarea
                  value={formData.auiInsight}
                  onChange={(e) => setFormData({ ...formData, auiInsight: e.target.value })}
                  placeholder="Describe the professional's strengths and core expertise..."
                  className="w-full px-5 py-4 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium min-h-[150px] resize-none"
                />
                <p className="text-[10px] text-text-muted font-medium italic">Note: This is usually AI-generated, but you can manually override it here.</p>
              </div>

              <div className="p-6 bg-brand-surface rounded-3xl border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 text-brand-primary">
                  <ImageIcon size={20} />
                  <label className="text-sm font-bold uppercase tracking-widest">Profile Image</label>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-brand-accent/20 shrink-0">
                    <img 
                      src={profileImageFile ? URL.createObjectURL(profileImageFile) : (formData.profileImage ? (formData.profileImage.startsWith('http') ? formData.profileImage : `${BASE_URL}/${formData.profileImage}`) : '/assets/sarah_chen_profile_1777487447512.png')} 
                      className="w-full h-full object-cover" 
                      alt="Profile"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <label 
                      htmlFor="profile-image-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-brand-primary/90 transition-colors"
                    >
                      <Plus size={14} /> Upload New Profile Image
                    </label>
                    <p className="text-[10px] text-text-muted">JPG, PNG or WEBP. Max 2MB.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-brand-primary">Experience Timeline</h3>
                <Button variant="secondary" onClick={addTimelineItem} className="text-xs py-2 px-4 gap-2">
                  <Plus size={16} /> Add Position
                </Button>
              </div>
              
              <div className="space-y-4">
                {(formData.experienceTimeline || []).map((item, idx) => (
                  <div key={idx} className="p-6 bg-brand-surface rounded-3xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 relative group">
                    <button 
                      onClick={() => removeTimelineItem(idx)}
                      className="absolute -top-2 -right-2 p-1.5 bg-white text-red-500 rounded-full shadow-md border border-red-50 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Date Range</label>
                      <input
                        type="text"
                        placeholder="e.g. 2023 - Present"
                        value={item.date}
                        onChange={(e) => {
                          const newTimeline = formData.experienceTimeline.map((item, i) => 
                            i === idx ? { ...item, date: e.target.value } : item
                          );
                          setFormData({ ...formData, experienceTimeline: newTimeline });
                        }}
                        className="w-full px-4 py-3 bg-white rounded-xl border border-gray-100 focus:border-brand-accent outline-none text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Role</label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Artist"
                        value={item.role}
                        onChange={(e) => {
                          const newTimeline = formData.experienceTimeline.map((item, i) => 
                            i === idx ? { ...item, role: e.target.value } : item
                          );
                          setFormData({ ...formData, experienceTimeline: newTimeline });
                        }}
                        className="w-full px-4 py-3 bg-white rounded-xl border border-gray-100 focus:border-brand-accent outline-none text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Company</label>
                      <input
                        type="text"
                        placeholder="e.g. Marvel Studios"
                        value={item.company}
                        onChange={(e) => {
                          const newTimeline = formData.experienceTimeline.map((item, i) => 
                            i === idx ? { ...item, company: e.target.value } : item
                          );
                          setFormData({ ...formData, experienceTimeline: newTimeline });
                        }}
                        className="w-full px-4 py-3 bg-white rounded-xl border border-gray-100 focus:border-brand-accent outline-none text-sm font-bold"
                      />
                    </div>
                  </div>
                ))}
                {formData.experienceTimeline.length === 0 && (
                  <div className="text-center p-12 bg-brand-surface/50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-sm text-text-muted font-medium">No timeline items added yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'showreel' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-8 bg-brand-surface rounded-3xl border border-gray-100 space-y-6">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setFormData({ ...formData, showreel: { ...formData.showreel, type: 'youtube' } })}
                    className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 font-bold transition-all ${formData.showreel.type === 'youtube' ? 'bg-brand-accent/10 border-brand-accent text-brand-accent' : 'bg-white border-gray-100 text-text-muted'}`}
                  >
                    Youtube Link
                  </button>
                  <button 
                    onClick={() => setFormData({ ...formData, showreel: { ...formData.showreel, type: 'direct' } })}
                    className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 font-bold transition-all ${formData.showreel.type === 'direct' ? 'bg-brand-accent/10 border-brand-accent text-brand-accent' : 'bg-white border-gray-100 text-text-muted'}`}
                  >
                    Direct Upload
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Showreel Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Showreel 2024"
                      value={formData.showreel.title}
                      onChange={(e) => setFormData({ ...formData, showreel: { ...formData.showreel, title: e.target.value } })}
                      className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 02:30"
                      value={formData.showreel.duration}
                      onChange={(e) => setFormData({ ...formData, showreel: { ...formData.showreel, duration: e.target.value } })}
                      className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent outline-none font-bold"
                    />
                  </div>
                </div>

                {formData.showreel.type === 'youtube' ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Youtube URL</label>
                    <input
                      type="text"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.showreel.url}
                      onChange={(e) => setFormData({ ...formData, showreel: { ...formData.showreel, url: e.target.value } })}
                      className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent outline-none font-bold"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Upload Video File</label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setShowreelFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-brand-accent/50 group-hover:bg-brand-surface/50 transition-all">
                        <Video size={32} className="text-text-muted group-hover:text-brand-accent" />
                        <p className="text-sm font-bold text-brand-primary">{showreelFile ? showreelFile.name : 'Click to upload video'}</p>
                        <p className="text-xs text-text-muted">MP4, WEBM, MOV (Max 50MB)</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'workLedger' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-brand-primary">Work Ledger (Project Showcase)</h3>
                <Button variant="secondary" onClick={addWorkLedgerItem} className="text-xs py-2 px-4 gap-2">
                  <Plus size={16} /> Add Project
                </Button>
              </div>

              <div className="p-6 bg-brand-surface rounded-3xl border border-gray-100 space-y-4 mb-6">
                <div className="flex items-center gap-2 text-brand-primary">
                  <ImageIcon size={20} />
                  <label className="text-sm font-bold uppercase tracking-widest">Project Primary Image (Featured)</label>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-40 h-24 rounded-2xl overflow-hidden border-2 border-brand-accent/20 shrink-0">
                    <img 
                      src={workLedgerImageFile ? URL.createObjectURL(workLedgerImageFile) : (formData.workLedgerImage ? (formData.workLedgerImage.startsWith('http') ? formData.workLedgerImage : `${BASE_URL}/${formData.workLedgerImage}`) : '/assets/superhero_team_thumbnail_1777487519840.png')} 
                      className="w-full h-full object-cover" 
                      alt="Project Primary"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setWorkLedgerImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="ledger-header-upload"
                    />
                    <label 
                      htmlFor="ledger-header-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-brand-primary/90 transition-colors"
                    >
                      <Plus size={14} /> Upload Primary Image
                    </label>
                    <p className="text-[10px] text-text-muted">This image will be the main thumbnail for your projects in the Work Ledger.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {(formData.workLedger || []).map((project, idx) => (
                  <div key={idx} className="p-8 bg-brand-surface rounded-[32px] border border-gray-100 space-y-6 relative group">
                    <button 
                      onClick={() => removeWorkLedgerItem(idx)}
                      className="absolute top-4 right-4 p-2 bg-white text-red-500 rounded-full shadow-md border border-red-50 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Project Name</label>
                        <input
                          type="text"
                          value={project.projectName}
                          onChange={(e) => {
                            const newLedger = formData.workLedger.map((proj, i) => 
                              i === idx ? { ...proj, projectName: e.target.value } : proj
                            );
                            setFormData({ ...formData, workLedger: newLedger });
                          }}
                          className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent outline-none font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Year</label>
                        <input
                          type="text"
                          value={project.year}
                          onChange={(e) => {
                            const newLedger = formData.workLedger.map((proj, i) => 
                              i === idx ? { ...proj, year: e.target.value } : proj
                            );
                            setFormData({ ...formData, workLedger: newLedger });
                          }}
                          className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent outline-none font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Role</label>
                        <input
                          type="text"
                          value={project.role}
                          onChange={(e) => {
                            const newLedger = formData.workLedger.map((proj, i) => 
                              i === idx ? { ...proj, role: e.target.value } : proj
                            );
                            setFormData({ ...formData, workLedger: newLedger });
                          }}
                          className="w-full px-4 py-3 bg-white rounded-xl border border-gray-100 focus:border-brand-accent outline-none text-sm font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Type</label>
                        <input
                          type="text"
                          value={project.type}
                          onChange={(e) => {
                            const newLedger = formData.workLedger.map((proj, i) => 
                              i === idx ? { ...proj, type: e.target.value } : proj
                            );
                            setFormData({ ...formData, workLedger: newLedger });
                          }}
                          className="w-full px-4 py-3 bg-white rounded-xl border border-gray-100 focus:border-brand-accent outline-none text-sm font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Status</label>
                        <select
                          value={project.status}
                          onChange={(e) => {
                            const newLedger = formData.workLedger.map((proj, i) => 
                              i === idx ? { ...proj, status: e.target.value } : proj
                            );
                            setFormData({ ...formData, workLedger: newLedger });
                          }}
                          className="w-full px-4 py-3 bg-white rounded-xl border border-gray-100 focus:border-brand-accent outline-none text-sm font-bold appearance-none"
                        >
                          <option>Completed</option>
                          <option>In Production</option>
                          <option>Post-Production</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Contribution (Bullet points, one per line)</label>
                      <textarea
                        value={project.contribution}
                        onChange={(e) => {
                          const newLedger = formData.workLedger.map((proj, i) => 
                            i === idx ? { ...proj, contribution: e.target.value } : proj
                          );
                          setFormData({ ...formData, workLedger: newLedger });
                        }}
                        rows={3}
                        className="w-full px-5 py-4 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent outline-none font-medium resize-none text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Scope (Bullet points, one per line)</label>
                      <textarea
                        value={project.scope}
                        onChange={(e) => {
                          const newLedger = formData.workLedger.map((proj, i) => 
                            i === idx ? { ...proj, scope: e.target.value } : proj
                          );
                          setFormData({ ...formData, workLedger: newLedger });
                        }}
                        rows={3}
                        className="w-full px-5 py-4 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent outline-none font-medium resize-none text-sm"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Project Shot Samples</label>
                      <div className="flex flex-wrap gap-4">
                        <div className="relative">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files) {
                                const files = Array.from(e.target.files);
                                setProjectImages({ ...projectImages, [idx]: files });
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-1 hover:border-brand-accent transition-all bg-white">
                            <Plus size={20} className="text-text-muted" />
                            <span className="text-[8px] font-bold uppercase tracking-widest text-text-muted">Upload</span>
                          </div>
                        </div>
                        {/* Existing Images */}
                        {(project.shotSamples || []).map((sample: string, sIdx: number) => {
                          if (sample.startsWith('PENDING_UPLOAD:')) return null;
                          const url = sample.startsWith('http') ? sample : `${BASE_URL}/${sample}`;
                          return (
                            <div key={`existing-${sIdx}`} className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 relative group">
                              <img src={url} className="w-full h-full object-cover" />
                              <button 
                                onClick={() => {
                                  const newLedger = [...formData.workLedger];
                                  newLedger[idx].shotSamples = newLedger[idx].shotSamples.filter((_: any, i: number) => i !== sIdx);
                                  setFormData({ ...formData, workLedger: newLedger });
                                }}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} className="text-white" />
                              </button>
                            </div>
                          );
                        })}
                        {/* New Images */}
                        {projectImages[idx]?.map((file, fIdx) => (
                          <div key={`new-${fIdx}`} className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 relative group">
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                            <button 
                              onClick={() => {
                                const newImages = [...(projectImages[idx] || [])];
                                newImages.splice(fIdx, 1);
                                setProjectImages({ ...projectImages, [idx]: newImages });
                              }}
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} className="text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {formData.workLedger.length === 0 && (
                  <div className="text-center p-12 bg-brand-surface/50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-sm text-text-muted font-medium">No projects added to the ledger yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-brand-surface/30 flex justify-between gap-4">
          <div className="flex gap-3">
            {currentStepIndex > 0 && (
              <Button variant="secondary" onClick={handlePrevious} className="px-6 gap-2">
                <ArrowLeft size={18} /> Previous
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            {currentStepIndex < tabs.length - 1 ? (
              <Button onClick={handleNext} className="px-8 gap-2 shadow-premium">
                Next <ArrowRight size={18} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={saving} className="px-10 gap-2 shadow-premium bg-emerald-600 hover:bg-emerald-700">
                {saving ? 'Submitting...' : <>Submit & Update <Send size={18} /></>}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePublicProfileModal;
