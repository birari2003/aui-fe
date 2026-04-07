import React from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { MOCK_INSTITUTES } from '../data/mockData';
import { View } from '../types';

const InstituteList = ({ setView }: { setView: (v: View) => void }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredInstitutes = MOCK_INSTITUTES.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.courses.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white no-scrollbar text-left">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 text-left">
        <div className="space-y-4 text-left">
          <h1 className="text-4xl font-display font-bold text-brand-primary tracking-tight text-left">Explore Institutes</h1>
          <p className="text-text-secondary text-left">Find top animation schools and training centers leading the industry.</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl text-left">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input 
            type="text"
            placeholder="Search by name, location, or courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-brand-surface rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-premium text-left"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {filteredInstitutes.map((inst, i) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-left"
            >
              <Card className="group p-8 bg-white border-gray-100 shadow-premium hover:shadow-premium-hover transition-premium flex flex-col md:flex-row gap-8 items-center text-left">
                <div className="w-32 h-32 bg-brand-surface rounded-[32px] overflow-hidden flex-shrink-0 flex items-center justify-center text-brand-primary text-left">
                  <GraduationCap size={48} className="group-hover:scale-110 transition-premium" />
                </div>
                
                <div className="flex-1 space-y-4 text-left">
                  <div className="space-y-1 text-left text-left">
                    <div className="flex items-center justify-between text-left">
                      <h3 className="text-2xl font-bold text-brand-primary text-left">{inst.name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary font-medium text-left">
                      <span className="flex items-center gap-1 text-left"><MapPin size={14} /> {inst.location}</span>
                      <span className="flex items-center gap-1 text-left"><BookOpen size={14} /> {inst.courses.length} Courses</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-secondary line-clamp-2 text-left">
                    {inst.about}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-left">
                    <div className="flex gap-2">
                       {inst.courses.slice(0, 2).map(course => (
                         <Badge key={course} variant="outline" className="text-[10px] bg-brand-surface/30 border-none">{course}</Badge>
                       ))}
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-brand-accent font-bold gap-2 p-0 hover:bg-transparent"
                      onClick={() => navigate(`/institute/${inst.id}`)}
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

export default InstituteList;
