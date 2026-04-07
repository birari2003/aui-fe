import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Talent } from '../types';

const TalentIDCard = ({ talent }: { talent: Talent }) => (
  <div className="w-full max-w-sm bg-white rounded-2xl border-2 border-brand-primary p-8 shadow-2xl space-y-8 text-center relative overflow-hidden text-left">
    <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary" />
    <div className="space-y-2">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-muted">AUI Verified Talent</h3>
      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-brand-surface shadow-sm">
        <img src={talent.avatar} className="w-full h-full object-cover" alt="" />
      </div>
    </div>
    <div className="space-y-1">
      <h2 className="text-2xl font-bold text-brand-primary tracking-tight">{talent.name}</h2>
      <p className="text-xs font-bold text-brand-accent uppercase tracking-widest">{talent.id}</p>
    </div>
    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
      <div className="text-left">
        <p className="text-[8px] font-bold uppercase tracking-widest text-text-muted mb-1">Role</p>
        <p className="text-xs font-bold text-brand-primary truncate">{talent.role}</p>
      </div>
      <div className="text-right">
        <p className="text-[8px] font-bold uppercase tracking-widest text-text-muted mb-1">Experience</p>
        <p className="text-xs font-bold text-brand-primary">{talent.exp}</p>
      </div>
    </div>
    <div className="flex items-center justify-center gap-2 text-emerald-600">
      <ShieldCheck size={16} />
      <span className="text-[10px] font-bold uppercase tracking-widest">Verified Professional</span>
    </div>
  </div>
);

export default TalentIDCard;
