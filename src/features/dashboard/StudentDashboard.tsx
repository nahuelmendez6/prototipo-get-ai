import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge, CEFRBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  CheckCheck, 
  Award, 
  PenTool, 
  UploadCloud, 
  Clock, 
  ArrowRight,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { courses, assignments, submissions } = useData();
  const navigate = useNavigate();

  // Enrolled courses
  const myCourses = courses.filter(c => c.studentIds.includes(currentUser?.id || ''));
  const myCourseIds = myCourses.map(c => c.id);

  // Available assignments for enrolled courses
  const myAssignments = assignments.filter(a => myCourseIds.includes(a.courseId));

  // Student's submissions
  const mySubmissions = submissions.filter(s => s.studentId === currentUser?.id);
  const submittedAssignmentIds = mySubmissions.map(s => s.assignmentId);

  // Pending assignments (not yet submitted)
  const pendingAssignments = myAssignments.filter(a => !submittedAssignmentIds.includes(a.id));

  // Only published evaluations with grades are visible to students
  const publishedSubmissions = mySubmissions.filter(s => s.status === 'PUBLISHED' && s.evaluation);
  const grades = publishedSubmissions.map(s => s.evaluation?.scores?.overallGrade || 0);
  const avgGrade = grades.length > 0 ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) : '9.4';

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-900 via-blue-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-sky-950/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30">
            Portal del Estudiante • Writing Lab
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 text-white">
            ¡Hola, {currentUser?.name?.split(' ')[0] || 'Estudiante'}!
          </h1>
          <p className="text-sm text-sky-100/80 mt-1 max-w-xl">
            Mejora tus habilidades de redacción en inglés con retroalimentación detallada de tus profesores asistidos por inteligencia artificial.
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
            Subir Manuscrito
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/submit-virtual')}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold border-none text-xs"
            icon={<PenTool className="w-3.5 h-3.5" />}
          >
            Redacción Virtual
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Mis Cursos"
          value={myCourses.length}
          subtitle="Clases matriculadas"
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Consignas Pendientes"
          value={pendingAssignments.length}
          subtitle="Listas para entregar"
          icon={FileText}
          color="amber"
          trend={{ value: `${pendingAssignments.length} pendientes`, positive: pendingAssignments.length === 0 }}
        />
        <StatCard
          title="Entregas Realizadas"
          value={mySubmissions.length}
          subtitle="En proceso o corregidas"
          icon={CheckCheck}
          color="teal"
        />
        <StatCard
          title="Promedio General"
          value={`${avgGrade} / 10`}
          subtitle="En redacciones publicadas"
          icon={Award}
          color="emerald"
        />
      </div>

      {/* Main Grid: Pending Assignments & Recent Teacher Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: Assignments ready to be written */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Consignas de Redacción Disponibles
              </h3>
              <p className="text-xs text-slate-500">
                Selecciona una actividad para escribirla en línea o subir una foto de tu cuaderno
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/assignments')}
              className="text-xs font-semibold text-teal-700"
            >
              Ver todas
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {myAssignments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No tienes consignas asignadas actualmente.</p>
            ) : (
              myAssignments.map(asg => {
                const isSubmitted = submittedAssignmentIds.includes(asg.id);
                const submission = mySubmissions.find(s => s.assignmentId === asg.id);

                return (
                  <div
                    key={asg.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CEFRBadge level={asg.cefrLevel} />
                        <span className="text-xs font-semibold text-slate-500 px-2 py-0.5 rounded bg-slate-100">
                          {asg.writingType}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {asg.minWords} - {asg.maxWords} palabras
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{asg.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {asg.courseName} • Vence: {new Date(asg.dueDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0 self-end sm:self-center">
                      {isSubmitted ? (
                        <div className="flex items-center gap-2">
                          <StatusBadge status={submission?.status || 'SUBMITTED'} size="sm" />
                          {submission?.status === 'PUBLISHED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/corrections/${submission.id}`)}
                              className="text-xs py-1"
                            >
                              Ver Corrección
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/submit-handwritten?asgId=${asg.id}`)}
                            className="text-xs"
                            icon={<UploadCloud className="w-3.5 h-3.5 text-slate-500" />}
                          >
                            Foto
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/submit-virtual?asgId=${asg.id}`)}
                            className="text-xs bg-teal-600 hover:bg-teal-700"
                            icon={<PenTool className="w-3.5 h-3.5" />}
                          >
                            Escribir
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Latest Published Feedback & Grade */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Última Devolución Docente
                </h3>
              </div>
            </div>

            {publishedSubmissions.length > 0 ? (
              <div className="mt-4 space-y-4">
                {publishedSubmissions.slice(0, 1).map(sub => (
                  <div key={sub.id} className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-teal-900 truncate max-w-[180px]">
                        {sub.assignmentTitle}
                      </span>
                      <span className="text-sm font-extrabold px-2.5 py-0.5 rounded-lg bg-teal-600 text-white shadow-xs">
                        {sub.evaluation?.scores?.overallGrade} / 10
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 italic leading-relaxed bg-white p-3 rounded-xl border border-teal-100/60 shadow-2xs">
                      "{sub.evaluation?.generalFeedback || 'Excelente desempeño y coherencia textual.'}"
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-teal-800">
                      <span>Corregido por tu docente</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/corrections/${sub.id}`)}
                        className="text-teal-700 font-bold p-0 hover:bg-transparent"
                      >
                        Ver desglose →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                Tus entregas enviadas están siendo revisadas por tu profesor. Las calificaciones aparecerán aquí una vez aprobadas y publicadas.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/my-progress')}
              className="w-full text-xs font-semibold text-slate-700 justify-center"
              icon={<Award className="w-3.5 h-3.5 text-amber-500" />}
            >
              Consultar Mi Historial y Progreso
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
