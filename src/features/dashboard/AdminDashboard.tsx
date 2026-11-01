import React from 'react';
import { useData } from '../../contexts/DataContext';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge, CEFRBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileCheck2, 
  Clock, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Activity,
  Award
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, courses, assignments, submissions, activityLogs } = useData();
  const navigate = useNavigate();

  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');
  const pendingCorrections = submissions.filter(s => s.status === 'PENDING_REVIEW' || s.status === 'SUBMITTED');

  // Calculate average published grade
  const publishedSubmissions = submissions.filter(s => s.status === 'PUBLISHED' && s.evaluation?.scores?.overallGrade);
  const avgGrade = publishedSubmissions.length > 0
    ? (publishedSubmissions.reduce((acc, curr) => acc + (curr.evaluation?.scores?.overallGrade || 0), 0) / publishedSubmissions.length).toFixed(1)
    : '8.5';

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-purple-950/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
            Panel de Administración Institucional
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 text-white">
            Resumen General de Rendimiento
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Supervisa cursos, docentes, inscripciones y el flujo completo de evaluación asistida por IA en el instituto.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/users')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-xs text-xs"
            icon={<Users className="w-3.5 h-3.5" />}
          >
            Gestionar Usuarios
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/courses')}
            className="bg-teal-500 hover:bg-teal-600 text-white border-none text-xs"
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Nuevo Curso
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Alumnos Inscritos"
          value={students.length}
          subtitle="En cursos activos"
          icon={GraduationCap}
          color="sky"
          trend={{ value: '+12% este mes', positive: true }}
        />
        <StatCard
          title="Docentes a Cargo"
          value={teachers.length}
          subtitle="Profesores de redacción"
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Cursos Activos"
          value={courses.length}
          subtitle="Cambridge & General"
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Correcciones Pendientes"
          value={pendingCorrections.length}
          subtitle="Esperando revisión docente"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Main Sections: Recent Submissions & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Submissions overview */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Últimas Entregas de Redacción
                </h3>
                <p className="text-xs text-slate-500">
                  Flujo de entregas manuscritas y virtuales en tiempo real
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/submissions')}
                className="text-xs font-semibold text-teal-700"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {submissions.slice(0, 5).map(sub => (
                <div key={sub.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={sub.studentAvatar}
                      alt={sub.studentName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {sub.assignmentTitle}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {sub.studentName} • {sub.courseName} • <span className="capitalize">{sub.submissionType === 'handwritten' ? 'Manuscrito' : 'Virtual'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={sub.status} size="sm" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/corrections/${sub.id}`)}
                      className="text-xs py-1 px-2.5"
                    >
                      Inspeccionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-600" />
              <span>Promedio de Calificación Institucional: <strong>{avgGrade} / 10</strong></span>
            </span>
            <span className="text-slate-400">Total acumulado: {submissions.length} entregas</span>
          </div>
        </div>

        {/* Right Col: Activity Feed */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">
                Bitácora de Actividad
              </h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              En vivo
            </span>
          </div>

          <div className="mt-4 flex-1 space-y-4 overflow-y-auto max-h-[380px] pr-1">
            {activityLogs.map(log => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 leading-snug">
                    {log.userName} <span className="font-normal text-slate-500">({log.role})</span>
                  </p>
                  <p className="text-[11px] text-teal-700 font-medium">
                    {log.action}: <span className="text-slate-700">{log.target}</span>
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Registros auditables en el navegador (localStorage)
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
