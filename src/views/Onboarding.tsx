import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import { View, UserRole } from '../types';
import { registerUser, checkUserStatus } from '../services/userServices';
import Modal from '../components/Modal';

const OnboardingFlow = ({ onComplete, role }: { onComplete: (v: View) => void, role: UserRole }) => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);
  const [modal, setModal] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error'
  });

  const calculateLevel = (exp: number) => {
    if (exp === 0) return 'Fresher';
    if (exp <= 2) return 'Junior';
    if (exp <= 6) return 'Mid-Level';
    return 'Senior';
  };

  const handleInputChange = (label: string, value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev, [label]: value };
      if (label === 'Years of Experience') {
        newData['Level'] = calculateLevel(Number(value) || 0);
      }
      return newData;
    });
  };
  
  const professionalSteps = [
    { 
      title: 'Professional Identity', 
      description: 'Tell us about your background and core skills.',
      fields: [
        { label: 'Full Name', type: 'text', placeholder: 'John Doe' }, 
        { label: 'Email Address', type: 'email', placeholder: 'john@example.com' }, 
        { label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 890' },
        { label: 'Years of Experience', type: 'number', placeholder: 'Enter years' }, 
        { label: 'Experience Level', type: 'text', readOnly: true, valueKey: 'Level' },
        { label: 'Primary Specialization', type: 'select', options: ['Select Specialization', 'Animation', 'Lighting', 'FX', 'Layout', 'Compositing', 'Other'] },
        { 
          label: 'Custom Specialization', 
          type: 'text', 
          placeholder: 'Enter your specialization',
          condition: (data: any) => data['Primary Specialization'] === 'Other'
        },
        { label: 'Current Position', type: 'select', options: ['Select Position', 'Artist', 'Lead', 'Supervisor', 'Director', 'Other'] },
        { 
          label: 'Custom Position', 
          type: 'text', 
          placeholder: 'Enter your position',
          condition: (data: any) => data['Current Position'] === 'Other'
        }
      ] 
    },
    { 
      title: 'Work & Portfolio', 
      description: 'Showcase your best work and production experience.',
      fields: [
        { label: 'Industry Sector', type: 'select', options: ['Select Sector', 'Film', 'TV', 'Web', 'Ads'] }, 
        { label: 'Role Description', type: 'textarea', placeholder: 'Briefly describe your key responsibilities...' },
        { label: 'Showreel / Demo Reel Link', type: 'url', placeholder: 'Vimeo or YouTube link' }, 
        { label: 'Portfolio Website', type: 'url', placeholder: 'https://...' }
      ] 
    },
    { 
      title: 'Mentorship', 
      description: 'Share your expertise with the AUI community.',
      fields: [
        { 
          label: 'Do you want to work as a mentor?', 
          type: 'select', 
          options: ['Select Option', 'Yes', 'No'] 
        },
        { 
          label: 'Mentorship Availability', 
          type: 'textarea', 
          placeholder: 'On which days/times are you available to mentor?',
          condition: (data: any) => data['Do you want to work as a mentor?'] === 'Yes'
        },
        { 
          label: 'Mentorship Specializations', 
          type: 'select', 
          options: ['Select Specialization', 'Animation', 'Lighting', 'FX', 'Layout', 'Compositing'],
          condition: (data: any) => data['Do you want to work as a mentor?'] === 'Yes'
        }
      ] 
    },
    { title: 'Verification', description: 'Review and submit for verification.', fields: [] }
  ];

  const studioSteps = [
    { 
      title: 'Studio Foundation', 
      description: 'Essential information about your production house.',
      fields: [
        { label: 'Studio Name', type: 'text', placeholder: 'Enter studio name' }, 
        { label: 'Official Website', type: 'url', placeholder: 'https://...' }, 
        { label: 'Email Address', type: 'email', placeholder: 'studio@example.com' },
        { label: 'Primary Location', type: 'text', placeholder: 'City, Country' },
        { label: 'Contact Person Name', type: 'text', placeholder: 'Name' }, 
        { label: 'Personal Designation', type: 'text', placeholder: 'e.g. Head of Production' }
      ] 
    },
    { 
      title: 'Scale & Operations', 
      description: 'Details about your capacity and hiring needs.',
      fields: [
        { label: 'Number of Active Artists', type: 'number', placeholder: '0' }, 
        { label: 'Annual Projects Count', type: 'number', placeholder: '0' },
        { label: 'Years in Industry', type: 'number', placeholder: 'Years' },
        { label: 'Primary Production Type', type: 'select', options: ['Select Type', 'Feature Film', 'Series', 'Ads', 'Gaming', 'Other'] },
        { label: 'Hiring Tiers', type: 'select', options: ['Junior', 'Mid', 'Senior'] },
        { label: 'Hiring Frequency', type: 'select', options: ['Frequently', 'Occasionally', 'Rarely'] }
      ] 
    },
    { 
      title: 'Verification', 
      description: 'Upload credentials to verify your studio account.',
      fields: [
        { label: 'Production Quality Focus', type: 'select', options: ['International Projects', 'Domestic Projects', 'Both'] },
        { label: 'LinkedIn Profile / Proof', type: 'url', placeholder: 'LinkedIn or registration link' }
      ] 
    },
    { title: 'Submit Approval', description: 'Ready to join the network.', fields: [] }
  ];

  const instituteSteps = [
    { 
      title: 'Institute Details', 
      description: 'Information about your educational center.',
      fields: [
        { label: 'Institute Name', type: 'text', placeholder: 'Enter name' }, 
        { label: 'Website', type: 'url', placeholder: 'https://...' },
        { label: 'Email Address', type: 'email', placeholder: 'institute@example.com' },
        { label: 'Campus Location', type: 'text', placeholder: 'City, Country' },
        { label: 'Contact Person', type: 'text', placeholder: 'Full Name' }, 
        { label: 'Designation', type: 'text', placeholder: 'e.g. Director' }
      ] 
    },
    { 
      title: 'Scale & Courses', 
      description: 'Academic scope and current student strength.',
      fields: [
        { label: 'Total Student Strength', type: 'number' }, 
        { label: 'Active Branches', type: 'number' }, 
        { label: 'Years in Education', type: 'number' },
        { label: 'Primary Courses', type: 'select', options: ['Animation', 'VFX', 'Design', 'Gaming'] },
        { label: 'Industry Exposure Frequency', type: 'select', options: ['Regularly', 'Occasionally', 'Never'] }
      ] 
    },
    { 
      title: 'AUI Collaboration', 
      description: 'Help us understand how we can support you.',
      fields: [
        { label: 'Support Needed from AUI', type: 'select', options: ['Workshops', 'Mentorship', 'Portfolio Reviews'] },
        { label: 'Active Services', type: 'select', options: ['Workshops', 'Mentorship', 'Portfolio Reviews'] },
        { label: 'Verification Link / URL', type: 'url' }
      ] 
    },
    { title: 'Submit Approval', description: 'Ready to join the network.', fields: [] }
  ];

  const currentSteps = role === 'professional' ? professionalSteps : role === 'studio' ? studioSteps : instituteSteps;
  const totalSteps = currentSteps.length;

  const handleSubmit = async () => {
    try {
      const email = formData['Email Address'];
      const phone = formData['Phone Number'];
      const fullName = formData['Full Name'] || formData['Studio Name'] || formData['Institute Name'];

      let profileData: any = {};

      if (role === 'professional') {
        profileData = {
          fullName,
          experienceYears: Number(formData['Years of Experience']),
          primarySkill: formData['Primary Specialization'] === 'Other' ? formData['Custom Specialization'] : formData['Primary Specialization'],
          position: (formData['Current Position'] === 'Other' ? formData['Custom Position'] : formData['Current Position'])?.toLowerCase(),
          productionType: (formData['Industry Sector'] === 'Film' ? 'film' : 
                          formData['Industry Sector'] === 'TV' ? 'tv' : 
                          formData['Industry Sector'] === 'Web' ? 'web' : 
                          formData['Industry Sector'] === 'Ads' ? 'ads' : 'film'),
          responsibilityScope: formData['Role Description'],
          showreelUrl: formData['Showreel / Demo Reel Link'],
          portfolioUrl: formData['Portfolio Website'],
          isMentor: formData['Do you want to work as a mentor?'] === 'Yes',
          mentorAvailability: formData['Mentorship Availability'],
          mentorSpecializations: formData['Mentorship Specializations'],
        };
      } else if (role === 'studio') {
        profileData = {
          studioName: formData['Studio Name'],
          website: formData['Official Website'],
          location: formData['Primary Location'],
          contactPerson: formData['Contact Person Name'],
          designation: formData['Personal Designation'],
          teamSize: Number(formData['Number of Active Artists']),
          yearsInOperation: Number(formData['Years in Industry']),
          workType: (formData['Primary Production Type'] === 'Feature Film' ? 'film' : 
                     formData['Primary Production Type'] === 'Series' ? 'series' : 
                     formData['Primary Production Type'] === 'Ads' ? 'ads' : 
                     formData['Primary Production Type'] === 'Gaming' ? 'gaming' : 'film'),
          hiringFrequency: (formData['Hiring Frequency'] === 'Frequently' ? 'frequent' : 
                            formData['Hiring Frequency'] === 'Occasionally' ? 'occasional' : 
                            formData['Hiring Frequency'] === 'Rarely' ? 'rare' : 'occasional'),
          projectType: (formData['Production Quality Focus'] === 'International Projects' ? 'international' : 
                        formData['Production Quality Focus'] === 'Domestic Projects' ? 'domestic' : 
                        formData['Production Quality Focus'] === 'Both' ? 'both' : 'both'),
          annualProjects: Number(formData['Annual Projects Count']),
          hiringTiers: formData['Hiring Tiers'],
          linkedinProfile: formData['LinkedIn Profile / Proof'],
        };
      } else if (role === 'institute') {
        profileData = {
          instituteName: formData['Institute Name'],
          website: formData['Website'],
          location: formData['Campus Location'],
          contactPerson: formData['Contact Person'],
          designation: formData['Designation'],
          studentCount: Number(formData['Total Student Strength']),
          branchCount: Number(formData['Active Branches']),
          coursesOffered: formData['Primary Courses'],
          industryExposure: (formData['Industry Exposure Frequency'] === 'Regularly' ? 'regularly' : 
                             formData['Industry Exposure Frequency'] === 'Occasionally' ? 'occasionally' : 
                             formData['Industry Exposure Frequency'] === 'Never' ? 'never' : 'occasionally'),
          yearsInEducation: Number(formData['Years in Education']),
          supportNeeded: formData['Support Needed from AUI'],
          activeServices: formData['Active Services'],
          verificationUrl: formData['Verification Link / URL'],
        };
      }

      const response = await registerUser({
        email,
        phone,
        role,
        fullName,
        profileData,
      });

      if (response.ok) {
        onComplete('pending_approval');
      } else {
        const error = await response.json();
        setModal({
          isOpen: true,
          title: 'Registration Failed',
          message: error.message || 'Please check your information and try again.',
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setModal({
        isOpen: true,
        title: 'Error',
        message: 'An unexpected error occurred during registration. Please try again later.',
        type: 'error'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-10 min-h-[80vh] flex flex-col justify-center">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brand-accent mb-2">
              <Sparkles size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Step {step} of {totalSteps}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-primary tracking-tight">
              {currentSteps[step-1].title}
            </h2>
            <p className="text-text-secondary text-lg">{currentSteps[step-1].description}</p>
          </div>
        </div>
        <div className="h-2.5 w-full bg-brand-surface rounded-full overflow-hidden shadow-inner border border-gray-100/50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(step/totalSteps)*100}%` }}
            className="h-full bg-gradient-to-r from-brand-accent to-brand-purple shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all duration-500 ease-out"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white border-gray-100 shadow-premium p-8 md:p-12 rounded-[2.5rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {currentSteps[step-1].fields.filter((f: any) => !f.condition || f.condition(formData)).map((field: any) => (
                <div key={field.label} className={field.type === 'textarea' || field.type === 'calendar' ? 'md:col-span-2' : ''}>
                  {field.type === 'select' ? (
                    <Select 
                      label={field.label} 
                      options={field.options} 
                      className="bg-brand-surface/50 border-gray-100 focus:bg-white" 
                      value={formData[field.label] || ''}
                      onChange={(e: any) => handleInputChange(field.label, e.target.value)}
                    />
                  ) : field.type === 'textarea' ? (
                    <div className="space-y-2 w-full text-left">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">{field.label}</label>
                      <textarea 
                        className="w-full p-4 bg-brand-surface/50 rounded-brand text-sm outline-none border border-gray-100 focus:border-brand-accent focus:bg-white transition-premium h-32 resize-none shadow-sm" 
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`} 
                        value={formData[field.label] || ''}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                      />
                    </div>
                  ) : field.type === 'calendar' ? (
                    <div className="space-y-6">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">{field.label}</label>
                      <div className="grid grid-cols-7 gap-2 p-8 bg-brand-surface/30 rounded-[2rem] border border-gray-100/50">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                          <button 
                            key={d} 
                            type="button"
                            className="aspect-square flex items-center justify-center text-sm font-medium hover:bg-brand-accent hover:text-white rounded-xl transition-premium hover:shadow-premium group relative"
                          >
                            {d}
                            <span className="absolute bottom-1 w-1 h-1 bg-brand-accent/30 rounded-full group-hover:bg-white" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Input 
                      label={field.label} 
                      type={field.type} 
                      placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`} 
                      value={field.readOnly ? (formData[field.valueKey] || '') : (formData[field.label] || '')}
                      readOnly={field.readOnly}
                      onChange={(e: any) => handleInputChange(field.label, e.target.value)}
                      className={field.readOnly ? 'bg-gray-50/50 border-gray-100 font-bold text-brand-accent' : 'bg-brand-surface/50 border-gray-100 focus:bg-white'}
                    />
                  )}
                </div>
              ))}

              {step === totalSteps && (
                <div className="md:col-span-2 text-center py-8 space-y-6">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 3 }}
                    className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm"
                  >
                    <ShieldCheck size={48} />
                  </motion.div>
                  <div className="space-y-2 text-center">
                    <h3 className="text-3xl font-bold text-brand-primary">Ready for Review</h3>
                    <p className="text-text-secondary max-w-lg mx-auto leading-relaxed">
                      You've completed the information. Our team will manually review your profile to maintain the quality of the AUI Network.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 pt-10 mt-10 border-t border-gray-100">
              <Button 
                variant="ghost" 
                disabled={step === 1} 
                onClick={() => setStep(s => s - 1)} 
                className="px-8 order-2 md:order-1"
              >
                <ChevronLeft size={18} className="mr-1" /> Back
              </Button>
              <Button 
                className="px-12 py-4 h-14 text-base font-bold shadow-brand-glow md:order-2"
                loading={loading}
                onClick={async () => {
                  if (step === 1) {
                    const email = formData['Email Address'];
                    if (!email || !email.includes('@')) {
                      setModal({
                        isOpen: true,
                        title: 'Invalid Email',
                        message: 'Please enter a valid email address to continue.',
                        type: 'warning'
                      });
                      return;
                    }
                    
                    setLoading(true);
                    try {
                      const response = await checkUserStatus(email);
                      const result = await response.json();
                      
                      if (result.registered) {
                        setModal({
                          isOpen: true,
                          title: 'Account Status',
                          message: result.message,
                          type: result.status === 'approved' ? 'success' : result.status === 'rejected' ? 'error' : 'info'
                        });
                        setLoading(false);
                        return;
                      }
                    } catch (err) {
                      console.error('Status check error:', err);
                    } finally {
                      setLoading(false);
                    }
                  }
                  
                  if (step === totalSteps) {
                    handleSubmit();
                  } else {
                    setStep(s => s + 1);
                  }
                }}
              >
                {step === totalSteps ? 'Submit Application' : 'Continue'}
                {step !== totalSteps && <ChevronRight size={18} className="ml-1" />}
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Modal 
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};

export default OnboardingFlow;

