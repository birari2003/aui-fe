import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'info' | 'outline', className?: string, key?: string }) => {
  const variants = {
    default: 'bg-gray-100 text-text-secondary',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    info: 'bg-blue-50 text-blue-700 border border-blue-100',
    outline: 'border border-gray-200 text-text-secondary'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
