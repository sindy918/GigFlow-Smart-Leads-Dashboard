import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, BarChart2, Shield, User, AlertCircle, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, error, clearError, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const navigate = useNavigate();

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/');
    }
    clearError();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setValidationError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    const success = await login(email.trim(), password);
    setSubmitting(false);

    if (success) {
      navigate('/');
    }
  };

  // Demo user quick login triggers
  const handleQuickLogin = async (role: 'Admin' | 'Sales') => {
    setValidationError(null);
    clearError();
    setSubmitting(true);

    const demoEmail = role === 'Admin' ? 'admin@gigflow.com' : 'sales@gigflow.com';
    const demoPassword = role === 'Admin' ? 'Admin@123' : 'Sales@123';

    setEmail(demoEmail);
    setPassword(demoPassword);

    const success = await login(demoEmail, demoPassword);
    setSubmitting(false);

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Decorative ambient glowing circles */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-500 items-center justify-center shadow-lg shadow-brand-500/25 mb-2">
            <BarChart2 className="w-6.5 h-6.5 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
            Welcome to GigFlow
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Access your smart lead management workspace
          </p>
        </div>

        {/* Card Panel */}
        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error alerts */}
            {(validationError || error) && (
              <div className="flex items-start space-x-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-sm leading-relaxed">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{validationError || error}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="email-input" className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                Work Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm glass-input font-medium"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label htmlFor="password-input" className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm glass-input font-medium"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Registration link */}
          <div className="text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300 hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          {/* Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider">
              <span className="bg-slate-900 px-3.5 text-slate-400 border border-white/5 rounded-full py-0.5">
                Quick Evaluator Access
              </span>
            </div>
          </div>

          {/* Quick Demo Access Widget */}
          <div className="grid grid-cols-2 gap-3.5">
            <button
              onClick={() => handleQuickLogin('Admin')}
              className="flex flex-col items-center p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-left transition-all group"
              disabled={submitting}
            >
              <Shield className="w-5 h-5 text-emerald-400 mb-1 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-slate-200">Admin Account</span>
              <span className="text-[10px] text-emerald-300 font-medium mt-0.5">Full Privileges</span>
            </button>

            <button
              onClick={() => handleQuickLogin('Sales')}
              className="flex flex-col items-center p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40 text-left transition-all group"
              disabled={submitting}
            >
              <User className="w-5 h-5 text-blue-400 mb-1 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-slate-200">Sales Agent</span>
              <span className="text-[10px] text-blue-300 font-medium mt-0.5">CRUD (No Delete)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
export default Login;
