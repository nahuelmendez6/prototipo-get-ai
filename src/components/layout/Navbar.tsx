import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RoleBadge } from '../ui/Badge';
import { 
  LogOut, 
  Menu, 
  Sparkles, 
  GraduationCap, 
  Building2, 
  ChevronRight,
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
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Institute info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">
                  AI Writing Assistant
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>Instituto de Lenguas Vivas • Ciclo Lectivo 2026</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick Role Switcher Buttons */}
        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70">
          <span className="text-[11px] font-semibold text-slate-500 px-2.5 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Rol:</span>
          </span>
          <button
            onClick={() => loginAsDemo('admin')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              role === 'admin'
                ? 'bg-white text-purple-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => loginAsDemo('teacher')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              role === 'teacher'
                ? 'bg-white text-teal-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Docente
          </button>
          <button
            onClick={() => loginAsDemo('student')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              role === 'student'
                ? 'bg-white text-sky-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alumno
          </button>
        </div>

        {/* Right: Current User & Logout */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 text-right">
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    DNI: {currentUser.dni}
                  </p>
                </div>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 shadow-xs"
                />
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
