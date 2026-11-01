import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { CEFRBadge, StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CourseEnrollmentModal } from './CourseEnrollmentModal';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Clock, 
  GraduationCap, 
  Calendar, 
  FileText, 
  Plus, 
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { courses, users, assignments, submissions } = useData();

  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);

  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Curso no encontrado.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/courses')} className="mt-3">
          Volver a Cursos
        </Button>
      </div>
    );
  }

  const teacher = users.find(u => u.id === course.teacherId);
  const enrolledStudents = users.filter(u => course.studentIds.includes(u.id));
  const courseAssignments = assignments.filter(a => a.courseId === course.id);
  const courseSubmissions = submissions.filter(s => s.courseId === course.id);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/courses')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al listado de cursos</span>
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CEFRBadge level={course.level} />
              <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {course.code}
              </span>
              <span className="text-xs text-slate-400">• {course.academicPeriod}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{course.name}</h1>
            <p className="text-xs text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {course.description}
            </p>
          </div>

          {(role === 'admin' || role === 'teacher') && (
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEnrollmentOpen(true)}
                icon={<Users className="w-4 h-4" />}
              >
                Matricular Alumnos ({course.studentIds.length})
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/assignments')}
                icon={<Plus className="w-4 h-4" />}
              >
                Crear Consigna
              </Button>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Docente Responsable</span>
            <div className="flex items-center gap-2">
              <img
                src={teacher?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
                alt={course.teacherName}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="font-semibold text-slate-800">{course.teacherName}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Días y Horarios</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-700">{course.schedule}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Matriculados</span>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              <span className="font-bold text-slate-800">{course.studentIds.length} Alumnos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Sections: Enrolled Students, Assignments, Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Col: Enrolled Students Roster */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              <span>Nómina de Alumnos ({enrolledStudents.length})</span>
            </h3>
            {role === 'admin' && (
              <button
                onClick={() => setIsEnrollmentOpen(true)}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                Editar
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {enrolledStudents.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No hay alumnos inscritos en este curso aún.</p>
            ) : (
              enrolledStudents.map(student => (
                <div key={student.id} className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-slate-50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-800 truncate">{student.name}</p>
                      <p className="text-[10px] text-slate-400">DNI: {student.dni}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/student-progress/${student.id}`)}
                    className="text-[11px] text-teal-700 hover:underline font-medium"
                  >
                    Ver Perfil
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Center & Right 2 Cols: Course Assignments & Submissions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Assignments */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Actividades y Consignas del Curso ({courseAssignments.length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {courseAssignments.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No hay consignas asignadas a este curso todavía.</p>
              ) : (
                courseAssignments.map(asg => (
                  <div key={asg.id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {asg.writingType}
                        </span>
                        <span className="text-[11px] text-slate-400">{asg.minWords} - {asg.maxWords} palabras</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">{asg.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Vencimiento: {new Date(asg.dueDate).toLocaleDateString()}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/assignments/${asg.id}`)}
                      className="text-xs py-1"
                    >
                      Ver Consigna
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submissions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-600" />
                <span>Entregas de los Alumnos ({courseSubmissions.length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {courseSubmissions.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No se han registrado entregas para este curso todavía.</p>
              ) : (
                courseSubmissions.map(sub => (
                  <div key={sub.id} className="p-3 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={sub.studentAvatar}
                        alt={sub.studentName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{sub.studentName}</p>
                        <p className="text-[11px] text-slate-500">{sub.assignmentTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={sub.status} size="sm" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/corrections/${sub.id}`)}
                        className="text-xs py-1"
                      >
                        Ver
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      <CourseEnrollmentModal
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        course={course}
      />
    </div>
  );
};
