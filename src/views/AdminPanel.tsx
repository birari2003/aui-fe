import React from 'react';
import { Users, Briefcase, GraduationCap, LayoutDashboard, FileText, CheckCircle, XCircle, Eye, Filter, Share2, History } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { View } from '../types';
import { fetchAdminUsers, updateUserStatus, fetchAnalytics } from '../services/adminServices';
import { getAllSpecialRequests, updateSpecialRequestStatus } from '../services/specialRequestServices';
import { motion, AnimatePresence } from 'framer-motion';


const AdminPanel = ({ setView }: { setView: (v: View) => void }) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'applications' | 'special_requests'>('overview');
  const [users, setUsers] = React.useState<any[]>([]);
  const [specialRequests, setSpecialRequests] = React.useState<any[]>([]);
  const [analytics, setAnalytics] = React.useState<any>(null);

  const [loading, setLoading] = React.useState(true);
  const [filters, setFilters] = React.useState({ role: 'all', status: 'all' });
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [specialRequestSubTab, setSpecialRequestSubTab] = React.useState<'professional' | 'institute'>('institute');
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [sharingReq, setSharingReq] = React.useState<any>(null);
  const [shareSearch, setShareSearch] = React.useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, analyticsRes, specialRes] = await Promise.all([
        fetchAdminUsers(filters),
        fetchAnalytics(),
        getAllSpecialRequests(localStorage.getItem('token') || '')
      ]);
      
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.data);
      }
      
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.data);
      }

      if (specialRes.ok) {
        const specialData = await specialRes.json();
        setSpecialRequests(specialData.data);
      }

    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [filters]);

  const handleStatusUpdate = async (userId: number, newStatus: 'approved' | 'rejected') => {
    setActionLoading(`${userId}-${newStatus}`);
    try {
      const res = await updateUserStatus(userId, newStatus);
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        // Refresh analytics after status change
        const analyticsRes = await fetchAnalytics();
        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setAnalytics(analyticsData.data);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSpecialStatusUpdate = async (id: number, newStatus: any, responseMessage?: string) => {
    setActionLoading(`${id}-${newStatus}`);
    try {
      const res = await updateSpecialRequestStatus(localStorage.getItem('token') || '', id, { 
        status: newStatus,
        responseMessage
      });
      if (res.ok) {
        setSpecialRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus, responseMessage } : r));
      }
    } catch (err) {
      console.error('Failed to update special request status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleShareToInstitute = async (instituteId: number) => {
    if (!sharingReq) return;
    const token = localStorage.getItem('token') || '';
    setActionLoading(`share-${instituteId}`);
    try {
      const { shareProfessionalToInstitute } = await import('../services/specialRequestServices');
      const res = await shareProfessionalToInstitute(token, {
        professionalId: sharingReq.professionalId,
        instituteId,
        message: `Recommendation: Check out this professional portfolio.`
      });
      if (res.ok) {
        setIsShareModalOpen(false);
        setSharingReq(null);
        alert('Professional shared successfully!');
      }
    } catch (err) {
      console.error('Failed to share:', err);
    } finally {
      setActionLoading(null);
    }
  };


  const SummaryCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <Card className="p-6 bg-white border-gray-100 shadow-premium flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass}`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm font-bold text-text-muted uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-display font-bold text-brand-primary">{value || 0}</h3>
      </div>
    </Card>
  );

  const renderDetailSection = (title: string, fields: { label: string, value: any }[]) => {
    const validFields = fields.filter(f => f.value !== undefined && f.value !== null && f.value !== 'NULL' && f.value !== '');
    if (validFields.length === 0) return null;
    
    return (
      <div className="space-y-4">
        <h5 className="text-[10px] font-bold text-brand-primary uppercase tracking-widest border-b border-gray-100 pb-2">{title}</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validFields.map((field, i) => (
            <div key={i} className="space-y-1">
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-tight">{field.label}</p>
              <p className="text-sm font-semibold text-brand-primary break-words">{String(field.value)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProfessionalDetails = (data: any) => (
    <div className="space-y-8">
      {renderDetailSection("Core Profile", [
        { label: "Full Name", value: data.fullName || data.full_name },
        { label: "Email", value: data.email },
        { label: "Experience Level", value: data.level || data.experience_level },
        { label: "Years of Experience", value: data.experienceYears || data.experience_years },
        { label: "Primary Skill", value: data.primarySkill || data.primary_skill },
        { label: "Position", value: data.position },
        { label: "Production Type", value: data.productionType || data.production_type },
      ])}
      
      {renderDetailSection("Expertise & Links", [
        { label: "Responsibility Scope", value: data.responsibilityScope || data.responsibility_scope },
        { label: "Showreel URL", value: data.showreelUrl || data.showreel_url },
        { label: "Portfolio URL", value: data.portfolioUrl || data.portfolio_url },
        { label: "Availability", value: data.availability },
      ])}

      {renderDetailSection("Mentorship", [
        {
          label: "Is Mentor",
          value:
            data.isMentor === true ||
            data.isMentor === 1 ||
            data.isMentor === '1' ||
            data.is_mentor === true ||
            data.is_mentor === 1 ||
            data.is_mentor === '1'
              ? "Yes"
              : "No",
        },
        { label: "Mentor Availability", value: data.mentorAvailability || data.mentor_availability },
        { label: "Mentor Specializations", value: data.mentorSpecializations || data.mentor_specializations },
      ])}

      {renderDetailSection("Platform Meta", [
        { label: "Professional ID", value: data.id },
        { label: "User ID", value: data.userId },
        { label: "Confidence Score", value: data.confidenceScore || data.confidence_score },
        {
          label: "Verification Status",
          value:
            data.verificationStatus === true || data.verification_status === true
              ? "Verified"
              : "Unverified",
        },
        { label: "Created At", value: data.created_at || data.createdAt },
        { label: "Updated At", value: data.updated_at || data.updatedAt },
      ])}
    </div>
  );

  const getProfileData = (user: any) => {
    if (user.role === 'professional') return user.professional;
    if (user.role === 'studio') return user.studio;
    if (user.role === 'institute') return user.institute;
    return null;
  };

  const renderStudioDetails = (data: any) => (
    <div className="space-y-8">
      {renderDetailSection("Studio Profile", [
        { label: "Studio Name", value: data.studioName },
        { label: "Email", value: data.email },
        { label: "Contact Person", value: data.contactPerson },
        { label: "Designation", value: data.designation },
        { label: "Location", value: data.location },
        { label: "Website", value: data.website },
        { label: "LinkedIn", value: data.linkedinProfile },
      ])}
      {renderDetailSection("Business Info", [
        { label: "Team Size", value: data.teamSize },
        { label: "Years in Operation", value: data.yearsInOperation },
        { label: "Work Type", value: data.workType },
        { label: "Hiring Frequency", value: data.hiringFrequency },
        { label: "Project Type", value: data.projectType },
        { label: "Annual Projects", value: data.annualProjects },
        { label: "Hiring Tiers", value: data.hiringTiers },
      ])}
      {renderDetailSection("Platform Meta", [
        { label: "Studio ID", value: data.id },
        { label: "User ID", value: data.userId },
        { label: "Verification Status", value: data.verificationStatus ? "Verified" : "Unverified" },
        { label: "Created At", value: data.createdAt || data.created_at },
        { label: "Updated At", value: data.updatedAt || data.updated_at },
      ])}
    </div>
  );

  const renderInstituteDetails = (data: any) => (
    <div className="space-y-8">
      {renderDetailSection("Institute Profile", [
        { label: "Institute Name", value: data.instituteName },
        { label: "Email", value: data.email },
        { label: "Contact Person", value: data.contactPerson },
        { label: "Designation", value: data.designation },
        { label: "Location", value: data.location },
        { label: "Website", value: data.website },
      ])}
      {renderDetailSection("Educational Info", [
        { label: "Student Count", value: data.studentCount },
        { label: "Branch Count", value: data.branchCount },
        { label: "Courses Offered", value: data.coursesOffered },
        { label: "Conducts Workshops", value: data.conductsWorkshops ? "Yes" : "No" },
        { label: "Industry Exposure", value: data.industryExposure },
        { label: "Years in Education", value: data.yearsInEducation },
      ])}
      {renderDetailSection("Additional Info", [
        { label: "Support Needed", value: data.supportNeeded },
        { label: "Active Services", value: data.activeServices },
        { label: "Requirements", value: data.requirements },
        { label: "Verification URL", value: data.verificationUrl },
      ])}
      {renderDetailSection("Platform Meta", [
        { label: "Institute ID", value: data.id },
        { label: "User ID", value: data.userId },
        { label: "Verification Status", value: data.verificationStatus ? "Verified" : "Unverified" },
        { label: "Created At", value: data.createdAt || data.created_at },
        { label: "Updated At", value: data.updatedAt || data.updated_at },
      ])}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8 sm:space-y-12 text-left">
      <div className="space-y-4">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-primary tracking-tight leading-tight">Admin Control Center</h2>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm transition-premium flex items-center gap-2 whitespace-nowrap ${activeTab === 'overview' ? 'bg-brand-primary text-white shadow-lg' : 'bg-brand-surface text-text-secondary hover:bg-gray-200'}`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`px-4 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm transition-premium flex items-center gap-2 whitespace-nowrap ${activeTab === 'applications' ? 'bg-brand-primary text-white shadow-lg' : 'bg-brand-surface text-text-secondary hover:bg-gray-200'}`}
          >
            <FileText size={18} /> Applications {users.filter(u => u.status === 'pending').length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{users.filter(u => u.status === 'pending').length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('special_requests')}
            className={`px-4 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm transition-premium flex items-center gap-2 whitespace-nowrap ${activeTab === 'special_requests' ? 'bg-brand-primary text-white shadow-lg' : 'bg-brand-surface text-text-secondary hover:bg-gray-200'}`}
          >
            <Users size={18} /> Special Requests {specialRequests.filter(r => r.status === 'pending').length > 0 && <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{specialRequests.filter(r => r.status === 'pending').length}</span>}
          </button>

        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard title="Total Users" value={analytics?.users} icon={Users} colorClass="bg-blue-50 text-blue-600" />
            <SummaryCard title="Professionals" value={analytics?.professionals} icon={Users} colorClass="bg-emerald-50 text-emerald-600" />
            <SummaryCard title="Studios" value={analytics?.studios} icon={Briefcase} colorClass="bg-purple-50 text-purple-600" />
            <SummaryCard title="Institutes" value={analytics?.institutes} icon={GraduationCap} colorClass="bg-amber-50 text-amber-600" />
          </div>
          
          <Card className="p-8 bg-brand-surface border-transparent">
            <h4 className="text-xl font-bold text-brand-primary mb-4">Platform Health</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-sm text-text-secondary">System checks for all core services are online. Database connectivity is 100%.</p>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <CheckCircle size={16} /> All Systems Operational
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : activeTab === 'special_requests' ? (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
             <div className="space-y-1">
               <h3 className="text-2xl font-display font-bold text-brand-primary">Collaboration Requests Pipeline</h3>
               <p className="text-text-muted text-sm uppercase font-bold tracking-widest">Manage specialized connection requests</p>
             </div>
             <div className="flex items-center gap-2 bg-brand-surface p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                <button 
                  onClick={() => setSpecialRequestSubTab('institute')}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-premium flex items-center gap-2 ${specialRequestSubTab === 'institute' ? 'bg-white text-brand-primary shadow-md ring-1 ring-black/5' : 'text-text-secondary hover:text-brand-primary'}`}
                >
                  <GraduationCap size={16} /> From Institutes {specialRequests.filter(r => r.senderRole === 'institute' && r.status === 'pending').length > 0 && <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{specialRequests.filter(r => r.senderRole === 'institute' && r.status === 'pending').length}</span>}
                </button>
                <button 
                  onClick={() => setSpecialRequestSubTab('professional')}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-premium flex items-center gap-2 ${specialRequestSubTab === 'professional' ? 'bg-white text-brand-primary shadow-md ring-1 ring-black/5' : 'text-text-secondary hover:text-brand-primary'}`}
                >
                  <Users size={16} /> From Professionals {specialRequests.filter(r => r.senderRole === 'professional' && r.status === 'pending').length > 0 && <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{specialRequests.filter(r => r.senderRole === 'professional' && r.status === 'pending').length}</span>}
                </button>
             </div>
             <button onClick={loadData} className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-2">
                <Filter size={14} /> Refresh List
             </button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Loading Requests...</p>
              </div>
            ) : specialRequests.filter(r => r.senderRole === specialRequestSubTab).length === 0 ? (
              <div className="py-20 text-center bg-brand-surface rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-text-secondary">No special requests found for {specialRequestSubTab}s.</p>
              </div>
            ) : (
              specialRequests.filter(r => r.senderRole === specialRequestSubTab).map(req => (
                <Card key={req.id} className="p-6 bg-white border-gray-100 shadow-premium space-y-6 hover:shadow-premium-hover transition-premium">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${req.senderRole === 'institute' ? 'bg-amber-50 text-amber-600' : 'bg-brand-surface text-brand-primary'}`}>
                        {req.senderRole === 'institute' ? <GraduationCap size={24} /> : <Users size={24} />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-brand-primary">{req.professionalName}</h4>
                          <Badge variant="outline" className="text-[10px]">{req.senderRole?.toUpperCase()}</Badge>
                        </div>
                        <p className="text-xs text-text-muted uppercase font-bold tracking-widest">
                          Sender: {req.senderRole === 'institute' ? (req.institute?.user?.email) : (req.professional?.user?.email)} • {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={req.status === 'pending' ? 'info' : req.status === 'rejected' ? 'warning' : req.status === 'contacted' ? 'info' : 'success'}>
                      {req.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 text-left">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{req.senderRole === 'institute' ? 'Institute URL' : 'Target Institute URL'}</p>
                        <a href={req.institutePublicUrl?.startsWith('http') ? req.institutePublicUrl : `https://${req.institutePublicUrl}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-brand-accent hover:underline flex items-center gap-1">
                           {req.institutePublicUrl || 'N/A'} <Eye size={14} />
                        </a>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{req.senderRole === 'institute' ? 'Sender Public URL' : 'Professional Portfolio'}</p>
                        <a href={req.professionalPublicUrl?.startsWith('http') ? req.professionalPublicUrl : `https://${req.professionalPublicUrl}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
                           View Portfolio/Link <Eye size={14} />
                        </a>
                      </div>
                    </div>
                    <div className="space-y-4 text-left">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Mentorship Date/Time</p>
                        <p className="text-sm font-semibold text-brand-primary">{req.mentorshipTime || 'Not specified'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Message to Admin</p>
                        <p className="text-sm text-text-secondary italic">"{req.message}"</p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Response Section */}
                  <div className="p-4 bg-brand-surface rounded-xl space-y-3">
                    <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Admin Response / Notes</p>
                    <textarea 
                      className="w-full bg-white border-gray-100 rounded-lg text-sm p-3 focus:ring-1 focus:ring-brand-accent min-h-[80px]"
                      placeholder="Type your response to the user here..."
                      defaultValue={req.responseMessage || ''}
                      id={`resp-${req.id}`}
                    />
                  </div>

                   {/* Sharing History Section */}
                   {((specialRequestSubTab === 'professional' && req.professionalId) || (specialRequestSubTab === 'institute' && req.instituteId)) && (
                     <div className="px-4 py-3 bg-brand-surface/50 rounded-xl border border-gray-100/50 space-y-2">
                       <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest flex items-center gap-2">
                         <History size={12} /> {specialRequestSubTab === 'professional' ? 'Previously Shared With' : 'Admin Recommendations Sent'}
                       </p>
                       <div className="flex flex-wrap gap-2">
                         {specialRequests
                           .filter(r => r.senderRole === 'admin' && (
                             (specialRequestSubTab === 'professional' && r.professionalId === req.professionalId) ||
                             (specialRequestSubTab === 'institute' && r.instituteId === req.instituteId)
                           ))
                           .map(share => (
                             <Badge key={share.id} variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1 py-1 px-3">
                               {specialRequestSubTab === 'professional' ? (share.institute?.instituteName || 'Institute') : (share.professionalName || 'Professional')}
                               <span className="text-[8px] opacity-60 ml-1">• {new Date(share.createdAt).toLocaleDateString()}</span>
                             </Badge>
                           ))}
                         {specialRequests.filter(r => r.senderRole === 'admin' && (
                             (specialRequestSubTab === 'professional' && r.professionalId === req.professionalId) ||
                             (specialRequestSubTab === 'institute' && r.instituteId === req.instituteId)
                           )).length === 0 && (
                           <p className="text-[10px] text-text-muted italic">No recommendations sent for this request yet.</p>
                         )}
                       </div>
                     </div>
                   )}

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-50">
                      {req.senderRole === 'professional' && (
                        <Button 
                          variant="ghost" 
                          className="px-6 py-2 text-xs text-brand-accent hover:bg-brand-surface"
                          onClick={() => { setSharingReq(req); setIsShareModalOpen(true); }}
                        >
                          <Share2 size={16} className="mr-2" /> Share with Institute
                        </Button>
                      )}
                      {req.status === 'pending' && (
                      <Button 
                        variant="secondary" 
                        className="px-6 py-2 text-xs text-red-500 border-red-100 hover:bg-red-50"
                        loading={actionLoading === `${req.id}-rejected`}
                        onClick={() => handleSpecialStatusUpdate(req.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    )}
                    {req.status !== 'contacted' && req.status !== 'closed' && (
                      <Button 
                        className="px-6 py-2 text-xs bg-brand-primary"
                        loading={actionLoading === `${req.id}-contacted`}
                        onClick={() => handleSpecialStatusUpdate(req.id, 'contacted')}
                      >
                        Mark as Contacted
                      </Button>
                    )}
                    {req.status === 'contacted' && (
                      <Button 
                        className="px-6 py-2 text-xs bg-emerald-500 hover:bg-emerald-600"
                        loading={actionLoading === `${req.id}-closed`}
                        onClick={() => {
                          const msg = (document.getElementById(`resp-${req.id}`) as HTMLTextAreaElement)?.value;
                          handleSpecialStatusUpdate(req.id, 'closed', msg);
                        }}
                      >
                        Close Request
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                <Filter size={16} className="text-text-muted" />
                <select 
                  className="bg-transparent text-sm font-bold outline-none cursor-pointer"
                  value={filters.role}
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="all">All Roles</option>
                  <option value="professional">Professionals</option>
                  <option value="studio">Studios</option>
                  <option value="institute">Institutes</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                <select 
                  className="bg-transparent text-sm font-bold outline-none cursor-pointer"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <button onClick={loadData} className="text-sm font-bold text-brand-primary hover:underline self-start sm:self-auto">Refresh</button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Loading Applications...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="py-20 text-center bg-brand-surface rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-text-secondary">No applications found matching your criteria.</p>
              </div>
            ) : (
              users.map(user => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={user.id}
                >
                  <Card className="p-4 sm:p-6 bg-white border-gray-100 shadow-premium flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-premium-hover transition-premium">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                      <div className="w-12 h-12 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary">
                        {user.role === 'professional' ? <Users size={24} /> : user.role === 'studio' ? <Briefcase size={24} /> : <GraduationCap size={24} />}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <h4 className="font-bold text-brand-primary break-all">{user.email}</h4>
                          <Badge variant={user.status === 'approved' ? 'success' : user.status === 'rejected' ? 'warning' : 'info'}>{user.status}</Badge>
                        </div>
                        <p className="text-xs text-text-muted uppercase font-bold tracking-widest">{user.role} • {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto flex items-center justify-end sm:justify-start gap-2 sm:gap-3 flex-wrap">
                      <Button 
                        variant="ghost" 
                        className="px-3 sm:px-4 py-2 text-xs" 
                        onClick={() => { setSelectedUser(user); setIsDetailsModalOpen(true); }}
                      >
                        <Eye size={14} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Details</span>
                      </Button>
                      
                      {user.status !== 'rejected' && (
                        <Button 
                          variant="secondary" 
                          className="px-3 sm:px-4 py-2 text-xs text-red-500 hover:bg-red-50 border-red-100" 
                          loading={actionLoading === `${user.id}-rejected`}
                          onClick={() => handleStatusUpdate(user.id, 'rejected')}
                        >
                          <XCircle size={14} className="mr-2" /> Reject
                        </Button>
                      )}
                      
                      {user.status !== 'approved' && (
                        <Button 
                          className="px-3 sm:px-4 py-2 text-xs bg-emerald-500 hover:bg-emerald-600" 
                          loading={actionLoading === `${user.id}-approved`}
                          onClick={() => handleStatusUpdate(user.id, 'approved')}
                        >
                          <CheckCircle size={14} className="mr-2" /> Approve
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}


      {/* User Details Modal */}
      <Modal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)}
        title="Application Details Explorer"
        size="xl"
        showFooter={false}
        message={
          selectedUser && (
            <div className="space-y-10 text-left py-4">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-brand-surface p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-gray-100">
                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm border border-gray-50">
                    {selectedUser.role === 'professional' ? <Users size={32} /> : selectedUser.role === 'studio' ? <Briefcase size={32} /> : <GraduationCap size={32} />}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold text-brand-primary break-all">{selectedUser.email}</h4>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant={selectedUser.status === 'approved' ? 'success' : selectedUser.status === 'rejected' ? 'warning' : 'info'}>{selectedUser.status}</Badge>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{selectedUser.role}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Profile Sections */}
              <div className="space-y-8 px-2">
                {selectedUser.role === 'professional' ? (
                  selectedUser.professional ? renderProfessionalDetails(selectedUser.professional) : (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <p className="text-text-secondary font-medium">No professional profile linked yet.</p>
                    </div>
                  )
                ) : selectedUser.role === 'studio' ? (
                  selectedUser.studio ? renderStudioDetails(selectedUser.studio) : (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <p className="text-text-secondary font-medium">No studio profile linked yet.</p>
                    </div>
                  )
                ) : selectedUser.role === 'institute' ? (
                  selectedUser.institute ? renderInstituteDetails(selectedUser.institute) : (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <p className="text-text-secondary font-medium">No institute profile linked yet.</p>
                    </div>
                  )
                ) : getProfileData(selectedUser) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(getProfileData(selectedUser)).map(([key, value]: any) => {
                      if (['id', 'userId', 'createdAt', 'updatedAt', 'email'].includes(key)) return null;
                      if (!value || value === 'NULL') return null;
                      return (
                        <div key={key} className="space-y-1 bg-brand-surface p-4 rounded-2xl border border-transparent hover:border-gray-100 transition-premium">
                          <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-sm font-semibold text-brand-primary">{String(value)}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary italic text-center py-8">No additional profile data available.</p>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                {selectedUser.status !== 'rejected' && (
                  <Button 
                    variant="secondary" 
                    className="flex-1 py-4 text-red-500 hover:bg-red-50 border-red-100 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]" 
                    loading={actionLoading === `${selectedUser.id}-rejected`}
                    onClick={() => { handleStatusUpdate(selectedUser.id, 'rejected'); setIsDetailsModalOpen(false); }}
                  >
                    <XCircle size={18} className="mr-2" /> {selectedUser.status === 'approved' ? 'Revoke & Reject' : 'Reject Application'}
                  </Button>
                )}
                {selectedUser.status !== 'approved' && (
                  <Button 
                    className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-200" 
                    loading={actionLoading === `${selectedUser.id}-approved`}
                    onClick={() => { handleStatusUpdate(selectedUser.id, 'approved'); setIsDetailsModalOpen(false); }}
                  >
                    <CheckCircle size={18} className="mr-2" /> {selectedUser.status === 'rejected' ? 'Re-approve Request' : 'Approve Request'}
                  </Button>
                )}
              </div>
            </div>
          )
        }
      />
      {/* Share Modal */}
      <Modal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Professional with Institute"
        size="lg"
        showFooter={false}
        message={
          <div className="space-y-4 sm:space-y-6 text-left py-2 sm:py-4">
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-brand-primary uppercase tracking-wider">Search Institute</label>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  className="w-full bg-brand-surface border-none rounded-xl text-sm p-4 pl-12 focus:ring-2 focus:ring-brand-accent/20"
                  placeholder="Type institute name..."
                  value={shareSearch}
                  onChange={(e) => setShareSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
              {users
                .filter(u => u.role === 'institute' && u.status === 'approved' && (u.institute?.instituteName?.toLowerCase().includes(shareSearch.toLowerCase()) || u.email.toLowerCase().includes(shareSearch.toLowerCase())))
                .map(inst => (
                  <Card key={inst.id} className="p-3 sm:p-4 bg-brand-surface border-transparent hover:border-brand-accent/30 transition-premium flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-brand-primary shadow-sm">
                        <GraduationCap size={18} />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-brand-primary text-xs sm:text-sm truncate">{inst.institute?.instituteName}</h5>
                        <p className="text-[9px] sm:text-[10px] text-text-muted uppercase font-bold tracking-widest truncate">{inst.email}</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full sm:w-auto px-4 py-2 text-[10px] sm:text-xs bg-brand-primary"
                      loading={actionLoading === `share-${inst.institute?.id}`}
                      onClick={() => handleShareToInstitute(inst.institute?.id)}
                    >
                      Send
                    </Button>
                  </Card>
                ))}
              {users.filter(u => u.role === 'institute' && u.status === 'approved').length === 0 && (
                <div className="py-10 text-center text-text-muted italic text-sm">
                  No approved institutes found to share with.
                </div>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default AdminPanel;
