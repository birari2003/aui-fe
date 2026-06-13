import React, { useState, useEffect } from 'react';
import { 
  X, Save, Building2, MapPin, Mail, Globe, 
  Users, Briefcase, Linkedin, UserCircle, 
  Calendar, Layers, TrendingUp, Compass, Target, Phone
} from 'lucide-react';
import { getStudioInfo, updateStudioInfo } from '../services/studioServices';
import { toast } from 'react-toastify';

interface StudioInfoData {
  contactPerson: string;
  designation: string;
  teamSize: number;
  workType: 'film' | 'series' | 'ads' | 'gaming';
  hiringFrequency: 'frequent' | 'occasional' | 'rare';
  projectType: 'international' | 'domestic' | 'both';
  annualProjects: number;
  hiringTiers: string;
  email: string;
  phone: string;
}

const INITIAL_DATA: StudioInfoData = {
  contactPerson: '',
  designation: '',
  teamSize: 0,
  workType: 'film',
  hiringFrequency: 'occasional',
  projectType: 'both',
  annualProjects: 0,
  hiringTiers: '',
  email: '',
  phone: '',
};

const ManageStudioInfoModal = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState<StudioInfoData>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await getStudioInfo(token);
        if (res.ok) {
          const payload = await res.json();
          if (payload.data) {
            setFormData({
              ...INITIAL_DATA,
              ...payload.data,
              email: payload.data.email || (payload.data.user?.email || ''),
              phone: payload.data.phone || (payload.data.user?.phone || '')
            });
          }
        }
      } catch (err) {
        console.error('Fetch info error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    setSaving(true);

    try {
      const res = await updateStudioInfo(token, formData);
      if (res.ok) {
        toast.success('Studio information updated successfully!');
        onClose();
      } else {
        const errBody = await res.json();
        toast.error(errBody.message || 'Update failed');
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
        <div className="bg-white rounded-[32px] p-12 shadow-2xl">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm font-bold text-brand-primary uppercase tracking-widest">Loading Studio Info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-primary/20 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl my-auto border border-brand-accent/10">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-brand-surface/30">
          <div>
            <h2 className="text-3xl font-display font-bold text-brand-primary flex items-center gap-3">
              <Building2 className="text-brand-accent" /> Edit Studio Information
            </h2>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">
              Update your registration details and operational info
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-text-muted hover:text-brand-primary">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Contact Person Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <UserCircle size={12} /> Contact Person
              </label>
              <input
                required
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors"
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <Target size={12} /> Designation
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({...formData, designation: e.target.value})}
                className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors"
                placeholder="e.g. Head of Production"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <Mail size={12} /> Email (Read-only)
              </label>
              <input
                disabled
                type="email"
                value={formData.email}
                className="w-full bg-gray-100 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none text-text-muted cursor-not-allowed transition-colors"
                placeholder="Email Address"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <Phone size={12} /> Contact No.
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors"
                placeholder="Phone Number"
              />
            </div>
          </div>

          {/* Operational Info Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-gray-50 pt-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <Users size={12} /> Team Size
              </label>
              <input
                type="number"
                value={formData.teamSize}
                onChange={(e) => setFormData({...formData, teamSize: parseInt(e.target.value) || 0})}
                className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <TrendingUp size={12} /> Annual Proj.
              </label>
              <input
                type="number"
                value={formData.annualProjects}
                onChange={(e) => setFormData({...formData, annualProjects: parseInt(e.target.value) || 0})}
                className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <Layers size={12} /> Hiring Tiers
              </label>
              <input
                type="text"
                value={formData.hiringTiers}
                onChange={(e) => setFormData({...formData, hiringTiers: e.target.value})}
                className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors"
                placeholder="e.g. Mid, Senior"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <Briefcase size={12} /> Work Type
              </label>
              <select
                value={formData.workType}
                onChange={(e) => setFormData({...formData, workType: e.target.value as any})}
                className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="film">Film</option>
                <option value="series">Series</option>
                <option value="ads">Ads</option>
                <option value="gaming">Gaming</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <TrendingUp size={12} /> Hiring Freq.
              </label>
              <select
                value={formData.hiringFrequency}
                onChange={(e) => setFormData({...formData, hiringFrequency: e.target.value as any})}
                className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="frequent">Frequent</option>
                <option value="occasional">Occasional</option>
                <option value="rare">Rare</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <Compass size={12} /> Project Type
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({...formData, projectType: e.target.value as any})}
                className="w-full bg-brand-surface/50 border border-brand-accent/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="international">International</option>
                <option value="domestic">Domestic</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>



          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 text-sm font-bold uppercase tracking-widest text-text-muted hover:text-brand-primary transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              type="submit"
              className="px-10 py-4 bg-brand-primary text-white rounded-2xl text-sm font-bold uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {saving ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  Save Studio Info
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageStudioInfoModal;
