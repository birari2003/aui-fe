import React from 'react';
import { motion } from 'motion/react';
import { Play, ExternalLink } from 'lucide-react';
import Button from './Button';
import { View } from '../types';
import { isDirectVideoUrl } from '../utils/videoUtils';

const ReelCard = ({ reel, onClick, onAction }: { reel: any, onClick: () => void, onAction: (v: View) => void, key?: string }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const isDirect = React.useMemo(() => {
    if (!reel.videoUrl) return false;
    return isDirectVideoUrl(reel.videoUrl);
  }, [reel.videoUrl]);

  React.useEffect(() => {
    if (videoRef.current && isDirect) {
      videoRef.current.play().catch(() => {});
    }
  }, [isDirect]);

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
        <div className="aspect-[9/14] relative overflow-hidden">
          {isDirect ? (
            <video 
              ref={videoRef}
              src={reel.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : reel.thumbnail ? (
            <img 
              src={reel.thumbnail} 
              className="w-full h-full object-cover" 
              alt="" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-primary via-indigo-950 to-brand-primary flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white/80 border border-white/20 mb-4 group-hover:scale-110 transition-transform">
                <Play size={24} fill="currentColor" />
              </div>
              <h5 className="font-bold text-white text-lg line-clamp-2">{reel.title || reel.name}</h5>
              {(reel.topic || reel.role) && (
                <p className="text-[10px] text-brand-accent uppercase tracking-widest mt-1 font-black">
                  {reel.topic || reel.role}
                </p>
              )}
            </div>
          )}
          
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
          <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-brand-primary via-brand-primary/45 to-transparent text-white text-left">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {reel.category && (
                  <span className="text-[9px] font-extrabold uppercase tracking-widest bg-brand-accent/20 text-white px-2 py-0.5 rounded backdrop-blur-sm border border-brand-accent/10 capitalize">
                    {reel.category}
                  </span>
                )}
                {(reel.topic || reel.role) && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
                    {reel.topic || reel.role}
                  </p>
                )}
              </div>
              <h4 className="text-2xl font-bold tracking-tight line-clamp-2">
                {reel.title || reel.name || 'Featured Reel'}
              </h4>
              {reel.artistName && (
                <p className="text-xs text-white/70 font-semibold">
                  By {reel.artistName}
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ReelCard;
