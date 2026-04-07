import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import Button from './Button';
import { View } from '../types';

const ReelCard = ({ reel, onClick, onAction }: { reel: any, onClick: () => void, onAction: (v: View) => void, key?: string }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <motion.div 
      className="min-w-[320px] md:min-w-[380px] group relative"
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="bg-brand-primary rounded-[32px] overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 cursor-pointer"
        onClick={onClick}
      >
        {/* Video Preview Area */}
        <div className="aspect-[4/5] relative overflow-hidden">
          <img 
            src={reel.thumbnail} 
            className={`w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`} 
            alt="" 
          />
          <video 
            ref={videoRef}
            src={reel.videoUrl}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
          
          {isHovered && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white scale-110 transition-transform duration-500 border border-white/20">
                <Play size={32} fill="currentColor" />
              </div>
            </div>
          )}
          {!isHovered && (
            <div className="absolute top-8 right-8 p-3 bg-black/20 backdrop-blur-md rounded-full text-white border border-white/10">
              <Play size={16} fill="currentColor" />
            </div>
          )}
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-brand-primary via-brand-primary/40 to-transparent text-white text-left">
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-2xl font-bold tracking-tight">{reel.name}</h4>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">{reel.role}</p>
              </div>
              <p className="text-sm line-clamp-2 text-white/70 leading-relaxed font-medium">{reel.description}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 grid grid-cols-2 gap-4 bg-brand-primary/80 backdrop-blur-xl border-t border-white/5">
          {reel.type === 'mentor' ? (
            <>
              <Button 
                variant="secondary"
                className="text-[10px] py-4 px-0 border-none font-bold"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onAction('dashboard_institute');
                }}
              >
                Book Session
              </Button>
              <Button 
                variant="outline" 
                className="text-[10px] py-4 px-0 border-white/20 text-white hover:bg-white/10 font-bold"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onAction('talent_id');
                }}
              >
                View Profile
              </Button>
            </>
          ) : reel.type === 'institute' ? (
            <>
              <Button 
                variant="secondary"
                className="text-[10px] py-4 px-0 border-none font-bold"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onAction('showcase_institute');
                }}
              >
                View Institute
              </Button>
              <Button 
                variant="outline" 
                className="text-[10px] py-4 px-0 border-white/20 text-white hover:bg-white/10 font-bold"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onAction('showcase_institute');
                }}
              >
                View Workshops
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="secondary"
                className="text-[10px] py-4 px-0 border-none font-bold"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onAction('showcase_studio');
                }}
              >
                View Studio
              </Button>
              <Button 
                variant="outline" 
                className="text-[10px] py-4 px-0 border-white/20 text-white hover:bg-white/10 font-bold"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onAction('dashboard_studio');
                }}
              >
                Explore Opportunities
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReelCard;
