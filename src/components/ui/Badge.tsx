import React from 'react';
import { SubmissionStatus, UserRole, CEFRLevel } from '../../types';
import { 
  Clock, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  CheckCheck,
  Shield, 
  GraduationCap, 
  BookOpen 
} from 'lucide-react';

interface StatusBadgeProps {
  status: SubmissionStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = {
    SUBMITTED: {
      label: 'Submitted',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Clock,
    },
    PROCESSING: {
      label: 'AI Analyzing...',
      bg: 'bg-[#0d3471]/10 text-[#0d3471] border-[#0d3471]/30 animate-pulse',
      icon: Sparkles,
    },
    PENDING_REVIEW: {
      label: 'Pending Review',
      bg: 'bg-amber-50 text-amber-900 border-amber-200/90 font-medium',
      icon: Clock,
    },
    NEEDS_REVISION: {
      label: 'Needs Revision',
      bg: 'bg-red-50 text-[#c81414] border-red-200 font-semibold',
      icon: AlertCircle,
    },
    APPROVED: {
      label: 'Approved by Teacher',
      bg: 'bg-blue-50 text-[#0d3471] border-blue-200 font-medium',
      icon: CheckCircle,
    },
    PUBLISHED: {
      label: 'Grade Published',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
      icon: CheckCheck,
    },
  }[status] || {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
  };

  const Icon = config.icon;
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  return (
    <span className={`inline-flex items-center font-medium rounded-full border shadow-2xs ${config.bg} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
};

export const RoleBadge: React.FC<{ role: UserRole; size?: 'sm' | 'md' }> = ({ role, size = 'md' }) => {
  const config = {
    admin: {
      label: 'Administrator',
      bg: 'bg-slate-100 text-slate-800 border-slate-300 font-semibold',
      icon: Shield,
    },
    teacher: {
      label: 'Teacher',
      bg: 'bg-blue-50 text-[#0d3471] border-blue-200 font-semibold',
      icon: BookOpen,
    },
    student: {
      label: 'Student',
      bg: 'bg-sky-50 text-sky-800 border-sky-200 font-semibold',
      icon: GraduationCap,
    },
  }[role];

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${sizeClasses}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

export const CEFRBadge: React.FC<{ level: CEFRLevel }> = ({ level }) => {
  const colors: Record<CEFRLevel, string> = {
    A1: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    A2: 'bg-green-50 text-green-800 border-green-200',
    B1: 'bg-sky-50 text-sky-800 border-sky-200',
    B2: 'bg-[#0d3471]/10 text-[#0d3471] border-[#0d3471]/30 font-bold',
    C1: 'bg-slate-900 text-white border-slate-900 font-bold shadow-2xs',
    C2: 'bg-[#c81414]/10 text-[#c81414] border-[#c81414]/30 font-bold',
  };

  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-md border ${colors[level] || 'bg-slate-100 font-medium'}`}>
      CEFR {level}
    </span>
  );
};
