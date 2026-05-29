import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  X,
  Calendar,
  Users,
  Clock,
  Briefcase,
  Search,
  Edit2,
  UserPlus,
  ChevronRight,
  ChevronLeft,
  Info,
  CheckCircle2,
  MapPin,
  Globe,
  Lock,
  UploadCloud,
  Check,
  ShieldCheck,
  BarChart
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from './Button';
import Card from './Card';
import Badge from './Badge';
import { useNavigate } from 'react-router-dom';
import HiringPipeline from './HiringPipeline';
import { createStudioJobPosting, getStudioJobPostings, updateStudioJobPosting, deleteStudioJobPosting, uploadJobPostingAttachments } from '../services/studioServices';
import { BASE_URL } from '../utils/urls';

interface JobPosting {
  id: number;
  title: string;
  projectType?: string;
  experienceRequired?: string;
  artistCount: number;
  startDate?: string;
  description?: string;
  status: 'open' | 'paused' | 'closed';
  productionType?: string;
  projectFormat?: string;
  engagementType?: string;
  workMode?: string;
  locationPreference?: string;
  timeZonePreference?: string;
  requiredAvailability?: string;
  opportunityOverview?: string;
  softwareTools?: any;
  experienceLevel?: string;
  hiringDeadline?: string;
  internalNotes?: string;
  contractDuration?: string;
  filledCount?: number;
  customProductionType?: string;
  customProjectFormat?: string;
  customTimeZone?: string;
  verificationFields?: Record<string, boolean>;
  attachments?: string[];
}

interface HiringByStudioProps {
  onInviteFromBench?: (job: any) => void;
  onSearchTalent?: () => void;
}

const HiringByStudio: React.FC<HiringByStudioProps> = ({ onInviteFromBench, onSearchTalent }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<[string, string][]>([]);
  const [viewingPipeline, setViewingPipeline] = useState<{ id: number; title: string } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const TIME_ZONES = [
    'No Preference',
    'UTC (Universal Coordinated Time)',
    'IST (India Standard Time)',
    'EST (Eastern Standard Time)',
    'CST (Central Standard Time)',
    'MST (Mountain Standard Time)',
    'PST (Pacific Standard Time)',
    'GMT (Greenwich Mean Time)',
    'CET (Central European Time)',
    'JST (Japan Standard Time)',
    'AEST (Australian Eastern Standard Time)',
    'Other'
  ];

  const fetchCountries = useCallback(async () => {
    try {
      const response = await fetch('https://liveapi.in/geo/country/');
      if (response.ok) {
        const data = await response.json();
        setCountries(Object.entries(data));
      }
    } catch (err) {
      console.error('Failed to fetch countries:', err);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const [formData, setFormData] = useState({
    title: '',
    productionType: '',
    projectFormat: '',
    engagementType: 'Full Time (Employee)',
    workMode: 'Hybrid',
    locationPreference: 'Worldwide',
    timeZonePreference: 'No Preference',
    requiredAvailability: 'Immediate',
    roleRequirements: '',
    opportunityOverview: '',
    softwareTools: '',
    experienceLevel: '',
    requiredExperience: '',
    positionsCount: 1,
    hiringDeadline: '',
    internalNotes: '',
    customProductionType: '',
    customProjectFormat: '',
    contractDuration: '',
    customTimeZone: '',
    verificationFields: {
      name: true,
      primarySkill: true,
      position: true,
      experience: true,
      currentCompany: true,
      currentCTC: true,
      expectedCTC: true,
      noticePeriod: true,
      location: true,
      relocationPreference: true,
      showreel: true,
      workLedger: true
    }
  });

  const token = localStorage.getItem('token');

  const fetchJobs = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await getStudioJobPostings(token);
      if (response.ok) {
        const payload = await response.json();
        setJobs(Array.isArray(payload?.data) ? payload.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectOption = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleVerificationField = (field: string) => {
    setFormData(prev => ({
      ...prev,
      verificationFields: {
        ...prev.verificationFields,
        //@ts-ignore
        [field]: !prev.verificationFields[field]
      }
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!token) return;
    if (!formData.title) {
      toast.error('Role title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createStudioJobPosting(token, {
        title: formData.title,
        productionType: formData.productionType === 'Other' ? formData.customProductionType : formData.productionType,
        projectFormat: formData.projectFormat === 'Other' ? formData.customProjectFormat : formData.projectFormat,
        engagementType: formData.engagementType,
        workMode: formData.workMode,
        locationPreference: formData.locationPreference,
        timeZonePreference: formData.timeZonePreference === 'Other' ? formData.customTimeZone : formData.timeZonePreference,
        requiredAvailability: formData.requiredAvailability,
        description: formData.roleRequirements,
        opportunityOverview: formData.opportunityOverview,
        softwareTools: formData.softwareTools.split(',').map(s => s.trim()),
        experienceLevel: formData.experienceLevel,
        requiredExperience: formData.requiredExperience,
        artistCount: formData.positionsCount,
        startDate: formData.hiringDeadline,
        internalNotes: formData.internalNotes,
        contractDuration: formData.engagementType === 'Short Term/Contract' ? formData.contractDuration : null,
        verificationFields: formData.verificationFields,
        status: 'open',
      });

      if (response.ok) {
        const payload = await response.json();
        const newJobId = payload?.data?.id;

        // Upload attachments if any files were selected
        if (selectedFiles.length > 0 && newJobId) {
          try {
            const uploadRes = await uploadJobPostingAttachments(token, newJobId, selectedFiles);
            if (!uploadRes.ok) {
              toast.warning('Role created but some attachments failed to upload');
            }
          } catch (uploadErr) {
            console.error('Failed to upload attachments:', uploadErr);
          }
        }

        toast.success('Role posted successfully');
        setIsModalOpen(false);
        setCurrentStep(1);
        setSelectedFiles([]);
        setFormData({
          title: '',
          productionType: '',
          projectFormat: '',
          engagementType: 'Full Time (Employee)',
          workMode: 'Hybrid',
          locationPreference: 'Worldwide',
          timeZonePreference: 'No Preference',
          requiredAvailability: 'Immediate',
          roleRequirements: '',
          opportunityOverview: '',
          softwareTools: '',
          experienceLevel: '',
          requiredExperience: '',
          positionsCount: 1,
          hiringDeadline: '',
          internalNotes: '',
          customProductionType: '',
          customProjectFormat: '',
          contractDuration: '',
          customTimeZone: '',
          verificationFields: {
            name: true,
            primarySkill: true,
            position: true,
            experience: true,
            currentCompany: true,
            currentCTC: true,
            expectedCTC: true,
            noticePeriod: true,
            location: true,
            relocationPreference: true,
            showreel: true,
            workLedger: true
          }
        });
        fetchJobs();
      } else {
        const body = await response.json();
        toast.error(body?.message || 'Failed to post role');
      }
    } catch (err) {
      console.error('Failed to post role:', err);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenNote = (note: string) => {
    setSelectedNote(note);
    setIsNoteModalOpen(true);
  };

  const handleOpenEditModal = (job: any) => {
    const predefinedProductionTypes = ['Feature Film', 'TV Series / OTT', 'Short Film', 'VFX', 'Commercial'];
    const predefinedProjectFormats = ['3D', '2D', 'VFX'];

    // Normalize data from API (handle both camelCase and snake_case)
    const normalizedJob: JobPosting = {
      ...job,
      productionType: job.productionType || job.production_type,
      projectFormat: job.projectFormat || job.project_format,
      engagementType: job.engagementType || job.engagement_type,
      workMode: job.workMode || job.work_mode,
      locationPreference: job.locationPreference || job.location_preference,
      timeZonePreference: job.timeZonePreference || job.time_zone_preference,
      requiredAvailability: job.requiredAvailability || job.required_availability,
      opportunityOverview: job.opportunityOverview || job.opportunity_overview,
      softwareTools: job.softwareTools || job.software_tools,
      experienceLevel: job.experienceLevel || job.experience_level || job.experienceRequired || job.experience_required,
      hiringDeadline: job.hiringDeadline || job.hiring_deadline || job.startDate || job.start_date,
      internalNotes: job.internalNotes || job.internal_notes,
      contractDuration: job.contractDuration || job.contract_duration,
      verificationFields: job.verificationFields || job.verification_fields || {
        name: true, primarySkill: true, position: true, experience: true,
        currentCompany: true, currentCTC: true, expectedCTC: true, noticePeriod: true,
        location: true, relocationPreference: true, showreel: true, workLedger: true
      }
    };

    setEditingJob({
      ...normalizedJob,
      productionType: predefinedProductionTypes.includes(normalizedJob.productionType || '') ? normalizedJob.productionType : (normalizedJob.productionType ? 'Other' : ''),
      customProductionType: predefinedProductionTypes.includes(normalizedJob.productionType || '') ? '' : normalizedJob.productionType,
      projectFormat: predefinedProjectFormats.includes(normalizedJob.projectFormat || '') ? normalizedJob.projectFormat : (normalizedJob.projectFormat ? 'Other' : ''),
      customProjectFormat: predefinedProjectFormats.includes(normalizedJob.projectFormat || '') ? '' : normalizedJob.projectFormat,
      timeZonePreference: TIME_ZONES.includes(normalizedJob.timeZonePreference || '') ? normalizedJob.timeZonePreference : (normalizedJob.timeZonePreference ? 'Other' : 'No Preference'),
      customTimeZone: TIME_ZONES.includes(normalizedJob.timeZonePreference || '') ? '' : normalizedJob.timeZonePreference,
      softwareTools: Array.isArray(normalizedJob.softwareTools) ? normalizedJob.softwareTools.join(', ') : normalizedJob.softwareTools || '',
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteRole = async (jobId: number) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to permanently delete this role?')) return;

    try {
      const response = await deleteStudioJobPosting(token, jobId);
      if (response.ok) {
        toast.success('Role deleted successfully');
        setIsEditModalOpen(false);
        fetchJobs();
      } else {
        const body = await response.json();
        toast.error(body?.message || 'Failed to delete role');
      }
    } catch (err) {
      console.error('Failed to delete role:', err);
      toast.error('Something went wrong');
    }
  };

  const handleUpdateRole = async () => {
    if (!token || !editingJob) return;

    try {
      setIsSubmitting(true);
      const dataToUpdate = {
        ...editingJob,
        productionType: editingJob.productionType === 'Other' ? editingJob.customProductionType : editingJob.productionType,
        projectFormat: editingJob.projectFormat === 'Other' ? editingJob.customProjectFormat : editingJob.projectFormat,
        timeZonePreference: editingJob.timeZonePreference === 'Other' ? editingJob.customTimeZone : editingJob.timeZonePreference,
        softwareTools: typeof editingJob.softwareTools === 'string'
          ? editingJob.softwareTools.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '')
          : editingJob.softwareTools,
        experienceRequired: editingJob.experienceLevel,
      };

      const response = await updateStudioJobPosting(token, editingJob.id, dataToUpdate);

      if (response.ok) {
        toast.success('Role updated successfully');
        setIsEditModalOpen(false);
        setEditingJob(null);
        fetchJobs();
      } else {
        const body = await response.json();
        toast.error(body?.message || 'Failed to update role');
      }
    } catch (err) {
      console.error('Failed to update role:', err);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = (stepNum?: number) => {
    switch (stepNum ?? currentStep) {
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">01</div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Role Details</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Role Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Character Animator"
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Production Type *</label>
                <div className="flex flex-wrap gap-2">
                  {['Feature Film', 'TV Series / OTT', 'Short Film', 'VFX', 'Commercial', 'Other'].map(type => (
                    <button
                      key={type}
                      onClick={() => handleSelectOption('productionType', type)}
                      className={`px-6 py-3 rounded-full text-xs font-bold transition-all border ${formData.productionType === type
                        ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {formData.productionType === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4"
                  >
                    <input
                      type="text"
                      name="customProductionType"
                      value={formData.customProductionType}
                      onChange={handleInputChange}
                      placeholder="Specify production type..."
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                    />
                  </motion.div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Project Format *</label>
                <div className="flex flex-wrap gap-2">
                  {['3D', '2D', 'VFX', 'Other'].map(format => (
                    <button
                      key={format}
                      onClick={() => handleSelectOption('projectFormat', format)}
                      className={`px-8 py-3 rounded-full text-xs font-bold transition-all border ${formData.projectFormat === format
                        ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
                {formData.projectFormat === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4"
                  >
                    <input
                      type="text"
                      name="customProjectFormat"
                      value={formData.customProjectFormat}
                      onChange={handleInputChange}
                      placeholder="Specify project format..."
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                    />
                  </motion.div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Engagement Type *</label>
                <div className="flex gap-2">
                  {['Full Time (Employee)', 'Short Term/Contract'].map(type => (
                    <button
                      key={type}
                      onClick={() => handleSelectOption('engagementType', type)}
                      className={`flex-1 py-4 rounded-2xl text-xs font-bold transition-all border ${formData.engagementType === type
                        ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              {formData.engagementType === 'Short Term/Contract' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Contract Duration *</label>
                  <input
                    type="text"
                    name="contractDuration"
                    value={formData.contractDuration}
                    onChange={handleInputChange}
                    placeholder="e.g. 3 Months, 6 Months"
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                  />
                </motion.div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">02</div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Work Setup</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Work Mode *</label>
                <div className="flex gap-2">
                  {['On-site', 'Hybrid', 'Remote'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => handleSelectOption('workMode', mode)}
                      className={`flex-1 py-4 rounded-2xl text-xs font-bold transition-all border ${formData.workMode === mode
                        ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Location Preference</label>
                  <select
                    name="locationPreference"
                    value={formData.locationPreference}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium appearance-none"
                  >
                    <option value="Worldwide">Worldwide</option>
                    {countries.map(([code, name]) => (
                      <option key={code} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Time Zone Preference</label>
                  <select
                    name="timeZonePreference"
                    value={formData.timeZonePreference}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium appearance-none"
                  >
                    {TIME_ZONES.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>
              {formData.timeZonePreference === 'Other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4"
                >
                  <input
                    type="text"
                    name="customTimeZone"
                    value={formData.customTimeZone || ''}
                    onChange={handleInputChange}
                    placeholder="Specify time zone..."
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                  />
                </motion.div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">03</div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Availability</h3>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Required Availability *</label>
              <div className="grid grid-cols-2 gap-2">
                {['Immediate', 'Within 1 Month', 'Flexible'].map(avail => (
                  <button
                    key={avail}
                    onClick={() => handleSelectOption('requiredAvailability', avail)}
                    className={`py-4 rounded-2xl text-xs font-bold transition-all border ${formData.requiredAvailability === avail
                      ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {avail}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">04</div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Requirements</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Role Requirements *</label>
                <textarea
                  name="roleRequirements"
                  value={formData.roleRequirements}
                  onChange={handleInputChange}
                  placeholder="Describe the type of work, shot complexity, responsibilities, and expectations."
                  rows={4}
                  className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Opportunity Overview *</label>
                <textarea
                  name="opportunityOverview"
                  value={formData.opportunityOverview}
                  onChange={handleInputChange}
                  placeholder="Briefly describe the project, company culture, and why this role is exciting."
                  rows={3}
                  className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Software / Tools</label>
                <input
                  type="text"
                  name="softwareTools"
                  value={formData.softwareTools}
                  onChange={handleInputChange}
                  placeholder="e.g. Maya, Houdini, Nuke, Unreal (Press Enter)"
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">05</div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Experience</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Experience Level *</label>
                <div className="flex flex-wrap gap-2">
                  {['Fresher (0 Years)', 'Junior (1–2 Years)', 'Mid (3–6 Years)', 'Senior (7+ Years)', 'Any Level'].map(level => {
                    const selected = formData.experienceLevel.split(',').map(s => s.trim()).filter(Boolean);
                    const isSelected = selected.includes(level);
                    return (
                      <button
                        key={level}
                        onClick={() => {
                          const current = formData.experienceLevel.split(',').map(s => s.trim()).filter(Boolean);
                          let next: string[];
                          if (level === 'Any Level') {
                            next = isSelected ? [] : ['Any Level'];
                          } else {
                            next = isSelected
                              ? current.filter(l => l !== level)
                              : [...current.filter(l => l !== 'Any Level'), level];
                          }
                          setFormData(prev => ({ ...prev, experienceLevel: next.join(', ') }));
                        }}
                        className={`px-6 py-3 rounded-full text-xs font-bold transition-all border ${isSelected
                          ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Required Experience (Optional)</label>
                <input
                  type="text"
                  name="requiredExperience"
                  value={formData.requiredExperience}
                  onChange={handleInputChange}
                  placeholder="Select minimum years"
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                />
              </div>

              <div className="p-6 bg-orange-50/30 border border-orange-100/50 rounded-3xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-900">Management & Pipeline</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Positions Count</label>
                    <input
                      type="number"
                      name="positionsCount"
                      value={formData.positionsCount}
                      onChange={handleInputChange}
                      min={1}
                      className="w-full p-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Hiring Deadline</label>
                    <input
                      type="date"
                      name="hiringDeadline"
                      value={formData.hiringDeadline}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Internal Notes (Studio Only)</label>
                  <textarea
                    name="internalNotes"
                    value={formData.internalNotes}
                    onChange={handleInputChange}
                    placeholder="Team-only notes about this hiring process..."
                    rows={2}
                    className="w-full p-5 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-medium resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        const verificationItems = [
          { id: 'name', title: 'Name', desc: 'Legal professional designation' },
          { id: 'primarySkill', title: 'Primary Skill', desc: 'Core software mastery & discipline' },
          { id: 'position', title: 'Position', desc: 'Target artist alignment' },
          { id: 'experience', title: 'Experience', desc: 'Industry tenure verification' },
          { id: 'currentCompany', title: 'Current Company', desc: 'Latest studio association' },
          { id: 'currentCTC', title: 'Current CTC', desc: 'Current scale rate' },
          { id: 'expectedCTC', title: 'Expected CTC', desc: 'Desired scale rate for engagement' },
          { id: 'noticePeriod', title: 'Notice Period', desc: 'Availability timeline scale' },
          { id: 'location', title: 'Location', desc: 'Physical base geography' },
          { id: 'relocationPreference', title: 'Relocation Preference', desc: 'Relocation capability' },
          { id: 'showreel', title: 'Showreel', desc: 'Sleek portfolio video target' },
          { id: 'workLedger', title: 'Work Ledger', desc: 'AUI verified projects chain' },
        ];
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">07</div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">VERIFICATION / INFO REQUEST FORM</h3>
                <p className="text-[10px] font-medium text-gray-400">Customize the basic information fields required from the artist. Keep "Talent ID" locked.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-3xl opacity-60 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-gray-400">Talent ID</h4>
                    <p className="text-[9px] font-medium text-gray-300">Secure identifying passport key</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded-lg">
                    <Lock size={10} className="text-purple-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-purple-400">LOCKED</span>
                  </div>
                </div>
              </div>

              {verificationItems.map(item => (
                <button
                  key={item.id}
                  //@ts-ignore
                  onClick={() => toggleVerificationField(item.id)}
                  //@ts-ignore
                  className={`p-5 rounded-3xl border text-left transition-all duration-300 relative group ${
                    //@ts-ignore
                    formData.verificationFields[item.id]
                      ? 'bg-white border-purple-600 shadow-lg shadow-purple-600/5'
                      : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                >
                  <div className="space-y-1">
                    <h4 className={`text-xs font-bold transition-colors ${
                      //@ts-ignore
                      formData.verificationFields[item.id] ? 'text-gray-900' : 'text-gray-400'
                      }`}>{item.title}</h4>
                    <p className="text-[9px] font-medium text-gray-300">{item.desc}</p>
                  </div>
                  <div className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                    //@ts-ignore
                    formData.verificationFields[item.id]
                      ? 'bg-purple-600 scale-100'
                      : 'bg-gray-100 scale-90 opacity-0 group-hover:opacity-100'
                    }`}>
                    <Check size={12} className="text-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">08</div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">ATTACHMENTS</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">ATTACHMENTS (OPTIONAL)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setSelectedFiles(prev => [...prev, ...files]);
                    e.target.value = '';
                  }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-100 rounded-[2.5rem] p-12 text-center space-y-4 hover:border-purple-200 hover:bg-purple-50/30 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-purple-100 transition-colors">
                    <UploadCloud size={24} className="text-gray-300 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-900">Upload reference files</p>
                    <p className="text-[10px] font-medium text-gray-400">Briefs, moodboards, or complexity examples</p>
                  </div>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Selected Files ({selectedFiles.length})
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedFiles.map((file, idx) => (
                      <div key={`${file.name}-${idx}`} className="relative group rounded-2xl overflow-hidden border border-gray-100">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} className="text-white" />
                        </button>
                        <div className="px-2 py-1.5 bg-white">
                          <p className="text-[9px] font-medium text-gray-500 truncate">{file.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (viewingPipeline) {
    return (
      <HiringPipeline
        jobId={viewingPipeline.id}
        jobTitle={viewingPipeline.title}
        onBack={() => setViewingPipeline(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Internal Note Modal */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl p-10 space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">STUDIO INTERNAL NOTES</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">RESTRICTED ACCESS</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNoteModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-300" />
                </button>
              </div>

              <div className="p-8 bg-gray-50/50 border border-gray-100 rounded-[2rem]">
                <p className="text-lg font-medium italic text-gray-600 leading-relaxed text-center">
                  "{selectedNote}"
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">CONFIDENTIAL FOR YOUR STUDIO</span>
              </div>

              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="w-full h-16 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black/90 transition-all active:scale-[0.98] shadow-xl shadow-black/10"
              >
                CLOSE NOTE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Role Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingJob && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-10 bg-[#7c00ff] text-white relative">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Edit2 size={16} className="text-white/60" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">ROLE MANAGEMENT</span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">Edit Role: {editingJob.title}</h2>
                  <p className="text-sm font-medium text-white/60">Modify role parameters and track lifecycle status</p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="absolute top-10 right-10 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">

                {/* Status Control */}
                <div className="p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#7c00ff]/10 flex items-center justify-center text-[#7c00ff]">
                      <BarChart size={16} />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">STATUS CONTROL</h3>
                  </div>
                  <div className="flex bg-white p-2 rounded-2xl border border-gray-100">
                    {['OPEN', 'PAUSED', 'CLOSED'].map(status => (
                      <button
                        key={status}
                        onClick={() => setEditingJob({ ...editingJob, status: status.toLowerCase() as any })}
                        className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${editingJob.status === status.toLowerCase()
                          ? 'bg-[#7c00ff] text-white shadow-lg shadow-[#7c00ff]/20'
                          : 'text-gray-300 hover:text-gray-400'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role Details Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">01</div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">ROLE DETAILS</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">ROLE TITLE *</label>
                      <input
                        type="text"
                        value={editingJob.title}
                        onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                        className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-medium text-sm"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">PRODUCTION TYPE *</label>
                      <div className="flex flex-wrap gap-2">
                        {['Feature Film', 'TV Series / OTT', 'Short Film', 'VFX', 'Commercial', 'Other'].map(type => (
                          <button
                            key={type}
                            onClick={() => setEditingJob({ ...editingJob, productionType: type })}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${editingJob.productionType === type
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                              }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      {editingJob.productionType === 'Other' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4"
                        >
                          <input
                            type="text"
                            value={editingJob.customProductionType}
                            onChange={(e) => setEditingJob({ ...editingJob, customProductionType: e.target.value })}
                            placeholder="Specify production type..."
                            className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-medium text-sm"
                          />
                        </motion.div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">PROJECT FORMAT *</label>
                        <div className="flex bg-gray-50/50 p-1.5 rounded-2xl">
                          {['3D', '2D', 'VFX', 'Other'].map(format => (
                            <button
                              key={format}
                              onClick={() => setEditingJob({ ...editingJob, projectFormat: format })}
                              className={`flex-1 h-10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${editingJob.projectFormat === format ? 'bg-black text-white shadow-lg' : 'text-gray-300'
                                }`}
                            >
                              {format}
                            </button>
                          ))}
                        </div>
                        {editingJob.projectFormat === 'Other' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4"
                          >
                            <input
                              type="text"
                              value={editingJob.customProjectFormat}
                              onChange={(e) => setEditingJob({ ...editingJob, customProjectFormat: e.target.value })}
                              placeholder="Specify project format..."
                              className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-medium text-sm"
                            />
                          </motion.div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">ENGAGEMENT TYPE *</label>
                        <div className="flex bg-gray-50/50 p-1.5 rounded-2xl">
                          {['Full Time (Employee)', 'Short Term/Contract'].map(type => (
                            <button
                              key={type}
                              onClick={() => setEditingJob({ ...editingJob, engagementType: type })}
                              className={`flex-1 h-10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${editingJob.engagementType === type ? 'bg-black text-white shadow-lg' : 'text-gray-300'
                                }`}
                            >
                              {type.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {editingJob.engagementType === 'Short Term/Contract' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3"
                      >
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">CONTRACT DURATION *</label>
                        <input
                          type="text"
                          value={editingJob.contractDuration || ''}
                          onChange={(e) => setEditingJob({ ...editingJob, contractDuration: e.target.value })}
                          placeholder="e.g. 3 Months, 6 Months"
                          className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-medium text-sm"
                        />
                      </motion.div>
                    )}

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">EXPERIENCE LEVEL *</label>
                      <div className="flex flex-wrap gap-2">
                        {['Fresher (0 Years)', 'Junior (1–2 Years)', 'Mid (3–6 Years)', 'Senior (7+ Years)', 'Any Level'].map(level => (
                          <button
                            key={level}
                            onClick={() => setEditingJob({ ...editingJob, experienceLevel: level })}
                            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${editingJob.experienceLevel === level
                              ? 'bg-white border-gray-100 shadow-sm text-gray-900'
                              : 'bg-white text-gray-300 border-gray-100'
                              }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Setup Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">02</div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">WORK SETUP</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">WORK MODE *</label>
                      <div className="flex bg-gray-50/50 p-1.5 rounded-2xl">
                        {['On-site', 'Hybrid', 'Remote'].map(mode => (
                          <button
                            key={mode}
                            onClick={() => setEditingJob({ ...editingJob, workMode: mode })}
                            className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${editingJob.workMode === mode ? 'bg-black text-white shadow-lg' : 'text-gray-300'
                              }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">LOCATION PREFERENCE</label>
                        <select
                          value={editingJob.locationPreference || 'Worldwide'}
                          onChange={(e) => setEditingJob({ ...editingJob, locationPreference: e.target.value })}
                          className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-medium text-sm appearance-none"
                        >
                          <option value="Worldwide">Worldwide</option>
                          {countries.map(([code, name]) => (
                            <option key={code} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">AVAILABILITY *</label>
                        <select
                          value={editingJob.requiredAvailability || 'Immediate'}
                          onChange={(e) => setEditingJob({ ...editingJob, requiredAvailability: e.target.value })}
                          className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-medium text-sm appearance-none"
                        >
                          {['Immediate', 'Within 1 Month', 'Flexible'].map(avail => (
                            <option key={avail} value={avail}>{avail}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">TIME ZONE PREFERENCE</label>
                      <select
                        value={editingJob.timeZonePreference || 'No Preference'}
                        onChange={(e) => setEditingJob({ ...editingJob, timeZonePreference: e.target.value })}
                        className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-medium text-sm appearance-none"
                      >
                        {TIME_ZONES.map(tz => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                      {editingJob.timeZonePreference === 'Other' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4"
                        >
                          <input
                            type="text"
                            value={editingJob.customTimeZone || ''}
                            onChange={(e) => setEditingJob({ ...editingJob, customTimeZone: e.target.value })}
                            placeholder="Specify time zone..."
                            className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-medium text-sm"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Requirements Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">03</div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">REQUIREMENTS & SOFTWARE</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">ROLE REQUIREMENTS *</label>
                      <textarea
                        value={editingJob.description || ''}
                        onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                        className="w-full p-6 bg-gray-50/50 rounded-[2rem] border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-medium text-sm min-h-[120px] resize-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">OPPORTUNITY OVERVIEW *</label>
                      <textarea
                        value={editingJob.opportunityOverview || ''}
                        onChange={(e) => setEditingJob({ ...editingJob, opportunityOverview: e.target.value })}
                        className="w-full p-6 bg-gray-50/50 rounded-[2rem] border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-medium text-sm min-h-[120px] resize-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">SOFTWARE / TOOLS</label>
                      <input
                        type="text"
                        value={editingJob.softwareTools || ''}
                        onChange={(e) => setEditingJob({ ...editingJob, softwareTools: e.target.value })}
                        placeholder="e.g. Maya, Houdini (comma separated)"
                        className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Verification Fields Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">04</div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">VERIFICATION PIPELINE</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'name', title: 'FULL NAME', desc: 'Legal identity verification' },
                      { id: 'primarySkill', title: 'PRIMARY SKILL', desc: 'Core competency validation' },
                      { id: 'position', title: 'POSITION', desc: 'Current designation' },
                      { id: 'experience', title: 'EXPERIENCE', desc: 'Total years in industry' },
                      { id: 'currentCompany', title: 'CURRENT COMPANY', desc: 'Employment history' },
                      { id: 'currentCTC', title: 'CURRENT CTC', desc: 'Financial baseline' },
                      { id: 'expectedCTC', title: 'EXPECTED CTC', desc: 'Compensation targets' },
                      { id: 'noticePeriod', title: 'NOTICE PERIOD', desc: 'Availability timeline' },
                      { id: 'location', title: 'LOCATION', desc: 'Current residence' },
                      { id: 'relocationPreference', title: 'RELOCATION', desc: 'Mobility status' },
                      { id: 'showreel', title: 'SHOWREEL', desc: 'Portfolio & work proof' },
                      { id: 'workLedger', title: 'WORK LEDGER', desc: 'Verified work history' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          const vFields = { ...editingJob.verificationFields };
                          vFields[item.id] = !vFields[item.id];
                          setEditingJob({ ...editingJob, verificationFields: vFields });
                        }}
                        className={`p-6 rounded-[2rem] border transition-all text-left relative group ${editingJob.verificationFields?.[item.id]
                          ? 'bg-white border-[#7c00ff]/20 shadow-xl shadow-[#7c00ff]/5'
                          : 'bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-100'
                          }`}
                      >
                        <div className="space-y-1">
                          <h4 className={`text-xs font-bold transition-colors ${editingJob.verificationFields?.[item.id] ? 'text-gray-900' : 'text-gray-400'
                            }`}>{item.title}</h4>
                          <p className="text-[9px] font-medium text-gray-300">{item.desc}</p>
                        </div>
                        <div className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${editingJob.verificationFields?.[item.id]
                          ? 'bg-[#7c00ff] scale-100'
                          : 'bg-gray-100 scale-90 opacity-0 group-hover:opacity-100'
                          }`}>
                          <Check size={12} className="text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attachments Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">05</div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">ATTACHMENTS</h3>
                  </div>

                  {/* Existing Attachments */}
                  {editingJob.attachments && editingJob.attachments.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                        UPLOADED FILES ({editingJob.attachments.length})
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {editingJob.attachments.map((path: string, idx: number) => (
                          <div key={idx} className="relative group rounded-2xl overflow-hidden border border-gray-100">
                            <img
                              src={`${BASE_URL}${path}`}
                              alt={`Attachment ${idx + 1}`}
                              className="w-full h-28 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingJob.attachments!.filter((_: string, i: number) => i !== idx);
                                setEditingJob({ ...editingJob, attachments: updated });
                              }}
                              className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} className="text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload More */}
                  <div
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.multiple = true;
                      input.onchange = async (e: any) => {
                        const files = Array.from(e.target.files || []) as File[];
                        if (files.length === 0 || !token) return;
                        try {
                          const res = await uploadJobPostingAttachments(token, editingJob.id, files);
                          if (res.ok) {
                            const data = await res.json();
                            setEditingJob({ ...editingJob, attachments: data.data.attachments });
                            toast.success('Attachments uploaded');
                          } else {
                            toast.error('Failed to upload');
                          }
                        } catch (err) {
                          toast.error('Upload failed');
                        }
                      };
                      input.click();
                    }}
                    className="border-2 border-dashed border-gray-100 rounded-[2rem] p-10 text-center space-y-3 hover:border-[#7c00ff]/30 hover:bg-[#7c00ff]/5 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto group-hover:bg-[#7c00ff]/10 transition-colors">
                      <UploadCloud size={20} className="text-gray-300 group-hover:text-[#7c00ff] transition-colors" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-gray-900">Upload reference files</p>
                      <p className="text-[9px] font-medium text-gray-400">Briefs, moodboards, or complexity examples</p>
                    </div>
                  </div>
                </div>

                {/* Management & Pipeline Section */}
                <div className="p-10 bg-orange-50/30 rounded-[3rem] border border-orange-100/50 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white">
                      <CheckCircle2 size={20} />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-900">MANAGEMENT & PIPELINE</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-orange-900/40">POSITIONS COUNT</label>
                      <input
                        type="number"
                        value={editingJob.artistCount}
                        onChange={(e) => setEditingJob({ ...editingJob, artistCount: parseInt(e.target.value) })}
                        className="w-full h-14 px-6 bg-white rounded-2xl border border-orange-100 outline-none focus:border-orange-500 transition-all font-black text-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-orange-900/40">HIRING DEADLINE</label>
                      <input
                        type="date"
                        value={editingJob.startDate || ''}
                        onChange={(e) => setEditingJob({ ...editingJob, startDate: e.target.value })}
                        className="w-full h-14 px-6 bg-white rounded-2xl border border-orange-100 outline-none focus:border-orange-500 transition-all font-black text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-orange-900/40">INTERNAL NOTES (STUDIO ONLY)</label>
                    <textarea
                      value={editingJob.internalNotes || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, internalNotes: e.target.value })}
                      placeholder="Looking for specialists in quadruped animation."
                      className="w-full p-6 bg-white rounded-[2rem] border border-orange-100 outline-none focus:border-orange-500 transition-all font-medium text-sm min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="h-[1px] bg-orange-100/50 w-full" />

                  <button
                    onClick={() => handleDeleteRole(editingJob.id)}
                    className="w-full h-14 bg-white border border-rose-100 rounded-2xl flex items-center justify-center gap-3 group hover:bg-rose-50 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                      <X size={12} className="text-rose-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">DELETE ROLE PERMANENTLY</span>
                  </button>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="h-14 px-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors"
                >
                  DISCARD
                </button>

                <button
                  onClick={handleUpdateRole}
                  disabled={isSubmitting}
                  className="h-16 px-12 bg-[#7c00ff] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 shadow-xl shadow-[#7c00ff]/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'UPDATING...' : 'UPDATE ROLE INFORMATION'}
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2 text-left">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#05060b]">Open Roles</h2>
          <p className="text-base md:text-lg text-[#6f7782]">Manage hiring requirements and track talent engagement.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-14 px-8 bg-black hover:bg-black/90 text-white rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-black/10"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Post Role</span>
          <Plus size={18} />
        </button>
      </div>

      {/* Grid of Job Cards */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="h-96 rounded-[2.5rem] bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-[2.5rem] border border-dashed border-gray-300 bg-white py-20 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Briefcase size={24} className="text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-[#0a0f1a]">No open roles yet</p>
          <p className="mt-2 text-[#6f7782]">Start your hiring process by posting your first role.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <Card key={job.id} className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-premium hover:shadow-premium-hover transition-all duration-500 group">
              <div className="space-y-8">
                {/* ID and Project Type */}
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-black rounded-lg text-[10px] font-black text-white tracking-widest">
                    ID: ROLE-{job.id}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-300">
                    {job.productionType || job.projectType || 'FEATURE FILM'}
                  </div>
                </div>

                {/* Title and Experience */}
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tight text-[#1a1f28] group-hover:text-black transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                    <span>{job.experienceLevel || job.experienceRequired || 'MID-LEVEL, SENIOR'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                    <span>AVAILABILITY: {job.requiredAvailability || 'IMMEDIATE'}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em]">Filled: {job.filledCount || 0}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Target: {job.artistCount}</div>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(((job.filledCount || 0) / job.artistCount) * 100, 100)}%` }}
                      className="h-full bg-black rounded-full"
                    />
                  </div>
                </div>

                {/* Status and Mode */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                      {job.status || 'Open'}
                    </span>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {job.workMode || 'Hybrid'} • {job.locationPreference || 'Worldwide'}
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center justify-between py-4 border-y border-gray-50">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    <Calendar size={14} />
                    Hiring Deadline
                  </div>
                  <div className="text-[10px] font-black text-rose-500 tracking-widest">
                    {job.startDate || '2026-03-15'}
                  </div>
                </div>

                {/* Internal Notes */}
                <div
                  onClick={() => handleOpenNote(job.description || 'Looking for specialists in quadruped animation.')}
                  className="p-5 bg-gray-50/50 rounded-2xl space-y-2 border border-orange-100/50 hover:border-orange-200 cursor-pointer transition-all relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                      <Briefcase size={12} />
                      Internal Notes
                    </div>
                    <div className="text-[8px] font-black text-orange-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to Expand
                    </div>
                  </div>
                  <p className="text-xs font-medium italic text-gray-500 line-clamp-2">
                    "{job.description || 'Looking for specialists in quadruped animation.'}"
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => setViewingPipeline({ id: job.id, title: job.title })}
                    className="w-full h-14 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black/90 transition-all active:scale-[0.99] shadow-lg shadow-black/5"
                  >
                    View Applicants
                  </button>
                  <button
                    onClick={() => onInviteFromBench?.(job)}
                    className="w-full h-14 bg-white border border-gray-100 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
                  >
                    <UserPlus size={16} className="text-orange-500" />
                    Invite from Bench
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onSearchTalent?.()}
                      className="h-14 bg-white border border-gray-100 text-gray-900 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                    >
                      Search Talent
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(job)}
                      className="h-14 bg-white border border-gray-100 text-gray-900 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                    >
                      Edit Role
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Post Role Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-10 bg-black text-white relative">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight">Post Role</h2>
                  <p className="text-sm font-medium text-gray-400">Define your hiring requirement with a structured format</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-10 right-10 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content - All sections in one scrollable view */}
              <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
                {[1, 2, 3, 4, 5, 6, 7].map(step => (
                  <React.Fragment key={step}>
                    {renderStep(step)}
                    {step < 7 && <div className="border-t border-gray-100" />}
                  </React.Fragment>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="h-14 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="h-14 px-12 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-black/10 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Role'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HiringByStudio;
