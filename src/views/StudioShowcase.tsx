import React from 'react';
import { ArrowLeft, Share2, MapPin, Play, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ShareModal from '../components/ShareModal';
import { MOCK_STUDIOS } from '../data/mockData';
import { View } from '../types';
import { useParams } from 'react-router-dom';

const StudioShowcase = ({ setView }: { setView: (v: View) => void }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const studio = MOCK_STUDIOS.find(s => s.id === id) || MOCK_STUDIOS[0];
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const shareUrl = `${window.location.origin}/studio/${studio.id}`;
  const shareMessage = `We are building high-quality animation projects through AUI.\n\nStudio: ${studio.name}\n\nExplore our work and opportunities: ${shareUrl}`;

  const opportunities = [
    { role: "Senior Animator", exp: "5+ Years", date: "Immediate", type: "Full-time" },
    { role: "Lighting Lead", exp: "8+ Years", date: "Jan 2026", type: "Contract" },
  ];

  const projects = [
    { name: "Project Chronos", type: "Feature Film", role: "Main Animation Studio" },
    { name: "Neon Nights", type: "Series", role: "VFX & Compositing" },
    { name: "The Lost City", type: "Game Cinematic", role: "Character Design" },
  ];

  return (
    <div className="min-h-screen bg-brand-primary text-white no-scrollbar text-left">
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        title="Share Studio Showcase"
        subtitle="Invite others to explore this studio's work."
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
      <section className="relative h-screen flex items-center overflow-hidden text-left">
        <div className="absolute inset-0 text-left">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40 scale-105"
            alt="Studio Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/60 via-brand-primary/40 to-brand-primary text-left" />
        </div>
        
        <div className="relative w-full max-w-7xl mx-auto px-6 space-y-12 text-left">
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-4 text-left">
              <Badge variant="success" className="bg-emerald-500 text-white border-none">Verified Studio</Badge>
              <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                <MapPin size={14} /> {studio.location}
              </div>
            </div>
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-left">{studio.name}</h1>
            <p className="text-2xl md:text-3xl text-white/70 max-w-3xl font-light leading-snug text-left text-left">
              "Producing high-quality animation for global projects"
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-left">
            <Button variant="secondary" className="border-none px-12 py-7 text-xl font-bold">
              View Work
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-12 py-7 text-xl font-bold">
              Explore Opportunities
            </Button>
          </div>

          <div className="flex gap-16 pt-12 border-t border-white/10 text-left">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-bold mb-2">Type</p>
              <p className="text-xl font-bold">{studio.type}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-bold mb-2">Team Size</p>
              <p className="text-xl font-bold">{studio.size}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-bold mb-2">Projects</p>
              <p className="text-xl font-bold">45+ Global</p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Reel */}
      <section className="py-32 bg-black text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-16 text-left">
          <div className="flex justify-between items-end text-left">
            <div className="space-y-4 text-left">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-accent">Studio Reel</h2>
              <p className="text-5xl font-bold">The {studio.name.split(' ')[0]} Standard</p>
            </div>
          </div>
          <div className="aspect-video rounded-[48px] overflow-hidden border border-white/5 shadow-2xl bg-brand-primary relative group">
            <img 
              src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
              alt="Studio Reel"
            />
            <div className="absolute inset-0 flex items-center justify-center text-left">
              <button className="w-28 h-28 bg-white text-brand-primary rounded-full flex items-center justify-center hover:scale-110 transition-premium shadow-2xl text-left">
                <Play size={44} fill="currentColor" />
              </button>
            </div>
            <div className="absolute bottom-12 left-12 p-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-1">Now Playing</p>
              <p className="text-lg font-bold">2025 Production Showcase</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Studio */}
      <section className="py-32 max-w-7xl mx-auto px-6 text-left">
        <div className="max-w-4xl space-y-12 text-left">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-accent">The Studio</h2>
          <p className="text-4xl md:text-5xl font-light leading-tight text-white/90 text-left">
            {studio.about}
          </p>
        </div>
      </section>

      {/* Project Showcase */}
      <section className="py-32 bg-white text-brand-primary text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-20 text-left">
          <div className="flex justify-between items-end text-left">
            <div className="space-y-4 text-left">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-accent">Project Showcase</h2>
              <p className="text-5xl font-bold">Recent Works</p>
            </div>
            <Button variant="secondary" className="border-brand-primary/10 text-brand-primary">
              View All Projects
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {projects.map((p, i) => (
              <div key={i} className="group cursor-pointer space-y-6 text-left">
                <div className="aspect-[4/3] rounded-[32px] overflow-hidden bg-gray-100 relative text-left">
                  <img 
                    src={`https://picsum.photos/seed/${p.name}/800/600`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={p.name}
                  />
                  <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="space-y-2 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">{p.type}</p>
                  <h4 className="text-2xl font-bold">{p.name}</h4>
                  <p className="text-sm text-text-secondary font-medium">{p.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-32 max-w-7xl mx-auto px-6 space-y-20 text-left">
        <div className="space-y-4 text-left">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-accent">Open Opportunities</h2>
          <p className="text-5xl font-bold">Join the {studio.name.split(' ')[0]} Team</p>
        </div>
        <div className="grid gap-6 text-left">
          {opportunities.map((o, i) => (
            <div key={i} className="p-10 bg-white/5 rounded-[32px] border border-white/10 hover:border-brand-accent transition-premium flex flex-col md:flex-row items-center justify-between group text-left">
              <div className="flex items-center gap-12 text-left">
                <div className="w-16 h-16 bg-brand-accent/20 rounded-2xl flex items-center justify-center text-brand-accent text-left">
                  <Briefcase size={28} />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="text-2xl font-bold group-hover:text-brand-accent transition-colors text-left">{o.role}</h4>
                  <div className="flex items-center gap-4 text-white/50 text-sm font-medium text-left">
                    <span>{o.exp}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                    <span>{o.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8 mt-6 md:mt-0 text-left">
                <div className="text-right text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">Start Date</p>
                  <p className="text-lg font-bold">{o.date}</p>
                </div>
                <Button variant="secondary" className="px-10 py-5 border-none font-bold">
                  Apply Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Culture & Clients */}
      <section className="py-32 bg-gray-50 text-brand-primary text-left text-left">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-32 text-left">
          <div className="space-y-12 text-left">
            <div className="space-y-4 text-left">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-accent">Our Culture</h2>
              <p className="text-4xl font-bold">Production-Driven Excellence</p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-left text-left">
              {["Collaborative", "Production-driven", "Growth-focused", "Artist-first"].map((c, i) => (
                <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 font-bold text-lg text-left">
                  {c}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-12 text-left text-left">
            <div className="space-y-4 text-left">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-accent">Collaborations</h2>
              <p className="text-4xl font-bold">Trusted by Global Giants</p>
            </div>
            <div className="grid grid-cols-3 gap-12 opacity-40 grayscale text-left">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-12 bg-gray-300 rounded-lg text-left" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-40 bg-brand-primary text-white text-center relative overflow-hidden text-left">
        <div className="absolute inset-0 bg-brand-accent/5 text-left" />
        <div className="relative max-w-3xl mx-auto px-6 space-y-12 text-left">
          <h2 className="text-6xl font-bold tracking-tight text-center">Let's build something extraordinary.</h2>
          <div className="flex justify-center">
            <Button variant="secondary" className="border-none px-16 py-8 text-2xl font-bold rounded-full">
              Get in Touch
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudioShowcase;
