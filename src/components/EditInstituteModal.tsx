import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { updateInstituteProfile } from '../services/instituteServices';

interface EditInstituteModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onUpdate: () => void;
}

const EditInstituteModal: React.FC<EditInstituteModalProps> = ({ isOpen, onClose, profile, onUpdate }) => {
  const [formData, setFormData] = React.useState({
    instituteName: profile?.instituteName || '',
    contactPerson: profile?.contactPerson || '',
    email: profile?.email || '',
    website: profile?.website || '',
    location: profile?.location || '',
    description: profile?.description || '',
    establishedYear: profile?.establishedYear || '',
    avatarUrl: profile?.avatarUrl || '',
    bannerUrl: profile?.bannerUrl || '',
    studentCount: profile?.studentCount || 0,
    branchCount: profile?.branchCount || 0,
    coursesOffered: profile?.coursesOffered || '',
    conductsWorkshops: profile?.conductsWorkshops || false,
    industryExposure: profile?.industryExposure || 'never',
  });

  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await updateInstituteProfile(token, formData);
      if (response.ok) {
        onUpdate();
        onClose();
      } else {
        console.error('Failed to update institute profile');
      }
    } catch (err) {
      console.error('Error updating institute profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'studentCount' || name === 'branchCount' || name === 'establishedYear') ? Number(val) : val,
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-primary/20 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-brand-accent/10 animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-brand-surface/30">
          <div>
            <h2 className="text-2xl font-display font-bold text-brand-primary">
              {profile ? 'Edit Institute Profile' : 'Setup Institute Profile'}
            </h2>
            <p className="text-xs text-text-muted font-medium uppercase tracking-widest mt-1">
              Update your institute's public presence
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-text-muted hover:text-brand-primary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Institute Name</label>
              <input
                type="text"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Established Year</label>
              <input
                type="number"
                name="establishedYear"
                value={formData.establishedYear}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Avatar URL</label>
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Banner URL</label>
              <input
                type="text"
                name="bannerUrl"
                value={formData.bannerUrl}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-brand-surface/50 rounded-3xl border border-brand-accent/5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Student Count</label>
              <input
                type="number"
                name="studentCount"
                value={formData.studentCount}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Branch Count</label>
              <input
                type="number"
                name="branchCount"
                value={formData.branchCount}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Industry Exposure</label>
              <select
                name="industryExposure"
                value={formData.industryExposure}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium appearance-none"
              >
                <option value="regularly">Regularly</option>
                <option value="occasionally">Occasionally</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-brand-surface/50 rounded-2xl border border-brand-accent/5">
            <input
              type="checkbox"
              name="conductsWorkshops"
              checked={formData.conductsWorkshops}
              onChange={handleChange}
              className="w-5 h-5 accent-brand-accent rounded"
            />
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Conducts Workshops</label>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 bg-brand-surface/30 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading} className="px-8 border border-gray-100 hover:bg-white">Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading} className="px-10">
            {loading ? (profile ? 'Updating...' : 'Setting Up...') : (profile ? 'Save Profile' : 'Setup Profile')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditInstituteModal;
