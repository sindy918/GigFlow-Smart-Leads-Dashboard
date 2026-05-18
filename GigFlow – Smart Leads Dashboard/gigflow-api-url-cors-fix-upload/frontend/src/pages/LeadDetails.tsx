import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { Layout } from '../components/Layout';
import { LeadModal } from '../components/LeadModal';
import { 
  ArrowLeft, Edit3, Trash2, Calendar, Mail, Info, 
  CheckCircle, Clock, AlertTriangle, Link as LinkIcon
} from 'lucide-react';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
  updatedAt: string;
}

export const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchLeadDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/leads/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setLead(data);
      } else {
        setError(data.message || 'Failed to fetch lead details');
      }
    } catch (err) {
      console.error('Fetch lead details error:', err);
      setError('Could not connect to the API server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && id) {
      fetchLeadDetails();
    }
  }, [token, id]);

  const handleDeleteLead = async () => {
    if (user?.role !== 'Admin' || !lead) return;

    if (!window.confirm('Are you completely sure you want to permanently delete this lead?')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/leads/${lead._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        navigate('/');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete lead');
      }
    } catch (err) {
      console.error('Delete lead error:', err);
      alert('Network error while deleting lead');
    } finally {
      setDeleting(false);
    }
  };

  // Status Styling and details
  const getStatusConfig = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return { color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5', step: 1 };
      case 'Contacted':
        return { color: 'text-amber-400 border-amber-500/20 bg-amber-500/5', step: 2 };
      case 'Qualified':
        return { color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', step: 3 };
      case 'Lost':
        return { color: 'text-rose-400 border-rose-500/20 bg-rose-500/5', step: 3 };
      default:
        return { color: 'text-slate-400 border-slate-500/20 bg-slate-500/5', step: 0 };
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 bg-slate-800 rounded w-24"></div>
          <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="h-8 bg-slate-800 rounded w-48"></div>
                <div className="h-4 bg-slate-800 rounded w-64"></div>
              </div>
              <div className="h-9 bg-slate-800 rounded-xl w-32"></div>
            </div>
            <div className="h-px bg-white/5"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-slate-850 rounded-xl"></div>
              <div className="h-20 bg-slate-850 rounded-xl"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !lead) {
    return (
      <Layout>
        <div className="max-w-md mx-auto py-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Lead Details Unavailable</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{error || 'Lead not found.'}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-4.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-white/10 hover:border-white/20 active:scale-98 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </Layout>
    );
  }

  const { color, step } = getStatusConfig(lead.status);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-purple-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Lead Identity Summary Card */}
        <div className="glass-panel p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden space-y-6">
          
          {/* Accent glow corner */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent blur-xl pointer-events-none"></div>

          {/* Identity Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-extrabold tracking-tight text-white">{lead.name}</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
                  {lead.status}
                </span>
              </div>
              <div className="flex flex-col space-y-1 text-slate-400 text-sm">
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-slate-500" />
                  {lead.email}
                </span>
                <span className="flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2 text-slate-500" />
                  Acquired via <span className="font-bold text-purple-400 ml-1">{lead.source}</span>
                </span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-brand-400 bg-brand-500/5 hover:bg-brand-500/10 border border-brand-500/20 hover:border-brand-500/30 active:scale-98 transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Lead</span>
              </button>

              {user?.role === 'Admin' && (
                <button
                  onClick={handleDeleteLead}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/30 active:scale-98 transition-all"
                  disabled={deleting}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="h-px bg-white/5"></div>

          {/* Timeline Process Track */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center">
              <Info className="w-4 h-4 mr-1.5 text-slate-500" />
              Lead Life-cycle Progress
            </h4>
            <div className="grid grid-cols-3 gap-2 py-4">
              
              {/* Step 1: New */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-xs ${
                  step >= 1 ? 'bg-indigo-500/10 border-indigo-400 text-indigo-400' : 'bg-slate-900 border-white/5 text-slate-500'
                }`}>
                  {step >= 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
                </div>
                <span className="text-xs font-semibold text-slate-200">Registered (New)</span>
                <span className="text-[9px] text-slate-500">Initial lead creation</span>
              </div>

              {/* Step 2: Contacted */}
              <div className="flex flex-col items-center text-center space-y-2 relative">
                {/* Horizontal connection bars */}
                <div className="absolute top-4 left-0 -translate-x-1/2 w-full h-px bg-white/5 -z-10 hidden sm:block"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-xs z-10 ${
                  step >= 2 ? 'bg-amber-500/10 border-amber-400 text-amber-400' : 'bg-slate-900 border-white/5 text-slate-500'
                }`}>
                  {step >= 2 ? (step > 2 ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4 animate-pulse" />) : '2'}
                </div>
                <span className="text-xs font-semibold text-slate-200">Contacted</span>
                <span className="text-[9px] text-slate-500">Outreach initiated</span>
              </div>

              {/* Step 3: Qualified / Lost */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-xs ${
                  step >= 3 
                    ? (lead.status === 'Qualified' ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400' : 'bg-rose-500/10 border-rose-400 text-rose-400')
                    : 'bg-slate-900 border-white/5 text-slate-500'
                }`}>
                  {step >= 3 ? <CheckCircle className="w-4 h-4" /> : '3'}
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  {lead.status === 'Lost' ? 'Lost' : 'Qualified'}
                </span>
                <span className="text-[9px] text-slate-500">Outcome state</span>
              </div>

            </div>
          </div>

          <div className="h-px bg-white/5"></div>

          {/* Timestamps Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="flex items-center space-x-3 p-4 bg-slate-900/40 border border-white/5 rounded-xl">
              <Calendar className="w-5 h-5 text-slate-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Date Registered</span>
                <span className="text-xs font-bold text-slate-300">
                  {new Date(lead.createdAt).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-slate-900/40 border border-white/5 rounded-xl">
              <Calendar className="w-5 h-5 text-slate-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Last Activity</span>
                <span className="text-xs font-bold text-slate-300">
                  {new Date(lead.updatedAt).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Edit Lead modal wrapper */}
      <LeadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSaveSuccess={fetchLeadDetails}
        lead={lead}
      />
    </Layout>
  );
};
export default LeadDetails;
