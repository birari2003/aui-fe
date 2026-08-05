import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Upload, Lock, Lightbulb, Search, X, ChevronRight, Check, Building2, GraduationCap, MapPin, User, Calendar, Award } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import SEO from '../components/SEO';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import { View } from '../types';
import { registerUser } from '../services/userServices';
import { fetchEducations } from '../services/educationServices';
import { fetchCollegesFromApi } from '../services/aspirantServices';

interface AspirantOnboardingProps {
  onComplete: (v: View) => void;
}

// Preloaded popular Indian colleges for immediate offline / quick search
const PRELOADED_COLLEGES = [
  { name: "Thakur College of Engineering and Technology", state: "Maharashtra", city: "Mumbai" },
  { name: "Atharva College of Engineering", state: "Maharashtra", city: "Mumbai" },
  { name: "Bhagwan Parshuram Institute of Technology", state: "Delhi", city: "Delhi" },
  { name: "University of Petroleum and Energy Studies", state: "Uttarakhand", city: "Dehradun" },
  { name: "Ashoka University", state: "Haryana", city: "Sonipat" },
  { name: "Indian Institute of Information Technology Sri City", state: "Andhra Pradesh", city: "Chittoor" },
  { name: "Veermata Jijabai Technological Institute (VJTI)", state: "Maharashtra", city: "Mumbai" },
  { name: "Sardar Patel Institute of Technology (SPIT)", state: "Maharashtra", city: "Mumbai" },
  { name: "Indian Institute of Technology Bombay (IIT Bombay)", state: "Maharashtra", city: "Mumbai" },
  { name: "Indian Institute of Technology Delhi (IIT Delhi)", state: "Delhi", city: "Delhi" },
  { name: "Indian Institute of Technology Madras (IIT Madras)", state: "Tamil Nadu", city: "Chennai" },
  { name: "National Institute of Design (NID)", state: "Gujarat", city: "Ahmedabad" },
  { name: "Industrial Design Centre (IDC - IIT Bombay)", state: "Maharashtra", city: "Mumbai" },
  { name: "MIT Institute of Design (MIT ID)", state: "Maharashtra", city: "Pune" },
  { name: "Whistling Woods International", state: "Maharashtra", city: "Mumbai" },
  { name: "Srishti Institute of Art, Design and Technology", state: "Karnataka", city: "Bengaluru" },
  { name: "Symbiosis Institute of Design (SID)", state: "Maharashtra", city: "Pune" },
  { name: "College of Engineering Pune (COEP)", state: "Maharashtra", city: "Pune" },
  { name: "Dr. Babasaheb Ambedkar Technological University (DBATU)", state: "Maharashtra", city: "Lonere" },
  { name: "University of Mumbai", state: "Maharashtra", city: "Mumbai" },
  { name: "Savitribai Phule Pune University", state: "Maharashtra", city: "Pune" },
  { name: "Delhi University (DU)", state: "Delhi", city: "Delhi" },
  { name: "BITS Pilani", state: "Rajasthan", city: "Pilani" },
  { name: "Vellore Institute of Technology (VIT)", state: "Tamil Nadu", city: "Vellore" },
  { name: "SRM Institute of Science and Technology", state: "Tamil Nadu", city: "Chennai" },
  { name: "Manipal Academy of Higher Education", state: "Karnataka", city: "Manipal" },
  { name: "Frameboxx 2.0 Animation & Visual Effects", state: "Maharashtra", city: "Mumbai" },
  { name: "MAAC (Maya Academy of Advanced Cinematics)", state: "Pan-India", city: "Various" },
  { name: "Arena Animation", state: "Pan-India", city: "Various" },
];

const AspirantOnboarding: React.FC<AspirantOnboardingProps> = ({ onComplete }) => {
  // Form State
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('+91');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [gender, setGender] = React.useState('');

  // Location State
  const [selectedCountry, setSelectedCountry] = React.useState('IN');
  const [selectedState, setSelectedState] = React.useState('');
  const [selectedCity, setSelectedCity] = React.useState('');

  // Education State
  const [collegeName, setCollegeName] = React.useState('');
  const [educations, setEducations] = React.useState<any[]>([]);
  const [selectedEducationId, setSelectedEducationId] = React.useState<string>('');
  const [year, setYear] = React.useState('');

  // Career Interest State (Multi-Select)
  const [interestedDepartments, setInterestedDepartments] = React.useState<string[]>([]);
  const [customDepartments, setCustomDepartments] = React.useState<string[]>([]);
  const [otherDepartmentInput, setOtherDepartmentInput] = React.useState('');

  // Photo Upload State
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);

  // Terms and Loading State
  const [agreed, setAgreed] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  // Active Drawer State
  const [activeDrawer, setActiveDrawer] = React.useState<string | null>(null);
  const [drawerSearch, setDrawerSearch] = React.useState('');
  const [apiColleges, setApiColleges] = React.useState<any[]>([]);
  const [isApiLoading, setIsApiLoading] = React.useState(false);

  // Countries, States, Cities lists
  const countries = React.useMemo(() => Country.getAllCountries(), []);
  const states = React.useMemo(() => {
    return selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
  }, [selectedCountry]);

  const cities = React.useMemo(() => {
    return selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry, selectedState)
      : [];
  }, [selectedCountry, selectedState]);

  // Group Educations by Category for Title-Wise Section Headers
  const groupedEducations = React.useMemo(() => {
    const filtered = educations.filter((e) =>
      e.title.toLowerCase().includes(drawerSearch.toLowerCase()) ||
      (e.category && e.category.toLowerCase().includes(drawerSearch.toLowerCase()))
    );

    const groups: Record<string, any[]> = {};
    filtered.forEach((item) => {
      const cat = item.category || 'Other';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(item);
    });
    return groups;
  }, [educations, drawerSearch]);

  // Load Educations from DB
  React.useEffect(() => {
    const loadEducations = async () => {
      try {
        const res = await fetchEducations(1); // active only
        if (res.ok) {
          const data = await res.json();
          setEducations(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load educations:', err);
      }
    };
    loadEducations();
  }, []);

  // Fetch Colleges from Hipolabs API whenever search query changes in drawer
  React.useEffect(() => {
    if (activeDrawer === 'collegeName') {
      const currentCountry = countries.find((c) => c.isoCode === selectedCountry)?.name || 'India';
      setIsApiLoading(true);
      const timer = setTimeout(async () => {
        const results = await fetchCollegesFromApi(currentCountry, drawerSearch);
        setApiColleges(results || []);
        setIsApiLoading(false);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [activeDrawer, drawerSearch, selectedCountry, countries]);

  // Handle Photo File Select
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !email || !phoneNumber || !gender || !dob) {
      setErrorMsg('Please fill in all required personal information fields.');
      return;
    }
    if (!collegeName || !selectedEducationId || !year) {
      setErrorMsg('Please complete all education details.');
      return;
    }
    if (interestedDepartments.length === 0) {
      setErrorMsg('Please select at least one interested department.');
      return;
    }
    if (!agreed) {
      setErrorMsg('You must agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    try {
      setSubmitting(true);

      const countryObj = countries.find((c) => c.isoCode === selectedCountry);
      const stateObj = states.find((s) => s.isoCode === selectedState);
      const eduObj = educations.find((ed) => String(ed.id) === String(selectedEducationId));

      let finalDepartments = [...interestedDepartments];
      if (finalDepartments.includes('Other') && otherDepartmentInput.trim()) {
        const val = otherDepartmentInput.trim();
        if (!finalDepartments.includes(val)) {
          finalDepartments.push(val);
        }
      }
      finalDepartments = finalDepartments.filter((d) => d !== 'Other');

      const payload = {
        email,
        phone: `${countryCode} ${phoneNumber}`,
        role: 'aspirant',
        fullName,
        profileData: {
          fullName,
          phone: `${countryCode} ${phoneNumber}`,
          dob,
          gender,
          country: countryObj ? countryObj.name : selectedCountry,
          state: stateObj ? stateObj.name : selectedState,
          district: selectedCity,
          city: selectedCity,
          collegeName,
          educationId: selectedEducationId ? Number(selectedEducationId) : null,
          educationTitle: eduObj ? eduObj.title : '',
          year,
          interestedDepartment: finalDepartments.join(', '),
          photoUrl: photoPreview || '',
        },
      };

      const res = await registerUser(payload);
      const data = await res.json();

      if (res.ok) {
        onComplete('pending_approval');
      } else {
        setErrorMsg(data.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMsg(err.message || 'An error occurred during registration.');
    } finally {
      setSubmitting(false);
    }
  };

  // Drawer options helpers
  const openDrawer = (drawerName: string) => {
    setActiveDrawer(drawerName);
    setDrawerSearch('');
  };

  const closeDrawer = () => {
    setActiveDrawer(null);
    setDrawerSearch('');
  };

  // Selected labels for trigger buttons
  const getSelectedCountryName = () => {
    const found = countries.find((c) => c.isoCode === selectedCountry);
    return found ? found.name : selectedCountry;
  };

  const getSelectedStateName = () => {
    const found = states.find((s) => s.isoCode === selectedState);
    return found ? found.name : selectedState;
  };

  const getSelectedEducationTitle = () => {
    const found = educations.find((e) => String(e.id) === String(selectedEducationId));
    return found ? `${found.title} (${found.category})` : '';
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-10 relative">
      <SEO
        title="Aspirant Registration | AUI Network"
        description="Join the AUI Aspirant Network for career guidance, industry exposure, and opportunities in Animation, VFX, and Gaming."
      />

      {/* Header */}
      <div className="space-y-3 text-left">
        <div className="flex items-center gap-2 text-brand-accent">
          <Sparkles size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Aspirant Onboarding</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-primary tracking-tight">
          Aspirant Registration
        </h2>
        <p className="text-text-secondary text-lg">
          Fill in your details to join the AUI Aspirant Network.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white border-gray-100 shadow-premium p-8 md:p-12 rounded-[2.5rem]">
          {errorMsg && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold flex items-center gap-2">
              <X size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10 text-left">
            {/* PERSONAL INFORMATION SECTION */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-brand-primary">Personal Information</h3>
                <p className="text-xs text-text-muted">Tell us about yourself and basic details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <Input
                  label="Full Name *"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-brand-surface/50 border-gray-100 focus:bg-white"
                />

                {/* Photo Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted block">
                    Upload Photo * (JPG, PNG Max 2MB)
                  </label>
                  <label className="w-full bg-brand-surface/50 hover:bg-brand-surface border border-dashed border-gray-200 hover:border-brand-accent rounded-2xl p-3.5 text-xs text-text-secondary flex items-center justify-between cursor-pointer transition-premium">
                    <span className="truncate font-medium">
                      {photoPreview ? 'Photo Selected ✓' : 'Choose photo file...'}
                    </span>
                    <Upload size={18} className="text-text-muted shrink-0 ml-2" />
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  {photoPreview && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-10 h-10 rounded-full object-cover border border-brand-accent"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview(null)}
                        className="text-xs font-bold text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted block">
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-brand-surface/50 border border-gray-100 rounded-2xl px-3 py-3.5 text-sm font-semibold text-brand-primary outline-none focus:bg-white focus:border-brand-accent transition-premium"
                    >
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+971">+971 (UAE)</option>
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 bg-brand-surface/50 border border-gray-100 rounded-2xl p-4 text-sm font-medium outline-none focus:bg-white focus:border-brand-accent transition-premium text-brand-primary"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <Input
                  label="Email Address *"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-brand-surface/50 border-gray-100 focus:bg-white"
                />

                {/* Date of Birth (DOB) */}
                <Input
                  label="Date of Birth (DOB) *"
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="bg-brand-surface/50 border-gray-100 focus:bg-white"
                />

                {/* Gender (Standard Inline Dropdown) */}
                <Select
                  label="Gender *"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  options={['Select Gender', 'Male', 'Female', 'Non-binary', 'Prefer not to say']}
                  className="bg-brand-surface/50 border-gray-100 focus:bg-white"
                />
              </div>

              {/* LOCATION CASCADE DROPDOWNS (Left Sidebar Drawers) */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted block">
                  Location (Country / State / District / City) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Country Trigger */}
                  <button
                    type="button"
                    onClick={() => openDrawer('country')}
                    className="w-full bg-brand-surface/50 border border-gray-100 rounded-2xl p-4 text-sm font-medium text-left flex items-center justify-between hover:border-brand-accent transition-premium text-brand-primary"
                  >
                    <span className="truncate font-semibold text-brand-primary">
                      {getSelectedCountryName() || 'Select Country'}
                    </span>
                    <ChevronRight size={16} className="text-text-muted shrink-0 ml-1" />
                  </button>

                  {/* State Trigger */}
                  <button
                    type="button"
                    onClick={() => openDrawer('state')}
                    disabled={!selectedCountry}
                    className="w-full bg-brand-surface/50 border border-gray-100 rounded-2xl p-4 text-sm font-medium text-left flex items-center justify-between hover:border-brand-accent transition-premium text-brand-primary disabled:opacity-50"
                  >
                    <span className={selectedState ? 'truncate font-semibold text-brand-primary' : 'truncate text-text-muted'}>
                      {getSelectedStateName() || 'Select State'}
                    </span>
                    <ChevronRight size={16} className="text-text-muted shrink-0 ml-1" />
                  </button>

                  {/* District / City Trigger */}
                  <button
                    type="button"
                    onClick={() => openDrawer('city')}
                    disabled={!selectedState}
                    className="w-full bg-brand-surface/50 border border-gray-100 rounded-2xl p-4 text-sm font-medium text-left flex items-center justify-between hover:border-brand-accent transition-premium text-brand-primary disabled:opacity-50"
                  >
                    <span className={selectedCity ? 'truncate font-semibold text-brand-primary' : 'truncate text-text-muted'}>
                      {selectedCity || 'Select City / District'}
                    </span>
                    <ChevronRight size={16} className="text-text-muted shrink-0 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* EDUCATION INFORMATION SECTION */}
            <div className="space-y-6 pt-4">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-brand-primary">Education Information</h3>
                <p className="text-xs text-text-muted">Your educational qualification and college details</p>
              </div>

              {/* College / University Name Drawer Trigger */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted block">
                  College / University Name *
                </label>
                <button
                  type="button"
                  onClick={() => openDrawer('collegeName')}
                  className="w-full bg-brand-surface/50 border border-gray-100 rounded-2xl p-4 text-sm font-medium text-left flex items-center justify-between hover:border-brand-accent transition-premium text-brand-primary"
                >
                  <span className={collegeName ? 'font-semibold text-brand-primary truncate' : 'text-text-muted'}>
                    {collegeName || 'Search or select your college / university name...'}
                  </span>
                  <div className="flex items-center gap-2 text-text-muted shrink-0">
                    <Search size={16} />
                    <ChevronRight size={18} />
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course / Education Drawer Trigger (Title-wise List) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted block">
                    Course / Education * (Title-wise List)
                  </label>
                  <button
                    type="button"
                    onClick={() => openDrawer('education')}
                    className="w-full bg-brand-surface/50 border border-gray-100 rounded-2xl p-4 text-sm font-medium text-left flex items-center justify-between hover:border-brand-accent transition-premium text-brand-primary"
                  >
                    <span className={selectedEducationId ? 'font-semibold text-brand-primary truncate' : 'text-text-muted'}>
                      {getSelectedEducationTitle() || 'Select Course / Education'}
                    </span>
                    <ChevronRight size={18} className="text-text-muted shrink-0 ml-1" />
                  </button>
                </div>

                {/* Course / Year Drawer Trigger */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted block">
                    Course / Year *
                  </label>
                  <button
                    type="button"
                    onClick={() => openDrawer('year')}
                    className="w-full bg-brand-surface/50 border border-gray-100 rounded-2xl p-4 text-sm font-medium text-left flex items-center justify-between hover:border-brand-accent transition-premium text-brand-primary"
                  >
                    <span className={year ? 'font-semibold text-brand-primary' : 'text-text-muted'}>
                      {year || 'Select Year'}
                    </span>
                    <ChevronRight size={18} className="text-text-muted" />
                  </button>
                </div>
              </div>
            </div>

            {/* CAREER INTEREST SECTION */}
            <div className="space-y-6 pt-4">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-brand-primary">Career Interest</h3>
                <p className="text-xs text-text-muted">Specify your primary area of interest</p>
              </div>

              {/* Interested Departments Multi-Select Drawer Trigger */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted block">
                  Interested Departments * (Select all that apply)
                </label>
                <button
                  type="button"
                  onClick={() => openDrawer('interestedDepartment')}
                  className="w-full bg-brand-surface/50 border border-gray-100 rounded-2xl p-4 text-sm font-medium text-left flex items-center justify-between hover:border-brand-accent transition-premium text-brand-primary"
                >
                  <span className={interestedDepartments.length > 0 ? 'font-semibold text-brand-primary truncate' : 'text-text-muted'}>
                    {interestedDepartments.length > 0
                      ? interestedDepartments.join(', ')
                      : 'Select Areas of Interest (Multi-select)...'}
                  </span>
                  <div className="flex items-center gap-2">
                    {interestedDepartments.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary text-white">
                        {interestedDepartments.length} selected
                      </span>
                    )}
                    <ChevronRight size={18} className="text-text-muted shrink-0" />
                  </div>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-brand-surface/60 border border-gray-100 flex items-start gap-3 text-xs leading-relaxed">
                <Lightbulb size={20} className="shrink-0 text-brand-accent mt-0.5" />
                <div>
                  <span className="font-bold block text-brand-primary mb-0.5">Where will this be used?</span>
                  <span className="text-text-secondary">Your information will be shared with our partner institutes to help them connect with students like you.</span>
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="pt-6 space-y-6 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer text-xs text-text-secondary font-medium">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary border-gray-300"
                />
                <span>
                  I agree to the{' '}
                  <a href="/terms" target="_blank" className="text-brand-accent hover:underline font-bold">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" target="_blank" className="text-brand-accent hover:underline font-bold">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <Button
                type="submit"
                loading={submitting}
                className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-accent text-white font-bold text-base shadow-premium hover:shadow-premium-hover transition-premium"
              >
                Register as Aspirant
              </Button>

              <p className="text-center text-xs text-text-muted flex items-center justify-center gap-1.5 font-medium">
                <Lock size={14} className="text-text-muted" />
                Your data is secure with AUI.
              </p>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* ========================================================================= */}
      {/* LEFT SIDEBAR SLIDE-OVER DRAWER COMPONENT                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeDrawer && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            />

            {/* Right Slide-over Panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100"
              >
                {/* Drawer Header */}
                <div className="px-6 py-5 bg-brand-surface/40 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                      {activeDrawer === 'collegeName' && <Building2 size={20} />}
                      {activeDrawer === 'education' && <GraduationCap size={20} />}
                      {activeDrawer === 'year' && <Calendar size={20} />}
                      {activeDrawer === 'gender' && <User size={20} />}
                      {['country', 'state', 'city'].includes(activeDrawer) && <MapPin size={20} />}
                      {activeDrawer === 'interestedDepartment' && <Award size={20} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-brand-primary">
                        {activeDrawer === 'gender' && 'Select Gender'}
                        {activeDrawer === 'country' && 'Select Country'}
                        {activeDrawer === 'state' && 'Select State'}
                        {activeDrawer === 'city' && 'Select District / City'}
                        {activeDrawer === 'collegeName' && 'Select College / University Name'}
                        {activeDrawer === 'education' && 'Select Course / Education'}
                        {activeDrawer === 'year' && 'Select Course Year'}
                        {activeDrawer === 'interestedDepartment' && 'Select Interested Department'}
                      </h3>
                      <p className="text-[11px] text-text-muted font-medium">Type to search options</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="p-2 text-text-muted hover:text-brand-primary hover:bg-brand-surface rounded-full transition-premium"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Sticky Search Input */}
                <div className="p-4 bg-white border-b border-gray-100">
                  <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      autoFocus
                      value={drawerSearch}
                      onChange={(e) => setDrawerSearch(e.target.value)}
                      placeholder={
                        activeDrawer === 'collegeName'
                          ? 'Search college / university or type custom name...'
                          : 'Search by typing...'
                      }
                      className="w-full bg-brand-surface/50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-brand-primary outline-none focus:bg-white focus:border-brand-accent transition-premium"
                    />
                    {drawerSearch && (
                      <button
                        type="button"
                        onClick={() => setDrawerSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand-primary"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Quick Custom Selection for College Name or City */}
                  {drawerSearch.trim() && (activeDrawer === 'collegeName' || activeDrawer === 'city') && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeDrawer === 'collegeName') setCollegeName(drawerSearch.trim());
                        if (activeDrawer === 'city') setSelectedCity(drawerSearch.trim());
                        closeDrawer();
                      }}
                      className="mt-3 w-full p-3 rounded-xl bg-brand-accent/10 border border-brand-accent/20 text-brand-accent hover:bg-brand-accent hover:text-white transition-premium text-left text-xs font-bold flex items-center justify-between"
                    >
                      <span>Use custom name: "{drawerSearch.trim()}"</span>
                      <Check size={16} />
                    </button>
                  )}
                </div>

                {/* Drawer Scrollable Options List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                  {/* GENDER OPTIONS */}
                  {activeDrawer === 'gender' &&
                    ['Male', 'Female', 'Non-binary', 'Prefer not to say']
                      .filter((o) => o.toLowerCase().includes(drawerSearch.toLowerCase()))
                      .map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setGender(opt);
                            closeDrawer();
                          }}
                          className={`w-full p-4 rounded-2xl text-left text-sm font-bold flex items-center justify-between transition-premium border ${
                            gender === opt
                              ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                              : 'bg-brand-surface/30 text-brand-primary border-gray-100 hover:bg-brand-surface'
                          }`}
                        >
                          <span>{opt}</span>
                          {gender === opt && <Check size={18} />}
                        </button>
                      ))}

                  {/* COUNTRY OPTIONS */}
                  {activeDrawer === 'country' &&
                    countries
                      .filter((c) => c.name.toLowerCase().includes(drawerSearch.toLowerCase()))
                      .map((c) => (
                        <button
                          key={c.isoCode}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c.isoCode);
                            setSelectedState('');
                            setSelectedCity('');
                            closeDrawer();
                          }}
                          className={`w-full p-3.5 rounded-2xl text-left text-sm font-semibold flex items-center justify-between transition-premium border ${
                            selectedCountry === c.isoCode
                              ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                              : 'bg-brand-surface/30 text-brand-primary border-gray-100 hover:bg-brand-surface'
                          }`}
                        >
                          <span>{c.name} ({c.isoCode})</span>
                          {selectedCountry === c.isoCode && <Check size={18} />}
                        </button>
                      ))}

                  {/* STATE OPTIONS */}
                  {activeDrawer === 'state' &&
                    states
                      .filter((s) => s.name.toLowerCase().includes(drawerSearch.toLowerCase()))
                      .map((s) => (
                        <button
                          key={s.isoCode}
                          type="button"
                          onClick={() => {
                            setSelectedState(s.isoCode);
                            setSelectedCity('');
                            closeDrawer();
                          }}
                          className={`w-full p-3.5 rounded-2xl text-left text-sm font-semibold flex items-center justify-between transition-premium border ${
                            selectedState === s.isoCode
                              ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                              : 'bg-brand-surface/30 text-brand-primary border-gray-100 hover:bg-brand-surface'
                          }`}
                        >
                          <span>{s.name}</span>
                          {selectedState === s.isoCode && <Check size={18} />}
                        </button>
                      ))}

                  {/* CITY / DISTRICT OPTIONS */}
                  {activeDrawer === 'city' &&
                    cities
                      .filter((ct) => ct.name.toLowerCase().includes(drawerSearch.toLowerCase()))
                      .map((ct, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedCity(ct.name);
                            closeDrawer();
                          }}
                          className={`w-full p-3.5 rounded-2xl text-left text-sm font-semibold flex items-center justify-between transition-premium border ${
                            selectedCity === ct.name
                              ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                              : 'bg-brand-surface/30 text-brand-primary border-gray-100 hover:bg-brand-surface'
                          }`}
                        >
                          <span>{ct.name}</span>
                          {selectedCity === ct.name && <Check size={18} />}
                        </button>
                      ))}

                  {/* COLLEGE NAME SEARCH & SELECTION */}
                  {activeDrawer === 'collegeName' && (
                    <div className="space-y-4">
                      {isApiLoading && (
                        <div className="p-3 text-center text-xs text-text-muted font-bold flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                          <span>Searching university database...</span>
                        </div>
                      )}

                      {/* Display live API results first if available */}
                      {apiColleges.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent block px-2">
                            API Results
                          </span>
                          {apiColleges.map((c, idx) => (
                            <button
                              key={`api-${idx}`}
                              type="button"
                              onClick={() => {
                                setCollegeName(c.name);
                                closeDrawer();
                              }}
                              className={`w-full p-4 rounded-2xl text-left transition-premium border flex items-center justify-between ${
                                collegeName === c.name
                                  ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                  : 'bg-brand-surface/30 text-brand-primary border-gray-100 hover:bg-brand-surface'
                              }`}
                            >
                              <div>
                                <span className="font-bold text-sm block">{c.name}</span>
                                {c['state-province'] && (
                                  <span className="text-[10px] opacity-75">{c['state-province']}, {c.country}</span>
                                )}
                              </div>
                              {collegeName === c.name && <Check size={18} className="shrink-0 ml-2" />}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Display preloaded list filtered by drawerSearch */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block px-2">
                          Popular Institutes
                        </span>
                        {PRELOADED_COLLEGES.filter((c) =>
                          c.name.toLowerCase().includes(drawerSearch.toLowerCase()) ||
                          c.city.toLowerCase().includes(drawerSearch.toLowerCase()) ||
                          c.state.toLowerCase().includes(drawerSearch.toLowerCase())
                        ).map((c, idx) => (
                          <button
                            key={`pre-${idx}`}
                            type="button"
                            onClick={() => {
                              setCollegeName(c.name);
                              closeDrawer();
                            }}
                            className={`w-full p-4 rounded-2xl text-left transition-premium border flex items-center justify-between ${
                              collegeName === c.name
                                ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                : 'bg-brand-surface/30 text-brand-primary border-gray-100 hover:bg-brand-surface'
                            }`}
                          >
                            <div>
                              <span className="font-bold text-sm block">{c.name}</span>
                              <span className="text-[10px] opacity-75">{c.city}, {c.state}</span>
                            </div>
                            {collegeName === c.name && <Check size={18} className="shrink-0 ml-2" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* COURSE / EDUCATION OPTIONS (GROUPED BY CATEGORY WITH SECTION HEADERS) */}
                  {activeDrawer === 'education' && (
                    <div className="space-y-6">
                      {Object.keys(groupedEducations).length === 0 ? (
                        <div className="p-6 text-center text-sm text-text-muted font-medium">
                          No matching education courses found.
                        </div>
                      ) : (
                        Object.entries(groupedEducations).map(([category, items]) => (
                          <div key={category} className="space-y-2">
                            {/* Category Section Title Header (Once at Top) */}
                            <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-1.5 border-b border-gray-100 flex items-center justify-between">
                              <span className="text-xs font-extrabold text-brand-primary uppercase tracking-wider">
                                {category}
                              </span>
                              <span className="text-[10px] font-bold text-text-muted px-2 py-0.5 rounded-full bg-brand-surface">
                                {items.length} {items.length === 1 ? 'course' : 'courses'}
                              </span>
                            </div>

                            {/* Course Titles under this Category */}
                            <div className="space-y-1.5 pt-1">
                              {items.map((edu) => (
                                <button
                                  key={edu.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedEducationId(String(edu.id));
                                    closeDrawer();
                                  }}
                                  className={`w-full p-3.5 rounded-2xl text-left transition-premium border flex items-center justify-between ${
                                    String(selectedEducationId) === String(edu.id)
                                      ? 'bg-brand-primary text-white border-brand-primary shadow-sm font-bold'
                                      : 'bg-brand-surface/30 text-brand-primary border-gray-100 hover:bg-brand-surface font-semibold'
                                  }`}
                                >
                                  <span className="text-sm">{edu.title}</span>
                                  {String(selectedEducationId) === String(edu.id) && (
                                    <Check size={18} className="shrink-0 ml-2" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* COURSE / YEAR OPTIONS */}
                  {activeDrawer === 'year' &&
                    ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduated', 'Post Graduate', 'Other']
                      .filter((y) => y.toLowerCase().includes(drawerSearch.toLowerCase()))
                      .map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setYear(opt);
                            closeDrawer();
                          }}
                          className={`w-full p-4 rounded-2xl text-left text-sm font-bold flex items-center justify-between transition-premium border ${
                            year === opt
                              ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                              : 'bg-brand-surface/30 text-brand-primary border-gray-100 hover:bg-brand-surface'
                          }`}
                        >
                          <span>{opt}</span>
                          {year === opt && <Check size={18} />}
                        </button>
                      ))}

                  {/* INTERESTED DEPARTMENTS MULTI-SELECT OPTIONS */}
                  {activeDrawer === 'interestedDepartment' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {[
                          'VFX & Animation',
                          '3D Modeling & Texturing',
                          'Rigging & Animation',
                          'Lighting & Compositing',
                          'Game Art & Development',
                          'Graphic Design & Concept Art',
                          'UI/UX Design',
                          'Video Editing & Post Production',
                          'AI Artist',
                          ...customDepartments,
                          'Other'
                        ]
                          .filter((d) => d.toLowerCase().includes(drawerSearch.toLowerCase()))
                          .map((opt) => {
                            const isSelected = interestedDepartments.includes(opt);
                            return (
                              <div key={opt} className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setInterestedDepartments(interestedDepartments.filter((d) => d !== opt));
                                    } else {
                                      setInterestedDepartments([...interestedDepartments, opt]);
                                    }
                                  }}
                                  className={`w-full p-4 rounded-2xl text-left text-sm font-bold flex items-center justify-between transition-premium border ${
                                    isSelected
                                      ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                      : 'bg-brand-surface/30 text-brand-primary border-gray-100 hover:bg-brand-surface'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  <div
                                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                      isSelected
                                        ? 'bg-white text-brand-primary border-white'
                                        : 'border-gray-300 bg-white/50'
                                    }`}
                                  >
                                    {isSelected && <Check size={14} className="stroke-[3]" />}
                                  </div>
                                </button>
                                {opt === 'Other' && isSelected && (
                                  <div className="animate-in fade-in slide-in-from-top-1 px-1 pb-1 flex gap-2">
                                    <input
                                      type="text"
                                      value={otherDepartmentInput}
                                      onChange={(e) => setOtherDepartmentInput(e.target.value)}
                                      placeholder="Add custom department..."
                                      className="flex-1 bg-brand-surface/50 border border-gray-100 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-premium placeholder:text-text-muted"
                                      onClick={(e) => e.stopPropagation()}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          const val = otherDepartmentInput.trim();
                                          if (val && !customDepartments.includes(val) && !interestedDepartments.includes(val)) {
                                            setCustomDepartments([...customDepartments, val]);
                                            setInterestedDepartments([...interestedDepartments, val]);
                                            setOtherDepartmentInput('');
                                          }
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const val = otherDepartmentInput.trim();
                                        if (val && !customDepartments.includes(val) && !interestedDepartments.includes(val)) {
                                          setCustomDepartments([...customDepartments, val]);
                                          setInterestedDepartments([...interestedDepartments, val]);
                                          setOtherDepartmentInput('');
                                        }
                                      }}
                                      className="bg-brand-primary text-white px-5 rounded-xl text-sm font-bold shadow-sm hover:bg-brand-accent transition-premium"
                                    >
                                      Add
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>

                      <button
                        type="button"
                        onClick={closeDrawer}
                        className="w-full py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-sm shadow-premium hover:bg-brand-accent transition-premium flex items-center justify-center gap-2 mt-4"
                      >
                        <span>Done ({interestedDepartments.length} Selected)</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AspirantOnboarding;
