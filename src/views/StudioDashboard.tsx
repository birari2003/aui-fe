import React from 'react';
import { motion } from 'motion/react';
import { BadgeCheck, Bookmark, Briefcase, Calendar, Clock, RotateCcw, ShieldCheck, Star, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { searchProfessionals } from '../services/searchServices';
import {
  addTalentToBench,
  createStudioJobPosting,
  createStudioRequestProfessional,
  getStudioJobPostings,
  getStudioRequestProfessionals,
  getTalentBench,
  removeTalentFromBench,
} from '../services/studioServices';
import { View } from '../types';

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

type JobPostingRow = {
  id: number;
  title: string;
  projectType?: string;
  experienceRequired?: string;
  artistCount: number;
  startDate?: string;
  description?: string;
  status: 'open' | 'paused' | 'closed';
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
  const [jobRows, setJobRows] = React.useState<JobPostingRow[]>([]);

  const [engagementModalOpen, setEngagementModalOpen] = React.useState(false);
  const [selectedProfessional, setSelectedProfessional] = React.useState<ProfessionalRow | null>(null);
  const [submittingEngagement, setSubmittingEngagement] = React.useState(false);
  const [postingRole, setPostingRole] = React.useState(false);

  const [engagementForm, setEngagementForm] = React.useState({
    projectTimeline: '',
    productionType: 'film' as 'film' | 'tv' | 'web' | 'ads' | 'other',
    engagementBrief: '',
    proposedBudget: '',
    startDate: '',
  });

  const [jobForm, setJobForm] = React.useState({
    title: '',
    projectType: 'Feature Film Production',
    experienceRequired: '5+ Years',
    artistCount: 1,
    startDate: '',
    description: '',
  });

  const [activeTab, setActiveTab] = React.useState<'discover' | 'bench' | 'engagements' | 'open_roles'>('discover');

  const token = localStorage.getItem('token');

  const fetchStudioData = React.useCallback(async () => {
    if (!token) return;

    try {
      const [benchRes, requestRes, jobRes] = await Promise.all([
        getTalentBench(token),
        getStudioRequestProfessionals(token),
        getStudioJobPostings(token),
      ]);

      if (benchRes.ok) {
        const benchPayload = await benchRes.json();
        setBenchRows(Array.isArray(benchPayload?.data) ? benchPayload.data : []);
      }

      if (requestRes.ok) {
        const requestPayload = await requestRes.json();
        setRequestRows(Array.isArray(requestPayload?.data) ? requestPayload.data : []);
      }

      if (jobRes.ok) {
        const jobPayload = await jobRes.json();
        setJobRows(Array.isArray(jobPayload?.data) ? jobPayload.data : []);
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

                <div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8b9099]">Talent ID</div>
                  <div className="mt-1.5 rounded-[10px] border border-[#d9dce2] bg-[#fbfbfc] px-3.5 py-2.5">
                    <div className="font-mono text-[20px] md:text-[24px] font-semibold leading-[0.95] tracking-[0.18em] text-[#1d2a44]">
                      {talent.talentCode}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 border-b border-[#e5e7eb] pb-3.5 sm:grid-cols-2 sm:gap-0 sm:pb-4">
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

                <div className={`rounded-[10px] px-4 py-3 ${highlight.className}`}>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 text-[#6f7580]">
                <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.14em]">
                  <ShieldCheck size={13} className="text-[#6d7480]" />
                  Identity Verified
                </div>
                <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.14em]">
                  <Briefcase size={13} className="text-[#6d7480]" />
                  Work Verified
                </div>
                <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.14em]">
                  <BadgeCheck size={13} className="text-[#6d7480]" />
                  Trusted by AUI
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

  const openEngagementModal = (professional: ProfessionalRow) => {
    setSelectedProfessional(professional);
    setEngagementForm({
      projectTimeline: '',
      productionType: 'film',
      engagementBrief: '',
      proposedBudget: '',
      startDate: '',
    });
    setEngagementModalOpen(true);
  };

  const submitEngagementRequest = async () => {
    if (!token || !selectedProfessional) return;

    try {
      setSubmittingEngagement(true);
      const response = await createStudioRequestProfessional(token, {
        professionalId: selectedProfessional.id,
        projectTimeline: engagementForm.projectTimeline,
        productionType: engagementForm.productionType,
        engagementBrief: engagementForm.engagementBrief,
        proposedBudget: engagementForm.proposedBudget || undefined,
        startDate: engagementForm.startDate || undefined,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body?.message || 'Failed to send engagement request.');
        return;
      }

      setEngagementModalOpen(false);
      setSelectedProfessional(null);
      await fetchStudioData();
      setActiveTab('engagements');
    } catch (err) {
      console.error('Failed to submit engagement request:', err);
      setError('Failed to send engagement request.');
    } finally {
      setSubmittingEngagement(false);
    }
  };

  const submitJobPosting = async () => {
    if (!token || !jobForm.title.trim()) return;

    try {
      setPostingRole(true);
      const response = await createStudioJobPosting(token, {
        title: jobForm.title.trim(),
        projectType: jobForm.projectType,
        experienceRequired: jobForm.experienceRequired,
        artistCount: Number(jobForm.artistCount || 1),
        startDate: jobForm.startDate || undefined,
        description: jobForm.description || undefined,
        status: 'open',
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body?.message || 'Failed to post role.');
        return;
      }

      setJobForm({
        title: '',
        projectType: 'Feature Film Production',
        experienceRequired: '5+ Years',
        artistCount: 1,
        startDate: '',
        description: '',
      });
      await fetchStudioData();
    } catch (err) {
      console.error('Failed to post role:', err);
      setError('Failed to post role.');
    } finally {
      setPostingRole(false);
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
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#05060b]">Your Bench</h2>
              <p className="text-base md:text-lg text-[#6f7782]">Shortlisted talent ready for quick engagement.</p>
            </div>

            {benchDisplayRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                <p className="text-2xl font-bold text-[#0a0f1a]">Your bench is empty</p>
                <p className="mt-2 text-[#6f7782]">Bookmark professionals from Discover to start building your team.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {benchDisplayRows.map((row) => (
                  <Card key={row.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
                    <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_0.7fr_auto_auto] gap-6 items-center">
                      <div className="flex items-center gap-5 min-w-0">
                        <img src={row.image} alt={row.displayName} className="h-24 w-24 rounded-2xl object-cover" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <h4 className="text-xl md:text-2xl font-bold text-brand-primary truncate">{row.displayName}</h4>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b2b6bc]">{row.talentCode}</span>
                          </div>
                          <p className="mt-1 text-[#5c6777] capitalize text-sm md:text-base">
                            {row.role.replace('_', ' ')} <span className="mx-2 text-gray-300">•</span> {row.level}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#b2b6bc]">Availability</div>
                        <div className="mt-2 flex items-center gap-2 text-sm md:text-base font-semibold text-[#101722]">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          {row.availability || 'Immediate'}
                        </div>
                      </div>

                      <Button
                        className="h-14 px-10 bg-black hover:bg-black text-white uppercase tracking-[0.18em] text-xs"
                        onClick={() => openEngagementModal(row.talent)}
                      >
                        Request Engagement
                      </Button>

                      <button
                        type="button"
                        className="text-rose-500 text-xs font-bold uppercase tracking-[0.22em]"
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
                          <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#b2b6bc] mb-2">Status</p>
                          <span className={`inline-block px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-[0.18em] ${statusClass[row.status] || statusClass.pending}`}>
                            {row.status.replace('_', ' ')}
                          </span>
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
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#05060b]">Open Roles</h2>
                <p className="text-base md:text-lg text-[#6f7782]">Connect with the right talent for your upcoming requirements.</p>
              </div>
              <Button className="h-12 px-10 bg-black hover:bg-black text-white uppercase tracking-[0.2em] text-[10px]" onClick={submitJobPosting} loading={postingRole}>
                Post Role
              </Button>
            </div>

            <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <input
                  value={jobForm.title}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Role title"
                  className="lg:col-span-2 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
                />
                <input
                  value={jobForm.projectType}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, projectType: e.target.value }))}
                  placeholder="Project type"
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
                />
                <input
                  value={jobForm.experienceRequired}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, experienceRequired: e.target.value }))}
                  placeholder="Experience"
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
                />
                <input
                  type="number"
                  min={1}
                  value={jobForm.artistCount}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, artistCount: Number(e.target.value || 1) }))}
                  placeholder="Artists"
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
                />
                <input
                  type="date"
                  value={jobForm.startDate}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
                />
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                  className="md:col-span-2 lg:col-span-6 min-h-[90px] rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
                />
              </div>
            </Card>

            {jobRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                <p className="text-xl md:text-2xl font-bold text-[#0a0f1a]">No open roles yet</p>
                <p className="mt-2 text-sm md:text-base text-[#6f7782]">Post your first role requirement using the form above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {jobRows.map((job) => (
                  <Card key={job.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 space-y-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-brand-primary">{job.title}</h3>
                        <Badge variant="outline" className="mt-3 text-[10px] uppercase tracking-[0.18em]">{job.projectType || 'Production'}</Badge>
                      </div>
                      <div className="rounded-2xl border border-gray-200 px-5 py-4 text-center min-w-[80px]">
                        <div className="text-lg font-bold text-brand-primary">{job.artistCount}</div>
                        <div className="text-[9px] uppercase tracking-[0.2em] text-[#b2b6bc] font-bold mt-1">Artists</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 border-y border-gray-100 py-5">
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#b2b6bc]">Experience</div>
                        <div className="text-lg md:text-xl font-bold mt-1">{job.experienceRequired || '-'}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#b2b6bc]">Start Date</div>
                        <div className="text-lg md:text-xl font-bold mt-1">{job.startDate || '-'}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="secondary" className="h-11 uppercase tracking-[0.15em] text-[10px]">Applicants</Button>
                      <Button variant="secondary" className="h-11 uppercase tracking-[0.15em] text-[10px]">Manage Role</Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {engagementModalOpen && selectedProfessional && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto bg-white rounded-[2rem] overflow-hidden border border-white/40">
            <div className="bg-black text-white p-10 relative">
              <button
                type="button"
                onClick={() => setEngagementModalOpen(false)}
                className="absolute right-8 top-8 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X size={22} />
              </button>
              <h3 className="text-5xl font-bold">Request Engagement</h3>
              <div className="mt-4 text-sm uppercase tracking-[0.2em] text-white/70">Collaborate with</div>
              <div className="text-2xl font-semibold mt-1">{selectedProfessional.fullName || selectedProfessional.user?.email?.split('@')[0]}</div>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b2b6bc] block mb-2">Project Timeline</label>
                  <div className="relative">
                    <input
                      value={engagementForm.projectTimeline}
                      onChange={(e) => setEngagementForm((prev) => ({ ...prev, projectTimeline: e.target.value }))}
                      placeholder="e.g. 6 Months"
                      className="w-full rounded-xl border border-gray-200 bg-[#f7f7f8] px-5 py-4 pr-11 outline-none"
                    />
                    <Clock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b2b6bc] block mb-2">Production Type</label>
                  <select
                    value={engagementForm.productionType}
                    onChange={(e) => setEngagementForm((prev) => ({ ...prev, productionType: e.target.value as any }))}
                    className="w-full rounded-xl border border-gray-200 bg-[#f7f7f8] px-5 py-4 outline-none"
                  >
                    <option value="film">Film</option>
                    <option value="tv">TV</option>
                    <option value="web">Web</option>
                    <option value="ads">Ads</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b2b6bc] block mb-2">Engagement Brief</label>
                <textarea
                  value={engagementForm.engagementBrief}
                  onChange={(e) => setEngagementForm((prev) => ({ ...prev, engagementBrief: e.target.value }))}
                  placeholder="Briefly describe the scope of work and specific requirements for this artist..."
                  className="w-full min-h-[130px] rounded-2xl border border-gray-200 bg-[#f7f7f8] px-5 py-4 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b2b6bc] block mb-2">Proposed Budget</label>
                  <input
                    value={engagementForm.proposedBudget}
                    onChange={(e) => setEngagementForm((prev) => ({ ...prev, proposedBudget: e.target.value }))}
                    placeholder="e.g. $15k - $30k"
                    className="w-full rounded-xl border border-gray-200 bg-[#f7f7f8] px-5 py-4 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b2b6bc] block mb-2">Start Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={engagementForm.startDate}
                      onChange={(e) => setEngagementForm((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-[#f7f7f8] px-5 py-4 pr-11 outline-none"
                    />
                    <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setEngagementModalOpen(false)}
                  className="text-xs font-bold uppercase tracking-[0.22em] text-[#5d6470]"
                >
                  Discard
                </button>
                <Button
                  className="h-14 px-12 bg-black hover:bg-black text-white uppercase tracking-[0.17em] text-xs"
                  onClick={submitEngagementRequest}
                  loading={submittingEngagement}
                  disabled={!engagementForm.projectTimeline || !engagementForm.engagementBrief}
                >
                  Send Formal Proposal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioDashboard;
