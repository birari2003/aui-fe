import React from 'react';
import { GraduationCap, Users, BookOpen, Star, Activity, Plus, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { View } from '../types';
import { useNavigate } from 'react-router-dom';
import { getMyInstituteProfile } from '../services/instituteServices';
import EditInstituteModal from '../components/EditInstituteModal';

const InstituteProfile = ({ setView }: { setView: (v: View) => void }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const fetchProfile = React.useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getMyInstituteProfile(token);
      if (response.ok) {
        const data = await response.json();
        setProfile(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch institute profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-12">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isProfileComplete = !!profile;
  const talentCode = profile?.user?.talentId?.talentCode;
  const displayName = profile?.instituteName || 'Institute';

  const handleViewPublicPage = () => {
    if (talentCode) {
      navigate(`/institute/${talentCode}`);
    } else {
      alert('Talent ID not generated yet. Please save your profile first.');
    }
  };

  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <EditInstituteModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile} 
        onUpdate={fetchProfile}
      />

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 text-left">
        {!isProfileComplete && (
          <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-accent shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-brand-primary">Setup Your Institute Profile</h3>
                <p className="text-sm text-text-secondary">Complete your profile to showcase your programs and attract industry experts.</p>
              </div>
            </div>
            <Button onClick={() => setIsEditModalOpen(true)} className="px-8 whitespace-nowrap shadow-sm">Complete Setup</Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
          <div className="space-y-1 text-left flex items-center gap-6">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={displayName} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
            ) : (
              <div className="w-20 h-20 bg-brand-surface rounded-2xl flex items-center justify-center text-brand-primary/20">
                <GraduationCap size={40} />
              </div>
            )}
            <div className="text-left">
              <h1 className="text-4xl font-display font-bold text-brand-primary tracking-tight text-left">{displayName} Dashboard</h1>
              <p className="text-text-secondary text-left">Manage your institute profile and educational programs.</p>
            </div>
          </div>
          <div className="flex gap-3 text-left">
            <Button 
              variant="secondary" 
              onClick={handleViewPublicPage}
              disabled={!talentCode}
              className="px-6 border border-gray-100 hover:bg-white disabled:opacity-50"
            >
              View Public Page
            </Button>
            <Button onClick={() => setIsEditModalOpen(true)} className="px-8 shadow-premium">
              {isProfileComplete ? 'Edit Institute Info' : 'Setup Profile'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { label: 'Active Programs', val: profile?.activePrograms || '0', icon: BookOpen, trend: '2 ending soon', color: 'text-brand-accent' },
            { label: 'Booked Experts', val: profile?.bookings?.length || '0', icon: Users, trend: '+4 this semester', color: 'text-brand-primary' },
            { label: 'Student Impact', val: profile?.studentCount ? `${profile.studentCount}+` : '0+', icon: Star, trend: 'Top Rated', color: 'text-orange-400' },
          ].map(stat => (
            <Card key={stat.label} className="p-8 space-y-4 text-left group hover:shadow-premium transition-premium">
              <div className="flex justify-between items-start text-left">
                <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center ${stat.color} shadow-sm border border-gray-50 text-left`}>
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
            <h2 className="text-2xl font-display font-bold text-brand-primary text-left border-b border-gray-50 pb-4">Upcoming Workshops</h2>
            <div className="space-y-4 text-left">
              {isProfileComplete && profile.bookings && profile.bookings.filter((b: any) => b.type === 'workshop').length > 0 ? (
                profile.bookings.filter((b: any) => b.type === 'workshop').map((booking: any) => (
                  <Card key={booking.id} className="p-6 flex items-center justify-between hover:border-brand-accent/30 text-left group">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary group-hover:bg-brand-accent/5 group-hover:text-brand-accent transition-colors">
                        <GraduationCap size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-brand-primary text-left">{booking.workshopTitle || 'Industry Workshop'}</p>
                        <p className="text-xs text-text-secondary text-left">by {booking.professional?.fullName || 'TBD'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-brand-accent text-left">{new Date(booking.date).toLocaleDateString()}</span>
                  </Card>
                ))
              ) : (
                <div className="p-12 bg-brand-surface/30 rounded-brand border border-dashed border-gray-200 text-center space-y-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary/20 mx-auto shadow-sm">
                    <GraduationCap size={24} />
                  </div>
                  <p className="text-sm font-medium text-text-muted">No workshops scheduled yet</p>
                </div>
              )}
            </div>
            <Button variant="ghost" className="w-full border-dashed border-2 py-6 text-text-muted hover:border-brand-accent/30 hover:bg-brand-accent/5 transition-all flex items-center justify-center gap-2" onClick={() => setView('browsing_professionals' as any)}>
              <Plus size={18} /> Book New Industry Expert
            </Button>
          </section>

          <section className="space-y-6 text-left">
            <h2 className="text-2xl font-display font-bold text-brand-primary text-left border-b border-gray-50 pb-4">Educational Activity</h2>
            <div className="space-y-4 text-left">
              {profile?.bookings?.length > 0 ? (
                profile.bookings.map((item: any) => (
                  <div key={item.id} className="p-6 bg-brand-surface rounded-brand border border-gray-50 flex items-center justify-between text-left hover:border-brand-accent/10 transition-colors">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary shadow-sm text-left">
                        <Activity size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-brand-primary text-left">
                          {item.status === 'completed' ? 'Completed' : 'New'} booking: {item.professional?.fullName}
                        </p>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest text-left">{item.type || 'booking'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-text-muted text-left">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <div className="p-12 bg-brand-surface/30 rounded-brand border border-dashed border-gray-200 text-center space-y-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary/20 mx-auto shadow-sm">
                    <Activity size={24} />
                  </div>
                  <p className="text-sm font-medium text-text-muted">No recent activity</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default InstituteProfile;
