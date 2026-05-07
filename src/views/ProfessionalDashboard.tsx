import React from 'react';
import { Users, MessageSquare, ShieldCheck, Briefcase, CheckCircle2, TrendingUp, Shield, GraduationCap, Search } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { View } from '../types';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, getStudioJobPostings, getStudioRequests, respondToStudioRequest } from '../services/professionalServices';
import { getMyCollaborationRequests, respondToCollaborationRequest } from '../services/collaborationServices';
import EditProfileModal from '../components/EditProfileModal';
import ManagePublicProfileModal from '../components/ManagePublicProfileModal';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ProfessionalDashboard = ({ setView }: { setView: (v: View) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isPublicModalOpen, setIsPublicModalOpen] = React.useState(false);
  const [requests, setRequests] = React.useState<any[]>([]);
  const [studioRequests, setStudioRequests] = React.useState<any[]>([]);
  const [studioJobPostings, setStudioJobPostings] = React.useState<any[]>([]);
  const [requestLoadingId, setRequestLoadingId] = React.useState<number | null>(null);

  const fetchDashboardData = React.useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const [profRes, reqRes] = await Promise.all([
        getMyProfile(token),
        getMyCollaborationRequests(token)
      ]);

      const [studioReqRes, studioJobRes] = await Promise.all([
        getStudioRequests(token),
        getStudioJobPostings(token),
      ]);

      if (profRes.ok) {
        const data = await profRes.json();
        setProfile(data.data);
      }
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(reqData.data);
      }

      if (studioReqRes.ok) {
        const studioReqData = await studioReqRes.json();
        setStudioRequests(studioReqData.data);
      }

      if (studioJobRes.ok) {
        const studioJobData = await studioJobRes.json();
        setStudioJobPostings(studioJobData.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRespond = async (id: number, status: 'accepted' | 'rejected') => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await respondToCollaborationRequest(token, id, { status });
      if (res.ok) fetchDashboardData();
    } catch (err) {
      console.error('Failed to respond:', err);
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

  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
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

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
          <div className="space-y-1 text-left flex items-center gap-6">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={displayName} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
            ) : (
              <div className="w-20 h-20 bg-brand-surface rounded-2xl flex items-center justify-center text-brand-primary/20">
                <ShieldCheck size={40} />
              </div>
            )}
            <div className="text-left">
              <h1 className="text-4xl font-display font-bold text-brand-primary tracking-tight text-left">
                Welcome back, {displayName}
              </h1>
              <p className="text-text-secondary text-left">
                {isProfileComplete 
                  ? 'Your professional identity is verified and active.' 
                  : 'Let\'s get your professional identity verified and active.'}
              </p>
            </div>
          </div>
          <div className="flex gap-3 text-left">
            <Button 
              variant="secondary" 
              onClick={() => navigate(`/talent/${profile?.user?.talentId?.talentCode || ''}`)}
              disabled={!isProfileComplete}
              className="px-6 border border-gray-100 hover:bg-white disabled:opacity-50"
            >
              View Public Profile
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setIsPublicModalOpen(true)}
              disabled={!isProfileComplete}
              className="px-6 border border-gray-100 hover:bg-white disabled:opacity-50 gap-2"
            >
              <Sparkles size={16} className="text-brand-accent" /> Manage Public Profile
            </Button>
            <Button onClick={() => setIsEditModalOpen(true)} className="px-8 shadow-premium">
              {isProfileComplete ? 'Edit Profile' : 'Setup Profile'}
            </Button>
          </div>
        </div>

        {activeSection === 'overview' && (
          <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
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
        </div>

        {/* Collaboration Invitations Section */}
        {requests.filter(r => r.senderRole === 'institute').length > 0 && (
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
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
          <section className="space-y-6 text-left">
            <h2 className="text-2xl font-display font-bold text-brand-primary text-left border-b border-gray-50 pb-4">Active Opportunities</h2>
            <div className="space-y-4 text-left">
              {[
                { studio: 'Mumbai Animation Studio', role: 'Character Animator', type: 'Feature Film', pay: 'Premium' },
                { studio: 'VFX Global', role: 'Lighting Lead', type: 'Commercial', pay: 'Industry Std' },
              ].map((opp, i) => (
                <Card key={i} className="p-6 flex items-center justify-between hover:border-brand-accent/30 text-left group">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-brand-surface rounded-xl flex items-center justify-center text-text-muted text-left group-hover:bg-brand-accent/5 group-hover:text-brand-accent transition-colors">
                      <Briefcase size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-brand-primary text-left">{opp.role}</p>
                      <p className="text-xs text-text-secondary text-left">{opp.studio} • {opp.type}</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="text-xs border border-gray-100 hover:bg-white px-4">View</Button>
                </Card>
              ))}
              <div className="p-8 bg-brand-surface/30 rounded-brand border border-dashed border-gray-200 text-center space-y-2">
                <p className="text-sm font-medium text-text-muted">More opportunities based on your skills</p>
                <Button variant="secondary" className="text-xs">Browse All</Button>
              </div>
            </div>
          </section>

          <section className="space-y-6 text-left">
            <h2 className="text-2xl font-display font-bold text-brand-primary text-left border-b border-gray-50 pb-4">Recent Ledger Activity</h2>
            <div className="space-y-4 text-left">
              {isProfileComplete ? (
                profile.workLedgers && profile.workLedgers.length > 0 ? (
                  profile.workLedgers.map((entry: any) => (
                    <div key={entry.id} className="p-6 bg-brand-surface rounded-brand border border-gray-50 flex items-center justify-between text-left hover:border-emerald-100 transition-colors">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm text-left">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-brand-primary text-left">{entry.projectName}</p>
                          <p className="text-[10px] text-text-secondary uppercase tracking-widest text-left">{entry.role}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-text-muted text-left">{entry.completionDate}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-12 bg-brand-surface/30 rounded-brand border border-dashed border-gray-200 text-center space-y-3">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary/20 mx-auto shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-brand-primary">No Activity Yet</p>
                      <p className="text-xs text-text-secondary">Your work history will appear here once verified.</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="p-12 bg-gray-50/50 rounded-brand border border-dashed border-gray-200 text-center space-y-3 grayscale opacity-60">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-300 mx-auto shadow-sm">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-400">Activity Locked</p>
                    <p className="text-xs text-gray-400">Complete your profile to see your ledger activity.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
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
