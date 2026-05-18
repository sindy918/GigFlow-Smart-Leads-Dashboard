import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { Layout } from '../components/Layout';
import { LeadModal } from '../components/LeadModal';
import { 
  Search, Plus, FileSpreadsheet, Eye, Edit2, Trash2, 
  ChevronLeft, ChevronRight, RefreshCw, AlertCircle, HelpCircle
} from 'lucide-react';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // Leads list states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('latest');

  // Modal actions states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLead, setActiveLead] = useState<Lead | null>(null); // Null = Add Lead mode
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 1. Debounced Search Handler
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // reset to page 1 on new search
    }, 450);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset page when filters change
  const handleFilterChange = (type: 'status' | 'source' | 'sort', value: string) => {
    if (type === 'status') setStatusFilter(value);
    if (type === 'source') setSourceFilter(value);
    if (type === 'sort') setSortOrder(value);
    setPage(1);
  };

  // 2. Fetch Leads from Backend
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: debouncedSearch,
        status: statusFilter,
        source: sourceFilter,
        sort: sortOrder
      });

      const res = await fetch(`${API_URL}/leads?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setLeads(data.leads);
        setTotalPages(data.totalPages);
        setTotalLeads(data.totalLeads);
      } else {
        setError(data.message || 'Failed to fetch leads list');
      }
    } catch (err) {
      console.error('Fetch leads error:', err);
      setError('Failed to establish connection to database server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [token, page, debouncedSearch, statusFilter, sourceFilter, sortOrder]);

  // 3. Delete Lead Trigger (Admin Only)
  const handleDeleteLead = async (id: string) => {
    if (user?.role !== 'Admin') {
      alert('Forbidden: Only Administrators are allowed to delete leads.');
      return;
    }

    if (!window.confirm('Are you completely sure you want to permanently delete this lead?')) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/leads/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        fetchLeads();
      } else {
        alert(data.message || 'Failed to delete lead');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Network error while deleting lead');
    } finally {
      setDeletingId(null);
    }
  };

  // 4. Secure Filter-Aware CSV Export (Admin Only)
  const handleCSVExport = async () => {
    if (user?.role !== 'Admin') return;

    try {
      const queryParams = new URLSearchParams({
        search: debouncedSearch,
        status: statusFilter,
        source: sourceFilter,
        sort: sortOrder
      });

      const res = await fetch(`${API_URL}/leads/export/csv?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Server returned error during export');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `GigFlow_Leads_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV Export failed:', err);
      alert('Failed to export leads to CSV: ' + (err as Error).message);
    }
  };

  // Status Badge Tailored Styling Picker
  const getStatusBadge = (status: Lead['status']) => {
    const config = {
      New: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25',
      Contacted: 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
      Qualified: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
      Lost: 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold leading-tight ${config[status]}`}>
        {status}
      </span>
    );
  };

  // Source Badge Tailored Styling Picker
  const getSourceBadge = (source: Lead['source']) => {
    const config = {
      Website: 'text-sky-400 bg-sky-500/5 border border-sky-500/10',
      Instagram: 'text-pink-400 bg-pink-500/5 border border-pink-500/10',
      Referral: 'text-purple-400 bg-purple-500/5 border border-purple-500/10',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${config[source]}`}>
        {source}
      </span>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">

        {/* Dashboard Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Smart Leads Dashboard</h2>
            <p className="text-sm text-slate-400">Manage, qualify, and convert acquisition channels seamlessly</p>
          </div>
          <div className="flex items-center space-x-3">
            
            {/* CSV Export Button (Visible only to Admin) */}
            {user?.role === 'Admin' && (
              <button
                onClick={handleCSVExport}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-white/10 hover:border-white/20 active:scale-98 transition-all"
                title="Export matching leads to CSV"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            )}

            {/* Register Lead Modal Trigger */}
            <button
              onClick={() => {
                setActiveLead(null);
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4.5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-98 transition-all"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Add Lead</span>
            </button>

          </div>
        </div>

        {/* Filters, Searching & Sorting panel */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative md:col-span-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search leads name / email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input font-medium"
              />
            </div>

            {/* Filter by Status */}
            <div className="flex items-center space-x-2.5">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider shrink-0">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm glass-input font-medium bg-slate-900 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Filter by Source */}
            <div className="flex items-center space-x-2.5">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider shrink-0">Source</span>
              <select
                value={sourceFilter}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm glass-input font-medium bg-slate-900 cursor-pointer"
              >
                <option value="All">All Channels</option>
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center space-x-2.5">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider shrink-0">Sort</span>
              <select
                value={sortOrder}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm glass-input font-medium bg-slate-900 cursor-pointer"
              >
                <option value="latest">Latest Received</option>
                <option value="oldest">Oldest Received</option>
              </select>
            </div>

          </div>
        </div>

        {/* Database Lead Table */}
        <div className="glass-panel rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
          
          {error && (
            <div className="flex items-center justify-between p-4.5 bg-rose-500/10 border-b border-rose-500/20 text-rose-300 text-sm">
              <div className="flex items-center space-x-2.5">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
              <button 
                onClick={fetchLeads}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/25 hover:bg-rose-500/25 text-xs text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 text-slate-400 border-b border-white/5 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Lead Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Date Registered</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm font-medium text-slate-300">
                {loading ? (
                  // Skeleton Loading Rows
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4.5">
                        <div className="h-4.5 bg-slate-800 rounded-lg w-44 mb-2"></div>
                        <div className="h-3.5 bg-slate-800 rounded-lg w-52"></div>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="h-6 bg-slate-800 rounded-full w-20"></div>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="h-5.5 bg-slate-800 rounded-lg w-20"></div>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="h-4 bg-slate-800 rounded-lg w-24"></div>
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <div className="h-8.5 bg-slate-800 rounded-xl w-32 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  // Empty State Rows
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3.5 max-w-sm mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/10 text-slate-500">
                          <HelpCircle className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white tracking-wide">No leads found</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            We couldn't find any lead matching your search query or cumulative filtering conditions.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('All');
                            setSourceFilter('All');
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-850 hover:bg-slate-800 text-purple-400 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data Rows
                  leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors">
                      
                      {/* Name & Email */}
                      <td className="px-6 py-4.5">
                        <div className="flex flex-col">
                          <span className="text-slate-100 font-semibold text-sm">{lead.name}</span>
                          <span className="text-slate-400 text-xs mt-0.5">{lead.email}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4.5">
                        {getStatusBadge(lead.status)}
                      </td>

                      {/* Source */}
                      <td className="px-6 py-4.5">
                        {getSourceBadge(lead.source)}
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4.5">
                        <span className="text-xs font-semibold text-slate-400">
                          {new Date(lead.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          
                          {/* Details Icon */}
                          <button
                            onClick={() => navigate(`/leads/${lead._id}`)}
                            className="w-8.5 h-8.5 rounded-lg flex items-center justify-center border border-white/5 hover:border-white/15 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-900 transition-all duration-200"
                            title="View single lead details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Icon */}
                          <button
                            onClick={() => {
                              setActiveLead(lead);
                              setIsModalOpen(true);
                            }}
                            className="w-8.5 h-8.5 rounded-lg flex items-center justify-center border border-white/5 hover:border-white/15 text-slate-400 hover:text-brand-400 bg-slate-900/60 hover:bg-slate-900 transition-all duration-200"
                            title="Edit lead details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Icon (Visible only based on User Role - Admin check) */}
                          {user?.role === 'Admin' && (
                            <button
                              onClick={() => handleDeleteLead(lead._id)}
                              className="w-8.5 h-8.5 rounded-lg flex items-center justify-center border border-white/5 hover:border-rose-500/25 text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-500/10 active:scale-95 transition-all duration-200"
                              disabled={deletingId === lead._id}
                              title="Delete lead from dashboard"
                            >
                              {deletingId === lead._id ? (
                                <div className="w-3.5 h-3.5 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          {!loading && leads.length > 0 && (
            <div className="px-6 py-4 bg-slate-900/40 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3.5">
              
              {/* Pagination info details */}
              <div className="text-xs text-slate-400 font-semibold">
                Showing{' '}
                <span className="text-slate-200">
                  {Math.min(totalLeads, (page - 1) * limit + 1)}
                </span>
                -
                <span className="text-slate-200">
                  {Math.min(totalLeads, page * limit)}
                </span>{' '}
                of <span className="text-slate-200">{totalLeads}</span> leads matching
              </div>

              {/* Pagination control buttons */}
              <div className="flex items-center space-x-1.5">
                
                {/* Previous Button */}
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="w-8.5 h-8.5 rounded-xl border border-white/5 hover:border-white/10 flex items-center justify-center text-slate-400 hover:text-white bg-slate-900 disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const targetPage = idx + 1;
                  const isActive = page === targetPage;
                  return (
                    <button
                      key={targetPage}
                      onClick={() => setPage(targetPage)}
                      className={`w-8.5 h-8.5 rounded-xl text-xs font-bold transition-all border ${
                        isActive
                          ? 'bg-gradient-to-tr from-brand-600 to-purple-600 text-white border-transparent'
                          : 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {targetPage}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="w-8.5 h-8.5 rounded-xl border border-white/5 hover:border-white/10 flex items-center justify-center text-slate-400 hover:text-white bg-slate-900 disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* Unified Add/Edit Lead Modal dialog component */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveLead(null);
        }}
        onSaveSuccess={fetchLeads}
        lead={activeLead}
      />

    </Layout>
  );
};
export default Dashboard;
