import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Briefcase, 
  Clock, 
  Globe, 
  Lock, 
  Check, 
  Calendar,
  User,
  ArrowUpRight,
  FileText,
  Sparkles
} from 'lucide-react';
import TalentAvatar from './TalentAvatar';

interface OpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: {
    name: string;
    role: string;
    avatar: string;
    talentCode?: string;
  } | null;
  onSend: (data: any) => void;
  loading?: boolean;
}

const OpportunityModal: React.FC<OpportunityModalProps> = ({ isOpen, onClose, artist, onSend, loading }) => {
  const [countries, setCountries] = useState<[string, string][]>([]);
  
  const TIME_ZONES = [
    'No Preference',
    'UTC (Universal Coordinated Time)',
    'IST (India Standard Time)',
    'EST (Eastern Standard Time)',
    'CST (Central Standard Time)',
    'MST (Mountain Standard Time)',
    'PST (Pacific Standard Time)',
    'GMT (Greenwich Mean Time)',
    'CET (Central European Time)',
    'JST (Japan Standard Time)',
    'AEST (Australian Eastern Standard Time)',
  ];

  React.useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        const list = data.map((c: any) => [c.cca2, c.name.common] as [string, string]);
        list.sort((a: any, b: any) => a[1].localeCompare(b[1]));
        setCountries(list);
      })
      .catch(err => {
        console.error('Failed to fetch countries:', err);
      });
  }, []);

  const [formData, setFormData] = useState({
    roleTitle: 'Animation',
    productionType: 'Feature Film',
    projectFormat: '3D',
    opportunityOverview: '',
    roleRequirements: '',
    startAvailability: 'IMMEDIATE',
    workMode: 'Hybrid',
    location: 'Worldwide',
    customLocation: '',
    timeZonePreference: 'No Preference',
    customTimeZone: '',
    customProductionType: '',
    customProjectFormat: '',
    includeCompensation: false,
    verificationFields: {
      name: true,
      primarySkill: true,
      position: true,
      experience: true,
      currentCompany: true,
      currentCTC: true,
      expectedCTC: true,
      noticePeriod: true,
      location: true,
      relocationPreference: true,
      showreel: true,
      workLedger: true
    }
  });

  const toggleVerificationField = (field: string) => {
    setFormData(prev => ({
      ...prev,
      verificationFields: {
        ...prev.verificationFields,
        //@ts-ignore
        [field]: !prev.verificationFields[field]
      }
    }));
  };

  if (!artist) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 md:p-8 bg-[#0a0a0a] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 pr-12 md:pr-0">
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">Send Opportunity</h2>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">PROFESSIONAL STUDIO OUTREACH</p>
                </div>
                <div className="hidden sm:block h-12 w-[1px] bg-gray-800 mx-2" />
                <div className="flex items-center gap-3">
                  <TalentAvatar
                    talentCode={artist.talentCode || ''}
                    initialAvatarUrl={artist.avatar}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover"
                    iconSize={20}
                    placeholderClassName="bg-white/5 text-gray-400 border border-white/10"
                  />
                  <div className="space-y-0.5">
                    <div className="text-sm font-black text-white leading-tight">{artist.name}</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-gray-500">{artist.role}</div>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 md:relative md:top-0 md:right-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:space-y-12 custom-scrollbar">
              
              {/* Role Context */}
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Briefcase size={16} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900">ROLE CONTEXT</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">ROLE TITLE</label>
                    <input 
                      type="text" 
                      value={formData.roleTitle}
                      onChange={(e) => setFormData({...formData, roleTitle: e.target.value})}
                      className="w-full h-14 px-6 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-900 outline-none focus:border-purple-600 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">PRODUCTION TYPE</label>
                    <input 
                      type="text" 
                      value={formData.productionType}
                      onChange={(e) => setFormData({...formData, productionType: e.target.value})}
                      className="w-full h-14 px-6 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-900 outline-none focus:border-purple-600 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">PROJECT FORMAT</label>
                    <div className="flex bg-gray-50 p-1.5 rounded-2xl h-14">
                      {['3D', '2D', 'OTHER'].map(format => (
                        <button
                          key={format}
                          onClick={() => setFormData({...formData, projectFormat: format})}
                          className={`flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            formData.projectFormat === format ? 'bg-black text-white shadow-lg' : 'text-gray-300 hover:text-gray-500'
                          }`}
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                    {formData.projectFormat === 'OTHER' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                      >
                        <input
                          type="text"
                          value={formData.customProjectFormat}
                          onChange={(e) => setFormData({...formData, customProjectFormat: e.target.value})}
                          placeholder="Specify project format..."
                          className="w-full h-12 px-6 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-900 outline-none focus:border-purple-600 transition-colors"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="h-[1px] bg-gray-50 w-full" />
              </section>

              {/* Overview & Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <section className="space-y-4 md:space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Sparkles size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900">OPPORTUNITY OVERVIEW</h3>
                  </div>
                  <textarea 
                    value={formData.opportunityOverview}
                    onChange={(e) => setFormData({...formData, opportunityOverview: e.target.value})}
                    placeholder="Describe the project, team, and what makes this opportunity interesting to a top-tier artist."
                    className="w-full min-h-[120px] md:min-h-[160px] p-6 bg-white border border-gray-100 rounded-[2rem] text-xs font-medium text-gray-900 outline-none focus:border-emerald-600 transition-colors resize-none leading-relaxed"
                  />
                </section>

                <section className="space-y-4 md:space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                      <User size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900">ROLE REQUIREMENTS</h3>
                  </div>
                  <textarea 
                    value={formData.roleRequirements}
                    onChange={(e) => setFormData({...formData, roleRequirements: e.target.value})}
                    placeholder="Explain the specific requirements, tools, experience, and skills needed for this role."
                    className="w-full min-h-[120px] md:min-h-[160px] p-6 bg-white border border-gray-100 rounded-[2rem] text-xs font-medium text-gray-900 outline-none focus:border-orange-500 transition-colors resize-none leading-relaxed"
                  />
                </section>
              </div>

              <div className="h-[1px] bg-gray-50 w-full" />

              {/* Timeline & Work Setup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <section className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <Calendar size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900">TIMELINE</h3>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">START AVAILABILITY</label>
                    <div className="flex bg-gray-50 p-1.5 rounded-2xl h-14">
                      {['IMMEDIATE', 'WITHIN 1 MONTH', 'FLEXIBLE'].map(avail => (
                        <button
                          key={avail}
                          onClick={() => setFormData({...formData, startAvailability: avail})}
                          className={`flex-1 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest transition-all ${
                            formData.startAvailability === avail ? 'bg-black text-white shadow-lg' : 'text-gray-300 hover:text-gray-500'
                          }`}
                        >
                          {avail}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
                      <Globe size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900">WORK SETUP</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">WORK MODE</label>
                      <select 
                        value={formData.workMode}
                        onChange={(e) => setFormData({...formData, workMode: e.target.value})}
                        className="w-full h-14 px-6 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-900 outline-none focus:border-pink-500 transition-colors appearance-none"
                      >
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">LOCATION</label>
                      <select 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full h-14 px-6 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-900 outline-none focus:border-pink-500 transition-colors appearance-none"
                      >
                        <option value="Worldwide">Worldwide</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  {formData.location === 'Other' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2"
                    >
                      <input
                        type="text"
                        value={formData.customLocation}
                        onChange={(e) => setFormData({...formData, customLocation: e.target.value})}
                        placeholder="Specify location name..."
                        required
                        className="w-full h-12 px-6 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-900 outline-none focus:border-pink-500 transition-colors"
                      />
                    </motion.div>
                  )}
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-300">TIME ZONE PREFERENCE</label>
                    <select 
                      value={formData.timeZonePreference}
                      onChange={(e) => setFormData({...formData, timeZonePreference: e.target.value})}
                      className="w-full h-14 px-6 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-900 outline-none focus:border-pink-500 transition-colors appearance-none"
                    >
                      {TIME_ZONES.map(tz => (
                         <option key={tz} value={tz}>{tz}</option>
                       ))}
                     </select>
                   </div>
                   {formData.timeZonePreference === 'Other' && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       className="mt-4"
                     >
                       <input
                         type="text"
                         value={formData.customTimeZone}
                         onChange={(e) => setFormData({...formData, customTimeZone: e.target.value})}
                         placeholder="Specify time zone..."
                         className="w-full h-12 px-6 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-900 outline-none focus:border-purple-600 transition-colors"
                       />
                     </motion.div>
                   )}
                 </section>
              </div>

              <div className="h-[1px] bg-gray-50 w-full" />

              {/* Compensation Details Checkbox */}
              <div className="flex items-center gap-4 py-2">
                <button 
                  onClick={() => setFormData({...formData, includeCompensation: !formData.includeCompensation})}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    formData.includeCompensation ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-transparent'
                  }`}
                >
                  <Check size={14} strokeWidth={4} />
                </button>
                <span className="text-xs font-black text-gray-900 tracking-tight">Include compensation details (optional)</span>
              </div>

              <div className="h-[1px] bg-gray-50 w-full" />

              {/* Verification Form */}
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <FileText size={16} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900">VERIFICATION / INFO REQUEST FORM</h3>
                    <p className="text-[9px] font-medium text-gray-400">Configure the profile fields required from the artist on accepting. Talent ID is securely locked.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-2xl opacity-60 flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black text-gray-400">Talent ID</h4>
                      <p className="text-[8px] font-medium text-gray-300">Secure identifying passport key</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded-lg">
                      <Lock size={10} className="text-purple-400" />
                      <span className="text-[7px] font-black uppercase tracking-widest text-purple-400">LOCKED</span>
                    </div>
                  </div>

                  {Object.entries({
                    name: { title: 'Name', desc: 'Legal professional designation' },
                    primarySkill: { title: 'Primary Skill', desc: 'Core software mastery & discipline' },
                    position: { title: 'Position', desc: 'Target artist alignment' },
                    experience: { title: 'Experience', desc: 'Industry tenure verification' },
                    currentCompany: { title: 'Current Company', desc: 'Latest studio association' },
                    currentCTC: { title: 'Current CTC', desc: 'Current scale rate' },
                    expectedCTC: { title: 'Expected CTC', desc: 'Desired scale rate for engagement' },
                    noticePeriod: { title: 'Notice Period', desc: 'Availability timeline scale' },
                    location: { title: 'Location', desc: 'Physical base geography' },
                    relocationPreference: { title: 'Relocation Preference', desc: 'Relocation capability' },
                    showreel: { title: 'Showreel', desc: 'Sleek portfolio video target' },
                    workLedger: { title: 'Work Ledger', desc: 'AUI verified projects chain' }
                  }).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => toggleVerificationField(key)}
                      className={`p-5 rounded-2xl border text-left transition-all duration-300 relative group ${
                        //@ts-ignore
                        formData.verificationFields[key]
                        ? 'bg-white border-purple-600 shadow-lg shadow-purple-600/5'
                        : 'bg-white border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className={`text-[10px] font-black transition-colors ${
                          //@ts-ignore
                          formData.verificationFields[key] ? 'text-gray-900' : 'text-gray-400'
                        }`}>{item.title}</h4>
                        <p className="text-[8px] font-medium text-gray-300">{item.desc}</p>
                      </div>
                      <div className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        //@ts-ignore
                        formData.verificationFields[key]
                        ? 'bg-purple-600 scale-100'
                        : 'bg-gray-100 scale-90 opacity-0 group-hover:opacity-100'
                      }`}>
                        <Check size={12} className="text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 border-t border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={onClose}
                className="w-full sm:w-auto h-16 px-12 bg-white border border-gray-100 text-[#1a1f28] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                CANCEL
              </button>
              <button
                disabled={loading}
                onClick={() => {
                  const dataToSend = {
                    ...formData,
                    projectFormat: formData.projectFormat === 'OTHER' ? formData.customProjectFormat : formData.projectFormat,
                    timeZonePreference: formData.timeZonePreference === 'Other' ? formData.customTimeZone : formData.timeZonePreference,
                    location: formData.location === 'Other' ? formData.customLocation : formData.location,
                  };
                  onSend(dataToSend);
                }}
                className="w-full sm:w-auto h-16 px-16 bg-[#0a0a0a] disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-black/20 hover:bg-black/90 transition-all active:scale-[0.98]"
              >
                {loading ? 'SENDING...' : 'SEND OPPORTUNITY'}
                {!loading && <ArrowUpRight size={18} />}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OpportunityModal;
