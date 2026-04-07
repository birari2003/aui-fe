import React from 'react';
import { GraduationCap, Users, BookOpen, Star, Activity } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { View } from '../types';

const InstituteProfile = ({ setView }: { setView: (v: View) => void }) => {
  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
          <div className="space-y-1 text-left">
            <h1 className="text-4xl font-display font-bold text-brand-primary tracking-tight text-left">Institute Dashboard</h1>
            <p className="text-text-secondary text-left">Manage your institute profile and educational programs.</p>
          </div>
          <div className="flex gap-3 text-left">
            <Button variant="secondary" onClick={() => {}}>View Public Page</Button>
            <Button onClick={() => {}}>Edit Institute Info</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { label: 'Active Programs', val: '4', icon: BookOpen, trend: '2 ending soon' },
            { label: 'Booked Experts', val: '15', icon: Users, trend: '+4 this semester' },
            { label: 'Student Impact', val: '450+', icon: Star, trend: 'Top Rated' },
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
            <h2 className="text-2xl font-display font-bold text-brand-primary text-left">Upcoming Workshops</h2>
            <div className="space-y-4 text-left">
              {[
                { name: 'Character Design 101', expert: 'Alex Rivera', date: 'April 15, 2026' },
                { name: 'Lighting Masterclass', expert: 'Sarah Chen', date: 'May 02, 2026' },
              ].map((workshop, i) => (
                <Card key={i} className="p-6 flex items-center justify-between hover:border-brand-accent/30 text-left">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary text-left">
                      <GraduationCap size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-brand-primary text-left">{workshop.name}</p>
                      <p className="text-xs text-text-secondary text-left">by {workshop.expert}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-accent text-left">{workshop.date}</span>
                </Card>
              ))}
            </div>
            <Button variant="ghost" className="w-full border-dashed border-2 py-6 text-text-muted" onClick={() => setView('dashboard_institute' as any)}>
              + Book New Industry Expert
            </Button>
          </section>

          <section className="space-y-6 text-left">
            <h2 className="text-2xl font-display font-bold text-brand-primary text-left">Educational Activity</h2>
            <div className="space-y-4 text-left">
              {[
                { activity: 'Booked Sarah Chen', date: '1 day ago', type: 'booking' },
                { activity: 'Updated Course List', date: '4 days ago', type: 'curriculum' },
                { activity: 'Student Feedback Received', date: '1 week ago', type: 'feedback' },
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

export default InstituteProfile;
