import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { mockSubmissionService } from '../../services/mockSubmissionService';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';
import { CEFRBadge } from '../../components/ui/Badge';
import { AIProcessingOverlay } from '../../components/ui/LoadingSpinner';
import { 
  PenTool, 
  Save, 
  Send, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  BookOpen,
  HelpCircle
} from 'lucide-react';

export const VirtualWritingEditor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedAsgId = searchParams.get('asgId') || '';
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();
  const { assignments, courses, reloadAll } = useData();
  const { showToast } = useToast();

  const enrolledCourseIds = courses.filter(c => c.studentIds.includes(currentUser?.id || '')).map(c => c.id);
  const studentAssignments = assignments.filter(a => enrolledCourseIds.includes(a.courseId) || role !== 'student');

  const [assignmentId, setAssignmentId] = useState(preselectedAsgId || (studentAssignments[0]?.id || ''));
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdSubmissionId, setCreatedSubmissionId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const selectedAssignment = assignments.find(a => a.id === assignmentId);

  // Load draft from localStorage if present
  useEffect(() => {
    if (assignmentId && currentUser) {
      const draftKey = `draft_${currentUser.id}_${assignmentId}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        setText(savedDraft);
        setLastSaved('Borrador recuperado de la memoria');
      } else {
        // Sample default essay text for testing conveniency
        setText(`In recent years, remote working has emerged as one of the most prominent workplace transformations globally. While there are undeniable advantages for many employees, several drawbacks should also be taken into consideration.

To begin with, working from home provides exceptional flexibility and eliminates the stress of daily commuting. Employees save significant amounts of time, allowing them to balance family commitments and personal well-being more effectively. Furthermore, companies can reduce office expenses and tap into a wider talent pool.

On the other hand, remote workers frequently face feelings of isolation. When communication occurs solely through virtual meetings and emails, building genuine team synergy becomes more challenging. Moreover, the boundary between professional obligations and personal life often blurs, potentially leading to burnout.

In conclusion, although remote working presents clear communication hurdles, I believe a hybrid approach offers the optimal balance for modern organizations.`);
        setLastSaved(null);
      }
    }
  }, [assignmentId, currentUser]);

  // Word count calculation
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = text.trim() === '' ? 0 : words.length;

  const min = selectedAssignment?.minWords || 140;
  const max = selectedAssignment?.maxWords || 190;
  const isWithinRange = wordCount >= min && wordCount <= max;
  const isBelowMin = wordCount < min;
  const isAboveMax = wordCount > max;

  const handleSaveDraft = () => {
    if (assignmentId && currentUser) {
      const draftKey = `draft_${currentUser.id}_${assignmentId}`;
      localStorage.setItem(draftKey, text);
      setLastSaved(new Date().toLocaleTimeString());
      showToast('info', 'Borrador Guardado', 'Tu texto se ha guardado localmente en este navegador.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      showToast('error', 'Texto Vacío', 'Por favor escribe tu redacción antes de enviar.');
      return;
    }

    if (!currentUser) return;

    // Create submission
    const newSub = mockSubmissionService.submitWriting({
      assignmentId,
      studentId: currentUser.id,
      submissionType: 'virtual',
      text,
    });

    // Clean up draft
    localStorage.removeItem(`draft_${currentUser.id}_${assignmentId}`);

    setCreatedSubmissionId(newSub.id);
    setIsProcessing(true);
  };

  const handleProcessingComplete = async () => {
    if (createdSubmissionId) {
      await mockSubmissionService.processWithAI(createdSubmissionId);
      reloadAll();
      setIsProcessing(false);
      showToast('success', 'Redacción Enviada', 'Tu entrega fue recibida y el motor de IA ha preparado la corrección para tu docente.');
      navigate('/dashboard');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Redacción Virtual en Línea
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Editor de texto integrado con contador de palabras y revisión inteligente
            </p>
          </div>
        </div>

        {/* Assignment selector dropdown */}
        <div className="min-w-[240px]">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Seleccionar Consigna:
          </label>
          <select
            value={assignmentId}
            onChange={e => setAssignmentId(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 font-medium"
          >
            {studentAssignments.map(a => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.cefrLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Assignment Prompt and Rubric (Reference) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          {selectedAssignment ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <CEFRBadge level={selectedAssignment.cefrLevel} />
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  {selectedAssignment.writingType}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedAssignment.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedAssignment.courseName}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Instrucciones de la Actividad:
                </span>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans max-h-60 overflow-y-auto">
                  {selectedAssignment.instructions}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Extensión requerida:</span>
                  <span className="font-bold text-slate-800">{min} - {max} palabras</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Fecha de entrega:</span>
                  <span className="font-semibold text-slate-800">{new Date(selectedAssignment.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400">Selecciona una actividad para ver las instrucciones.</p>
          )}
        </div>

        {/* Right 2 Columns: Text Editor Canvas */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            {/* Editor Top Bar: Live Word Count & Draft Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  Palabras: <span className={isWithinRange ? 'text-teal-600 text-sm' : isBelowMin ? 'text-amber-600' : 'text-rose-600'}>{wordCount}</span> / {min}-{max}
                </span>
                {isWithinRange && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Rango óptimo ✓
                  </span>
                )}
                {isBelowMin && (
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Faltan {min - wordCount} palabras
                  </span>
                )}
                {isAboveMax && (
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                    Excedido por {wordCount - max} palabras
                  </span>
                )}
              </div>

              {lastSaved && (
                <span className="text-[10px] text-slate-400">
                  Guardado: {lastSaved}
                </span>
              )}
            </div>

            {/* Writing Textarea */}
            <textarea
              rows={16}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Escribe tu redacción en inglés aquí..."
              className="w-full p-4 text-sm font-sans text-slate-800 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/40 focus:bg-white resize-y leading-relaxed transition-all"
            />
          </div>

          {/* Action Footer: Save Draft & Submit */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              icon={<Save className="w-4 h-4 text-slate-500" />}
            >
              Guardar Borrador
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSubmit}
              className="font-bold bg-teal-600 hover:bg-teal-700 shadow-sm"
              icon={<Send className="w-4 h-4 text-teal-200" />}
            >
              Entregar Redacción
            </Button>
          </div>
        </div>

      </div>

      {/* AI Processing Animation Overlay */}
      <AIProcessingOverlay
        isOpen={isProcessing}
        onComplete={handleProcessingComplete}
      />
    </div>
  );
};
