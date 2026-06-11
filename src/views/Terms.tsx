import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowLeft, Scale, Mail } from 'lucide-react';
import Card from '../components/Card';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg text-left pb-24">
      <SEO 
        title="Terms of Use" 
        description="Read the Terms of Use for AUI Talent, a professional network connecting studios, institutes, industry experts, and creative professionals."
        keywords="terms of use, terms, agreement, AUI Talent terms"
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
              <Scale size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Legal Agreement</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary tracking-tight">Terms of Use</h1>
            </div>
          </div>
          <p className="text-text-muted text-sm font-medium mt-2">Last Updated: June 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        <Card className="p-10 bg-white border border-gray-100 shadow-premium space-y-8">
          <p className="text-lg text-text-secondary leading-relaxed font-medium">
            Welcome to AUI Talent. AUI Talent is a professional network connecting studios, institutes, industry experts, and creative professionals. By accessing or using AUI Talent, you agree to these Terms of Use.
          </p>

          <hr className="border-gray-100" />

          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center font-bold text-brand-accent">1</span>
              <h3 className="text-xl font-bold text-brand-primary">Platform Purpose</h3>
            </div>
            <p className="text-text-secondary pl-11 leading-relaxed">
              AUI Talent provides tools and services that help users discover talent, connect with industry professionals, access mentorship opportunities, showcase portfolios, and build professional relationships.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center font-bold text-brand-accent">2</span>
              <h3 className="text-xl font-bold text-brand-primary">User Accounts</h3>
            </div>
            <p className="text-text-secondary pl-11 leading-relaxed">
              Users are responsible for maintaining accurate information on their profiles and safeguarding their account credentials.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center font-bold text-brand-accent">3</span>
              <h3 className="text-xl font-bold text-brand-primary">Professional Conduct</h3>
            </div>
            <p className="text-text-secondary pl-11 leading-relaxed">
              Users must interact respectfully and professionally. Misrepresentation, fraudulent information, harassment, or misuse of the platform may result in account suspension or removal.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center font-bold text-brand-accent">4</span>
              <h3 className="text-xl font-bold text-brand-primary">Content Ownership</h3>
            </div>
            <div className="pl-11 space-y-3">
              <p className="text-text-secondary leading-relaxed">
                Users retain ownership of the content they upload, including portfolios, profiles, project information, and media.
              </p>
              <p className="text-text-secondary leading-relaxed">
                By uploading content, users grant AUI Talent permission to display and distribute such content within the platform.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center font-bold text-brand-accent">5</span>
              <h3 className="text-xl font-bold text-brand-primary">Verification</h3>
            </div>
            <p className="text-text-secondary pl-11 leading-relaxed">
              AUI Talent may verify user identities, professional information, and submitted credentials. Verification indicates that information has been reviewed but does not guarantee employment, project opportunities, or business outcomes.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center font-bold text-brand-accent">6</span>
              <h3 className="text-xl font-bold text-brand-primary">Hiring & Engagements</h3>
            </div>
            <p className="text-text-secondary pl-11 leading-relaxed">
              AUI Talent serves as a networking and professional connection platform. Any hiring decisions, contracts, payments, mentorships, workshops, collaborations, or project agreements are made directly between participating parties.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center font-bold text-brand-accent">7</span>
              <h3 className="text-xl font-bold text-brand-primary">Platform Availability</h3>
            </div>
            <p className="text-text-secondary pl-11 leading-relaxed">
              We strive to provide reliable access to the platform but do not guarantee uninterrupted availability.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center font-bold text-brand-accent">8</span>
              <h3 className="text-xl font-bold text-brand-primary">Changes to Terms</h3>
            </div>
            <p className="text-text-secondary pl-11 leading-relaxed">
              These Terms may be updated periodically. Continued use of the platform constitutes acceptance of any updates.
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
              <a href="mailto:info@auitalent.com" className="text-sm font-black text-brand-primary hover:text-brand-accent transition-premium">
                info@auitalent.com
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TermsPage;
