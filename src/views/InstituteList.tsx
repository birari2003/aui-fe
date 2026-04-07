import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, GraduationCap, ArrowRight, BookOpen, X, Calendar as CalendarIcon, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { searchInstitutes } from '../services/searchServices';
import { sendCollaborationRequest, getMyCollaborationRequests, respondToCollaborationRequest } from '../services/collaborationServices';
import { View } from '../types';
import Input from '../components/Input';

const InstituteList = ({ setView }: { setView: (v: View) => void }) => {
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

  React.useEffect(() => {
    fetchInstitutes();
    fetchRequests();
  }, [fetchInstitutes, fetchRequests]);

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

  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 text-left">
        <div className="space-y-4 text-left">
          <h1 className="text-4xl font-display font-bold text-brand-primary tracking-tight text-left">Explore Institutes</h1>
          <p className="text-text-secondary text-left">Find top animation schools and training centers leading the industry.</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl text-left">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input 
            type="text"
            placeholder="Search by name, location, or courses..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-6 py-4 bg-brand-surface rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-premium text-left"
          />
        </div>

        {/* Collaboration Requests Section */}
        <div className="space-y-8">
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
                          onClick={() => req.institute?.talentId?.talentCode && navigate(`/institute/${req.institute.talentId.talentCode}`)}
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
                  <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Sent to Institutes</p>
                </div>
              </div>
              <div className="space-y-4">
                {myRequests.filter(r => r.senderRole === 'professional').length > 0 ? (
                  myRequests.filter(r => r.senderRole === 'professional').map((req) => (
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
                          onClick={() => req.institute?.talentId?.talentCode && navigate(`/institute/${req.institute.talentId.talentCode}`)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="py-10 text-center text-text-muted border-2 border-dashed border-gray-100 rounded-brand text-xs">
                    You haven't sent any proposals yet.
                  </div>
                )}
              </div>
            </section>
          </div>

          {myRequests.length === 0 && (
            <div className="py-20 text-center text-text-muted border-2 border-dashed border-gray-100 rounded-brand max-w-xl mx-auto">
              <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-bold text-brand-primary">No Active Collaborations</h3>
              <p className="text-sm">Start by browsing the institute directory below.</p>
            </div>
          )}
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
                          onClick={() => setProposingTo(inst)}
                        >
                          Propose Workshop
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        className="text-brand-accent font-bold gap-2 p-0 hover:bg-transparent"
                        onClick={() => inst.talentId?.talentCode && navigate(`/institute/${inst.talentId.talentCode}`)}
                      >
                        View Showcase <ArrowRight size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          </div>
        </div>
      </main>

      {/* Proposal Modal */}
      <AnimatePresence>
        {proposingTo && (
          <div className="fixed inset-0 bg-brand-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-brand shadow-2xl overflow-hidden text-left"
            >
              <div className="bg-brand-primary p-8 text-white flex justify-between items-start text-left">
                <div className="space-y-1">
                  <h2 className="text-2xl font-display font-bold">Propose Mentorship</h2>
                  <p className="text-white/60 text-sm">To: {proposingTo.instituteName}</p>
                </div>
                <button onClick={() => setProposingTo(null)} className="p-2 hover:bg-white/10 rounded-full transition-premium">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 space-y-6 text-left">
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3 p-4 bg-brand-surface rounded-brand text-left">
                    <MessageSquare size={18} className="text-brand-primary mt-1" />
                    <div className="flex-1 text-left">
                      <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">Your Proposal Message</p>
                      <textarea 
                        className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 min-h-[80px] text-left"
                        placeholder="Explain how you can help this institute..."
                        value={proposalMessage}
                        onChange={(e) => setProposalMessage(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-brand-surface rounded-brand text-left">
                    <BookOpen size={18} className="text-brand-primary" />
                    <div className="flex-1 text-left">
                      <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">Public URL / Portfolio</p>
                      <input 
                        className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 text-left"
                        placeholder="e.g. YouTube or Portfolio link"
                        value={publicUrl}
                        onChange={(e) => setPublicUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-brand-surface rounded-brand text-left">
                    <CalendarIcon size={18} className="text-brand-primary" />
                    <div className="flex-1 flex items-center justify-between text-left">
                      <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Proposed Date</span>
                      <input 
                        type="date" 
                        className="bg-transparent border-none focus:ring-0 text-sm text-right cursor-pointer"
                        value={proposalDate}
                        onChange={(e) => setProposalDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => setProposingTo(null)}>Cancel</Button>
                  <Button className="flex-1" disabled={!proposalMessage} onClick={handleSendProposal}>Submit Proposal</Button>
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
