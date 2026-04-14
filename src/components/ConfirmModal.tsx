import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogOut, HelpCircle } from 'lucide-react';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Yes, Logout', 
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  const colors = {
    danger: {
      bg: 'bg-rose-50',
      icon: 'text-rose-500',
      button: 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
    },
    warning: {
      bg: 'bg-amber-50',
      icon: 'text-amber-500',
      button: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
    },
    info: {
      bg: 'bg-blue-50',
      icon: 'text-blue-500',
      button: 'bg-brand-primary hover:bg-brand-primary/90 shadow-brand-glow'
    }
  };

  const activeColor = colors[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-primary/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-premium w-full max-w-md overflow-hidden border border-gray-100 flex flex-col relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-text-muted z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10 pt-12">
              <div className="text-center space-y-6 mb-8">
                <div className={`w-16 h-16 ${activeColor.bg} rounded-3xl flex items-center justify-center mx-auto mb-2`}>
                  {type === 'danger' ? <LogOut className={activeColor.icon} size={32} /> : <HelpCircle className={activeColor.icon} size={32} />}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-brand-primary">{title}</h3>
                  <p className="text-text-secondary">{message}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="secondary" 
                  onClick={onClose} 
                  className="flex-1 py-4 rounded-2xl font-bold border border-gray-100"
                >
                  {cancelText}
                </Button>
                <Button 
                  onClick={onConfirm} 
                  className={`flex-1 py-4 rounded-2xl font-bold text-white shadow-lg transition-premium ${activeColor.button}`}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
