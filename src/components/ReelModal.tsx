import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { View } from '../types';
import { detectVideoUrl } from '../utils/videoUtils';

const ReelModal = ({ isOpen, onClose, reel, onAction }: { 
  isOpen: boolean, 
  onClose: () => void, 
  reel: any,
  onAction: (v: View) => void
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !reel) return null;

  const videoInfo = detectVideoUrl(reel.videoUrl);

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-brand-primary rounded-[40px] shadow-2xl w-full max-w-7xl overflow-hidden border border-white/10 flex flex-col md:flex-row h-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video Player Section */}
        <div className="flex-1 bg-black relative flex items-center justify-center min-h-[400px] md:min-h-[600px]">
          {videoInfo.canEmbed ? (
            <iframe
              src={videoInfo.embedUrl!}
              className="w-full h-full absolute inset-0 border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : videoInfo.type === 'direct' ? (
            <video 
              src={reel.videoUrl} 
              className="w-full h-full object-contain" 
              controls 
              autoPlay 
            />
          ) : (
            <div className="text-center p-8 text-white">
              <p className="text-lg font-bold mb-4">External Video Platform</p>
              <a
                href={reel.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-accent text-brand-primary px-6 py-3 rounded-xl font-bold hover:bg-brand-accent/90 transition-all"
              >
                Watch on {videoInfo.platformLabel} <ExternalLink size={16} />
              </a>
            </div>
          )}
          
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-full transition-all z-10 border border-white/10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Info Details Section */}
        <div className="w-full md:w-[460px] p-12 flex flex-col justify-between bg-brand-primary border-l border-white/5 text-left">
          <div className="space-y-10">
            <div className="space-y-4">
              <Badge variant={reel.category === 'professional' ? 'info' : reel.category === 'institute' ? 'warning' : 'success'} className="bg-white/5 border-white/10 text-white capitalize">
                {reel.category || 'Featured'}
              </Badge>
              <div className="space-y-1">
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                  {reel.title || reel.name || 'Featured Video'}
                </h3>
                <p className="text-xs font-bold text-brand-accent uppercase tracking-[0.3em]">
                  {reel.topic || reel.role}
                </p>
                {reel.artistName && (
                  <p className="text-sm font-semibold text-white/80 mt-1">
                    By {reel.artistName}
                  </p>
                )}
              </div>
            </div>
            <p className="text-white/70 text-lg leading-relaxed font-medium line-clamp-6">
              {reel.description || 'No description provided.'}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4 pt-12">
            {reel.publicUrl ? (
              <a
                href={reel.publicUrl.startsWith('/') ? reel.publicUrl : (reel.publicUrl.startsWith('http') ? reel.publicUrl : `https://${reel.publicUrl}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-white hover:bg-gray-100 text-brand-primary py-4 rounded-xl text-sm font-bold transition-all shadow-sm"
                onClick={onClose}
              >
                View Profile
              </a>
            ) : (
              <Button 
                variant="secondary"
                className="w-full py-5 border-none text-sm font-bold opacity-50 cursor-not-allowed"
                disabled
              >
                No Profile Available
              </Button>
            )}

            {reel.longMovieUrl && (
              <a
                href={reel.longMovieUrl.startsWith('http') ? reel.longMovieUrl : `https://${reel.longMovieUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-brand-accent hover:bg-brand-accent/90 text-brand-primary py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
                onClick={onClose}
              >
                Watch Full Movie <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default ReelModal;
