import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { upsertProfile } from '../services/professionalServices';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onUpdate: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, profile, onUpdate }) => {
  const [formData, setFormData] = React.useState({
    fullName: profile?.fullName || '',
    experienceYears: profile?.experienceYears || 0,
    primarySkill: profile?.primarySkill || '',
    position: profile?.position || 'artist',
    productionType: profile?.productionType || 'film',
    responsibilityScope: profile?.responsibilityScope || '',
    showreelUrl: profile?.showreelUrl || '',
    portfolioUrl: profile?.portfolioUrl || '',
    avatarUrl: profile?.avatarUrl || '',
    experienceScore: profile?.experienceScore || 0,
    reliabilityScore: profile?.reliabilityScore || 0,
    projectCount: profile?.projectCount || 0,
    workshopsConducted: profile?.workshopsConducted || 0,
    mentorshipSessions: profile?.mentorshipSessions || 0,
    portfolioReviews: profile?.portfolioReviews || 0,
  });

  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await upsertProfile(token, formData);
      if (response.ok) {
        onUpdate();
        onClose();
      } else {
        console.error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experienceYears' || name === 'projectCount' || name.includes('Score') ? Number(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-primary/20 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-brand-accent/10 animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-brand-surface/30">
          <div>
            <h2 className="text-2xl font-display font-bold text-brand-primary">
              {profile ? 'Edit Professional Profile' : 'Setup Professional Profile'}
            </h2>
            <p className="text-xs text-text-muted font-medium uppercase tracking-widest mt-1">
              {profile ? 'Update your verified identity' : 'Create your verified professional identity'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-text-muted hover:text-brand-primary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Experience (Years)</label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Primary Skill</label>
              <input
                type="text"
                name="primarySkill"
                value={formData.primarySkill}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Position</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium appearance-none"
              >
                <option value="artist">Artist</option>
                <option value="lead">Lead</option>
                <option value="supervisor">Supervisor</option>
                <option value="director">Director</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Production Type</label>
              <select
                name="productionType"
                value={formData.productionType}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium appearance-none"
              >
                <option value="film">Film</option>
                <option value="tv">TV</option>
                <option value="web">Web</option>
                <option value="ads">Ads</option>
              </select>
            </div>
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
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Bio (Responsibility Scope)</label>
            <textarea
              name="responsibilityScope"
              value={formData.responsibilityScope}
              onChange={handleChange}
              rows={4}
              className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Showreel URL</label>
              <input
                type="text"
                name="showreelUrl"
                value={formData.showreelUrl}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Portfolio URL</label>
              <input
                type="text"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-brand-surface/50 rounded-3xl border border-brand-accent/5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Experience Score (%)</label>
              <input
                type="number"
                name="experienceScore"
                value={formData.experienceScore}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Reliability Score (%)</label>
              <input
                type="number"
                name="reliabilityScore"
                value={formData.reliabilityScore}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Project Count</label>
              <input
                type="number"
                name="projectCount"
                value={formData.projectCount}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-brand-surface/50 rounded-3xl border border-brand-accent/5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Workshops Conducted</label>
              <input
                type="number"
                name="workshopsConducted"
                value={formData.workshopsConducted}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Mentorship Sessions</label>
              <input
                type="number"
                name="mentorshipSessions"
                value={formData.mentorshipSessions}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Portfolio Reviews</label>
              <input
                type="number"
                name="portfolioReviews"
                value={formData.portfolioReviews}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-premium text-brand-primary font-medium"
              />
            </div>
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

export default EditProfileModal;
