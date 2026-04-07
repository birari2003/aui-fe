import React from 'react';
import { Users, Briefcase, GraduationCap, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../types';

const RegisterSelect = ({ onSelect }: { onSelect: (role: UserRole) => void }) => {
  const roles = [
    { id: 'professional', label: 'Professional', icon: Users, desc: 'Artists, Designers, and Engineers' },
    { id: 'studio', label: 'Studio', icon: Briefcase, desc: 'Production Houses and Agencies' },
    { id: 'institute', label: 'Institute', icon: GraduationCap, desc: 'Schools and Training Centers' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-20 px-6 space-y-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
      >
        <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-primary tracking-tight">Create Your Account</h2>
        <p className="text-text-secondary text-lg md:text-xl max-w-md mx-auto">Select your role to begin the verification process.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
        {roles.map((role, index) => (
          <motion.button 
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(role.id as UserRole)}
            className="group relative p-8 md:p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-premium hover:shadow-premium-hover transition-premium flex flex-col items-center gap-8 text-center"
          >
            {/* Background Accent Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-premium rounded-[2.5rem]" />
            
            <div className="relative z-10 w-24 h-24 bg-brand-surface rounded-[2rem] flex items-center justify-center shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-premium group-hover:scale-110">
              <role.icon size={44} strokeWidth={1.5} />
            </div>

            <div className="relative z-10 space-y-3">
              <span className="block text-2xl font-bold text-brand-primary group-hover:text-brand-accent transition-colors">{role.label}</span>
              <p className="text-sm text-text-secondary leading-relaxed px-4">{role.desc}</p>
            </div>

            <div className="relative z-10 pt-4 mt-auto">
              <div className="w-14 h-14 rounded-full bg-brand-surface flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white transition-premium group-hover:rotate-[-45deg] shadow-sm">
                <ChevronRight size={28} />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default RegisterSelect;

