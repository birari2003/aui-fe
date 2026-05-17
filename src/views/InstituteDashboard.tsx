import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, ChevronDown, X, User, MapPin, ArrowRight, BookOpen, MessageSquare, Zap, Search, CheckCircle2, Globe, Shield, Clock, ExternalLink, Users, XCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Select from '../components/Select';
import Input from '../components/Input';
import Badge from '../components/Badge';
import { searchProfessionals } from '../services/searchServices';
import { fetchNexusOpportunities } from '../services/nexusServices';
import { getMyCollaborationRequests, respondToCollaborationRequest, sendCollaborationRequest } from '../services/collaborationServices';
import { createInstituteSpecialRequest, getMySpecialRequests } from '../services/specialRequestServices';
import { getMyInstituteProfile } from '../services/instituteServices';
import * as workshopServices from '../services/instituteWorkshopServices';
import * as workshopRequestServices from '../services/workshopRequestServices';
import Modal from '../components/Modal';
import { View } from '../types';

const InstituteDashboard = ({ setView }: { setView: (v: View) => void }) => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = React.useState<any[]>([]);
  const [requests, setRequests] = React.useState<any[]>([]);
  const [dynamicNexus, setDynamicNexus] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [intent, setIntent] = React.useState('');
  const [date, setDate] = React.useState('');
  const [type, setType] = React.useState('');
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [bookingExpert, setBookingExpert] = React.useState<any | null>(null);
  const [bookingMessage, setBookingMessage] = React.useState('');
  const [publicUrl, setPublicUrl] = React.useState('');
  const [mySpecialRequests, setMySpecialRequests] = React.useState<any[]>([]);
  const [isSpecialModalOpen, setIsSpecialModalOpen] = React.useState(false);
  const [isSubmittingSpecial, setIsSubmittingSpecial] = React.useState(false);
  const [specialRequestForm, setSpecialRequestForm] = React.useState({
    name: '',
    publicUrl: '',
    mentorshipTime: '',
    message: ''
  });
  const [profile, setProfile] = React.useState<any>(null);
  const [activeSubTab, setActiveSubTab] = React.useState<'book' | 'ledger' | 'nexus'>('book');
  const [bookMode, setBookMode] = React.useState<'classes' | 'search'>('classes');
  const [selectedModel, setSelectedModel] = React.useState('workshops');
  const [dynamicWorkshops, setDynamicWorkshops] = React.useState<any[]>([]);
  const [facilitationRequests, setFacilitationRequests] = React.useState<any[]>([]);
  const [isFacilitationModalOpen, setIsFacilitationModalOpen] = React.useState(false);
  const [selectedWorkshopForFacilitation, setSelectedWorkshopForFacilitation] = React.useState<any | null>(null);
  const [facilitationForm, setFacilitationForm] = React.useState({
    studentCount: '10-20',
    preferredMonth: 'June 2026',
    contactPerson: '',
    email: '',
    specialRequirements: ''
  });
  const [isSubmittingFacilitation, setIsSubmittingFacilitation] = React.useState(false);
  const [bookingForm, setBookingForm] = React.useState({
    studentCount: '10-20',
    preferredMonth: 'June 2026',
    contactPerson: '',
    email: '',
    specialRequirements: ''
  });

  const ledgerEntries = [
    { title: 'Pixar Lighting Masterclass', expert: 'Sarah Jenkins', type: 'WORKSHOP', date: 'March 15, 2026', impact: '45 Students', status: 'COMPLETED' },
    { title: 'Character Design Pipeline', expert: 'Michael Chen', type: 'WORKSHOP', date: 'Feb 10, 2026', impact: '30 Students', status: 'COMPLETED' },
    { title: 'Senior Portfolio Review', expert: 'David Miller', type: 'PORTFOLIO REVIEW', date: 'Jan 22, 2026', impact: '12 Students', status: 'COMPLETED' }
  ];

  const nexusOpportunities = [
    {
      title: 'Disney Animation Lead: Direct Session',
      date: 'JUNE 20, 2026',
      limit: '5 INSTITUTES MAX',
      tag: 'LIMITED ACCESS',
      desc: 'Exclusive access to the upcoming Moana 2 pipeline secrets. AUI is pushing this strictly to premium partners.'
    },
    {
      title: 'Sony Pictures VFX: Spider-Verse Style Prep',
      date: 'JULY 05, 2026',
      limit: 'OPEN FOR BOOKING',
      tag: 'NEW FORMAT',
      desc: 'Masterclass on stylized NPR rendering. Our team will handle the full tech-sync for your lab.'
    }
  ];

  const nexusVeterans = [
    { name: 'Alex Rivera', role: 'Lead Character Designer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
    { name: 'Sarah Chen', role: 'VFX Supervisor', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
    { name: 'Marcus Thorne', role: 'Senior Animator', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
    { name: 'James Wilson', role: 'Lighting Artist', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' }
  ];

  const integrationModels = [
    {
      id: 'workshops',
      title: 'Intense Workshops',
      tag: 'TECHNICAL',
      icon: Zap,
      description: 'Intensive immersion into high-end production workflows. Best for bridging technical gaps in a short window.',
      list: ['4-8 Hour Session', 'Live Demo + Q&A', 'Pipeline Breakdown', 'Industry Best Practices'],
      rate: '$1,500 - $3,000 per session',
      color: 'brand-purple'
    },
    {
      id: 'mentorship',
      title: 'Direct Mentorship',
      tag: 'ARTISTIC',
      icon: User,
      description: 'Personalized career and artistic guidance for your top-tier students. Weekly Industry accountability.',
      list: ['Weekly 1-on-1 calls', 'Career coaching', 'Production roadmap', 'Private Discord access'],
      rate: '$4,000 - $6,000 per semester',
      color: 'gray'
    },
    {
      id: 'portfolio',
      title: 'Portfolio Review',
      tag: 'CRITICAL',
      icon: Search,
      description: 'Candid, professional assessment of student reels. Learn exactly what Pixar or Sony looks for in a hire.',
      list: ['Frame-by-frame critique', 'Industry hire potential', 'Resume & Reel polish', 'Mock Interviews'],
      rate: '$800 - $1,500 per group',
      color: 'gray'
    }
  ];

  const staticWorkshops = [
    {
      category: 'CHARACTER ANIMATION',
      duration: '4-8 WEEKS (FLEXIBLE)',
      title: 'Advanced Character Performance',
      level: 'ADVANCED LEVEL',
      pillars: ['Mastering micro-expressions and eye darts', 'Prop manipulation and weight distribution', 'Advanced dialogue lip-sync in feature pipelines', 'Creature locomotion and multi-legged walks'],
      outcome: 'Ready for Disney/Pixar level acting challenges',
      rate: '$2,500 - $4,000 (Based on Expert)'
    },
    {
      category: 'MODELING',
      duration: '3-5 WEEKS',
      title: 'Production Modeling & Retopology',
      level: 'INTERMEDIATE LEVEL',
      pillars: ['Sub-D modeling for cinematic characters', 'Hard surface production techniques', 'UDIM workflow and UV efficiency', 'Retopology for deformation and rigging'],
      outcome: 'Production-ready assets for VFX pipelines',
      rate: '$2,000 - $3,500'
    },
    {
      category: 'FX',
      duration: '6 WEEKS',
      title: 'Houdini Fluid & Chaos Systems',
      level: 'ADVANCED LEVEL',
      pillars: ['FLIP simulation and whitewater', 'Pyro solvers for large-scale explosions', 'RBD destruction and grain solvers', 'Custom VEX for art-directable FX'],
      outcome: 'High-end fluid and destruction systems in Houdini',
      rate: '$4,500 - $7,000'
    }
  ];

  const staticExperts = [
    { id: '1', name: 'Alex Rivera', role: 'Lead Character Designer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { id: '2', name: 'Sarah Chen', role: 'VFX Supervisor', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    { id: '3', name: 'Marcus Thorne', role: 'Senior Animator', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
    { id: '4', name: 'James Wilson', role: 'Lighting Lead', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
    { id: '5', name: 'Elena Rossi', role: 'Art Director', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' },
    { id: '6', name: 'David Wu', role: 'Pipeline Engineer', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' }
  ];

  const fetchDashboardData = async (query: any = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        const [profRes, reqRes, nexusRes] = await Promise.all([
          searchProfessionals(token, query),
          getMyCollaborationRequests(token),
          fetchNexusOpportunities()
        ]);

        if (profRes.ok) {
          const profData = await profRes.json();
          setProfessionals(profData.data);
        }
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setRequests(reqData.data);
        }
        if (nexusRes && nexusRes.ok) {
          const nexusData = await nexusRes.json();
          setDynamicNexus(nexusData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialRequests = React.useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await getMySpecialRequests(token);
      if (res.ok) {
        const data = await res.json();
        setMySpecialRequests(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch special requests:', err);
    }
  }, []);

  const fetchProfile = React.useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await getMyInstituteProfile(token);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.data);
        setSpecialRequestForm(prev => ({
          ...prev,
          name: data.data.instituteName || '',
          publicUrl: data.data.websiteUrl || ''
        }));
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }, []);

  const fetchWorkshops = React.useCallback(async () => {
    try {
      const [workshopRes, requestRes] = await Promise.all([
        workshopServices.fetchAllWorkshops(),
        workshopRequestServices.getMyWorkshopRequests()
      ]);

      if (workshopRes.ok) {
        const data = await workshopRes.json();
        setDynamicWorkshops(data.data);
      }
      if (requestRes.ok) {
        const data = await requestRes.json();
        setFacilitationRequests(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch workshops or requests:', err);
    }
  }, []);

  React.useEffect(() => {
    fetchDashboardData();
    fetchSpecialRequests();
    fetchProfile();
  }, [fetchSpecialRequests, fetchProfile]);

  React.useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  const handleRespond = async (id: number, status: 'accepted' | 'rejected') => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await respondToCollaborationRequest(token, id, { status });
        if (res.ok) fetchDashboardData();
      }
    } catch (error) {
      console.error('Error responding to request:', error);
    }
  };

  const handleBookRequest = async () => {
    if (!bookingExpert) return;
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await workshopRequestServices.createWorkshopRequest({
          ...bookingForm,
          requestType: 'artist',
          professionalId: bookingExpert.id,
          workshopTitle: `Facilitation: ${bookingExpert.name}`,
          category: bookingExpert.role || 'Industry Expert'
        });

        if (res.ok) {
          setBookingExpert(null);
          setBookingForm({
            studentCount: '10-20',
            preferredMonth: 'June 2026',
            contactPerson: '',
            email: '',
            specialRequirements: ''
          });
          fetchWorkshops(); // Refresh to see the new request in ledger if needed
          alert('Facilitation request submitted to Admin successfully!');
        }
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const handleSearch = () => {
    if (intent || date || type) {
      setShowResults(true);
      fetchDashboardData({ skill: intent, availability: date });
    }
  };

  const handleSpecialRequestSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsSubmittingSpecial(true);
    try {
      const res = await createInstituteSpecialRequest(token, {
        professionalName: specialRequestForm.name,
        professionalPublicUrl: specialRequestForm.publicUrl,
        mentorshipTime: specialRequestForm.mentorshipTime,
        message: specialRequestForm.message,
      });
      if (res.ok) {
        setIsSpecialModalOpen(false);
        setSpecialRequestForm({
          name: profile?.instituteName || '',
          publicUrl: profile?.websiteUrl || '',
          mentorshipTime: '',
          message: ''
        });
        fetchSpecialRequests();
        alert('Special request submitted to Admin successfully!');
      }
    } catch (err) {
      console.error('Failed to submit special request:', err);
    } finally {
      setIsSubmittingSpecial(false);
    }
  };

  const handleFacilitationSubmit = async () => {
    if (!selectedWorkshopForFacilitation) return;
    setIsSubmittingFacilitation(true);
    try {
      const res = await workshopRequestServices.createWorkshopRequest({
        ...facilitationForm,
        workshopId: selectedWorkshopForFacilitation.id,
        workshopTitle: selectedWorkshopForFacilitation.title,
        category: selectedWorkshopForFacilitation.category
      });
      if (res.ok) {
        setIsFacilitationModalOpen(false);
        fetchWorkshops(); // Refresh list
        alert('Facilitation request submitted successfully!');
      }
    } catch (err) {
      console.error('Failed to submit facilitation request:', err);
    } finally {
      setIsSubmittingFacilitation(false);
    }
  };

  return (
    <div className="bg-white text-left">
      {/* Sub Header Section */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tighter text-brand-primary leading-none">INHUB</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-purple mt-1">CONNECT WITH INDUSTRY</span>
            </div>

            <div className="w-[1px] h-8 bg-gray-100 mx-4" />

            <nav className="flex items-center gap-8">
              {[
                { id: 'book', label: 'BOOK INDUSTRY EXPERT' },
                { id: 'ledger', label: 'ACADEMIC LEDGER' },
                { id: 'nexus', label: 'AUI NEXUS' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`relative py-5 text-[11px] font-bold uppercase tracking-widest transition-colors ${activeSubTab === tab.id ? 'text-brand-purple' : 'text-brand-primary/30 hover:text-brand-primary'
                    }`}
                >
                  {tab.label}
                  {activeSubTab === tab.id && (
                    <motion.div
                      layoutId="sub-nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full"
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <button
            onClick={() => {
              const talentCode = profile?.user?.talentId?.talentCode;
              if (talentCode) {
                navigate(`/talent/${talentCode}`);
              }
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 transition-all border border-gray-100"
          >
            <ExternalLink size={14} className="text-brand-purple" />
            PUBLIC PROFILE
          </button>
        </div>
      </div>

      <main className="no-scrollbar">
        {activeSubTab === 'book' ? (
          <>
            {/* Hero & Branding Section */}
            <section className="bg-white pt-20 pb-24 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-purple/5 border border-brand-purple/10 rounded-full"
                  >
                    <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-purple">INHUB</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
                    <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-brand-primary/40">
                      {profile?.instituteName || 'FRAMEBOX INSTITUTE OF ANIMATION'}
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/20">
                      CONNECT WITH INDUSTRY
                    </p>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-7xl font-display font-bold tracking-tight text-brand-primary max-w-4xl leading-[1.1]"
                  >
                    Architecting the <span className="text-brand-purple">Future of Learning</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-text-secondary max-w-2xl leading-relaxed"
                  >
                    Your bridge to the world's most elite creative legends. Synchronize your curriculum with the cutting edge of industry production.
                  </motion.p>
                </div>
              </div>
            </section>

            {/* Integration Models Section */}
            <section className="bg-white pb-32">
              <div className="max-w-7xl mx-auto px-6 space-y-16">
                <div className="text-center space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary/30 py-2 px-6 border border-gray-100 rounded-lg inline-block">
                    STEP 01: SELECT YOUR INTEGRATION MODEL
                  </p>
                  <h2 className="text-4xl font-display font-bold text-brand-primary">How do you want to engage?</h2>
                  <p className="text-text-secondary max-w-2xl mx-auto">
                    Our elite faculty is available for three primary service tiers, each designed for high-impact learning.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {integrationModels.map((model, i) => (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedModel(model.id)}
                      className={`group relative p-10 rounded-[40px] border-2 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2 ${selectedModel === model.id
                          ? 'border-brand-purple bg-white ring-8 ring-brand-purple/5'
                          : 'border-gray-100 bg-white hover:border-brand-purple/30'
                        }`}
                    >
                      {selectedModel === model.id && (
                        <div className="absolute top-6 right-6 w-6 h-6 bg-brand-purple rounded-full flex items-center justify-center text-white">
                          <CheckCircle2 size={14} />
                        </div>
                      )}

                      <div className="space-y-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${selectedModel === model.id ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' : 'bg-gray-50 text-brand-primary/40 group-hover:bg-brand-purple/10 group-hover:text-brand-purple'
                          }`}>
                          <model.icon size={28} />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-brand-primary">{model.title}</h3>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/30 px-2 py-1 border border-gray-100 rounded-md">
                              {model.tag}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {model.description}
                          </p>
                        </div>

                        <ul className="space-y-4">
                          {model.list.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm text-text-secondary">
                              <div className={`w-1.5 h-1.5 rounded-full ${selectedModel === model.id ? 'bg-brand-purple' : 'bg-brand-primary/20'}`} />
                              {item}
                            </li>
                          ))}
                        </ul>

                        <div className="pt-8 border-t border-gray-50">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/30 mb-1">BASELINE RATE</p>
                          <p className={`text-xl font-bold ${selectedModel === model.id ? 'text-brand-purple' : 'text-brand-primary'}`}>
                            {model.rate}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Search & Tabs Section */}
            <section className="bg-brand-surface/30 border-y border-gray-100 py-24 scroll-mt-20" id="explore">
              <div className="max-w-7xl mx-auto px-6 space-y-20">
                {/* Main Tabs */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-4 rounded-[32px] shadow-premium border border-gray-100">
                  <div className="flex p-2 bg-gray-50 rounded-2xl w-full md:w-auto">
                    <button
                      onClick={() => setBookMode('classes')}
                      className={`flex-1 md:flex-none px-12 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${bookMode === 'classes' ? 'bg-brand-primary text-white shadow-xl' : 'text-brand-primary/40 hover:text-brand-primary'
                        }`}
                    >
                      Industry Expert Classes
                    </button>
                    <button
                      onClick={() => setBookMode('search')}
                      className={`flex-1 md:flex-none px-12 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${bookMode === 'search' ? 'bg-brand-primary text-white shadow-xl' : 'text-brand-primary/40 hover:text-brand-primary'
                        }`}
                    >
                      Direct Expert Search
                    </button>
                  </div>

                  {bookMode === 'classes' && (
                    <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                      <div className="text-right hidden lg:block">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/30">STEP 02: CHOOSE DEPARTMENT</p>
                      </div>
                      <div className="relative w-full md:w-64">
                        <select className="w-full appearance-none bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-brand-primary focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all outline-none">
                          <option>All</option>
                          <option>Character Animation</option>
                          <option>Modeling</option>
                          <option>Rigging</option>
                          <option>Lighting</option>
                          <option>FX</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-primary/30 pointer-events-none" size={16} />
                      </div>
                    </div>
                  )}
                </div>

                {/* ... existing content views ... */}
                <div className="space-y-16">
                  {bookMode === 'classes' ? (
                    <div className="space-y-12">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <h3 className="text-3xl font-display font-bold text-brand-primary">Available Workshops</h3>
                          <span className="px-3 py-1 bg-brand-purple/10 text-brand-purple text-[10px] font-bold rounded-md uppercase tracking-wider">ALL</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/20">Step 03: Confirm Details & Book</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(dynamicWorkshops.length > 0
                          ? dynamicWorkshops.filter(w => w.modelType === selectedModel)
                          : staticWorkshops
                        ).map((workshop, i) => (
                          <motion.div
                            key={workshop.id || workshop.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 space-y-8 flex flex-col"
                          >
                            <div className="space-y-6 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-brand-purple uppercase tracking-[0.15em]">{workshop.category}</span>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest">
                                  <Clock size={12} /> {workshop.duration}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="text-2xl font-bold text-brand-primary leading-tight">{workshop.title}</h4>
                                <span className="inline-block text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">
                                  {workshop.level}
                                </span>
                              </div>

                              <div className="space-y-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/20">PROGRAM PILLARS</p>
                                <ul className="space-y-3">
                                  {(Array.isArray(workshop.pillars) ? workshop.pillars : []).map((pillar: string, idx: number) => (
                                    <li key={idx} className="text-xs text-text-secondary flex items-start gap-2 leading-relaxed text-left">
                                      <div className="w-1 h-1 rounded-full bg-brand-purple mt-1.5 flex-shrink-0" />
                                      {pillar}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="p-4 bg-emerald-50 rounded-2xl space-y-2 text-left">
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-600/60">LEARNING OUTCOMES</p>
                                <p className="text-xs font-bold text-emerald-700 leading-relaxed">{workshop.outcome}</p>
                              </div>
                            </div>

                            <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                              <div className="space-y-1 text-left">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-brand-primary/30">INVESTMENT RATE</p>
                                <p className="text-lg font-bold text-brand-primary">{workshop.rate}</p>
                              </div>
                              {facilitationRequests.find(r => r.workshopId === workshop.id) ? (
                                <div className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest border ${facilitationRequests.find(r => r.workshopId === workshop.id).status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    facilitationRequests.find(r => r.workshopId === workshop.id).status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                      'bg-amber-50 text-amber-600 border-amber-100'
                                  }`}>
                                  {facilitationRequests.find(r => r.workshopId === workshop.id).status === 'approved' ? <CheckCircle2 size={12} /> :
                                    facilitationRequests.find(r => r.workshopId === workshop.id).status === 'rejected' ? <XCircle size={12} /> : <Clock size={12} />}
                                  {facilitationRequests.find(r => r.workshopId === workshop.id).status}
                                </div>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setSelectedWorkshopForFacilitation(workshop);
                                    setIsFacilitationModalOpen(true);
                                  }}
                                  className="rounded-xl px-6 py-4 text-[10px] uppercase font-bold tracking-widest bg-brand-primary hover:bg-brand-purple shadow-lg shadow-brand-primary/10"
                                >
                                  Book Facilitation
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-12">
                      {/* New Filter Bar for Search */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[40px] p-10 shadow-premium border border-gray-100 max-w-5xl mx-auto"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/30 ml-2">Choose Department</label>
                            <select className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-brand-primary focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none">
                              <option>All</option>
                              <option>Character Animation</option>
                              <option>Modeling</option>
                              <option>Rigging</option>
                              <option>Lighting</option>
                              <option>FX</option>
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/30 ml-2">DATE</label>
                            <div className="relative">
                              <input type="text" placeholder="Select Date" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-brand-primary placeholder:text-brand-primary/20 outline-none" />
                              <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-primary/30" size={16} />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/30 ml-2">SERVICE FORMAT</label>
                            <select className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-brand-primary focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none">
                              <option>Select Type</option>
                              <option>Intense Workshop</option>
                              <option>Direct Mentorship</option>
                              <option>Portfolio Review</option>
                            </select>
                          </div>
                          <Button className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-purple text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/10 transition-all duration-300">
                            REQUEST FACILITATORS
                          </Button>
                        </div>
                        <div className="mt-8 text-center">
                          <p className="text-xs text-brand-primary/40 font-medium">
                            Cannot find what you need? <button onClick={() => setIsSpecialModalOpen(true)} className="text-brand-purple font-bold hover:underline">Special Request to Admin</button>
                          </p>
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                        {professionals.length > 0 ? (
                          professionals.map((prof, i) => {
                            const expert = {
                              id: prof.id,
                              name: prof.fullName || prof.user?.email?.split('@')[0] || 'Expert',
                              role: prof.headline || prof.position || 'Industry Expert',
                              verified: prof.verificationStatus ? '100%' : '95%',
                              image: prof.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(prof.fullName || 'Expert')}&background=random`
                            };
                            return (
                              <motion.div
                                key={expert.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
                              >
                                <div className="flex items-center gap-6 mb-8">
                                  <div className="relative">
                                    <img src={expert.image} className="w-20 h-20 rounded-[24px] object-cover shadow-lg group-hover:scale-105 transition-transform duration-500" alt="" />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white">
                                      <CheckCircle2 size={12} />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-lg font-bold text-brand-primary">{expert.name}</h4>
                                      <CheckCircle2 size={14} className="text-emerald-500" />
                                    </div>
                                    <p className="text-sm font-medium text-brand-purple">{expert.role}</p>
                                    <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-widest">{expert.verified} VERIFIED</p>
                                  </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                  <Link
                                    to={`/talent/${prof.user?.talentId?.talentCode || prof.talentId?.talentCode || 'AUI-PRO-001'}`}
                                    className="flex-1 py-4 px-6 bg-gray-50 hover:bg-gray-100 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all text-center no-underline"
                                  >
                                    VIEW PROFILE
                                  </Link>
                                  <button
                                    onClick={() => setBookingExpert(expert)}
                                    className="flex-1 py-4 px-6 bg-brand-primary hover:bg-brand-purple text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-brand-primary/10 transition-all"
                                  >
                                    REQUEST SESSION
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          <div className="col-span-full py-20 text-center text-text-muted border-2 border-dashed border-gray-100 rounded-[32px]">
                            {loading ? 'Searching professionals...' : 'No professionals found matching your search.'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        ) : activeSubTab === 'ledger' ? (
          <div className="space-y-24 py-20 bg-white">
            <section className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="flex-1 space-y-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-brand-purple/5 rounded-[24px] flex items-center justify-center text-brand-purple border border-brand-purple/10">
                      <BookOpen size={32} />
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-6xl font-display font-bold text-brand-primary">Academic Ledger</h1>
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-primary/30">INSTITUTIONAL TRANSPARENCY & RECORD</p>
                    </div>
                  </div>
                  <p className="text-2xl text-text-secondary max-w-2xl leading-relaxed italic font-medium">
                    "A synchronized record of every Industry intervention, facilitation hours, and student impact metrics."
                  </p>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-6">
              <div className="bg-white rounded-[48px] shadow-premium border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-primary/30">INTEGRATION TITLE</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-primary/30">EXPERT</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-primary/30">TYPE</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-primary/30">DATE</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-primary/30">IMPACT</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-primary/30">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {facilitationRequests.map((request, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-10 py-8 font-bold text-brand-primary text-lg">{request.workshopTitle}</td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-brand-primary">AUI Managed</span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className="text-[10px] font-bold text-brand-primary/40 bg-gray-100 px-3 py-1 rounded uppercase tracking-wider">{request.category}</span>
                        </td>
                        <td className="px-10 py-8 font-bold text-brand-primary">{request.preferredMonth}</td>
                        <td className="px-10 py-8 text-text-secondary">{request.studentCount} Students</td>
                        <td className="px-10 py-8">
                          <div className={`flex items-center gap-2 font-bold text-[10px] tracking-widest ${request.status === 'approved' ? 'text-emerald-500' :
                              request.status === 'rejected' ? 'text-red-500' : 'text-amber-500'
                            }`}>
                            {request.status === 'approved' ? <CheckCircle2 size={14} /> :
                              request.status === 'rejected' ? <X size={14} /> : <Clock size={14} />}
                            {request.status.toUpperCase()}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {ledgerEntries.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-10 py-8 font-bold text-brand-primary text-lg">{entry.title}</td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-[10px] font-bold text-brand-purple">
                              {entry.expert.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium text-brand-primary">{entry.expert}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className="text-[10px] font-bold text-brand-primary/40 bg-gray-100 px-3 py-1 rounded uppercase tracking-wider">{entry.type}</span>
                        </td>
                        <td className="px-10 py-8 font-bold text-brand-primary">{entry.date}</td>
                        <td className="px-10 py-8 text-text-secondary">{entry.impact}</td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] tracking-widest">
                            <CheckCircle2 size={14} /> {entry.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-brand-purple rounded-[48px] p-16 text-white flex items-center justify-between relative overflow-hidden group">
                  <div className="relative z-10 space-y-8">
                    <h3 className="text-3xl font-display font-bold">Integration Summary</h3>
                    <div className="flex gap-20">
                      <div className="space-y-1">
                        <p className="text-6xl font-bold">120+</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">TOTAL HOURS MENTORED</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-6xl font-bold">94.8%</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">AVG. STUDENT SATISFACTION</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-[-10%] bottom-[-20%] opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <BookOpen size={240} />
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-[48px] p-16 border border-gray-100 flex flex-col justify-center space-y-8">
                  <p className="text-xl text-brand-primary leading-relaxed italic font-medium">
                    "The consistency of AUI integrations has directly improved our students' placement preparedness. The industry proximity is now a core part of our brand."
                  </p>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">DEAN OF ANIMATION, FRAMEBOX</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : activeSubTab === 'nexus' ? (
          <div className="space-y-32 py-20 bg-white">
            <section className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="space-y-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-brand-purple/5 rounded-[24px] flex items-center justify-center text-brand-purple border border-brand-purple/10">
                      <Zap size={32} />
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-6xl font-display font-bold text-brand-primary">AUI Nexus</h1>
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-purple">PRIORITY INDUSTRY SYNC</p>
                    </div>
                  </div>
                  <p className="text-2xl text-text-secondary max-w-2xl leading-relaxed font-medium">
                    Exclusive opportunities and recently onboarded hall-of-fame veterans pushed strictly to partner institutes.
                  </p>
                </div>

                <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-full border border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">LIVE PULSE: 17:33</span>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {dynamicNexus.length > 0 ? (
                  dynamicNexus.map((opp, idx) => (
                    <div key={idx} className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-premium flex gap-10 group hover:border-brand-purple/30 transition-all duration-500">
                      <div className="w-32 h-32 bg-gray-50 rounded-3xl flex items-center justify-center text-brand-primary/20 shrink-0">
                        <Zap size={48} className="group-hover:text-brand-purple transition-colors duration-500" />
                      </div>
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-brand-purple bg-brand-purple/5 px-3 py-1 rounded uppercase tracking-wider">{opp.tag}</span>
                          </div>
                          <h3 className="text-3xl font-bold text-brand-primary leading-tight">{opp.title}</h3>
                          <div className="flex items-center gap-6 text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest">
                            <div className="flex items-center gap-2"><Calendar size={14} /> {opp.date}</div>
                            <div className="flex items-center gap-2"><Users size={14} /> {opp.limit}</div>
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">{opp.description}</p>
                        </div>
                        <Button
                          onClick={() => setBookingExpert({
                            id: opp.id,
                            name: opp.title,
                            role: opp.tag || 'NEXUS OPPORTUNITY'
                          })}
                          className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-purple text-white text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/10 transition-all duration-300"
                        >
                          SECURE SEAT VIA AUI
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-brand-surface rounded-[48px] border-2 border-dashed border-gray-100">
                    <h3 className="text-xl font-bold text-brand-primary">Nexus Opportunities Coming Soon</h3>
                    <p className="text-sm text-text-secondary mt-2">Exclusive industry opportunities are synced periodically.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 space-y-16">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold text-brand-primary">Recently Onboarded Veterans</h2>
                <button className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/30 hover:text-brand-purple transition-colors">VIEW TALENT POOL</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {professionals.filter(p => p.isMentor).length > 0 ? (
                  professionals.filter(p => p.isMentor).map((prof, idx) => {
                    const expert = {
                      id: prof.id,
                      name: prof.fullName || prof.user?.email?.split('@')[0] || 'Expert',
                      role: prof.headline || prof.position || 'Industry Expert',
                      image: prof.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(prof.fullName || 'Expert')}&background=random`
                    };
                    return (
                      <div key={idx} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                        <div className="relative mb-8">
                          <img src={expert.image} className="w-full aspect-square rounded-[32px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                          <button
                            onClick={() => {
                              const talentCode = prof.user?.talentId?.talentCode;
                              if (talentCode) navigate(`/talent/${talentCode}`);
                              else navigate('/talent/AUI-PRO-001');
                            }}
                            className="absolute top-4 right-4 w-10 h-10 bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:scale-110 transition-transform"
                          >
                            <motion.span animate={{ rotate: 90 }}><Zap size={16} /></motion.span>
                          </button>
                        </div>
                        <div className="space-y-1 text-left">
                          <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest">NEW LEGEND</span>
                          <h4 className="text-xl font-bold text-brand-primary">{expert.name}</h4>
                          <p className="text-sm text-text-secondary">{expert.role}</p>
                          <div className="pt-6">
                            <Button
                              onClick={() => setBookingExpert(expert)}
                              className="w-full py-4 rounded-xl bg-brand-primary hover:bg-brand-purple text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-primary/10 transition-all duration-300"
                            >
                              REQUEST SESSION
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-20 text-center text-text-muted border-2 border-dashed border-gray-100 rounded-[40px]">
                    No mentors found on the platform yet.
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="py-40 text-center">
            <h2 className="text-3xl font-display font-bold text-brand-primary">Coming Soon</h2>
          </div>
        )}


        {/* Feature Showcase: AUI Edge */}
        <section className="bg-white py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-brand-purple/5 rounded-[60px] p-16 md:p-24 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-purple text-white rounded-md">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">THE AUI EDGE</span>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-5xl font-display font-bold text-brand-primary leading-tight">
                      Zero Friction.<br />
                      <span className="text-brand-purple">Pure Pedagogy.</span>
                    </h2>
                    <p className="text-lg text-text-secondary leading-relaxed max-w-xl">
                      We handle the contracts, technical logistics, and scheduling. You get the world's best talent in your classroom.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[
                      { icon: Globe, title: 'Global Payroll', desc: 'Compliant international payments handled by us.' },
                      { icon: Zap, title: 'Technical Sync', desc: 'We stress-test the pipeline before the session.' },
                      { icon: BookOpen, title: 'Curriculum Prep', desc: 'Syncing expert knowledge with your goals.' },
                      { icon: Shield, title: 'Verified Only', desc: 'Every teacher has at least 10+ years production exp.' }
                    ].map((item) => (
                      <div key={item.title} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className="text-brand-purple" />
                          <h4 className="font-bold text-brand-primary">{item.title}</h4>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-[40px] p-10 shadow-2xl border border-gray-100 max-w-sm mx-auto relative z-10"
                  >
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-brand-surface rounded-xl flex items-center justify-center text-brand-purple">
                          <Zap size={24} />
                        </div>
                        <span className="px-3 py-1 bg-brand-purple/10 text-brand-purple text-[10px] font-bold rounded-full uppercase tracking-wider">ELITE TIER</span>
                      </div>
                      <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/30">NOW FACILITATING</p>
                        <h4 className="text-2xl font-bold text-brand-primary leading-tight">Industry-to-Classroom Bridge</h4>
                      </div>
                      <div className="space-y-6 pt-6 border-t border-gray-50">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-text-secondary">Vetting Status</span>
                          <span className="text-xs font-bold text-brand-purple">Enterprise Verified</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-brand-purple rounded-full" />
                        </div>
                        <p className="text-[10px] text-text-muted italic text-center">
                          All session facilitators have background checks & NDA signed.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  {/* Decorative Elements */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-purple/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-purple/5 rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collaboration Requests Section */}
        {/* <section className="bg-white py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 text-left">
                  <div className="text-left">
                    <h2 className="text-xl font-display font-bold text-brand-primary">My Special Requests</h2>
                    <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Sent to Admin</p>
                  </div>
                  <Badge variant="info">
                    {mySpecialRequests.filter(r => r.senderRole === 'institute').length} Total
                  </Badge>
                </div>

                <div className="space-y-4">
                  {mySpecialRequests
                    .filter(r => r.senderRole === 'institute')
                    .sort((a, b) => new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime())
                    .map((req) => (
                      <Card
                        key={`sent-${req.id}`}
                        className={`p-5 space-y-4 border-l-4 shadow-premium bg-white transition-premium hover:-translate-y-1 ${req.status === 'closed' ? 'border-l-emerald-500' :
                            req.status === 'rejected' ? 'border-l-red-500' :
                              req.status === 'contacted' ? 'border-l-brand-accent' : 'border-l-gray-300'
                          }`}
                      >
                        <div className="flex justify-between items-start text-left">
                          <div className="flex gap-3 items-center text-left">
                            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-[10px]">
                              ADM
                            </div>
                            <div className="text-left">
                              <h4 className="text-sm font-bold text-brand-primary">Request to Admin</h4>
                              <p className="text-[10px] text-text-secondary">
                                {(() => {
                                  const d = req.created_at || req.createdAt;
                                  if (!d) return 'Recently';
                                  const date = new Date(d);
                                  return isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                })()}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={req.status === 'closed' ? 'success' : req.status === 'rejected' ? 'warning' : 'info'}
                            className="text-[10px] py-1 px-3 uppercase tracking-wider"
                          >
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-secondary line-clamp-2 italic italic LEAD">"{req.message}"</p>
                        {req.responseMessage && (
                          <div className="p-3 bg-brand-surface rounded-lg border-l-2 border-brand-accent">
                            <p className="text-[10px] font-bold text-brand-primary mb-1 flex items-center gap-1">
                              <MessageSquare size={10} /> Admin Response:
                            </p>
                            <p className="text-xs text-text-secondary italic">{req.responseMessage}</p>
                          </div>
                        )}
                      </Card>
                    ))}
                  {mySpecialRequests.filter(r => r.senderRole === 'institute').length === 0 && (
                    <div className="py-10 text-center text-text-muted border-2 border-dashed border-gray-100 rounded-brand text-xs">
                      No special requests sent yet.
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 text-left">
                  <div className="text-left">
                    <h2 className="text-xl font-display font-bold text-brand-primary">Admin Recommendations</h2>
                    <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Professionals Shared with You</p>
                  </div>
                  <Badge variant="success">
                    {mySpecialRequests.filter(r => r.senderRole === 'admin').length} New
                  </Badge>
                </div>

                <div className="space-y-4">
                  {mySpecialRequests
                    .filter(r => r.senderRole === 'admin')
                    .sort((a, b) => new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime())
                    .map((req) => (
                      <Card
                        key={`rec-${req.id}`}
                        className="p-5 space-y-4 border-l-4 border-l-brand-accent shadow-premium bg-white transition-premium hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start text-left">
                          <div className="flex gap-3 items-center text-left">
                            <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary">
                              <User size={20} />
                            </div>
                            <div className="text-left">
                              <h4 className="text-sm font-bold text-brand-primary">{req.professionalName}</h4>
                              <p className="text-[10px] text-text-secondary">
                                {(() => {
                                  const d = req.created_at || req.createdAt;
                                  if (!d) return 'Recently';
                                  const date = new Date(d);
                                  return isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                })()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="success" className="text-[10px] py-1 px-3 uppercase tracking-wider">
                            RECEIVED
                          </Badge>
                        </div>
                        <p className="text-xs text-text-secondary line-clamp-2 italic">"{req.message}"</p>
                        <div className="p-3 bg-brand-surface rounded-lg border-l-2 border-brand-accent">
                          <p className="text-[10px] font-bold text-brand-primary mb-1 uppercase tracking-wider flex items-center gap-1">
                            Portfolio:
                          </p>
                          <a
                            href={req.professionalPublicUrl?.startsWith('http')
                              ? req.professionalPublicUrl
                              : req.professionalPublicUrl?.includes('/')
                                ? `${window.location.origin}/${req.professionalPublicUrl}`
                                : `https://${req.professionalPublicUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1"
                          >
                            View Link <ArrowRight size={12} />
                          </a>
                        </div>
                      </Card>
                    ))}
                  {mySpecialRequests.filter(r => r.senderRole === 'admin').length === 0 && (
                    <div className="py-10 text-center text-text-muted border-2 border-dashed border-gray-100 rounded-brand text-xs italic">
                      No recommendations received yet.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </section> */}


      </main>

      {/* New Booking Modal: Facilitate Expert Session */}
      <AnimatePresence>
        {bookingExpert && (
          <div className="fixed inset-0 bg-brand-primary/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden text-left flex flex-col md:flex-row relative"
            >
              <button
                onClick={() => setBookingExpert(null)}
                className="absolute top-8 right-8 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors z-20"
              >
                <X size={20} className="text-brand-primary/40" />
              </button>

              {/* Left Panel: Info */}
              <div className="flex-1 p-12 md:p-16 space-y-10 bg-gray-50/50">
                <div className="space-y-6">
                  <span className="px-3 py-1 bg-brand-purple/10 text-brand-purple text-[10px] font-bold rounded uppercase tracking-wider">
                    {bookingExpert.role || 'INDUSTRY EXPERT'}
                  </span>
                  <h2 className="text-5xl font-display font-bold text-brand-primary leading-tight">
                    Facilitate Expert Session: <span className="text-brand-purple">{bookingExpert.name}</span>
                  </h2>
                  <p className="text-text-secondary leading-relaxed text-lg">
                    As AUI, we act as the bridge between your institution and industry veterans. Submit this request, and our team will match you with the best-fit verified expert.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center text-white">
                      <Zap size={20} />
                    </div>
                    <h4 className="font-bold text-brand-primary text-xl">AUI Advantage</h4>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    We manage the entire logistics: from contract negotiations and payments to calendar scheduling and technical setups.
                  </p>
                </div>
              </div>

              {/* Right Panel: Form */}
              <div className="flex-1 p-12 md:p-16 bg-white border-l border-gray-100 space-y-10 overflow-y-auto no-scrollbar max-h-[90vh]">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/30 ml-2">STUDENT COUNT</label>
                    <select
                      value={bookingForm.studentCount}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, studentCount: e.target.value }))}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-brand-primary focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none"
                    >
                      <option>10-20</option>
                      <option>20-30</option>
                      <option>30-50</option>
                      <option>50+</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/30 ml-2">PREFERRED MONTH</label>
                    <select
                      value={bookingForm.preferredMonth}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, preferredMonth: e.target.value }))}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-brand-primary focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none"
                    >
                      <option>June 2026</option>
                      <option>July 2026</option>
                      <option>August 2026</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/30 ml-2">LEAD CONTACT PERSON</label>
                    <input
                      type="text"
                      placeholder="Name of Dean or HOD"
                      value={bookingForm.contactPerson}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-brand-primary placeholder:text-brand-primary/10 outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/30 ml-2">OFFICIAL EMAIL ADDRESS</label>
                    <input
                      type="email"
                      placeholder="inst-dept@university.edu"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-brand-primary placeholder:text-brand-primary/10 outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/30 ml-2">SPECIAL REQUIREMENTS</label>
                    <textarea
                      placeholder="e.g. Needs to focus specifically on bipedal walking 2D vs 3D..."
                      value={bookingForm.specialRequirements}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequirements: e.target.value }))}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-brand-primary placeholder:text-brand-primary/10 outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all min-h-[120px] resize-none"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleBookRequest}
                  className="w-full py-6 rounded-3xl bg-brand-primary hover:bg-brand-purple text-xs font-bold uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/20 transition-all duration-300 transform active:scale-95"
                >
                  REQUEST AUI FACILITATION
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Special Request Modal */}
      <AnimatePresence>
        {isSpecialModalOpen && (
          <div className="fixed inset-0 bg-brand-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 text-left">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-brand shadow-2xl overflow-hidden text-left max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="bg-brand-primary p-8 text-white flex justify-between items-start text-left sticky top-0 z-10">
                <div className="space-y-1">
                  <h2 className="text-2xl font-display font-bold">Submit Special Request</h2>
                  <p className="text-white/60 text-sm">Our team will help you connect with professional experts.</p>
                </div>
                <button onClick={() => setIsSpecialModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-premium">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">Institute Name</label>
                    <input
                      className="w-full bg-brand-surface border-none rounded-xl text-sm p-4 focus:ring-2 focus:ring-brand-accent/20"
                      placeholder="Enter your institute name"
                      value={specialRequestForm.name}
                      onChange={(e) => setSpecialRequestForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">Institute Public URL</label>
                    <input
                      className="w-full bg-brand-surface border-none rounded-xl text-sm p-4 focus:ring-2 focus:ring-brand-accent/20"
                      placeholder="e.g. Website or Portfolio link"
                      value={specialRequestForm.publicUrl}
                      onChange={(e) => setSpecialRequestForm(prev => ({ ...prev, publicUrl: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">When do you want mentorship? (Date/Time)</label>
                  <input
                    className="w-full bg-brand-surface border-none rounded-xl text-sm p-4 focus:ring-2 focus:ring-brand-accent/20"
                    placeholder="e.g. 24th April, 2026 at 2 PM"
                    value={specialRequestForm.mentorshipTime}
                    onChange={(e) => setSpecialRequestForm(prev => ({ ...prev, mentorshipTime: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">Your Message / Requirements</label>
                  <textarea
                    className="w-full bg-brand-surface border-none rounded-xl text-sm p-4 focus:ring-2 focus:ring-brand-accent/20 min-h-[150px] resize-none"
                    placeholder="Describe your requirements for the expert..."
                    value={specialRequestForm.message}
                    onChange={(e) => setSpecialRequestForm(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <Button
                    variant="secondary"
                    className="flex-1 py-4 font-bold"
                    onClick={() => setIsSpecialModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-[2] py-4 font-bold shadow-premium"
                    onClick={handleSpecialRequestSubmit}
                    disabled={isSubmittingSpecial}
                  >
                    {isSubmittingSpecial ? 'Submitting...' : 'Submit Request to Admin'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Facilitation Request Modal */}
      <Modal
        isOpen={isFacilitationModalOpen}
        onClose={() => setIsFacilitationModalOpen(false)}
        title=""
        size="xl"
        showFooter={false}
        className="!p-0 overflow-hidden"
        message={
          <div className="flex h-full min-h-[500px]">
            {/* Left Side - Branding */}
            <div className="w-1/2 p-12 bg-white border-r border-gray-100 flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <span className="px-3 py-1 bg-brand-purple/10 text-brand-purple text-[10px] font-bold rounded-md uppercase tracking-wider">
                  {selectedWorkshopForFacilitation?.category || 'ANIMATION'}
                </span>
                <h2 className="text-5xl font-display font-bold text-brand-primary leading-tight">
                  Facilitate Expert Session:
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  As AUI, we act as the bridge between your institution and industry veterans. Submit this request, and our team will match you with the best-fit verified expert.
                </p>
              </div>

              <div className="p-8 bg-brand-purple/5 rounded-3xl border border-brand-purple/10 flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Zap size={20} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-brand-primary">AUI Advantage</h4>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    We manage the entire logistics: from contract negotiations and payments to calendar scheduling and technical setups.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-1/2 p-12 bg-gray-50/30 flex flex-col justify-center space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest ml-2">STUDENT COUNT</label>
                  <select
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-brand-primary focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none appearance-none"
                    value={facilitationForm.studentCount}
                    onChange={(e) => setFacilitationForm({ ...facilitationForm, studentCount: e.target.value })}
                  >
                    <option>10-20</option>
                    <option>20-50</option>
                    <option>50-100</option>
                    <option>100+</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest ml-2">PREFERRED MONTH</label>
                  <select
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-brand-primary focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none appearance-none"
                    value={facilitationForm.preferredMonth}
                    onChange={(e) => setFacilitationForm({ ...facilitationForm, preferredMonth: e.target.value })}
                  >
                    <option>June 2026</option>
                    <option>July 2026</option>
                    <option>August 2026</option>
                    <option>September 2026</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest ml-2">LEAD CONTACT PERSON</label>
                <Input
                  placeholder="Name of Dean or HOD"
                  value={facilitationForm.contactPerson}
                  onChange={(e) => setFacilitationForm({ ...facilitationForm, contactPerson: e.target.value })}
                  className="!py-4"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest ml-2">OFFICIAL EMAIL ADDRESS</label>
                <Input
                  placeholder="inst-dept@university.edu"
                  value={facilitationForm.email}
                  onChange={(e) => setFacilitationForm({ ...facilitationForm, email: e.target.value })}
                  className="!py-4"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest ml-2">SPECIAL REQUIREMENTS</label>
                <textarea
                  className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium text-brand-primary focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none min-h-[120px] resize-none"
                  placeholder="e.g. Needs to focus specifically on bipedal walking 2D vs 3D..."
                  value={facilitationForm.specialRequirements}
                  onChange={(e) => setFacilitationForm({ ...facilitationForm, specialRequirements: e.target.value })}
                />
              </div>

              <Button
                onClick={handleFacilitationSubmit}
                isLoading={isSubmittingFacilitation}
                className="w-full py-5 rounded-2xl bg-brand-primary hover:bg-brand-purple text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/10 transition-all"
              >
                REQUEST AUI FACILITATION
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default InstituteDashboard;
