import React from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { requestOtp, loginUser } from '../services/userServices';
import Modal from '../components/Modal';
import SEO from '../components/SEO';

const LoginPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = React.useState('');
  const [otpSent, setOtpSent] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [modal, setModal] = React.useState({ isOpen: false, title: '', message: '', type: 'info' as any });

  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) {
      setModal({ isOpen: true, title: 'Invalid Email', message: 'Please enter a valid email address.', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const response = await requestOtp(email);
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setModal({ isOpen: true, title: 'OTP Sent', message: 'A 4-digit verification code has been sent to your email.', type: 'success' });
      } else {
        setModal({ isOpen: true, title: 'Login Failed', message: data.message || 'Could not send OTP.', type: 'error' });
      }
    } catch (err) {
      setModal({ isOpen: true, title: 'Error', message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      setModal({ isOpen: true, title: 'Invalid OTP', message: 'Please enter the 4-digit code.', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(email, otp);
      const data = await response.json();
      if (response.ok) {
        // Save token to localStorage for persistence
        if (data.token) localStorage.setItem('token', data.token);
        onLogin(data.user);
      } else {
        setModal({ isOpen: true, title: 'Verification Failed', message: data.message || 'Invalid OTP.', type: 'error' });
      }
    } catch (err) {
      setModal({ isOpen: true, title: 'Error', message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-32 space-y-12 text-left">
      <SEO 
        title="Login" 
        description="Log in to your AUI profile to access your dashboard, job postings, portfolio, or requests." 
        keywords="login, sign in, animation portal, animation platform, AUI login" 
      />
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-display font-bold text-brand-primary tracking-tight">Login</h2>
        <p className="text-text-secondary text-lg">Enter your email to receive a verification code.</p>
      </div>

      <Card className="p-10 bg-white border-gray-100 shadow-premium space-y-8">
        {!otpSent ? (
          <div className="space-y-6">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@studio.com" 
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <Button className="w-full py-4" loading={loading} onClick={handleSendOtp}>Send OTP</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Enter 4-Digit OTP</label>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(i => (
                  <input 
                    key={i}
                    type="text" 
                    maxLength={1}
                    className="w-full aspect-square text-center text-2xl font-bold bg-brand-surface rounded-xl outline-none border border-transparent focus:border-brand-accent transition-premium"
                    value={otp[i-1] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!/^\d*$/.test(val)) return;
                      setOtp(prev => {
                        const next = prev.split('');
                        next[i-1] = val;
                        return next.join('');
                      });
                      // Auto focus next input
                      if (val && e.target.nextElementSibling) {
                        (e.target.nextElementSibling as HTMLInputElement).focus();
                      }
                    }}
                  />
                ))}
              </div>
            </div>
            <Button className="w-full py-4" loading={loading} onClick={handleVerifyOtp}>Login</Button>
            <button 
              onClick={() => { setOtpSent(false); setOtp(''); }} 
              className="w-full text-xs font-bold text-text-muted uppercase tracking-widest hover:text-brand-primary transition-premium"
            >
              Change Email
            </button>
          </div>
        )}
      </Card>

      <Modal 
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};

export default LoginPage;
