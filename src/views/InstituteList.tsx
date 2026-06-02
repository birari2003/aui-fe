import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, GraduationCap, ArrowRight, BookOpen, X, Calendar as CalendarIcon, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { searchInstitutes } from '../services/searchServices';
import { sendCollaborationRequest, getMyCollaborationRequests, respondToCollaborationRequest } from '../services/collaborationServices';
import { createProfessionalSpecialRequest, getMySpecialRequests } from '../services/specialRequestServices';
import { getMyProfile } from '../services/professionalServices';
import { UserRole, View } from '../types';

import Input from '../components/Input';

const InstituteList = ({ setView, userRole }: { setView: (v: View) => void, userRole: UserRole | null }) => {
  const navigate = useNavigate();
  const [institutes, setInstitutes] = React.useState<any[]>([]);
  const [requests, setRequests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [proposingTo, setProposingTo] = React.useState<any | null>(null);
  const [proposalMessage, setProposalMessage] = React.useState('');
  const [publicUrl, setPublicUrl] = React.useState('');
  const [proposalDate, setProposalDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [myRequests, setMyRequests] = React.useState<any[]>([]);
  const [isSpecialModalOpen, setIsSpecialModalOpen] = React.useState(false);
  const [specialRequestForm, setSpecialRequestForm] = React.useState({
    name: '',
    publicUrl: '',
    instituteUrl: '',
    mentorshipTime: '',
    message: ''
  });
  const [profile, setProfile] = React.useState<any>(null);
  const [isSubmittingSpecial, setIsSubmittingSpecial] = React.useState(false);
  const [mySpecialRequests, setMySpecialRequests] = React.useState<any[]>([]);


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

  const fetchRequests = React.useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await getMyCollaborationRequests(token);
      if (res.ok) {
        const data = await res.json();
        setMyRequests(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  }, []);

  const fetchInstitutes = React.useCallback(async (name: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        const instRes = await searchInstitutes(token, { name });
        if (instRes.ok) {
          const instData = await instRes.json();
          setInstitutes(instData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching institutes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfile = React.useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || userRole !== 'professional') return;
    try {
      const res = await getMyProfile(token);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.data);
        setSpecialRequestForm(prev => ({
          ...prev,
          name: data.data.fullName || '',
          publicUrl: data.data.portfolioUrl || data.data.showreelUrl || ''
        }));
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }, []);

  React.useEffect(() => {
    fetchInstitutes();
    fetchRequests();
    fetchProfile();
    fetchSpecialRequests();
  }, [fetchInstitutes, fetchRequests, fetchProfile, fetchSpecialRequests]);


  const handleRespond = async (id: number, status: 'accepted' | 'rejected') => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await respondToCollaborationRequest(token, id, { status });
        if (res.ok) fetchRequests();
      }
    } catch (error) {
      console.error('Error responding to request:', error);
    }
  };

  const handleSendProposal = async () => {
    if (!proposingTo) return;
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await sendCollaborationRequest(token, {
          receiverId: proposingTo.id,
          receiverRole: 'institute',
          message: proposalMessage,
          proposedDate: proposalDate,
          publicUrl: publicUrl,
        });
        if (res.ok) {
          setProposingTo(null);
          setProposalMessage('');
          setPublicUrl('');
          fetchRequests();
        }
      }
    } catch (error) {
      console.error('Error sending proposal:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    fetchInstitutes(val);
  };

  const handleSpecialRequestSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    setIsSubmittingSpecial(true);
    try {
      const res = await createProfessionalSpecialRequest(token, {
        professionalName: specialRequestForm.name,
        professionalPublicUrl: specialRequestForm.publicUrl,
        institutePublicUrl: specialRequestForm.instituteUrl,
        mentorshipTime: specialRequestForm.mentorshipTime,
        message: specialRequestForm.message,
      });
      if (res.ok) {
        setIsSpecialModalOpen(false);
        setSpecialRequestForm({
          name: profile?.fullName || '',
          publicUrl: profile?.portfolioUrl || profile?.showreelUrl || '',
          instituteUrl: '',
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


  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <SEO 
        title="Explore Institutes" 
        description="Find top animation schools, VFX academies, and creative training centers leading the industry." 
        keywords="animation schools, design institutes, vfx academies, art education, AUI" 
      />
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 text-left">
        <div className="space-y-4 text-left">
          <h1 className="text-4xl font-display font-bold text-brand-primary tracking-tight text-left">Explore Institutes</h1>
          <p className="text-text-secondary text-left">Find top animation schools and training centers leading the industry.</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-2xl text-left">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input 
              type="text"
              placeholder="Search by name, location, or courses..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-6 py-4 bg-brand-surface rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-premium text-left"
            />
          </div>
          <Button 
            onClick={() => setIsSpecialModalOpen(true)}
            className="px-8 py-4 shadow-premium flex items-center gap-2 bg-brand-accent hover:bg-brand-accent/90"
          >
            Special Request
          </Button>
        </div>



        {/* Existing Listing */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-brand-primary text-left">Institute Directory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {loading ? (
            <div className="col-span-full py-20 text-center text-text-muted">Loading institutes...</div>
          ) : institutes.length === 0 ? (
            <div className="col-span-full py-20 text-center text-text-muted">No institutes found.</div>
          ) : institutes.map((inst, i) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-left"
            >
              <Card className="group p-8 bg-white border-gray-100 shadow-premium hover:shadow-premium-hover transition-premium flex flex-col md:flex-row gap-8 items-center text-left">
                <div className="w-32 h-32 bg-brand-surface rounded-[32px] overflow-hidden flex-shrink-0 flex items-center justify-center text-brand-primary text-left">
                  {inst.avatarUrl ? (
                    <img src={inst.avatarUrl} alt={inst.instituteName} className="w-full h-full object-cover group-hover:scale-110 transition-premium" />
                  ) : (
                    <GraduationCap size={48} className="group-hover:scale-110 transition-premium" />
                  )}
                </div>
                
                <div className="flex-1 space-y-4 text-left">
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between text-left">
                      <h3 className="text-2xl font-bold text-brand-primary text-left">{inst.instituteName}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary font-medium text-left">
                      <span className="flex items-center gap-1 text-left"><MapPin size={14} /> {inst.location || 'Global'}</span>
                      <span className="flex items-center gap-1 text-left"><BookOpen size={14} /> {inst.establishedYear || 'Verified'}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-secondary line-clamp-2 text-left">
                    {inst.description || `Leading educational institution specializing in creative arts and technology.`}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-left">
                    <div className="flex gap-2">
                       {inst.branchCount > 0 ? (
                         <Badge variant="outline" className="text-[10px] bg-brand-surface/30 border-none">{inst.branchCount} Branches</Badge>
                       ) : (
                         <Badge variant="outline" className="text-[10px] bg-brand-surface/30 border-none">Industry Leader</Badge>
                       )}
                    </div>
                    <div className="flex gap-3">
                      {myRequests.find(r => r.instituteId === inst.id && r.senderRole === 'professional') ? (
                        <Button className="text-xs py-1.5 px-4 opacity-50 cursor-not-allowed uppercase" disabled>
                          {(() => {
                            const req = myRequests.find(r => r.instituteId === inst.id && r.senderRole === 'professional');
                            if (req.status === 'accepted') return 'Accepted';
                            if (req.status === 'rejected') return 'Declined';
                            return 'Proposal Sent';
                          })()}
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="text-xs py-1.5 px-4"
                          onClick={() => inst.user?.talentId?.talentCode && navigate(`/talent/${inst.user.talentId.talentCode}`)}
                        >
                          See Profile
                        </Button>

                      )}
                    </div>

                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          </div>
        </div>

        {/* Collaboration Requests Section */}
        <div className="space-y-8 mt-12 pt-12 border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Invitations Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="text-left">
                  <h2 className="text-xl font-display font-bold text-brand-primary">Invitations Received</h2>
                  <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">From Institutes</p>
                </div>
                <Badge variant="info">
                  {myRequests.filter(r => r.senderRole === 'institute' && r.status === 'pending').length} NEW
                </Badge>
              </div>
              <div className="space-y-4">
                {myRequests.filter(r => r.senderRole === 'institute').length > 0 ? (
                  myRequests.filter(r => r.senderRole === 'institute').map((req) => (
                    <Card key={req.id} className={`p-5 space-y-4 border-l-4 ${req.status === 'accepted' ? 'border-l-emerald-500' : req.status === 'rejected' ? 'border-l-red-500' : 'border-l-brand-accent shadow-premium'}`}>
                      <div className="flex justify-between items-start text-left">
                        <div className="flex gap-3 items-center text-left">
                          <div className="w-8 h-8 bg-brand-surface rounded-lg flex items-center justify-center text-brand-primary font-bold text-xs">
                            {req.institute?.instituteName?.[0]}
                          </div>
                          <div className="text-left">
                            <h4 className="text-sm font-bold text-brand-primary">{req.institute?.instituteName}</h4>
                          </div>
                        </div>
                        <Badge variant={req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'warning' : 'warning'} className="text-[10px] py-0 px-2">
                          {req.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2 italic">"{req.message}"</p>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="ghost" 
                          className="flex-1 py-1 text-[10px] font-bold text-brand-accent hover:bg-brand-surface"
                          onClick={() => req.institute?.user?.talentId?.talentCode && navigate(`/talent/${req.institute.user.talentId.talentCode}`)}
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
                    No invitations yet.
                  </div>
                )}
              </div>
            </section>

            {/* My Proposals Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="text-left">
                  <h2 className="text-xl font-display font-bold text-brand-primary">My Proposals</h2>
                  <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Sent to Admin</p>
                </div>
              </div>
              <div className="space-y-4">
                {/* Direct Proposals */}
                {myRequests.filter(r => r.senderRole === 'professional').map((req) => (
                    <Card key={req.id} className={`p-5 space-y-4 border-l-4 ${req.status === 'accepted' ? 'border-l-emerald-500' : req.status === 'rejected' ? 'border-l-red-500' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-start text-left">
                        <div className="flex gap-3 items-center text-left">
                          <div className="w-8 h-8 bg-brand-surface rounded-lg flex items-center justify-center text-brand-primary font-bold text-xs">
                            {req.institute?.instituteName?.[0]}
                          </div>
                          <div className="text-left">
                            <h4 className="text-sm font-bold text-brand-primary">{req.institute?.instituteName}</h4>
                          </div>
                        </div>
                        <Badge variant={req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'warning' : 'warning'} className="text-[10px] py-0 px-2">
                          {req.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2 italic">"{req.message}"</p>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="ghost" 
                          className="w-full py-1 text-[10px] font-bold text-brand-accent hover:bg-brand-surface"
                          onClick={() => req.institute?.user?.talentId?.talentCode && navigate(`/talent/${req.institute.user.talentId.talentCode}`)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </Card>
                  ))}

                {/* Special Requests (Centralized) */}
                {mySpecialRequests.map((req) => (
                  <Card key={`special-${req.id}`} className={`p-5 space-y-4 border-l-4 ${req.status === 'closed' ? 'border-l-emerald-500' : req.status === 'rejected' ? 'border-l-red-500' : req.status === 'contacted' ? 'border-l-brand-accent' : 'border-gray-200 shadow-premium'}`}>
                    <div className="flex justify-between items-start text-left">
                      <div className="flex gap-3 items-center text-left">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-[10px]">
                          ADM
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-bold text-brand-primary">Sent to Admin</h4>
                          <p className="text-[10px] text-brand-accent truncate max-w-[150px]">{req.institutePublicUrl}</p>
                        </div>
                      </div>
                      <Badge variant={req.status === 'closed' ? 'success' : req.status === 'rejected' ? 'warning' : req.status === 'contacted' ? 'info' : 'warning'} className="text-[10px] py-0 px-2">
                        {req.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-2 italic">"{req.message}"</p>
                    {req.responseMessage && (
                      <div className="p-3 bg-brand-surface rounded-lg border-l-2 border-brand-accent mt-2">
                        <p className="text-[10px] font-bold text-brand-primary mb-1 flex items-center gap-1">
                          <MessageSquare size={10} /> Admin Response:
                        </p>
                        <p className="text-xs text-text-secondary italic">{req.responseMessage}</p>
                      </div>
                    )}
                  </Card>
                ))}

                {myRequests.filter(r => r.senderRole === 'professional').length === 0 && mySpecialRequests.length === 0 && (
                  <div className="py-10 text-center text-text-muted border-2 border-dashed border-gray-100 rounded-brand text-xs">
                    You haven't sent any proposals yet.
                  </div>
                )}
              </div>
            </section>
          </div>

          {myRequests.length === 0 && mySpecialRequests.length === 0 && (
            <div className="py-20 text-center text-text-muted border-2 border-dashed border-gray-100 rounded-brand max-w-xl mx-auto">
              <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-bold text-brand-primary">No Active Collaborations</h3>
              <p className="text-sm">Start by browsing the institute directory above.</p>
            </div>
          )}
        </div>

      </main>

      {/* Special Request Modal */}
      <AnimatePresence>
        {isSpecialModalOpen && (
          <div className="fixed inset-0 bg-brand-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-brand shadow-2xl overflow-hidden text-left max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="bg-brand-primary p-8 text-white flex justify-between items-start text-left sticky top-0 z-10">
                <div className="space-y-1">
                  <h2 className="text-2xl font-display font-bold">Submit Special Request</h2>
                  <p className="text-white/60 text-sm">Our team will help you connect with the institute.</p>
                </div>
                <button onClick={() => setIsSpecialModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-premium">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">Your Name</label>
                    <input 
                      className="w-full bg-brand-surface border-none rounded-xl text-sm p-4 focus:ring-2 focus:ring-brand-accent/20"
                      placeholder="Enter your full name"
                      value={specialRequestForm.name}
                      onChange={(e) => setSpecialRequestForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">Your Public URL / Portfolio</label>
                    <input 
                      className="w-full bg-brand-surface border-none rounded-xl text-sm p-4 focus:ring-2 focus:ring-brand-accent/20"
                      placeholder="e.g. YouTube or Portfolio link"
                      value={specialRequestForm.publicUrl}
                      onChange={(e) => setSpecialRequestForm(prev => ({ ...prev, publicUrl: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">Institute Public URL to Approach</label>
                  <input 
                    className="w-full bg-brand-surface border-none rounded-xl text-sm p-4 focus:ring-2 focus:ring-brand-accent/20"
                    placeholder="Link to the institute you want to approach"
                    value={specialRequestForm.instituteUrl}
                    onChange={(e) => setSpecialRequestForm(prev => ({ ...prev, instituteUrl: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">Mentorship Availability / Time</label>
                  <input 
                    className="w-full bg-brand-surface border-none rounded-xl text-sm p-4 focus:ring-2 focus:ring-brand-accent/20"
                    placeholder="e.g. Weekends, 10 AM - 12 PM"
                    value={specialRequestForm.mentorshipTime}
                    onChange={(e) => setSpecialRequestForm(prev => ({ ...prev, mentorshipTime: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">Your Message to Admin</label>
                  <textarea 
                    className="w-full bg-brand-surface border-none rounded-xl text-sm p-4 min-h-[120px] focus:ring-2 focus:ring-brand-accent/20"
                    placeholder="Explain why you'd like to collaborate with this institute..."
                    value={specialRequestForm.message}
                    onChange={(e) => setSpecialRequestForm(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => setIsSpecialModalOpen(false)}>Cancel</Button>
                  <Button 
                    className="flex-1" 
                    disabled={!specialRequestForm.name || !specialRequestForm.instituteUrl || !specialRequestForm.message || isSubmittingSpecial} 
                    loading={isSubmittingSpecial}
                    onClick={handleSpecialRequestSubmit}
                  >
                    Submit Request
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default InstituteList;
