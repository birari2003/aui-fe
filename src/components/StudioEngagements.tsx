import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Clock, FileText, X, ShieldCheck, CheckCircle2,
  Star, MessageCircle, ChevronDown, ChevronUp, ArrowRight,
  DollarSign, Calendar, Briefcase as Portfolio, ExternalLink,
  Phone, Mail, MapPin, Users
} from 'lucide-react';
import { toast } from 'react-toastify';
import Card from './Card';
import Button from './Button';
import TalentAvatar from './TalentAvatar';

interface StudioEngagementsProps {
  requestRows: any[];
  getFileUrl: (path: string) => string;
  statusClass: Record<string, string>;
  openUpdateAgreement: (row: any) => void;
  applications: any[];
  onUpdateStatus: (appId: number, status: string) => Promise<void>;
  onFinalizeAgreement: (appId: number, agreementDetails: any) => Promise<void>;
  onToggleContactInfo: (appId: number, currentVal: boolean) => Promise<void>;
  onWithdrawRequest: (requestId: number) => Promise<void>;
}

const ResponseSheet = ({ app }: { app: any }) => {
  let verified = app.verifiedResponse || {};
  if (typeof verified === 'string') {
    try {
      verified = JSON.parse(verified);
    } catch (e) {
      verified = {};
    }
  }
  const timeline = verified.experienceTimeline || [];
  const ledger = verified.workLedger || [];
  const links = verified.showreelLinks || [];

  const InfoBox = ({ label, value }: { label: string, value: string }) => (
    <div className="p-4 sm:p-6 bg-white rounded-[2rem] border border-gray-100/80 shadow-sm space-y-1 text-left">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</p>
      <p className="font-bold text-gray-900 text-sm truncate">{value || 'Unfilled'}</p>
    </div>
  );

  return (
    <div className="p-4 sm:p-10 space-y-8 sm:space-y-12 bg-[#F9FAFB]/50 border-t border-gray-100 text-left animate-in slide-in-from-top-4 duration-500">
      {app.contactInfoShared && (
        <div className="p-4 sm:p-8 bg-emerald-50 border border-emerald-100 rounded-3xl flex flex-col sm:flex-row gap-6 sm:gap-10 items-stretch sm:items-center animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-emerald-600/50 uppercase tracking-widest leading-none mb-1">PHONE NUMBER</p>
              <p className="font-black text-emerald-900 text-base sm:text-lg">{app.professional?.user?.phone || 'Not available'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
              <Mail size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black text-emerald-600/50 uppercase tracking-widest leading-none mb-1">EMAIL ADDRESS</p>
              <p className="font-black text-emerald-900 text-base sm:text-lg truncate">{app.professional?.user?.email || 'Not available'}</p>
            </div>
          </div>
          <div className="sm:ml-auto flex items-center justify-center gap-3 bg-emerald-100/50 px-6 py-3 rounded-2xl border border-emerald-100 w-full sm:w-auto">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">CONTACT INFO SHARED</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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

      <div className="space-y-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">ABOUT ME</p>
        <div className="p-4 sm:p-8 bg-white border border-gray-100 rounded-3xl shadow-sm italic text-gray-500 text-sm leading-relaxed">
          {verified.aboutMe || "The artist did not specify a bio yet."}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">SHOWREEL LINK(S)</p>
        <div className="p-4 sm:p-8 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4">
          {links.length > 0 ? links.map((link: string, i: number) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:border-black/20 hover:shadow-md"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black border border-gray-100 shadow-sm shrink-0">
                <Portfolio size={18} />
              </div>
              <span className="flex-1 font-bold text-sm text-black truncate">{link}</span>
              <ExternalLink size={16} className="text-gray-300 group-hover:text-black transition-colors shrink-0" />
            </a>
          )) : (
            <p className="text-sm text-gray-400 italic">No showreel links provided</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
              <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">EXPERIENCE TIMELINE</p>
            </div>
            <span className="text-[8px] font-bold text-white uppercase tracking-widest px-2 py-1 rounded bg-black/80">Auto-Compiled</span>
          </div>
          <div className="relative space-y-8 pl-8 before:absolute before:left-2 before:top-2 before:bottom-4 before:w-[1px] before:bg-gray-100">
            {timeline.map((item: any, i: number) => (
              <div key={i} className="relative text-left">
                <div className="absolute -left-7 top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-black shadow-sm" />
                <p className="text-[10px] font-bold text-black mb-1">{item.period}</p>
                <h5 className="font-black text-gray-900 text-sm leading-tight">{item.role}</h5>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{item.company}</p>
              </div>
            ))}
            {timeline.length === 0 && <p className="text-sm text-gray-400 italic">No timeline entries</p>}
          </div>
        </div>

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

const StudioEngagements: React.FC<StudioEngagementsProps> = ({
  requestRows,
  getFileUrl,
  statusClass,
  openUpdateAgreement,
  applications,
  onUpdateStatus,
  onFinalizeAgreement,
  onToggleContactInfo,
  onWithdrawRequest,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'applications' | 'shortlisting' | 'discussion' | 'agreement' | 'hired' | 'rejected'>('applications');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [expandedAppId, setExpandedAppId] = useState<number | null>(null);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [selectedOutreachForDetails, setSelectedOutreachForDetails] = useState<any>(null);

  const getModalStatusInfo = (outreach: any) => {
    if (!outreach) return { text: '', colorClass: 'text-gray-500', bgClass: 'bg-gray-500' };

    const matchingApp = applications.find(a =>
      a.studioRequestId === outreach.id
    );

    if (matchingApp) {
      const status = matchingApp.status;
      if (status === 'applied' || status === 'shortlisted') {
        return { text: 'SHORTLISTED', colorClass: 'text-[#10B981]', bgClass: 'bg-[#10B981]' };
      } else if (status === 'discussion') {
        return { text: 'IN DISCUSSION', colorClass: 'text-blue-700', bgClass: 'bg-blue-500' };
      } else if (status === 'agreement') {
        return { text: 'AGREEMENT', colorClass: 'text-purple-700', bgClass: 'bg-purple-500' };
      } else if (status === 'hired') {
        return { text: 'HIRED', colorClass: 'text-emerald-700', bgClass: 'bg-emerald-500' };
      } else if (status === 'rejected') {
        return { text: 'REJECTED', colorClass: 'text-rose-700', bgClass: 'bg-rose-500' };
      }
    }

    if (outreach.status === 'pending') {
      return { text: 'AWAITING ARTIST RESPONSE', colorClass: 'text-[#EA580C]', bgClass: 'bg-[#EA580C]' };
    }

    return { 
      text: String(outreach.status).toUpperCase(), 
      colorClass: 'text-emerald-700', 
      bgClass: 'bg-emerald-500' 
    };
  };

  const getVerificationFieldsText = (fields: any) => {
    let parsedFields = fields;
    if (!fields) {
      return 'Portfolio Review, Expected Compensation, Contract Sign-off';
    }
    if (typeof fields === 'string') {
      try {
        parsedFields = JSON.parse(fields);
      } catch (e) {
        return 'Portfolio Review, Expected Compensation, Contract Sign-off';
      }
    }
    const labelMapping: Record<string, string> = {
      showreel: 'Portfolio Review',
      expectedCTC: 'Expected Compensation',
      workLedger: 'Contract Sign-off',
      name: 'Name / Identity Verification',
      primarySkill: 'Primary Skill Verification',
      position: 'Position Verification',
      experience: 'Experience Verification',
      currentCompany: 'Current Company Verification',
      currentCTC: 'Current CTC Verification',
      noticePeriod: 'Notice Period Verification',
      location: 'Location Verification',
      relocationPreference: 'Relocation Preference Verification'
    };
    
    const requested = Object.entries(parsedFields)
      .filter(([_, value]) => value === true || value === 'true')
      .map(([key, _]) => labelMapping[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
      
    return requested.length > 0 ? requested.join(', ') : 'Portfolio Review, Expected Compensation, Contract Sign-off';
  };

  const [agreementForm, setAgreementForm] = useState({
    type: 'Contract',
    startDate: new Date().toISOString().split('T')[0],
    duration: '6 Months',
    compensationType: 'Monthly',
    currency: '',
    amount: ''
  });

  const isDirectApplied = (a: any) => a.status === 'applied' && a.studioRequestId;
  const outreachTotal = requestRows.filter(r => r.status === 'pending').length + applications.length;
  const shortlisted = applications.filter(a => a.status === 'shortlisted' || isDirectApplied(a)).length;
  const activeNegotiation = applications.filter(a => a.status === 'discussion' || a.status === 'agreement').length;
  const hiredSigned = applications.filter(a => a.status === 'hired').length;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return new Date().toLocaleDateString('en-GB');
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB');
    } catch {
      return dateStr;
    }
  };

  // Filter requestRows for the "applications" tab (old-style sent requests)
  const filteredRequests = requestRows.filter(row => {
    const professional = row.professional;
    const name = (professional?.fullName || professional?.user?.email || '').toLowerCase();
    const position = (professional?.position || 'Artist').replace('_', ' ').toLowerCase();
    const search = searchTerm.toLowerCase();
    return (name.includes(search) || position.includes(search)) && row.status === 'pending';
  });

  // Filter applications for pipeline tabs
  const filteredApplications = applications.filter(app => {
    const professional = app.professional;
    const name = (professional?.fullName || professional?.user?.email || '').toLowerCase();
    const position = (professional?.currentRole || app.verifiedResponse?.position || 'Artist').replace('_', ' ').toLowerCase();
    const search = searchTerm.toLowerCase();
    if (!name.includes(search) && !position.includes(search)) return false;
    if (activeTab === 'shortlisting') return app.status === 'shortlisted' || (app.status === 'applied' && app.studioRequestId);
    return app.status === activeTab;
  });

  const getTabCount = (tab: string) => {
    if (tab === 'applications') return requestRows.filter(r => r.status === 'pending').length;
    if (tab === 'shortlisting') return applications.filter(a => a.status === 'shortlisted' || (a.status === 'applied' && a.studioRequestId)).length;
    return applications.filter(a => a.status === tab).length;
  };

  const handleFinalizeAgreementAction = async () => {
    if (!selectedApp) return;
    const { type, startDate, duration, compensationType, currency, amount } = agreementForm;
    if (!type || !startDate || !duration.trim() || !compensationType || !currency || !amount.trim()) {
      toast.warning('Please fill in all details');
      return;
    }
    await onFinalizeAgreement(selectedApp.id, agreementForm);
    setIsAgreementModalOpen(false);
  };

  const renderRequestCard = (row: any) => {
    const professional = row.professional;
    const image = professional?.avatarUrl ? getFileUrl(professional.avatarUrl) : '';
    const name = professional?.fullName || professional?.user?.email?.split('@')[0] || 'Unknown Professional';
    const position = (professional?.position || 'Artist').replace('_', ' ');

    const matchingApp = applications.find(a =>
      a.studioRequestId === row.id
    );

    let statusLabel = 'WAITING FOR RESPONSE';
    let statusDesc: string | string[] = "Let's wait and see response status. Pending artist reply.";
    let statusBadgeColor = 'bg-[#FFFBEB] border-[#FCD34D]/50 text-[#D97706]';
    let statusDotColor = 'bg-[#D97706]';
    let statusIndicatorBg = 'bg-[#FFFBEB]';
    let statusTextColor = 'text-[#D97706]';
    let borderStripColor = 'border-l-[6px] border-l-[#FBBF24]';

    if (matchingApp) {
      const status = matchingApp.status;
      if (status === 'applied' || status === 'shortlisted') {
        statusLabel = 'SHORTLISTED';
        statusDesc = [
          'Artist has accepted and applied',
          'Check your shortlistings'
        ];
        statusBadgeColor = 'bg-[#ECFDF5] border-[#A7F3D0]/50 text-[#059669]';
        statusDotColor = 'bg-[#10B981]';
        statusIndicatorBg = 'bg-[#ECFDF5]';
        statusTextColor = 'text-[#059669]';
        borderStripColor = 'border-l-[6px] border-l-[#10B981]';
      } else if (status === 'discussion') {
        statusLabel = 'IN DISCUSSION';
        statusDesc = 'Artist is in Discussion stage.';
        statusBadgeColor = 'bg-blue-50 border-blue-200 text-blue-700';
        statusDotColor = 'bg-blue-500';
        statusIndicatorBg = 'bg-blue-50';
        statusTextColor = 'text-blue-700';
        borderStripColor = 'border-l-[6px] border-l-blue-500';
      } else if (status === 'agreement') {
        statusLabel = 'AGREEMENT';
        statusDesc = 'Artist is in Agreement/Contract stage.';
        statusBadgeColor = 'bg-purple-50 border-purple-200 text-purple-700';
        statusDotColor = 'bg-purple-500';
        statusIndicatorBg = 'bg-purple-50';
        statusTextColor = 'text-purple-700';
        borderStripColor = 'border-l-[6px] border-l-purple-500';
      } else if (status === 'hired') {
        statusLabel = 'HIRED';
        statusDesc = 'Artist is hired & signed!';
        statusBadgeColor = 'bg-emerald-50 border-emerald-200 text-emerald-700';
        statusDotColor = 'bg-emerald-500';
        statusIndicatorBg = 'bg-emerald-50';
        statusTextColor = 'text-emerald-700';
        borderStripColor = 'border-l-[6px] border-l-emerald-500';
      } else if (status === 'rejected') {
        statusLabel = 'REJECTED';
        statusDesc = 'Application rejected/declined.';
        statusBadgeColor = 'bg-rose-50 border-rose-200 text-rose-700';
        statusDotColor = 'bg-rose-500';
        statusIndicatorBg = 'bg-rose-50';
        statusTextColor = 'text-rose-700';
        borderStripColor = 'border-l-[6px] border-l-rose-500';
      }
    } else if (row.status === 'rejected') {
      statusLabel = 'REJECTED';
      statusDesc = 'Application rejected/declined.';
      statusBadgeColor = 'bg-rose-50 border-rose-200 text-rose-700';
      statusDotColor = 'bg-rose-500';
      statusIndicatorBg = 'bg-rose-50';
      statusTextColor = 'text-rose-700';
      borderStripColor = 'border-l-[6px] border-l-rose-500';
    } else if (row.status === 'accepted' || row.status === 'in_progress' || row.status === 'completed') {
      statusLabel = 'SHORTLISTED';
      statusDesc = [
        'Artist has accepted and applied',
        'Check your shortlistings'
      ];
      statusBadgeColor = 'bg-[#ECFDF5] border-[#A7F3D0]/50 text-[#059669]';
      statusDotColor = 'bg-[#10B981]';
      statusIndicatorBg = 'bg-[#ECFDF5]';
      statusTextColor = 'text-[#059669]';
      borderStripColor = 'border-l-[6px] border-l-[#10B981]';
    }

    const getStatusIcon = (label: string) => {
      switch (label) {
        case 'WAITING FOR RESPONSE':
          return <Clock size={12} />;
        case 'IN DISCUSSION':
          return <MessageCircle size={12} />;
        case 'AGREEMENT':
          return <FileText size={12} />;
        case 'REJECTED':
          return <X size={12} />;
        default:
          return <CheckCircle2 size={12} />;
      }
    };

    return (
      <Card
        key={row.id}
        className={`rounded-2xl border border-gray-100 bg-white shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-md ${borderStripColor}`}
      >
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="relative shrink-0 mt-1">
            <TalentAvatar
              talentCode={professional?.user?.talentId?.talentCode || ''}
              initialAvatarUrl={image}
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-50"
              iconSize={24}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
              {statusLabel === 'WAITING FOR RESPONSE' ? (
                <Clock size={11} className="text-[#FBBF24]" />
              ) : statusLabel === 'REJECTED' ? (
                <X size={11} className="text-rose-500" />
              ) : (
                <CheckCircle2 size={11} className="text-[#10B981]" />
              )}
            </div>
          </div>

          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none">{name}</h4>
              <span className="inline-block px-2.5 py-1 bg-[#FFFBEB] text-[#D97706] rounded-md text-[8px] font-black uppercase tracking-wider">
                DIRECT ENGAGEMENT OUTREACH
              </span>
            </div>

            <p className="text-[11px] font-medium text-gray-400">
              {position} <span className="mx-1.5">•</span> Sent on {formatDate(row.createdAt || row.startDate)}
            </p>

            {Array.isArray(statusDesc) ? (
              <div className={`flex flex-col gap-1 px-3 py-2 ${statusIndicatorBg} rounded-[1rem] border border-emerald-100 text-left`}>
                {statusDesc.map((desc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className={`w-1 h-1 rounded-full ${statusDotColor} shrink-0`} />
                    <span className={`text-[10px] font-bold ${statusTextColor} leading-tight`}>
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${statusIndicatorBg} rounded-full`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor}`} />
                <span className={`text-[10px] font-bold ${statusTextColor} leading-none`}>
                  {statusDesc}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          <div className={`flex items-center gap-1.5 px-3.5 py-2.5 border rounded-xl text-[9px] font-black uppercase tracking-widest ${statusBadgeColor}`}>
            {getStatusIcon(statusLabel)}
            {statusLabel}
          </div>
          <button
            onClick={() => setSelectedOutreachForDetails(row)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-all"
          >
            <FileText size={12} />
            OFFER DETAILS
          </button>
          <button 
            onClick={async () => {
              if (window.confirm("Are you sure you want to withdraw this opportunity offer?")) {
                await onWithdrawRequest(row.id);
              }
            }}
            className="px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-400 hover:text-rose-600 hover:border-rose-200 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
          >
            WITHDRAW OFFER
          </button>
        </div>
      </Card>
    );
  };

  const renderPipelineCard = (app: any) => {
    return (
      <Card
        key={app.id}
        className={`rounded-[3rem] border transition-all overflow-hidden ${
          selectedApp?.id === app.id
            ? 'border-black shadow-premium shadow-black/5'
            : 'border-gray-100 shadow-premium'
        }`}
        onClick={() => setSelectedApp(app)}
      >
        <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-6 md:gap-10 items-start">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start flex-1 w-full">
            <div className="relative shrink-0">
              <TalentAvatar
                talentCode={app.professional?.user?.talentId?.talentCode || `AUI-${String(app.professional?.id).padStart(6, '0')}`}
                initialAvatarUrl={app.professional?.avatarUrl ? getFileUrl(app.professional.avatarUrl) : undefined}
                className="w-32 h-32 rounded-[2.5rem] object-cover shadow-2xl shadow-black/10"
                iconSize={36}
              />
              {app.professional?.verificationStatus && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full whitespace-nowrap border-2 border-white shadow-lg">
                  Profile Verified
                </div>
              )}
            </div>

            <div className="space-y-4 pt-2 flex-1 w-full text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4">
                <h4 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">{app.professional?.fullName}</h4>
                {app.professional?.verificationStatus && (
                  <span className="flex items-center gap-2 bg-[#E9FFF6] text-[#00CE7C] text-[10px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full border border-[#00CE7C]/10">
                    <CheckCircle2 size={12} fill="#00CE7C" className="text-white" /> Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">
                <span>{app.professional?.user?.talentId?.talentCode || 'AUI-8RP-S'}</span>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <span className="text-gray-900">{app.professional?.currentRole || 'Character Animator'}</span>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <span>{app.professional?.experienceYears || '8'}y Exp</span>

                {app.contactInfoShared && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-emerald-200" />
                    <span className="flex items-center gap-2 text-emerald-600 normal-case">
                      <Phone size={14} /> {app.professional?.user?.phone}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-emerald-200" />
                    <span className="flex items-center gap-2 text-emerald-600 normal-case">
                      <Mail size={14} /> {app.professional?.user?.email}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
                <div className="p-4 sm:p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex-1 min-w-[240px]">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">POSITION</p>
                  <div className="px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <span className="font-bold text-gray-900 text-sm">{app.verifiedResponse?.position || app.professional?.currentRole}</span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex-1 min-w-[240px]">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">PRIMARY SKILL</p>
                  <div className="px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                    <span className="font-bold text-black text-sm">{app.verifiedResponse?.primarySkill || (app.professional?.skills?.[0]) || 'Art'}</span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex-[1.5] min-w-[280px] sm:min-w-[320px] w-full grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
                  <div className="col-span-2">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">COMP & NOTICE EVALUATION</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-gray-400 uppercase leading-tight">CURRENT COMPENSATION</p>
                    <p className="font-bold text-gray-300 text-[10px] mt-1 italic">{app.verifiedResponse?.currentCTC || 'Not Specified'}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-gray-400 uppercase leading-tight">EXPECTED COMPENSATION</p>
                    <p className="font-bold text-black text-[10px] mt-1">{app.verifiedResponse?.expectedCTC || 'Not Specified'}</p>
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

        <div className="px-6 md:px-10 pb-6 md:pb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">AVAILABILITY</p>
            <div className="w-3 h-3 rounded-full bg-gray-400 shadow-sm border-2 border-white" />
          </div>
          <div className="flex items-start gap-3 sm:border-l border-gray-100 sm:pl-10 sm:items-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">PREFERRED LOCATION</p>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-300" />
              <span className="font-bold text-gray-900 text-sm">{app.verifiedResponse?.location || app.professional?.location || 'Mumbai, India'}</span>
            </div>
          </div>
        </div>

        <div className="mx-6 mb-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandedAppId(expandedAppId === app.id ? null : app.id);
            }}
            className={`w-full group rounded-[2rem] border transition-all p-4 px-4 sm:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
              expandedAppId === app.id ? 'bg-black border-black text-white shadow-xl shadow-black/20' : 'bg-gray-50/50 border-gray-100 text-gray-900 hover:bg-white hover:border-black/20'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                expandedAppId === app.id ? 'bg-white/20' : 'bg-white border border-gray-100 shadow-sm text-black'
              }`}>
                <FileText size={20} />
              </div>
              <div className="text-left min-w-0">
                <p className={`text-[10px] font-black uppercase tracking-widest truncate ${expandedAppId === app.id ? 'text-white' : 'text-gray-900'}`}>Verified Info Response Sheet</p>
                <p className={`text-[8px] font-bold uppercase tracking-widest truncate ${expandedAppId === app.id ? 'text-white/60' : 'text-gray-400'}`}>Studio-defined response equivalent (AUI Secured Checklist)</p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100/10">
              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-3 sm:px-4 py-2 rounded-xl ${
                expandedAppId === app.id ? 'bg-white text-black' : 'bg-[#E9EFFF] text-black'
              }`}>PASSPORT COMPLETED</span>
              {expandedAppId === app.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>
        </div>

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

        <div className="p-6 md:p-10 bg-gray-50/30 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const talentCode = app.professional?.user?.talentId?.talentCode || `AUI-${String(app.professional?.id).padStart(6, '0')}`;
              if (talentCode) {
                navigate(`/talent/${talentCode}`);
              } else {
                toast.info("Profile code not available yet.");
              }
            }}
            className="px-6 sm:px-10 py-4 sm:py-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 hover:bg-gray-50 transition-all text-center"
          >
            View Profile
          </button>

          {activeTab === 'shortlisting' && (
            <Button
              onClick={(e) => { e.stopPropagation(); onUpdateStatus(app.id, 'discussion'); }}
              className="px-8 sm:px-16 py-4 sm:py-5 bg-black text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/20 text-center"
            >
              Move to Discussion
            </Button>
          )}

          {activeTab === 'discussion' && (
            <>
              <Button
                variant={app.contactInfoShared ? 'secondary' : 'primary'}
                onClick={(e) => { e.stopPropagation(); onToggleContactInfo(app.id, app.contactInfoShared); }}
                className="px-6 sm:px-10 py-4 sm:py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] text-center"
              >
                {app.contactInfoShared ? 'Hide Contact' : 'Get Contact Info'}
              </Button>
              <Button
                onClick={(e) => { e.stopPropagation(); setSelectedApp(app); setIsAgreementModalOpen(true); }}
                className="px-8 sm:px-16 py-4 sm:py-5 bg-emerald-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 text-center"
              >
                Accepted (Move to Agreement)
              </Button>
            </>
          )}

          {activeTab === 'agreement' && (
            <>
              <Button
                onClick={(e) => { e.stopPropagation(); setSelectedApp(app); setIsAgreementModalOpen(true); }}
                className="px-6 sm:px-12 py-4 sm:py-5 bg-[#1a1f28] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl text-center"
              >
                Update Agreement
              </Button>
              <div className="flex items-center gap-2 px-6 py-4 bg-emerald-50 border border-emerald-200 rounded-[1.5rem]">
                <Clock size={16} className="text-emerald-600" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-700">Agreement Shared</p>
                  <p className="text-[9px] text-emerald-500">Sent to artist. Pending acceptance.</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'hired' && (
            <div className="flex flex-wrap items-center justify-center gap-6 w-full sm:w-auto">
              <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-[1.5rem] w-full sm:w-auto">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-700">Artist Hired</p>
                  <p className="text-[9px] text-emerald-500">Accepted by {app.professional?.fullName || 'artist'}</p>
                </div>
              </div>
              <div className="text-center min-w-[70px]">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Current Comp</p>
                <p className="font-bold text-gray-900 text-xs sm:text-sm">{app.verifiedResponse?.currentCTC || '—'}</p>
              </div>
              <div className="text-center min-w-[70px]">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Expected Comp</p>
                <p className="font-bold text-gray-900 text-xs sm:text-sm">{app.verifiedResponse?.expectedCTC || '—'}</p>
              </div>
              <div className="text-center min-w-[80px]">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Final Settlement</p>
                <p className="font-bold text-emerald-600 text-xs sm:text-sm">
                  {app.agreementDetails?.currency || ''} {app.agreementDetails?.amount || '—'}{app.agreementDetails?.compensationType ? ` / ${app.agreementDetails.compensationType}` : ''}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'rejected' && (
            <Button
              onClick={(e) => { e.stopPropagation(); onUpdateStatus(app.id, 'shortlisted'); }}
              className="px-8 sm:px-16 py-4 sm:py-5 bg-rose-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 text-center"
            >
              Move Back to Shortlisted
            </Button>
          )}

          {activeTab !== 'rejected' && activeTab !== 'hired' && (
            <button
              onClick={(e) => { e.stopPropagation(); onUpdateStatus(app.id, 'rejected'); }}
              className="px-6 sm:px-10 py-4 sm:py-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all text-center"
            >
              Try Next Time
            </button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8 text-left">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#05060b]">Direct Engagements</h2>
        <p className="text-base md:text-lg text-[#6f7782]">Track on-demand studio outreach and benched talent proposals through the stages of your hiring pipeline.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#F9FAFB]/60 border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF] mb-1">OUTREACH TOTAL</p>
          <p className="text-3xl font-black text-gray-900">{outreachTotal}</p>
        </div>
        <div className="bg-[#F9FAFB]/60 border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF] mb-1">SHORTLISTED</p>
          <p className="text-3xl font-black text-gray-900">{shortlisted}</p>
        </div>
        <div className="bg-[#F9FAFB]/60 border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF] mb-1">ACTIVE NEGOTIATION</p>
          <p className="text-3xl font-black text-gray-900">{activeNegotiation}</p>
        </div>
        <div className="bg-[#F9FAFB]/60 border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF] mb-1">HIRED & SIGNED</p>
          <p className="text-3xl font-black text-gray-900">{hiredSigned}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 pl-2 flex-1">
          <Search size={18} className="text-[#9CA3AF]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search direct engagements..."
            className="bg-transparent border-none outline-none text-xs font-bold text-gray-900 w-full placeholder:text-[#9CA3AF]"
          />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF] pr-2 shrink-0">
          {activeTab === 'applications' ? filteredRequests.length : filteredApplications.length} RECORDS IN TAB
        </span>
      </div>

      <div 
        className="flex items-center gap-2 border-b border-gray-100 pb-3 overflow-x-auto no-scrollbar scroll-smooth w-full snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {(['applications', 'shortlisting', 'discussion', 'agreement', 'hired', 'rejected'] as const).map((tab) => {
          const isActive = activeTab === tab;
          const count = getTabCount(tab);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 snap-start flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-100'
              }`}
            >
              {tab}
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {activeTab === 'applications' ? (
        filteredRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="text-xl font-bold text-[#0a0f1a]">No pending outreach</p>
            <p className="mt-2 text-xs text-[#6f7782]">Send opportunities from your bench to see them here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map(renderRequestCard)}
          </div>
        )
      ) : (
        filteredApplications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="text-xl font-bold text-[#0a0f1a]">No engagements found</p>
            <p className="mt-2 text-xs text-[#6f7782]">There are no records matching the current filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredApplications.map(renderPipelineCard)}
          </div>
        )
      )}

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
                    className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-black/20 transition-all font-bold text-sm"
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
                      className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-black/20 transition-all font-bold text-sm"
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
                    className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-black/20 transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">COMPENSATION TYPE</label>
                  <select
                    value={agreementForm.compensationType}
                    onChange={(e) => setAgreementForm({...agreementForm, compensationType: e.target.value})}
                    className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-black/20 transition-all font-bold text-sm"
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
                    className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-black/20 transition-all font-bold text-sm"
                  >
                    <option value="">Select Currency</option>
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
                      placeholder="e.g. 7500"
                      className="w-full h-14 px-6 bg-gray-50/50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-black/20 transition-all font-bold text-sm"
                    />
                    <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleFinalizeAgreementAction}
                className="w-full h-16 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20"
              >
                SEND FOR ARTIST CONFIRMATION
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOutreachForDetails && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl p-10 space-y-8 relative text-left"
            >
              {/* Close Button Top Right */}
              <button 
                onClick={() => setSelectedOutreachForDetails(null)} 
                className="absolute top-10 right-10 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-300 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <div className="space-y-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF7ED] text-[#EA580C] rounded-full text-[9px] font-black uppercase tracking-widest">
                  <Clock size={11} className="text-[#EA580C]" />
                  DIRECT OUTREACH PROPOSAL
                </div>

                <div className="space-y-1">
                  <h3 className="text-3xl font-black tracking-tight text-gray-900">Outreach Offer Details</h3>
                  <p className="text-xs font-medium text-gray-400">
                    Sent to <span className="font-black text-gray-900">{selectedOutreachForDetails.professional?.fullName || selectedOutreachForDetails.professional?.user?.email?.split('@')[0] || 'Unknown Professional'}</span> on {formatDate(selectedOutreachForDetails.createdAt || selectedOutreachForDetails.startDate)}
                  </p>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100 w-full" />

              {/* Grid Details */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ROLE TITLE</p>
                  <p className="font-black text-gray-900 text-sm">{selectedOutreachForDetails.roleTitle || 'Animation'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">DIRECT COMPENSATION OFFER</p>
                  <div className="mt-1">
                    {selectedOutreachForDetails.proposedBudget ? (
                      <span className="font-black text-gray-900 text-sm">{selectedOutreachForDetails.proposedBudget}</span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-[#ECFDF5] text-[#059669] rounded-[8px] text-[10px] font-black uppercase tracking-widest border border-[#A7F3D0]/30">
                        TBD
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">TARGET PRODUCTION TYPE</p>
                  <p className="font-black text-gray-900 text-sm">{selectedOutreachForDetails.productionType || 'Feature Film'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">PROJECT FORMAT</p>
                  <p className="font-black text-gray-900 text-sm">{selectedOutreachForDetails.projectFormat || '3D'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">TARGET START DATE</p>
                  <p className="font-black text-gray-900 text-sm">
                    {selectedOutreachForDetails.startAvailability ? 
                      selectedOutreachForDetails.startAvailability.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()) : 
                      'Immediate'}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">WORK MODE & LOCATION</p>
                  <p className="font-black text-gray-900 text-sm">
                    {selectedOutreachForDetails.workMode || 'Remote'}
                    {selectedOutreachForDetails.location ? ` (${selectedOutreachForDetails.location})` : ''}
                  </p>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100 w-full" />

              {/* Outreach Pitch */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">OUTREACH PITCH / ROLE REQUIREMENTS</p>
                <div className="p-6 bg-[#F9FAFB]/80 border border-gray-100 rounded-3xl italic text-gray-600 text-xs font-semibold leading-relaxed">
                  "{selectedOutreachForDetails.roleRequirements || 'No requirements specified.'}"
                </div>
              </div>

              {/* Opportunity Overview */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">OPPORTUNITY OVERVIEW</p>
                <div className="p-6 bg-[#F9FAFB]/80 border border-gray-100 rounded-3xl italic text-gray-600 text-xs font-semibold leading-relaxed">
                  "{selectedOutreachForDetails.opportunityOverview || 'No additional overview provided.'}"
                </div>
              </div>

              <div className="p-8 bg-[#F9FAFB]/50 border-t border-gray-100 flex items-center justify-between -mx-10 -mb-10">
                {(() => {
                  const statusInfo = getModalStatusInfo(selectedOutreachForDetails);
                  return (
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusInfo.bgClass}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${statusInfo.colorClass}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  );
                })()}
                <button
                  onClick={() => setSelectedOutreachForDetails(null)}
                  className="h-14 px-8 bg-[#0a0a0a] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-md transition-all active:scale-[0.98]"
                >
                  CLOSE OFFER DETAILS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudioEngagements;
