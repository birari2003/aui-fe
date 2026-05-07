import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { View } from '../types';
import { getAllStudioProfiles } from '../services/studioProfileService';
import { BASE_URL } from '../utils/urls';

const getFileUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
};

const StudioList = ({ setView }: { setView: (v: View) => void }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [studios, setStudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const response = await getAllStudioProfiles();
        const data = await response.json();
        if (data.ok) {
          setStudios(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch studios:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudios();
  }, []);

  const filteredStudios = studios.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 text-left">
        <div className="space-y-4 text-left">
          <h1 className="text-4xl font-display font-bold text-brand-primary tracking-tight text-left">Explore Studios</h1>
          <p className="text-text-secondary text-left">Connect with leading production houses and VFX studios worldwide.</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl text-left">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input 
            type="text"
            placeholder="Search by name, location, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-brand-surface rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-premium text-left"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {filteredStudios.map((studio, i) => (
            <motion.div
              key={studio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-left"
            >
              <Card className="group p-8 bg-white border-gray-100 shadow-premium hover:shadow-premium-hover transition-premium flex flex-col md:flex-row gap-8 items-center text-left">
                <div className="w-32 h-32 bg-brand-surface rounded-[32px] overflow-hidden flex-shrink-0 text-left border border-gray-100 p-2">
                  <img 
                    src={getFileUrl(studio.logo) || `https://picsum.photos/seed/${studio.id}/200/200`} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-premium" 
                    alt={studio.name} 
                  />
                </div>
                
                <div className="flex-1 space-y-4 text-left">
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between text-left">
                      <h3 className="text-2xl font-bold text-brand-primary text-left">{studio.name}</h3>
                      {studio.verified && <Badge variant="success">Verified</Badge>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary font-medium text-left">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {studio.location}</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {studio.artistsHired || '0'} Artists</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-secondary line-clamp-2 text-left">
                    {studio.about}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-left">
                    <Badge variant="outline" className="bg-brand-surface/30 border-none">{studio.specialty || 'VFX & Post'}</Badge>
                    <Button 
                      variant="ghost" 
                      className="text-brand-accent font-bold gap-2 p-0 hover:bg-transparent"
                      onClick={() => navigate(`/talent/${studio.talentCode}`)}
                    >
                      View Showcase <ArrowRight size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudioList;
