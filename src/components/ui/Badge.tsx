import React from 'react';
import { SubmissionStatus, UserRole, CEFRLevel } from '../../types';
import { 
  Clock, 
  Sparkles, 
  CheckCircle, 
  Send, 
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
      label: 'Enviado',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Clock,
    },
    PROCESSING: {
      label: 'Procesando IA...',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse',
      icon: Sparkles,
    },
    PENDING_REVIEW: {
      label: 'Pendiente de Revisión',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock,
    },
    NEEDS_REVISION: {
      label: 'Requiere Corrección',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertCircle,
    },
    APPROVED: {
      label: 'Aprobado por Docente',
      bg: 'bg-teal-50 text-teal-800 border-teal-200',
      icon: CheckCircle,
    },
    PUBLISHED: {
      label: 'Publicado a Alumno',
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
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  return (
    <span className={`inline-flex items-center font-medium rounded-full border shadow-sm ${config.bg} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
};

export const RoleBadge: React.FC<{ role: UserRole; size?: 'sm' | 'md' }> = ({ role, size = 'md' }) => {
  const config = {
    admin: {
      label: 'Administrador',
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Shield,
    },
    teacher: {
      label: 'Docente',
      bg: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: BookOpen,
    },
    student: {
      label: 'Estudiante',
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: GraduationCap,
    },
  }[role];

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${sizeClasses}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

export const CEFRBadge: React.FC<{ level: CEFRLevel }> = ({ level }) => {
  const colors: Record<CEFRLevel, string> = {
    A1: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    A2: 'bg-green-50 text-green-700 border-green-200',
    B1: 'bg-blue-50 text-blue-700 border-blue-200',
    B2: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    C1: 'bg-purple-50 text-purple-700 border-purple-200',
    C2: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md border ${colors[level] || 'bg-slate-100'}`}>
      CEFR {level}
    </span>
  );
};
