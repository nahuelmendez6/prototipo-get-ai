import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Assignment, WritingType } from '../../types';
import { CEFRBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { AssignmentModal } from './AssignmentModal';
import { mockAssignmentService } from '../../services/mockAssignmentService';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  UploadCloud, 
  PenTool, 
  ArrowRight,
  Layers
} from 'lucide-react';

export const AssignmentListPage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const { assignments, submissions, courses, reloadAll } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignmentForEdit, setSelectedAssignmentForEdit] = useState<Assignment | null>(null);

  // Filter based on role
  let visibleAssignments = assignments;
  if (role === 'teacher') {
    visibleAssignments = assignments.filter(a => a.teacherId === currentUser?.id);
  } else if (role === 'student') {
    const enrolledCourseIds = courses.filter(c => c.studentIds.includes(currentUser?.id || '')).map(c => c.id);
    visibleAssignments = assignments.filter(a => enrolledCourseIds.includes(a.courseId));
  }

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    visibleAssignments = visibleAssignments.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.courseName.toLowerCase().includes(q) ||
      a.writingType.toLowerCase().includes(q)
    );
  }

  if (typeFilter !== 'all') {
    visibleAssignments = visibleAssignments.filter(a => a.writingType === typeFilter);
  }

  const handleDeleteAssignment = (id: string, title: string) => {
    if (confirm(`¿Estás seguro de eliminar la consigna "${title}"?`)) {
      mockAssignmentService.deleteAssignment(id);
      showToast('info', 'Consigna Eliminada', `La consigna "${title}" fue eliminada.`);
      reloadAll();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {role === 'student' ? 'Actividades de Writing Asignadas' : 'Consignas y Actividades de Redacción'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {role === 'student'
              ? 'Revisa los requisitos y envía tus redacciones en formato virtual o manuscrito.'
              : 'Configura consignas, rubros de corrección según CEFR y fechas de entrega para tus comisiones.'}
          </p>
        </div>

        {(role === 'teacher' || role === 'admin') && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedAssignmentForEdit(null);
              setIsModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Nueva Consigna
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, formato o curso..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Writing Type filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-semibold mr-1">Tipo:</span>
          {['all', 'Essay', 'Email', 'Article', 'Review', 'Story'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                typeFilter === t
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'Todos' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleAssignments.map(asg => {
          const asgSubmissions = submissions.filter(s => s.assignmentId === asg.id);
          const studentSubmission = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentUser?.id);

          return (
            <div
              key={asg.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div>
                {/* Header: Level & Type */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <CEFRBadge level={asg.cefrLevel} />
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-md">
                      {asg.writingType}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(asg.dueDate).toLocaleDateString()}</span>
                  </span>
                </div>

                {/* Title and Course */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {asg.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {asg.courseName}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {asg.description}
                </p>

                {/* Word Count & Rubric info */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Rango exigido: <strong>{asg.minWords} - {asg.maxWords} palabras</strong></span>
                  {(role === 'teacher' || role === 'admin') && (
                    <span className="text-teal-700 font-semibold">
                      {asgSubmissions.length} entregas recibidas
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/assignments/${asg.id}`)}
                  className="text-xs py-1.5"
                >
                  <span>Ver Consigna</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>

                {role === 'student' ? (
                  studentSubmission ? (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                      Entregado ✓
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/submit-handwritten?asgId=${asg.id}`)}
                        className="text-xs py-1.5"
                        icon={<UploadCloud className="w-3.5 h-3.5 text-slate-500" />}
                      >
                        Subir Foto
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/submit-virtual?asgId=${asg.id}`)}
                        className="text-xs py-1.5"
                        icon={<PenTool className="w-3.5 h-3.5" />}
                      >
                        Escribir
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedAssignmentForEdit(asg);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Editar Consigna"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(asg.id, asg.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Eliminar Consigna"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {visibleAssignments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No hay consignas disponibles</h3>
          <p className="text-xs text-slate-400 mt-1">Intenta con otros términos de búsqueda.</p>
        </div>
      )}

      {/* Modal */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assignmentToEdit={selectedAssignmentForEdit}
      />
    </div>
  );
};
