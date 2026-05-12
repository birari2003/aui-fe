import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  showFooter?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', 
  size = 'md',
  showFooter = true,
  className = ''
}) => {
  const icons = {
    info: <Info className="text-blue-500" size={32} />,
    success: <CheckCircle2 className="text-emerald-500" size={32} />,
    warning: <AlertCircle className="text-amber-500" size={32} />,
    error: <XCircle className="text-rose-500" size={32} />,
  };

  const bgColors = {
    info: 'bg-blue-50',
    success: 'bg-emerald-50',
    warning: 'bg-amber-50',
    error: 'bg-rose-50',
  };

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    '3xl': 'max-w-7xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-brand-primary/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-premium w-full ${sizes[size]} max-h-[90vh] overflow-hidden border border-gray-100 flex flex-col relative`}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-text-muted z-10"
            >
              <X size={20} />
            </button>

            <div className={`p-6 sm:p-8 md:p-10 pt-10 sm:pt-12 overflow-y-auto custom-scrollbar flex-1 ${className}`}>
              {title && (
                <div className="text-center space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 ${bgColors[type]} rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-2`}>
                    {icons[type]}
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-brand-primary">{title}</h3>
                  </div>
                </div>
              )}

              <div className="text-left">
                {message}
              </div>

              {showFooter && (
                <div className="pt-6 sm:pt-8 mt-4 border-t border-gray-50 uppercase">
                  <Button onClick={onClose} className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold shadow-brand-glow">
                    Understood
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
