import React from 'react';
import { motion } from 'motion/react';
import { Filter, Clock, ShieldCheck, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Select from '../components/Select';
import Badge from '../components/Badge';
import { MOCK_TALENT } from '../data/mockData';
import { View } from '../types';

const StudioDashboard = ({ setView }: { setView: (v: View) => void }) => {
  const navigate = useNavigate();
  const [role, setRole] = React.useState('');
  const [exp, setExp] = React.useState('');
  const [availability, setAvailability] = React.useState('');
  const [bench, setBench] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState<'discovery' | 'bench' | 'engagements'>('discovery');

  const toggleBench = (id: string) => {
    setBench(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredTalent = activeTab === 'bench' 
    ? MOCK_TALENT.filter(t => bench.includes(t.id))
    : MOCK_TALENT;

  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 text-left">
        {/* Sub-navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-100 pb-4 text-left">
          {[
            { id: 'discovery', label: 'Discovery' },
            { id: 'bench', label: 'My Bench' },
            { id: 'engagements', label: 'Engagements' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-premium ${
                activeTab === tab.id 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'text-text-muted hover:text-brand-primary hover:bg-brand-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Intent-First Selector */}
        {activeTab === 'discovery' && (
          <section className="bg-brand-surface rounded-brand p-8 border border-gray-100 shadow-sm text-left">
            <div className="flex flex-wrap items-center gap-4 text-2xl font-display font-bold text-brand-primary leading-tight text-left">
              <span>I am looking for a</span>
              <Select 
                options={['Select Role', 'Product Designer', 'Motion Artist', 'VFX Supervisor', 'Full Stack Engineer']} 
                value={role} 
                onChange={(e: any) => setRole(e.target.value)}
                className="min-w-[200px] bg-white border-none shadow-sm"
              />
              <span>with</span>
              <Select 
                options={['Select Exp', 'Senior (5+ years)', 'Mid (2-5 years)', 'Junior (0-2 years)']} 
                value={exp} 
                onChange={(e: any) => setExp(e.target.value)}
                className="min-w-[150px] bg-white border-none shadow-sm"
              />
              <span>experience, available</span>
              <Select 
                options={['Select Availability', 'Immediate', 'Next 2 Weeks', 'Next Month']} 
                value={availability} 
                onChange={(e: any) => setAvailability(e.target.value)}
                className="min-w-[180px] bg-white border-none shadow-sm"
              />
            </div>
          </section>
        )}

        {/* Talent Stream */}
        <section className="space-y-8 text-left">
          <div className="flex items-center justify-between text-left">
            <h2 className="text-2xl font-display font-bold text-brand-primary text-left">
              {activeTab === 'discovery' ? 'Discovery Stream' : activeTab === 'bench' ? 'Your Talent Bench' : 'Active Engagements'}
            </h2>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Filter size={16} />
              <span>Filter by Skills</span>
            </div>
          </div>

          {activeTab === 'engagements' ? (
            <div className="grid grid-cols-1 gap-6 text-left">
              <Card className="flex items-center justify-between p-8 bg-white border-gray-100 shadow-premium hover:shadow-premium-hover transition-premium text-left">
                <div className="flex items-center gap-6 text-left">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-left">
                    <Clock size={24} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-brand-primary text-left">Metaverse UI Redesign</h4>
                    <p className="text-sm text-text-secondary text-left">Talent: Alex Rivera • Started March 1, 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="success">Active</Badge>
                  <Button variant="secondary" onClick={() => setView('showcase_studio')}>View Studio Showcase</Button>
                  <Button variant="secondary">Manage</Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {filteredTalent.length > 0 ? filteredTalent.map((talent, i) => (
                <motion.div
                  key={talent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-left"
                >
                  <Card className="group p-6 bg-white border-gray-100 shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-premium flex flex-col gap-6 text-left">
                    <div className="relative aspect-square overflow-hidden rounded-brand text-left">
                      <img src={talent.avatar} className="w-full h-full object-cover transition-premium group-hover:scale-105" alt="" />
                      {talent.verified && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center border-2 border-white shadow-lg text-left">
                          <ShieldCheck size={16} className="text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 text-left">
                        <Badge variant="success" className="bg-white/90 backdrop-blur-sm border-none shadow-sm">Available Now</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4 text-left">
                      <div className="space-y-1 text-left">
                        <div className="flex items-center justify-between text-left">
                          <h4 className="text-xl font-bold text-brand-primary leading-tight text-left">{talent.name}</h4>
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{talent.id}</span>
                        </div>
                        <p className="text-sm font-medium text-text-secondary text-left">{talent.role} • {talent.exp} Exp</p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-left">
                        {talent.skills?.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="outline" className="text-[9px] font-bold uppercase tracking-wider border-gray-100 bg-brand-surface/30">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-left">
                        <div className="space-y-1 text-left">
                          <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted text-left">Confidence</div>
                          <div className="text-sm font-bold text-brand-primary text-left">{talent.confidence.experience}%</div>
                        </div>
                        <div className="flex gap-2 text-left">
                          <Button variant="secondary" className="p-2 h-10 w-10 text-left" onClick={() => toggleBench(talent.id)}>
                            <Star size={18} className={bench.includes(talent.id) ? 'fill-brand-accent text-brand-accent' : 'text-text-muted'} />
                          </Button>
                          <Button variant="secondary" className="h-10 px-4 text-left" onClick={() => setView('talent_id')}>Profile</Button>
                        </div>
                      </div>
                      
                      <Button className="w-full h-12">Hire Talent</Button>
                    </div>
                  </Card>
                </motion.div>
              )) : (
                <div className="py-20 text-center space-y-4 bg-brand-surface rounded-brand border border-dashed border-gray-200 col-span-full">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-premium group-hover:scale-110 transition-premium">
                    <Star size={32} className="text-text-muted group-hover:text-brand-accent transition-premium" />
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-xl font-bold text-brand-primary">Your bench is empty</p>
                    <p className="text-text-secondary max-w-xs mx-auto">Save talent from the discovery stream to build your dream production team.</p>
                  </div>
                  <Button variant="secondary" className="px-8" onClick={() => setActiveTab('discovery')}>Go to Discovery</Button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default StudioDashboard;
