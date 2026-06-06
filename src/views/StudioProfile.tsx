import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, Settings, ExternalLink, Edit3, ArrowRight,
  Users, Briefcase, ShieldCheck, MapPin, ChevronRight,
  Clock, Activity, Plus
} from 'lucide-react';
import { View } from '../types';
import ManageStudioProfileModal from '../components/ManageStudioProfileModal';
import ManageStudioInfoModal from '../components/ManageStudioInfoModal';
import { getMyStudioPublicProfile } from '../services/studioProfileService';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, BASE_URL } from '../utils/urls';
import { getStudioInfo, getTalentBench, getStudioRequestProfessionals, getStudioJobPostings, getJobApplications } from '../services/studioServices';
import SEO from '../components/SEO';

type StudioRequestRow = {
  id: number;
  professionalId: number;
  projectTimeline: string;
  productionType: string;
  engagementBrief: string;
  proposedBudget?: string;
  startDate?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed';
  updatedAt?: string;
  createdAt?: string;
  professional: {
    id: number;
    fullName: string;
    primarySkill: string;
    position: string;
    experienceYears: number;
    avatarUrl?: string;
    user?: { email?: string; talentId?: { talentCode?: string } };
  };
};

type BenchRow = {
  id: number;
  professionalId: number;
  professional: {
    id: number;
    fullName: string;
    primarySkill: string;
    position: string;
    experienceYears: number;
    avatarUrl?: string;
    user?: { email?: string; talentId?: { talentCode?: string } };
  };
};

type JobPosting = {
  id: number;
  title: string;
  workMode?: string;
  startDate?: string;
  hiringDeadline?: string;
  artistCount: number;
  filledCount?: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: { applications?: number };
};

const WORK_TYPE_LABELS: Record<string, string> = {
  film: 'Feature Film & TV',
  series: 'Series & OTT',
  ads: 'Commercials & Ads',
  gaming: 'Gaming & Interactive',
};

const StudioProfile = ({ setView }: { setView: (v: View) => void }) => {
  const navigate = useNavigate();
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isStudioInfoModalOpen, setIsStudioInfoModalOpen] = useState(false);

  // Dynamic data
  const [studioProfile, setStudioProfile] = useState<any>(null);
  const [studioInfo, setStudioInfo] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [hiredRows, setHiredRows] = useState<StudioRequestRow[]>([]);
  const [benchRows, setBenchRows] = useState<BenchRow[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [activityItems, setActivityItems] = useState<any[]>([]);

  const token = localStorage.getItem('token');

  const fetchAll = useCallback(async () => {
    if (!token) return;
    try {
      const [profileRes, infoRes, meRes, requestRes, benchRes, jobsRes, applicationsRes] = await Promise.all([
        getMyStudioPublicProfile(token),
        getStudioInfo(token),
        fetch(API_ENDPOINTS.AUTH.ME, { headers: { Authorization: `Bearer ${token}` } }),
        getStudioRequestProfessionals(token),
        getTalentBench(token),
        getStudioJobPostings(token),
        getJobApplications(token),
      ]);

      if (profileRes.ok) {
        const p = await profileRes.json();
        if (p.data) setStudioProfile(p.data);
      }
      if (infoRes.ok) {
        const i = await infoRes.json();
        if (i.data) setStudioInfo(i.data);
      }
      if (meRes.ok) {
        const u = await meRes.json();
        if (u.data) setUserData(u.data);
      }
      if (benchRes.ok) {
        const b = await benchRes.json();
        setBenchRows(Array.isArray(b?.data) ? b.data : []);
      }

      let formattedRequests: any[] = [];
      let requestRows: any[] = [];
      if (requestRes.ok) {
        const r = await requestRes.json();
        requestRows = Array.isArray(r?.data) ? r.data : [];
        formattedRequests = requestRows
          .filter((x: any) => x.status === 'in_progress' || x.status === 'completed')
          .map((x: any) => ({
            id: `request_${x.id}`,
            professional: x.professional,
            proposedBudget: x.proposedBudget || '—',
            roleTitle: x.engagementBrief,
            status: x.status,
            updatedAt: x.updatedAt,
            createdAt: x.createdAt,
          }));
      }

      let formattedApplications: any[] = [];
      let appRows: any[] = [];
      if (applicationsRes.ok) {
        const appResBody = await applicationsRes.json();
        appRows = Array.isArray(appResBody?.data) ? appResBody.data : [];
        formattedApplications = appRows
          .filter((x: any) => x.status === 'hired')
          .map((x: any) => {
            let agreement = x.agreementDetails;
            if (typeof agreement === 'string') {
              try {
                agreement = JSON.parse(agreement);
              } catch (e) {
                agreement = {};
              }
            }
            const budget = agreement
              ? `${agreement.currency || 'USD'} ${agreement.amount || ''}`.trim()
              : '';
            return {
              id: `app_${x.id}`,
              professional: x.professional,
              proposedBudget: budget || '—',
              roleTitle: x.jobPosting?.title || 'Job Application',
              status: x.status,
              updatedAt: x.updatedAt,
              createdAt: x.createdAt,
            };
          });
      }

      // Count applications per job posting
      const appCounts: Record<number, number> = {};
      appRows.forEach((app: any) => {
        if (app.jobPostingId) {
          appCounts[app.jobPostingId] = (appCounts[app.jobPostingId] || 0) + 1;
        }
      });

      let jobList: JobPosting[] = [];
      if (jobsRes.ok) {
        const j = await jobsRes.json();
        const rawJobs = Array.isArray(j?.data) ? j.data : [];
        jobList = rawJobs.map((job: any) => ({
          ...job,
          _count: {
            applications: appCounts[job.id] || 0
          }
        }));
        setJobs(jobList);
      }

      // Combine hires
      const allHires = [...formattedRequests, ...formattedApplications];
      allHires.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
      setHiredRows(allHires as any);

      // Build unified activities list
      const activities: any[] = [];

      // 1. Studio requests activity
      requestRows.forEach(row => {
        if (row.status === 'in_progress') {
          activities.push({
            title: 'Onboarding Finalized',
            desc: `${row.professional?.fullName || 'Artist'} accepted proposed terms for ${row.professional?.position || 'role'}`,
            time: row.updatedAt,
            icon: 'hire',
          });
        } else if (row.status === 'pending') {
          activities.push({
            title: 'Opportunity Sent',
            desc: `Sent engagement request to ${row.professional?.fullName || 'an artist'}`,
            time: row.createdAt,
            icon: 'request',
          });
        }
      });

      // 2. Job applications activity (when hired)
      appRows.forEach(row => {
        if (row.status === 'hired') {
          activities.push({
            title: 'Onboarding Finalized',
            desc: `${row.professional?.fullName || 'Artist'} accepted proposed terms for ${row.jobPosting?.title || 'role'}`,
            time: row.updatedAt,
            icon: 'hire',
          });
        }
      });

      // 3. New roles published activity
      jobList.slice(0, 3).forEach(job => {
        activities.push({
          title: job.status === 'open' ? 'New Role Published' : 'Role Updated',
          desc: `Published opening for "${job.title}"`,
          time: job.createdAt,
          icon: 'job',
        });
      });

      // Sort activities by time desc
      activities.sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime());
      setActivityItems(activities.slice(0, 6));

    } catch (err) {
      console.error('StudioProfile fetchAll error:', err);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const studioName = studioProfile?.name || userData?.studio?.companyName || userData?.companyName || 'Your Studio';
  const talentCode = studioProfile?.talentCode || userData?.talentId?.talentCode;
  const industryFocus = WORK_TYPE_LABELS[studioInfo?.workType] || studioInfo?.workType || '—';
  const teamSize = studioInfo?.teamSize ? `${studioInfo.teamSize} Artists` : '—';
  const location = studioProfile?.location || userData?.studio?.location || '—';
  const verificationId = talentCode || '—';

  const getFileUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
  };

  const activeJobs = jobs.filter(j => j.status === 'open');

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] no-scrollbar text-left">
      <SEO
        title="Studio Dashboard"
        description="Manage your studio profile, job postings, team members, and check hiring activity on AUI."
        keywords="studio dashboard, aui studio, hire animators, team management"
      />

      {isManageModalOpen && (
        <ManageStudioProfileModal onClose={() => { setIsManageModalOpen(false); fetchAll(); }} />
      )}
      {isStudioInfoModalOpen && (
        <ManageStudioInfoModal onClose={() => { setIsStudioInfoModalOpen(false); fetchAll(); }} />
      )}

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-6 text-left">

        {/* ─── 1. HERO HEADER CARD ─── */}
        <section className="bg-white rounded-[28px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Top gradient strip */}
          <div className="h-2 bg-gradient-to-r from-[#DBEAFE] via-[#EFF6FF] to-[#F8FAFF]" />

          <div className="p-8 md:p-10 space-y-8">
            {/* Top row */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#2563EB]">
                  <Building2 size={14} />
                  Studio Operations Center
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tight leading-tight">
                  {studioName}
                </h1>
                <p className="text-[15px] text-gray-400 font-medium leading-relaxed">
                  Manage your studio profile and hiring activity. Maintain branding, track active candidates.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  onClick={() => setIsManageModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] text-[#111827] hover:bg-gray-50 transition-all"
                >
                  <Settings size={14} /> Manage Public Profile
                </button>
                <button
                  onClick={() => {
                    if (talentCode) navigate(`/talent/${talentCode}`);
                    else alert('Please manage your public profile first to generate your ID.');
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] text-[#111827] hover:bg-gray-50 transition-all"
                >
                  <ExternalLink size={14} /> View Public Page
                </button>
                <button
                  onClick={() => setIsStudioInfoModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-[#2563EB] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.18em] hover:bg-[#1D4ED8] transition-all"
                >
                  <Edit3 size={14} /> Edit Studio Info
                </button>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
              {[
                { label: 'Industry Focus', value: industryFocus },
                { label: 'Studio Size', value: teamSize },
                { label: 'HQ Location', value: location },
                { label: 'Verification ID', value: verificationId, isCode: true },
              ].map(stat => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{stat.label}</div>
                  {stat.isCode ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-black text-[#111827]">{stat.value}</span>
                      {talentCode && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                          Verified
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-[15px] font-bold text-[#111827]">{stat.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 2. ACTIVE HIRES & ON BENCH ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Hires */}
          <section className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#111827] tracking-tight">Active Hires</h2>
                <p className="text-[12px] text-gray-400 font-medium mt-0.5">Artists on-the-scene and finalized ledgers</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                {hiredRows.length} Hired
              </span>
            </div>

            {hiredRows.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm font-bold text-gray-300">No active hires yet</p>
                <p className="text-xs text-gray-300 mt-1">Finalized engagements will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                {hiredRows.map(row => {
                  const pro = row.professional;
                  const name = pro?.fullName || pro?.user?.email?.split('@')[0] || 'Unknown';
                  const avatar = pro?.avatarUrl ? getFileUrl(pro.avatarUrl) : '';
                  return (
                    <div key={row.id} className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-2xl border border-gray-50 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-4 min-w-0">
                        {avatar ? (
                          <img src={avatar} alt={name} className="w-11 h-11 rounded-xl object-cover" />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-sm uppercase">{name[0]}</div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#111827] truncate">{name}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{pro?.primarySkill || pro?.position || 'Artist'} • {pro?.experienceYears || 0} Years</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-sm font-black text-[#111827]">{row.proposedBudget || '—'}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mt-0.5">
                          <ShieldCheck size={10} className="inline mr-1" />Ledger Final
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* On Bench */}
          <section className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-7 space-y-5">
            <div>
              <h2 className="text-lg font-black text-[#111827] tracking-tight">On Bench</h2>
              <p className="text-[12px] text-gray-400 font-medium mt-0.5">Shortlisted production-ready superstars ({benchRows.length})</p>
            </div>

            {benchRows.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm font-bold text-gray-300">Talent bench is empty</p>
                <p className="text-xs text-gray-300 mt-1 max-w-[240px] mx-auto">Shortlist verified candidates inside the Talent Pool to construct your priority bench.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                  {benchRows.map(row => {
                    const pro = row.professional;
                    const name = pro?.fullName || 'Unknown';
                    const avatar = pro?.avatarUrl ? getFileUrl(pro.avatarUrl) : '';
                    return (
                      <div key={row.id} className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-2xl border border-gray-50 hover:shadow-sm transition-all cursor-pointer" onClick={() => {
                        const code = pro?.user?.talentId?.talentCode;
                        if (code) navigate(`/talent/${code}`);
                      }}>
                        <div className="flex items-center gap-4 min-w-0">
                          {avatar ? (
                            <img src={avatar} alt={name} className="w-11 h-11 rounded-xl object-cover" />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-sm uppercase">{name[0]}</div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#111827] truncate">{name}</p>
                            <p className="text-[11px] text-gray-400 font-medium capitalize">{pro?.position || 'Artist'} • {pro?.primarySkill || '—'}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 shrink-0" />
                      </div>
                    );
                  })}
                </div>
                {benchRows.length > 3 && (
                  <button onClick={() => navigate('/hire')} className="w-full text-center text-[10px] font-black uppercase tracking-widest text-[#2563EB] hover:text-[#1D4ED8] transition-colors pt-2">
                    Manage Talent Pool →
                  </button>
                )}
              </div>
            )}
          </section>
        </div>

        {/* ─── 3. OPEN ROLES & SIDEBAR ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          {/* Open Roles */}
          <section className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#111827] tracking-tight">Open Roles</h2>
                <p className="text-[12px] text-gray-400 font-medium mt-0.5">Managed listings and application pipelines</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-[#111827] text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-200">
                {activeJobs.length} Active Jobs
              </span>
            </div>

            {activeJobs.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm font-bold text-gray-300">No open roles</p>
                <p className="text-xs text-gray-300 mt-1">Post your first role from the Talent Pool.</p>
                <button onClick={() => navigate('/hire')} className="mt-4 px-6 py-2.5 bg-[#2563EB] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1D4ED8] transition-all inline-flex items-center gap-2">
                  <Plus size={14} /> Post a Role
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {activeJobs.map(job => {
                  const deadline = job.hiringDeadline || job.startDate;
                  const applicants = job._count?.applications || 0;
                  return (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/job/${job.id}/applications`)}
                      className="flex items-center justify-between py-5 cursor-pointer group hover:bg-gray-50/50 -mx-3 px-3 rounded-xl transition-all"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <h4 className="text-[15px] font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors">{job.title}</h4>
                          {job.workMode && (
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">{job.workMode}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium mt-1">
                          {deadline ? `Deadline: ${new Date(deadline).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}` : 'No deadline'}
                          {' • '}Capacity: {job.artistCount} position{job.artistCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 ml-4">
                        <div className="text-right">
                          <p className="text-xl font-black text-[#111827]">{applicants}</p>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Applicants</p>
                        </div>
                        <ArrowRight size={16} className="text-gray-300 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* CTA Banner */}
            <div className="bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#60A5FA] rounded-[24px] p-8 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative z-10 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Access Verified Network</p>
                <h3 className="text-2xl font-black tracking-tight leading-tight">Discover Top Industry Talent</h3>
                <p className="text-[13px] text-white/70 font-medium leading-relaxed">
                  Find vetted modelers, VFX supervisor gurus, lighting experts, cinematic animators And many more inside the AUI secure, ledger-backed Talent Pool.
                </p>
                <button
                  onClick={() => navigate('/hire')}
                  className="mt-2 flex items-center gap-3 bg-white text-[#2563EB] px-6 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg w-full justify-center"
                >
                  Go to Talent Pool <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Studio Activity */}
            <section className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-7 space-y-5">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-[#2563EB]" />
                <h2 className="text-lg font-black text-[#111827] tracking-tight">Studio Activity</h2>
              </div>

              {activityItems.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm font-bold text-gray-300">No activity yet</p>
                  <p className="text-xs text-gray-300 mt-1">Your recent actions will appear here.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {activityItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0">
                      <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0 mt-0.5">
                        <Building2 size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-[#111827]">{item.title}</p>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5 line-clamp-1">{item.desc}</p>
                      </div>
                      <span className="text-[11px] text-gray-300 font-medium shrink-0 whitespace-nowrap">{timeAgo(item.time)}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

      </main>
    </div>
  );
};

export default StudioProfile;
