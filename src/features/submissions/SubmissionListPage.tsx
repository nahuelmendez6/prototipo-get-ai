import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { SubmissionStatus } from '../../types';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  FileCheck2, 
  Search, 
  UploadCloud, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  Eye, 
  Filter,
  ImageIcon,
  PenTool
} from 'lucide-react';

export const SubmissionListPage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const { submissions, courses } = useData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Filter submissions by role
  let visibleSubmissions = submissions;
  if (role === 'teacher') {
    const teacherCourseIds = courses.filter(c => c.teacherId === currentUser?.id).map(c => c.id);
    visibleSubmissions = submissions.filter(s => teacherCourseIds.includes(s.courseId));
  } else if (role === 'student') {
    visibleSubmissions = submissions.filter(s => s.studentId === currentUser?.id);
  }

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    visibleSubmissions = visibleSubmissions.filter(s =>
      s.studentName.toLowerCase().includes(q) ||
      s.assignmentTitle.toLowerCase().includes(q) ||
      s.courseName.toLowerCase().includes(q)
    );
  }

  if (statusFilter !== 'all') {
    visibleSubmissions = visibleSubmissions.filter(s => s.status === statusFilter);
  }

  if (typeFilter !== 'all') {
    visibleSubmissions = visibleSubmissions.filter(s => s.submissionType === typeFilter);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {role === 'student' ? 'Mis Entregas y Evaluaciones' : 'Bandeja de Entregas y Correcciones'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {role === 'student'
              ? 'Consulta el estado de tus escritos y accede a las devoluciones aprobadas por tus profesores.'
              : 'Flujo de revisión docente: revisa las sugerencias de la IA, edita el feedback y publica las calificaciones.'}
          </p>
        </div>

        {role !== 'student' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/submit-handwritten')}
            icon={<UploadCloud className="w-4 h-4" />}
          >
            Subir Foto Manuscrita
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por estudiante, consigna o curso..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none font-medium text-slate-700"
          >
            <option value="all">Todos los Estados</option>
            <option value="PENDING_REVIEW">Pendiente de Revisión</option>
            <option value="SUBMITTED">Enviado (Sin procesar)</option>
            <option value="NEEDS_REVISION">Requiere Corrección</option>
            <option value="APPROVED">Aprobado por Docente</option>
            <option value="PUBLISHED">Publicado al Alumno</option>
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none font-medium text-slate-700"
          >
            <option value="all">Todos los Formatos</option>
            <option value="handwritten">Manuscrito (Foto)</option>
            <option value="virtual">Virtual (En línea)</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Estudiante</th>
                <th className="py-3 px-4">Consigna / Curso</th>
                <th className="py-3 px-4">Formato</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Extensión</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {visibleSubmissions.map(sub => {
                const isStudent = role === 'student';
                const isPublished = sub.status === 'PUBLISHED';

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={sub.studentAvatar}
                          alt={sub.studentName}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{sub.studentName}</p>
                          <p className="text-[11px] text-slate-400">{sub.studentEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-semibold text-slate-900 truncate">{sub.assignmentTitle}</p>
                      <p className="text-[11px] text-slate-500 truncate">{sub.courseName}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {sub.submissionType === 'handwritten' ? (
                          <>
                            <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                            <span>Manuscrito</span>
                          </>
                        ) : (
                          <>
                            <PenTool className="w-3.5 h-3.5 text-teal-600" />
                            <span>Virtual</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      {sub.wordCount} palabras
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={sub.status} size="sm" />
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isStudent && !isPublished ? (
                        <span className="text-[11px] text-slate-400 italic">
                          En revisión docente
                        </span>
                      ) : (
                        <Button
                          variant={sub.status === 'PENDING_REVIEW' ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => navigate(`/corrections/${sub.id}`)}
                          className="text-xs py-1"
                          icon={sub.status === 'PENDING_REVIEW' ? <Sparkles className="w-3.5 h-3.5 text-amber-300" /> : <Eye className="w-3.5 h-3.5" />}
                        >
                          {role === 'student' ? 'Ver Corrección' : sub.status === 'PENDING_REVIEW' ? 'Revisar IA' : 'Ver Detalle'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {visibleSubmissions.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No se encontraron entregas que coincidan con los filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
};
