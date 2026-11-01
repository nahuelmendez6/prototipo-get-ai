import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge, CEFRBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle, 
  UploadCloud, 
  Plus, 
  Sparkles, 
  Calendar, 
  AlertCircle,
  ArrowRight,
  FileText
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { courses, assignments, submissions } = useData();
  const navigate = useNavigate();

  // Filter courses assigned to this teacher
  const myCourses = courses.filter(c => c.teacherId === currentUser?.id);
  const myCourseIds = myCourses.map(c => c.id);

  // Total enrolled students across teacher's courses
  const studentIdSet = new Set<string>();
  myCourses.forEach(c => c.studentIds.forEach(id => studentIdSet.add(id)));
  const totalStudents = studentIdSet.size;

  // Submissions for this teacher's courses
  const mySubmissions = submissions.filter(s => myCourseIds.includes(s.courseId));
  const pendingReviewSubmissions = mySubmissions.filter(s => s.status === 'PENDING_REVIEW' || s.status === 'SUBMITTED');
  const publishedSubmissions = mySubmissions.filter(s => s.status === 'PUBLISHED');

  // Teacher's assignments
  const myAssignments = assignments.filter(a => a.teacherId === currentUser?.id);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-teal-950/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30">
            Panel Docente • English Department
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 text-white">
            Hola, {currentUser?.name || 'Profesor/a'}
          </h1>
          <p className="text-sm text-teal-100/80 mt-1 max-w-xl">
            Gestiona tus cursos, revisa las correcciones generadas por IA, edita feedback pedagógico y publica notas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/submit-handwritten')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-xs text-xs"
            icon={<UploadCloud className="w-3.5 h-3.5" />}
          >
            Subir Foto Manuscrita
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/assignments')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none text-xs"
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Nueva Consigna
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Mis Cursos Asignados"
          value={myCourses.length}
          subtitle="Grupos activos"
          icon={BookOpen}
          color="teal"
        />
        <StatCard
          title="Estudiantes Activos"
          value={totalStudents}
          subtitle="Alumnos a cargo"
          icon={Users}
          color="sky"
        />
        <StatCard
          title="Pendientes de Revisión"
          value={pendingReviewSubmissions.length}
          subtitle="IA ha sugerido corrección"
          icon={Sparkles}
          color="amber"
          trend={{ value: `${pendingReviewSubmissions.length} listas`, positive: false }}
        />
        <StatCard
          title="Correcciones Publicadas"
          value={publishedSubmissions.length}
          subtitle="Visibles para los alumnos"
          icon={CheckCircle}
          color="emerald"
        />
      </div>

      {/* Main Grid: Pending reviews & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: Submissions Awaiting Teacher Review (Priority) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Entregas que requieren tu Revisión
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                La IA ha analizado estas producciones. Revisa, edita las notas y aprueba para publicar.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/submissions')}
              className="text-xs font-semibold text-teal-700"
            >
              Ver todas ({mySubmissions.length})
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {pendingReviewSubmissions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No tienes correcciones pendientes de revisión en este momento.
              </div>
            ) : (
              pendingReviewSubmissions.map(sub => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={sub.studentAvatar}
                      alt={sub.studentName}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{sub.studentName}</span>
                        <span className="text-[10px] text-slate-400">({sub.submissionType === 'handwritten' ? 'Manuscrito' : 'Virtual'})</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">
                        {sub.assignmentTitle}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {sub.courseName} • {sub.wordCount} palabras
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-center">
                    <StatusBadge status={sub.status} size="sm" />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/corrections/${sub.id}`)}
                      className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold py-1.5 px-3"
                      icon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                    >
                      Revisar Corrección IA
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Active Assignments & Deadlines */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Próximos Vencimientos
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/assignments')}
                className="text-xs font-semibold text-teal-700"
              >
                Gestionar
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {myAssignments.slice(0, 4).map(asg => (
                <div key={asg.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <CEFRBadge level={asg.cefrLevel} />
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>{new Date(asg.dueDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{asg.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{asg.courseName}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student-progress')}
              className="w-full text-xs font-semibold text-slate-700 justify-center"
              icon={<Users className="w-3.5 h-3.5" />}
            >
              Ver Rendimiento General de Alumnos
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
