import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { X, User, Mail, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
}

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  lead: Lead | null; // Null means Add Lead mode, object means Edit Lead mode
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSaveSuccess, lead }) => {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'New' | 'Contacted' | 'Qualified' | 'Lost'>('New');
  const [source, setSource] = useState<'Website' | 'Instagram' | 'Referral'>('Website');
  
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setEmail(lead.email);
      setStatus(lead.status);
      setSource(lead.source);
    } else {
      // Reset form for Add Lead
      setName('');
      setEmail('');
      setStatus('New');
      setSource('Website');
    }
    setValidationError(null);
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Basic Validations
    if (!name.trim()) {
      setValidationError('Lead name is required.');
      return;
    }
    if (!email.trim()) {
      setValidationError('Lead email is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    try {
      const url = lead ? `${API_URL}/leads/${lead._id}` : `${API_URL}/leads`;
      const method = lead ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, status, source }),
      });

      const data = await res.json();

      if (res.ok) {
        onSaveSuccess();
        onClose();
      } else {
        setValidationError(data.message || 'Failed to save lead');
      }
    } catch (err) {
      console.error('Error saving lead:', err);
      setValidationError('Network error. Failed to save lead.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm transition-opacity duration-300">
      
      {/* Modal Card */}
      <div 
        className="w-full max-w-lg glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
          <h3 className="text-lg font-bold tracking-tight text-white">
            {lead ? 'Modify Lead Details' : 'Register New Lead'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Error Alert */}
          {validationError && (
            <div className="flex items-center space-x-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-sm leading-relaxed">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="name-input" className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter lead's full name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input font-medium"
                disabled={submitting}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email-input" className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input font-medium"
                disabled={submitting}
              />
            </div>
          </div>

          {/* Status & Source (Grid side-by-side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Status Select */}
            <div className="space-y-1.5">
              <label htmlFor="status-select" className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                Lead Status
              </label>
              <select
                id="status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl text-sm glass-input font-medium bg-slate-900 cursor-pointer"
                disabled={submitting}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Source Select */}
            <div className="space-y-1.5">
              <label htmlFor="source-select" className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                Acquisition Source
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <LinkIcon className="w-3.5 h-3.5" />
                </span>
                <select
                  id="source-select"
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input font-medium bg-slate-900 cursor-pointer"
                  disabled={submitting}
                >
                  <option value="Website">Website</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
            </div>

          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-end space-x-3 bg-slate-900/20 -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-white/5 hover:border-white/10 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-md shadow-brand-600/10 hover:shadow-brand-600/20 active:scale-98 transition-all flex items-center justify-center space-x-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving Lead...</span>
                </>
              ) : (
                <span>{lead ? 'Update Lead' : 'Add Lead'}</span>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
export default LeadModal;
