import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, BarChart2, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Premium Navbar with glass effect */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo / Branding */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-500 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                  <BarChart2 className="w-5.5 h-5.5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
                    GigFlow
                  </h1>
                  <p className="text-[10px] text-purple-400/80 font-semibold tracking-wider uppercase -mt-0.5">
                    Leads Dashboard
                  </p>
                </div>
              </Link>
            </div>

            {/* Right side options: Active User profile widget & Logout */}
            {user && (
              <div className="flex items-center space-x-4">
                
                {/* User Widget */}
                <div className="hidden sm:flex items-center space-x-3 bg-slate-900/60 border border-white/5 py-1.5 pl-3 pr-4 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-white/10 text-purple-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 leading-tight">
                      {user.name}
                    </span>
                    <span className="flex items-center text-[10px] font-bold tracking-wide uppercase text-purple-400 mt-0.5">
                      {user.role === 'Admin' ? (
                        <>
                          <Shield className="w-2.5 h-2.5 mr-1 text-emerald-400" />
                          <span className="text-emerald-400">Admin</span>
                        </>
                      ) : (
                        <span className="text-blue-400">Sales Agent</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Mobile/Compact user icon */}
                <div className="sm:hidden w-8 h-8 rounded-lg bg-slate-900/80 flex items-center justify-center border border-white/5 text-purple-400">
                  <UserIcon className="w-4 h-4" />
                </div>

                {/* Separator */}
                <div className="h-6 w-px bg-white/10"></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-3.5 sm:py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 group"
                  title="Log Out"
                >
                  <LogOut className="w-4.5 h-4.5 sm:mr-2 group-hover:translate-x-0.5 transition-transform" />
                  <span className="hidden sm:inline text-xs font-medium">Log Out</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Modern minimal footer */}
      <footer className="w-full py-6 mt-auto border-t border-white/5 bg-slate-950 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} GigFlow leads engine. All rights reserved.</p>
      </footer>
    </div>
  );
};
export default Layout;
