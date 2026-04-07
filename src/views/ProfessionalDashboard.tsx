import React from 'react';
import { Users, MessageSquare, ShieldCheck, Briefcase, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { MOCK_TALENT } from '../data/mockData';
import { View } from '../types';
import { useNavigate } from 'react-router-dom';

const ProfessionalDashboard = ({ setView }: { setView: (v: View) => void }) => {
  const navigate = useNavigate();
  const talent = MOCK_TALENT[0];
  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
          <div className="space-y-1 text-left">
            <h1 className="text-4xl font-display font-bold text-brand-primary tracking-tight text-left">Welcome back, {talent.name.split(' ')[0]}</h1>
            <p className="text-text-secondary text-left">Your professional identity is verified and active.</p>
          </div>
          <div className="flex gap-3 text-left">
            <Button variant="secondary" onClick={() => setView('talent_id')}>View Public Profile</Button>
            <Button onClick={() => {}}>Edit Profile</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { label: 'Profile Views', val: '1,240', icon: Users, trend: '+12%' },
            { label: 'Project Inquiries', val: '8', icon: MessageSquare, trend: '+2' },
            { label: 'Confidence Score', val: '98%', icon: ShieldCheck, trend: 'Top 1%' },
          ].map(stat => (
            <Card key={stat.label} className="p-8 space-y-4 text-left">
              <div className="flex justify-between items-start text-left">
                <div className="w-12 h-12 bg-brand-surface rounded-xl flex items-center justify-center text-brand-accent text-left">
                  <stat.icon size={24} />
                </div>
                <Badge variant="success">{stat.trend}</Badge>
              </div>
              <div className="text-left">
                <p className="text-3xl font-bold text-brand-primary text-left">{stat.val}</p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-left">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
          <section className="space-y-6 text-left">
            <h2 className="text-2xl font-display font-bold text-brand-primary text-left">Active Opportunities</h2>
            <div className="space-y-4 text-left">
              {[
                { studio: 'Mumbai Animation Studio', role: 'Character Animator', type: 'Feature Film', pay: 'Premium' },
                { studio: 'VFX Global', role: 'Lighting Lead', type: 'Commercial', pay: 'Industry Std' },
              ].map((opp, i) => (
                <Card key={i} className="p-6 flex items-center justify-between hover:border-brand-accent/30 text-left">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-brand-surface rounded-xl flex items-center justify-center text-text-muted text-left">
                      <Briefcase size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-brand-primary text-left">{opp.role}</p>
                      <p className="text-xs text-text-secondary text-left">{opp.studio} • {opp.type}</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="text-xs">View</Button>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-6 text-left">
            <h2 className="text-2xl font-display font-bold text-brand-primary text-left">Recent Ledger Activity</h2>
            <div className="space-y-4 text-left">
              {talent.ledger.map(entry => (
                <div key={entry.id} className="p-6 bg-brand-surface rounded-brand border border-gray-50 flex items-center justify-between text-left">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 text-left">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-brand-primary text-left">{entry.project}</p>
                      <p className="text-[10px] text-text-secondary uppercase tracking-widest text-left">{entry.org} • {entry.status}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-text-muted text-left">{entry.date}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalDashboard;
