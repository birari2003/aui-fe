import React from 'react';
import { ArrowLeft, Share2, MapPin, Play, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ShareModal from '../components/ShareModal';
import { MOCK_INSTITUTES } from '../data/mockData';
import { View } from '../types';
import { useParams } from 'react-router-dom';

const InstituteShowcase = ({ setView }: { setView: (v: View) => void }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const institute = MOCK_INSTITUTES.find(i => i.id === id) || MOCK_INSTITUTES[0];
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const shareUrl = `${window.location.origin}/institute/${institute.id}`;
  const shareMessage = `We bring real industry professionals into our classroom through AUI.\n\nUpcoming workshop: ${institute.workshops[0].topic} with ${institute.workshops[0].mentor}\n\nJoin us: ${shareUrl}`;

  const pastSessions = [
    { mentor: "Elena Rossi", topic: "Visual Storytelling", date: "Sept 2025" },
    { mentor: "David Wu", topic: "VFX Compositing", date: "Aug 2025" },
  ];

  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        title="Share Institute Showcase"
        subtitle="Invite others to join our industry-led workshops."
        shareUrl={shareUrl}
        shareMessage={shareMessage}
      />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none text-left">
        <button 
          onClick={() => navigate(-1)}
          className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-premium pointer-events-auto"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          onClick={() => setIsShareModalOpen(true)}
          className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-premium pointer-events-auto"
        >
          <Share2 size={24} />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-end overflow-hidden bg-brand-primary text-left">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Institute Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/20 to-transparent" />
        
        <div className="relative w-full max-w-7xl mx-auto px-6 pb-20 space-y-8 text-left">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4 text-left">
              <Badge variant="info" className="bg-brand-accent text-white border-none">Top Rated Institute</Badge>
              <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                <MapPin size={14} /> {institute.location}
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight">{institute.name}</h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl font-medium italic serif text-left">
              "Training artists for real production pipelines"
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-left">
            <Button variant="secondary" className="border-none px-10 py-6 text-lg">
              Book Industry Expert
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-10 py-6 text-lg">
              View Workshops
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-12 pt-12 border-t border-white/10 max-w-3xl text-left">
            <div>
              <p className="text-3xl font-bold text-white">{institute.students}+</p>
              <p className="text-xs uppercase tracking-widest text-white/50 font-bold">Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{institute.courses.length}</p>
              <p className="text-xs uppercase tracking-widest text-white/50 font-bold">Courses</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">92%</p>
              <p className="text-xs uppercase tracking-widest text-white/50 font-bold">Placement</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-left">
        <div className="max-w-3xl text-left">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-accent mb-8">The Vision</h2>
          <p className="text-3xl md:text-4xl font-medium text-brand-primary leading-tight text-left">
            {institute.about}
          </p>
        </div>
      </section>

      {/* Featured Reel */}
      <section className="bg-brand-primary py-32 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-16 text-left">
          <div className="flex justify-between items-end text-left text-left">
            <div className="space-y-4 text-left">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-accent">Featured Reel</h2>
              <p className="text-4xl font-bold text-white">Industry Exposure in Action</p>
            </div>
          </div>
          <div className="aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-black relative group text-left">
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
              alt="Reel Thumbnail"
            />
            <div className="absolute inset-0 flex items-center justify-center text-left">
              <button className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:scale-110 transition-premium text-left">
                <Play size={40} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Workshops */}
      <section className="py-32 max-w-7xl mx-auto px-6 space-y-16 text-left">
        <div className="space-y-4 text-left">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-accent">Upcoming Workshops</h2>
          <p className="text-4xl font-bold text-brand-primary">Learn from the Best</p>
        </div>
        <div className="grid gap-6 text-left">
          {institute.workshops.map((w, i) => (
            <div key={i} className="group flex flex-col md:flex-row items-center justify-between p-10 bg-gray-50 rounded-[32px] border border-gray-100 hover:border-brand-accent transition-premium cursor-pointer text-left">
              <div className="flex items-center gap-12 text-left">
                <div className="text-center text-left">
                  <p className="text-3xl font-bold text-brand-primary">{w.date.split(' ')[1]}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-accent">{w.date.split(' ')[0]}</p>
                </div>
                <div className="h-12 w-px bg-gray-200" />
                <div className="space-y-1 text-left text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">{w.mentor}</p>
                  <h4 className="text-2xl font-bold text-brand-primary">{w.topic}</h4>
                </div>
              </div>
              <div className="flex items-center gap-8 mt-6 md:mt-0 text-left">
                <p className="text-sm font-medium text-text-muted">{w.status}</p>
                <Button className="px-8 py-4 bg-brand-primary text-white hover:bg-brand-accent border-none">
                  Book Seat
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Sessions */}
      <section className="py-32 bg-gray-50 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-16 text-left">
          <div className="space-y-4 text-left">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-accent">Past Industry Sessions</h2>
            <p className="text-4xl font-bold text-brand-primary">Proven Track Record</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {pastSessions.map((s, i) => (
              <div key={i} className="p-8 bg-white rounded-[24px] border border-gray-100 flex items-center justify-between text-left">
                <div className="space-y-1 text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-accent">{s.mentor}</p>
                  <h4 className="text-xl font-bold text-brand-primary">{s.topic}</h4>
                </div>
                <p className="text-sm font-medium text-text-secondary">{s.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Outcomes */}
      <section className="py-32 max-w-7xl mx-auto px-6 text-left">
        <div className="grid md:grid-cols-2 gap-20 items-center text-left">
          <div className="space-y-12 text-left">
            <div className="space-y-4 text-left">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-accent">Student Outcomes</h2>
              <p className="text-5xl font-bold text-brand-primary leading-tight text-left">Real Results for Real Careers</p>
            </div>
            <div className="space-y-8 text-left">
              {[
                "Students placed in top global studios (Disney, MPC, DNEG)",
                "Projects completed for real production pipelines",
                "Direct mentorship from industry veterans"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 text-left">
                  <div className="mt-1 p-1 bg-brand-accent/10 rounded-full text-brand-accent text-left">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-xl text-text-secondary font-medium text-left">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800" className="rounded-[32px] aspect-square object-cover" alt="" />
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" className="rounded-[32px] aspect-square object-cover mt-12" alt="" />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 bg-brand-primary text-white text-center text-left">
        <div className="max-w-3xl mx-auto px-6 space-y-12 text-left text-center">
          <h2 className="text-5xl font-bold tracking-tight text-center">Ready to start your journey?</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Button variant="secondary" className="border-none px-12 py-6 text-lg">
              Apply Now
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-12 py-6 text-lg">
              Contact Admissions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InstituteShowcase;
