import React from 'react';
import { Users, Briefcase, GraduationCap, LayoutDashboard, FileText, CheckCircle, XCircle, Eye, Filter, Share2, History, ExternalLink, Plus, Trash2, Edit, BookOpen, Clock, Shield, ArrowRight, Network, Mail, Send, Film, Play, Sparkles, MapPin, Phone, Calendar, Building2, Star, Download, RotateCcw, MoreVertical, ChevronLeft, ChevronRight, User, Search } from 'lucide-react';
import Button from '../components/Button';
import SEO from '../components/SEO';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { View } from '../types';
import { fetchAdminUsers, updateUserStatus, fetchAnalytics, sendBulkEmail, fetchEmailAccounts } from '../services/adminServices';
import { getAllSpecialRequests, updateSpecialRequestStatus } from '../services/specialRequestServices';
import { motion, AnimatePresence } from 'framer-motion';
import * as workshopServices from '../services/instituteWorkshopServices';
import * as workshopRequestServices from '../services/workshopRequestServices';
import * as nexusServices from '../services/nexusServices';
import * as showreelServices from '../services/showreelServices';
import { fetchAspirantShares, shareAspirantsWithInstitutes } from '../services/aspirantServices';
import { BASE_URL } from '../utils/urls';



const AdminPanel = ({ setView }: { setView: (v: View) => void }) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'applications' | 'special_requests' | 'professionals' | 'institutes' | 'studios' | 'aspirants' | 'bulk_email' | 'showreels'>('overview');
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

  // Mentor filter in Professional tab directory
  const [mentorFilter, setMentorFilter] = React.useState<'all' | 'mentor' | 'non_mentor'>('all');

  // Aspirants tab filters & pagination state
  const [aspirantLocationFilter, setAspirantLocationFilter] = React.useState<string>('all');
  const [aspirantGenderFilter, setAspirantGenderFilter] = React.useState<string>('all');
  const [aspirantCollegeFilter, setAspirantCollegeFilter] = React.useState<string>('all');
  const [aspirantCourseFilter, setAspirantCourseFilter] = React.useState<string>('all');
  const [aspirantSortBy, setAspirantSortBy] = React.useState<string>('recent');
  const [aspirantPage, setAspirantPage] = React.useState<number>(1);

  // Share Aspirants Modal State
  const [isShareAspirantsModalOpen, setIsShareAspirantsModalOpen] = React.useState(false);
  const [selectedShareInstituteIds, setSelectedShareInstituteIds] = React.useState<number[]>([]);
  const [shareAspirantsSearch, setShareAspirantsSearch] = React.useState('');
  const [isSharingAspirants, setIsSharingAspirants] = React.useState(false);

  // Bulk Email State
  const [emailSubject, setEmailSubject] = React.useState('');
  const [emailBody, setEmailBody] = React.useState('');
  const [bulkEmailRole, setBulkEmailRole] = React.useState<'all' | 'professional' | 'studio' | 'institute'>('all');
  const [bulkEmailMentorFilter, setBulkEmailMentorFilter] = React.useState<'all' | 'mentor' | 'non_mentor'>('all');
  const [selectedUserIds, setSelectedUserIds] = React.useState<Record<number, boolean>>({});
  const [isSendingEmails, setIsSendingEmails] = React.useState(false);
  const [emailSendStatus, setEmailSendStatus] = React.useState<{ success: boolean; message: string } | null>(null);
  const [fromEmail, setFromEmail] = React.useState<string>('');
  const [emailAccounts, setEmailAccounts] = React.useState<{ email: string; label: string }[]>([]);

  const [facilitationRequests, setFacilitationRequests] = React.useState<any[]>([]);
  const [facilitationLoading, setFacilitationLoading] = React.useState(false);

  // Workshop Management State
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = React.useState(false);
  const [selectedInstitute, setSelectedInstitute] = React.useState<any>(null);
  const [instituteWorkshops, setInstituteWorkshops] = React.useState<any[]>([]);
  const [isWorkshopFormOpen, setIsWorkshopFormOpen] = React.useState(false);
  const [currentWorkshop, setCurrentWorkshop] = React.useState<any>(null);
  const [workshopLoading, setWorkshopLoading] = React.useState(false);
  const [workshopForm, setWorkshopForm] = React.useState({
    category: '',
    title: '',
    duration: '',
    level: '',
    pillars: '',
    outcome: '',
    rate: '',
    modelType: 'workshops'
  });
  const [isFacilitationAdminModalOpen, setIsFacilitationAdminModalOpen] = React.useState(false);
  const [isNexusHubModalOpen, setIsNexusHubModalOpen] = React.useState(false);

  // Nexus Management State
  const [nexusOpportunities, setNexusOpportunities] = React.useState<any[]>([]);
  const [isNexusFormOpen, setIsNexusFormOpen] = React.useState(false);
  const [currentNexus, setCurrentNexus] = React.useState<any>(null);
  const [nexusLoading, setNexusLoading] = React.useState(false);
  const [nexusForm, setNexusForm] = React.useState({
    title: '',
    date: '',
    limit: '',
    tag: '',
    description: ''
  });

  // Showreel Management State
  const [showreels, setShowreels] = React.useState<any[]>([]);
  const [showreelsLoading, setShowreelsLoading] = React.useState(false);
  const [isShowreelModalOpen, setIsShowreelModalOpen] = React.useState(false);
  const [isShowreelFormSubmitting, setIsShowreelFormSubmitting] = React.useState(false);
  const [editingShowreelId, setEditingShowreelId] = React.useState<number | null>(null);
  const [showreelForm, setShowreelForm] = React.useState({
    category: '' as 'professional' | 'studio' | 'institute' | '',
    selectedUserId: null as number | null,
    artistName: '',
    description: '',
    publicUrl: '',
    videoType: 'link' as 'link' | 'file',
    videoUrl: '',
    videoFile: null as File | null,
    longMovieUrl: '',
    title: '',
    topic: '',
    thumbnailFile: null as File | null
  });
  const [playingVideoId, setPlayingVideoId] = React.useState<number | null>(null);
  const [userSearchQuery, setUserSearchQuery] = React.useState('');
  const [allUsers, setAllUsers] = React.useState<any[]>([]);
  const [allUsersLoading, setAllUsersLoading] = React.useState(false);

  const getUserName = (user: any) => {
    const profile = user.professional || user.studio || user.institute;
    if (!profile) return user.email;
    return profile.fullName || profile.full_name || profile.instituteName || profile.studioName || user.email;
  };

  const loadAllUsers = async () => {
    try {
      setAllUsersLoading(true);
      const res = await fetchAdminUsers({ role: 'all', status: 'all' });
      const data = await res.json();
      if (res.ok && data.data) {
        setAllUsers(data.data);
      }
    } catch (err) {
      console.error('Error fetching all users for showreels:', err);
    } finally {
      setAllUsersLoading(false);
    }
  };

  const loadShowreels = async () => {
    try {
      setShowreelsLoading(true);
      const res = await showreelServices.fetchShowreels();
      const data = await res.json();
      if (data.success) {
        setShowreels(data.data);
      }
    } catch (err) {
      console.error('Error fetching showreels:', err);
    } finally {
      setShowreelsLoading(false);
    }
  };

  const handleSaveShowreel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showreelForm.category) {
      alert('Please select a Category');
      return;
    }
    if (!showreelForm.artistName.trim()) {
      alert('Artist/Studio/Professional Name is required');
      return;
    }
    if (showreelForm.videoType === 'link' && !showreelForm.videoUrl.trim()) {
      alert('Video Link is required');
      return;
    }
    if (showreelForm.videoType === 'file' && !showreelForm.videoFile && editingShowreelId === null) {
      alert('Video File is required');
      return;
    }

    setIsShowreelFormSubmitting(true);
    const token = localStorage.getItem('token') || '';

    try {
      const formData = new FormData();
      formData.append('artistName', showreelForm.artistName);
      formData.append('description', showreelForm.description);
      formData.append('publicUrl', showreelForm.publicUrl);
      formData.append('category', showreelForm.category);
      formData.append('longMovieUrl', showreelForm.longMovieUrl);
      formData.append('title', showreelForm.title);
      formData.append('topic', showreelForm.topic);
      
      if (showreelForm.videoType === 'file') {
        if (showreelForm.videoFile) {
          formData.append('videoFile', showreelForm.videoFile);
        } else {
          formData.append('videoUrl', showreelForm.videoUrl); // keep existing path
        }
      } else {
        formData.append('videoUrl', showreelForm.videoUrl);
      }

      if (showreelForm.thumbnailFile) {
        formData.append('thumbnailFile', showreelForm.thumbnailFile);
      }

      let res;
      if (editingShowreelId !== null) {
        res = await showreelServices.updateShowreel(token, editingShowreelId, formData);
      } else {
        res = await showreelServices.createShowreel(token, formData);
      }
      const data = await res.json();

      if (res.ok && data.success) {
        setIsShowreelModalOpen(false);
        setEditingShowreelId(null);
        setShowreelForm({
          category: '',
          selectedUserId: null,
          artistName: '',
          description: '',
          publicUrl: '',
          videoType: 'link',
          videoUrl: '',
          videoFile: null,
          longMovieUrl: '',
          title: '',
          topic: '',
          thumbnailFile: null
        });
        await loadShowreels();
      } else {
        alert(data.message || 'Failed to save showreel');
      }
    } catch (err) {
      console.error('Failed to save showreel:', err);
      alert('An error occurred while saving the showreel.');
    } finally {
      setIsShowreelFormSubmitting(false);
    }
  };

  const handleEditShowreelClick = (reel: any) => {
    const isDirect = isDirectVideoUrl(reel.videoUrl);
    setEditingShowreelId(reel.id);

    // Attempt to match the user in allUsers
    let matchedUserId: number | null = null;
    if (reel.publicUrl) {
      const codeMatch = reel.publicUrl.match(/\/talent\/([A-Z0-9-]+)/i);
      if (codeMatch && codeMatch[1]) {
        const found = allUsers.find(u => u.talentId?.talentCode === codeMatch[1]);
        if (found) matchedUserId = found.id;
      }
    }
    if (!matchedUserId && allUsers.length > 0) {
      const found = allUsers.find(u => {
        const name = getUserName(u);
        return name && name.toLowerCase() === reel.artistName.toLowerCase();
      });
      if (found) matchedUserId = found.id;
    }

    setShowreelForm({
      category: reel.category || '',
      selectedUserId: matchedUserId,
      artistName: reel.artistName,
      description: reel.description || '',
      publicUrl: reel.publicUrl || '',
      videoType: isDirect ? 'file' : 'link',
      videoUrl: reel.videoUrl, // store path / link
      videoFile: null,
      longMovieUrl: reel.longMovieUrl || '',
      title: reel.title || '',
      topic: reel.topic || '',
      thumbnailFile: null
    });
    setIsShowreelModalOpen(true);
  };

  const handleDeleteShowreel = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this showreel?')) return;
    const token = localStorage.getItem('token') || '';
    try {
      const res = await showreelServices.deleteShowreel(token, id);
      const data = await res.json();
      if (res.ok && data.success) {
        await loadShowreels();
      } else {
        alert(data.message || 'Failed to delete showreel');
      }
    } catch (err) {
      console.error('Failed to delete showreel:', err);
    }
  };

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

      await fetchFacilitationRequests();

    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [filters]);

  // Load available sender email accounts once on mount
  React.useEffect(() => {
    setUserSearchQuery('');
    if (activeTab === 'showreels') {
      loadShowreels();
      loadAllUsers();
    }
  }, [activeTab]);

  React.useEffect(() => {
    const loadEmailAccounts = async () => {
      try {
        const res = await fetchEmailAccounts();
        if (res.ok) {
          const data = await res.json();
          setEmailAccounts(data.data || []);
          if (data.data && data.data.length > 0) {
            setFromEmail(data.data[0].email);
          }
        }
      } catch (err) {
        console.error('Failed to load email accounts:', err);
      }
    };
    loadEmailAccounts();
  }, []);

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

  const fetchFacilitationRequests = async () => {
    try {
      setFacilitationLoading(true);
      const res = await workshopRequestServices.getAllWorkshopRequests();
      const data = await res.json();
      if (data.success) {
        setFacilitationRequests(data.data);
      }
    } catch (err) {
      console.error('Error fetching facilitation requests:', err);
    } finally {
      setFacilitationLoading(false);
    }
  };

  const handleUpdateFacilitationStatus = async (id: number, status: string) => {
    try {
      const res = await workshopRequestServices.updateWorkshopRequestStatus(id, status);
      if (res.ok) {
        setFacilitationRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch (err) {
      console.error('Error updating facilitation status:', err);
    }
  };

  const loadWorkshops = async () => {
    try {
      setWorkshopLoading(true);
      const res = await workshopServices.fetchAllWorkshops();
      const data = await res.json();
      if (data.success) {
        setInstituteWorkshops(data.data);
      }
    } catch (err) {
      console.error('Error fetching workshops:', err);
    } finally {
      setWorkshopLoading(false);
    }
  };

  const handleOpenWorkshopManagement = async () => {
    setIsWorkshopModalOpen(true);
    await loadWorkshops();
  };

  const handleSaveWorkshop = async () => {
    setWorkshopLoading(true);
    try {
      const workshopData = {
        ...workshopForm,
        pillars: workshopForm.pillars.split('\n').filter(p => p.trim() !== '')
      };
      let res;
      if (currentWorkshop) {
        res = await workshopServices.updateInstituteWorkshop(currentWorkshop.id, workshopData);
      } else {
        res = await workshopServices.createInstituteWorkshop(workshopData);
      }

      if (res.ok) {
        await loadWorkshops();
        setIsWorkshopFormOpen(false);
        setCurrentWorkshop(null);
        setWorkshopForm({
          category: '',
          title: '',
          duration: '',
          level: '',
          pillars: '',
          outcome: '',
          rate: '',
          modelType: 'workshops'
        });
      }
    } catch (err) {
      console.error('Failed to save workshop:', err);
    } finally {
      setWorkshopLoading(false);
    }
  };

  const handleDeleteWorkshop = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return;
    setWorkshopLoading(true);
    try {
      const res = await workshopServices.deleteInstituteWorkshop(id);
      if (res.ok) {
        setInstituteWorkshops(prev => prev.filter(w => w.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete workshop:', err);
    } finally {
      setWorkshopLoading(false);
    }
  };


  const loadNexus = async () => {
    try {
      setNexusLoading(true);
      const res = await nexusServices.fetchNexusOpportunities();
      const data = await res.json();
      if (data.success) {
        setNexusOpportunities(data.data);
      }
    } catch (err) {
      console.error('Error fetching nexus:', err);
    } finally {
      setNexusLoading(false);
    }
  };

  const handleSaveNexus = async () => {
    const token = localStorage.getItem('token') || '';
    setNexusLoading(true);
    try {
      let res;
      if (currentNexus) {
        res = await nexusServices.updateNexusOpportunity(token, currentNexus.id, nexusForm);
      } else {
        res = await nexusServices.createNexusOpportunity(token, nexusForm);
      }

      if (res.ok) {
        await loadNexus();
        setIsNexusFormOpen(false);
        setCurrentNexus(null);
        setNexusForm({
          title: '',
          date: '',
          limit: '',
          tag: '',
          description: ''
        });
      }
    } catch (err) {
      console.error('Failed to save nexus:', err);
    } finally {
      setNexusLoading(false);
    }
  };

  const handleDeleteNexus = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this nexus opportunity?')) return;
    const token = localStorage.getItem('token') || '';
    setNexusLoading(true);
    try {
      const res = await nexusServices.deleteNexusOpportunity(token, id);
      if (res.ok) {
        await loadNexus();
      }
    } catch (err) {
      console.error('Failed to delete nexus:', err);
    } finally {
      setNexusLoading(false);
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
        { label: "Phone Number", value: selectedUser?.phone || data.phone },
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

  const renderAspirantDetails = (data: any) => (
    <div className="space-y-8">
      {data.photoUrl && (
        <div className="flex items-center gap-4 bg-brand-surface p-4 rounded-2xl border border-gray-100">
          <img src={data.photoUrl} alt={data.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/40" />
          <div>
            <h4 className="font-bold text-lg text-brand-primary">{data.fullName}</h4>
            <p className="text-xs text-text-muted">Aspirant Network Profile</p>
          </div>
        </div>
      )}

      {renderDetailSection("Personal Information", [
        { label: "Full Name", value: data.fullName },
        { label: "Email", value: data.email },
        { label: "Phone Number", value: data.phone || selectedUser?.phone },
        { label: "Date of Birth (DOB)", value: data.dob },
        { label: "Gender", value: data.gender },
        { label: "Location", value: [data.city, data.district, data.state, data.country].filter(Boolean).join(', ') },
      ])}

      {renderDetailSection("Education Details", [
        { label: "College Name", value: data.collegeName },
        { label: "Education / Course", value: data.educationTitle || (data.education?.title) },
        { label: "Course Year", value: data.year },
      ])}

      {renderDetailSection("Career Interest & Meta", [
        { label: "Interested Department", value: data.interestedDepartment },
        { label: "Verification Status", value: data.verificationStatus ? "Verified" : "Unverified" },
        { label: "Registered At", value: data.createdAt },
      ])}
    </div>
  );

  const getProfileData = (user: any) => {
    if (user.role === 'professional') return user.professional;
    if (user.role === 'studio') return user.studio;
    if (user.role === 'institute') return user.institute;
    if (user.role === 'aspirant') return user.aspirant;
    return null;
  };

  const renderStudioDetails = (data: any) => (
    <div className="space-y-8">
      {renderDetailSection("Studio Profile", [
        { label: "Studio Name", value: data.studioName },
        { label: "Email", value: data.email },
        { label: "Phone Number", value: selectedUser?.phone || data.phone },
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

  const renderInstituteDetails = (data: any) => {
    let parsedServices = "";
    if (data.servicesRequired) {
      try {
        const parsed = JSON.parse(data.servicesRequired);
        parsedServices = Array.isArray(parsed) ? parsed.join(", ") : String(parsed);
      } catch (e) {
        parsedServices = String(data.servicesRequired);
      }
    }

    let parsedLinks = "";
    if (data.officialLinks) {
      try {
        const parsed = JSON.parse(data.officialLinks);
        parsedLinks = Array.isArray(parsed) ? parsed.join(", ") : String(parsed);
      } catch (e) {
        parsedLinks = String(data.officialLinks);
      }
    }

    return (
      <div className="space-y-8">
        {renderDetailSection("Institute Profile", [
          { label: "Institute Name", value: data.instituteName },
          { label: "Email", value: data.email },
          { label: "Phone Number", value: selectedUser?.phone || data.phone },
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
          { label: "Services Required from AUI", value: parsedServices },
          { label: "Official Institute Links", value: parsedLinks },
          { label: "Requirements", value: data.requirements },
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
  };

  const getFilteredBulkUsers = () => {
    return users.filter(user => {
      // Role match
      if (bulkEmailRole !== 'all' && user.role !== bulkEmailRole) return false;
      // Mentor match (only applies if role is professional)
      if (user.role === 'professional') {
        const isMentor = user.professional?.isMentor || user.professional?.is_mentor;
        if (bulkEmailMentorFilter === 'mentor' && !isMentor) return false;
        if (bulkEmailMentorFilter === 'non_mentor' && isMentor) return false;
      }
      return true;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    const visibleUsers = getFilteredBulkUsers();
    const newSelected = { ...selectedUserIds };
    visibleUsers.forEach(u => {
      newSelected[u.id] = checked;
    });
    setSelectedUserIds(newSelected);
  };

  const handleToggleUser = (userId: number, checked: boolean) => {
    setSelectedUserIds(prev => ({ ...prev, [userId]: checked }));
  };

  const handleSendBulkEmails = async () => {
    const visibleUsers = getFilteredBulkUsers();
    const recipientEmails = visibleUsers.filter(u => selectedUserIds[u.id]).map(u => u.email);

    if (recipientEmails.length === 0) {
      setEmailSendStatus({ success: false, message: 'Please select at least one recipient.' });
      return;
    }
    if (!emailSubject.trim()) {
      setEmailSendStatus({ success: false, message: 'Please enter an email subject.' });
      return;
    }
    if (!emailBody.trim()) {
      setEmailSendStatus({ success: false, message: 'Please enter the email body content.' });
      return;
    }

    setIsSendingEmails(true);
    setEmailSendStatus(null);

    try {
      const res = await sendBulkEmail(recipientEmails, emailSubject, emailBody, fromEmail || undefined);
      if (res.ok) {
        const data = await res.json();
        setEmailSendStatus({
          success: true,
          message: `Successfully sent to ${data.sentCount} recipients.${data.failedCount > 0 ? ` Failed to send to ${data.failedCount} recipients.` : ''}`
        });
        setEmailSubject('');
        setEmailBody('');
        setSelectedUserIds({});
      } else {
        const data = await res.json();
        setEmailSendStatus({ success: false, message: data.message || 'Failed to send emails.' });
      }
    } catch (err: any) {
      console.error(err);
      setEmailSendStatus({ success: false, message: 'An error occurred while sending emails.' });
    } finally {
      setIsSendingEmails(false);
    }
  };

  const renderUserList = (tab: string) => {
    const roleMap: Record<string, string> = {
      'professionals': 'professional',
      'studios': 'studio',
      'institutes': 'institute',
      'aspirants': 'aspirant'
    };
    const role = roleMap[tab];
    let filteredUsers = users.filter(u => u.role === role);

    if (tab === 'professionals') {
      if (mentorFilter === 'mentor') {
        filteredUsers = filteredUsers.filter(u => u.professional?.isMentor || u.professional?.is_mentor);
      } else if (mentorFilter === 'non_mentor') {
        filteredUsers = filteredUsers.filter(u => !(u.professional?.isMentor || u.professional?.is_mentor));
      }

      // Sort: Mentors first (1, 0)
      filteredUsers = [...filteredUsers].sort((a, b) => {
        const isMentorA = a.professional?.isMentor || a.professional?.is_mentor ? 1 : 0;
        const isMentorB = b.professional?.isMentor || b.professional?.is_mentor ? 1 : 0;
        return isMentorB - isMentorA;
      });
    }

    if (userSearchQuery.trim()) {
      const q = userSearchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter(u => {
        const profile = getProfileData(u);
        const name = profile ? (profile.fullName || profile.full_name || profile.instituteName || profile.studioName || '') : '';
        const email = u.email || '';
        const phone = String(u.phone || profile?.phone || '');
        const talentCode = (u.talentId?.talentCode || '');

        return name.toLowerCase().includes(q) ||
               email.toLowerCase().includes(q) ||
               phone.toLowerCase().includes(q) ||
               talentCode.toLowerCase().includes(q);
      });
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder={`Search ${tab === 'professionals' ? 'professionals' : tab === 'studios' ? 'studios' : 'institutes'} by name, email, ID...`}
              className="w-full bg-white border border-gray-200 focus:border-brand-primary rounded-xl text-xs p-2.5 font-semibold outline-none transition-all shadow-sm"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            {tab === 'institutes' && (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="text-xs font-bold text-brand-primary hover:bg-brand-surface"
                  onClick={() => {
                    setIsNexusHubModalOpen(true);
                    loadNexus();
                  }}
                >
                  <Network size={14} className="mr-2 inline-block" /> Manage Nexus
                </Button>
                <Button
                  variant="ghost"
                  className="text-xs font-bold text-brand-purple hover:bg-purple-50 relative"
                  onClick={() => setIsFacilitationAdminModalOpen(true)}
                >
                  <BookOpen size={14} className="mr-2" /> Facilitation Requests
                  {facilitationRequests.filter(r => r.status === 'pending').length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full animate-pulse">
                      {facilitationRequests.filter(r => r.status === 'pending').length}
                    </span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="text-xs font-bold text-brand-purple hover:bg-purple-50"
                  onClick={handleOpenWorkshopManagement}
                >
                  <LayoutDashboard size={14} className="mr-2" /> Workshop Management
                </Button>
              </div>
            )}
            {tab === 'professionals' && (
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Mentorship:</span>
                <select
                  className="bg-transparent text-xs font-bold outline-none cursor-pointer"
                  value={mentorFilter}
                  onChange={(e) => setMentorFilter(e.target.value as any)}
                >
                  <option value="all">All Professionals</option>
                  <option value="mentor">Mentors Only</option>
                  <option value="non_mentor">Non-Mentors Only</option>
                </select>
              </div>
            )}
            <button onClick={loadData} className="text-sm font-bold text-brand-primary hover:underline">Refresh</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Loading {tab}...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-20 text-center bg-brand-surface rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-text-secondary">No {tab} registered yet.</p>
            </div>
          ) : (
            filteredUsers.map(user => {
              const profile = getProfileData(user);
              const name = profile ? (profile.fullName || profile.full_name || profile.instituteName || profile.studioName || 'N/A') : 'N/A';
              const publicUrl = profile ? (profile.portfolioUrl || profile.portfolio_url || profile.website || profile.showreelUrl || profile.showreel_url) : null;
              const talentCode = user.talentId?.talentCode;
              const phone = user.phone || profile?.phone;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={user.id}
                >
                  <Card className="p-4 sm:p-6 bg-white border-gray-100 shadow-premium flex flex-col lg:flex-row lg:items-center gap-6 hover:shadow-premium-hover transition-premium">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary shrink-0">
                        {user.role === 'professional' ? <Briefcase size={24} /> : user.role === 'studio' ? <Users size={24} /> : <GraduationCap size={24} />}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-bold text-brand-primary text-lg truncate max-w-[200px]">{name}</h4>
                          <Badge variant={user.status === 'approved' ? 'success' : user.status === 'rejected' ? 'warning' : 'info'}>{user.status}</Badge>
                          {user.role === 'professional' && (user.professional?.isMentor || user.professional?.is_mentor) && (
                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">Mentor</Badge>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-medium text-text-secondary truncate">{user.email}</p>
                          {phone && (
                            <p className="text-xs font-medium text-text-secondary truncate">Mobile: {phone}</p>
                          )}
                          {talentCode && (
                            <p className="text-[10px] font-bold text-brand-accent uppercase tracking-wider">Internal ID: {talentCode}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex justify-center min-w-0">
                      <div className="space-y-1 text-center min-w-0">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Public Profile</p>
                        {talentCode ? (
                          <a
                            href={`${window.location.origin}/${user.role === 'institute' ? 'institute' : 'talent'}/${talentCode}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-primary hover:underline text-xs font-bold flex items-center gap-1 truncate"
                          >
                            View Public Profile <ExternalLink size={12} />
                          </a>
                        ) : (
                          <p className="text-[10px] text-text-muted italic">No platform ID generated</p>
                        )}
                      </div>
                    </div>

                    <div className="w-full lg:w-auto flex items-center justify-end gap-3 shrink-0">
                      <Button
                        variant="ghost"
                        className="px-4 py-2 text-xs"
                        onClick={() => { setSelectedUser(user); setIsDetailsModalOpen(true); }}
                      >
                        <Eye size={14} className="mr-2" /> Details
                      </Button>


                      {user.status !== 'rejected' && (
                        <Button
                          variant="secondary"
                          className="px-4 py-2 text-xs text-red-500 hover:bg-red-50 border-red-100"
                          loading={actionLoading === `${user.id}-rejected`}
                          onClick={() => handleStatusUpdate(user.id, 'rejected')}
                        >
                          <XCircle size={14} className="mr-2" /> Reject
                        </Button>
                      )}

                      {user.status !== 'approved' && (
                        <Button
                          className="px-4 py-2 text-xs bg-emerald-500 hover:bg-emerald-600"
                          loading={actionLoading === `${user.id}-approved`}
                          onClick={() => handleStatusUpdate(user.id, 'approved')}
                        >
                          <CheckCircle size={14} className="mr-2" /> Approve
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const handleOpenShareAspirantsModal = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetchAspirantShares(token);
      if (res.ok) {
        const data = await res.json();
        setSelectedShareInstituteIds(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch shared institute IDs:', err);
    }
    setShareAspirantsSearch('');
    setIsShareAspirantsModalOpen(true);
  };

  const handleSaveShareAspirants = async () => {
    const token = localStorage.getItem('token') || '';
    setIsSharingAspirants(true);
    try {
      const res = await shareAspirantsWithInstitutes(token, selectedShareInstituteIds);
      if (res.ok) {
        setIsShareAspirantsModalOpen(false);
        alert('Aspirant list sharing preferences updated successfully!');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to share Aspirants list.');
      }
    } catch (err) {
      console.error('Failed to share aspirants:', err);
      alert('An error occurred while saving sharing preferences.');
    } finally {
      setIsSharingAspirants(false);
    }
  };

  const exportAspirantsToExcel = (aspirantList: any[]) => {
    const headers = ['Full Name', 'Gender', 'Email', 'Phone', 'DOB', 'Country', 'State', 'City/District', 'College', 'Education Title', 'Year', 'Interested Department', 'Verification Status'];
    const rows = aspirantList.map((u) => {
      const p = getProfileData(u) || {};
      return [
        `"${(p.fullName || '').replace(/"/g, '""')}"`,
        `"${(p.gender || '').replace(/"/g, '""')}"`,
        `"${(u.email || p.email || '').replace(/"/g, '""')}"`,
        `"${(p.phone || u.phone || '').replace(/"/g, '""')}"`,
        `"${(p.dob || '').replace(/"/g, '""')}"`,
        `"${(p.country || '').replace(/"/g, '""')}"`,
        `"${(p.state || '').replace(/"/g, '""')}"`,
        `"${(p.city || p.district || '').replace(/"/g, '""')}"`,
        `"${(p.collegeName || '').replace(/"/g, '""')}"`,
        `"${(p.educationTitle || '').replace(/"/g, '""')}"`,
        `"${(p.year || '').replace(/"/g, '""')}"`,
        `"${(p.interestedDepartment || '').replace(/"/g, '""')}"`,
        `"${p.verificationStatus ? 'Verified' : 'Pending'}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Aspirants_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderAspirantsView = () => {
    const rawAspirants = users.filter((u) => u.role === 'aspirant');

    // Dynamic Filter Options
    const locationOptions = Array.from(
      new Set(
        rawAspirants
          .map((u) => {
            const p = getProfileData(u);
            if (!p) return null;
            return p.state ? `${p.city || p.district || ''}, ${p.state}` : p.city || p.country;
          })
          .filter(Boolean)
      )
    );

    const collegeOptions = Array.from(
      new Set(rawAspirants.map((u) => getProfileData(u)?.collegeName).filter(Boolean))
    );

    const courseOptions = Array.from(
      new Set(
        rawAspirants
          .map((u) => {
            const p = getProfileData(u);
            return p?.educationTitle ? `${p.educationTitle}${p.year ? ' - ' + p.year : ''}` : null;
          })
          .filter(Boolean)
      )
    );

    // Filtering
    let filtered = rawAspirants.filter((u) => {
      const p = getProfileData(u) || {};
      const fullName = (p.fullName || '').toLowerCase();
      const email = (u.email || p.email || '').toLowerCase();
      const phone = (u.phone || p.phone || '').toLowerCase();
      const q = userSearchQuery.toLowerCase();

      if (q && !fullName.includes(q) && !email.includes(q) && !phone.includes(q)) {
        return false;
      }

      if (aspirantLocationFilter !== 'all') {
        const loc = p.state ? `${p.city || p.district || ''}, ${p.state}` : p.city || p.country;
        if (loc !== aspirantLocationFilter) return false;
      }

      if (aspirantGenderFilter !== 'all') {
        if ((p.gender || '').toLowerCase() !== aspirantGenderFilter.toLowerCase()) return false;
      }

      if (aspirantCollegeFilter !== 'all') {
        if (p.collegeName !== aspirantCollegeFilter) return false;
      }

      if (aspirantCourseFilter !== 'all') {
        const courseStr = p.educationTitle ? `${p.educationTitle}${p.year ? ' - ' + p.year : ''}` : '';
        if (courseStr !== aspirantCourseFilter) return false;
      }

      return true;
    });

    // Sorting
    if (aspirantSortBy === 'name') {
      filtered.sort((a, b) => (getProfileData(a)?.fullName || '').localeCompare(getProfileData(b)?.fullName || ''));
    } else if (aspirantSortBy === 'college') {
      filtered.sort((a, b) => (getProfileData(a)?.collegeName || '').localeCompare(getProfileData(b)?.collegeName || ''));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    // Pagination (5 per page as shown in screenshot)
    const pageSize = 5;
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    const currentPage = Math.min(aspirantPage, totalPages);
    const paginatedAspirants = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
      <div className="space-y-8 text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-brand-primary tracking-tight">Aspirants</h2>
            <p className="text-text-secondary text-sm mt-1">
              Discover talented students interested in Animation, VFX, Gaming and more.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <Button
              onClick={handleOpenShareAspirantsModal}
              className="bg-brand-primary hover:bg-brand-accent text-white font-bold text-xs py-3 px-5 rounded-2xl flex items-center gap-2 shadow-sm transition-premium"
            >
              <Share2 size={16} />
              <span>Share Aspirants List</span>
            </Button>

            <Button
              onClick={() => exportAspirantsToExcel(filtered)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-5 rounded-2xl flex items-center gap-2 shadow-sm transition-premium"
            >
              <Download size={16} />
              <span>Download as Excel</span>
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-3">
          <select
            value={aspirantLocationFilter}
            onChange={(e) => { setAspirantLocationFilter(e.target.value); setAspirantPage(1); }}
            className="bg-brand-surface/60 border border-gray-100 rounded-xl px-3.5 py-2 text-xs font-semibold text-brand-primary outline-none focus:border-brand-accent transition-premium"
          >
            <option value="all">📍 All Locations</option>
            {locationOptions.map((loc: any) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <select
            value={aspirantGenderFilter}
            onChange={(e) => { setAspirantGenderFilter(e.target.value); setAspirantPage(1); }}
            className="bg-brand-surface/60 border border-gray-100 rounded-xl px-3.5 py-2 text-xs font-semibold text-brand-primary outline-none focus:border-brand-accent transition-premium"
          >
            <option value="all">👤 All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
          </select>

          <select
            value={aspirantCollegeFilter}
            onChange={(e) => { setAspirantCollegeFilter(e.target.value); setAspirantPage(1); }}
            className="bg-brand-surface/60 border border-gray-100 rounded-xl px-3.5 py-2 text-xs font-semibold text-brand-primary outline-none focus:border-brand-accent transition-premium max-w-xs truncate"
          >
            <option value="all">🏛️ All Colleges</option>
            {collegeOptions.map((col: any) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>

          <select
            value={aspirantCourseFilter}
            onChange={(e) => { setAspirantCourseFilter(e.target.value); setAspirantPage(1); }}
            className="bg-brand-surface/60 border border-gray-100 rounded-xl px-3.5 py-2 text-xs font-semibold text-brand-primary outline-none focus:border-brand-accent transition-premium max-w-xs truncate"
          >
            <option value="all">🎓 All Courses / Year</option>
            {courseOptions.map((crs: any) => (
              <option key={crs} value={crs}>{crs}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setAspirantLocationFilter('all');
              setAspirantGenderFilter('all');
              setAspirantCollegeFilter('all');
              setAspirantCourseFilter('all');
              setUserSearchQuery('');
              setAspirantPage(1);
            }}
            className="px-3.5 py-2 text-xs font-bold text-text-muted hover:text-brand-primary flex items-center gap-1.5 transition-premium ml-auto"
          >
            <RotateCcw size={14} /> Clear Filters
          </button>
        </div>

        {/* Count & Sort Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-semibold text-text-muted">
          <div>
            Total Aspirants: <span className="text-emerald-600 font-extrabold text-sm">{filtered.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={aspirantSortBy}
              onChange={(e) => setAspirantSortBy(e.target.value)}
              className="bg-white border border-gray-100 rounded-xl px-3 py-1.5 text-xs font-bold text-brand-primary outline-none shadow-sm cursor-pointer"
            >
              <option value="recent">Recently Added</option>
              <option value="name">Name A-Z</option>
              <option value="college">College A-Z</option>
            </select>
          </div>
        </div>

        {/* Aspirants Cards List */}
        <div className="space-y-6">
          {paginatedAspirants.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center text-text-muted text-sm font-semibold shadow-sm">
              No aspirants found matching the selected criteria.
            </div>
          ) : (
            paginatedAspirants.map((u) => {
              const p = getProfileData(u) || {};
              const isFemale = (p.gender || '').toLowerCase() === 'female';

              return (
                <Card
                  key={u.id}
                  className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-premium hover:shadow-premium-hover transition-all duration-300 relative group"
                >
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                    {/* Aspirant Photo Thumbnail */}
                    <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl bg-brand-surface border border-gray-100 shadow-sm shrink-0 overflow-hidden flex items-center justify-center relative">
                      {p.photoUrl || p.photo_url ? (
                        <img
                          src={p.photoUrl || p.photo_url}
                          alt={p.fullName || 'Aspirant'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50 text-emerald-600 font-extrabold text-3xl">
                          {(p.fullName || 'A')[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Right Details Container */}
                    <div className="flex-1 space-y-5 w-full">
                      {/* Name & Gender & Actions Row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="text-xl font-bold text-brand-primary tracking-tight">
                            {p.fullName || 'Unnamed Aspirant'}
                          </h4>
                          {p.gender && (
                            <span
                              className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                                isFemale
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                                  : 'bg-blue-50 text-blue-600 border border-blue-200/60'
                              }`}
                            >
                              {p.gender}
                            </span>
                          )}
                        </div>

                        {/* Actions Quick Button */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setSelectedUser(u); setIsDetailsModalOpen(true); }}
                            className="p-2 rounded-xl text-text-muted hover:text-brand-primary hover:bg-brand-surface transition-premium"
                            title="View Full Profile"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>

                      {/* 2-Column Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xs text-text-secondary font-medium">
                        {/* Column 1 */}
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <MapPin size={15} className="text-emerald-500 shrink-0" />
                            <span className="truncate">
                              <span className="font-semibold text-brand-primary">Location:</span>{' '}
                              {p.state ? `${p.city || p.district || ''}, ${p.state}` : p.city || p.country || 'Location not specified'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Phone size={15} className="text-emerald-500 shrink-0" />
                            <span>
                              <span className="font-semibold text-brand-primary">Phone:</span> {p.phone || u.phone || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Calendar size={15} className="text-emerald-500 shrink-0" />
                            <span>
                              <span className="font-semibold text-brand-primary">DOB:</span> {p.dob || 'DOB not specified'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Mail size={15} className="text-emerald-500 shrink-0" />
                            <span className="truncate">
                              <span className="font-semibold text-brand-primary">Email:</span> {u.email || p.email || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <Building2 size={15} className="text-emerald-500 shrink-0" />
                            <span className="truncate">
                              <span className="font-semibold text-brand-primary">College:</span> {p.collegeName || 'College not specified'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <GraduationCap size={15} className="text-emerald-500 shrink-0" />
                            <span className="truncate">
                              <span className="font-semibold text-brand-primary">Education:</span> {p.educationTitle || 'Education'} {p.year ? `– ${p.year}` : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Star size={15} className="text-emerald-500 shrink-0" />
                            <span className="truncate">
                              <span className="font-semibold text-brand-primary">Interested in:</span> {p.interestedDepartment || 'Animation / VFX'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tag Badges Row */}
                      {p.interestedDepartment && (
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          {p.interestedDepartment.split(',').map((dept: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-3.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            >
                              {dept.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination Footer */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 text-xs text-text-muted font-medium">
            <div>
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} aspirants
            </div>

            <div className="flex items-center gap-2 self-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setAspirantPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl border border-gray-100 hover:bg-brand-surface disabled:opacity-40 transition-premium text-brand-primary"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setAspirantPage(pg)}
                  className={`w-8 h-8 rounded-xl font-bold transition-premium text-xs ${
                    currentPage === pg
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'border border-gray-100 hover:bg-brand-surface text-brand-primary'
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setAspirantPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl border border-gray-100 hover:bg-brand-surface disabled:opacity-40 transition-premium text-brand-primary"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderShowreelsTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-display font-bold text-brand-primary">Showreel Showcase</h3>
            <p className="text-text-muted text-sm font-medium">Manage featured videos of artists, professionals, and studios</p>
          </div>
          <Button
            onClick={() => setIsShowreelModalOpen(true)}
            className="flex items-center gap-2 bg-brand-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Add Showreel
          </Button>
        </div>

        {showreelsLoading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Loading Showreels...</p>
          </div>
        ) : showreels.length === 0 ? (
          <div className="py-20 text-center bg-brand-surface rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-text-secondary font-medium">No showreels added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showreels.map((reel) => {
              const videoInfo = detectVideoUrl(reel.videoUrl);
              const isPlaying = playingVideoId === reel.id;

              return (
                <Card key={reel.id} className="bg-white border-gray-100 shadow-premium overflow-hidden flex flex-col hover:shadow-premium-hover transition-premium rounded-[24px]">
                  {/* Video Playback Container */}
                  <div className="relative aspect-video bg-black shrink-0 overflow-hidden">
                    {videoInfo.canEmbed ? (
                      !isPlaying ? (
                        <div
                          className="w-full h-full relative cursor-pointer flex items-center justify-center bg-[#0a0a0a]"
                          onClick={() => setPlayingVideoId(reel.id)}
                        >
                          {/* Thumbnail backgrounds */}
                          {videoInfo.type === 'youtube' && getYouTubeId(reel.videoUrl) ? (
                            <img
                              src={`https://img.youtube.com/vi/${getYouTubeId(reel.videoUrl)}/hqdefault.jpg`}
                              className="absolute inset-0 w-full h-full object-cover opacity-80"
                              alt="Showreel Cover"
                            />
                          ) : videoInfo.type === 'googledrive' && getGoogleDriveId(reel.videoUrl) ? (
                            <img
                              src={`https://drive.google.com/thumbnail?id=${getGoogleDriveId(reel.videoUrl)}&sz=w500`}
                              className="absolute inset-0 w-full h-full object-cover opacity-80"
                              alt="Showreel Cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]" />
                          )}
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                            <Play size={18} className="fill-[#4F46E5] text-[#4F46E5] ml-0.5" />
                          </div>
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                            {videoInfo.platformLabel}
                          </span>
                        </div>
                      ) : (
                        <iframe
                          src={videoInfo.embedUrl!}
                          title={reel.artistName}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                          allowFullScreen
                        />
                      )
                    ) : videoInfo.type === 'direct' ? (
                      <video
                        src={getFileUrl(reel.videoUrl)}
                        controls
                        className="w-full h-full object-contain"
                        preload="metadata"
                        playsInline
                      />
                    ) : (
                      // Invalid or un-embeddable URL card
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0a192f] to-[#020c1b] p-4 text-center">
                        <span className="text-white text-xs font-bold mb-2 truncate max-w-full">{reel.videoUrl}</span>
                        <a
                          href={reel.videoUrl.startsWith('http') ? reel.videoUrl : `https://${reel.videoUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-[#0a192f] font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-100"
                        >
                          <ExternalLink size={10} /> Open Link
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Body details */}
                  <div className="p-5 flex-1 flex flex-col space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {reel.category && (
                          <span className="inline-block bg-brand-surface text-brand-primary border border-brand-primary/10 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider">
                            {reel.category}
                          </span>
                        )}
                        {reel.topic && (
                          <span className="inline-block bg-[#F3F4F6] text-[#4B5563] border border-gray-200 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider">
                            {reel.topic}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-brand-primary text-base line-clamp-1 mt-1">
                        {reel.title || 'Untitled Showreel'}
                      </h4>
                      <p className="text-xs text-text-muted font-bold block">
                        By {reel.artistName}
                      </p>
                      <p className="text-xs text-text-muted mt-1 min-h-[40px] line-clamp-3 leading-relaxed font-medium">
                        {reel.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex flex-col gap-2 mt-auto">
                      <div className="flex gap-2">
                        {reel.publicUrl ? (
                          <a
                            href={reel.publicUrl.startsWith('/') ? reel.publicUrl : (reel.publicUrl.startsWith('http') ? reel.publicUrl : `https://${reel.publicUrl}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center bg-brand-primary hover:bg-brand-primary/95 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-sm"
                          >
                            View Profile <ArrowRight size={12} />
                          </a>
                        ) : (
                          <span className="flex-1 text-center text-text-muted text-[10px] italic py-2">No profile link</span>
                        )}
                        {reel.longMovieUrl && (
                          <a
                            href={reel.longMovieUrl.startsWith('http') ? reel.longMovieUrl : `https://${reel.longMovieUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all border border-gray-200"
                          >
                            Watch Full Movie <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] text-text-muted">ID: {reel.id}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditShowreelClick(reel)}
                            className="p-1.5 text-brand-primary hover:bg-brand-surface rounded-lg transition-colors"
                            title="Edit Showreel"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteShowreel(reel.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Showreel"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderNexusHub = () => {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-3xl font-display font-bold text-brand-primary">Nexus Opportunity Hub</h3>
            <p className="text-text-muted text-sm uppercase font-bold tracking-widest">Manage high-priority industry opportunities</p>
          </div>
          <Button
            onClick={() => {
              setIsNexusFormOpen(true);
              setCurrentNexus(null);
              setNexusForm({ title: '', date: '', limit: '', tag: '', description: '' });
            }}
            className="px-8 py-3 bg-brand-primary shadow-xl shadow-brand-primary/10 flex items-center gap-2 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            Create Opportunity
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nexusLoading && !isNexusFormOpen ? (
            <div className="col-span-full py-20 text-center">
              <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Syncing Nexus Data...</p>
            </div>
          ) : nexusOpportunities.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-brand-surface rounded-[40px] border-2 border-dashed border-gray-200">
              <p className="text-text-secondary font-medium">No nexus opportunities launched yet.</p>
            </div>
          ) : (
            nexusOpportunities.map(opp => (
              <Card key={opp.id} className="p-8 bg-white border-gray-100 shadow-premium hover:shadow-premium-hover transition-premium group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-full -mr-12 -mt-12 transition-all duration-500 group-hover:bg-brand-primary/10" />

                <div className="space-y-6 relative">
                  <div className="flex justify-between items-start">
                    <Badge variant="info" className="bg-brand-primary/5 text-brand-primary border-none py-1.5 px-3 rounded-lg text-[10px] font-black tracking-widest uppercase">
                      {opp.tag}
                    </Badge>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCurrentNexus(opp);
                          setNexusForm({
                            title: opp.title,
                            date: opp.date,
                            limit: opp.limit,
                            tag: opp.tag,
                            description: opp.description
                          });
                          setIsNexusFormOpen(true);
                        }}
                        className="p-2 text-text-muted hover:text-brand-primary hover:bg-brand-surface rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteNexus(opp.id)}
                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-brand-primary leading-tight line-clamp-2">{opp.title}</h4>

                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      <div className="flex items-center gap-2"><Clock size={14} /> {opp.date}</div>
                      <div className="flex items-center gap-2"><Users size={14} /> {opp.limit}</div>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                      {opp.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  const seoTitle = activeTab === 'overview'
    ? 'Admin Dashboard'
    : activeTab === 'applications'
      ? 'Pending Approvals'
      : activeTab === 'special_requests'
        ? 'Special Requests Pipeline'
        : activeTab === 'bulk_email'
          ? 'Bulk Email Broadcast'
          : activeTab === 'showreels'
            ? 'Showreel Showcase'
            : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management`;

  const seoDescription = `AUI Admin Panel - ${seoTitle}. Control center for managing professionals, institutes, studios, and requests.`;

  const navItems = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard, badge: 0 },
    { 
      id: 'applications' as const, 
      label: 'Applications', 
      icon: FileText, 
      badge: users.filter(u => u.status === 'pending').length,
      badgeColor: 'bg-red-500'
    },
    { 
      id: 'special_requests' as const, 
      label: 'Special Requests', 
      icon: Users, 
      badge: specialRequests.filter(r => r.status === 'pending').length,
      badgeColor: 'bg-orange-500'
    },
    { id: 'professionals' as const, label: 'Professionals', icon: Briefcase, badge: 0 },
    { id: 'studios' as const, label: 'Studios', icon: Users, badge: 0 },
    { id: 'institutes' as const, label: 'Institutes', icon: GraduationCap, badge: 0 },
    { id: 'aspirants' as const, label: 'Aspirants', icon: Sparkles, badge: users.filter(u => u.role === 'aspirant').length },
    { id: 'showreels' as const, label: 'Showreels', icon: Film, badge: 0 },
    { id: 'bulk_email' as const, label: 'Bulk Email', icon: Mail, badge: 0 },
  ];

  return (
    <div className="w-full text-left">
      <SEO 
        title={seoTitle} 
        description={seoDescription} 
        keywords="admin panel, control center, aui admin, manage users, approvals" 
      />
      
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Left Side Navigation Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 lg:border-r lg:border-gray-100 pl-6 pr-6 sm:pl-12 sm:pr-12 lg:pl-16 lg:pr-8 pt-3 sm:pt-4 pb-6 lg:pb-10 lg:sticky lg:top-0 lg:h-[calc(100vh-80px)] lg:overflow-y-auto no-scrollbar">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 whitespace-nowrap select-none group w-auto lg:w-full shrink-0
                    ${isActive 
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/10' 
                      : 'bg-transparent text-text-secondary hover:bg-brand-surface hover:text-brand-primary'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-brand-primary'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ml-2 transition-all duration-200
                      ${isActive 
                        ? 'bg-white text-brand-primary shadow-sm shadow-brand-primary/5' 
                        : `${item.badgeColor || 'bg-brand-accent'} text-white`
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Side Main Content Area */}
        <div className="flex-1 min-w-0 w-full pl-6 pr-6 sm:pl-12 sm:pr-12 lg:pl-12 lg:pr-16 pt-3 sm:pt-4 pb-12">
          {
            activeTab === 'overview' ? (
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
        ) : activeTab === 'bulk_email' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            {/* Compose Email Panel */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 sm:p-8 bg-white border-gray-100 shadow-premium space-y-6">
                <div className="space-y-1 border-b border-gray-100 pb-4">
                  <h3 className="text-2xl font-display font-bold text-brand-primary">Compose Broadcast Email</h3>
                  <p className="text-text-muted text-sm uppercase font-bold tracking-widest">Send custom notifications to selective recipients</p>
                </div>

                {emailSendStatus && (
                  <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${emailSendStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                    {emailSendStatus.success ? <CheckCircle size={18} className="text-emerald-600 shrink-0" /> : <XCircle size={18} className="text-red-600 shrink-0" />}
                    <span>{emailSendStatus.message}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* From Email Selector */}
                  {emailAccounts.length > 0 && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">From Email</label>
                      <div className="relative">
                        <select
                          className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm p-3 font-semibold outline-none transition-all appearance-none pr-10 cursor-pointer"
                          value={fromEmail}
                          onChange={(e) => setFromEmail(e.target.value)}
                          disabled={isSendingEmails}
                        >
                          {emailAccounts.map((acc) => (
                            <option key={acc.email} value={acc.email}>{acc.label}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <Mail size={15} className="text-brand-primary" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Email Subject</label>
                    <input
                      type="text"
                      className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm p-3 font-semibold outline-none transition-all"
                      placeholder="e.g. Important Platform Update: New Features Available"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      disabled={isSendingEmails}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Email Message</label>
                    <textarea
                      className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm p-4 outline-none transition-all min-h-[300px] font-medium"
                      placeholder="Write your email content here. Line breaks are preserved in the final email."
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      disabled={isSendingEmails}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider">
                    Recipients Selected: <span className="text-brand-primary text-sm font-extrabold">{getFilteredBulkUsers().filter(u => selectedUserIds[u.id]).length}</span>
                  </p>
                  <Button
                    className="px-8 py-3 bg-brand-primary hover:bg-brand-primary-hover flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
                    loading={isSendingEmails}
                    onClick={handleSendBulkEmails}
                  >
                    <Send size={14} /> Send Broadcast
                  </Button>
                </div>
              </Card>
            </div>

            {/* Recipient Selection Panel */}
            <div className="space-y-6">
              <Card className="p-6 bg-white border-gray-100 shadow-premium flex flex-col h-[600px]">
                <div className="space-y-4 border-b border-gray-100 pb-4 shrink-0">
                  <h4 className="font-bold text-brand-primary text-lg">Select Recipients</h4>
                  
                  {/* Filters */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Filter by Role</label>
                      <select
                        className="w-full bg-brand-surface border border-gray-100 rounded-xl text-xs p-2.5 font-bold outline-none cursor-pointer"
                        value={bulkEmailRole}
                        onChange={(e) => {
                          setBulkEmailRole(e.target.value as any);
                          setSelectedUserIds({});
                        }}
                        disabled={isSendingEmails}
                      >
                        <option value="all">All Roles</option>
                        <option value="professional">Professionals</option>
                        <option value="studio">Studios</option>
                        <option value="institute">Institutes</option>
                      </select>
                    </div>

                    {bulkEmailRole === 'professional' && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Filter Mentorship</label>
                        <select
                          className="w-full bg-brand-surface border border-gray-100 rounded-xl text-xs p-2.5 font-bold outline-none cursor-pointer"
                          value={bulkEmailMentorFilter}
                          onChange={(e) => {
                            setBulkEmailMentorFilter(e.target.value as any);
                            setSelectedUserIds({});
                          }}
                          disabled={isSendingEmails}
                        >
                          <option value="all">All Professionals</option>
                          <option value="mentor">Mentors Only</option>
                          <option value="non_mentor">Non-Mentors Only</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Select All Toggle */}
                  <div className="flex items-center justify-between bg-brand-surface p-3 rounded-xl">
                    <span className="text-xs font-bold text-brand-primary">Select All Matching</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-brand-primary cursor-pointer"
                      checked={getFilteredBulkUsers().length > 0 && getFilteredBulkUsers().every(u => selectedUserIds[u.id])}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      disabled={isSendingEmails || getFilteredBulkUsers().length === 0}
                    />
                  </div>
                </div>

                {/* User List checklist */}
                <div className="flex-1 overflow-y-auto py-4 space-y-2 pr-1">
                  {getFilteredBulkUsers().length === 0 ? (
                    <p className="text-xs text-text-muted text-center py-8 italic">No matching users found.</p>
                  ) : (
                    getFilteredBulkUsers().map(user => {
                      const profile = getProfileData(user);
                      const name = profile ? (profile.fullName || profile.full_name || profile.instituteName || profile.studioName || user.email) : user.email;
                      const isMentor = user.professional?.isMentor || user.professional?.is_mentor;

                      return (
                        <div
                          key={user.id}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${selectedUserIds[user.id] ? 'bg-brand-surface border-brand-accent/30' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                        >
                          <div className="space-y-0.5 pr-2 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-xs font-bold text-brand-primary truncate">{name}</p>
                              {isMentor && (
                                <span className="bg-purple-100 text-purple-700 text-[8px] font-extrabold px-1 py-0.5 rounded uppercase">Mentor</span>
                              )}
                            </div>
                            <p className="text-[10px] text-text-secondary truncate">{user.email}</p>
                            <p className="text-[8px] font-bold text-brand-accent uppercase tracking-wider">{user.role}</p>
                          </div>
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-brand-primary cursor-pointer shrink-0"
                            checked={!!selectedUserIds[user.id]}
                            onChange={(e) => handleToggleUser(user.id, e.target.checked)}
                            disabled={isSendingEmails}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            </div>
          </div>
        ) : activeTab === 'special_requests' ? (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
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
                          <a href={req.institutePublicUrl?.startsWith('http') ? req.institutePublicUrl : req.institutePublicUrl?.includes('/') ? `${window.location.origin}/${req.institutePublicUrl}` : `https://${req.institutePublicUrl}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-brand-accent hover:underline flex items-center gap-1">
                            {req.institutePublicUrl || 'N/A'} <Eye size={14} />
                          </a>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{req.senderRole === 'institute' ? 'Sender Public URL' : 'Professional Portfolio'}</p>
                          <a href={req.professionalPublicUrl?.startsWith('http') ? req.professionalPublicUrl : req.professionalPublicUrl?.includes('/') ? `${window.location.origin}/${req.professionalPublicUrl}` : `https://${req.professionalPublicUrl}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
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
        ) : activeTab === 'applications' ? (
          <div className="space-y-6">
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
                              <div className="flex flex-col">
                                <p className="text-xs text-text-muted uppercase font-bold tracking-widest">{user.role} • {new Date(user.createdAt).toLocaleDateString()}</p>
                                {user.phone && (
                                  <p className="text-xs font-medium text-text-secondary mt-0.5">Mobile: {user.phone}</p>
                                )}
                                {user.talentId?.talentCode && (
                                  <p className="text-[10px] font-bold text-brand-accent uppercase tracking-wider">{user.talentId.talentCode}</p>
                                )}
                              </div>
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
              </div>
        ) : activeTab === 'showreels' ? (
          renderShowreelsTab()
        ) : activeTab === 'aspirants' ? (
          renderAspirantsView()
        ) : (
          ['professionals', 'studios', 'institutes'].includes(activeTab) && renderUserList(activeTab)
        )}
        </div>
      </div>


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
                ) : selectedUser.role === 'aspirant' ? (
                  selectedUser.aspirant ? renderAspirantDetails(selectedUser.aspirant) : (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <p className="text-text-secondary font-medium">No aspirant profile linked yet.</p>
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

      {/* Workshop Management Modal */}
      <Modal
        isOpen={isWorkshopModalOpen}
        onClose={() => {
          setIsWorkshopModalOpen(false);
          setIsWorkshopFormOpen(false);
          setCurrentWorkshop(null);
          setSelectedInstitute(null);
        }}
        title="Global Workshop & Mentorship Management"
        size="xl"
        showFooter={false}
        message={
          <div className="space-y-8 text-left py-4">
            {!isWorkshopFormOpen ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold text-brand-primary">Existing Workshops ({instituteWorkshops.length})</h4>
                  <Button onClick={() => setIsWorkshopFormOpen(true)} className="px-4 py-2 text-xs flex items-center gap-2">
                    <Plus size={14} /> Add New Workshop
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {workshopLoading ? (
                    <div className="py-10 text-center">
                      <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : instituteWorkshops.length === 0 ? (
                    <div className="py-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 space-y-4">
                      <p className="text-text-secondary">No workshops added to the platform yet.</p>
                      <Button onClick={() => setIsWorkshopFormOpen(true)} className="px-6 py-2 text-xs">
                        Create Your First Workshop
                      </Button>
                    </div>
                  ) : (
                    instituteWorkshops.map(workshop => (
                      <Card key={workshop.id} className="p-4 bg-white border-gray-100 shadow-sm flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-brand-surface rounded-lg flex items-center justify-center text-brand-purple">
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <h5 className="font-bold text-brand-primary">{workshop.title}</h5>
                            <div className="flex gap-2 items-center">
                              <Badge variant="outline" className="text-[9px] uppercase">{workshop.category}</Badge>
                              <Badge variant="info" className="text-[9px] uppercase">{workshop.modelType}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setCurrentWorkshop(workshop);
                              setWorkshopForm({
                                category: workshop.category,
                                title: workshop.title,
                                duration: workshop.duration,
                                level: workshop.level,
                                pillars: Array.isArray(workshop.pillars) ? workshop.pillars.join('\n') : '',
                                outcome: workshop.outcome,
                                rate: workshop.rate,
                                modelType: workshop.modelType
                              });
                              setIsWorkshopFormOpen(true);
                            }}
                            className="p-2 text-brand-primary hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteWorkshop(workshop.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => setIsWorkshopFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowRight size={18} className="rotate-180" />
                  </button>
                  <h4 className="text-lg font-bold text-brand-primary">{currentWorkshop ? 'Edit Workshop' : 'Add New Workshop'}</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Model Category</label>
                    <select
                      className="w-full bg-gray-50 border-gray-100 rounded-xl p-3 text-sm outline-none"
                      value={workshopForm.modelType}
                      onChange={(e) => setWorkshopForm({ ...workshopForm, modelType: e.target.value })}
                    >
                      <option value="workshops">Intense Workshops</option>
                      <option value="mentorship">Professional Mentorship</option>
                      <option value="portfolio">Portfolio Review</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Industry Category (e.g. Animation)</label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-gray-100 rounded-xl p-3 text-sm outline-none"
                      placeholder="e.g. CHARACTER ANIMATION"
                      value={workshopForm.category}
                      onChange={(e) => setWorkshopForm({ ...workshopForm, category: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Workshop Title</label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-gray-100 rounded-xl p-3 text-sm outline-none"
                      placeholder="e.g. Advanced Character Performance"
                      value={workshopForm.title}
                      onChange={(e) => setWorkshopForm({ ...workshopForm, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Duration</label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-gray-100 rounded-xl p-3 text-sm outline-none"
                      placeholder="e.g. 4-8 WEEKS"
                      value={workshopForm.duration}
                      onChange={(e) => setWorkshopForm({ ...workshopForm, duration: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Level</label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-gray-100 rounded-xl p-3 text-sm outline-none"
                      placeholder="e.g. ADVANCED LEVEL"
                      value={workshopForm.level}
                      onChange={(e) => setWorkshopForm({ ...workshopForm, level: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Program Pillars (One per line)</label>
                    <textarea
                      className="w-full bg-gray-50 border-gray-100 rounded-xl p-3 text-sm outline-none min-h-[100px]"
                      placeholder="Enter each pillar on a new line"
                      value={workshopForm.pillars}
                      onChange={(e) => setWorkshopForm({ ...workshopForm, pillars: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Learning Outcome</label>
                    <textarea
                      className="w-full bg-gray-50 border-gray-100 rounded-xl p-3 text-sm outline-none min-h-[80px]"
                      placeholder="Summary of what students will achieve"
                      value={workshopForm.outcome}
                      onChange={(e) => setWorkshopForm({ ...workshopForm, outcome: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Investment Rate</label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-gray-100 rounded-xl p-3 text-sm outline-none"
                      placeholder="e.g. $2,500 - $4,000"
                      value={workshopForm.rate}
                      onChange={(e) => setWorkshopForm({ ...workshopForm, rate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex gap-4">
                  <Button
                    variant="secondary"
                    className="flex-1 py-4 rounded-xl"
                    onClick={() => setIsWorkshopFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 py-4 rounded-xl bg-brand-primary"
                    loading={workshopLoading}
                    onClick={handleSaveWorkshop}
                  >
                    {currentWorkshop ? 'Update Workshop' : 'Create Workshop'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        }
      />

      {/* Facilitation Requests Modal */}
      <Modal
        isOpen={isFacilitationAdminModalOpen}
        onClose={() => setIsFacilitationAdminModalOpen(false)}
        title="Expert Facilitation Management"
        size="2xl"
        showFooter={false}
        message={
          <div className="space-y-8 text-left">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-xs text-text-muted uppercase font-bold tracking-widest">Review and process institute facilitation bookings</p>
              </div>
              <Button onClick={fetchFacilitationRequests} variant="ghost" className="text-xs">
                Refresh List
              </Button>
            </div>

            <div className="bg-brand-surface rounded-3xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-brand-primary/30">TYPE</th>
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-brand-primary/30">INSTITUTE</th>
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-brand-primary/30">FACILITATION GOAL</th>
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-brand-primary/30">DETAILS</th>
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-brand-primary/30">STATUS</th>
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-brand-primary/30 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {facilitationLoading ? (
                      <tr><td colSpan={5} className="py-20 text-center"><div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                    ) : facilitationRequests.length === 0 ? (
                      <tr><td colSpan={6} className="py-20 text-center text-text-muted">No facilitation requests found.</td></tr>
                    ) : facilitationRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-white/50 transition-colors">
                        <td className="px-6 py-5">
                          <span className={`text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${
                            request.requestType === 'artist' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                              : 'bg-brand-purple/5 text-brand-purple border border-brand-purple/10'
                          }`}>
                            {request.requestType || 'WORKSHOP'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-0.5">
                            <p className="font-bold text-brand-primary text-xs">{request.institute?.instituteName}</p>
                            <p className="text-[10px] text-text-muted">{request.institute?.location}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-0.5">
                            <p className="font-bold text-brand-primary text-xs">{request.workshopTitle}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] font-bold text-brand-purple bg-brand-purple/5 px-1.5 py-0.5 rounded uppercase">{request.category}</span>
                              {request.professional && (
                                <span className="text-[8px] font-bold text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded uppercase italic">Ref: {request.professional.fullName || 'Professional'}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-brand-primary"><span className="text-text-muted">Month:</span> {request.preferredMonth}</p>
                            <p className="text-[10px] text-brand-primary"><span className="text-text-muted">Students:</span> {request.studentCount}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <Badge variant={request.status === 'approved' ? 'success' : request.status === 'rejected' ? 'warning' : 'warning'}>
                            {request.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 text-right">
                          {request.status === 'pending' && (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                onClick={() => handleUpdateFacilitationStatus(request.id, 'approved')}
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-[9px] font-bold uppercase tracking-widest text-white rounded-lg shadow-lg shadow-emerald-500/10"
                              >
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleUpdateFacilitationStatus(request.id, 'rejected')}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-[9px] font-bold uppercase tracking-widest text-white rounded-lg shadow-lg shadow-red-500/10"
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      />

      {/* Nexus Hub Modal */}
      <Modal
        isOpen={isNexusHubModalOpen}
        onClose={() => setIsNexusHubModalOpen(false)}
        title="AUI Nexus Opportunity Management"
        size="xl"
        showFooter={false}
        message={renderNexusHub()}
      />

      <Modal
        isOpen={isNexusFormOpen}
        onClose={() => setIsNexusFormOpen(false)}
        title={currentNexus ? 'Update Nexus Opportunity' : 'Launch New Nexus Opportunity'}
        size="lg"
        showFooter={false}
        message={
          <div className="space-y-6 text-left py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Opportunity Title</label>
                <input
                  className="w-full bg-brand-surface border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm"
                  value={nexusForm.title}
                  onChange={(e) => setNexusForm({ ...nexusForm, title: e.target.value })}
                  placeholder="e.g. Disney Animation Lead: Direct Session"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Date / Time Window</label>
                <input
                  className="w-full bg-brand-surface border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm"
                  value={nexusForm.date}
                  onChange={(e) => setNexusForm({ ...nexusForm, date: e.target.value })}
                  placeholder="e.g. JUNE 20, 2026"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Access Limit</label>
                <input
                  className="w-full bg-brand-surface border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm"
                  value={nexusForm.limit}
                  onChange={(e) => setNexusForm({ ...nexusForm, limit: e.target.value })}
                  placeholder="e.g. 5 INSTITUTES MAX"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Badge Tag</label>
                <input
                  className="w-full bg-brand-surface border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm"
                  value={nexusForm.tag}
                  onChange={(e) => setNexusForm({ ...nexusForm, tag: e.target.value })}
                  placeholder="e.g. LIMITED ACCESS"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Description</label>
                <textarea
                  className="w-full bg-brand-surface border-none rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm"
                  value={nexusForm.description}
                  onChange={(e) => setNexusForm({ ...nexusForm, description: e.target.value })}
                  placeholder="Provide details about the opportunity..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-50">
              <Button variant="ghost" onClick={() => setIsNexusFormOpen(false)}>Cancel</Button>
              <Button loading={nexusLoading} onClick={handleSaveNexus} className="bg-brand-primary px-10">
                {currentNexus ? 'Update Opportunity' : 'Launch Opportunity'}
              </Button>
            </div>
          </div>
        }
      />

      {/* Showreel Form Modal */}
      <Modal
        isOpen={isShowreelModalOpen}
        onClose={() => {
          setIsShowreelModalOpen(false);
          setEditingShowreelId(null);
          setUserSearchQuery('');
          setShowreelForm({
            category: '',
            selectedUserId: null,
            artistName: '',
            description: '',
            publicUrl: '',
            videoType: 'link',
            videoUrl: '',
            videoFile: null,
            longMovieUrl: '',
            title: '',
            topic: '',
            thumbnailFile: null
          });
        }}
        title={editingShowreelId !== null ? "Update Showreel" : "Add New Showreel"}
        size="lg"
        showFooter={false}
        message={
          <form onSubmit={handleSaveShowreel} className="space-y-6 text-left py-2">
            {/* Category selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Category</label>
              <select
                className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm p-3 font-semibold outline-none transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                value={showreelForm.category}
                onChange={(e) => {
                  const newCategory = e.target.value as any;
                  setShowreelForm(prev => ({
                    ...prev,
                    category: newCategory,
                    selectedUserId: null,
                    artistName: '',
                    publicUrl: ''
                  }));
                }}
                disabled={showreelForm.selectedUserId !== null}
                required
              >
                <option value="">-- Select Category --</option>
                <option value="professional">Professional</option>
                <option value="studio">Studio</option>
                <option value="institute">Institute</option>
              </select>
            </div>

            {/* Search & Select User */}
            {showreelForm.category && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">User Association</label>
                
                {showreelForm.selectedUserId ? (
                  <div className="flex items-center justify-between p-3.5 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {showreelForm.artistName ? showreelForm.artistName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-brand-primary">{showreelForm.artistName}</span>
                        <span className="block text-[10px] text-text-muted font-medium">Selected User</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowreelForm(prev => ({
                          ...prev,
                          selectedUserId: null,
                          artistName: '',
                          publicUrl: ''
                        }));
                        setUserSearchQuery('');
                      }}
                      className="text-xs bg-white hover:bg-gray-50 border border-gray-200 text-brand-primary px-3 py-1.5 rounded-xl font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Change User
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                        <Users size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder={`Search by name, email or ID...`}
                        className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm pl-10 pr-3 py-3 font-semibold outline-none transition-all"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-2xl bg-brand-surface p-1.5 space-y-1.5 shadow-inner">
                      {(() => {
                        const filtered = allUsers.filter(u => {
                          if (u.role !== showreelForm.category) return false;
                          const name = getUserName(u).toLowerCase();
                          const email = (u.email || '').toLowerCase();
                          const code = (u.talentId?.talentCode || '').toLowerCase();
                          const query = userSearchQuery.toLowerCase();
                          return name.includes(query) || email.includes(query) || code.includes(query);
                        });

                        if (filtered.length === 0) {
                          return <div className="text-xs text-text-muted p-4 text-center">No matching {showreelForm.category}s found</div>;
                        }

                        return filtered.map(u => {
                          const name = getUserName(u);
                          const isSelected = showreelForm.selectedUserId === u.id;
                          const initials = name ? name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : '?';
                          
                          return (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => {
                                setShowreelForm(prev => ({
                                  ...prev,
                                  selectedUserId: u.id,
                                  artistName: name,
                                  publicUrl: u.talentId?.talentCode ? `/talent/${u.talentId.talentCode}` : ''
                                }));
                              }}
                              className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all duration-200 border ${
                                isSelected 
                                  ? 'bg-brand-primary text-white border-brand-primary shadow-md' 
                                  : 'hover:bg-brand-surface hover:border-gray-300 text-brand-primary border-transparent'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-brand-surface text-brand-primary border border-brand-primary/10'
                              }`}>
                                {initials}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <span className="block truncate text-sm font-bold">{name}</span>
                                <span className={`block truncate text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-text-muted font-medium'}`}>
                                  {u.email} {u.talentId?.talentCode ? ` • ID: ${u.talentId.talentCode}` : ''}
                                </span>
                              </div>

                              {isSelected && (
                                <span className="bg-white/20 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider shrink-0 text-white">
                                  Selected
                                </span>
                              )}
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Video Title & Topic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Video Title</label>
                <input
                  type="text"
                  placeholder="e.g. Showreel 2026, Action Reel"
                  className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm p-3 font-semibold outline-none transition-all"
                  value={showreelForm.title}
                  onChange={(e) => setShowreelForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Topic / Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. Acting, Cinematography, VFX"
                  className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm p-3 font-semibold outline-none transition-all"
                  value={showreelForm.topic}
                  onChange={(e) => setShowreelForm(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>
            </div>

            {/* Artist Details (Auto-filled on Select, remains editable) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Artist / Studio / Professional Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe, AUI Studios"
                  className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm p-3 font-semibold outline-none transition-all"
                  value={showreelForm.artistName}
                  onChange={(e) => setShowreelForm(prev => ({ ...prev, artistName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Public URL (Portfolio or Profile Link)</label>
                <input
                  type="text"
                  placeholder="e.g. /talent/AUI-PRO-12345"
                  className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm p-3 font-semibold outline-none transition-all"
                  value={showreelForm.publicUrl}
                  onChange={(e) => setShowreelForm(prev => ({ ...prev, publicUrl: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Description</label>
              <textarea
                placeholder="Write a short description about this showreel..."
                rows={3}
                className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm p-3 font-semibold outline-none transition-all resize-none"
                value={showreelForm.description}
                onChange={(e) => setShowreelForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Video Source</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-brand-primary">
                  <input
                    type="radio"
                    name="videoType"
                    checked={showreelForm.videoType === 'link'}
                    onChange={() => setShowreelForm(prev => ({ ...prev, videoType: 'link' }))}
                  />
                  Video Link (YouTube, Vimeo, etc.)
                </label>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-brand-primary">
                  <input
                    type="radio"
                    name="videoType"
                    checked={showreelForm.videoType === 'file'}
                    onChange={() => setShowreelForm(prev => ({ ...prev, videoType: 'file' }))}
                  />
                  File Upload (MP4, MOV, etc.)
                </label>
              </div>
            </div>

            {showreelForm.videoType === 'link' ? (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Video Link URL</label>
                <input
                  type="text"
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm p-3 font-semibold outline-none transition-all"
                  value={showreelForm.videoUrl}
                  onChange={(e) => setShowreelForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                  required={showreelForm.videoType === 'link'}
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">
                  {editingShowreelId !== null ? "Upload Video File (leave blank to keep current)" : "Upload Video File"}
                </label>
                <input
                  type="file"
                  accept="video/*"
                  className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm p-3 font-semibold outline-none transition-all cursor-pointer"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setShowreelForm(prev => ({ ...prev, videoFile: files[0] }));
                    }
                  }}
                  required={showreelForm.videoType === 'file' && editingShowreelId === null}
                />
              </div>
            )}

            {/* Thumbnail Image upload */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">
                {editingShowreelId !== null ? "Custom Thumbnail Image (Optional, leave blank to keep current)" : "Custom Thumbnail Image (Optional)"}
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm p-3 font-semibold outline-none transition-all cursor-pointer"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setShowreelForm(prev => ({ ...prev, thumbnailFile: files[0] }));
                  }
                }}
              />
            </div>

            {/* Long Movie / External Platform Link */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Long Movie / External Video Link (Optional)</label>
              <input
                type="text"
                placeholder="e.g. https://www.netflix.com/title/..."
                className="w-full bg-brand-surface border border-gray-200 focus:border-brand-accent rounded-xl text-sm p-3 font-semibold outline-none transition-all"
                value={showreelForm.longMovieUrl}
                onChange={(e) => setShowreelForm(prev => ({ ...prev, longMovieUrl: e.target.value }))}
              />
              <span className="text-[10px] text-text-muted block mt-0.5">Link to the full movie or project on other platforms (Netflix, Prime Video, YouTube, etc.)</span>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Button
                variant="ghost"
                type="button"
                className="px-4 py-2 text-xs"
                onClick={() => {
                  setIsShowreelModalOpen(false);
                  setEditingShowreelId(null);
                  setUserSearchQuery('');
                  setShowreelForm({
                    category: '',
                    selectedUserId: null,
                    artistName: '',
                    description: '',
                    publicUrl: '',
                    videoType: 'link',
                    videoUrl: '',
                    videoFile: null,
                    longMovieUrl: '',
                    title: '',
                    topic: '',
                    thumbnailFile: null
                  });
                }}
                disabled={isShowreelFormSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-5 py-2 text-xs bg-brand-primary text-white"
                loading={isShowreelFormSubmitting}
              >
                {editingShowreelId !== null ? "Update Showreel" : "Save Showreel"}
              </Button>
            </div>
          </form>
        }
      />

      {/* Share Aspirants List Modal */}
      <Modal
        isOpen={isShareAspirantsModalOpen}
        onClose={() => setIsShareAspirantsModalOpen(false)}
        title="Share Aspirants List with Institutes"
        size="lg"
        showFooter={false}
        message={
          <div className="space-y-6 text-left py-2">
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            Select registered institutes on AUI platform that should have access to view and download the Aspirant list in their dashboard.
          </p>

          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search institutes by name, location, email..."
              value={shareAspirantsSearch}
              onChange={(e) => setShareAspirantsSearch(e.target.value)}
              className="w-full bg-brand-surface/50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-brand-primary outline-none focus:bg-white focus:border-brand-accent transition-premium"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {users
              .filter((u) => u.role === 'institute')
              .filter((u) => {
                const p = getProfileData(u) || {};
                const name = (p.instituteName || u.email || '').toLowerCase();
                const loc = (p.location || '').toLowerCase();
                const q = shareAspirantsSearch.toLowerCase();
                return name.includes(q) || loc.includes(q);
              })
              .map((inst) => {
                const p = getProfileData(inst) || {};
                const instId = p.id || inst.id;
                const isChecked = selectedShareInstituteIds.includes(instId);

                return (
                  <label
                    key={inst.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-200 shadow-sm'
                        : 'bg-brand-surface/30 border-gray-100 hover:bg-brand-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedShareInstituteIds(selectedShareInstituteIds.filter((id) => id !== instId));
                          } else {
                            setSelectedShareInstituteIds([...selectedShareInstituteIds, instId]);
                          }
                        }}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-sm text-brand-primary block">
                          {p.instituteName || inst.email}
                        </span>
                        <span className="text-xs text-text-muted">
                          {p.location ? `📍 ${p.location}` : inst.email}
                        </span>
                      </div>
                    </div>

                    {isChecked && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                        Access Granted ✓
                      </span>
                    )}
                  </label>
                );
              })}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={() => setIsShareAspirantsModalOpen(false)}
              className="text-xs font-bold text-text-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveShareAspirants}
              loading={isSharingAspirants}
              className="bg-brand-primary hover:bg-brand-accent text-white font-bold text-xs px-6 py-3 rounded-xl shadow-premium"
            >
              Save Sharing Preferences
            </Button>
          </div>
        </div>
        }
      />
    </div>
  );

};

// --- Showreel Video Helpers ---

const isDirectVideoUrl = (url: string): boolean => {
  return /\.(mp4|webm|ogg|mov|avi|mkv|m4v|flv|3gp)(\?.*)?$/i.test(url);
};

const getYouTubeId = (url: string): string => {
  if (!url) return '';
  const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]{11}).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : '';
};

const getVimeoId = (url: string): string => {
  if (!url) return '';
  const standardMatch = url.match(
    /(?:www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|ondemand\/[^/]+\/|showcase\/\d+\/video\/)(\d+)(?:$|\/|\?)/
  );
  if (standardMatch) return standardMatch[1];
  const simpleMatch = url.match(/vimeo\.com\/(\d+)(?:$|\/|\?)/);
  if (simpleMatch) return simpleMatch[1];
  return '';
};

const getGoogleDriveId = (url: string): string => {
  if (!url) return '';
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : '';
};

const getDailymotionId = (url: string): string => {
  if (!url) return '';
  const match = url.match(/dailymotion\.com\/(?:video|embed\/video)\/([a-zA-Z0-9]+)/);
  return match ? match[1] : '';
};

const getStreamableCode = (url: string): string => {
  if (!url) return '';
  const match = url.match(/streamable\.com\/([a-zA-Z0-9]+)/);
  return match ? match[1] : '';
};

const detectVideoUrl = (url: string): any => {
  if (!url) return { type: 'external', embedUrl: null, originalUrl: url, platformLabel: 'Video', canEmbed: false };

  // YouTube
  const ytId = getYouTubeId(url);
  if (ytId) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
      originalUrl: url,
      platformLabel: 'YouTube',
      canEmbed: true,
    };
  }

  // Vimeo
  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`,
      originalUrl: url,
      platformLabel: 'Vimeo',
      canEmbed: true,
    };
  }

  // Google Drive
  const driveId = getGoogleDriveId(url);
  if (url.includes('drive.google.com') && driveId) {
    return {
      type: 'googledrive',
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      originalUrl: url,
      platformLabel: 'Google Drive',
      canEmbed: true,
    };
  }

  // Dailymotion
  const dmId = getDailymotionId(url);
  if (dmId) {
    return {
      type: 'dailymotion',
      embedUrl: `https://www.dailymotion.com/embed/video/${dmId}?autoplay=1`,
      originalUrl: url,
      platformLabel: 'Dailymotion',
      canEmbed: true,
    };
  }

  // Streamable
  const streamableCode = getStreamableCode(url);
  if (streamableCode) {
    return {
      type: 'streamable',
      embedUrl: `https://streamable.com/e/${streamableCode}?autoplay=1`,
      originalUrl: url,
      platformLabel: 'Streamable',
      canEmbed: true,
    };
  }

  // Direct video
  if (isDirectVideoUrl(url)) {
    return {
      type: 'direct',
      embedUrl: null,
      originalUrl: url,
      platformLabel: 'Direct Video',
      canEmbed: false,
    };
  }

  // External / invalid
  return {
    type: 'external',
    embedUrl: null,
    originalUrl: url,
    platformLabel: 'External Website',
    canEmbed: false,
  };
};

const getFileUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
};

export default AdminPanel;
