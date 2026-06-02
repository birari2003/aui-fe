import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Clock, ChevronRight, X, ShieldCheck, 
  MapPin, CheckCircle2, Phone, Mail, FileText, 
  Briefcase as Portfolio, Zap, Star, MessageCircle, DollarSign, Calendar,
  ChevronDown, ChevronUp, ExternalLink, Sparkles, Shield,
  ArrowRight, Trash2, Plus, Filter, BarChart
} from 'lucide-react';
import { toast } from 'react-toastify';
import Card from './Card';
import Button from './Button';
import { getJobApplications, updateApplicationStatus, finalizeAgreement } from '../services/studioServices';
import { BASE_URL } from '../utils/urls';

const getFileUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
};

const ResponseSheet = ({ app }: { app: any }) => {
  const verified = app.verifiedResponse || {};
  const timeline = verified.experienceTimeline || [];
  const ledger = verified.workLedger || [];
  const links = verified.showreelLinks || [];

  const InfoBox = ({ label, value }: { label: string, value: string }) => (
    <div className="p-6 bg-white rounded-3xl border border-gray-100/80 shadow-sm space-y-1 text-left">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</p>
      <p className="font-bold text-gray-900 text-sm truncate">{value || 'Unfilled'}</p>
    </div>
  );

  return (
    <div className="p-10 space-y-12 bg-[#F9FAFB]/50 border-t border-gray-100 text-left animate-in slide-in-from-top-4 duration-500">
      {/* Contact Information (Only visible if shared) */}
      {app.contactInfoShared && (
        <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] flex flex-wrap gap-10 items-center animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-emerald-600/50 uppercase tracking-widest leading-none mb-1">PHONE NUMBER</p>
              <p className="font-black text-emerald-900 text-lg">{app.professional?.user?.phone || 'Not available'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-emerald-600/50 uppercase tracking-widest leading-none mb-1">EMAIL ADDRESS</p>
              <p className="font-black text-emerald-900 text-lg">{app.professional?.user?.email || 'Not available'}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3 bg-emerald-100/50 px-6 py-3 rounded-2xl border border-emerald-100">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">CONTACT INFO SHARED</span>
          </div>
        </div>
      )}

      {/* Basic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoBox label="TALENT ID" value={verified.talentId} />
        <InfoBox label="ARTIST NAME" value={verified.name} />
        <InfoBox label="PRIMARY SKILL" value={verified.primarySkill} />
        
        <InfoBox label="POSITION" value={verified.position} />
        <InfoBox label="EXPERIENCE" value={verified.experience} />
        <InfoBox label="CURRENT COMPANY" value={verified.currentCompany} />
        
        <InfoBox label="CURRENT CTC" value={verified.currentCTC} />
        <InfoBox label="EXPECTED CTC" value={verified.expectedCTC} />
        <InfoBox label="NOTICE PERIOD" value={verified.noticePeriod} />
        
        <InfoBox label="CURRENT LOCATION" value={verified.location} />
        <InfoBox label="RELOCATION PREFERENCE" value={verified.relocationPreference} />
      </div>

      {/* About Me */}
      <div className="space-y-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">ABOUT ME</p>
        <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm italic text-gray-500 text-sm leading-relaxed">
          {verified.aboutMe || "The artist did not specify a bio yet. They can fill this manually on the Direct Engagement Verification sheet."}
        </div>
      </div>

      {/* Showreel Links */}
      <div className="space-y-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">SHOWREEL LINK(S)</p>
        <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm space-y-4">
          {links.length > 0 ? links.map((link: string, i: number) => (
            <a 
              key={i} 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:border-[#7c00ff]/20 hover:shadow-md"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#7c00ff] border border-gray-100 shadow-sm">
                <Portfolio size={18} />
              </div>
              <span className="flex-1 font-bold text-sm text-[#7c00ff] truncate">{link}</span>
              <ExternalLink size={16} className="text-gray-300 group-hover:text-[#7c00ff] transition-colors" />
            </a>
          )) : (
            <p className="text-sm text-gray-400 italic">No showreel links provided</p>
          )}
        </div>
      </div>

      {/* Timeline & Ledger */}
      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-10">
        {/* Timeline */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7c00ff]" />
              <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">EXPERIENCE TIMELINE</p>
            </div>
            <span className="text-[8px] font-bold text-white uppercase tracking-widest px-2 py-1 rounded bg-[#7c00ff]/80">Auto-Compiled</span>
          </div>
          <div className="relative space-y-8 pl-8 before:absolute before:left-2 before:top-2 before:bottom-4 before:w-[1px] before:bg-gray-100">
            {timeline.map((item: any, i: number) => (
              <div key={i} className="relative text-left">
                <div className="absolute -left-7 top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-[#7c00ff] shadow-sm" />
                <p className="text-[10px] font-bold text-[#7c00ff] mb-1">{item.period}</p>
                <h5 className="font-black text-gray-900 text-sm leading-tight">{item.role}</h5>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{item.company}</p>
              </div>
            ))}
            {timeline.length === 0 && <p className="text-sm text-gray-400 italic">No timeline entries</p>}
          </div>
        </div>

        {/* Work Ledger */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">AUI VERIFIED WORK LEDGER</p>
            </div>
            <span className="text-[8px] font-bold text-orange-500 uppercase tracking-widest px-2 py-1 rounded bg-orange-50 border border-orange-100">Secure Ledger</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ledger.map((item: any, i: number) => (
              <div key={i} className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{item.year}</span>
                </div>
                <div>
                  <h6 className="font-black text-gray-900 mb-0.5 text-sm">{item.project}</h6>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.studio}</p>
                </div>
                <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">ROLE</p>
                    <p className="font-bold text-gray-600 text-[10px]">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
            {ledger.length === 0 && <p className="text-sm text-gray-400 italic">No ledger entries</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

interface HiringPipelineProps {
  jobId: number;
  jobTitle: string;
  onBack: () => void;
}

const HiringPipeline: React.FC<HiringPipelineProps> = ({ jobId, jobTitle, onBack }) => {
  const [activePhase, setActivePhase] = React.useState<'applied' | 'shortlisted' | 'discussion' | 'agreement' | 'hired' | 'rejected'>('applied');
  const [applications, setApplications] = React.useState<any[]>([]);
  const [allApplications, setAllApplications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedApp, setSelectedApp] = React.useState<any>(null);
  const [expandedAppId, setExpandedAppId] = React.useState<number | null>(null);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = React.useState(false);
  const [agreementForm, setAgreementForm] = React.useState({
    type: 'Contract',
    startDate: new Date().toISOString().split('T')[0],
    duration: '6 Months',
    compensationType: 'Monthly',
    currency: 'USD ($)',
    amount: '7500'
  });

  const token = localStorage.getItem('token');

  const fetchApplications = React.useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [filteredRes, allRes] = await Promise.all([
        getJobApplications(token, jobId, activePhase),
        getJobApplications(token, jobId)
      ]);

      if (filteredRes.ok) {
        const data = await filteredRes.json();
        setApplications(data.data);
      }
      if (allRes.ok) {
        const data = await allRes.json();
        setAllApplications(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  }, [token, jobId, activePhase]);

  React.useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const getPhaseCount = (phaseId: string) => {
    return allApplications.filter(app => app.status === phaseId).length;
  };

  const handleStatusUpdate = async (appId: number, nextStatus: string) => {
    if (!token) return;
    try {
      const res = await updateApplicationStatus(token, appId, { status: nextStatus });
      if (res.ok) {
        toast.success(`Artist moved to ${nextStatus}`);
        fetchApplications();
        if (selectedApp?.id === appId) setSelectedApp(null);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleFinalizeAgreement = async () => {
    if (!token || !selectedApp) return;
    try {
      const res = await finalizeAgreement(token, selectedApp.id, agreementForm);
      if (res.ok) {
        toast.success('Agreement sent to artist');
        setIsAgreementModalOpen(false);
        fetchApplications();
        setSelectedApp(null);
      }
    } catch (err) {
      toast.error('Failed to send agreement');
    }
  };

  const handleToggleContact = async (appId: number, currentVal: boolean) => {
    if (!token) return;
    try {
      const res = await updateApplicationStatus(token, appId, { contactInfoShared: !currentVal });
      if (res.ok) {
        toast.success(currentVal ? 'Contact info hidden' : 'Contact info shared');
        fetchApplications();
      }
    } catch (err) {
      toast.error('Failed to update contact visibility');
    }
  };

  const PHASES = [
    { id: 'applied', label: 'APPLICATIONS', icon: Users },
    { id: 'shortlisted', label: 'SHORTLISTING', icon: Star },
    { id: 'discussion', label: 'DISCUSSION', icon: MessageCircle },
    { id: 'agreement', label: 'AGREEMENT', icon: FileText },
    { id: 'hired', label: 'HIRED', icon: CheckCircle2 },
    { id: 'rejected', label: 'REJECTED', icon: X }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <button 
            onClick={onBack}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black flex items-center gap-2 transition-colors"
          >
            <ChevronRight className="rotate-180" size={14} /> Back to Open Roles
          </button>
          <h2 className="text-4xl font-black tracking-tight text-gray-900">
            Hiring Pipeline: <span className="text-[#7c00ff]">{jobTitle}</span>
          </h2>
        </div>
      </div>

      {/* Phase Tabs */}
      <div className="flex bg-gray-100/50 p-2 rounded-[2rem] gap-2 overflow-x-auto no-scrollbar">
        {PHASES.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
              activePhase === phase.id 
              ? 'bg-black text-white shadow-xl shadow-black/20' 
              : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <phase.icon size={16} />
            {phase.label}
            <span className={`ml-2 px-2 py-0.5 rounded-lg text-[9px] ${
              activePhase === phase.id ? 'bg-white text-black' : 'bg-gray-200 text-gray-500'
            }`}>
              {getPhaseCount(phase.id)}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7c00ff] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, skill, Talent ID..."
            className="w-full h-20 pl-16 pr-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-premium outline-none focus:border-[#7c00ff]/20 transition-all font-medium text-gray-900"
          />
        </div>
        <div className="flex gap-4">
          <button className="h-20 px-12 bg-white rounded-[2.5rem] border border-gray-100 shadow-premium flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-all">
            <Filter size={18} className="text-gray-400" /> FILTERS
          </button>
          <button className="h-20 px-10 bg-black text-white rounded-[1.5rem] shadow-2xl shadow-black/20 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] group">
            <BarChart size={18} className="text-gray-500 group-hover:text-white transition-colors" /> SORT BY: NEWEST
          </button>
        </div>
      </div>

      {/* Pipeline Content */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl animate-pulse" />)}
          </div>
        ) : applications.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/30">
            <Users className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-xl font-bold text-gray-400">No artists in this phase yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {applications.map((app) => (
              <Card 
                key={app.id}
                className={`rounded-[3rem] border transition-all overflow-hidden ${
                  selectedApp?.id === app.id 
                  ? 'border-[#7c00ff] shadow-premium shadow-[#7c00ff]/5' 
                  : 'border-gray-100 shadow-premium'
                }`}
                onClick={() => setSelectedApp(app)}
              >
                {/* Main Card Header */}
                <div className="p-10 flex flex-col lg:flex-row gap-10 items-start">
                  {/* Photo & Basic Info */}
                  <div className="flex gap-8 items-start flex-1">
                    <div className="relative">
                      <img 
                        src={getFileUrl(app.professional?.avatarUrl) || `https://picsum.photos/seed/${app.id}/200`} 
                        className="w-32 h-32 rounded-[2.5rem] object-cover shadow-2xl shadow-black/10" 
                        alt="" 
                      />
                      {app.professional?.verificationStatus && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full whitespace-nowrap border-2 border-white shadow-lg">
                          Profile Verified
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4 pt-2 flex-1">
                      <div className="flex items-center gap-4">
                        <h4 className="text-4xl font-black text-gray-900 tracking-tight">{app.professional?.fullName}</h4>
                        {app.professional?.verificationStatus && (
                          <span className="flex items-center gap-2 bg-[#E9FFF6] text-[#00CE7C] text-[10px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full border border-[#00CE7C]/10">
                            <CheckCircle2 size={12} fill="#00CE7C" className="text-white" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest">
                        <span>{app.professional?.user?.talentId?.talentCode || 'AUI-8RP-S'}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                        <span className="text-gray-900">{app.professional?.currentRole || 'Character Animator'}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                        <span>{app.professional?.experienceYears || '8'}y Exp</span>
                        
                        {app.contactInfoShared && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-emerald-200" />
                            <span className="flex items-center gap-2 text-emerald-600">
                              <Phone size={14} /> {app.professional?.user?.phone}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-emerald-200" />
                            <span className="flex items-center gap-2 text-emerald-600">
                              <Mail size={14} /> {app.professional?.user?.email}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Info Boxes */}
                      <div className="flex flex-wrap gap-4 pt-4">
                        <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex-1 min-w-[200px]">
                          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">POSITION</p>
                          <div className="px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <span className="font-bold text-gray-900 text-sm">{app.verifiedResponse?.position || app.professional?.currentRole}</span>
                          </div>
                        </div>
                        <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex-1 min-w-[200px]">
                          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">PRIMARY SKILL</p>
                          <div className="px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                            <span className="font-bold text-[#7c00ff] text-sm">{app.verifiedResponse?.primarySkill || (app.professional?.skills?.[0]) || 'Art'}</span>
                          </div>
                        </div>
                        <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex-[1.5] min-w-[300px] grid grid-cols-2 gap-x-8 gap-y-4">
                          <div className="col-span-2">
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">COMP & NOTICE EVALUATION</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase leading-tight">CURRENT COMPENSATION</p>
                            <p className="font-bold text-gray-300 text-[10px] mt-1 italic">{app.verifiedResponse?.currentCTC || 'Not Specified'}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase leading-tight">EXPECTED COMPENSATION</p>
                            <p className="font-bold text-[#7c00ff] text-[10px] mt-1">{app.verifiedResponse?.expectedCTC || 'Not Specified'}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase leading-tight">NOTICE PERIOD</p>
                            <div className="mt-1 badge bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-bold inline-block border border-indigo-100">{app.verifiedResponse?.noticePeriod || 'Immediate'}</div>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase leading-tight">RELOCATION PREF</p>
                            <div className="mt-1 badge bg-yellow-50 text-yellow-600 px-3 py-1 rounded-lg text-[10px] font-bold inline-block border border-yellow-100">{app.verifiedResponse?.relocationPreference || 'Yes'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Bar (Location & Availability) */}
                <div className="px-10 pb-8 flex items-center gap-10">
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">AVAILABILITY</p>
                    <div className="w-3 h-3 rounded-full bg-gray-400 shadow-sm border-2 border-white" />
                  </div>
                  <div className="flex items-center gap-3 border-l border-gray-100 pl-10">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">PREFERRED LOCATION</p>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-300" />
                      <span className="font-bold text-gray-900 text-sm">{app.verifiedResponse?.location || app.professional?.location || 'Mumbai, India'}</span>
                    </div>
                  </div>
                </div>

                {/* Verified Info Toggle Bar */}
                <div className="mx-6 mb-6">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedAppId(expandedAppId === app.id ? null : app.id);
                    }}
                    className={`w-full group rounded-[2rem] border transition-all p-4 px-8 flex items-center justify-between ${
                      expandedAppId === app.id ? 'bg-[#7c00ff] border-[#7c00ff] text-white shadow-xl shadow-[#7c00ff]/20' : 'bg-gray-50/50 border-gray-100 text-gray-900 hover:bg-white hover:border-[#7c00ff]/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        expandedAppId === app.id ? 'bg-white/20' : 'bg-white border border-gray-100 shadow-sm text-[#7c00ff]'
                      }`}>
                        <FileText size={20} />
                      </div>
                      <div className="text-left">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${expandedAppId === app.id ? 'text-white' : 'text-gray-900'}`}>Verified Info Response Sheet</p>
                        <p className={`text-[8px] font-bold uppercase tracking-widest ${expandedAppId === app.id ? 'text-white/60' : 'text-gray-400'}`}>Studio-defined response equivalent (AUI Secured Checklist)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl ${
                        expandedAppId === app.id ? 'bg-white text-[#7c00ff]' : 'bg-[#E9EFFF] text-[#7c00ff]'
                      }`}>PASSPORT COMPLETED</span>
                      {expandedAppId === app.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </button>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedAppId === app.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ResponseSheet app={app} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Card Actions Footer (Always Visible) */}
                <div className="p-10 bg-gray-50/30 border-t border-gray-100 flex items-center justify-center gap-6">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toast.info("Full profile view coming soon"); }}
                    className="px-10 py-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 hover:bg-gray-50 transition-all"
                  >
                    View Profile
                  </button>
                  
                  {activePhase === 'applied' && (
                    <Button 
                      onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, 'shortlisted'); }}
                      className="px-16 py-5 bg-black text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/20"
                    >
                      Shortlist
                    </Button>
                  )}
                  
                  {activePhase === 'shortlisted' && (
                    <Button 
                      onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, 'discussion'); }}
                      className="px-16 py-5 bg-[#7c00ff] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#7c00ff]/20"
                    >
                      Move to Discussion
                    </Button>
                  )}

                  {activePhase === 'discussion' && (
                    <>
                      <Button 
                        variant={app.contactInfoShared ? 'secondary' : 'primary'}
                        onClick={(e) => { e.stopPropagation(); handleToggleContact(app.id, app.contactInfoShared); }}
                        className="px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em]"
                      >
                        {app.contactInfoShared ? 'Hide Contact' : 'Get Contact Info'}
                      </Button>
                      <Button 
                        onClick={(e) => { e.stopPropagation(); setSelectedApp(app); setIsAgreementModalOpen(true); }}
                        className="px-16 py-5 bg-emerald-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20"
                      >
                        Accepted (Move to Agreement)
                      </Button>
                    </>
                  )}

                  {activePhase === 'hired' && (
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Hired Amount</p>
                        <p className="text-2xl font-black text-emerald-600">
                          {app.agreementDetails?.currency || 'USD'} {app.agreementDetails?.amount || app.verifiedResponse?.expectedCTC || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Start Date</p>
                        <p className="font-bold text-gray-900">{app.agreementDetails?.startDate || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Duration</p>
                        <p className="font-bold text-gray-900">{app.agreementDetails?.duration || 'N/A'}</p>
                      </div>
                    </div>
                  )}

                  {activePhase === 'rejected' && (
                    <Button 
                      onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, 'applied'); }}
                      className="px-16 py-5 bg-rose-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20"
                    >
                      Move Back to Applications
                    </Button>
                  )}

                  {activePhase !== 'rejected' && activePhase !== 'hired' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, 'rejected'); }}
                      className="px-10 py-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all"
                    >
                      Try Next Time
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Selected Applicant Side Panel (Removed since we use full width cards now) */}


      {/* Finalize Agreement Modal */}
      <AnimatePresence>
        {isAgreementModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl p-10 space-y-10"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <h3 className="text-3xl font-black tracking-tight text-[#1a1f28]">Finalize Agreement</h3>
                  <p className="text-sm font-medium text-gray-400">Set professional terms for {selectedApp?.professional?.fullName}.</p>
                </div>
                <button onClick={() => setIsAgreementModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-300" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">ENGAGEMENT TYPE</label>
                  <select 
                    value={agreementForm.type}
                    onChange={(e) => setAgreementForm({...agreementForm, type: e.target.value})}
                    className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-bold text-sm"
                  >
                    <option>Contract</option>
                    <option>Full Time</option>
                  </select>
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
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">ENGAGEMENT DURATION</label>
                  <input 
                    type="text" 
                    value={agreementForm.duration}
                    onChange={(e) => setAgreementForm({...agreementForm, duration: e.target.value})}
                    placeholder="e.g. 6 Months"
                    className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-bold text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">COMPENSATION TYPE</label>
                  <select 
                    value={agreementForm.compensationType}
                    onChange={(e) => setAgreementForm({...agreementForm, compensationType: e.target.value})}
                    className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-bold text-sm"
                  >
                    <option>Monthly</option>
                    <option>Project Based</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">CURRENCY</label>
                  <select 
                    value={agreementForm.currency}
                    onChange={(e) => setAgreementForm({...agreementForm, currency: e.target.value})}
                    className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-bold text-sm"
                  >
                    <option>USD ($)</option>
                    <option>INR (₹)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">AMOUNT</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={agreementForm.amount}
                      onChange={(e) => setAgreementForm({...agreementForm, amount: e.target.value})}
                      placeholder="7500"
                      className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-[#7c00ff]/20 transition-all font-bold text-sm" 
                    />
                    <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleFinalizeAgreement}
                className="w-full h-16 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20"
              >
                SEND FOR ARTIST CONFIRMATION
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HiringPipeline;
