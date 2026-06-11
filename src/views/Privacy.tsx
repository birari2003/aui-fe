import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowLeft, Shield, Mail, CheckCircle2, Lock, Eye, Settings, RefreshCw, Layers } from 'lucide-react';
import Card from '../components/Card';

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg text-left pb-24">
      <SEO 
        title="Privacy Policy" 
        description="Read the Privacy Policy for AUI Talent. Learn how we collect, use, share, and protect your information."
        keywords="privacy policy, privacy, data safety, AUI Talent privacy"
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
              <Shield size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Data Protection</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary tracking-tight">Privacy Policy</h1>
            </div>
          </div>
          <p className="text-text-muted text-sm font-medium mt-2">Last Updated: June 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        <Card className="p-10 bg-white border border-gray-100 shadow-premium space-y-8">
          <p className="text-lg text-text-secondary leading-relaxed font-medium">
            Your privacy is important to us. This Privacy Policy details how AUI Talent collects, uses, shares, and protects your information.
          </p>

          <hr className="border-gray-100" />

          {/* Section: Information We Collect */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center text-brand-accent"><Lock size={16} /></span>
              <h3 className="text-xl font-bold text-brand-primary">Information We Collect</h3>
            </div>
            <div className="pl-11 space-y-3">
              <p className="text-text-secondary leading-relaxed">
                We collect information you provide directly to us or that is generated during your platform activity:
              </p>
              <ul className="space-y-2.5">
                {[
                  'Name and profile information',
                  'Email address and contact information',
                  'Portfolio and professional experience details',
                  'Talent ID information',
                  'Platform activity and usage data'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-text-secondary font-medium">
                    <CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: How We Use Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center text-brand-accent"><Settings size={16} /></span>
              <h3 className="text-xl font-bold text-brand-primary">How We Use Information</h3>
            </div>
            <div className="pl-11 space-y-3">
              <p className="text-text-secondary leading-relaxed">
                We use the information collected for various business and service-related purposes:
              </p>
              <ul className="space-y-2.5">
                {[
                  'To provide platform services',
                  'To facilitate professional networking',
                  'To verify user profiles',
                  'To improve user experience',
                  'To communicate important platform updates'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-text-secondary font-medium">
                    <CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: Information Sharing */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center text-brand-accent"><Eye size={16} /></span>
              <h3 className="text-xl font-bold text-brand-primary">Information Sharing</h3>
            </div>
            <div className="pl-11 space-y-3">
              <p className="text-text-secondary leading-relaxed font-bold">
                AUI Talent does not sell personal information.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Information displayed on public profiles is controlled by the user and may be visible to other users and visitors.
              </p>
            </div>
          </div>

          {/* Section: Data Security */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center text-brand-accent"><Shield size={16} /></span>
              <h3 className="text-xl font-bold text-brand-primary">Data Security</h3>
            </div>
            <p className="text-text-secondary pl-11 leading-relaxed">
              We implement reasonable security measures to protect user information and platform data.
            </p>
          </div>

          {/* Section: User Control */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center text-brand-accent"><Settings size={16} /></span>
              <h3 className="text-xl font-bold text-brand-primary">User Control</h3>
            </div>
            <p className="text-text-secondary pl-11 leading-relaxed">
              Users may update, modify, or remove profile information through their account settings.
            </p>
          </div>

          {/* Section: Third-Party Services */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center text-brand-accent"><Layers size={16} /></span>
              <h3 className="text-xl font-bold text-brand-primary">Third-Party Services</h3>
            </div>
            <p className="text-text-secondary pl-11 leading-relaxed">
              Certain features may utilize third-party services for authentication, communication, analytics, or payment processing.
            </p>
          </div>

          {/* Section: Policy Updates */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center text-brand-accent"><RefreshCw size={16} /></span>
              <h3 className="text-xl font-bold text-brand-primary">Policy Updates</h3>
            </div>
            <p className="text-text-secondary pl-11 leading-relaxed">
              This Privacy Policy may be updated periodically. Continued use of the platform constitutes acceptance of any updates.
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Contact Box */}
          <div className="p-6 bg-brand-surface/40 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-brand-accent shadow-sm">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Contact</p>
              <a href="mailto:support@auitalent.com" className="text-sm font-black text-brand-primary hover:text-brand-accent transition-premium">
                support@auitalent.com
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;
