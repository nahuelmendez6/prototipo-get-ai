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
  Award,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavSection {
  title: string;
  items: {
    to: string;
    label: string;
    icon: any;
    badge?: number;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();
  const { submissions } = useData();

  // Pending reviews count for teacher badge
  const pendingTeacherReviews = submissions.filter(
    s => s.status === 'PENDING_REVIEW' || s.status === 'SUBMITTED'
  ).length;

  const adminSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        { to: '/dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Assessment & Workflow',
      items: [
        { to: '/submissions', label: 'Submissions Inbox', icon: FileCheck2 },
        { to: '/assignments', label: 'Cambridge Assignments', icon: FileText },
      ],
    },
    {
      title: 'Administration',
      items: [
        { to: '/courses', label: 'Course Management', icon: BookOpen },
        { to: '/users', label: 'User Management', icon: Users },
      ],
    },
  ];

  const teacherSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        { to: '/dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Cambridge Assessment',
      items: [
        { 
          to: '/submissions', 
          label: 'Marking Inbox', 
          icon: FileCheck2,
          badge: pendingTeacherReviews > 0 ? pendingTeacherReviews : undefined 
        },
        { to: '/submit-handwritten', label: 'Upload Student Essay', icon: UploadCloud },
      ],
    },
    {
      title: 'Academic Management',
      items: [
        { to: '/assignments', label: 'Tasks & Essays', icon: FileText },
        { to: '/courses', label: 'My Courses', icon: BookOpen },
        { to: '/student-progress', label: 'Analytics & Students', icon: BarChart3 },
      ],
    },
  ];

  const studentSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        { to: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'My Writings',
      items: [
        { to: '/assignments', label: 'Assigned Tasks', icon: FileText },
        { to: '/submit-virtual', label: 'Online Writing Editor', icon: PenTool },
        { to: '/submit-handwritten', label: 'Upload Handwritten Photo', icon: UploadCloud },
        { to: '/my-progress', label: 'My Grades & Feedback', icon: Award },
      ],
    },
    {
      title: 'Academic',
      items: [
        { to: '/courses', label: 'My Active Courses', icon: BookOpen },
      ],
    },
  ];

  const sections = role === 'admin' ? adminSections : role === 'teacher' ? teacherSections : studentSections;

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
          {/* Logo brand area with Cambridge navy and crimson details */}
          <div className="h-16 flex items-center px-5 border-b border-slate-200/80 gap-3 bg-white">
            <div className="relative w-9 h-9 rounded-xl bg-[#0d3471] flex items-center justify-center text-white shadow-xs flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#c81414] rounded-full ring-2 ring-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm tracking-tight truncate">
                  Cambridge AI Studio
                </span>
              </div>
              <span className="text-[10px] text-[#0d3471] font-bold tracking-wider uppercase block">
                Assessment System
              </span>
            </div>
          </div>

          {/* Navigation Links grouped logically */}
          <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => onClose()}
                      className={({ isActive }) =>
                        `group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-[#0d3471]/10 text-[#0d3471] font-semibold'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-[#0d3471]" />
                          )}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 flex-shrink-0 transition-colors ${
                                isActive ? 'text-[#0d3471]' : 'text-slate-400 group-hover:text-slate-700'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#c81414] text-white shadow-xs animate-pulse">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom Card / Protocol Information */}
          <div className="p-3 border-t border-slate-200/80 bg-slate-50/50">
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-xs shadow-2xs">
              <div className="flex items-center gap-2 text-slate-800 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4 text-[#0d3471]" />
                <span className="text-[11px]">Cambridge Protocol</span>
                <span className="ml-auto w-2 h-2 rounded-full bg-[#c81414]" title="Mandatory verification active" />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                All AI evaluations require teacher verification before being published to the student.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
