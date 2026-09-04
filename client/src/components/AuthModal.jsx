import React, { useState } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  User as UserIcon, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import BASE_URL from '../utils/api';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isRegister
      ? `${BASE_URL}/api/auth/register`
      : `${BASE_URL}/api/auth/login`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.role === 'admin') {
          localStorage.setItem('nexbloom_admin_token', data.token);
          localStorage.setItem('nexbloom_admin_user', JSON.stringify(data.user));
          try {
            confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
          } catch (err) {}
        } else {
          localStorage.setItem('nexbloom_user_token', data.token);
          localStorage.setItem('nexbloom_user', JSON.stringify(data.user));
        }

        onLoginSuccess(data);
        onClose();
      } else {
        setError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Connection to server failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl overflow-hidden shadow-2xl my-6 animate-scale-in border border-slate-100">
        
        {/* ================= MODAL HEADER ================= */}
        <div className="pt-6 pb-4 px-7 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isRegister ? 'Register' : 'Sign in'}
          </h2>
          
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>

        {/* ================= ERROR ALERT ================= */}
        {error && (
          <div className="mx-7 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* ================= FORM BODY ================= */}
        <form onSubmit={handleSubmit} className="p-7 space-y-4">
          
          {/* Full Name (Only for Register) */}
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 block">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all"
              />
            </div>
          )}

          {/* Email / Username Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 block">
              {isRegister ? 'Email address' : 'Username or email address'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder={isRegister ? 'name@example.com' : 'Your email address'}
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all"
            />
          </div>

          {/* Phone Number (Optional on Register) */}
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 block">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all"
              />
            </div>
          )}

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 block">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 pl-4 pr-10 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Register Privacy Notice */}
          {isRegister && (
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <span className="text-[#1b4d3e] font-semibold cursor-pointer underline">privacy policy</span>.
            </p>
          )}

          {/* Big Green LOG IN / REGISTER Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#1b4d3e] hover:bg-[#143c30] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 text-center"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : (
                <span>{isRegister ? 'REGISTER' : 'LOG IN'}</span>
              )}
            </button>
          </div>

          {/* Remember me & Lost your password row (Only on Sign In) */}
          {!isRegister && (
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#1b4d3e] focus:ring-[#1b4d3e] cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Password reset link will be sent to your registered email.')}
                className="text-[#1b4d3e] hover:underline font-semibold cursor-pointer"
              >
                Lost your password?
              </button>
            </div>
          )}
        </form>

        {/* ================= BOTTOM TOGGLE SECTION ================= */}
        <div className="border-t border-slate-100 bg-slate-50/40 p-7 text-center space-y-3">
          
          {/* Avatar Icon */}
          <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200/80 mx-auto flex items-center justify-center text-slate-300">
            <UserIcon className="w-7 h-7 stroke-[1.5]" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-800 mb-1">
              {isRegister ? 'Already have an account?' : 'No account yet?'}
            </p>

            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-xs font-black text-slate-900 hover:text-[#1b4d3e] uppercase tracking-wider underline cursor-pointer transition-colors"
            >
              {isRegister ? 'LOG IN' : 'CREATE AN ACCOUNT'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
