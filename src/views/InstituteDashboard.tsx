import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Select from '../components/Select';
import Input from '../components/Input';
import Badge from '../components/Badge';
import { MOCK_TALENT } from '../data/mockData';
import { View, Talent } from '../types';

const InstituteDashboard = ({ setView }: { setView: (v: View) => void }) => {
  const navigate = useNavigate();
  const [intent, setIntent] = React.useState('');
  const [date, setDate] = React.useState('');
  const [type, setType] = React.useState('');
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [bookingExpert, setBookingExpert] = React.useState<Talent | null>(null);

  const handleSearch = () => {
    if (intent && date && type) {
      setShowResults(true);
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
                    <span className={date ? 'text-brand-primary font-medium' : 'text-text-muted'}>{date || 'Select Date'}</span>
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
                              onClick={() => { setDate(`${d} March 2026`); setShowCalendar(false); }}
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
                {MOCK_TALENT.slice(0, 3).map((talent, i) => (
                  <motion.div
                    key={talent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="group p-6 bg-white border-gray-100 shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-premium space-y-6 text-left">
                      <div className="flex items-center gap-4">
                        <img src={talent.avatar} className="w-16 h-16 rounded-brand object-cover transition-premium" alt="" />
                        <div>
                          <h3 className="text-lg font-bold text-brand-primary">{talent.name}</h3>
                          <p className="text-sm text-text-secondary">{talent.role}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 text-left">
                        <div>
                          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Experience</div>
                          <div className="text-sm font-bold text-brand-primary">{talent.exp}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Confidence</div>
                          <div className="text-sm font-bold text-brand-accent">{talent.confidence.experience}%</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold uppercase tracking-wider">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Available on {date.split(' ')[0] || 'Selected'}nd
                      </div>

                      <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={() => setView('talent_id')}>View Profile</Button>
                        <Button className="flex-1" onClick={() => setBookingExpert(talent)}>Book</Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Exploration Mode */}
        <section className="bg-brand-surface py-24 text-left">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold text-brand-primary">Explore All Mentors</h2>
              <p className="text-text-secondary">Browse our full network of industry professionals.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MOCK_TALENT.map((talent, i) => (
                <motion.div
                  key={`mentor-${talent.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-6 bg-white border-gray-100 shadow-sm hover:shadow-premium transition-premium space-y-6 text-left">
                    <div className="flex items-center gap-4">
                      <img src={talent.avatar} className="w-16 h-16 rounded-brand object-cover transition-premium" alt="" />
                      <div>
                        <h4 className="font-bold text-brand-primary">{talent.name}</h4>
                        <p className="text-xs text-text-secondary">{talent.role} • {talent.exp} Exp</p>
                      </div>
                    </div>
                    <Button variant="secondary" className="w-full text-xs py-2" onClick={() => setView('talent_id')}>View Profile</Button>
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
                  <p className="text-white/60 text-sm">Expert: {bookingExpert.name}</p>
                </div>
                <button onClick={() => setBookingExpert(null)} className="p-2 hover:bg-white/10 rounded-full transition-premium">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Date" value={date} disabled className="bg-brand-surface" />
                  <Select label="Time" options={['Select Time', '10:00 AM', '01:00 PM', '04:00 PM']} />
                </div>
                <Input label="Topic" placeholder="e.g. Advanced Lighting Techniques" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Duration" placeholder="e.g. 2 Hours" />
                  <Input label="No. of Students" placeholder="e.g. 25" />
                </div>
                <div className="pt-4 flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => setBookingExpert(null)}>Cancel</Button>
                  <Button className="flex-[2]" onClick={() => setView('showcase_institute')}>View Institute Showcase</Button>
                  <Button className="flex-[2]" onClick={() => setBookingExpert(null)}>Confirm Booking Request</Button>
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
