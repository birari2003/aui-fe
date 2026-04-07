import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, ChevronDown, X, User, MapPin, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Select from '../components/Select';
import Input from '../components/Input';
import Badge from '../components/Badge';
import { searchProfessionals } from '../services/searchServices';
import { getMyCollaborationRequests, respondToCollaborationRequest, sendCollaborationRequest } from '../services/collaborationServices';
import { View } from '../types';

const InstituteDashboard = ({ setView }: { setView: (v: View) => void }) => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = React.useState<any[]>([]);
  const [requests, setRequests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [intent, setIntent] = React.useState('');
  const [date, setDate] = React.useState('');
  const [type, setType] = React.useState('');
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [bookingExpert, setBookingExpert] = React.useState<any | null>(null);
  const [bookingMessage, setBookingMessage] = React.useState('');
  const [publicUrl, setPublicUrl] = React.useState('');

  const fetchDashboardData = async (query: any = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        const [profRes, reqRes] = await Promise.all([
          searchProfessionals(token, query),
          getMyCollaborationRequests(token)
        ]);

        if (profRes.ok) {
          const profData = await profRes.json();
          setProfessionals(profData.data);
        }
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setRequests(reqData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

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
        const res = await sendCollaborationRequest(token, {
          receiverId: bookingExpert.id,
          receiverRole: 'professional',
          message: bookingMessage || `I would like to invite you for a ${type} on ${date}.`,
          proposedDate: date,
          publicUrl: publicUrl,
        });
        if (res.ok) {
          setBookingExpert(null);
          setBookingMessage('');
          setPublicUrl('');
          fetchDashboardData();
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

  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <main className="no-scrollbar">
        {/* Hero & Fast Booking Mode */}
        <section className="bg-gradient-to-b from-white to-brand-surface py-20 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="text-5xl font-display font-bold tracking-tight text-brand-primary leading-tight">
                Book Industry Experts for Your Classroom
              </h1>
              <p className="text-lg text-text-secondary">
                Bring real-world production experience to your students in three simple steps.
              </p>
            </div>

            <div className="bg-white rounded-brand p-8 shadow-premium border border-gray-100 max-w-5xl mx-auto text-left">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <Select 
                  label="1. What do you need?" 
                  options={['Select Need', 'Character Animation', 'Acting', 'Lighting', 'FX', 'Layout']} 
                  value={intent}
                  onChange={(e: any) => setIntent(e.target.value)}
                  className="bg-brand-surface border-none"
                />
                
                <div className="relative text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5 block">2. Select Date</label>
                  <button 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full p-3 bg-brand-surface rounded-brand text-sm text-left border border-transparent hover:border-gray-200 transition-premium flex items-center justify-between"
                  >
                    <span className={date ? 'text-brand-primary font-medium' : 'text-text-muted'}>
                      {date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Select Date'}
                    </span>
                    <Calendar size={16} className="text-text-muted" />
                  </button>
                  
                  <AnimatePresence>
                    {showCalendar && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-2 left-0 w-64 bg-white border border-gray-100 shadow-2xl rounded-brand p-4 z-50"
                      >
                        <div className="flex justify-between items-center mb-4 text-left">
                          <span className="text-xs font-bold text-brand-primary">March 2026</span>
                          <div className="flex gap-1">
                            <button className="p-1 hover:bg-brand-surface rounded transition-premium"><ChevronRight size={14} className="rotate-180" /></button>
                            <button className="p-1 hover:bg-brand-surface rounded transition-premium"><ChevronRight size={14} /></button>
                          </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <span key={d} className="text-[10px] font-bold text-text-muted">{d}</span>
                          ))}
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                            <button 
                              key={d} 
                              onClick={() => { 
                                const day = d.toString().padStart(2, '0');
                                setDate(`2026-03-${day}`); 
                                setShowCalendar(false); 
                              }}
                              className="p-1.5 text-xs hover:bg-brand-primary hover:text-white rounded transition-premium"
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Select 
                  label="3. Program Type" 
                  options={['Select Type', 'Workshop', 'Mentorship', 'Portfolio Review']} 
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="bg-brand-surface border-none"
                />

                <Button className="w-full py-3.5" onClick={handleSearch}>Find Available Experts</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Collaboration Requests Section */}
        <section className="bg-white py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Invitations Received */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4 text-left">
                  <div className="text-left">
                    <h2 className="text-xl font-display font-bold text-brand-primary">Invitations Received</h2>
                    <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">From Experts</p>
                  </div>
                  <Badge variant="info">
                    {requests.filter(r => r.status === 'pending' && r.senderRole === 'professional').length} New
                  </Badge>
                </div>

                <div className="space-y-4">
                  {requests.filter(r => r.senderRole === 'professional').length > 0 ? (
                    requests.filter(r => r.senderRole === 'professional').map((req) => (
                      <Card key={req.id} className={`p-5 space-y-4 border-l-4 ${req.status === 'accepted' ? 'border-l-emerald-500' : req.status === 'rejected' ? 'border-l-red-500' : 'border-l-brand-accent shadow-premium'}`}>
                        <div className="flex justify-between items-start text-left">
                          <div className="flex gap-3 items-center text-left">
                            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-xs">
                              {req.professional?.user?.email[0].toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-brand-primary">{req.professional?.user?.email.split('@')[0]}</h4>
                            </div>
                          </div>
                          <Badge variant={req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'warning' : 'warning'} className="text-[10px] py-0 px-2">
                            {req.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-secondary line-clamp-2 italic">"{req.message}"</p>
                        
                        {req.publicUrl && (
                          <div className="pt-1">
                            <Button 
                              variant="outline" 
                              className="w-full py-1 text-[10px] font-bold gap-2"
                              onClick={() => window.open(req.publicUrl.startsWith('http') ? req.publicUrl : `https://${req.publicUrl}`, '_blank')}
                            >
                              <ArrowRight size={12} /> View Portfolio
                            </Button>
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          <Button 
                            variant="ghost" 
                            className="flex-1 py-1 text-[10px] font-bold text-brand-accent hover:bg-brand-surface"
                            onClick={() => req.professional?.talentId?.talentCode && navigate(`/talent/${req.professional.talentId.talentCode}`)}
                          >
                            Profile
                          </Button>
                          
                          {req.status === 'pending' && (
                            <div className="flex-[2] flex gap-2">
                              <Button variant="secondary" className="flex-1 py-1 text-[10px]" onClick={() => handleRespond(req.id, 'rejected')}>Decline</Button>
                              <Button className="flex-1 py-1 text-[10px]" onClick={() => handleRespond(req.id, 'accepted')}>Accept</Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="py-10 text-center text-text-muted border-2 border-dashed border-gray-100 rounded-brand text-xs">
                      No invitations from experts yet.
                    </div>
                  )}
                </div>
              </section>

              {/* My Sent Requests */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4 text-left">
                  <div className="text-left">
                    <h2 className="text-xl font-display font-bold text-brand-primary">My Sent Requests</h2>
                    <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">To Professionals</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {requests.filter(r => r.senderRole === 'institute').length > 0 ? (
                    requests.filter(r => r.senderRole === 'institute').map((req) => (
                      <Card key={req.id} className={`p-5 space-y-4 border-l-4 ${req.status === 'accepted' ? 'border-l-emerald-500' : req.status === 'rejected' ? 'border-l-red-500' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start text-left">
                          <div className="flex gap-3 items-center text-left">
                            <div className="w-8 h-8 rounded-full bg-brand-surface flex items-center justify-center text-brand-primary font-bold text-xs">
                              {req.professional?.user?.email[0].toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-brand-primary">{req.professional?.user?.email.split('@')[0]}</h4>
                            </div>
                          </div>
                          <Badge variant={req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'warning' : 'warning'} className="text-[10px] py-0 px-2">
                            {req.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-secondary line-clamp-2 italic">"{req.message}"</p>
                        
                        <div className="flex gap-2 pt-1">
                          <Button 
                            variant="ghost" 
                            className="w-full py-1 text-[10px] font-bold text-brand-accent hover:bg-brand-surface"
                            onClick={() => req.professional?.talentId?.talentCode && navigate(`/talent/${req.professional.talentId.talentCode}`)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="py-10 text-center text-text-muted border-2 border-dashed border-gray-100 rounded-brand text-xs">
                      You haven't sent any booking requests yet.
                    </div>
                  )}
                </div>
              </section>
            </div>

            {requests.length === 0 && (
              <div className="py-20 text-center text-text-muted border-2 border-dashed border-gray-100 rounded-brand max-w-xl mx-auto">
                <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-bold text-brand-primary">No Active Collaborations</h3>
                <p className="text-sm">Start by booking an expert from the directory below.</p>
              </div>
            )}
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {showResults && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-7xl mx-auto px-6 py-20 space-y-10"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-6 text-left">
                <h2 className="text-2xl font-display font-bold text-brand-primary">Available Experts</h2>
                <div className="flex gap-4">
                  {['Skill', 'Role', 'Experience', 'Verified'].map(filter => (
                    <Badge key={filter} variant="outline" className="px-4 py-1.5 cursor-pointer hover:bg-brand-surface transition-premium">
                      {filter} <ChevronDown size={12} className="ml-1 inline" />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {professionals.slice(0, 3).map((talent, i) => (
                  <motion.div
                    key={talent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="group p-6 bg-white border-gray-100 shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-premium space-y-6 text-left">
                      <div className="flex items-center gap-4">
                        {talent.avatarUrl ? (
                          <img src={talent.avatarUrl} className="w-16 h-16 rounded-brand object-cover transition-premium" alt="" />
                        ) : (
                          <div className="w-16 h-16 bg-brand-surface rounded-brand flex items-center justify-center text-brand-primary/20">
                            <Calendar size={24} />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-bold text-brand-primary">{talent.user?.email.split('@')[0]}</h3>
                          <p className="text-sm text-text-secondary">{talent.position}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 text-left">
                        <div>
                          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Experience</div>
                          <div className="text-sm font-bold text-brand-primary">{talent.experienceYears}y</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Skill</div>
                          <div className="text-sm font-bold text-brand-accent">{talent.primarySkill}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold uppercase tracking-wider">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Available for Sessions
                      </div>

                      <div className="flex gap-4">
                        <Button 
                          variant="secondary" 
                          className="flex-1 py-3 text-sm"
                          onClick={() => talent.talentId?.talentCode && navigate(`/talent/${talent.talentId.talentCode}`)}
                        >
                          View Full Profile
                        </Button>
                        {requests.find(r => r.professionalId === talent.id && r.senderRole === 'institute') ? (
                          <Button className="flex-1 py-3 text-sm opacity-50 cursor-not-allowed uppercase" disabled>
                            {(() => {
                              const req = requests.find(r => r.professionalId === talent.id && r.senderRole === 'institute');
                              if (req.status === 'accepted') return 'Accepted';
                              if (req.status === 'rejected') return 'Declined';
                              return 'Request Sent';
                            })()}
                          </Button>
                        ) : (
                          <Button className="flex-1 py-3 text-sm" onClick={() => setBookingExpert(talent)}>Book Session</Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Exploration Mode */}
        <section className="bg-brand-surface py-24 text-left border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold text-brand-primary">Expert Directory</h2>
              <p className="text-text-secondary">Browse our full network of industry professionals.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {professionals.map((talent, i) => (
                <motion.div
                  key={`mentor-${talent.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-6 bg-white border-gray-100 shadow-sm hover:shadow-premium transition-premium space-y-6 text-left">
                    <div className="flex items-center gap-4">
                      {talent.avatarUrl ? (
                        <img src={talent.avatarUrl} className="w-16 h-16 rounded-brand object-cover transition-premium" alt="" />
                      ) : (
                        <div className="w-16 h-16 bg-brand-surface rounded-brand flex items-center justify-center text-brand-primary/20">
                          <Calendar size={20} />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-brand-primary">{talent.user?.email.split('@')[0]}</h4>
                        <p className="text-xs text-text-secondary">{talent.position} • {talent.experienceYears}y Exp</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="secondary" className="flex-1 text-xs py-2" onClick={() => talent.talentId?.talentCode && navigate(`/talent/${talent.talentId.talentCode}`)}>View Profile</Button>
                      {requests.find(r => r.professionalId === talent.id && r.senderRole === 'institute') ? (
                        <Button className="flex-1 text-xs py-2 opacity-50 cursor-not-allowed uppercase" disabled>
                          {(() => {
                            const req = requests.find(r => r.professionalId === talent.id && r.senderRole === 'institute');
                            if (req.status === 'accepted') return 'Accepted';
                            if (req.status === 'rejected') return 'Declined';
                            return 'Request Sent';
                          })()}
                        </Button>
                      ) : (
                        <Button className="flex-1 text-xs py-2" onClick={() => setBookingExpert(talent)}>Book</Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingExpert && (
          <div className="fixed inset-0 bg-brand-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-brand shadow-2xl overflow-hidden text-left"
            >
              <div className="bg-brand-primary p-8 text-white flex justify-between items-start text-left">
                <div className="space-y-1">
                  <h2 className="text-2xl font-display font-bold">Book Session</h2>
                  <p className="text-white/60 text-sm">Expert: {bookingExpert.user?.email.split('@')[0]}</p>
                </div>
                <button onClick={() => setBookingExpert(null)} className="p-2 hover:bg-white/10 rounded-full transition-premium">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Proposed Date</label>
                      <input 
                        type="date" 
                        className="w-full p-3 bg-brand-surface rounded-brand text-sm border-none focus:ring-0 cursor-pointer"
                        value={date ? new Date(date).toISOString().split('T')[0] : ''}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <Select label="Preferred Time" options={['Select Time', '10:00 AM', '01:00 PM', '04:00 PM']} />
                  </div>

                  <Input 
                    label="Message / Topic" 
                    placeholder="e.g. Invitation for Advanced Lighting Workshop" 
                    value={bookingMessage}
                    onChange={(e: any) => setBookingMessage(e.target.value)}
                  />

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Public URL / Portfolio (Optional)</label>
                    <div className="flex items-center gap-3 p-3 bg-brand-surface rounded-brand">
                      <BookOpen size={16} className="text-brand-primary" />
                      <input 
                        className="w-full bg-transparent border-none focus:ring-0 text-sm p-0"
                        placeholder="e.g. Your institute showcase or brochure link"
                        value={publicUrl}
                        onChange={(e) => setPublicUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Duration" placeholder="e.g. 2 Hours" />
                    <div className="flex flex-col justify-end">
                      <p className="text-[10px] text-text-muted italic">* Professional will review and respond.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => setBookingExpert(null)}>Cancel</Button>
                  <Button className="flex-[2]" onClick={handleBookRequest}>Send Request</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstituteDashboard;
