import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReelCard from './ReelCard';
import { View } from '../types';
import { fetchShowreels } from '../services/showreelServices';
import { BASE_URL } from '../utils/urls';

const slugify = (text: string) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};


const ReelsSection = ({ onAction }: { onAction: (v: View) => void }) => {
  const navigate = useNavigate();
  const [reels, setReels] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 412; // width of one card + gap (380 + 32)
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    const loadReels = async () => {
      try {
        setLoading(true);
        const res = await fetchShowreels();
        const data = await res.json();
        if (data.success && data.data) {
          // Format video URLs so relative file uploads are fully resolved
          const formatted = data.data.map((reel: any) => {
            let videoUrl = reel.videoUrl || '';
            if (videoUrl && !videoUrl.startsWith('http') && !videoUrl.startsWith('blob:')) {
              videoUrl = `${BASE_URL}/${videoUrl.replace(/^\//, '')}`;
            }
            return {
              ...reel,
              videoUrl
            };
          });
          setReels(formatted);
        }
      } catch (err) {
        console.error('Failed to load featured showreels:', err);
      } finally {
        setLoading(false);
      }
    };
    loadReels();
  }, []);

  return (
    <section className="py-32 space-y-16">
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-8 text-left">
        <div className="space-y-4">
          <h2 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-brand-primary">Featured Professionals, Institutes & Studios</h2>
          <p className="text-text-secondary text-xl max-w-xl">See how professionals teach, institutes train, and studios create in real production environments.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-text-secondary text-sm font-semibold">
          Loading featured showreels...
        </div>
      ) : reels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-secondary text-sm border-2 border-dashed border-gray-200 rounded-3xl mx-6">
          <p className="font-bold text-base mb-1">No Featured Showreels Yet</p>
          <p className="text-xs">Featured showreels uploaded by admins will appear here.</p>
        </div>
      ) : (
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto no-scrollbar px-6 md:px-[calc((100vw-1280px)/2+24px)] pb-12"
          >
            {reels.map(reel => {
              const slug = reel.slug || slugify(reel.title || reel.artistName || '');
              return (
                <ReelCard 
                  key={reel.id} 
                  reel={reel} 
                  onClick={() => navigate(`/showcase/${slug}`)}
                  onAction={onAction}
                />
              );
            })}
          </div>
          
          <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none hidden xl:block" />
          <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none hidden xl:block" />

          {/* Carousel Navigation Arrows below the reel list */}
          <div className={`justify-center gap-4 pt-6
            ${reels.length > 3 ? 'md:flex' : 'md:hidden'}
            ${reels.length > 1 ? 'flex' : 'hidden'}
          `}>
            <button 
              onClick={() => handleScroll('left')}
              className="p-4 rounded-full border border-brand-primary/10 hover:border-brand-primary/20 bg-white shadow-sm hover:shadow transition-all text-brand-primary active:scale-95 flex items-center justify-center text-left"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => handleScroll('right')}
              className="p-4 rounded-full border border-brand-primary/10 hover:border-brand-primary/20 bg-white shadow-sm hover:shadow transition-all text-brand-primary active:scale-95 flex items-center justify-center text-left"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReelsSection;
