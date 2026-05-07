import React, { useState } from 'react';
import { X, Calendar, Clock, Briefcase } from 'lucide-react';
import Button from './Button';

interface EngagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  professionalName: string;
  loading: boolean;
}

const EngagementModal: React.FC<EngagementModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  professionalName,
  loading 
}) => {
  const [formData, setFormData] = useState({
    projectTimeline: '',
    productionType: 'film' as 'film' | 'tv' | 'web' | 'ads' | 'other',
    engagementBrief: '',
    proposedBudget: '',
    startDate: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-brand-surface/30">
          <div>
            <h3 className="text-2xl font-bold text-brand-primary">Request Engagement</h3>
            <p className="text-sm text-text-muted mt-1">Hiring: <span className="font-bold text-brand-accent">{professionalName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={24} className="text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Project Timeline</label>
              <div className="relative">
                <Clock className="absolute left-4 top-3.5 text-text-muted" size={18} />
                <input
                  type="text"
                  placeholder="e.g. 3 Months, 2 Weeks"
                  required
                  value={formData.projectTimeline}
                  onChange={(e) => setFormData({ ...formData, projectTimeline: e.target.value })}
                  className="w-full pl-12 pr-5 py-3.5 bg-brand-surface rounded-2xl border border-transparent focus:border-brand-accent outline-none font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Production Type</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-3.5 text-text-muted" size={18} />
                <select
                  value={formData.productionType}
                  onChange={(e) => setFormData({ ...formData, productionType: e.target.value as any })}
                  className="w-full pl-12 pr-5 py-3.5 bg-brand-surface rounded-2xl border border-transparent focus:border-brand-accent outline-none font-bold appearance-none"
                >
                  <option value="film">Feature Film</option>
                  <option value="tv">TV Series</option>
                  <option value="web">Web Series</option>
                  <option value="ads">Commercial/Ads</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Proposed Budget</label>
              <input
                type="text"
                placeholder="e.g. $5000 or TBD"
                value={formData.proposedBudget}
                onChange={(e) => setFormData({ ...formData, proposedBudget: e.target.value })}
                className="w-full px-5 py-3.5 bg-brand-surface rounded-2xl border border-transparent focus:border-brand-accent outline-none font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 text-text-muted" size={18} />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full pl-12 pr-5 py-3.5 bg-brand-surface rounded-2xl border border-transparent focus:border-brand-accent outline-none font-bold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Engagement Brief</label>
            <textarea
              placeholder="Describe the role and project requirements..."
              required
              rows={4}
              value={formData.engagementBrief}
              onChange={(e) => setFormData({ ...formData, engagementBrief: e.target.value })}
              className="w-full px-5 py-4 bg-brand-surface rounded-2xl border border-transparent focus:border-brand-accent outline-none font-medium resize-none"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <Button 
              variant="secondary" 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              loading={loading}
              className="flex-1 py-4 shadow-lg shadow-brand-primary/20"
            >
              Send Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EngagementModal;
