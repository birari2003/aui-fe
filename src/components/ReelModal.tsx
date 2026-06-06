import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { View } from '../types';

const ReelModal = ({ isOpen, onClose, reel, onAction }: { 
  isOpen: boolean, 
  onClose: () => void, 
  reel: any,
  onAction: (v: View) => void
}) => {
  if (!isOpen || !reel) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-primary/60 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-brand-primary rounded-[40px] shadow-2xl w-full max-w-5xl overflow-hidden border border-white/10 flex flex-col md:flex-row h-[85vh] md:h-auto"
      >
        <div className="flex-1 bg-black relative flex items-center justify-center">
          <video 
            src={reel.videoUrl} 
            className="w-full h-full object-contain" 
            controls 
            autoPlay 
          />
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-full transition-premium z-10 border border-white/10"
          >
            <X size={24} />
          </button>
        </div>
        <div className="w-full md:w-[400px] p-12 flex flex-col justify-between bg-brand-primary border-l border-white/5 text-left">
          <div className="space-y-10">
            <div className="space-y-4">
              <Badge variant={reel.type === 'mentor' ? 'info' : reel.type === 'institute' ? 'warning' : 'success'} className="bg-white/5 border-white/10 text-white">
                {reel.type === 'mentor' ? 'Professional Mentor' : reel.type === 'institute' ? 'Training Institute' : 'Studio Showcase'}
              </Badge>
              <div className="space-y-1">
                <h3 className="text-4xl font-bold text-white tracking-tight">{reel.name}</h3>
                <p className="text-xs font-bold text-brand-accent uppercase tracking-[0.3em]">{reel.role}</p>
              </div>
            </div>
            <p className="text-white/70 text-lg leading-relaxed font-medium">{reel.description}</p>
          </div>
          
          <div className="space-y-4 pt-12">
            {reel.type === 'mentor' ? (
              <>
                <Button 
                  variant="secondary"
                  className="w-full py-5 border-none text-sm font-bold"
                  onClick={() => {
                    onAction('experts');
                    onClose();
                  }}
                >
                  Book Session
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full py-5 border-white/20 text-white hover:bg-white/10 text-sm font-bold"
                  onClick={() => {
                    onAction('talent_id');
                    onClose();
                  }}
                >
                  View Profile
                </Button>
              </>
            ) : reel.type === 'institute' ? (
              <>
                <Button 
                  variant="secondary"
                  className="w-full py-5 border-none text-sm font-bold"
                  onClick={() => {
                    onAction('showcase_institute');
                    onClose();
                  }}
                >
                  View Institute
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full py-5 border-white/20 text-white hover:bg-white/10 text-sm font-bold"
                  onClick={() => {
                    onAction('showcase_institute');
                    onClose();
                  }}
                >
                  View Workshops
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="secondary"
                  className="w-full py-5 border-none text-sm font-bold"
                  onClick={() => {
                    onAction('showcase_studio');
                    onClose();
                  }}
                >
                  View Studio
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full py-5 border-white/20 text-white hover:bg-white/10 text-sm font-bold"
                  onClick={() => {
                    onAction('dashboard_studio');
                    onClose();
                  }}
                >
                  Explore Opportunities
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReelModal;
