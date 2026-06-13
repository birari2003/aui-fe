import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck, Globe, MapPin, ChevronRight, Layers, Briefcase, Activity, Filter, Search, Clock, ArrowRight, X, Shield, Sparkles, Lock, Pencil, Trash2, Plus, Calendar, Edit2, BarChart, CheckCircle2, ExternalLink, Settings } from 'lucide-react';

import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { View } from '../types';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, getStudioJobPostings, getStudioRequests, respondToStudioRequest, applyForJob, getMyApplications, respondToAgreement, getNotifications } from '../services/professionalServices';
import { getAllStudioProfiles } from '../services/studioProfileService';
import { searchInstitutes } from '../services/searchServices';
import EditProfileModal from '../components/EditProfileModal';
import ManagePublicProfileModal from '../components/ManagePublicProfileModal';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../utils/urls';
import SEO from '../components/SEO';
import { getMyPublicProfile } from '../services/publicProfileServices';

const EditableField = ({ label, value, field, type = 'text', locked = false, isEditing, onEdit, onChange }: any) => {
  return (
    <div className="space-y-2 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative group">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</label>
        {!locked && (
          <button
            onClick={() => onEdit(isEditing ? null : field)}
            className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest hover:underline ${isEditing ? 'text-emerald-500' : 'text-brand-primary'}`}
          >
            {isEditing ? <><CheckCircle2 size={10} /> Done</> : <><Pencil size={10} /> Edit</>}
          </button>
        )}
        {locked && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-text-muted uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">
            <Lock size={10} /> Locked
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type={type}
          value={value}
          disabled={!isEditing && !locked}
          readOnly={!isEditing && !locked}
          className={`w-full font-bold text-brand-primary bg-transparent focus:outline-none transition-all ${!isEditing ? 'opacity-70' : 'opacity-100 ring-1 ring-brand-primary/10 rounded px-2 py-1'}`}
          onChange={(e) => onChange(e.target.value)}
        />
        {!locked && !isEditing && (
          <button
            onClick={() => onEdit(field)}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
          >
            <Pencil size={14} className="text-brand-primary" />
          </button>
        )}
      </div>
    </div>
  );
};

const VerificationSheetModal = ({
  isOpen,
  onClose,
  profile,
  publicProfile,
  opportunity,
  onSubmit,
  loading
}: {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  publicProfile: any;
  opportunity: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}) => {
  const [formData, setFormData] = React.useState<any>(null);
  const [editingField, setEditingPhase] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (profile && isOpen) {
      const timeline = (Array.isArray(publicProfile?.experienceTimeline) ? publicProfile.experienceTimeline : []).map((item: any) => ({
        role: item.role || '',
        company: item.company || '',
        period: item.period || item.date || ''
      }));

      const currentComp = timeline.find((item: any) => item.period?.toLowerCase().includes('present'))?.company || (timeline[0]?.company || '');

      const ledger = (Array.isArray(publicProfile?.workLedger) ? publicProfile.workLedger : []).map((item: any) => ({
        project: item.project || item.projectName || '',
        studio: item.studio || '',
        role: item.role || '',
        year: item.year || ''
      }));

      setFormData({
        talentId: profile.user?.talentId?.talentCode || '',
        name: profile.fullName || '',
        primarySkill: profile.primarySkill || (profile.skills && profile.skills[0]) || '',
        position: (profile.position ? (profile.position.charAt(0).toUpperCase() + profile.position.slice(1)) : ''),
        experience: profile.experienceYears ? `${profile.experienceYears}y` : '',
        experienceTimeline: timeline,
        currentCompany: currentComp,
        currentCTC: '',
        expectedCTC: '',
        noticePeriod: '',
        location: profile.location || '',
        relocationPreference: '',
        aboutMe: profile.bio || '',
        showreelLinks: [
          publicProfile?.showreel?.url || publicProfile?.showreelUrl || publicProfile?.showreel_url || profile?.showreelUrl || profile?.showreel_url || ''
        ],
        workLedger: ledger
      });
    }
  }, [profile, publicProfile, isOpen]);

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-brand-primary/40 backdrop-blur-md z-[110] flex items-center justify-center p-6 text-left">
      <div className="bg-[#12121A] w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 text-white flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">Verification Sheet</p>
            <h2 className="text-2xl font-display font-bold">Direct Engagement Information sheet</h2>
            <p className="text-white/40 text-sm">Verify your information before sending to {opportunity?.studio?.studioName || 'Movement Studio'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-white rounded-t-[32px]">
          {/* Info Exchange Alert */}
          <div className="p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary shadow-sm border border-brand-primary/10 flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-brand-primary text-sm">Secure AUI Information Exchange</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                The studio has requested clean, verified profile fields to approve this engagement immediately. You can modify any automatically pre-filled details to fit your current situation.
              </p>
            </div>
          </div>

          <EditableField
            label="Talent ID"
            value={formData.talentId}
            field="talentId"
            locked
          />
          <EditableField
            label="Name"
            value={formData.name}
            field="name"
            isEditing={editingField === 'name'}
            onEdit={setEditingPhase}
            onChange={(val: string) => setFormData({ ...formData, name: val })}
          />
          <EditableField
            label="Primary Skill"
            value={formData.primarySkill}
            field="primarySkill"
            isEditing={editingField === 'primarySkill'}
            onEdit={setEditingPhase}
            onChange={(val: string) => setFormData({ ...formData, primarySkill: val })}
          />
          <EditableField
            label="Position"
            value={formData.position}
            field="position"
            isEditing={editingField === 'position'}
            onEdit={setEditingPhase}
            onChange={(val: string) => setFormData({ ...formData, position: val })}
          />
          <EditableField
            label="Experience"
            value={formData.experience}
            field="experience"
            isEditing={editingField === 'experience'}
            onEdit={setEditingPhase}
            onChange={(val: string) => setFormData({ ...formData, experience: val })}
          />

          {/* Experience Timeline */}
          <div className="space-y-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative group">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Experience Timeline (Interactive Timeline)</label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingPhase(editingField === 'timeline' ? null : 'timeline')}
                  className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest hover:underline px-3 py-1.5 rounded-lg ${editingField === 'timeline' ? 'text-emerald-500 bg-emerald-50' : 'text-brand-primary bg-brand-primary/5'}`}
                >
                  {editingField === 'timeline' ? <><CheckCircle2 size={10} /> Save Changes</> : <><Pencil size={10} /> Edit Timeline</>}
                </button>
                {editingField === 'timeline' && (
                  <button
                    onClick={() => {
                      const newTimeline = [...formData.experienceTimeline, { role: '', company: '', period: '' }];
                      setFormData({ ...formData, experienceTimeline: newTimeline });
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:underline bg-brand-primary/5 px-3 py-1.5 rounded-lg"
                  >
                    <Plus size={10} /> Add Milestone
                  </button>
                )}
              </div>
            </div>
            {editingField !== 'timeline' && (
              <button
                onClick={() => setEditingPhase('timeline')}
                className="absolute right-4 top-4 p-2 hover:bg-gray-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <Pencil size={14} className="text-brand-primary" />
              </button>
            )}
            <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100 pl-8">
              {formData.experienceTimeline.map((item: any, i: number) => {
                const isEditing = editingField === 'timeline';
                return (
                  <div key={i} className={`relative grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border group text-left transition-all ${isEditing ? 'bg-white border-brand-primary/20 shadow-md' : 'bg-gray-50/50 border-gray-100'}`}>
                    <div className={`absolute -left-[25px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-colors ${isEditing ? 'bg-emerald-500' : 'bg-brand-primary'}`} />
                    <div>
                      <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1">Role</p>
                      <div className="flex items-center gap-1">
                        <input
                          className={`bg-transparent text-xs font-bold text-brand-primary w-full outline-none transition-all ${isEditing ? 'ring-1 ring-brand-primary/10 rounded px-1' : 'pointer-events-none'}`}
                          value={item.role}
                          readOnly={!isEditing}
                          onChange={(e) => {
                            const newTimeline = [...formData.experienceTimeline];
                            newTimeline[i].role = e.target.value;
                            setFormData({ ...formData, experienceTimeline: newTimeline });
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1">Company/Studio</p>
                      <div className="flex items-center gap-1">
                        <input
                          className={`bg-transparent text-xs font-bold text-brand-primary w-full outline-none transition-all ${isEditing ? 'ring-1 ring-brand-primary/10 rounded px-1' : 'pointer-events-none'}`}
                          value={item.company}
                          readOnly={!isEditing}
                          onChange={(e) => {
                            const newTimeline = [...formData.experienceTimeline];
                            newTimeline[i].company = e.target.value;
                            setFormData({ ...formData, experienceTimeline: newTimeline });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1">Period</p>
                        <div className="flex items-center gap-1">
                          <input
                            className={`bg-transparent text-xs font-bold text-brand-primary w-full outline-none transition-all ${isEditing ? 'ring-1 ring-brand-primary/10 rounded px-1' : 'pointer-events-none'}`}
                            value={item.period}
                            readOnly={!isEditing}
                            onChange={(e) => {
                              const newTimeline = [...formData.experienceTimeline];
                              newTimeline[i].period = e.target.value;
                              setFormData({ ...formData, experienceTimeline: newTimeline });
                            }}
                          />
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => {
                            const newTimeline = formData.experienceTimeline.filter((_: any, idx: number) => idx !== i);
                            setFormData({ ...formData, experienceTimeline: newTimeline });
                          }}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <EditableField
            label="Current Company"
            value={formData.currentCompany}
            field="currentCompany"
            isEditing={editingField === 'currentCompany'}
            onEdit={setEditingPhase}
            onChange={(val: string) => setFormData({ ...formData, currentCompany: val })}
          />
          <EditableField
            label="Current CTC (Required) *"
            value={formData.currentCTC}
            field="currentCTC"
            isEditing={editingField === 'currentCTC'}
            onEdit={setEditingPhase}
            onChange={(val: string) => setFormData({ ...formData, currentCTC: val })}
          />
          <EditableField
            label="Expected CTC (Required) *"
            value={formData.expectedCTC}
            field="expectedCTC"
            isEditing={editingField === 'expectedCTC'}
            onEdit={setEditingPhase}
            onChange={(val: string) => setFormData({ ...formData, expectedCTC: val })}
          />
          <EditableField
            label="Notice Period (Required) *"
            value={formData.noticePeriod}
            field="noticePeriod"
            isEditing={editingField === 'noticePeriod'}
            onEdit={setEditingPhase}
            onChange={(val: string) => setFormData({ ...formData, noticePeriod: val })}
          />
          <EditableField
            label="Location"
            value={formData.location}
            field="location"
            isEditing={editingField === 'location'}
            onEdit={setEditingPhase}
            onChange={(val: string) => setFormData({ ...formData, location: val })}
          />
          <EditableField
            label="Relocation Preference"
            value={formData.relocationPreference}
            field="relocationPreference"
            isEditing={editingField === 'relocationPreference'}
            onEdit={setEditingPhase}
            onChange={(val: string) => setFormData({ ...formData, relocationPreference: val })}
          />

          <div className="space-y-2 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative group">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">About Me</label>
              <button
                onClick={() => setEditingPhase(editingField === 'aboutMe' ? null : 'aboutMe')}
                className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest hover:underline ${editingField === 'aboutMe' ? 'text-emerald-500' : 'text-brand-primary'}`}
              >
                {editingField === 'aboutMe' ? <><CheckCircle2 size={10} /> Done</> : <><Pencil size={10} /> Edit</>}
              </button>
            </div>
            {editingField !== 'aboutMe' && (
              <button
                onClick={() => setEditingPhase('aboutMe')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <Pencil size={14} className="text-brand-primary" />
              </button>
            )}
            <textarea
              className={`w-full font-medium text-text-secondary bg-transparent focus:outline-none resize-none text-sm leading-relaxed transition-all ${editingField === 'aboutMe' ? 'ring-1 ring-brand-primary/10 rounded p-2' : 'pointer-events-none'}`}
              rows={3}
              value={formData.aboutMe}
              readOnly={editingField !== 'aboutMe'}
              placeholder="Tell the studio about your professional journey manually..."
              onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
            />
          </div>

          <div className="space-y-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative group">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Showreel Link(S)</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingPhase(editingField === 'links' ? null : 'links')}
                  className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest hover:underline px-3 py-1.5 rounded-lg ${editingField === 'links' ? 'text-emerald-500 bg-emerald-50' : 'text-brand-primary bg-brand-primary/5'}`}
                >
                  {editingField === 'links' ? <><CheckCircle2 size={10} /> Save</> : <><Pencil size={10} /> Edit</>}
                </button>
                {editingField === 'links' && (
                  <button
                    onClick={() => {
                      const newLinks = [...formData.showreelLinks, ''];
                      setFormData({ ...formData, showreelLinks: newLinks });
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:underline bg-brand-primary/5 px-3 py-1.5 rounded-lg"
                  >
                    <Plus size={10} /> Add More
                  </button>
                )}
              </div>
            </div>
            {editingField !== 'links' && (
              <button
                onClick={() => setEditingPhase('links')}
                className="absolute right-4 top-4 p-2 hover:bg-gray-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <Pencil size={14} className="text-brand-primary" />
              </button>
            )}
            {formData.showreelLinks.map((link: string, i: number) => {
              const isEditing = editingField === 'links';
              return (
                <div key={i} className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      className={`w-full font-bold text-brand-primary bg-gray-50/50 p-4 rounded-xl border transition-all focus:outline-none pr-10 ${isEditing ? 'border-brand-primary/20 bg-white ring-1 ring-brand-primary/10' : 'border-gray-100 pointer-events-none opacity-70'}`}
                      value={link}
                      readOnly={!isEditing}
                      onChange={(e) => {
                        const newLinks = [...formData.showreelLinks];
                        newLinks[i] = e.target.value;
                        setFormData({ ...formData, showreelLinks: newLinks });
                      }}
                      placeholder="https://..."
                    />
                  </div>
                  {isEditing && formData.showreelLinks.length > 1 && (
                    <button
                      onClick={() => {
                        const newLinks = formData.showreelLinks.filter((_: any, idx: number) => idx !== i);
                        setFormData({ ...formData, showreelLinks: newLinks });
                      }}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Work Ledger */}
          <div className="space-y-4 p-6 bg-yellow-50/30 rounded-2xl border border-yellow-100 shadow-sm relative group">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Work Ledger (Verified Film Credits)</label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingPhase(editingField === 'ledger' ? null : 'ledger')}
                  className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest hover:underline px-3 py-1.5 rounded-lg ${editingField === 'ledger' ? 'text-emerald-500 bg-emerald-50' : 'text-orange-500 bg-orange-50'}`}
                >
                  {editingField === 'ledger' ? <><CheckCircle2 size={10} /> Save</> : <><Pencil size={10} /> Edit</>}
                </button>
                {editingField === 'ledger' && (
                  <button
                    onClick={() => {
                      const newLedger = [...formData.workLedger, { project: '', studio: '', role: '', year: '' }];
                      setFormData({ ...formData, workLedger: newLedger });
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase tracking-widest hover:underline bg-orange-50 px-3 py-1.5 rounded-lg"
                  >
                    <Plus size={10} /> Add Credit
                  </button>
                )}
              </div>
            </div>
            {editingField !== 'ledger' && (
              <button
                onClick={() => setEditingPhase('ledger')}
                className="absolute right-4 top-4 p-2 hover:bg-gray-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <Pencil size={14} className="text-orange-500" />
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.workLedger.map((item: any, i: number) => {
                const isEditing = editingField === 'ledger';
                return (
                  <div key={i} className={`p-4 rounded-xl border group relative text-left transition-all ${isEditing ? 'bg-white border-orange-200 shadow-md' : 'bg-gray-50/50 border-gray-100'}`}>
                    <div className="grid grid-cols-2 gap-y-3">
                      <div>
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-0.5">Project / Film</p>
                        <div className="flex items-center gap-1">
                          <input
                            className={`bg-transparent text-[10px] font-bold text-brand-primary w-full outline-none ${isEditing ? 'ring-1 ring-brand-primary/10 rounded px-0.5' : 'pointer-events-none'}`}
                            value={item.project}
                            readOnly={!isEditing}
                            onChange={(e) => {
                              const newLedger = [...formData.workLedger];
                              newLedger[i].project = e.target.value;
                              setFormData({ ...formData, workLedger: newLedger });
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-0.5">Studio / Org</p>
                        <div className="flex items-center gap-1">
                          <input
                            className={`bg-transparent text-[10px] font-bold text-brand-primary w-full outline-none ${isEditing ? 'ring-1 ring-brand-primary/10 rounded px-0.5' : 'pointer-events-none'}`}
                            value={item.studio}
                            readOnly={!isEditing}
                            onChange={(e) => {
                              const newLedger = [...formData.workLedger];
                              newLedger[i].studio = e.target.value;
                              setFormData({ ...formData, workLedger: newLedger });
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-0.5">Your Role</p>
                        <div className="flex items-center gap-1">
                          <input
                            className={`bg-transparent text-[10px] font-bold text-brand-primary w-full outline-none ${isEditing ? 'ring-1 ring-brand-primary/10 rounded px-0.5' : 'pointer-events-none'}`}
                            value={item.role}
                            readOnly={!isEditing}
                            onChange={(e) => {
                              const newLedger = [...formData.workLedger];
                              newLedger[i].role = e.target.value;
                              setFormData({ ...formData, workLedger: newLedger });
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-0.5">Year</p>
                        <div className="flex items-center gap-1">
                          <input
                            className={`bg-transparent text-[10px] font-bold text-brand-primary w-full outline-none ${isEditing ? 'ring-1 ring-brand-primary/10 rounded px-0.5' : 'pointer-events-none'}`}
                            value={item.year}
                            readOnly={!isEditing}
                            onChange={(e) => {
                              const newLedger = [...formData.workLedger];
                              newLedger[i].year = e.target.value;
                              setFormData({ ...formData, workLedger: newLedger });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => {
                          const newLedger = formData.workLedger.filter((_: any, idx: number) => idx !== i);
                          setFormData({ ...formData, workLedger: newLedger });
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-50 text-red-400 rounded-full border border-red-100 shadow-sm"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-white border-t border-gray-100 flex items-center justify-between">
          <button onClick={onClose} className="px-8 py-3 text-sm font-bold text-text-muted hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
          <Button
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-10 py-3.5 rounded-2xl shadow-xl shadow-brand-primary/20 flex items-center gap-3 font-bold group"
            onClick={() => {
              if (!formData?.currentCTC || !formData.currentCTC.toString().trim()) {
                toast.error("Please fill in your Current CTC");
                return;
              }
              if (!formData?.expectedCTC || !formData.expectedCTC.toString().trim()) {
                toast.error("Please fill in your Expected CTC");
                return;
              }
              if (!formData?.noticePeriod || !formData.noticePeriod.toString().trim()) {
                toast.error("Please fill in your Notice Period");
                return;
              }
              onSubmit(formData);
            }}
            loading={loading}
          >
            SEND VERIFIED RESPONSE <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};


const getFileUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
};

const OpportunityDetailsModal = ({
  isOpen,
  onClose,
  opportunity,
  onAccept,
  loading
}: {
  isOpen: boolean;
  onClose: () => void;
  opportunity: any;
  onAccept: (id: number) => void;
  loading: boolean;
}) => {
  if (!isOpen || !opportunity) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 space-y-8 max-h-[90vh] overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="info" className="bg-brand-primary/5 text-brand-primary border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                  Incoming Request
                </Badge>
                <span className="text-xs text-text-muted flex items-center gap-1.5 font-medium">
                  <Clock size={14} /> Just now
                </span>
              </div>
              <div>
                <h2 className="text-4xl font-display font-black text-brand-primary tracking-tight">
                  {opportunity.engagementBrief}
                </h2>
                <p className="text-lg text-text-secondary font-medium mt-1">
                  {opportunity.studio?.studioName} <span className="mx-2 text-gray-300">•</span> {opportunity.productionType}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-text-muted"
            >
              <X size={24} />
            </button>
          </div>

          <div className={`grid grid-cols-2 ${opportunity.professionalId ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-8 py-6 border-y border-gray-100`}>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Timeline</p>
              <p className="font-bold text-brand-primary">
                {opportunity.startAvailability || opportunity.start_availability || opportunity.startDate || 'Immediate'}
              </p>
            </div>
            {!opportunity.professionalId && (
              <div className="space-y-1">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Experience</p>
                <p className="font-bold text-brand-primary">
                  {opportunity.experienceRequired || opportunity.experience_required || opportunity.experienceLevel || opportunity.experience_level || 'N/A'}
                </p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                {opportunity.professionalId ? 'Location' : 'Engagement'}
              </p>
              <p className="font-bold text-brand-primary">
                {opportunity.professionalId
                  ? (opportunity.location || 'N/A')
                  : (opportunity.engagementType || opportunity.engagement_type || opportunity.projectTimeline || opportunity.project_timeline || 'N/A')}
                {!opportunity.professionalId && opportunity.contractDuration && ` (${opportunity.contractDuration})`}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Work Mode</p>
              <p className={`font-bold flex items-center gap-1.5 ${
                (opportunity.workMode || opportunity.work_mode) === 'Remote' || (opportunity.workMode || opportunity.work_mode) === 'Hybrid'
                  ? 'text-emerald-500'
                  : 'text-brand-primary'
              }`}>
                <ShieldCheck size={14} /> {opportunity.workMode || opportunity.work_mode || 'N/A'}
              </p>
            </div>
          </div>

          <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary shadow-sm border border-gray-100">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Project Format</p>
              <p className="font-bold text-brand-primary">{opportunity.projectFormat || opportunity.project_format || 'N/A'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-primary">
              <Sparkles size={18} className="text-brand-primary" />
              <h4 className="text-xs font-black uppercase tracking-widest">Opportunity Overview</h4>
            </div>
            <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 text-text-secondary font-medium leading-relaxed">
              "{opportunity.opportunityOverview || opportunity.engagementBrief || 'You have received a direct interest request for this role.'}"
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-primary">
              <Shield size={18} className="fill-brand-primary/10" />
              <h4 className="text-xs font-black uppercase tracking-widest">Role Requirements</h4>
            </div>
            <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 text-text-secondary font-medium leading-relaxed">
              {opportunity.roleRequirements || opportunity.description || 'High-end role requirements for this position.'}
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-sm font-bold text-text-muted hover:text-brand-primary transition-colors"
          >
            Maybe Later
          </button>
          <Button
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3 rounded-2xl shadow-xl shadow-brand-primary/20 flex items-center gap-2 font-bold"
            onClick={() => onAccept(opportunity.id)}
            loading={loading}
          >
            Accept & Apply <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const LogoIconHiringOS = ({ size = 16, className = "" }: { size?: number; className?: string }) => {
  const isMuted = className.includes('text-text-muted');
  return (
    <img 
      src="/assets/logo_blck.png" 
      className={`rounded-[3px] object-contain transition-all ${isMuted ? 'opacity-40 grayscale' : 'opacity-100'}`} 
      style={{ width: size, height: size }} 
      alt="" 
    />
  );
};

const ProfessionalDashboard = ({ setView }: { setView?: (v: any) => void } = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = React.useState<any>(null);
  const [publicProfile, setPublicProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isPublicModalOpen, setIsPublicModalOpen] = React.useState(false);
  const [isOppModalOpen, setIsOppModalOpen] = React.useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = React.useState(false);
  const [selectedOpp, setSelectedOpp] = React.useState<any>(null);
  const [studioRequests, setStudioRequests] = React.useState<any[]>([]);
  const [studioJobPostings, setStudioJobPostings] = React.useState<any[]>([]);
  const [jobApplications, setJobApplications] = React.useState<any[]>([]);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [requestLoadingId, setRequestLoadingId] = React.useState<number | null>(null);
  const [isSubmittingResponse, setIsSubmittingResponse] = React.useState(false);
  const [studios, setStudios] = React.useState<any[]>([]);
  const [institutes, setInstitutes] = React.useState<any[]>([]);
  const [networkTab, setNetworkTab] = React.useState<'studios' | 'institutes'>('studios');
  const [hiringOSTab, setHiringOSTab] = React.useState<'opportunities' | 'applications' | 'engagements' | 'activity'>('opportunities');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [visibleActivitiesCount, setVisibleActivitiesCount] = React.useState(5);

  const getRelativeTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const activityItems = React.useMemo(() => {
    const items: { title: string; time: string; timestamp: number; color: string }[] = [];

    // 1. Process benched notifications
    notifications.forEach((notif) => {
      items.push({
        title: notif.message,
        time: notif.createdAt,
        timestamp: new Date(notif.createdAt).getTime(),
        color: 'bg-purple-500',
      });
    });

    // 2. Process Studio Requests
    studioRequests.forEach((req) => {
      const studioName = req.studio?.studioName || 'Studio';
      const roleTitle = req.roleTitle || req.engagementBrief || 'Creative Role';
      items.push({
        title: `${studioName} sent you a new opportunity for ${roleTitle}`,
        time: req.createdAt,
        timestamp: new Date(req.createdAt).getTime(),
        color: 'bg-purple-500',
      });
    });

    // 3. Process Job Applications
    jobApplications.forEach((app) => {
      const studioName = app.studio?.studioName || app.jobPosting?.studio?.studioName || 'Studio';
      const jobTitle = app.jobPosting?.title || 'Creative Role';

      // Always add the "Applied to..." event
      items.push({
        title: `Applied to ${studioName} for ${jobTitle}`,
        time: app.createdAt,
        timestamp: new Date(app.createdAt).getTime(),
        color: 'bg-gray-400',
      });

      // Add status changes
      if (app.status === 'shortlisted') {
        items.push({
          title: `You were shortlisted by ${studioName} for ${jobTitle}`,
          time: app.updatedAt,
          timestamp: new Date(app.updatedAt).getTime(),
          color: 'bg-emerald-500',
        });
      } else if (app.status === 'discussion') {
        items.push({
          title: `${studioName} initiated a discussion for ${jobTitle}`,
          time: app.updatedAt,
          timestamp: new Date(app.updatedAt).getTime(),
          color: 'bg-blue-500',
        });
      } else if (app.status === 'agreement') {
        items.push({
          title: `${studioName} sent an official engagement offer for ${jobTitle}`,
          time: app.updatedAt,
          timestamp: new Date(app.updatedAt).getTime(),
          color: 'bg-orange-500',
        });
      } else if (app.status === 'hired') {
        items.push({
          title: `Hired by ${studioName} for ${jobTitle}!`,
          time: app.updatedAt,
          timestamp: new Date(app.updatedAt).getTime(),
          color: 'bg-emerald-600',
        });
      } else if (app.status === 'rejected') {
        items.push({
          title: `Application for ${jobTitle} closed by ${studioName}`,
          time: app.updatedAt,
          timestamp: new Date(app.updatedAt).getTime(),
          color: 'bg-red-400',
        });
      }
    });

    // Sort by timestamp descending
    items.sort((a, b) => b.timestamp - a.timestamp);

    // Deduplicate identical titles close in time
    const uniqueItems: typeof items = [];
    const seenTitles = new Set<string>();
    items.forEach((item) => {
      const key = `${item.title}_${Math.floor(item.timestamp / 60000)}`;
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        uniqueItems.push(item);
      }
    });

    return uniqueItems;
  }, [studioRequests, jobApplications, notifications]);

  const fetchDashboardData = React.useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const [profRes, studioReqRes, studioJobRes, appRes, notifRes, studiosRes, instRes, pubProfileRes] = await Promise.all([
        getMyProfile(token),
        getStudioRequests(token),
        getStudioJobPostings(token),
        getMyApplications(token),
        getNotifications(token),
        getAllStudioProfiles(),
        searchInstitutes(token),
        getMyPublicProfile(token).catch(err => {
          console.error("Failed to fetch public profile:", err);
          return { ok: false, json: () => Promise.resolve(null) } as any;
        })
      ]);

      if (profRes.ok) {
        const data = await profRes.json();
        setProfile(data.data);
      }

      if (pubProfileRes && pubProfileRes.ok) {
        const pubData = await pubProfileRes.json();
        if (pubData && pubData.ok) {
          setPublicProfile(pubData.data);
        }
      }

      if (studioReqRes.ok) {
        const studioReqData = await studioReqRes.json();
        setStudioRequests(Array.isArray(studioReqData.data) ? studioReqData.data : []);
      }

      if (studioJobRes.ok) {
        const studioJobData = await studioJobRes.json();
        setStudioJobPostings(Array.isArray(studioJobData.data) ? studioJobData.data : []);
      }

      if (appRes.ok) {
        const appData = await appRes.json();
        const parsedData = (appData.data || []).map((app: any) => {
          let agreement = app.agreementDetails;
          if (typeof agreement === 'string') {
            try {
              agreement = JSON.parse(agreement);
            } catch (e) {
              agreement = {};
            }
          }
          return { ...app, agreementDetails: agreement };
        });
        setJobApplications(parsedData);
      }

      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(Array.isArray(notifData.data) ? notifData.data : []);
      }

      if (studiosRes.ok) {
        const studiosData = await studiosRes.json();
        setStudios(Array.isArray(studiosData.data) ? studiosData.data : []);
      }

      if (instRes.ok) {
        const instData = await instRes.json();
        setInstitutes(Array.isArray(instData.data) ? instData.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApply = async (verifiedResponse: any) => {
    const token = localStorage.getItem('token');
    if (!token || !selectedOpp) return;

    try {
      setIsSubmittingResponse(true);
      const res = await applyForJob(token, {
        jobPostingId: selectedOpp.isGlobal ? selectedOpp.id : undefined,
        studioRequestId: !selectedOpp.isGlobal ? selectedOpp.id : undefined,
        verifiedResponse
      });

      if (res.ok) {
        setIsVerificationModalOpen(false);
        setHiringOSTab('applications');
        await fetchDashboardData();
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.message || 'Failed to apply');
      }
    } catch (err) {
      console.error('Failed to apply:', err);
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const handleStudioRequestResponse = async (id: number, status: 'accepted' | 'rejected') => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setRequestLoadingId(id);
      const res = await respondToStudioRequest(token, id, { status });
      if (res.ok) {
        await fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to respond to studio request:', err);
    } finally {
      setRequestLoadingId(null);
    }
  };

  const handleAgreementResponse = async (applicationId: number, decision: 'accepted' | 'rejected') => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await respondToAgreement(token, applicationId, decision);
      if (res.ok) {
        toast.success(decision === 'accepted' ? 'Engagement accepted! Welcome aboard.' : 'Agreement declined.');
        await fetchDashboardData();
      }
    } catch (err) {
      toast.error('Failed to respond to agreement');
      console.error('Failed to respond to agreement:', err);
    }
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-12">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isProfileComplete = !!profile;
  const displayName = profile?.fullName?.split(' ')[0] || 'Professional';
  const activeSection = location.pathname.endsWith('/studio-requests')
    ? 'studio_requests'
    : location.pathname.endsWith('/jobs-by-studios')
      ? 'studio_jobs'
      : 'overview';

  const seoTitle = activeSection === 'studio_requests'
    ? 'Studio Requests'
    : activeSection === 'studio_jobs'
      ? 'Jobs by Studios'
      : 'Professional Dashboard';

  const seoDescription = activeSection === 'studio_requests'
    ? 'View hiring and collaboration requests sent by animation studios.'
    : activeSection === 'studio_jobs'
      ? 'Explore jobs and work opportunities from top animation studios.'
      : 'Manage your professional animation profile, showreels, applications, and network.';

  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords="professional dashboard, portfolio, jobs, applications, studio requests, animation work"
      />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onUpdate={fetchDashboardData}
      />
      <ManagePublicProfileModal
        isOpen={isPublicModalOpen}
        onClose={() => setIsPublicModalOpen(false)}
        onUpdate={fetchDashboardData}
        profile={profile}
      />
      <OpportunityDetailsModal
        isOpen={isOppModalOpen}
        onClose={() => setIsOppModalOpen(false)}
        opportunity={selectedOpp}
        loading={false}
        onAccept={() => {
          setIsOppModalOpen(false);
          setIsVerificationModalOpen(true);
        }}
      />
      <VerificationSheetModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        profile={profile}
        publicProfile={publicProfile}
        opportunity={selectedOpp}
        loading={isSubmittingResponse}
        onSubmit={handleApply}
      />

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 text-left">
        {!isProfileComplete && (
          <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-accent shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-brand-primary">Setup Your Professional Profile</h3>
                <p className="text-sm text-text-secondary">Complete your profile to verify your experience and attract opportunities.</p>
              </div>
            </div>
            <Button onClick={() => setIsEditModalOpen(true)} className="px-8 whitespace-nowrap shadow-sm">Complete Setup</Button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 text-left">
          <div className="space-y-3 max-w-xl text-left">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#05060b] leading-tight text-left">
              Work Hub
            </h1>
            <p className="text-[15px] text-gray-400 font-medium leading-relaxed text-left">
              Centralize your professional presence, specialized network, and active hiring lifecycle.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0 text-left">
            <button
              onClick={() => navigate(`/talent/${profile?.user?.talentId?.talentCode || ''}`)}
              disabled={!isProfileComplete}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] text-[#111827] hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm"
            >
              <ExternalLink size={14} /> View Public Profile
            </button>
            <button
              onClick={() => setIsPublicModalOpen(true)}
              disabled={!isProfileComplete}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] text-[#111827] hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm"
            >
              <Settings size={14} /> Manage Public Profile
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.18em] hover:bg-[#1f2937] transition-all shadow-md"
            >
              <Pencil size={14} /> {isProfileComplete ? 'Edit Profile' : 'Setup Profile'}
            </button>
          </div>
        </div>

        {activeSection === 'overview' && (
          <>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { label: 'Experience Score', val: `${profile?.experienceScore || 0}%`, icon: TrendingUp, trend: isProfileComplete ? '+12%' : '0%', color: 'text-brand-accent' },
            { label: 'Reliability Score', val: `${profile?.reliabilityScore || 0}%`, icon: Shield, trend: isProfileComplete ? 'Top 1%' : 'N/A', color: 'text-emerald-500' },
            { label: 'Project Count', val: (profile?.projectCount || 0).toString(), icon: Briefcase, trend: isProfileComplete ? '+2' : '0', color: 'text-brand-primary' },
            { label: 'Workshops', val: (profile?.workshopsConducted || 0).toString(), icon: GraduationCap, trend: isProfileComplete ? 'Active' : '0', color: 'text-purple-500' },
            { label: 'Mentorships', val: (profile?.mentorshipSessions || 0).toString(), icon: Users, trend: isProfileComplete ? 'Active' : '0', color: 'text-orange-500' },
            { label: 'Portfolio Reviews', val: (profile?.portfolioReviews || 0).toString(), icon: Search, trend: isProfileComplete ? 'Active' : '0', color: 'text-blue-500' },
          ].map(stat => (
            <Card key={stat.label} className="p-8 space-y-4 text-left group hover:shadow-premium transition-premium">
              <div className="flex justify-between items-start text-left">
                <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center ${stat.color} shadow-sm border border-gray-50 text-left`}>
                  <stat.icon size={24} />
                </div>
                <Badge variant="success">{stat.trend}</Badge>
              </div>
              <div className="text-left">
                <p className="text-3xl font-bold text-brand-primary text-left">{stat.val}</p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-left">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div> */}

            {/* Collaboration Invitations Section */}
            {/* {requests.filter(r => r.senderRole === 'institute').length > 0 && (
          <section className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="text-left">
                <h2 className="text-2xl font-display font-bold text-brand-primary">Collaboration Invitations</h2>
                <p className="text-sm text-text-secondary">Institutes interested in booking your services.</p>
              </div>
              <Badge variant="info">{requests.filter(r => r.senderRole === 'institute' && r.status === 'pending').length} NEW</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.filter(r => r.senderRole === 'institute').map((req) => (
                <Card key={req.id} className={`p-6 space-y-4 border-l-4 ${req.status === 'accepted' ? 'border-l-emerald-500' : req.status === 'rejected' ? 'border-l-red-500' : 'border-l-brand-accent shadow-premium'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-surface rounded-lg flex items-center justify-center text-brand-primary font-bold">
                        {req.institute?.instituteName?.[0]}
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-brand-primary">{req.institute?.instituteName}</h4>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider">{req.proposedDate}</p>
                      </div>
                    </div>
                    <Badge variant={req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'warning' : 'warning'}>
                      {req.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-secondary italic">"{req.message}"</p>
                  
                  {req.publicUrl && (
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        className="w-full py-1.5 text-xs font-bold gap-2"
                        onClick={() => {
                          const url = req.publicUrl.startsWith('http') 
                            ? req.publicUrl 
                            : req.publicUrl.includes('/') 
                              ? `${window.location.origin}/${req.publicUrl}`
                              : `https://${req.publicUrl}`;
                          window.open(url, '_blank');
                        }}
                      >
                        <ArrowRight size={14} /> View Institute URL
                      </Button>
                    </div>
                  )}

                  {req.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button variant="secondary" className="flex-1 py-1 text-xs" onClick={() => handleRespond(req.id, 'rejected')}>Decline</Button>
                      <Button className="flex-1 py-1 text-xs" onClick={() => handleRespond(req.id, 'accepted')}>Accept</Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )} */}

            <section className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-[#000000] text-[#FFFFFF] rounded-2xl flex items-center justify-center shadow-sm">
                  <Globe size={24} />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-black text-brand-primary">Network</h2>
                  <p className="text-sm text-text-secondary">Explore top studios and institutes in the creative industry</p>
                </div>
              </div>

              <div className="flex w-full gap-2 p-1 bg-gray-100/50 rounded-xl">
                <button
                  onClick={() => setNetworkTab('studios')}
                  className={`flex-1 px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all text-center ${networkTab === 'studios'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Studios
                </button>
                <button
                  onClick={() => setNetworkTab('institutes')}
                  className={`flex-1 px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all text-center ${networkTab === 'institutes'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Institutes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {networkTab === 'studios' ? (
                  studios.length > 0 ? (
                    studios.slice(0, 6).map((studio) => (
                      <Card key={studio.id} className="p-6 group hover:shadow-premium transition-premium border-gray-100">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white font-bold text-xl overflow-hidden flex-shrink-0">
                            {studio.logo ? (
                              <img src={getFileUrl(studio.logo)} alt={studio.name} className="w-full h-full object-contain" />
                            ) : (
                              studio.name?.substring(0, 2).toUpperCase() || 'ST'
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-brand-primary truncate">{studio.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                              <MapPin size={12} />
                              <span className="truncate">{studio.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                            {studio.specialty || 'VFX & ANIMATION'}
                          </span>
                          <button
                            onClick={() => navigate(`/talent/${studio.talentCode}`)}
                            className="text-brand-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                          >
                            Explore <ChevronRight size={16} />
                          </button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full py-12 bg-brand-surface/30 rounded-3xl border border-dashed border-gray-200 text-center">
                      <p className="text-sm text-text-muted">No studios available at the moment.</p>
                    </div>
                  )
                ) : (
                  institutes.length > 0 ? (
                    institutes.slice(0, 6).map((inst) => (
                      <Card key={inst.id} className="p-6 group hover:shadow-premium transition-premium border-gray-100">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-brand-surface rounded-2xl flex items-center justify-center text-brand-primary font-bold text-xl overflow-hidden flex-shrink-0">
                            {inst.logo ? (
                              <img src={getFileUrl(inst.logo)} alt={inst.instituteName} className="w-full h-full object-contain" />
                            ) : (
                              <img src={`https://ui-avatars.com/api/?name=${inst.instituteName}&background=F5F7FF&color=4F46E5`} alt={inst.instituteName} className="w-full h-full object-contain" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-brand-primary truncate">{inst.instituteName}</h3>
                            <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                              <MapPin size={12} />
                              <span className="truncate">{inst.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1">
                            <Users size={12} /> {inst.studentCount || '5,000+'} students
                          </span>
                          <button
                            onClick={() => inst.user?.talentId?.talentCode && navigate(`/talent/${inst.user.talentId.talentCode}`)}
                            className="text-brand-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                          >
                            View Portal <ChevronRight size={16} />
                          </button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full py-12 bg-brand-surface/30 rounded-3xl border border-dashed border-gray-200 text-center">
                      <p className="text-sm text-text-muted">No institutes available at the moment.</p>
                    </div>
                  )
                )}
              </div>
            </section>

            <section className="space-y-8 text-left pt-12 border-t border-gray-100">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Briefcase size={24} />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-display font-bold text-brand-primary">Hiring OS</h2>
                  <p className="text-sm text-text-secondary">Tracking your complete professional hiring lifecycle</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex bg-gray-50/50 p-1 rounded-2xl border border-gray-100 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'opportunities', label: 'Opportunities', icon: Sparkles, count: studioRequests.length + studioJobPostings.length },
                    { id: 'applications', label: 'Applications', icon: Layers, count: jobApplications.length },
                    { id: 'engagements', label: 'Engagements', icon: Briefcase, count: jobApplications.filter(a => a.status === 'hired' || a.status === 'agreement').length },
                    { id: 'activity', label: 'Activity Hub', icon: Activity, count: activityItems.length },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setHiringOSTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${hiringOSTab === tab.id
                          ? 'bg-white text-brand-primary shadow-sm border border-gray-100'
                          : 'text-text-muted hover:text-brand-primary'
                        }`}
                    >
                      <tab.icon size={16} className={hiringOSTab === tab.id ? 'text-brand-primary' : 'text-text-muted'} />
                      {tab.label}
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${hiringOSTab === tab.id ? 'bg-brand-primary/10 text-brand-primary' : 'bg-gray-200 text-text-muted'
                        }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-48"
                    />
                  </div>
                  <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Filter size={18} className="text-text-muted" />
                  </button>
                </div>
              </div>

              <div className="min-h-[400px]">
                {hiringOSTab === 'opportunities' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Direct Studio Requests */}
                    {studioRequests.map((request) => (
                      <Card key={`request-${request.id}`} className="p-8 space-y-6 relative overflow-hidden group hover:shadow-premium transition-premium border-[#7c00ff]/10 bg-gradient-to-br from-white to-[#7c00ff]/[0.02] flex flex-col justify-between h-full">
                        <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                          <motion.div
                            animate={{
                              scale: [1, 1.05, 1],
                              opacity: [0.9, 1, 0.9]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="flex flex-col items-end gap-1"
                          >
                            <Badge variant="info" className="bg-[#7c00ff] text-purple border-none text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-xl shadow-lg shadow-[#7c00ff]/30">
                              Studio Request
                            </Badge>
                            <div className="flex items-center gap-1.5 mr-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#7c00ff] animate-pulse" />
                              <span className="text-[9px] font-black text-[#7c00ff] uppercase tracking-widest"># Direct Opportunity</span>
                            </div>
                          </motion.div>
                        </div>

                        <div className="space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-brand-accent">
                              <Sparkles size={14} className="text-brand-accent" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Incoming Interest</span>
                            </div>

                            <div>
                              <h3 className="text-2xl font-bold text-brand-primary">{request.studio?.studioName || 'Movement Studio'}</h3>
                              <p className="text-text-secondary font-medium">
                                {request.roleTitle || 'Creative Role'} <span className="mx-2 text-gray-300">•</span> {request.productionType || 'Animation'}
                              </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl italic text-sm text-text-secondary border border-gray-100/50 min-h-[80px] flex items-center">
                              "{request.opportunityOverview || request.engagementBrief || 'You have received a direct interest request for this role.'}"
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50 mt-auto">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-text-muted">
                                <Clock size={14} />
                              </div>
                              <div className="text-left">
                                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Starts</p>
                                <p className="text-xs font-bold text-brand-primary uppercase">{request.startDate || request.startAvailability || 'Immediate'}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                className="text-xs font-bold text-text-muted hover:text-brand-primary transition-colors uppercase tracking-wider"
                                onClick={() => {
                                  setSelectedOpp(request);
                                  setIsOppModalOpen(true);
                                }}
                              >
                                View Details
                              </button>
                              <Button
                                className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-brand-primary/10 flex items-center gap-2 group text-xs font-bold"
                                onClick={() => {
                                  setSelectedOpp(request);
                                  setIsVerificationModalOpen(true);
                                }}
                                loading={requestLoadingId === request.id}
                              >
                                Accept & Apply <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {/* Global Studio Job Postings */}
                    {studioJobPostings.map((job) => (
                      <Card key={`job-${job.id}`} className="p-8 space-y-6 relative overflow-hidden group hover:shadow-premium transition-premium flex flex-col justify-between h-full">
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-white border-gray-100 text-[8px] uppercase tracking-widest font-black px-2 py-1 rounded-md text-gray-900">Studio Post</Badge>
                        </div>

                        <div className="space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-brand-accent">
                              <Sparkles size={14} className="text-brand-accent" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Incoming Interest</span>
                            </div>

                            <div>
                              <h3 className="text-2xl font-bold text-brand-primary">{job.studio?.studioName || 'Movement Studio'}</h3>
                              <p className="text-text-secondary font-medium">
                                {job.title} <span className="mx-2 text-gray-300">•</span> {job.productionType || job.projectType || 'Feature Film'}
                              </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl italic text-sm text-text-secondary border border-gray-100/50 min-h-[80px] flex items-center">
                              "{job.opportunityOverview || job.description || 'Join a world-class team working on a major project.'}"
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50 mt-auto">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-text-muted">
                                <Clock size={14} />
                              </div>
                              <div className="text-left">
                                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Starts</p>
                                <p className="text-xs font-bold text-brand-primary uppercase">{job.startDate || job.requiredAvailability || 'Immediate'}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                className="text-xs font-bold text-text-muted hover:text-brand-primary transition-colors uppercase tracking-wider"
                                onClick={() => {
                                  setSelectedOpp({ ...job, isGlobal: true });
                                  setIsOppModalOpen(true);
                                }}
                              >
                                View Details
                              </button>
                              <Button
                                className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-brand-primary/10 flex items-center gap-2 group text-xs font-bold"
                                onClick={() => {
                                  setSelectedOpp({ ...job, isGlobal: true });
                                  setIsVerificationModalOpen(true);
                                }}
                              >
                                Accept & Apply <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {studioRequests.length === 0 && studioJobPostings.length === 0 && (
                      <div className="col-span-full py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 text-center">
                        <p className="text-text-muted font-medium">No incoming interests at the moment.</p>
                      </div>
                    )}
                  </div>
                )}

                {hiringOSTab === 'applications' && (
                  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                          <th className="px-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Studio & Role</th>
                          <th className="px-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Applied</th>
                          <th className="px-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Hiring Lifecycle</th>
                          <th className="px-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {jobApplications
                          .map((app, i) => {
                            const statusMap: Record<string, { label: string; progress: number; color: string }> = {
                              applied: { label: 'APPLIED', progress: 1, color: 'bg-gray-500' },
                              shortlisted: { label: 'SHORTLISTED', progress: 2, color: 'bg-emerald-500' },
                              discussion: { label: 'DISCUSSION', progress: 3, color: 'bg-blue-500' },
                              agreement: { label: 'AGREEMENT', progress: 4, color: 'bg-purple-500' },
                              hired: { label: 'HIRED', progress: 5, color: 'bg-brand-primary' },
                              rejected: { label: 'REJECTED', progress: 0, color: 'bg-red-500' },
                            };
                            const displayStatus = app.status === 'applied' && app.studioRequestId ? 'shortlisted' : app.status;
                            const currentStatus = statusMap[displayStatus] || { label: displayStatus.toUpperCase(), progress: 1, color: 'bg-gray-500' };

                            return (
                              <tr key={app.id} className="hover:bg-gray-50/30 transition-colors">
                                <td className="px-8 py-6">
                                  <p className="font-bold text-brand-primary">{app.studio?.studioName || 'Studio'}</p>
                                  <p className="text-xs text-text-secondary">{app.jobPosting?.title || app.studioRequest?.roleTitle || 'Creative Role'}</p>
                                </td>
                                <td className="px-8 py-6 text-sm text-text-secondary font-medium">
                                  {new Date(app.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6">
                                  <div className="space-y-2">
                                    <span className={`text-[10px] font-black text-white ${currentStatus.color} px-2 py-1 rounded-md`}>
                                      {currentStatus.label}
                                    </span>
                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map(step => (
                                        <div key={step} className={`h-1 w-6 rounded-full ${step <= currentStatus.progress ? currentStatus.color : 'bg-gray-100'}`} />
                                      ))}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  {app.status === 'agreement' && app.artistDecision === 'pending' ? (
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => handleAgreementResponse(app.id, 'rejected')}
                                        className="text-[10px] font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100"
                                      >
                                        Decline
                                      </button>
                                      <button
                                        onClick={() => handleAgreementResponse(app.id, 'accepted')}
                                        className="text-[10px] font-bold text-white bg-brand-primary hover:bg-brand-primary/90 px-3 py-1.5 rounded-lg shadow-sm"
                                      >
                                        Accept & Sign
                                      </button>
                                    </div>
                                  ) : (
                                    <button className="text-xs font-bold text-brand-primary hover:underline">View Status</button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        {jobApplications.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-8 py-12 text-center text-text-muted font-medium">
                              No active applications at the moment.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {hiringOSTab === 'engagements' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {jobApplications
                      .filter(a => a.status === 'hired' || a.status === 'agreement')
                      .map((app) => {
                        const eng = app.agreementDetails || {};
                        const isNewOffer = app.status === 'agreement' && app.artistDecision === 'pending';

                        return (
                          <Card key={app.id} className={`p-8 space-y-6 border-2 transition-all ${!isNewOffer ? 'border-gray-100' : 'border-[#7c00ff]/20 bg-[#7c00ff]/[0.02] shadow-xl shadow-[#7c00ff]/5'}`}>
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant={!isNewOffer ? 'success' : 'info'}
                                  className={`text-[10px] font-black tracking-widest ${isNewOffer ? 'bg-[#7c00ff] text-white' : 'bg-emerald-500 text-white'}`}
                                >
                                  {!isNewOffer ? 'ACTIVE' : 'OFFER RECEIVED'}
                                </Badge>
                                <span className="text-xs text-text-muted font-medium">Est. Start: {eng.startDate || 'TBD'}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Comp Details</p>
                                <p className="text-2xl font-black text-brand-primary">
                                  {eng.currency?.includes('(') ? eng.currency.split('(')[1].replace(')', '') : '$'}{eng.amount || '0'}
                                  <span className="text-xs text-gray-400 font-bold ml-1">/{eng.compensationType === 'Monthly' ? 'mo' : 'yr'}</span>
                                </p>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h3 className="text-2xl font-black text-brand-primary">
                                {app.studio?.studioName || 'Studio'}
                              </h3>
                              <p className="text-text-secondary font-medium">
                                {app.jobPosting?.title || app.studioRequest?.roleTitle || 'Creative Role'}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-text-muted font-bold pt-1">
                                <span className="flex items-center gap-1.5"><Clock size={14} /> {eng.duration || 'N/A'}</span>
                                <span className="flex items-center gap-1.5"><Layers size={14} /> {eng.type || 'Contract'}</span>
                              </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                              {!isNewOffer ? (
                                <>
                                  <div className="flex items-center gap-2 text-emerald-600">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                      <ShieldCheck size={14} />
                                    </div>
                                    <span className="text-xs font-bold">Engagement Active & Verified</span>
                                  </div>
                                  <Button variant="secondary" className="bg-white border border-gray-200 text-brand-primary font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                                    Open Workspace <ChevronRight size={16} />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 text-[#7c00ff]">
                                    <Sparkles size={16} />
                                    <span className="text-xs font-bold">Action Required: Review Terms</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => handleAgreementResponse(app.id, 'rejected')}
                                      className="text-sm font-bold text-gray-400 px-4 py-2 hover:text-rose-500 transition-colors"
                                    >
                                      Decline
                                    </button>
                                    <Button
                                      onClick={() => handleAgreementResponse(app.id, 'accepted')}
                                      className="bg-black text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/20"
                                    >
                                      Accept & Sign
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          </Card>
                        );
                      })}

                    {jobApplications.filter(a => a.status === 'hired' || a.status === 'agreement').length === 0 && (
                      <div className="col-span-full py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 text-center">
                        <p className="text-text-muted font-medium">No active engagements or pending agreements.</p>
                      </div>
                    )}
                  </div>
                )}

                {hiringOSTab === 'activity' && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                    <div className="space-y-10 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                      {activityItems.slice(0, visibleActivitiesCount).map((item, i) => (
                        <div key={i} className="flex gap-6 relative pl-8 group">
                          <div className={`absolute left-0 top-2 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-2 ring-transparent group-hover:ring-gray-100 transition-all ${item.color}`} />
                          <div className="space-y-1">
                            <p className="font-bold text-brand-primary">{item.title}</p>
                            <p className="text-xs text-text-muted font-medium flex items-center gap-1.5">
                              <Clock size={12} /> {getRelativeTime(item.time)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {activityItems.length === 0 && (
                        <div className="py-12 text-center text-text-muted font-medium">
                          No recent activity in the hub.
                        </div>
                      )}
                    </div>
                    {activityItems.length > visibleActivitiesCount && (
                      <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center">
                        <button
                          onClick={() => setVisibleActivitiesCount(prev => prev + 5)}
                          className="px-6 py-2.5 bg-white hover:bg-gray-50 text-brand-primary border border-gray-200 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                        >
                          View More Activity
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </>
        )}



        {activeSection === 'studio_requests' && (
          <section className="space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-brand-primary">Studio Request</h2>
                <p className="text-sm text-text-secondary">Requests sent by studios that added you to their bench.</p>
              </div>
              <Badge variant="info">{studioRequests.filter((item) => item.status === 'pending').length} Pending</Badge>
            </div>

            {studioRequests.length === 0 ? (
              <div className="p-12 bg-brand-surface/30 rounded-brand border border-dashed border-gray-200 text-center space-y-3">
                <p className="text-sm font-bold text-brand-primary">No studio requests yet</p>
                <p className="text-xs text-text-secondary">When studios approach you, their requests will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {studioRequests.map((request) => (
                  <Card key={request.id} className="p-6 space-y-4 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.24em] text-text-muted font-bold">{request.studio?.studioName || 'Studio'}</p>
                        <h3 className="text-xl font-bold text-brand-primary mt-1">{request.engagementBrief}</h3>
                      </div>
                      <Badge variant={request.status === 'accepted' ? 'success' : request.status === 'rejected' ? 'warning' : 'info'}>
                        {request.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-text-secondary">
                      <div><span className="font-semibold text-brand-primary">Timeline:</span> {request.projectTimeline}</div>
                      <div><span className="font-semibold text-brand-primary">Type:</span> {request.productionType}</div>
                      <div><span className="font-semibold text-brand-primary">Budget:</span> {request.proposedBudget || 'Not shared'}</div>
                      <div><span className="font-semibold text-brand-primary">Start:</span> {request.startDate || 'Flexible'}</div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="secondary"
                          className="flex-1 text-xs uppercase tracking-[0.15em]"
                          loading={requestLoadingId === request.id}
                          onClick={() => handleStudioRequestResponse(request.id, 'rejected')}
                        >
                          Reject
                        </Button>
                        <Button
                          className="flex-1 text-xs uppercase tracking-[0.15em]"
                          loading={requestLoadingId === request.id}
                          onClick={() => handleStudioRequestResponse(request.id, 'accepted')}
                        >
                          Accept
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}

        {activeSection === 'studio_jobs' && (
          <section className="space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-brand-primary">Jobs by Studios</h2>
                <p className="text-sm text-text-secondary">Browse openings posted by studios.</p>
              </div>
              <Badge variant="info">{studioJobPostings.length} Openings</Badge>
            </div>

            {studioJobPostings.length === 0 ? (
              <div className="p-12 bg-brand-surface/30 rounded-brand border border-dashed border-gray-200 text-center space-y-3">
                <p className="text-sm font-bold text-brand-primary">No job postings yet</p>
                <p className="text-xs text-text-secondary">Studio job postings will show up here when available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {studioJobPostings.map((job) => (
                  <Card key={job.id} className="p-6 space-y-4 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.24em] text-text-muted font-bold">{job.studio?.studioName || 'Studio'}</p>
                        <h3 className="text-xl font-bold text-brand-primary mt-1">{job.title}</h3>
                      </div>
                      <Badge variant={job.status === 'open' ? 'success' : 'warning'}>{job.status}</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-text-secondary">
                      <div><span className="font-semibold text-brand-primary">Project:</span> {job.projectType || '-'}</div>
                      <div><span className="font-semibold text-brand-primary">Experience:</span> {job.experienceRequired || '-'}</div>
                      <div><span className="font-semibold text-brand-primary">Artists:</span> {job.artistCount}</div>
                      <div><span className="font-semibold text-brand-primary">Start:</span> {job.startDate || '-'}</div>
                    </div>

                    {job.description && <p className="text-sm text-text-secondary leading-relaxed">{job.description}</p>}
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default ProfessionalDashboard;
