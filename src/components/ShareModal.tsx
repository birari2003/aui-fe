import React from 'react';
import { motion } from 'motion/react';
import { X, Copy, Linkedin, MessageCircle } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, title, subtitle, shareUrl, shareMessage, children }: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string,
  subtitle?: string,
  shareUrl: string,
  shareMessage: string,
  children?: React.ReactNode 
}) => {
  if (!isOpen) return null;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-primary/20 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
      >
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div className="space-y-1 text-left">
            <h3 className="text-xl font-bold text-brand-primary">{title}</h3>
            {subtitle && <p className="text-xs text-text-muted font-medium">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-surface rounded-full transition-premium">
            <X size={20} className="text-text-muted" />
          </button>
        </div>
        <div className="p-8 space-y-8">
          {children && (
            <div className="flex justify-center">
              {children}
            </div>
          )}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-text-muted text-left">Share via</p>
            <div className="grid grid-cols-3 gap-4">
              <button onClick={copyToClipboard} className="flex flex-col items-center gap-2 p-4 bg-brand-surface rounded-2xl hover:bg-brand-primary hover:text-white transition-premium group">
                <Copy size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Copy Link</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-brand-surface rounded-2xl hover:bg-[#0077B5] hover:text-white transition-premium group">
                <Linkedin size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">LinkedIn</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-brand-surface rounded-2xl hover:bg-[#25D366] hover:text-white transition-premium group">
                <MessageCircle size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;
