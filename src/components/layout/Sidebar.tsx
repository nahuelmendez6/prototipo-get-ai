import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  FileCheck2, 
  Users, 
  UploadCloud, 
  PenTool, 
  BarChart3, 
  Sparkles,
  ShieldAlert,
  Award
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: any;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, currentUser } = useAuth();
  const { submissions } = useData();

  // Pending reviews count for teacher badge
  const pendingTeacherReviews = submissions.filter(s => s.status === 'PENDING_REVIEW' || s.status === 'SUBMITTED').length;

  const adminNav: NavItem[] = [
    { to: '/dashboard', label: 'Panel General', icon: LayoutDashboard },
    { to: '/courses', label: 'Gestión de Cursos', icon: BookOpen },
    { to: '/assignments', label: 'Actividades de Writing', icon: FileText },
    { to: '/submissions', label: 'Entregas y Evaluaciones', icon: FileCheck2 },
    { to: '/users', label: 'Gestión de Usuarios', icon: Users },
  ];

  const teacherNav: NavItem[] = [
    { to: '/dashboard', label: 'Mi Dashboard', icon: LayoutDashboard },
    { to: '/courses', label: 'Mis Cursos', icon: BookOpen },
    { to: '/assignments', label: 'Mis Consignas', icon: FileText },
    { 
      to: '/submissions', 
      label: 'Correcciones y Envíos', 
      icon: FileCheck2,
      badge: pendingTeacherReviews > 0 ? pendingTeacherReviews : undefined 
    },
    { to: '/submit-handwritten', label: 'Subir Manuscrito (Alumno)', icon: UploadCloud },
    { to: '/student-progress', label: 'Progreso de Estudiantes', icon: BarChart3 },
  ];

  const studentNav: NavItem[] = [
    { to: '/dashboard', label: 'Mi Panel', icon: LayoutDashboard },
    { to: '/courses', label: 'Mis Cursos', icon: BookOpen },
    { to: '/assignments', label: 'Consignas Activas', icon: FileText },
    { to: '/submit-virtual', label: 'Redacción Virtual', icon: PenTool },
    { to: '/submit-handwritten', label: 'Entregar Manuscrito', icon: UploadCloud },
    { to: '/my-progress', label: 'Mis Notas y Feedback', icon: Award },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : studentNav;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo brand area */}
          <div className="h-16 flex items-center px-6 border-b border-slate-200/80 gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm tracking-tight block">
                AI Writing Assistant
              </span>
              <span className="text-[10px] text-teal-600 font-semibold tracking-wider uppercase block">
                Educational Engine
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menú Principal ({role.toUpperCase()})
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Bottom Card / System Information */}
          <div className="p-4 border-t border-slate-200/80">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-semibold mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-teal-600" />
                <span>Simulador Docente</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Las correcciones de IA requieren validación y publicación docente antes de ser visibles para alumnos.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
