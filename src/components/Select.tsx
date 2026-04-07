import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ label, options, className = '', ...props }: any) => (
  <div className="space-y-2 w-full text-left">
    {label && <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">{label}</label>}
    <div className="relative">
      <select 
        className={`w-full p-4 bg-brand-surface rounded-brand text-sm outline-none border border-transparent focus:border-brand-accent focus:bg-white transition-premium appearance-none ${className}`}
        {...props}
      >
        {options.map((opt: any) => (
          <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
        <ChevronDown size={16} />
      </div>
    </div>
  </div>
);

export default Select;

