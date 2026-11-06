import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LogOut, 
  Menu, 
  GraduationCap, 
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { currentUser, role, logout, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Institute brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl bg-[#0d3471] flex items-center justify-center text-white shadow-2xs">
              <GraduationCap className="w-4 h-4 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#c81414] rounded-full ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">
                  Cambridge AI Studio
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#0d3471]/10 text-[#0d3471] border border-[#0d3471]/20">
                  B2 First / C1 Advanced
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Minimalist Role Switcher */}
        <div className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
          <span className="text-[11px] font-semibold text-slate-500 px-2.5 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#0d3471]" />
            <span>Mode:</span>
          </span>
          <button
            onClick={() => loginAsDemo('admin')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              role === 'admin'
                ? 'bg-white text-[#0d3471] shadow-2xs border border-slate-200/90'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => loginAsDemo('teacher')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              role === 'teacher'
                ? 'bg-white text-[#0d3471] shadow-2xs border border-slate-200/90'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => loginAsDemo('student')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              role === 'student'
                ? 'bg-white text-[#0d3471] shadow-2xs border border-slate-200/90'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student
          </button>
        </div>

        {/* Right: Current User & Logout */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 text-right">
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    ID: {currentUser.dni}
                  </p>
                </div>
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#0d3471]/20 shadow-2xs"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-[#c81414] hover:bg-red-50 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-semibold text-[#0d3471] hover:underline"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
