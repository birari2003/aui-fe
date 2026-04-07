export type UserRole = 'professional' | 'studio' | 'institute' | 'admin';

export type View = 
  | 'landing' 
  | 'login' 
  | 'register_select' 
  | 'onboarding' 
  | 'dashboard_pro' 
  | 'dashboard_studio' 
  | 'dashboard_institute' 
  | 'talent_id' 
  | 'profile_pro'
  | 'showcase_studio'
  | 'showcase_institute'
  | 'admin'
  | 'pending_approval'
  | 'hire'
  | 'experts'
  | 'studio_list'
  | 'institute_list';

export interface ConfidenceScore {
  experience: number;
  reliability: number;
  projects: number;
}

export interface LedgerEntry {
  id: string;
  project: string;
  org: string;
  role: string;
  duration: string;
  date: string;
  status: 'completed' | 'ongoing' | 'upcoming';
}

export interface Talent {
  id: string;
  name: string;
  role: string;
  exp: string;
  verified: boolean;
  confidence: ConfidenceScore;
  avatar: string;
  showreel?: string;
  ledger: LedgerEntry[];
  skills?: string[];
  bio?: string;
}

export interface Engagement {
  id: string;
  title: string;
  org: string;
  date: string;
  type: string;
  status: 'pending' | 'confirmed' | 'completed';
}

export interface Studio {
  id: string;
  name: string;
  location: string;
  type: string;
  size: string;
  verified: boolean;
  about: string;
  hiring: {
    role: string;
    count: number;
    startDate: string;
  }[];
  engagements: {
    project: string;
    talentName: string;
    status: string;
  }[];
}

export interface Booking {
  id: string;
  mentor: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  status: 'pending' | 'confirmed' | 'completed';
}

export interface Institute {
  id: string;
  name: string;
  location: string;
  students: number;
  courses: string[];
  about: string;
  workshops: {
    date: string;
    mentor: string;
    topic: string;
    status: string;
  }[];
  sessions: {
    workshop: string;
    mentor: string;
    date: string;
  }[];
}
