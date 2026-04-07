import { Talent, Studio, Institute } from '../types';

export const REELS_DATA = [
  {
    id: 'r1',
    type: 'mentor',
    name: 'Alex Rivera',
    role: 'Senior Character Animator',
    description: 'Advanced Character Acting Workshop: Mastering subtext and micro-expressions in performance.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://picsum.photos/seed/anim1/400/600'
  },
  {
    id: 'r2',
    type: 'studio',
    name: 'Blue Sky Studios',
    role: 'Production House',
    description: 'Producing for Netflix-level animation: A deep dive into our lighting and compositing pipeline.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://picsum.photos/seed/studio1/400/600'
  },
  {
    id: 'r3',
    type: 'institute',
    name: 'Vancouver Film School',
    role: 'Training Institute',
    description: 'Industry-standard training for the next generation of visual storytellers and technical artists.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://picsum.photos/seed/vfs/400/600'
  },
  {
    id: 'r4',
    type: 'studio',
    name: 'Framestore',
    role: 'VFX & Animation',
    description: 'Inside the Creature Pipeline: See how we bring legendary monsters to life with proprietary tech.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://picsum.photos/seed/vfx1/400/600'
  }
];

export const LIVE_ACTIVITIES = [
  "Studio from Mumbai hired Character Animator – 2 mins ago",
  "Workshop booked by XYZ Institute – 10 mins ago",
  "Lighting Artist verified – 25 mins ago",
  "Portfolio review completed – 1 hour ago",
  "Studio XYZ hired Senior Animator – 5 mins ago",
  "Mentorship session booked – 20 mins ago",
  "Artist verified – 1 hour ago",
  "Project completed and recorded in ledger"
];

export const MOCK_TALENT: Talent[] = [
  { 
    id: 'AUI-000123', 
    name: 'Alex Rivera', 
    role: 'Senior Product Designer', 
    exp: '8y', 
    verified: true, 
    confidence: { experience: 98, reliability: 95, projects: 42 },
    avatar: 'https://picsum.photos/seed/alex/200/200',
    showreel: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    skills: ['UI/UX Design', 'Motion Graphics', 'Design Systems', 'Prototyping'],
    bio: 'Specializing in high-fidelity product design and motion systems. Lead design for complex SaaS platforms and production-ready interfaces.',
    ledger: [
      { id: '1', project: 'Metaverse UI', org: 'Meta', role: 'Lead Designer', duration: '6m', date: '2025-12', status: 'completed' },
      { id: '2', project: 'Linear Redesign', org: 'Linear', role: 'UI Consultant', duration: '3m', date: '2025-06', status: 'completed' },
    ]
  },
  { 
    id: 'AUI-000124', 
    name: 'Sarah Chen', 
    role: 'Full Stack Engineer', 
    exp: '6y', 
    verified: true, 
    confidence: { experience: 94, reliability: 98, projects: 28 },
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    bio: 'Building scalable web applications with a focus on performance and user experience.',
    ledger: [
      { id: '3', project: 'E-commerce Platform', org: 'Shopify', role: 'Senior Engineer', duration: '1y', date: '2025-11', status: 'completed' },
    ]
  },
  { 
    id: 'AUI-000125', 
    name: 'Marcus Thorne', 
    role: 'VFX Supervisor', 
    exp: '12y', 
    verified: true, 
    confidence: { experience: 99, reliability: 97, projects: 65 },
    avatar: 'https://picsum.photos/seed/marcus/200/200',
    skills: ['Houdini', 'Nuke', 'Unreal Engine', 'Compositing'],
    bio: 'Award-winning VFX supervisor with over a decade of experience in feature films and high-end commercials.',
    ledger: [
      { id: '4', project: 'Cyberpunk 2077', org: 'CD Projekt Red', role: 'VFX Lead', duration: '2y', date: '2024-12', status: 'completed' },
    ]
  },
];

export const MOCK_STUDIOS: Studio[] = [
  {
    id: 'STU-001',
    name: 'Mumbai Animation Studio',
    location: 'Mumbai, India',
    type: 'Feature Film & TV',
    size: '200-500 Artists',
    verified: true,
    about: 'A leading animation studio specializing in high-end character animation and visual effects for global clients.',
    hiring: [
      { role: 'Character Animator', count: 5, startDate: '2026-04-01' },
      { role: 'Lighting Artist', count: 2, startDate: '2026-04-15' }
    ],
    engagements: [
      { project: 'Project Phoenix', talentName: 'Alex Rivera', status: 'Active' },
      { project: 'Ocean Quest', talentName: 'Marcus Thorne', status: 'Completed' }
    ]
  },
  {
    id: 'STU-002',
    name: 'VFX Global',
    location: 'Bangalore, India',
    type: 'VFX & Post Production',
    size: '100-200 Artists',
    verified: true,
    about: 'Providing world-class visual effects services for international feature films and episodic content.',
    hiring: [
      { role: 'Compositor', count: 3, startDate: '2026-05-01' }
    ],
    engagements: []
  }
];

export const MOCK_INSTITUTES: Institute[] = [
  {
    id: 'INS-001',
    name: 'Global Institute of Animation',
    location: 'Bangalore, India',
    students: 1200,
    courses: ['3D Animation', 'VFX', 'Game Design'],
    about: 'Premier educational institution dedicated to nurturing the next generation of digital artists and storytellers.',
    workshops: [
      { date: '2026-03-25', mentor: 'Alex Rivera', topic: 'Character Performance', status: 'Upcoming' },
      { date: '2026-04-10', mentor: 'Marcus Thorne', topic: 'VFX Pipelines', status: 'Planned' }
    ],
    sessions: [
      { workshop: 'Advanced Rigging', mentor: 'Sarah Chen', date: '2026-02-15' }
    ]
  },
  {
    id: 'INS-002',
    name: 'Filmakademie',
    location: 'Mumbai, India',
    students: 800,
    courses: ['Character Animation', 'Technical Direction'],
    about: 'One of the world\'s leading film academies, focused on high-end animation and production workflows.',
    workshops: [
      { date: '2026-05-12', mentor: 'Sarah Chen', topic: 'Pipeline Architecture', status: 'Planned' }
    ],
    sessions: []
  }
];
