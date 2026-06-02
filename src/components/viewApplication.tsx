import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  Users, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Briefcase, 
  ChevronDown, 
  FileText,
  ExternalLink,
  MoreVertical,
  BarChart3,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from './Button';
import Card from './Card';
import Badge from './Badge';
import SEO from './SEO';
import { getJobApplications, getStudioJobPostings, updateApplicationStatus, finalizeAgreement } from '../services/studioServices';
import { BASE_URL } from '../utils/urls';
import { toast } from 'react-toastify';

interface Applicant {
  id: string;
  name: string;
  talentId: string;
  role: string;
  experience: string;
  matchScore: number;
  avatar: string;
  isVerified: boolean;
  position: string;
  primarySkill: string;
  currentCTC: string;
  expectedCTC: string;
  noticePeriod: string;
  relocationPref: string;
  availability: string;
  location: string;
  status: 'applications' | 'shortlisting' | 'discussion' | 'agreement' | 'hired' | 'rejected';
  contactInfoShared?: boolean;
  email?: string;
  phone?: string;
  agreementDetails?: any;
}

const getFileUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const mapDbStatusToFrontend = (dbStatus: string): Applicant['status'] => {
  if (dbStatus === 'applied') return 'applications';
  if (dbStatus === 'shortlisted') return 'shortlisting';
  return dbStatus as Applicant['status'];
};

const ViewApplication: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(true);
  const [dbApplicants, setDbApplicants] = useState<any[]>([]);
  const [jobDetails, setJobDetails] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<Applicant['status']>('applications');
  const [searchQuery, setSearchQuery] = useState('');

  // Agreement Finalization Form State
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [agreementForm, setAgreementForm] = useState({
    currency: 'USD',
    amount: '',
    startDate: '',
    duration: '',
  });

  const fetchData = useCallback(async () => {
    if (!token || !jobId) return;
    try {
      setLoading(true);
      const [appsRes, jobsRes] = await Promise.all([
        getJobApplications(token, Number(jobId)),
        getStudioJobPostings(token)
      ]);

      if (appsRes.ok) {
        const body = await appsRes.json();
        setDbApplicants(Array.isArray(body?.data) ? body.data : []);
      }

      if (jobsRes.ok) {
        const body = await jobsRes.json();
        const postings = Array.isArray(body?.data) ? body.data : [];
        const currentJob = postings.find((p: any) => p.id === Number(jobId));
        if (currentJob) {
          setJobDetails(currentJob);
        }
      }
    } catch (err) {
      console.error('Error fetching applications data:', err);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [token, jobId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (appId: number, nextStatus: string) => {
    if (!token) return;
    try {
      const res = await updateApplicationStatus(token, appId, { status: nextStatus });
      if (res.ok) {
        toast.success(`Applicant moved to ${nextStatus}`);
        fetchData();
      } else {
        toast.error('Failed to update applicant status');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating status');
    }
  };

  const handleToggleContact = async (appId: number, currentVal: boolean) => {
    if (!token) return;
    try {
      const res = await updateApplicationStatus(token, appId, { contactInfoShared: !currentVal });
      if (res.ok) {
        toast.success(currentVal ? 'Contact details hidden' : 'Contact details shared');
        fetchData();
      } else {
        toast.error('Failed to toggle contact information');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating contact permission');
    }
  };

  const openAgreementModal = (appId: number, existingDetails?: any) => {
    setSelectedAppId(appId);
    setAgreementForm({
      currency: existingDetails?.currency || 'USD',
      amount: existingDetails?.amount || '',
      startDate: existingDetails?.startDate || '',
      duration: existingDetails?.duration || '',
    });
    setIsAgreementModalOpen(true);
  };

  const handleFinalizeAgreement = async () => {
    if (!token || !selectedAppId) return;
    try {
      const res = await finalizeAgreement(token, selectedAppId, agreementForm);
      if (res.ok) {
        toast.success('Agreement terms shared with artist');
        setIsAgreementModalOpen(false);
        fetchData();
      } else {
        toast.error('Failed to save agreement terms');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error finalizing agreement');
    }
  };

  const getTabCount = (tabId: string) => {
    return dbApplicants.filter(a => mapDbStatusToFrontend(a.status) === tabId).length;
  };

  const tabs = [
    { id: 'applications', label: 'APPLICATIONS', count: getTabCount('applications') },
    { id: 'shortlisting', label: 'SHORTLISTING', count: getTabCount('shortlisting') },
    { id: 'discussion', label: 'DISCUSSION', count: getTabCount('discussion') },
    { id: 'agreement', label: 'AGREEMENT', count: getTabCount('agreement') },
    { id: 'hired', label: 'HIRED', count: getTabCount('hired') },
    { id: 'rejected', label: 'REJECTED', count: getTabCount('rejected') },
  ];

  const mappedApplicants: Applicant[] = dbApplicants.map((item: any) => {
    const pro = item.professional;
    const name = pro?.fullName || pro?.user?.email?.split('@')[0] || 'Unknown';
    const avatar = pro?.avatarUrl ? getFileUrl(pro.avatarUrl) : `https://picsum.photos/seed/${item.id}/200/200`;
    
    return {
      id: String(item.id),
      name,
      talentId: pro?.user?.talentId?.talentCode || `AUI-${String(pro?.id).padStart(6, '0')}`,
      role: item.jobPosting?.title || 'Artist',
      experience: pro?.experienceYears ? `${pro.experienceYears}y Exp` : '0y Exp',
      matchScore: 98,
      avatar,
      isVerified: true,
      position: pro?.position || 'Artist',
      primarySkill: pro?.primarySkill || 'Production',
      currentCTC: item.verifiedResponse?.currentCTC || '—',
      expectedCTC: item.verifiedResponse?.expectedCTC || '—',
      noticePeriod: item.verifiedResponse?.noticePeriod || 'Immediate',
      relocationPref: item.verifiedResponse?.relocationPreference || 'Yes',
      availability: item.verifiedResponse?.availability || 'Available Now',
      location: item.verifiedResponse?.location || pro?.location || 'India',
      status: mapDbStatusToFrontend(item.status),
      contactInfoShared: item.contactInfoShared,
      email: pro?.user?.email,
      phone: pro?.user?.phone,
      agreementDetails: item.agreementDetails,
    };
  });

  const filteredApplicants = mappedApplicants
    .filter(a => a.status === activeTab)
    .filter(a => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.talentId.toLowerCase().includes(q) ||
        a.primarySkill.toLowerCase().includes(q) ||
        a.position.toLowerCase().includes(q)
      );
    });

  const renderApplicantCard = (applicant: Applicant) => (
    <Card key={applicant.id} className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-premium hover:shadow-premium-hover transition-all duration-500 mb-8 overflow-hidden relative group">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Section: Profile Info */}
        <div className="w-full lg:w-1/3 space-y-8">
          <div className="flex gap-6">
            <div className="relative w-32 h-32 shrink-0">
              <img src={applicant.avatar} alt={applicant.name} className="w-full h-full rounded-[2rem] object-cover" />
              <div className="absolute -bottom-2 -left-2 -right-2 bg-black/80 backdrop-blur-sm text-[8px] font-black text-white py-1.5 px-2 rounded-lg text-center uppercase tracking-widest">
                PROFILE VERIFIED
              </div>
            </div>
            <div className="space-y-3 pt-2 min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-black tracking-tight text-[#1a1f28] truncate">{applicant.name}</h3>
                {applicant.isVerified && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full shrink-0">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">VERIFIED</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                <span>{applicant.talentId}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                <span className="truncate">{applicant.role}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                <span>{applicant.experience}</span>
              </div>

              {applicant.contactInfoShared && (
                <div className="mt-3 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-[10px] space-y-1">
                  <p className="font-black text-emerald-700 uppercase tracking-widest">Direct Contact Details</p>
                  <p className="font-semibold text-gray-700">Email: <span className="font-mono">{applicant.email || '—'}</span></p>
                  {applicant.phone && (
                    <p className="font-semibold text-gray-700">Phone: <span className="font-mono">{applicant.phone}</span></p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="text-[8px] font-black uppercase tracking-[0.25em] text-gray-300">POSITION</div>
              <div className="p-5 bg-white border border-gray-100 rounded-3xl text-[10px] font-black text-gray-900 text-center min-h-[70px] flex items-center justify-center capitalize">
                {applicant.position}
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-[8px] font-black uppercase tracking-[0.25em] text-gray-300">PRIMARY SKILL</div>
              <div className="p-5 bg-white border border-gray-100 rounded-3xl text-[10px] font-black text-purple-600 text-center min-h-[70px] flex items-center justify-center capitalize">
                {applicant.primarySkill}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Evaluations */}
        <div className="w-full lg:w-1/2">
          <div className="bg-gray-50/50 rounded-[2.5rem] p-8 border border-gray-100/50 h-full flex flex-col justify-between">
            <div className="text-[8px] font-black uppercase tracking-[0.25em] text-gray-300 mb-8">COMP & NOTICE EVALUATION</div>
            
            <div className="grid grid-cols-2 gap-y-8">
              <div className="space-y-2">
                <div className="text-[7px] font-black uppercase tracking-widest text-gray-300">CURRENT COMPENSATION</div>
                <div className="text-lg font-black text-gray-900">{applicant.currentCTC}</div>
              </div>
              <div className="space-y-2">
                <div className="text-[7px] font-black uppercase tracking-widest text-gray-300">EXPECTED COMPENSATION</div>
                <div className="text-lg font-black text-purple-600">{applicant.expectedCTC}</div>
              </div>
              <div className="space-y-2">
                <div className="text-[7px] font-black uppercase tracking-widest text-gray-300">NOTICE PERIOD</div>
                <div className="mt-2 px-4 py-1.5 bg-white border border-gray-100 rounded-full w-fit text-[9px] font-black text-gray-900">
                  {applicant.noticePeriod || 'Immediate'}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-[7px] font-black uppercase tracking-widest text-gray-300">RELOCATION PREF</div>
                <div className="mt-2 px-4 py-1.5 bg-white border border-gray-100 rounded-full w-fit text-[9px] font-black text-gray-900">
                  {applicant.relocationPref}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Response Sheet Bar */}
      <div className="mt-12 p-6 bg-purple-50/30 border border-purple-100/30 rounded-3xl flex items-center justify-between group/bar hover:bg-purple-50 transition-all cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-purple-600">
            <FileText size={20} />
          </div>
          <div className="space-y-0.5 font-sans">
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Verified Info Response Sheet</h4>
            <p className="text-[8px] font-medium text-gray-400">Studio-defined response equivalent (AUI Secured Checklist)</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-1.5 bg-white border border-purple-100 rounded-full text-[8px] font-black text-purple-600 uppercase tracking-widest">
            PASSPORT COMPLETED
          </div>
          <ChevronDown size={16} className="text-gray-300 group-hover/bar:text-purple-600 transition-colors" />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-10 pt-10 border-t border-gray-50 flex flex-wrap gap-4">
        <button 
          onClick={() => navigate(`/talent/${applicant.talentId}`)}
          className="h-14 px-10 bg-white border border-gray-100 text-[#1a1f28] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
        >
          VIEW PROFILE
        </button>
        
        {activeTab === 'applications' && (
          <>
            <button 
              onClick={() => handleStatusUpdate(Number(applicant.id), 'shortlisted')}
              className="h-14 px-16 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black/90 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
            >
              SHORTLIST
            </button>
            <button 
              onClick={() => handleStatusUpdate(Number(applicant.id), 'rejected')}
              className="h-14 px-10 bg-white border border-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
            >
              TRY NEXT TIME
            </button>
          </>
        )}

        {activeTab === 'shortlisting' && (
          <>
            <button 
              onClick={() => handleStatusUpdate(Number(applicant.id), 'discussion')}
              className="h-14 px-16 bg-[#2563EB] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#1d4ed8] transition-all active:scale-[0.98] shadow-lg shadow-blue-500/10"
            >
              MOVE TO DISCUSSION
            </button>
            <button 
              onClick={() => handleStatusUpdate(Number(applicant.id), 'rejected')}
              className="h-14 px-10 bg-white border border-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
            >
              TRY NEXT TIME
            </button>
          </>
        )}

        {activeTab === 'discussion' && (
          <>
            <button 
              onClick={() => handleToggleContact(Number(applicant.id), !!applicant.contactInfoShared)}
              className={`h-14 px-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${
                applicant.contactInfoShared 
                  ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/10'
              }`}
            >
              <UserPlus size={16} />
              {applicant.contactInfoShared ? 'HIDE CONTACT INFO' : 'GET CONTACT INFO'}
            </button>
            <button 
              onClick={() => handleStatusUpdate(Number(applicant.id), 'agreement')}
              className="h-14 px-12 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black/90 transition-all shadow-lg shadow-black/10"
            >
              <CheckCircle2 size={16} className="text-emerald-500" />
              SEND AGREEMENT SHEET
            </button>
            <button 
              onClick={() => handleStatusUpdate(Number(applicant.id), 'rejected')}
              className="h-14 px-10 bg-white border border-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
            >
              REJECT
            </button>
          </>
        )}

        {activeTab === 'agreement' && (
          <>
            <button 
              onClick={() => openAgreementModal(Number(applicant.id), applicant.agreementDetails)}
              className="h-14 px-12 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black/90 transition-all shadow-lg shadow-black/10"
            >
              UPDATE AGREEMENT
            </button>
            
            <button 
              onClick={() => handleStatusUpdate(Number(applicant.id), 'hired')}
              className="h-14 px-12 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-lg"
            >
              MARK AS HIRED
            </button>

            <div className="h-14 px-8 bg-purple-50 border border-purple-100 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                <Clock size={18} />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest">AGREEMENT SHARED</div>
                <div className="text-[8px] font-medium text-purple-400">Wait for artist final confirmation</div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'hired' && (
          <div className="flex items-center gap-4 w-full flex-wrap">
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl min-w-[240px]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ARTIST HIRED</div>
                <div className="text-[8px] font-medium text-emerald-400">Successfully locked this talent</div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-4 min-w-[320px]">
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center">
                <div className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-1">CURRENT COMP</div>
                <div className="text-[11px] font-black text-gray-900">{applicant.currentCTC}</div>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center">
                <div className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-1">EXPECTED COMP</div>
                <div className="text-[11px] font-black text-gray-900">{applicant.expectedCTC}</div>
              </div>
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-center">
                <div className="text-[7px] font-black text-emerald-600 uppercase tracking-widest mb-1">FINAL SETTLEMENT</div>
                <div className="text-[11px] font-black text-emerald-600">
                  {applicant.agreementDetails?.currency || 'USD'} {applicant.agreementDetails?.amount || '—'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfc]">
        <div className="w-12 h-12 border-4 border-t-purple-600 border-gray-200 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfc] text-left">
      <SEO 
        title="View Applications" 
        description="Review applicants, match scores, notices, and verify credentials for open roles on AUI." 
        keywords="view applications, applicant tracking, recruitment, aui roles" 
      />
      <div className="max-w-[1440px] mx-auto px-10 py-12 space-y-12">
        {/* Top Header Card */}
        <Card className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-premium flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate(-1)}
              className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all"
            >
              <ArrowLeft size={20} className="text-gray-900" />
            </button>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-black tracking-tight text-[#1a1f28]">{jobDetails?.title || 'Job Opening'}</h1>
                <div className="px-3 py-1 bg-emerald-50 rounded-full flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
                    {jobDetails?.status ? jobDetails.status.toUpperCase() : 'OPEN'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                <ArrowRight size={14} className="text-gray-200" />
                <span className="capitalize">{jobDetails?.workMode || 'Production Mode'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                <span>{jobDetails?.artistCount || 1} Positions</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                <span className="text-emerald-500">{jobDetails?.filledCount || 0} Hired</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex gap-12 overflow-x-auto pb-4 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Applicant['status'])}
                className={`pb-2 relative flex items-center gap-3 transition-all shrink-0 ${
                  activeTab === tab.id 
                  ? 'text-gray-900 font-bold' 
                  : 'text-gray-300 hover:text-gray-400 font-medium'
                }`}
              >
                <span className="text-xs uppercase tracking-[0.25em]">{tab.label}</span>
                <div className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                  activeTab === tab.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {tab.count}
                </div>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input
              type="text"
              placeholder="Search by name, skill, Talent ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-20 pl-16 pr-8 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-medium outline-none focus:ring-2 focus:ring-black/5 transition-all shadow-sm"
            />
          </div>
          <button className="h-20 px-8 bg-white border border-gray-100 rounded-[1.5rem] flex items-center gap-3 shadow-sm hover:bg-gray-50 transition-all shrink-0">
            <SlidersHorizontal size={18} className="text-gray-300" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">FILTERS</span>
          </button>
          <button className="h-20 px-10 bg-black text-white rounded-[1.5rem] flex items-center gap-4 shadow-xl shadow-black/10 shrink-0">
            <BarChart3 size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">SORT BY: NEWEST</span>
          </button>
        </div>

        {/* Content Section */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {filteredApplicants.length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {filteredApplicants.map(renderApplicantCard)}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-[3rem] border border-dashed border-gray-200 bg-white py-32 text-center"
              >
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                  <Users size={32} className="text-gray-300" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-[#1a1f28] mb-4 font-sans">No applicants found</h2>
                <p className="text-gray-400 font-medium mb-10">Invite verified talent from our pool or share this role link.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => navigate('/hire')} className="h-14 px-12 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/10">
                    INVITE VERIFIED TALENT
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Agreement Terms Overlay Modal */}
      {isAgreementModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 max-w-md w-full shadow-2xl space-y-6">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight font-sans">Finalize Agreement Terms</h3>
            <p className="text-xs text-gray-400">Specify compensation and schedule details below for the artist's ledger finalization.</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Currency</label>
                  <select
                    value={agreementForm.currency}
                    onChange={(e) => setAgreementForm(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold outline-none focus:border-purple-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Amount / month</label>
                  <input
                    type="number"
                    value={agreementForm.amount}
                    onChange={(e) => setAgreementForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="e.g. 5000"
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Start Date</label>
                <input
                  type="date"
                  value={agreementForm.startDate}
                  onChange={(e) => setAgreementForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Duration</label>
                <input
                  type="text"
                  value={agreementForm.duration}
                  onChange={(e) => setAgreementForm(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g. 6 Months"
                  className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsAgreementModalOpen(false)}
                className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalizeAgreement}
                className="flex-1 h-12 rounded-xl bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/10"
              >
                Share Agreement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplication;
