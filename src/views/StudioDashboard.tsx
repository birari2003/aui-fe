import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BadgeCheck, Bookmark, Briefcase, Calendar, Check, Clock, FileText, RotateCcw, ShieldCheck, Star, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import Card from '../components/Card';
import QRCode from 'react-qr-code';
import { searchProfessionals } from '../services/searchServices';
import {
  addTalentToBench,
  createStudioRequestProfessional,
  getStudioRequestProfessionals,
  getTalentBench,
  removeTalentFromBench,
  updateStudioRequestProfessional,
} from '../services/studioServices';
import { View } from '../types';
import HiringByStudio from '../components/hiringByStudio';
import OpportunityModal from '../components/OpportunityModal';

type ProfessionalRow = {
  id: number;
  fullName: string;
  primarySkill: string;
  level: 'fresher' | 'junior' | 'mid' | 'senior';
  position: 'artist' | 'lead' | 'supervisor' | 'director' | 'other';
  productionType: 'film' | 'tv' | 'web' | 'ads';
  experienceYears: number;
  verificationStatus: boolean;
  avatarUrl?: string;
  availability?: string;
  user?: {
    email?: string;
    talentId?: {
      talentCode?: string;
    };
  };
  savedByStudios?: { id: number }[];
};

type BenchRow = {
  id: number;
  professionalId: number;
  professional: ProfessionalRow;
};

type StudioRequestRow = {
  id: number;
  professionalId: number;
  projectTimeline: string;
  productionType: 'film' | 'tv' | 'web' | 'ads' | 'other';
  engagementBrief: string;
  proposedBudget?: string;
  startDate?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed';
  professional: ProfessionalRow;
};

const FALLBACK_IMAGES = [
  'https://picsum.photos/seed/studio-discover-1/1200/900',
  'https://picsum.photos/seed/studio-discover-2/1200/900',
  'https://picsum.photos/seed/studio-discover-3/1200/900',
  'https://picsum.photos/seed/studio-discover-4/1200/900',
  'https://picsum.photos/seed/studio-discover-5/1200/900',
  'https://picsum.photos/seed/studio-discover-6/1200/900',
];

const LEVEL_OPTIONS = [
  { label: 'All Levels', value: '' },
  { label: 'Fresher', value: 'fresher' },
  { label: 'Junior', value: 'junior' },
  { label: 'Mid', value: 'mid' },
  { label: 'Senior', value: 'senior' },
];

const POSITION_OPTIONS = [
  { label: 'All Positions', value: '' },
  { label: 'Artist', value: 'artist' },
  { label: 'Lead', value: 'lead' },
  { label: 'Supervisor', value: 'supervisor' },
  { label: 'Director', value: 'director' },
  { label: 'Other', value: 'other' },
];

const TYPE_OPTIONS = [
  { label: 'All Types', value: '' },
  { label: 'Film', value: 'film' },
  { label: 'TV', value: 'tv' },
  { label: 'Web', value: 'web' },
  { label: 'Ads', value: 'ads' },
];

const isAvailableNow = (availability?: string) => {
  if (!availability) return false;
  return ['available', 'immediate', 'now', 'open'].some((word) =>
    availability.toLowerCase().includes(word)
  );
};

const levelStyles: Record<ProfessionalRow['level'], { label: string; className: string }> = {
  fresher: { label: 'Fresher', className: 'bg-[#cfcfcf] text-[#30343a]' },
  junior: { label: 'Junior', className: 'bg-[#3d7be0] text-white' },
  mid: { label: 'Mid', className: 'bg-[#223a82] text-white' },
  senior: { label: 'Senior', className: 'bg-[#18224e] text-white' },
};

const levelHighlightStyles: Record<ProfessionalRow['level'], { title: string; subtitle: string; className: string; dotClassName: string }> = {
  fresher: {
    title: 'Learning & Growing',
    subtitle: 'Open to new opportunities',
    className: 'bg-[#e9f7ee] text-[#1b7a48]',
    dotClassName: 'bg-[#27c36b]',
  },
  junior: {
    title: 'Building Experience',
    subtitle: 'Ready for assignments',
    className: 'bg-[#edf3ff] text-[#3065d7]',
    dotClassName: 'bg-[#3f6de2]',
  },
  mid: {
    title: 'Industry Experienced',
    subtitle: 'Proven track record',
    className: 'bg-[#e8eefc] text-[#243f8f]',
    dotClassName: 'bg-[#233ea0]',
  },
  senior: {
    title: 'Production Ready',
    subtitle: 'Lead. Deliver. Inspire.',
    className: 'bg-[#eef0ff] text-[#1d2358]',
    dotClassName: 'bg-[#1d2358]',
  },
};

const productionTypeLabels: Record<ProfessionalRow['productionType'], string> = {
  film: 'Feature Film',
  tv: 'TV',
  web: 'Web',
  ads: 'Ads',
};

const positionLabels: Record<ProfessionalRow['position'], string> = {
  artist: 'Artist',
  lead: 'Lead',
  supervisor: 'Supervisor',
  director: 'Director',
  other: 'Other',
};

const StudioDashboard = ({ setView }: { setView: (v: View) => void }) => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = React.useState<ProfessionalRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [actionLoadingId, setActionLoadingId] = React.useState<number | null>(null);

  const [skill, setSkill] = React.useState('');
  const [experience, setExperience] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [type, setType] = React.useState('');
  const [availableOnly, setAvailableOnly] = React.useState(false);
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);

  const [benchRows, setBenchRows] = React.useState<BenchRow[]>([]);
  const [requestRows, setRequestRows] = React.useState<StudioRequestRow[]>([]);

  const [opportunityModalOpen, setOpportunityModalOpen] = React.useState(false);
  const [selectedProfessional, setSelectedProfessional] = React.useState<ProfessionalRow | null>(null);
  const [submittingOpportunity, setSubmittingOpportunity] = React.useState(false);

  const [activeTab, setActiveTab] = React.useState<'discover' | 'bench' | 'engagements' | 'open_roles'>('discover');
  const [inviteMode, setInviteMode] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState<any>(null);
  const [selectedTalentIds, setSelectedTalentIds] = React.useState<Set<number>>(new Set());
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [inviting, setInviting] = React.useState(false);
  const [updateAgreementModalOpen, setUpdateAgreementModalOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<StudioRequestRow | null>(null);
  const [agreementForm, setAgreementForm] = React.useState({
    projectTimeline: '',
    proposedBudget: '',
    startDate: '',
    engagementBrief: '',
  });
  const [updatingAgreement, setUpdatingAgreement] = React.useState(false);

  const token = localStorage.getItem('token');

  const fetchStudioData = React.useCallback(async () => {
    if (!token) return;

    try {
      const [benchRes, requestRes] = await Promise.all([
        getTalentBench(token),
        getStudioRequestProfessionals(token),
      ]);

      if (benchRes.ok) {
        const benchPayload = await benchRes.json();
        setBenchRows(Array.isArray(benchPayload?.data) ? benchPayload.data : []);
      }

      if (requestRes.ok) {
        const requestPayload = await requestRes.json();
        setRequestRows(Array.isArray(requestPayload?.data) ? requestPayload.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch studio data:', err);
    }
  }, [token]);

  const fetchProfessionals = React.useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setProfessionals([]);
        setError('Please login as a studio to load professionals.');
        return;
      }

      const query: Record<string, string> = {};
      if (skill.trim()) query.skill = skill.trim();
      if (experience.trim() && !Number.isNaN(Number(experience))) {
        query.minExperience = String(Number(experience));
      }
      if (level) query.level = level;
      if (position) query.role = position;
      if (verifiedOnly) query.verified = 'true';

      const response = await searchProfessionals(token, query);

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setProfessionals([]);
        setError(body?.message || 'Failed to fetch professionals.');
        return;
      }

      const payload = await response.json();
      setProfessionals(Array.isArray(payload?.data) ? payload.data : []);
    } catch (err) {
      console.error('Failed to fetch professionals:', err);
      setProfessionals([]);
      setError('Something went wrong while fetching professionals.');
    } finally {
      setLoading(false);
    }
  }, [experience, level, position, skill, verifiedOnly]);

  React.useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  React.useEffect(() => {
    fetchStudioData();
  }, [fetchStudioData]);

  const benchIds = React.useMemo(
    () => new Set(benchRows.map((row) => row.professionalId)),
    [benchRows]
  );

  const benchCodes = React.useMemo(
    () => new Set(benchRows.map((row) => row.professional?.user?.talentId?.talentCode || `AUI-${String(row.professionalId).padStart(6, '0')}`)),
    [benchRows]
  );

  const toggleBench = async (professional: ProfessionalRow) => {
    if (!token) {
      setError('Please login as a studio to manage bench.');
      return;
    }

    try {
      setActionLoadingId(professional.id);
      const inBench = benchIds.has(professional.id);
      const response = inBench
        ? await removeTalentFromBench(token, professional.id)
        : await addTalentToBench(token, professional.id);

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body?.message || 'Failed to update bench.');
        toast.error(body?.message || 'Failed to update bench.');
      } else {
        toast.success(inBench 
          ? `Removed ${professional.fullName || 'Professional'} from bench` 
          : `Added ${professional.fullName || 'Professional'} to bench`
        );
        await fetchStudioData();
      }
    } catch (err) {
      console.error('Failed to toggle bench:', err);
      setError('Failed to update bench.');
      toast.error('Failed to update bench.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const normalized = professionals
    .filter((p) => (type ? p.productionType === type : true))
    .filter((p) => (availableOnly ? isAvailableNow(p.availability) : true))
    .map((p, index) => {
      const code = p.user?.talentId?.talentCode || `AUI-${String(p.id).padStart(6, '0')}`;
      const name = p.fullName?.trim() || p.user?.email?.split('@')[0] || 'Unknown Professional';
      return {
        ...p,
        talentCode: code,
        displayName: name,
        image: p.avatarUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
      };
    });

  const renderProfessionalCard = (talent: (typeof normalized)[number], index: number) => {
    const level = levelStyles[talent.level] || levelStyles.junior;
    const highlight = levelHighlightStyles[talent.level] || levelHighlightStyles.junior;
    const availabilityLabel = isAvailableNow(talent.availability) ? 'AVAILABLE NOW' : 'REVIEWING';
    const roleLabel = positionLabels[talent.position] || 'Artist';
    const productionLabel = productionTypeLabels[talent.productionType] || 'Production';

    return (
      <motion.div
        key={talent.talentCode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
      >
        <Card className="overflow-hidden rounded-[16px] border border-[#e1e1e6] bg-[#f7f7f8] p-0 shadow-[0_1px_0_rgba(17,24,39,0.02),0_8px_20px_rgba(15,23,42,0.05)]">
          <div className="grid grid-cols-1 md:grid-cols-[162px_1fr] gap-0">
            <div className="relative min-h-[248px] md:min-h-[262px] bg-[#d8dbe2]">
              <img
                src={talent.image}
                alt={talent.displayName}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute left-3 top-3 rounded-full bg-[#ececec]/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#3a4048] shadow-sm backdrop-blur-sm">
                {availabilityLabel}
              </div>
              <button
                type="button"
                onClick={() => toggleBench(talent)}
                disabled={actionLoadingId === talent.id}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[#7e8692] shadow-sm backdrop-blur-sm transition-premium hover:text-[#101725]"
              >
                <Star
                  size={15}
                  className={benchIds.has(talent.id) ? 'fill-[#4f46e5] text-[#4f46e5]' : 'text-[#7e8692]'}
                />
              </button>
            </div>

            <div className="flex flex-col justify-between px-4 py-4 md:px-5 md:py-4 bg-[#f7f7f8]">
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#55617a]">
                        <ShieldCheck size={13} className="text-[#5f6d88]" />
                        AUI Verified Talent
                      </div>
                      <div className="mt-2 flex items-center gap-2 min-w-0">
                        <h3 className="truncate text-[19px] md:text-[21px] font-semibold leading-[0.95] tracking-[-0.03em] text-[#1a1f28]">
                          {talent.displayName}
                        </h3>
                        <BadgeCheck size={16} className="shrink-0 text-[#7d848e]" />
                      </div>
                    </div>

                    <div className={`min-w-[62px] rounded-[10px] px-2.5 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.08em] shadow-sm ${level.className}`}>
                      <div>{level.label}</div>
                      <div className="mt-0.5 text-[10px] font-medium tracking-[0.12em] opacity-90">Level</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#4f46e5] bg-[#eeebff] px-3 py-1.5 rounded-full w-fit border border-[#4f46e5]/10">
                    <Users size={12} />
                    Benched by {talent.savedByStudios?.length || 0} Studios
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8b9099]">Talent ID</div>
                  <div className="mt-1.5 flex items-center justify-between rounded-[10px] border border-[#d9dce2] bg-[#fbfbfc] px-3.5 py-2.5">
                    <div className="font-mono text-[20px] md:text-[24px] font-bold leading-[0.95] tracking-[0.18em] bg-gradient-to-r from-[#18224e] to-[#4f46e5] bg-clip-text text-transparent">
                      {talent.talentCode}
                    </div>
                    <BadgeCheck className="text-[#4f46e5] shrink-0" size={20} />
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-1 gap-3 border-b border-[#e5e7eb] pb-2.5 sm:grid-cols-2 sm:gap-0 sm:pb-2.5">
                    <div className="sm:pr-4">
                      <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9aa0a8]">
                        <ShieldCheck size={11} /> Experience Level
                      </div>
                      <div className="mt-1 text-[13px] font-medium text-[#1d2532] capitalize">
                        {talent.level}
                      </div>
                    </div>
                    <div className="sm:border-l sm:border-[#e5e7eb] sm:pl-4">
                      <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9aa0a8]">
                        <Briefcase size={11} /> Production Types
                      </div>
                      <div className="mt-1 text-[13px] font-medium text-[#1d2532]">
                        {productionLabel} • {roleLabel}
                      </div>
                    </div>
                  </div>

                  <div className={`mt-2.5 rounded-[10px] px-4 py-3 ${highlight.className}`}>
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 h-3 w-3 rounded-full ${highlight.dotClassName}`} />
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] leading-none">
                          {highlight.title}
                        </div>
                        <div className="mt-1 text-[11px] leading-snug opacity-80">
                          {highlight.subtitle}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 text-[#6f7580]">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.14em]">
                    <ShieldCheck size={13} className="text-[#6d7480]" />
                    Identity Verified
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.14em]">
                    <Briefcase size={13} className="text-[#6d7480]" />
                    Work Verified
                  </div>
                </div>
                <div className="w-16 h-16 bg-white p-1 rounded-lg border border-[#E5E7EB] flex shrink-0 items-center justify-center self-start sm:self-auto shadow-sm">
                  <QRCode value={`${window.location.origin}/talent/${talent.talentCode}`} size={56} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                <button
                  type="button"
                  className="h-10 rounded-[10px] bg-black px-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white transition-premium hover:bg-black/90"
                  onClick={() => navigate(`/talent/${talent.talentCode}`)}
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => toggleBench(talent)}
                  disabled={actionLoadingId === talent.id}
                  className={`flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#5641ea] text-white transition-premium hover:bg-[#4b38d7] ${benchIds.has(talent.id) ? 'shadow-[0_10px_20px_rgba(86,65,234,0.22)]' : ''}`}
                  aria-label={benchIds.has(talent.id) ? 'Remove from bench' : 'Add to bench'}
                >
                  <Bookmark
                    size={14}
                    className={benchIds.has(talent.id) ? 'fill-white text-white' : 'text-white'}
                  />
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const filteredTalent = activeTab === 'bench'
    ? normalized.filter((p) => benchCodes.has(p.talentCode))
    : normalized;

  const benchDisplayRows = benchRows.map((row, index) => {
    const talent = row.professional;
    const talentCode = talent?.user?.talentId?.talentCode || `AUI-${String(talent?.id || row.professionalId).padStart(6, '0')}`;
    return {
      ...row,
      talent,
      talentCode,
      displayName: talent?.fullName || talent?.user?.email?.split('@')[0] || 'Unknown Professional',
      image: talent?.avatarUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
      role: talent?.position || 'artist',
      level: talent?.level || 'junior',
      availability: talent?.availability || 'Immediate',
    };
  });

  const statusClass: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600 border-gray-200',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    in_progress: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const resetFilters = () => {
    setSkill('');
    setExperience('');
    setLevel('');
    setPosition('');
    setType('');
    setAvailableOnly(false);
    setVerifiedOnly(false);
  };

  const openOpportunityModal = (professional: ProfessionalRow) => {
    setSelectedProfessional(professional);
    setOpportunityModalOpen(true);
  };

  const handleInviteFromBench = (job: any) => {
    setSelectedJob(job);
    setInviteMode(true);
    setActiveTab('bench');
    setSelectedTalentIds(new Set());
  };

  const toggleTalentSelection = (id: number) => {
    setSelectedTalentIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    const allIds = benchRows.map(r => r.professionalId);
    setSelectedTalentIds(new Set(allIds));
  };

  const handleDeselectAll = () => {
    setSelectedTalentIds(new Set());
  };

  const handleSendInvitations = async () => {
    if (!token || !selectedJob || selectedTalentIds.size === 0) return;
    
    try {
      setInviting(true);
      const response = await createStudioRequestProfessional(token, {
        professionalIds: Array.from(selectedTalentIds),
        roleTitle: selectedJob.title,
        productionType: selectedJob.productionType,
        projectFormat: selectedJob.projectFormat,
        opportunityOverview: selectedJob.opportunityOverview,
        roleRequirements: selectedJob.description,
        startAvailability: selectedJob.requiredAvailability,
        workMode: selectedJob.workMode,
        location: selectedJob.locationPreference,
        verificationFields: selectedJob.verificationFields,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        toast.error(body?.message || 'Failed to send invitations');
        return;
      }
      
      toast.success(`Successfully sent invitations to ${selectedTalentIds.size} artists`);
      setConfirmModalOpen(false);
      setInviteMode(false);
      setSelectedJob(null);
      setSelectedTalentIds(new Set());
      await fetchStudioData();
      setActiveTab('engagements');
    } catch (err) {
      console.error('Failed to send invitations:', err);
      toast.error('Failed to send invitations');
    } finally {
      setInviting(false);
    }
  };

  const handleSendOpportunity = async (data: any) => {
    if (!token || !selectedProfessional) return;

    try {
      setSubmittingOpportunity(true);
      const response = await createStudioRequestProfessional(token, {
        professionalId: selectedProfessional.id,
        ...data
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body?.message || 'Failed to send opportunity.');
        return;
      }

      setOpportunityModalOpen(false);
      setSelectedProfessional(null);
      await fetchStudioData();
      setActiveTab('engagements');
      toast.success('Opportunity sent successfully');
    } catch (err) {
      console.error('Failed to submit opportunity:', err);
      setError('Failed to send opportunity.');
    } finally {
      setSubmittingOpportunity(false);
    }
  };

  const openUpdateAgreement = (row: StudioRequestRow) => {
    setSelectedRequest(row);
    setAgreementForm({
      projectTimeline: row.projectTimeline || '',
      proposedBudget: row.proposedBudget || '',
      startDate: row.startDate || '',
      engagementBrief: row.engagementBrief || '',
    });
    setUpdateAgreementModalOpen(true);
  };

  const handleUpdateAgreement = async () => {
    if (!token || !selectedRequest) return;
    try {
      setUpdatingAgreement(true);
      const res = await updateStudioRequestProfessional(token, selectedRequest.id, agreementForm);
      if (res.ok) {
        toast.success('Agreement updated successfully');
        setUpdateAgreementModalOpen(false);
        setSelectedRequest(null);
        await fetchStudioData();
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.message || 'Failed to update agreement');
      }
    } catch (err) {
      toast.error('Failed to update agreement');
    } finally {
      setUpdatingAgreement(false);
    }
  };

  const FilterSelect = ({
    label,
    value,
    onChange,
    options,
    className = '',
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
    className?: string;
  }) => (
    <div className={`space-y-1 text-left ${className}`}>
      <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-text-muted">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-brand-primary outline-none transition-premium focus:border-brand-primary"
      >
        {options.map((opt) => (
          <option key={`${label}-${opt.value || 'all'}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9f9fa] no-scrollbar text-left">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <section className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.55em] text-gray-400">Rolla Rock Studio</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#05060b] leading-[0.95]">Talent Pool</h1>
          <p className="max-w-2xl text-2xl leading-relaxed text-[#6f7782]">
            Build and manage your trusted network of production-ready talent.
          </p>
        </section>

        <div className="flex items-center gap-8 border-b border-gray-200 pb-4 overflow-x-auto">
          {[
            { id: 'discover', label: 'Discover' },
            { id: 'bench', label: 'Bench' },
            { id: 'engagements', label: 'Engagements' },
            { id: 'open_roles', label: 'Open Roles' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-[22px] sm:text-xs font-bold uppercase tracking-[0.32em] whitespace-nowrap transition-premium border-b-2 ${
                activeTab === tab.id 
                  ? 'text-brand-primary border-brand-primary' 
                  : 'text-[#8f949b] border-transparent hover:text-brand-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'discover' && (
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tight text-[#05060b]">Discover Talent</h2>
              <p className="text-xl text-[#6f7782]">Find verified artists ready to contribute to your production.</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#efeff1] p-5 shadow-sm">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.78fr_0.98fr_0.98fr_0.98fr_auto_auto_auto] xl:items-end">
                <FilterSelect
                  label="Skill"
                  value={skill}
                  onChange={setSkill}
                  options={[
                    { label: 'All Skills', value: '' },
                    { label: 'Character Animation', value: 'character' },
                    { label: 'Compositing', value: 'compositing' },
                    { label: 'Lighting', value: 'lighting' },
                    { label: 'Modeling', value: 'modeling' },
                    { label: 'FX', value: 'fx' },
                  ]}
                />

                <div className="space-y-1 text-left">
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-text-muted">Experience</div>
                  <input
                    type="number"
                    min={0}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Yrs"
                    className="w-full h-[44px] rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-brand-primary outline-none transition-premium focus:border-brand-primary"
                  />
                </div>

                <FilterSelect label="Level" value={level} onChange={setLevel} options={LEVEL_OPTIONS} />
                <FilterSelect label="Position" value={position} onChange={setPosition} options={POSITION_OPTIONS} />
                <FilterSelect label="Type" value={type} onChange={setType} options={TYPE_OPTIONS} />

                <button
                  type="button"
                  onClick={() => setAvailableOnly((prev) => !prev)}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 h-[44px]"
                >
                  <span className={`relative inline-block h-5 w-10 rounded-full transition-premium ${availableOnly ? 'bg-brand-primary' : 'bg-gray-300'}`}>
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-premium ${availableOnly ? 'left-5' : 'left-0.5'}`}
                    />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#6f7782]">Available</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVerifiedOnly((prev) => !prev)}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 h-[44px]"
                >
                  <span className={`relative inline-block h-5 w-10 rounded-full transition-premium ${verifiedOnly ? 'bg-brand-primary' : 'bg-gray-300'}`}>
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-premium ${verifiedOnly ? 'left-5' : 'left-0.5'}`}
                    />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#6f7782]">Verified</span>
                </button>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 h-[44px] text-[#9aa0a8] transition-premium hover:text-brand-primary"
                  aria-label="Reset filters"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="aspect-[16/10] animate-pulse bg-gray-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 w-28 animate-pulse bg-gray-200 rounded" />
                      <div className="h-8 w-40 animate-pulse bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
                {filteredTalent.map((talent, i) => renderProfessionalCard(talent, i))}
              </div>
            )}

            {!loading && filteredTalent.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center">
                <p className="text-2xl font-bold text-[#0a0f1a]">No professionals found</p>
                <p className="mt-2 text-[#6f7782]">Try adjusting your filters to discover more talent.</p>
              </div>
            )}
          </section>
        )}

        {activeTab === 'bench' && (
          <section className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#05060b]">Your Bench</h2>
                <p className="text-base md:text-lg text-[#6f7782]">Shortlisted talent ready for quick engagement.</p>
              </div>
              
              {inviteMode && (
                <div className="flex items-center gap-6">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b2b6bc]">FILTER BY DEPARTMENT</div>
                    <select className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold min-w-[200px] outline-none">
                      <option>All Departments</option>
                    </select>
                  </div>
                  <button 
                    onClick={selectedTalentIds.size === benchRows.length ? handleDeselectAll : handleSelectAll}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
                  >
                    {selectedTalentIds.size === benchRows.length ? 'DESELECT ALL' : 'SELECT ALL'}
                  </button>
                  <button 
                    disabled={selectedTalentIds.size === 0}
                    onClick={() => setConfirmModalOpen(true)}
                    className="h-14 px-8 bg-[#ff0055] hover:bg-[#e6004d] text-white rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-[#ff0055]/20 disabled:opacity-50 disabled:shadow-none"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">SEND OPPORTUNITY ({selectedTalentIds.size})</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>

            {benchDisplayRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                <p className="text-2xl font-bold text-[#0a0f1a]">Your bench is empty</p>
                <p className="mt-2 text-[#6f7782]">Bookmark professionals from Discover to start building your team.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {benchDisplayRows.map((row) => (
                  <Card 
                    key={row.id} 
                    onClick={() => inviteMode && toggleTalentSelection(row.professionalId)}
                    className={`rounded-3xl border transition-all duration-300 p-8 cursor-pointer ${
                      inviteMode && selectedTalentIds.has(row.professionalId)
                      ? 'border-black bg-white shadow-xl ring-1 ring-black'
                      : 'border-gray-200 bg-white shadow-sm'
                    }`}
                  >
                    <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_0.7fr_auto_auto] gap-6 items-center">
                      <div className="flex items-center gap-6 min-w-0">
                        <div className="relative shrink-0">
                          <img src={row.image} alt={row.displayName} className="h-28 w-28 rounded-3xl object-cover" />
                          {inviteMode && (
                            <button 
                              onClick={() => toggleTalentSelection(row.professionalId)}
                              className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                selectedTalentIds.has(row.professionalId)
                                ? 'bg-black border-black text-white scale-110'
                                : 'bg-white border-gray-200 text-transparent hover:border-black'
                              }`}
                            >
                              <Check size={16} strokeWidth={4} className={selectedTalentIds.has(row.professionalId) ? 'opacity-100' : 'opacity-0'} />
                            </button>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <h4 className="text-2xl md:text-3xl font-black text-brand-primary truncate tracking-tight">{row.displayName}</h4>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b2b6bc]">{row.talentCode}</span>
                          </div>
                          <p className="mt-1.5 text-[#5c6777] font-medium capitalize text-base md:text-lg">
                            {row.role.replace('_', ' ')} <span className="mx-2 text-gray-200">•</span> {row.level}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="text-[9px] font-black uppercase tracking-[0.25em] text-[#b2b6bc]">Availability</div>
                        <div className="mt-2 flex items-center gap-2 text-base md:text-lg font-black text-[#101722]">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          {row.availability || 'Immediate'}
                        </div>
                      </div>

                      {!inviteMode && (
                        <Button
                          className="h-14 px-10 bg-black hover:bg-black text-white uppercase tracking-[0.2em] text-[10px] font-black rounded-2xl"
                          onClick={() => openOpportunityModal(row.talent)}
                        >
                          SEND OPPORTUNITY
                        </Button>
                      )}

                      <button
                        type="button"
                        className="text-rose-500 text-[10px] font-black uppercase tracking-[0.25em] hover:text-rose-600 transition-colors"
                        onClick={() => toggleBench(row.talent)}
                        disabled={actionLoadingId === row.talent.id}
                      >
                        Remove
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'engagements' && (
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#05060b]">Engagements</h2>
              <p className="text-base md:text-lg text-[#6f7782]">Track your active and completed work allocations.</p>
            </div>

            {requestRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                <p className="text-2xl font-bold text-[#0a0f1a]">No engagement requests yet</p>
                <p className="mt-2 text-[#6f7782]">Send your first request from Bench to start tracking status here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {requestRows.map((row, index) => {
                  const professional = row.professional;
                  const image = professional?.avatarUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                  const name = professional?.fullName || professional?.user?.email?.split('@')[0] || 'Unknown Professional';

                  return (
                    <Card key={row.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
                      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr_0.7fr] gap-6 items-center">
                        <div className="flex items-center gap-5 min-w-0">
                          <img src={image} alt={name} className="h-24 w-24 rounded-xl object-cover" />
                          <div>
                            <h4 className="text-xl md:text-2xl font-bold text-brand-primary">{name}</h4>
                            <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#b2b6bc]">
                              {(professional?.position || 'Artist').replace('_', ' ')}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#b2b6bc]">Project</p>
                          <p className="text-lg md:text-xl font-bold text-brand-primary mt-1 line-clamp-1">{row.engagementBrief}</p>
                        </div>

                        <div className="justify-self-start xl:justify-self-end">
                          {row.status === 'accepted' ? (
                            <div className="flex flex-col items-end gap-2">
                              <span className={`inline-block px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-[0.18em] ${statusClass.accepted}`}>
                                Agreement Shared
                              </span>
                              <button
                                onClick={() => openUpdateAgreement(row)}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary hover:text-brand-primary/80 transition-colors"
                              >
                                Update Agreement
                              </button>
                            </div>
                          ) : row.status === 'in_progress' || row.status === 'completed' ? (
                            <div className="flex flex-col items-end gap-2">
                              <span className={`inline-block px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-[0.18em] ${statusClass[row.status]}`}>
                                {row.status === 'in_progress' ? 'Hired' : 'Completed'}
                              </span>
                              <div className="text-right">
                                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#b2b6bc]">Hired Amount</p>
                                <p className="text-xl font-black text-emerald-600">{row.proposedBudget || 'N/A'}</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#b2b6bc] mb-2">Status</p>
                              <span className={`inline-block px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-[0.18em] ${statusClass[row.status] || statusClass.pending}`}>
                                {row.status.replace('_', ' ')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === 'open_roles' && (
          <section className="space-y-8">
            <HiringByStudio 
              onInviteFromBench={handleInviteFromBench} 
              onSearchTalent={() => setActiveTab('discover')}
            />
          </section>
        )}
      </main>

      <OpportunityModal 
        isOpen={opportunityModalOpen}
        onClose={() => setOpportunityModalOpen(false)}
        artist={selectedProfessional ? {
          name: selectedProfessional.fullName || selectedProfessional.user?.email?.split('@')[0] || 'Unknown',
          role: selectedProfessional.position || 'Artist',
          avatar: selectedProfessional.avatarUrl || FALLBACK_IMAGES[0]
        } : null}
        onSend={handleSendOpportunity}
      />

      {/* Confirm Invitation Modal */}
      <AnimatePresence>
        {confirmModalOpen && selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl p-10 space-y-10"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black tracking-tight text-[#1a1f28]">Confirm Invitation</h3>
                  <p className="text-sm font-medium text-gray-400">Are you sure you want to send this invitation?</p>
                </div>
                <button 
                  onClick={() => setConfirmModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-300" />
                </button>
              </div>

              {/* Job Details Preview */}
              <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                  <Briefcase size={24} className="text-gray-900" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-0.5 bg-black rounded text-[8px] font-black text-white tracking-widest uppercase">ID: ROLE-1</div>
                    <div className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-300">{selectedJob.projectType || 'FEATURE FILM PRODUCTION'}</div>
                  </div>
                  <h4 className="text-2xl font-black tracking-tight text-gray-900">{selectedJob.title}</h4>
                  <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.15em] text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      Hybrid
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={12} />
                      3D Format
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Artists */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    <Users size={14} />
                    Inviting {selectedTalentIds.size} Artists
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">BENCH SELECTION</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {benchDisplayRows
                    .filter(r => selectedTalentIds.has(r.professionalId))
                    .map(artist => (
                      <div key={artist.id} className="flex items-center gap-2 pl-1 pr-4 py-1 bg-white border border-gray-100 rounded-full shadow-sm">
                        <img src={artist.image} alt={artist.displayName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-[10px] font-bold text-gray-900">{artist.displayName}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={() => setConfirmModalOpen(false)}
                  className="flex-1 h-16 rounded-2xl border border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:bg-gray-50 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSendInvitations}
                  disabled={inviting}
                  className="flex-[2] h-16 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-black/10 hover:bg-black/90 transition-all disabled:opacity-50"
                >
                  {inviting ? 'SENDING...' : (
                    <>
                      <FileText size={16} />
                      SEND INVITATION
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Update Agreement Modal */}
      <AnimatePresence>
        {updateAgreementModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl p-10 space-y-10"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black tracking-tight text-[#1a1f28]">Update Agreement</h3>
                  <p className="text-sm font-medium text-gray-400">
                    Modify terms for {selectedRequest.professional?.fullName || 'the artist'}.
                  </p>
                </div>
                <button 
                  onClick={() => setUpdateAgreementModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-300" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">PROJECT TIMELINE</label>
                  <input 
                    type="text"
                    value={agreementForm.projectTimeline}
                    onChange={(e) => setAgreementForm({...agreementForm, projectTimeline: e.target.value})}
                    placeholder="e.g. 6 Months"
                    className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-bold text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">PROPOSED BUDGET</label>
                  <input 
                    type="text"
                    value={agreementForm.proposedBudget}
                    onChange={(e) => setAgreementForm({...agreementForm, proposedBudget: e.target.value})}
                    placeholder="e.g. $7,500"
                    className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-bold text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">START DATE</label>
                  <div className="relative">
                    <input 
                      type="date"
                      value={agreementForm.startDate}
                      onChange={(e) => setAgreementForm({...agreementForm, startDate: e.target.value})}
                      className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-bold text-sm" 
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">ENGAGEMENT BRIEF</label>
                  <textarea
                    value={agreementForm.engagementBrief}
                    onChange={(e) => setAgreementForm({...agreementForm, engagementBrief: e.target.value})}
                    placeholder="Brief description of the engagement"
                    className="w-full h-14 px-6 py-3 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-bold text-sm resize-none" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={() => setUpdateAgreementModalOpen(false)}
                  className="flex-1 h-16 rounded-2xl border border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:bg-gray-50 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleUpdateAgreement}
                  disabled={updatingAgreement}
                  className="flex-[2] h-16 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-black/10 hover:bg-black/90 transition-all disabled:opacity-50"
                >
                  {updatingAgreement ? 'UPDATING...' : (
                    <>
                      <FileText size={16} />
                      UPDATE AGREEMENT
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudioDashboard;
