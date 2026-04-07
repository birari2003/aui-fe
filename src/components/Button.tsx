import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', className = '', loading = false, disabled, ...props }: any) => {
  const variants = {
    primary: 'bg-brand-accent text-white hover:bg-brand-accent-hover shadow-sm',
    secondary: 'bg-white border border-gray-200 text-text-primary hover:bg-brand-surface shadow-sm',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-brand-surface',
    outline: 'border border-brand-primary text-brand-primary hover:bg-brand-surface'
  };
  
  return (
    <button 
      disabled={disabled || loading}
      className={`px-6 py-2.5 rounded-brand font-medium transition-premium active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm ${variants[variant as keyof typeof variants]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
