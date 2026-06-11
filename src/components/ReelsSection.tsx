import React from 'react';
import { ChevronRight } from 'lucide-react';
import ReelCard from './ReelCard';
import ReelModal from './ReelModal';
import { REELS_DATA } from '../data/mockData';
import { View } from '../types';

const ReelsSection = ({ onAction }: { onAction: (v: View) => void }) => {
  const [selectedReel, setSelectedReel] = React.useState<any>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-32 space-y-16">
      <ReelModal 
        isOpen={!!selectedReel} 
        onClose={() => setSelectedReel(null)} 
        reel={selectedReel}
        onAction={onAction}
      />
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-8 text-left">
        <div className="space-y-4">
          <h2 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-brand-primary">Featured Professionals, Institutes & Studios</h2>
          <p className="text-text-secondary text-xl max-w-xl">See how professionals teach, institutes train, and studios create in real production environments.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-text-muted hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-premium"
          >
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-text-muted hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-premium"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* <div className="relative">
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto no-scrollbar px-6 md:px-[calc((100vw-1280px)/2+24px)] pb-12"
        >
          {REELS_DATA.map(reel => (
            <ReelCard 
              key={reel.id} 
              reel={reel} 
              onClick={() => setSelectedReel(reel)}
              onAction={onAction}
            />
          ))}
        </div>
        
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none hidden xl:block" />
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none hidden xl:block" />
      </div> */}
    </section>
  );
};

export default ReelsSection;
