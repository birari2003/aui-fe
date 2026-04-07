import React from 'react';

const Card = ({ children, className = '', ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <div className={`bg-white rounded-brand p-8 border border-gray-100 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-premium ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
