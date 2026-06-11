import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowLeft, Mail, MessageSquare, HelpCircle, Briefcase, Globe } from 'lucide-react';
import Card from '../components/Card';

const ContactPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg text-left pb-24">
      <SEO 
        title="Contact Us" 
        description="Get in touch with AUI Talent. Contact us for general inquiries, technical support, or studio and institute partnerships."
        keywords="contact AUI Talent, support, partnerships, contact email"
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
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Get In Touch</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary tracking-tight">Contact AUI Talent</h1>
            </div>
          </div>
          <p className="text-text-secondary text-lg mt-4 max-w-xl leading-relaxed">
            We'd love to hear from you. Reach out to our team via the departments below.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: General Inquiries */}
          <Card className="p-8 bg-white border border-gray-100 shadow-premium hover:shadow-premium-hover transition-premium flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-accent">
                <HelpCircle size={20} />
              </div>
              <h3 className="text-lg font-bold text-brand-primary">General Inquiries</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                For questions about our platform, services, or general feedback.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-50">
              <a href="mailto:info@auitalent.com" className="text-sm font-black text-brand-accent hover:text-brand-accent-hover transition-premium flex items-center gap-1">
                info@auitalent.com
              </a>
            </div>
          </Card>

          {/* Card 2: Technical Support */}
          <Card className="p-8 bg-white border border-gray-100 shadow-premium hover:shadow-premium-hover transition-premium flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-accent">
                <Mail size={20} />
              </div>
              <h3 className="text-lg font-bold text-brand-primary">Technical Support</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Need help with your account, profile, verification, or experienced an issue?
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-50">
              <a href="mailto:support@auitalent.com" className="text-sm font-black text-brand-accent hover:text-brand-accent-hover transition-premium flex items-center gap-1">
                support@auitalent.com
              </a>
            </div>
          </Card>

          {/* Card 3: Studio & Institute Partnerships */}
          <Card className="p-8 bg-white border border-gray-100 shadow-premium hover:shadow-premium-hover transition-premium flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-accent">
                <Briefcase size={20} />
              </div>
              <h3 className="text-lg font-bold text-brand-primary">Studio & Institute Partnerships</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Interested in partnership opportunities or hiring at scale?
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-50">
              <a href="mailto:partnerships@auitalent.com" className="text-sm font-black text-brand-accent hover:text-brand-accent-hover transition-premium flex items-center gap-1">
                partnerships@auitalent.com
              </a>
            </div>
          </Card>

          {/* Card 4: Web Info */}
          <Card className="p-8 bg-white border border-gray-100 shadow-premium hover:shadow-premium-hover transition-premium flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-accent">
                <Globe size={20} />
              </div>
              <h3 className="text-lg font-bold text-brand-primary">Website</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Visit our website to learn more about our network and services.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-50">
              <a href="https://www.auitalent.com" target="_blank" rel="noopener noreferrer" className="text-sm font-black text-brand-accent hover:text-brand-accent-hover transition-premium flex items-center gap-1">
                www.auitalent.com
              </a>
            </div>
          </Card>
        </div>

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

export default ContactPage;
