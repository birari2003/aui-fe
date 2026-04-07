import React from 'react';

const Input = ({ label, className = '', ...props }: any) => (
  <div className="space-y-2 w-full text-left">
    {label && <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">{label}</label>}
    <input 
      className={`w-full p-4 bg-brand-surface rounded-brand text-sm outline-none border border-transparent focus:border-brand-accent focus:bg-white focus:shadow-sm transition-premium ${className}`}
      {...props}
    />
  </div>
);

export default Input;

