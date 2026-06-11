import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowLeft, Map, Home, LogIn, UserPlus, Users, Briefcase, School, Scale, Shield, Mail } from 'lucide-react';
import Card from '../components/Card';

const SitemapPage = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Main Portal",
      description: "Access our platform services and user account flows.",
      links: [
        { name: "Home Page", path: "/", icon: Home, desc: "AUI Talent home and overview." },
        { name: "Login", path: "/login", icon: LogIn, desc: "Sign in to your professional dashboard." },
        { name: "Register", path: "/register", icon: UserPlus, desc: "Join AUI Talent as professional, studio, or institute." }
      ]
    },
    {
      title: "Talent Directories",
      description: "Discover verified studios and education institutes.",
      links: [
        { name: "Studios Directory", path: "/studios", icon: Users, desc: "Browse creative studios on the network." },
        { name: "Institutes Directory", path: "/institutes", icon: School, desc: "Discover active academic partners and schools." }
      ]
    },
    {
      title: "Hiring & Expert Networks",
      description: "Find active jobs, engagements, and mentorship workshops.",
      links: [
        { name: "Hire Talent", path: "/hire", icon: Briefcase, desc: "Browse professionals, portfolios, and active roles." },
        { name: "Browse Experts", path: "/experts", icon: Users, desc: "Explore industry mentors and public profiles." }
      ]
    },
    {
      title: "Legal & Support",
      description: "Read our rules, privacy policy, and get assistance.",
      links: [
        { name: "Terms of Use", path: "/terms", icon: Scale, desc: "Platform usage rules and agreement." },
        { name: "Privacy Policy", path: "/privacy", icon: Shield, desc: "Data privacy practices and policies." },
        { name: "Contact Support", path: "/contact", icon: Mail, desc: "Get in touch with AUI departments." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-left pb-24">
      <SEO 
        title="Sitemap - AUI Talent" 
        description="Navigate the AUI Talent directory. Access public profiles, partner directories, legal policies, and platform features."
        keywords="sitemap, directory, AUI pages, site index"
      />
      
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-brand-surface to-brand-bg py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-text-muted hover:text-brand-accent transition-premium text-sm font-bold uppercase tracking-wider mb-8"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent">
              <Map size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Navigation Directory</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary tracking-tight">Website Sitemap</h1>
            </div>
          </div>
          <p className="text-text-secondary text-lg mt-4 max-w-xl leading-relaxed">
            Find and explore all pages, directories, and policies on the AUI network.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-brand-primary">{cat.title}</h2>
              <p className="text-sm text-text-muted mt-1">{cat.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.links.map((link, lIdx) => (
                <Card key={lIdx} className="p-6 bg-white border border-gray-100 shadow-premium hover:shadow-premium-hover transition-premium flex flex-col justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-accent shrink-0">
                      <link.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-brand-primary">
                        <Link to={link.path} className="hover:text-brand-accent transition-colors">
                          {link.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        {link.desc}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end">
                    <Link to={link.path} className="text-xs font-black text-brand-accent hover:text-brand-accent-hover transition-premium uppercase tracking-wider">
                      Go to Page &rarr;
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Footer Info Box */}
        <div className="mt-12 p-8 bg-brand-surface/40 border border-gray-100 rounded-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2">
            <img 
              src="/assets/logo_blck.png" 
              className="w-8 h-8 rounded-[10px] object-cover" 
              alt="AUI Logo" 
            />
            <span className="text-xl font-bold tracking-tight text-brand-primary">AUI Talent</span>
          </div>
          <p className="text-sm text-text-secondary font-medium max-w-md mx-auto">
            Connecting Studios, Institutes, Industry Experts & Creative Professionals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
