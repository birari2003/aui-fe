import React from 'react';
import { ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import Button from '../components/Button';
import Badge from '../components/Badge';

const PendingApprovalPage = ({ onBack }: { onBack: () => void }) => (
  <div className="max-w-3xl mx-auto py-20 px-6 text-center space-y-12 flex flex-col items-center justify-center min-h-[80vh]">
    <SEO 
      title="Pending Approval" 
      description="Your account profile is currently under review by our verification specialists." 
      keywords="pending verification, aui approval, review status" 
    />
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-brand-accent/20 blur-3xl rounded-full animate-pulse" />
      <div className="relative w-40 h-40 bg-white rounded-[3rem] border border-gray-100 flex items-center justify-center shadow-premium rotate-3">
        <ShieldCheck size={80} className="text-brand-accent" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-dashed border-brand-accent/20 rounded-[3rem]"
        />
      </div>
    </motion.div>

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-6 max-w-xl"
    >
      <div className="space-y-4">
        <Badge variant="info" className="px-6 mb-12 py-2 bg-brand-accent/5 text-brand-accent border-brand-accent/10 text-xs font-bold uppercase tracking-widest">
          Application Received
        </Badge>

        <h2 className=" mt-12 text-4xl md:text-5xl font-display font-bold text-brand-primary tracking-tight">Verification in Progress</h2>
      </div>
      <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
        Our verification specialists are currently reviewing your profile. We'll ensure your account meets our network standards within 24-48 hours.
      </p>
    </motion.div>

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="w-full max-w-md p-8 bg-white rounded-[2rem] border border-gray-100 shadow-premium space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-surface rounded-2xl flex items-center justify-center text-brand-accent">
            <Clock size={24} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Current Status</p>
            <p className="text-base font-bold text-brand-primary">Under Manual Review</p>
          </div>
        </div>
        <div className="w-3 h-3 bg-brand-accent rounded-full animate-ping" />
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-50">
        {[
          { label: 'Profile Submitted', done: true },
          { label: 'Identity Verification', done: true },
          { label: 'Network Standards Review', done: false },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.done ? 'bg-emerald-50 text-emerald-500' : 'bg-brand-surface text-text-muted'}`}>
              <CheckCircle2 size={14} />
            </div>
            <span className={`text-sm font-medium ${step.done ? 'text-text-primary' : 'text-text-muted'}`}>{step.label}</span>
          </div>
        ))}
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <Button variant="ghost" className="px-10 h-14" onClick={onBack}>
        Return to Experience
      </Button>
    </motion.div>
  </div>
);

export default PendingApprovalPage;

