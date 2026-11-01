import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Course, CEFRLevel } from '../../types';
import { CEFRBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CourseModal } from './CourseModal';
import { CourseEnrollmentModal } from './CourseEnrollmentModal';
import { mockCourseService } from '../../services/mockCourseService';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Users, 
  Clock, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserPlus, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export const CourseListPage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const { courses, reloadAll } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState<Course | null>(null);
  const [enrollmentModalCourse, setEnrollmentModalCourse] = useState<Course | null>(null);

  // Filter courses based on role & search
  let visibleCourses = courses;
  if (role === 'teacher') {
    visibleCourses = courses.filter(c => c.teacherId === currentUser?.id);
  } else if (role === 'student') {
    visibleCourses = courses.filter(c => c.studentIds.includes(currentUser?.id || ''));
  }

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    visibleCourses = visibleCourses.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.code.toLowerCase().includes(q) ||
      c.teacherName.toLowerCase().includes(q)
    );
  }

  if (levelFilter !== 'all') {
    visibleCourses = visibleCourses.filter(c => c.level === levelFilter);
  }

  const handleDeleteCourse = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el curso "${name}"?`)) {
      mockCourseService.deleteCourse(id);
      showToast('info', 'Curso Eliminado', `El curso "${name}" fue eliminado.`);
      reloadAll();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {role === 'admin' ? 'Gestión de Cursos y Grupos' : 'Cursos y Programas'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {role === 'admin'
              ? 'Administra planes de estudio, asignación docente y nómina de matriculaciones.'
              : role === 'teacher'
              ? 'Visualiza tus comisiones asignadas, estudiantes matriculados y sus producciones.'
              : 'Tus cursos activos y talleres de redacción matriculados.'}
          </p>
        </div>

        {role === 'admin' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedCourseForEdit(null);
              setIsModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Nuevo Curso
          </Button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, código o docente..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        {/* CEFR Level filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-semibold mr-1">Nivel:</span>
          {['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                levelFilter === lvl
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === 'all' ? 'Todos' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleCourses.map(course => (
          <div
            key={course.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header: Level & Code */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <CEFRBadge level={course.level} />
                <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {course.code}
                </span>
              </div>

              {/* Course Title */}
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {course.name}
              </h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {course.description}
              </p>

              {/* Details: Teacher & Schedule */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span className="truncate"><strong>Docente:</strong> {course.teacherName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span><strong>{course.studentIds.length}</strong> alumnos matriculados</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/courses/${course.id}`)}
                className="text-xs py-1.5 flex-1 justify-center"
              >
                <span>Ver Detalles</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>

              {role === 'admin' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEnrollmentModalCourse(course)}
                    className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    title="Matricular Alumnos"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourseForEdit(course);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Editar Curso"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id, course.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Eliminar Curso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {visibleCourses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No se encontraron cursos</h3>
          <p className="text-xs text-slate-400 mt-1">Ajusta los filtros de búsqueda o nivel CEFR.</p>
        </div>
      )}

      {/* Course Create/Edit Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseToEdit={selectedCourseForEdit}
      />

      {/* Course Enrollment Modal */}
      <CourseEnrollmentModal
        isOpen={!!enrollmentModalCourse}
        onClose={() => setEnrollmentModalCourse(null)}
        course={enrollmentModalCourse}
      />
    </div>
  );
};
