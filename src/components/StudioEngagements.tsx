import React, { useState } from 'react';
import { Search, Clock, FileText, X } from 'lucide-react';
import Card from './Card';
import TalentAvatar from './TalentAvatar';

interface StudioEngagementsProps {
  requestRows: any[];
  getFileUrl: (path: string) => string;
  statusClass: Record<string, string>;
  openUpdateAgreement: (row: any) => void;
}

const StudioEngagements: React.FC<StudioEngagementsProps> = ({
  requestRows,
  getFileUrl,
  statusClass,
  openUpdateAgreement
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'applications' | 'shortlisting' | 'discussion' | 'agreement' | 'hired' | 'rejected'>('applications');

  // Metrics calculations
  const outreachTotal = requestRows.length;
  const activeNegotiation = requestRows.filter(r => r.status === 'accepted').length;
  const hiredSigned = requestRows.filter(r => r.status === 'in_progress' || r.status === 'completed').length;
  const shortlisted = 1; // Standard mock count to align with UI requirements

  // Filter rows based on search and active tab
  const filteredRows = requestRows.filter(row => {
    const professional = row.professional;
    const name = (professional?.fullName || professional?.user?.email || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Filter by tab status
    if (activeTab === 'applications') return row.status === 'pending';
    if (activeTab === 'shortlisting') return false;
    if (activeTab === 'discussion') return false;
    if (activeTab === 'agreement') return row.status === 'accepted';
    if (activeTab === 'hired') return row.status === 'in_progress' || row.status === 'completed';
    if (activeTab === 'rejected') return row.status === 'rejected';

    return true;
  });

  const getTabCount = (tab: string) => {
    if (tab === 'applications') return requestRows.filter(r => r.status === 'pending').length;
    if (tab === 'shortlisting') return shortlisted;
    if (tab === 'discussion') return 0;
    if (tab === 'agreement') return requestRows.filter(r => r.status === 'accepted').length;
    if (tab === 'hired') return requestRows.filter(r => r.status === 'in_progress' || r.status === 'completed').length;
    if (tab === 'rejected') return requestRows.filter(r => r.status === 'rejected').length;
    return 0;
  };

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

  return (
    <div className="space-y-8 text-left">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#05060b]">Direct Engagements</h2>
        <p className="text-base md:text-lg text-[#6f7782]">Track on-demand studio outreach and benched talent proposals through the stages of your hiring pipeline.</p>
      </div>

      {/* Metrics Row */}
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

      {/* Search Input Bar */}
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
          {filteredRows.length} RECORDS IN TAB
        </span>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
        {(['applications', 'shortlisting', 'discussion', 'agreement', 'hired', 'rejected'] as const).map((tab) => {
          const isActive = activeTab === tab;
          const count = getTabCount(tab);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
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

      {/* List Items */}
      {filteredRows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-xl font-bold text-[#0a0f1a]">No engagements found</p>
          <p className="mt-2 text-xs text-[#6f7782]">There are no records matching the current filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRows.map((row) => {
            const professional = row.professional;
            const image = professional?.avatarUrl ? getFileUrl(professional.avatarUrl) : '';
            const name = professional?.fullName || professional?.user?.email?.split('@')[0] || 'Unknown Professional';
            const position = (professional?.position || 'Artist').replace('_', ' ');

            // Left strip border color based on status
            let borderStripColor = 'border-l-[6px] border-l-[#FBBF24]'; // pending (yellow/orange)
            if (row.status === 'accepted' || row.status === 'in_progress' || row.status === 'completed') {
              borderStripColor = 'border-l-[6px] border-l-[#10B981]'; // accepted/hired (green)
            } else if (row.status === 'rejected') {
              borderStripColor = 'border-l-[6px] border-l-[#EF4444]'; // rejected (red)
            }

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
                      <Clock size={11} className="text-[#FBBF24]" />
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

                    {/* Status explanation pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFBEB] rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                      <span className="text-[10px] font-bold text-[#D97706] leading-none">
                        {row.status === 'pending' && "Let's wait and see response status. Pending artist reply."}
                        {row.status === 'accepted' && 'Artist accepted request. Agreement details shared.'}
                        {row.status === 'in_progress' && 'Hired & signed successfully.'}
                        {row.status === 'completed' && 'Engagement successfully completed.'}
                        {row.status === 'rejected' && 'Artist declined this outreach.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side buttons / status */}
                <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                  {row.status === 'pending' && (
                    <>
                      <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#FFFBEB] border border-[#FCD34D]/50 text-[#D97706] rounded-xl text-[9px] font-black uppercase tracking-widest">
                        <Clock size={12} />
                        WAITING FOR RESPONSE
                      </div>
                      <button
                        onClick={() => openUpdateAgreement(row)}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-all"
                      >
                        <FileText size={12} />
                        OFFER DETAILS
                      </button>
                      <button className="px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                        WITHDRAW OFFER
                      </button>
                    </>
                  )}

                  {row.status === 'accepted' && (
                    <>
                      <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#ECFDF5] border border-[#A7F3D0]/50 text-[#059669] rounded-xl text-[9px] font-black uppercase tracking-widest">
                        AGREEMENT SHARED
                      </div>
                      <button
                        onClick={() => openUpdateAgreement(row)}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-all"
                      >
                        <FileText size={12} />
                        UPDATE AGREEMENT
                      </button>
                    </>
                  )}

                  {(row.status === 'in_progress' || row.status === 'completed') && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#ECFDF5] border border-[#A7F3D0]/50 text-[#059669] rounded-xl text-[9px] font-black uppercase tracking-widest">
                        {row.status === 'in_progress' ? 'HIRED' : 'COMPLETED'}
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#b2b6bc]">Hired Amount</p>
                        <p className="text-lg font-black text-emerald-600 leading-tight">{row.proposedBudget || 'N/A'}</p>
                      </div>
                    </div>
                  )}

                  {row.status === 'rejected' && (
                    <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] rounded-xl text-[9px] font-black uppercase tracking-widest">
                      DECLINED
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudioEngagements;
