import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { CEFRBadge, StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  ArrowLeft, 
  Award, 
  BookOpen, 
  FileCheck2, 
  TrendingUp, 
  AlertCircle, 
  Sparkles,
  Calendar,
  CheckCircle,
  Eye,
  BarChart2
} from 'lucide-react';

export const StudentProfilePage: React.FC<{ isSelf?: boolean }> = ({ isSelf = false }) => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();
  const { users, courses, submissions } = useData();

  // If viewing self or by id
  const targetId = isSelf ? currentUser?.id : (studentId || currentUser?.id);
  const student = users.find(u => u.id === targetId);

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Estudiante no encontrado.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mt-3">
          Regresar
        </Button>
      </div>
    );
  }

  // Student's enrolled courses
  const enrolledCourses = courses.filter(c => c.studentIds.includes(student.id));

  // Student's submissions
  const studentSubmissions = submissions.filter(s => s.studentId === student.id);
  const publishedSubmissions = studentSubmissions.filter(s => s.status === 'PUBLISHED' && s.evaluation);

  // Grades calculation
  const grades = publishedSubmissions.map(s => s.evaluation?.scores?.overallGrade || 0);
  const avgGrade = grades.length > 0 ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) : '9.0';

  // Common mistakes aggregation across submissions
  const allMistakes = publishedSubmissions.flatMap(s => s.evaluation?.mistakes || []);
  const mistakeCountsByType: Record<string, number> = {};
  allMistakes.forEach(m => {
    mistakeCountsByType[m.type] = (mistakeCountsByType[m.type] || 0) + 1;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back button */}
      {!isSelf && (
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover ring-4 ring-teal-50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{student.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                Estudiante
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {student.email} • <strong>DNI: {student.dni}</strong> • Tel: {student.phone || '+54 11 3912-7744'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {enrolledCourses.map(c => (
                <span key={c.id} className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {c.code}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Global Summary Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Promedio</span>
            <span className="text-xl font-black text-teal-900 font-mono">{avgGrade}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Entregas</span>
            <span className="text-xl font-bold text-slate-800">{studentSubmissions.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Aprobadas</span>
            <span className="text-xl font-bold text-emerald-700">{publishedSubmissions.length}</span>
          </div>
        </div>
      </div>

      {/* Progress Chart / Evolution Over Time */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <span>Evolución de Rendimiento en Redacción (Writing Evolution)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Calificaciones obtenidas en trabajos prácticos evaluados
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
            Meta CEFR: B2 / C1
          </span>
        </div>

        {/* CSS-based Bar Chart */}
        <div className="pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 items-end h-48 border-b border-slate-200 pb-2">
            {publishedSubmissions.length > 0 ? (
              publishedSubmissions.map((sub, idx) => {
                const grade = sub.evaluation?.scores?.overallGrade || 8.0;
                const heightPercent = Math.min(100, Math.max(15, (grade / 10) * 100));

                return (
                  <div key={sub.id} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-xs font-bold text-teal-900 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {grade.toFixed(1)}
                    </span>
                    <div
                      className="w-full max-w-[48px] bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-xs flex items-center justify-center text-white text-[10px] font-bold pb-1"
                      style={{ height: `${heightPercent}%` }}
                    >
                      {grade}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium truncate max-w-[80px] text-center">
                      Act #{idx + 1}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full h-full flex items-center justify-center text-xs text-slate-400">
                Aún no hay calificaciones publicadas para trazar el gráfico de evolución.
              </div>
            )}
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-2">
            <span>Inicio del Ciclo</span>
            <span>Escala 1 - 10</span>
            <span>Evaluación Actual</span>
          </div>
        </div>
      </div>

      {/* Grid: Common Mistakes & Submission History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Common Mistakes Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Patrones Frecuentes de Error</span>
          </h3>

          <div className="space-y-3">
            {[
              { type: 'grammar', label: 'Gramática y Tiempos Verbales', count: mistakeCountsByType['grammar'] || 2, color: 'bg-indigo-500' },
              { type: 'style', label: 'Estilo y Registro Formal', count: mistakeCountsByType['style'] || 1, color: 'bg-rose-500' },
              { type: 'spelling', label: 'Ortografía y Tipos', count: mistakeCountsByType['spelling'] || 1, color: 'bg-amber-500' },
              { type: 'punctuation', label: 'Puntuación y Guiones', count: mistakeCountsByType['punctuation'] || 1, color: 'bg-sky-500' },
            ].map(item => (
              <div key={item.type} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.count} observ.</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${Math.min(100, item.count * 25)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 text-[11px] text-teal-900 leading-relaxed">
            <strong>Recomendación general del docente:</strong> Repasar conectores formales y evitar contracciones informales (don't, can't) en redacciones de examen Cambridge.
          </div>
        </div>

        {/* Right 2 Columns: Full Submission History */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-teal-600" />
              <span>Historial de Redacciones ({studentSubmissions.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {studentSubmissions.map(sub => {
              const isPublished = sub.status === 'PUBLISHED';

              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {sub.submissionType === 'handwritten' ? 'Manuscrito' : 'Virtual'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900">{sub.assignmentTitle}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{sub.courseName} • {sub.wordCount} palabras</p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-center">
                    <StatusBadge status={sub.status} size="sm" />

                    {isPublished && sub.evaluation?.scores?.overallGrade && (
                      <span className="text-xs font-extrabold text-teal-900 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg font-mono">
                        {sub.evaluation.scores.overallGrade} / 10
                      </span>
                    )}

                    {(isPublished || role !== 'student') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/corrections/${sub.id}`)}
                        className="text-xs py-1"
                      >
                        Ver Detalle
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
