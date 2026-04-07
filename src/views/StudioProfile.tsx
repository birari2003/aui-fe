import React from 'react';
import { Briefcase, Users, MessageSquare, ShieldCheck, Activity } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { View } from '../types';

const StudioProfile = ({ setView }: { setView: (v: View) => void }) => {
  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
          <div className="space-y-1 text-left">
            <h1 className="text-4xl font-display font-bold text-brand-primary tracking-tight text-left">Studio Dashboard</h1>
            <p className="text-text-secondary text-left">Manage your studio profile and hiring activity.</p>
          </div>
          <div className="flex gap-3 text-left">
            <Button variant="secondary" onClick={() => {}}>View Public Page</Button>
            <Button onClick={() => {}}>Edit Studio Info</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { label: 'Active Hires', val: '12', icon: Users, trend: '+3 this month' },
            { label: 'Open Roles', val: '5', icon: Briefcase, trend: '2 urgent' },
            { label: 'Talent Inquiries', val: '24', icon: MessageSquare, trend: '+18%' },
          ].map(stat => (
            <Card key={stat.label} className="p-8 space-y-4 text-left">
              <div className="flex justify-between items-start text-left">
                <div className="w-12 h-12 bg-brand-surface rounded-xl flex items-center justify-center text-brand-accent text-left">
                  <stat.icon size={24} />
                </div>
                <Badge variant="info">{stat.trend}</Badge>
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
            <h2 className="text-2xl font-display font-bold text-brand-primary text-left">Current Production Team</h2>
            <div className="space-y-4 text-left">
              {[
                { name: 'Alex Rivera', role: 'Senior Animator', status: 'Active' },
                { name: 'Sarah Chen', role: 'VFX Compositor', status: 'On Bench' },
              ].map((member, i) => (
                <Card key={i} className="p-6 flex items-center justify-between hover:border-brand-accent/30 text-left">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-brand-surface rounded-full flex items-center justify-center text-text-muted text-left uppercase font-bold">
                      {member.name[0]}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-brand-primary text-left">{member.name}</p>
                      <p className="text-xs text-text-secondary text-left">{member.role}</p>
                    </div>
                  </div>
                  <Badge variant={member.status === 'Active' ? 'success' : 'info'}>{member.status}</Badge>
                </Card>
              ))}
            </div>
            <Button variant="ghost" className="w-full border-dashed border-2 py-6 text-text-muted" onClick={() => setView('dashboard_studio' as any)}>
              + View Talent to Hire
            </Button>
          </section>

          <section className="space-y-6 text-left">
            <h2 className="text-2xl font-display font-bold text-brand-primary text-left">Studio Activity</h2>
            <div className="space-y-4 text-left">
              {[
                { activity: 'Hired Marcus Thorne', date: '2 days ago', type: 'hiring' },
                { activity: 'Updated Studio Reel', date: '1 week ago', type: 'profile' },
                { activity: 'Verification Renewed', date: '2 weeks ago', type: 'system' },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-brand-surface rounded-brand border border-gray-50 flex items-center justify-between text-left">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary text-left shadow-sm">
                      <Activity size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-brand-primary text-left">{item.activity}</p>
                      <p className="text-[10px] text-text-secondary uppercase tracking-widest text-left">{item.type}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-text-muted text-left">{item.date}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudioProfile;
