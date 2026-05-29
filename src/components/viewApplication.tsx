import React, { useState } from 'react';
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
}

const ViewApplication: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [activeTab, setActiveTab] = useState<Applicant['status']>('applications');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data based on screenshots
  const applicants: Applicant[] = [
    {
      id: '1',
      name: 'Alex Rivera',
      talentId: 'AUI-8RP-S',
      role: 'Character Animator',
      experience: '8y Exp',
      matchScore: 98,
      avatar: 'https://picsum.photos/seed/alex/200/200',
      isVerified: true,
      position: 'Lead Character Designer',
      primarySkill: 'Animation',
      currentCTC: '3000',
      expectedCTC: '5000',
      noticePeriod: 'Immediate',
      relocationPref: 'Yes',
      availability: 'Available Now',
      location: 'Mumbai, India',
      status: 'applications'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      talentId: 'AUI-4TY-M',
      role: 'Senior Animator',
      experience: '6 Years Exp',
      matchScore: 98,
      avatar: 'https://picsum.photos/seed/sarah/200/200',
      isVerified: true,
      position: 'Senior Animator',
      primarySkill: 'VFX',
      currentCTC: '$2,800 / month',
      expectedCTC: '$4,000 / month',
      noticePeriod: 'Immediate',
      relocationPref: 'No',
      availability: '2 Weeks',
      location: 'Bangalore, India',
      status: 'discussion'
    },
    {
      id: '3',
      name: 'James Wilson',
      talentId: 'AUI-2WF-J',
      role: 'Lighting Artist',
      experience: '3 Years Exp',
      matchScore: 98,
      avatar: 'https://picsum.photos/seed/james/200/200',
      isVerified: true,
      position: 'Lighting Artist',
      primarySkill: 'Lighting',
      currentCTC: '$1,800',
      expectedCTC: '$2,500',
      noticePeriod: 'Immediate',
      relocationPref: 'No',
      availability: 'Available Now',
      location: 'New York, USA',
      status: 'hired'
    }
  ];

  const tabs = [
    { id: 'applications', label: 'APPLICATIONS', count: 1 },
    { id: 'shortlisting', label: 'SHORTLISTING', count: 0 },
    { id: 'discussion', label: 'DISCUSSION', count: 2 },
    { id: 'agreement', label: 'AGREEMENT', count: 2 },
    { id: 'hired', label: 'HIRED', count: 1 },
    { id: 'rejected', label: 'REJECTED', count: 0 },
  ];

  const filteredApplicants = applicants.filter(a => a.status === activeTab);

  const renderApplicantCard = (applicant: Applicant) => (
    <Card className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-premium hover:shadow-premium-hover transition-all duration-500 mb-8 overflow-hidden relative group">
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
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-black tracking-tight text-[#1a1f28]">{applicant.name}</h3>
                {applicant.isVerified && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">VERIFIED</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                <span>{applicant.talentId}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                <span>{applicant.role}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                <span>{applicant.experience}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="text-[8px] font-black uppercase tracking-[0.25em] text-gray-300">POSITION</div>
              <div className="p-5 bg-white border border-gray-100 rounded-3xl text-[10px] font-black text-gray-900 text-center min-h-[70px] flex items-center justify-center">
                {applicant.position}
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-[8px] font-black uppercase tracking-[0.25em] text-gray-300">PRIMARY SKILL</div>
              <div className="p-5 bg-white border border-gray-100 rounded-3xl text-[10px] font-black text-purple-600 text-center min-h-[70px] flex items-center justify-center">
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
                  {applicant.noticePeriod}
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
          <div className="space-y-0.5">
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
      <div className="mt-10 pt-10 border-t border-gray-50 flex gap-4">
        <button className="h-14 px-10 bg-white border border-gray-100 text-[#1a1f28] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all">
          VIEW PROFILE
        </button>
        {activeTab === 'applications' && (
          <>
            <button className="h-14 px-16 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black/90 transition-all active:scale-[0.98] shadow-lg shadow-black/10">
              SHORTLIST
            </button>
            <button className="h-14 px-10 bg-white border border-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all">
              TRY NEXT TIME
            </button>
          </>
        )}
        {activeTab === 'discussion' && (
          <>
            <button className="h-14 px-12 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/10">
              <UserPlus size={16} />
              GET CONTACT INFO
            </button>
            <button className="h-14 px-12 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black/90 transition-all shadow-lg shadow-black/10">
              <CheckCircle2 size={16} className="text-emerald-500" />
              ACCEPTED
            </button>
            <button className="h-14 px-10 bg-white border border-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all">
              REJECTED
            </button>
          </>
        )}
        {activeTab === 'agreement' && (
          <>
            <button className="h-14 px-12 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black/90 transition-all shadow-lg shadow-black/10">
              UPDATE AGREEMENT
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
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl min-w-[240px]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ARTIST HIRED</div>
                <div className="text-[8px] font-medium text-emerald-400">Successfully locked this talent</div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center">
                <div className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-1">CURRENT COMP</div>
                <div className="text-[11px] font-black text-gray-900">{applicant.currentCTC} / month</div>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center">
                <div className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-1">EXPECTED COMP</div>
                <div className="text-[11px] font-black text-gray-900">{applicant.expectedCTC} / month</div>
              </div>
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-center">
                <div className="text-[7px] font-black text-emerald-600 uppercase tracking-widest mb-1">FINAL SETTLEMENT</div>
                <div className="text-[11px] font-black text-emerald-600">$2,400 / month</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#fbfbfc] text-left">
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
                <h1 className="text-4xl font-black tracking-tight text-[#1a1f28]">Character Animator</h1>
                <div className="px-3 py-1 bg-emerald-50 rounded-full flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">OPEN</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                <ArrowRight size={14} className="text-gray-200" />
                <span>Feature Film</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                <span>5 Positions</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                <span className="text-emerald-500">2 Filled</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            {/* User requested NOT to have Edit Role and Pause Hiring buttons */}
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex gap-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Applicant['status'])}
                className={`pb-6 relative flex items-center gap-3 transition-all ${
                  activeTab === tab.id 
                  ? 'text-gray-900' 
                  : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                <span className="text-xs font-black uppercase tracking-[0.25em]">{tab.label}</span>
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
        <div className="flex gap-4">
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
          <button className="h-20 px-8 bg-white border border-gray-100 rounded-[1.5rem] flex items-center gap-3 shadow-sm hover:bg-gray-50 transition-all">
            <SlidersHorizontal size={18} className="text-gray-300" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">FILTERS</span>
          </button>
          <button className="h-20 px-10 bg-black text-white rounded-[1.5rem] flex items-center gap-4 shadow-xl shadow-black/10">
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
                <h2 className="text-3xl font-black tracking-tight text-[#1a1f28] mb-4">No applicants found</h2>
                <p className="text-gray-400 font-medium mb-10">Share this role link with your network or manually invite<br />verified talent from our pool.</p>
                <div className="flex justify-center gap-4">
                  <button className="h-14 px-12 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/10">
                    INVITE VERIFIED TALENT
                  </button>
                  <button className="h-14 px-12 bg-white border border-gray-100 text-[#1a1f28] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                    COPY ROLE LINK
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ViewApplication;
